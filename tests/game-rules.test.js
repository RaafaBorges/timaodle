"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const storage = require("../storage-normalizers.js");
const { scriptSource, compileFunctions } = require("./script-harness.js");

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

const emptyMode = (extra = {}) => ({ started: false, completed: false, outcome: null, ...extra });
const classic = (attempts = 1, completed = true) => ({ started: true, completed, outcome: completed ? "won" : null, attempts });
const photo = (outcome = "won", attempts = 1) => ({ started: true, completed: true, outcome, attempts });
const moreLess = (hits = 7) => ({ started: true, completed: true, outcome: hits >= 7 ? "won" : "lost", hits, rounds: 10 });
const lineup = (errors = 0, exactScore = false) => ({
    started: true, completed: true, outcome: "won", phase: "completed",
    resolved: 3, total: 3, errors, exactScore
});
const completeDay = (overrides = {}) => ({
    classic: classic(), photo: photo(), moreLess: moreLess(), lineup: lineup(),
    complete: true, completionCelebrated: false, ...overrides
});
const emptyDay = () => ({
    classic: emptyMode({ attempts: 0 }),
    photo: emptyMode({ attempts: 0 }),
    moreLess: emptyMode({ hits: 0, rounds: 0 }),
    lineup: emptyMode({ phase: null, resolved: 0, total: 3, errors: 0, exactScore: null }),
    complete: false, completionCelebrated: false
});
const normalizedHistory = days => storage.normalizeHistory({ version: 1, days });

function historyApi(history) {
    return compileFunctions([
        "calcularProgressoDoResumo", "indiceDiaCivil", "obterProgressoDiario",
        "obterStreakGeral", "mediaHistorica", "percentualHistorico",
        "numeroHistoricoValido", "obterEstatisticasIntegradas"
    ], {
        dataHistoricoValida: storage.validDate,
        carregarHistorico: () => history,
        criarResumoDiaVazio: emptyDay,
        getDataLocalString: () => "2026-08-21"
    });
}

function assertStreak(days, reference, expected) {
    const history = normalizedHistory(days);
    assert.deepEqual(historyApi(history).obterStreakGeral(reference), expected);
}

