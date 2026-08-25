"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../history-stats.js");

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

const emptyDay = () => api.criarResumoDiaVazio();
const completeDay = (overrides = {}) => ({
    classic: { started: true, completed: true, outcome: "won", attempts: 2 },
    photo: { started: true, completed: true, outcome: "won", attempts: 3 },
    moreLess: { started: true, completed: true, outcome: "won", hits: 8, rounds: 10 },
    lineup: { started: true, completed: true, outcome: "won", phase: "completed", resolved: 3, total: 3, errors: 0, exactScore: true },
    complete: true, completionCelebrated: false, ...overrides
});
const history = (days = {}, trackingStartedAt = "2026-08-01") => ({ version: 1, trackingStartedAt, days });

test("contratos browser e CommonJS expõem um único namespace", () => {
    assert.equal(api, globalThis.TimaodleHistoryStats);
    assert.equal(typeof api.calcularEstatisticasIntegradas, "function");
});
test("histórico vazio preserva progresso 0/4 sem registro artificial", () => {
    const progress = api.obterProgressoHistorico(history(), TODAY);
    assert.equal(progress.progress, "0/4");
    assert.equal(progress.complete, false);
    assert.equal(Object.keys(history().days).length, 0);
});
test("registro real 0/4 permanece diferente de ausência", () => {
    const days = { [TODAY]: emptyDay() };
    assert.equal(api.obterResumoHistoricoDia(TODAY, history(days)).hasRecord, true);
    assert.equal(api.obterResumoHistoricoDia("2026-08-20", history(days)).hasRecord, false);
});
test("dia parcial preserva iniciados, concluídos e textos", () => {
    const day = emptyDay();
    day.classic = { started: true, completed: true, outcome: "won", attempts: 1 };
    day.photo = { started: true, completed: false, outcome: null, attempts: 2 };
    const summary = api.obterResumoHistoricoDia(TODAY, history({ [TODAY]: day }));
    assert.equal(summary.startedCount, 2);
    assert.equal(summary.completedCount, 1);
    assert.equal(summary.photo.statusText, "Em andamento · 2/6");
});
test("dia completo preserva 4/4 e exactScore", () => {
    const summary = api.obterResumoHistoricoDia(TODAY, history({ [TODAY]: completeDay() }));
    assert.equal(summary.complete, true);
    assert.equal(summary.completedCount, 4);
    assert.equal(summary.lineup.exactScore, true);
});
test("normalizadores puros preservam os quatro shapes de save", () => {
    assert.deepEqual(api.normalizarResumoClassico({ data: TODAY, status: "won", tentativas: ["A", "B"] }), {
        started: true, completed: true, outcome: "won", attempts: 2
    });
    assert.deepEqual(api.normalizarResumoFoto({ data: TODAY, status: "lost", tentativas: ["A"] }), {
        started: true, completed: true, outcome: "lost", attempts: 1
    });
    assert.deepEqual(api.normalizarResumoMaisMenos({ data: TODAY, status: "won", rodadaAtual: 10, acertos: 7 }), {
        started: true, completed: true, outcome: "won", hits: 7, rounds: 10
    });
    assert.deepEqual(api.normalizarResumoOnzeInicial({
        data: TODAY, concluido: true, etapa: "concluido", nomesResolvidos: ["A", "B", "C"],
        errosEscalacao: 0, exactScore: false
    }), {
        started: true, completed: true, outcome: "won", phase: "completed",
        resolved: 3, total: 3, errors: 0, exactScore: false
    });
});
test("sequência vazia retorna contrato nulo estável", () => {
    assert.deepEqual(api.calcularStreakGeral(history(), TODAY), {
        current: 0, best: 0, totalCompleteDays: 0, lastCompleteDate: null
    });
});
test("sequência positiva inclui hoje e ontem", () => {
    const days = { "2026-08-20": completeDay(), "2026-08-21": completeDay() };
    assert.equal(api.calcularStreakGeral(history(days), TODAY).current, 2);
});
test("quebra zera sequência atual e preserva recorde", () => {
    const days = { "2026-08-17": completeDay(), "2026-08-18": completeDay() };
    assert.deepEqual(api.calcularStreakGeral(history(days), TODAY), {
        current: 0, best: 2, totalCompleteDays: 2, lastCompleteDate: "2026-08-18"
    });
});
test("dia intermediário trunca sequência até a data selecionada", () => {
    const days = {
        "2026-08-18": completeDay(), "2026-08-19": completeDay(),
        "2026-08-20": completeDay(), "2026-08-21": completeDay()
    };
    const result = api.obterSequenciaHistoricaDoDia("2026-08-20", history(days), TODAY);
    assert.equal(result.throughSelectedDate, 3);
    assert.equal(result.totalRun, 4);
    assert.equal(result.endDate, TODAY);
});
test("estatísticas vazias preservam zero e ausência de amostra", () => {
    const stats = api.calcularEstatisticasIntegradas(history(), TODAY);
    assert.equal(stats.geral.registeredDays, 0);
    assert.equal(stats.photo.winRate, 0);
    assert.equal(stats.lineup.bestErrors, 0);
});
test("estatísticas globais preservam dias, 4/4 e vitórias", () => {
    const stats = api.calcularEstatisticasIntegradas(history({ [TODAY]: completeDay() }), TODAY);
    assert.equal(stats.geral.playedDays, 1);
    assert.equal(stats.geral.completeDays, 1);
    assert.equal(stats.geral.completedModes, 4);
    assert.equal(stats.geral.wins, 4);
    assert.equal(stats.geral.completeDayRate, 100);
});
test("métricas específicas preservam zero real e médias", () => {
    const stats = api.calcularEstatisticasIntegradas(history({ [TODAY]: completeDay() }), TODAY);
    assert.equal(stats.classic.averageAttemptsWins, 2);
    assert.equal(stats.photo.averageAttemptsCompleted, 3);
    assert.equal(stats.moreLess.averageHits, 8);
    assert.equal(stats.lineup.averageErrors, 0);
    assert.equal(stats.lineup.zeroErrorCompletions, 1);
});
test("distribuições preservam 4, 6 e 11 categorias ordenadas", () => {
    const stats = api.calcularEstatisticasIntegradas(history({ [TODAY]: completeDay() }), TODAY);
    assert.deepEqual(Object.keys(stats.classic.distribution), ["1", "2", "3", "4+"]);
    assert.deepEqual(Object.keys(stats.photo.distribution), ["1", "2", "3", "4", "5", "6"]);
    assert.deepEqual(Object.keys(stats.moreLess.distribution), ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    assert.equal(stats.classic.distribution[2], 1);
    assert.equal(stats.photo.distribution[3], 1);
    assert.equal(stats.moreLess.distribution[8], 1);
});
test("resumos não propagam campos secretos contaminados", () => {
    const contaminated = completeDay({
        secretPlayer: "segredo", photoAnswer: "segredo", sequence: ["segredo"],
        hiddenPlayers: ["segredo"], score: "9x9", guess: "9x9"
    });
    const serialized = JSON.stringify(api.obterResumoHistoricoDia(TODAY, history({ [TODAY]: contaminated })));
    for (const secret of ["secretPlayer", "photoAnswer", "sequence", "hiddenPlayers", "score", "guess", "segredo", "9x9"]) {
        assert.equal(serialized.includes(secret), false, secret);
    }
});
test("módulo puro não acessa DOM, storage, fetch, listeners ou relógio", () => {
    const source = fs.readFileSync(path.join(__dirname, "..", "history-stats.js"), "utf8");
    assert.doesNotMatch(source, /\b(document|localStorage|fetch)\b|addEventListener|new Date\s*\(/);
    assert.doesNotMatch(source, /innerHTML|textContent|setTimeout|setInterval/);
});

console.log(`history-stats.test.js: ${scenarios} cenários aprovados`);
