"use strict";

const assert = require("node:assert/strict");
const storage = require("../storage-normalizers.js");
const { scriptSource, compileFunctions } = require("./script-harness.js");

const TODAY = "2026-08-21";
let scenarios = 0;

function test(name, callback) {
    try {
        callback();
        scenarios++;
    } catch (error) {
        error.message = `${name}: ${error.message}`;
        throw error;
    }
}

const emptyMode = extra => ({ started: false, completed: false, outcome: null, ...extra });
const emptyDay = () => ({
    classic: emptyMode({ attempts: 0 }),
    photo: emptyMode({ attempts: 0 }),
    moreLess: emptyMode({ hits: 0, rounds: 0 }),
    lineup: emptyMode({ phase: null, resolved: 0, total: 3, errors: 0, exactScore: null }),
    complete: false,
    completionCelebrated: false
});
const completedModes = [
    { started: true, completed: true, outcome: "won", attempts: 1 },
    { started: true, completed: true, outcome: "won", attempts: 2 },
    { started: true, completed: true, outcome: "won", hits: 7, rounds: 10 },
    { started: true, completed: true, outcome: "won", phase: "completed", resolved: 3, total: 3, errors: 0, exactScore: false }
];

function dayWithCompleted(count) {
    const day = emptyDay();
    const keys = ["classic", "photo", "moreLess", "lineup"];
    for (let index = 0; index < count; index++) day[keys[index]] = { ...completedModes[index] };
    return day;
}

const calendar = compileFunctions([
    "calcularProgressoDoResumo", "componentesDataCivil", "criarDataCivilString",
    "compararDatasCivis", "diasNoMesCivil", "deslocamentoPrimeiraSemanaCivil",
    "moverMesCivil", "compararMesesCivis", "obterLimitesMesesHistorico",
    "limitarMesAoHistorico", "obterNavegacaoMesHistorico", "obterEstadoDiaHistorico",
    "obterResumoHistoricoDia", "gerarGradeMensalHistorico"
], {
    dataHistoricoValida: storage.validDate,
    getDataLocalString: () => TODAY,
    criarResumoDiaVazio: emptyDay
});

function normalized(days = {}, trackingStartedAt) {
    const value = { version: 1, days };
    if (trackingStartedAt !== undefined) value.trackingStartedAt = trackingStartedAt;
    return storage.normalizeHistory(value, 1, TODAY);
}

// Metadata e migração.
test("histórico vazio usa a data local informada", () => {
    assert.deepEqual(storage.normalizeHistory(null, 1, TODAY), {
        version: 1, trackingStartedAt: TODAY, days: {}
    });
});
test("primeira carga sem chave persiste trackingStartedAt uma única vez", () => {
    let persisted = null;
    const api = compileFunctions(["carregarHistorico"], {
        CHAVE_HISTORICO: "timaodle_history_v1",
        VERSAO_HISTORICO: 1,
        lerJsonLocalStorage: () => null,
        NormalizadoresStorage: storage,
        getDataLocalString: () => TODAY,
        salvarHistorico: value => { persisted = value; },
        persistirNormalizacaoSegura: () => { throw new Error("não deveria normalizar chave ausente por esta rota"); }
    });
    const loaded = api.carregarHistorico();
    assert.equal(loaded.trackingStartedAt, TODAY);
    assert.deepEqual(persisted, loaded);
});
test("tracking válido é preservado exatamente", () => {
    assert.equal(normalized({ "2026-08-10": dayWithCompleted(1) }, "2026-07-15").trackingStartedAt, "2026-07-15");
});
test("tracking ausente migra pela menor data válida", () => {
    assert.equal(normalized({ "2026-08-10": emptyDay(), "2026-08-03": emptyDay() }).trackingStartedAt, "2026-08-03");
});
test("tracking inválido migra pela menor data válida", () => {
    assert.equal(normalized({ "2026-08-10": emptyDay(), "2026-08-03": emptyDay() }, "2026-02-31").trackingStartedAt, "2026-08-03");
});
test("tracking inválido em histórico vazio usa hoje", () => {
    assert.equal(normalized({}, "inválido").trackingStartedAt, TODAY);
});
test("tracking nunca avança ao normalizar novamente", () => {
    const first = normalized({ "2026-08-03": emptyDay(), "2026-08-10": emptyDay() });
    const again = storage.normalizeHistory({ ...first, days: { "2026-08-10": first.days["2026-08-10"] } }, 1, TODAY);
    assert.equal(again.trackingStartedAt, "2026-08-03");
});
test("normalização é idempotente", () => {
    const history = normalized({ "2026-08-03": dayWithCompleted(4) });
    assert.deepEqual(storage.normalizeHistory(history, 1, TODAY), history);
});
test("histórico malformado é recuperado sem dias artificiais", () => {
    const history = storage.normalizeHistory({ version: 1, trackingStartedAt: "x", days: {
        "2026-02-31": dayWithCompleted(4), "2026-08-20": "quebrado"
    } }, 1, TODAY);
    assert.deepEqual(history, { version: 1, trackingStartedAt: TODAY, days: {} });
});
test("completionCelebrated continua preservado", () => {
    const history = normalized({ "2026-08-20": { ...dayWithCompleted(4), completionCelebrated: true } });
    assert.equal(history.days["2026-08-20"].completionCelebrated, true);
});
test("zeros válidos continuam presentes", () => {
    const history = normalized({ "2026-08-20": {
        ...dayWithCompleted(4),
        moreLess: { ...completedModes[2], hits: 0, outcome: "lost" },
        lineup: { ...completedModes[3], errors: 0 }
    } });
    assert.equal(history.days["2026-08-20"].moreLess.hits, 0);
    assert.equal(history.days["2026-08-20"].lineup.errors, 0);
});