// STREAK — A–M, usando índice civil UTC apenas como aritmética de calendário.
test("streak A: histórico vazio", () => assertStreak({}, "2026-08-21", {
    current: 0, best: 0, totalCompleteDays: 0, lastCompleteDate: null
}));
test("streak B: hoje completo", () => assertStreak({ "2026-08-21": completeDay() }, "2026-08-21", {
    current: 1, best: 1, totalCompleteDays: 1, lastCompleteDate: "2026-08-21"
}));
test("streak C: ontem completo e hoje aberto", () => assertStreak({ "2026-08-20": completeDay() }, "2026-08-21", {
    current: 1, best: 1, totalCompleteDays: 1, lastCompleteDate: "2026-08-20"
}));
test("streak D: ontem e hoje completos", () => assertStreak({ "2026-08-20": completeDay(), "2026-08-21": completeDay() }, "2026-08-21", {
    current: 2, best: 2, totalCompleteDays: 2, lastCompleteDate: "2026-08-21"
}));
test("streak E: três dias consecutivos", () => assertStreak({
    "2026-08-19": completeDay(), "2026-08-20": completeDay(), "2026-08-21": completeDay()
}, "2026-08-21", { current: 3, best: 3, totalCompleteDays: 3, lastCompleteDate: "2026-08-21" }));
test("streak F: dia perdido quebra", () => assertStreak({ "2026-08-18": completeDay(), "2026-08-20": completeDay() }, "2026-08-21", {
    current: 1, best: 1, totalCompleteDays: 2, lastCompleteDate: "2026-08-20"
}));
test("streak G: recorde antigo maior", () => assertStreak({
    "2026-08-10": completeDay(), "2026-08-11": completeDay(), "2026-08-12": completeDay(),
    "2026-08-20": completeDay(), "2026-08-21": completeDay()
}, "2026-08-21", { current: 2, best: 3, totalCompleteDays: 5, lastCompleteDate: "2026-08-21" }));
test("streak H: reinício após quebra", () => assertStreak({
    "2026-08-15": completeDay(), "2026-08-16": completeDay(), "2026-08-21": completeDay()
}, "2026-08-21", { current: 1, best: 2, totalCompleteDays: 3, lastCompleteDate: "2026-08-21" }));
test("streak I: virada de mês", () => assertStreak({ "2026-07-31": completeDay(), "2026-08-01": completeDay() }, "2026-08-01", {
    current: 2, best: 2, totalCompleteDays: 2, lastCompleteDate: "2026-08-01"
}));
test("streak J: virada de ano", () => assertStreak({ "2025-12-31": completeDay(), "2026-01-01": completeDay() }, "2026-01-01", {
    current: 2, best: 2, totalCompleteDays: 2, lastCompleteDate: "2026-01-01"
}));
test("streak K: ano bissexto", () => assertStreak({ "2028-02-28": completeDay(), "2028-02-29": completeDay(), "2028-03-01": completeDay() }, "2028-03-01", {
    current: 3, best: 3, totalCompleteDays: 3, lastCompleteDate: "2028-03-01"
}));
test("streak L: histórico malformado é normalizado", () => {
    const history = storage.normalizeHistory({ version: 1, days: {
        "2026-08-19": "quebrado", "2026-02-30": completeDay(), "2026-08-20": completeDay()
    }});
    assert.deepEqual(historyApi(history).obterStreakGeral("2026-08-21"), {
        current: 1, best: 1, totalCompleteDays: 1, lastCompleteDate: "2026-08-20"
    });
});
test("streak M: dias fora de ordem", () => assertStreak({
    "2026-08-21": completeDay(), "2026-08-19": completeDay(), "2026-08-20": completeDay()
}, "2026-08-21", { current: 3, best: 3, totalCompleteDays: 3, lastCompleteDate: "2026-08-21" }));

// PROGRESSO DIÁRIO.
for (let completed = 0; completed <= 4; completed++) {
    test(`progresso ${completed}/4`, () => {
        const day = emptyDay();
        const names = ["classic", "photo", "moreLess", "lineup"];
        const values = [classic(), photo(), moreLess(), lineup()];
        for (let index = 0; index < completed; index++) day[names[index]] = values[index];
        const progress = historyApi(normalizedHistory({ "2026-08-21": day })).obterProgressoDiario("2026-08-21");
        assert.equal(progress.completed, completed);
        assert.equal(progress.progress, `${completed}/4`);
        assert.equal(progress.complete, completed === 4);
    });
}
test("progresso: iniciado não é concluído", () => {
    const day = emptyDay();
    day.photo = { started: true, completed: false, outcome: null, attempts: 2 };
    const progress = historyApi(normalizedHistory({ "2026-08-21": day })).obterProgressoDiario("2026-08-21");
    assert.equal(progress.started, 1);
    assert.equal(progress.completed, 0);
});
test("progresso: derrota e vitória contam como conclusão", () => {
    const day = completeDay({ photo: photo("lost", 6), moreLess: moreLess(6) });
    const progress = historyApi(normalizedHistory({ "2026-08-21": day })).obterProgressoDiario("2026-08-21");
    assert.equal(progress.complete, true);
    assert.equal(progress.completed, 4);
    assert.equal(progress.modes.photo.outcome, "lost");
    assert.equal(progress.modes.moreLess.outcome, "lost");
});
test("progresso: histórico ausente retorna 0/4", () => {
    const progress = historyApi(normalizedHistory({})).obterProgressoDiario("2026-08-21");
    assert.equal(progress.progress, "0/4");
    assert.equal(progress.complete, false);
});

// MAIS OU MENOS v2 — código real e pool real elegível no momento do teste.
const players = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "jogadores.json"), "utf8"));
const photoNames = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "fotos-manifest.json"), "utf8")));
const mmPool = players.filter(player => photoNames.has(player.nome)
    && Object.prototype.hasOwnProperty.call(player, "jogos")
    && typeof player.jogos === "number" && Number.isFinite(player.jogos));
