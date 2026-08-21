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
    "gerarGradeMensalHistorico"
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

console.log(`history-calendar.test.js: ${scenarios} cenários aprovados`);