// Datas civis e grade mensal.
test("fevereiro de 2025 possui 28 dias", () => assert.equal(calendar.diasNoMesCivil(2025, 2), 28));
test("fevereiro de 2028 possui 29 dias", () => assert.equal(calendar.diasNoMesCivil(2028, 2), 29));
test("mês começando segunda usa deslocamento zero", () => assert.equal(calendar.deslocamentoPrimeiraSemanaCivil(2026, 6), 0));
test("mês começando domingo usa a última coluna", () => assert.equal(calendar.deslocamentoPrimeiraSemanaCivil(2026, 2), 6));
test("semana civil começa na segunda-feira", () => {
    assert.equal(calendar.gerarGradeMensalHistorico(2026, 6, normalized({}, "2026-01-01"), TODAY).firstWeekOffset, 0);
});
test("dezembro avança para janeiro", () => assert.deepEqual(calendar.moverMesCivil(2026, 12, 1), { year: 2027, month: 1 }));
test("janeiro retorna para dezembro anterior", () => assert.deepEqual(calendar.moverMesCivil(2026, 1, -1), { year: 2025, month: 12 }));
test("virada de ano preserva comparação civil", () => {
    assert.equal(calendar.compararDatasCivis("2025-12-31", "2026-01-01"), -1);
});
test("grade retorna somente dados e todos os dias do mês", () => {
    const grid = calendar.gerarGradeMensalHistorico(2026, 8, normalized({}, "2026-08-01"), TODAY);
    assert.equal(grid.daysInMonth, 31);
    assert.equal(grid.days.length, 31);
    assert.equal(grid.days[0].date, "2026-08-01");
    assert.equal(grid.days[30].date, "2026-08-31");
    assert.equal("outerHTML" in grid, false);
});
test("helpers não fazem parsing ISO ingênuo", () => {
    assert.doesNotMatch(scriptSource, /new Date\(\s*data(?:A|B)?\s*\)/);
    assert.equal(calendar.criarDataCivilString(2026, 3, 8), "2026-03-08");
    assert.deepEqual(calendar.moverMesCivil(2026, 3, 0), { year: 2026, month: 3 });
});

// Estados dos dias.
const stateDays = {
    "2026-08-01": emptyDay(),
    "2026-08-02": { ...emptyDay(), classic: { started: true, completed: false, outcome: null, attempts: 2 } },
    "2026-08-03": dayWithCompleted(1),
    "2026-08-04": dayWithCompleted(2),
    "2026-08-05": dayWithCompleted(3),
    "2026-08-06": dayWithCompleted(4),
    "2026-08-21": dayWithCompleted(2)
};
const stateHistory = normalized(stateDays, "2026-08-01");