const mmApi = compileFunctions([
    "hashString", "gerarPRNG", "embaralharComRngMM", "maiorSequenciaIgualMM",
    "maiorSequenciaAlternadaMM", "gerarPlanoDirecoesMM", "direcaoComparacaoMM",
    "dificuldadeComparacaoMM", "atendeDificuldadeExpandidaMM",
    "construirSequenciaExataMM", "construirSequenciaComFallbackMM", "gerarDesafioMMV2"
], {
    CAMPO_STAT_MM: "jogos",
    RODADAS_MM: 10,
    PLANO_DIFICULDADES_MM: ["facil", "facil", "facil", "media", "media", "media", "media", "dificil", "dificil", "dificil"],
    jogadoresElegiveisMM: () => mmPool
});

function isoDateFromOffset(offset) {
    return new Date(Date.UTC(2026, 0, 1 + offset)).toISOString().slice(0, 10);
}

const MM_DATES = 180;
test(`MM v2: invariantes em ${MM_DATES} datas`, () => {
    const signatures = new Set();
    for (let offset = 0; offset < MM_DATES; offset++) {
        const date = isoDateFromOffset(offset);
        const challenge = mmApi.gerarDesafioMMV2(date);
        const again = mmApi.gerarDesafioMMV2(date);
        const names = challenge.sequencia.map(player => player.nome);
        const directions = [];
        const difficulties = [];
        assert.equal(challenge.sequencia.length, 11, date);
        assert.equal(new Set(names).size, 11, date);
        assert.deepEqual(again.sequencia.map(player => player.nome), names, `${date}: determinismo`);
        for (let round = 0; round < 10; round++) {
            const reference = challenge.sequencia[round];
            const candidate = challenge.sequencia[round + 1];
            assert.equal(Number.isFinite(reference.jogos), true, date);
            assert.equal(Number.isFinite(candidate.jogos), true, date);
            const direction = mmApi.direcaoComparacaoMM(reference, candidate);
            assert.notEqual(direction, "empate", date);
            directions.push(direction);
            difficulties.push(mmApi.dificuldadeComparacaoMM(reference, candidate));
        }
        assert.deepEqual(difficulties.reduce((counts, item) => ({ ...counts, [item]: counts[item] + 1 }), {
            facil: 0, media: 0, dificil: 0
        }), { facil: 3, media: 4, dificil: 3 }, `${date}: plano 3/4/3`);
        assert.deepEqual(difficulties, challenge.planoDificuldades, `${date}: dificuldades realizadas seguem o plano`);
        assert.deepEqual(directions, challenge.planoDirecoes, `${date}: respostas realizadas seguem o plano`);
        assert.deepEqual(challenge.fallbacks, Array(10).fill(0), `${date}: plano exato sem fallback`);
        const more = directions.filter(direction => direction === "mais").length;
        assert.ok(more >= 4 && more <= 6, `${date}: equilíbrio MAIS/MENOS`);
        assert.ok(mmApi.maiorSequenciaIgualMM(directions) <= 3, `${date}: repetição consecutiva`);
        assert.ok(mmApi.maiorSequenciaAlternadaMM(directions) <= 4, `${date}: alternância consecutiva`);
        signatures.add(names.join("|"));
    }
    assert.ok(signatures.size >= Math.floor(MM_DATES * 0.9), "datas diferentes devem gerar variedade razoável");
});
test("MM v2: seed explícita permanece data + -mm-v2", () => {
    assert.match(scriptSource, /hashString\(dataStr \+ "-mm-v2"\)/);
});