test("futuro é independente de registro", () => {
    const state = calendar.obterEstadoDiaHistorico("2026-08-22", stateHistory, TODAY);
    assert.equal(state.isFuture, true);
    assert.equal(state.state, "future");
});
test("dia anterior ao tracking é identificado", () => {
    const state = calendar.obterEstadoDiaHistorico("2026-07-31", stateHistory, TODAY);
    assert.equal(state.isBeforeTracking, true);
    assert.equal(state.state, "before-tracking");
});
test("dia sem registro é neutro", () => {
    const state = calendar.obterEstadoDiaHistorico("2026-08-10", stateHistory, TODAY);
    assert.equal(state.hasRecord, false);
    assert.equal(state.state, "no-record");
});
test("registro 0/4 sem modo iniciado é distinto", () => {
    const state = calendar.obterEstadoDiaHistorico("2026-08-01", stateHistory, TODAY);
    assert.deepEqual([state.hasRecord, state.startedCount, state.completedCount, state.state], [true, 0, 0, "recorded"]);
});
test("iniciado 0/4 é distinto", () => {
    const state = calendar.obterEstadoDiaHistorico("2026-08-02", stateHistory, TODAY);
    assert.deepEqual([state.startedCount, state.completedCount, state.state], [1, 0, "started"]);
});
for (let completed = 1; completed <= 3; completed++) {
    test(`${completed}/4 é parcial`, () => {
        const state = calendar.obterEstadoDiaHistorico(`2026-08-0${completed + 2}`, stateHistory, TODAY);
        assert.equal(state.completedCount, completed);
        assert.equal(state.complete, false);
        assert.equal(state.state, "partial");
    });
}
test("4/4 é completo", () => {
    const state = calendar.obterEstadoDiaHistorico("2026-08-06", stateHistory, TODAY);
    assert.equal(state.completedCount, 4);
    assert.equal(state.complete, true);
    assert.equal(state.state, "complete");
});
test("today + partial coexistem", () => {
    const state = calendar.obterEstadoDiaHistorico(TODAY, stateHistory, TODAY);
    assert.equal(state.isToday, true);
    assert.equal(state.state, "partial");
});
test("today + complete coexistem", () => {
    const history = normalized({ [TODAY]: dayWithCompleted(4) }, "2026-08-01");
    const state = calendar.obterEstadoDiaHistorico(TODAY, history, TODAY);
    assert.equal(state.isToday, true);
    assert.equal(state.complete, true);
});
test("consulta da grade não altera histórico nem celebração", () => {
    const history = normalized({ "2026-08-06": { ...dayWithCompleted(4), completionCelebrated: true } }, "2026-08-01");
    const before = JSON.stringify(history);
    calendar.gerarGradeMensalHistorico(2026, 8, history, TODAY);
    assert.equal(JSON.stringify(history), before);
});

// Limites e navegação.
const navigationHistory = normalized({}, "2026-06-15");
test("primeiro mês vem de trackingStartedAt", () => {
    assert.deepEqual(calendar.obterLimitesMesesHistorico(navigationHistory, TODAY).firstMonth, { year: 2026, month: 6 });
});
test("mês atual é o limite superior", () => {
    assert.deepEqual(calendar.obterLimitesMesesHistorico(navigationHistory, TODAY).currentMonth, { year: 2026, month: 8 });
});
test("mês intermediário navega nos dois sentidos", () => {
    const nav = calendar.obterNavegacaoMesHistorico(2026, 7, navigationHistory, TODAY);
    assert.equal(nav.canGoPrevious, true);
    assert.equal(nav.canGoNext, true);
});
test("primeiro mês bloqueia navegação anterior", () => {
    const nav = calendar.obterNavegacaoMesHistorico(2026, 6, navigationHistory, TODAY);
    assert.equal(nav.canGoPrevious, false);
    assert.equal(nav.previousMonth, null);
});
test("mês atual bloqueia próximo mês", () => {
    const nav = calendar.obterNavegacaoMesHistorico(2026, 8, navigationHistory, TODAY);
    assert.equal(nav.canGoNext, false);
    assert.equal(nav.nextMonth, null);
});
test("pedido futuro é limitado ao mês atual", () => {
    assert.deepEqual(calendar.limitarMesAoHistorico(2027, 1, navigationHistory, TODAY), { year: 2026, month: 8 });
});
test("pedido anterior é limitado ao primeiro mês", () => {
    assert.deepEqual(calendar.limitarMesAoHistorico(2025, 1, navigationHistory, TODAY), { year: 2026, month: 6 });
});

// Resumo seguro do dia selecionado.
function summaryFromDay(day) {
    const history = day === undefined ? normalized({}, "2026-08-01") : normalized({ [TODAY]: day }, "2026-08-01");
    return calendar.obterResumoHistoricoDia(TODAY, history);
}

test("resumo Clássico não iniciado", () => assert.equal(summaryFromDay(emptyDay()).classic.statusText, "Não iniciado"));
test("resumo Clássico em andamento com singular", () => {
    const day = emptyDay();
    day.classic = { started: true, completed: false, outcome: null, attempts: 1 };
    assert.equal(summaryFromDay(day).classic.statusText, "Em andamento · 1 tentativa");
});
test("resumo Clássico em andamento com plural", () => {
    const day = emptyDay();
    day.classic = { started: true, completed: false, outcome: null, attempts: 3 };
    assert.equal(summaryFromDay(day).classic.statusText, "Em andamento · 3 tentativas");
});
test("resumo Clássico concluído", () => assert.equal(summaryFromDay(dayWithCompleted(1)).classic.statusText, "Concluído · 1 tentativa"));

test("resumo Foto não iniciado", () => assert.equal(summaryFromDay(emptyDay()).photo.statusText, "Não iniciado"));
test("resumo Foto em andamento", () => {
    const day = emptyDay();
    day.photo = { started: true, completed: false, outcome: null, attempts: 3 };
    assert.equal(summaryFromDay(day).photo.statusText, "Em andamento · 3/6");
});
test("resumo Foto com vitória", () => {
    const day = emptyDay();
    day.photo = { started: true, completed: true, outcome: "won", attempts: 4 };
    assert.equal(summaryFromDay(day).photo.statusText, "Vitória · 4/6");
});
test("resumo Foto com derrota", () => {
    const day = emptyDay();
    day.photo = { started: true, completed: true, outcome: "lost", attempts: 6 };
    assert.equal(summaryFromDay(day).photo.statusText, "Derrota · 6/6");
});

test("resumo MM não iniciado", () => assert.equal(summaryFromDay(emptyDay()).moreLess.statusText, "Não iniciado"));
test("resumo MM em andamento com singular", () => {
    const day = emptyDay();
    day.moreLess = { started: true, completed: false, outcome: null, rounds: 1, hits: 1 };
    assert.equal(summaryFromDay(day).moreLess.statusText, "Em andamento · 1 rodada · 1 acerto");
});
test("resumo MM em andamento com plural", () => {
    const day = emptyDay();
    day.moreLess = { started: true, completed: false, outcome: null, rounds: 5, hits: 3 };
    assert.equal(summaryFromDay(day).moreLess.statusText, "Em andamento · 5 rodadas · 3 acertos");
});
test("resumo MM com vitória", () => {
    const day = emptyDay();
    day.moreLess = { started: true, completed: true, outcome: "won", rounds: 10, hits: 8 };
    assert.equal(summaryFromDay(day).moreLess.statusText, "Vitória · 8/10");
});
test("resumo MM com derrota", () => {
    const day = emptyDay();
    day.moreLess = { started: true, completed: true, outcome: "lost", rounds: 10, hits: 6 };
    assert.equal(summaryFromDay(day).moreLess.statusText, "Derrota · 6/10");
});
test("resumo MM preserva zero acertos", () => {
    const day = emptyDay();
    day.moreLess = { started: true, completed: true, outcome: "lost", rounds: 10, hits: 0 };
    const summary = summaryFromDay(day);
    assert.equal(summary.moreLess.hits, 0);
    assert.equal(summary.moreLess.statusText, "Derrota · 0/10");
});