// RESULTADO E LIMITES DO MM.
const snapshots = Array.from({ length: 11 }, (_, index) => ({ nome: `P${index}`, jogos: index + 1 }));
function normalizedMm(hits, round = 10) {
    return storage.normalizeMoreLess({
        data: "2026-08-21", versaoAlgoritmo: 2, rodadaAtual: round, acertos: hits,
        sequenciaJogadores: snapshots, sequenciaNomes: snapshots.map(player => player.nome), historico: []
    });
}
for (const [hits, expected] of [[0, "lost"], [6, "lost"], [7, "won"], [10, "won"]]) {
    test(`MM resultado: ${hits}/10 = ${expected}`, () => assert.equal(normalizedMm(hits).status, expected));
}
test("MM resultado: normalização limita hits e rodada", () => {
    const result = normalizedMm(99, 99);
    assert.equal(result.rodadaAtual, 10);
    assert.equal(result.acertos, 10);
    assert.equal(result.status, "won");
});
test("MM resultado: só conclui após a décima", () => {
    assert.equal(normalizedMm(7, 9).status, "playing");
    assert.equal(normalizedMm(7, 10).status, "won");
});

// ESTATÍSTICAS INTEGRADAS.
function assertFinitePercentages(value, key = "root") {
    if (typeof value === "number") {
        assert.equal(Number.isFinite(value), true, `${key} deve ser finito`);
        return;
    }
    if (!value || typeof value !== "object") return;
    for (const [childKey, childValue] of Object.entries(value)) {
        assertFinitePercentages(childValue, `${key}.${childKey}`);
        if (/rate/i.test(childKey)) assert.ok(childValue >= 0 && childValue <= 100, `${key}.${childKey}`);
    }
}
test("estatísticas: histórico vazio", () => {
    const stats = historyApi(normalizedHistory({})).obterEstatisticasIntegradas("2026-08-21");
    assert.equal(stats.geral.registeredDays, 0);
    assert.equal(stats.geral.completeDayRate, 0);
    assertFinitePercentages(stats);
});
test("estatísticas: dia parcial", () => {
    const day = emptyDay();
    day.classic = classic(2, false);
    const stats = historyApi(normalizedHistory({ "2026-08-21": day })).obterEstatisticasIntegradas("2026-08-21");
    assert.equal(stats.geral.playedDays, 1);
    assert.equal(stats.geral.completedModes, 0);
    assert.equal(stats.classic.started, 1);
});
test("estatísticas: dia 4/4", () => {
    const stats = historyApi(normalizedHistory({ "2026-08-21": completeDay() })).obterEstatisticasIntegradas("2026-08-21");
    assert.equal(stats.geral.completeDays, 1);
    assert.equal(stats.geral.completedModes, 4);
    assert.equal(stats.geral.completeDayRate, 100);
});
test("estatísticas: vários dias, vitórias, derrotas e distribuições", () => {
    const history = normalizedHistory({
        "2026-08-19": completeDay({ classic: classic(1), photo: photo("won", 2), moreLess: moreLess(10), lineup: lineup(0, true) }),
        "2026-08-20": completeDay({ classic: classic(5), photo: photo("lost", 6), moreLess: moreLess(0), lineup: lineup(3, false) }),
        "2026-08-21": { ...emptyDay(), photo: { started: true, completed: false, outcome: null, attempts: 2 } }
    });
    const stats = historyApi(history).obterEstatisticasIntegradas("2026-08-21");
    assert.equal(stats.geral.registeredDays, 3);
    assert.equal(stats.geral.completeDays, 2);
    assert.equal(stats.geral.completedModes, 8);
    assert.equal(stats.photo.wins, 1);
    assert.equal(stats.photo.losses, 1);
    assert.equal(stats.photo.winRate, 50);
    assert.equal(stats.classic.distribution[1], 1);
    assert.equal(stats.classic.distribution["4+"], 1);
    assert.equal(stats.moreLess.distribution[0], 1);
    assert.equal(stats.moreLess.distribution[10], 1);
    assert.equal(stats.moreLess.perfectResults, 1);
    assert.equal(stats.lineup.zeroErrorCompletions, 1);
    assert.equal(stats.lineup.totalErrors, 3);
    assert.equal(stats.lineup.exactScores, 1);
    assert.equal(stats.lineup.exactScoreRate, 50);
    assert.equal(stats.geral.wins, 6, "derrotas contam como conclusão, não como vitória");
    assert.equal(stats.geral.currentStreak, historyApi(history).obterStreakGeral("2026-08-21").current);
    assertFinitePercentages(stats);
});
test("estatísticas: dados malformados normalizados não geram NaN/Infinity", () => {
    const history = storage.normalizeHistory({ version: 1, days: {
        "2026-08-20": { classic: "x", photo: { started: true, completed: true, outcome: "x", attempts: Infinity } },
        "data-ruim": completeDay()
    }});
    assertFinitePercentages(historyApi(history).obterEstatisticasIntegradas("2026-08-21"));
});