test("resumo Onze não iniciado", () => assert.equal(summaryFromDay(emptyDay()).lineup.statusText, "Não iniciado"));
test("resumo Onze na fase do placar", () => {
    const day = emptyDay();
    day.lineup = { started: true, completed: false, outcome: null, phase: "score", resolved: 0, total: 3, errors: 0, exactScore: null };
    assert.equal(summaryFromDay(day).lineup.statusText, "Fase do placar");
});
for (const resolved of [1, 2]) {
    test(`resumo Onze com ${resolved}/3 resolvidos`, () => {
        const day = emptyDay();
        day.lineup = { started: true, completed: false, outcome: null, phase: "lineup", resolved, total: 3, errors: 0, exactScore: null };
        assert.equal(summaryFromDay(day).lineup.statusText, `Escalação · ${resolved}/3`);
    });
}
test("resumo Onze concluído com zero erros", () => assert.equal(summaryFromDay(dayWithCompleted(4)).lineup.statusText, "Concluído · 3/3 · 0 erros"));
test("resumo Onze concluído com um erro", () => {
    const day = dayWithCompleted(4);
    day.lineup.errors = 1;
    assert.equal(summaryFromDay(day).lineup.statusText, "Concluído · 3/3 · 1 erro");
});
test("resumo Onze concluído com múltiplos erros", () => {
    const day = dayWithCompleted(4);
    day.lineup.errors = 4;
    assert.equal(summaryFromDay(day).lineup.statusText, "Concluído · 3/3 · 4 erros");
});
test("resumo Onze preserva somente placar exato positivo", () => {
    const day = dayWithCompleted(4);
    day.lineup.exactScore = true;
    assert.equal(summaryFromDay(day).lineup.exactScore, true);
});

test("resumo geral sem registro", () => {
    const summary = summaryFromDay(undefined);
    assert.equal(summary.hasRecord, false);
    assert.equal(summary.completedCount, 0);
});
for (let completed = 0; completed <= 4; completed++) {
    test(`resumo geral registrado ${completed}/4`, () => {
        const summary = summaryFromDay(dayWithCompleted(completed));
        assert.equal(summary.hasRecord, true);
        assert.equal(summary.completedCount, completed);
        assert.equal(summary.complete, completed === 4);
    });
}

test("resumo histórico bloqueia todos os marcadores de spoiler", () => {
    const markers = [
        "SEGREDO_CLASSICO_HIST", "SEGREDO_FOTO_HIST", "SEGREDO_MM_HIST",
        "SEGREDO_LINEUP_HIST", "PLACAR_SECRETO_HIST", "PALPITE_SECRETO_HIST",
        "CONFRONTO_SECRETO_HIST", "MAIS_MENOS_SECRETO_HIST", "JOGOS_SECRETOS_HIST"
    ];
    const contaminated = {
        version: 1,
        trackingStartedAt: TODAY,
        days: {
            [TODAY]: {
                ...dayWithCompleted(4),
                classic: { ...completedModes[0], secretName: markers[0], guesses: [markers[0]] },
                photo: { ...completedModes[1], secretName: markers[1] },
                moreLess: { ...completedModes[2], sequence: [markers[2]], answers: [markers[7]], games: markers[8] },
                lineup: { ...completedModes[3], hiddenPlayers: [markers[3]], score: markers[4], guess: markers[5], match: markers[6] }
            }
        }
    };
    const summary = calendar.obterResumoHistoricoDia(TODAY, contaminated);
    const renderedText = [
        summary.classic.statusText, summary.photo.statusText,
        summary.moreLess.statusText, summary.lineup.statusText
    ].join(" ");
    const serialized = JSON.stringify(summary);
    for (const marker of markers) {
        assert.equal(serialized.includes(marker), false, marker);
        assert.equal(renderedText.includes(marker), false, marker);
    }
});

console.log(`history-calendar.test.js: ${scenarios} cenários aprovados`);