// COMPARTILHAMENTO UNIFICADO E ANTI-SPOILER.
function shareText(day, streakCurrent = 1) {
    const api = compileFunctions([
        "pluralizarQuantidade", "formatarDataCompartilhamento", "complementoResultadoCompartilhamento",
        "gerarTextoCompartilhamentoDiario"
    ], {
        dataHistoricoValida: storage.validDate,
        numeroHistoricoValido: (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isFinite(value) && value >= min && value <= max,
        obterProgressoDiario: data => ({ data, completed: 4, total: 4, complete: true, modes: day }),
        obterStreakGeral: () => ({ current: streakCurrent, best: streakCurrent, totalCompleteDays: streakCurrent, lastCompleteDate: "2026-08-21" }),
        getDataLocalString: () => "2026-08-21",
        URL_OFICIAL_TIMAODLE: "timaodle.net"
    });
    return api.gerarTextoCompartilhamentoDiario("2026-08-21");
}
test("compartilhamento: quatro vitórias e singular", () => {
    const text = shareText(completeDay({ classic: classic(1), lineup: lineup(1) }), 1);
    assert.match(text, /1 tentativa/);
    assert.match(text, /1 erro/);
    assert.match(text, /1 dia/);
    assert.match(text, /Foto[^\n]+vitória/);
    assert.match(text, /Mais ou Menos[^\n]+vitória/);
});
test("compartilhamento: derrotas e plural", () => {
    const text = shareText(completeDay({ classic: classic(2), photo: photo("lost", 6), moreLess: moreLess(6), lineup: lineup(2) }), 2);
    assert.match(text, /2 tentativas/);
    assert.match(text, /2 erros/);
    assert.match(text, /2 dias/);
    assert.match(text, /Foto[^\n]+derrota/);
    assert.match(text, /Mais ou Menos[^\n]+derrota/);
});
test("compartilhamento: zero erros e streak zero", () => {
    const text = shareText(completeDay({ lineup: lineup(0) }), 0);
    assert.match(text, /0 erros/);
    assert.doesNotMatch(text, /Sequência:/);
});
test("compartilhamento: múltiplos erros", () => {
    assert.match(shareText(completeDay({ lineup: lineup(7) }), 3), /7 erros/);
});
test("compartilhamento: anti-spoiler explícito", () => {
    const markers = [
        "SEGREDO_CLASSICO_XYZ", "SEGREDO_FOTO_XYZ", "SEGREDO_MM_XYZ",
        "SEGREDO_LINEUP_XYZ", "PLACAR_SECRETO_XYZ", "PALPITE_SECRETO_XYZ",
        "CONFRONTO_SECRETO_XYZ", "MAIS_SECRETO_XYZ", "196_JOGOS_SECRETOS_XYZ"
    ];
    const day = completeDay({
        classic: { ...classic(2), secretName: markers[0], guesses: [markers[0]] },
        photo: { ...photo("lost", 6), secretName: markers[1] },
        moreLess: { ...moreLess(6), sequence: [markers[2]], answers: [markers[7]], games: markers[8] },
        lineup: { ...lineup(2), hiddenPlayers: [markers[3]], score: markers[4], guess: markers[5], match: markers[6] }
    });
    const text = shareText(day, 2);
    for (const marker of markers) assert.equal(text.includes(marker), false, marker);
});

console.log(`game-rules.test.js: ${scenarios} cenários aprovados; MM v2 simulado em ${MM_DATES} datas`);
