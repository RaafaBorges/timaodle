"use strict";

const assert = require("node:assert/strict");
const storage = require("../storage-normalizers.js");

const date = "2026-08-21";
const players = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const snapshots = players.slice(0, 11).map((nome, jogos) => ({ nome, jogos: jogos + 1 }));
const validModes = {
    classic: { started: true, completed: true, outcome: "won", attempts: 2 },
    photo: { started: true, completed: true, outcome: "lost", attempts: 6 },
    moreLess: { started: true, completed: true, outcome: "won", hits: 7, rounds: 10 },
    lineup: { started: true, completed: true, outcome: "won", phase: "completed", resolved: 3, total: 3, errors: 1, exactScore: false }
};

function historyWith(day) {
    return storage.normalizeHistory({ version: 1, days: { [date]: day } });
}

// A–E: inexistente e formas JSON estruturalmente inválidas.
assert.equal(storage.parseJson(null), null); // A
assert.equal(storage.parseJson('{"version":1'), null); // B
assert.equal(storage.normalizeClassic(storage.parseJson("{}")), null); // C
assert.equal(storage.normalizeClassic(storage.parseJson("[]")), null); // D
assert.equal(storage.normalizeClassic(storage.parseJson("null")), null); // E

// F–I: tipos, números e datas inválidas.
assert.deepEqual(storage.normalizeLegacyStats({ jogos: "3", vitorias: true }), { jogos: 0, vitorias: 0, streak: 0, maxStreak: 0 }); // F
assert.equal(storage.normalizeMoreLess({ data: date, rodadaAtual: -4, acertos: -2 }).rodadaAtual, 0); // G
assert.deepEqual(storage.normalizeLegacyStats({ jogos: Infinity, streak: NaN }), { jogos: 0, vitorias: 0, streak: 0, maxStreak: 0 }); // H
assert.equal(storage.validDate("2026-02-31"), false); // I

// J: saves atuais válidos permanecem semanticamente iguais.
assert.deepEqual(storage.normalizeClassic({ data: date, tentativas: ["A"], status: "won" }, {
    playerNames: players, secretName: "A"
}), { data: date, tentativas: ["A"], status: "won" });
assert.deepEqual(storage.normalizePhoto({ data: date, jogadorNome: "A", tentativas: ["B", "A"], status: "won" }, {
    playerNames: players, photoNames: players
}), { data: date, jogadorNome: "A", tentativas: ["B", "A"], status: "won" });

// K/N: MM v1 antigo continua recuperável e é identificado como versão 1.
const mmV1 = storage.normalizeMoreLess({ data: date, rodadaAtual: 3, acertos: 2, historico: [], status: "playing" });
assert.equal(mmV1.versaoAlgoritmo, 1); // K / N
assert.equal(mmV1.rodadaAtual, 3);

// L: Clássico corrompido preserva apenas nomes válidos e neutraliza vitória impossível.
assert.deepEqual(storage.normalizeClassic({ data: date, tentativas: ["A", 4, "X"], status: "won" }, {
    playerNames: players, secretName: "B"
}), { data: date, tentativas: ["A"], status: "playing" }); // L

// M: Foto com jogador fora do pool reinicia somente o desafio dessa chave.
assert.deepEqual(storage.normalizePhoto({ data: date, jogadorNome: "X", tentativas: ["A"], status: "won" }, {
    playerNames: players, photoNames: players
}), { data: date, jogadorNome: null, tentativas: [], status: "playing" }); // M

// O: MM v2 válido mantém snapshot, rodada e resultado.
const mmV2 = storage.normalizeMoreLess({
    data: date, versaoAlgoritmo: 2, rodadaAtual: 10, acertos: 7,
    referenciaAtualNome: "K", historico: [], status: "won",
    sequenciaNomes: players.slice(0, 11), sequenciaJogadores: snapshots,
    planoDificuldades: ["facil", "facil", "facil", "media", "media", "media", "media", "dificil", "dificil", "dificil"],
    planoDirecoes: ["mais", "menos", "mais", "menos", "mais", "menos", "mais", "menos", "mais", "menos"]
});
assert.equal(mmV2.status, "won"); // O
assert.equal(mmV2.sequenciaJogadores.length, 11);

// P: snapshot parcialmente corrompido é descartado, mas nomes suficientes preservam a sequência.
const mmPartial = storage.normalizeMoreLess({
    data: date, versaoAlgoritmo: 2, rodadaAtual: 12, acertos: 99,
    sequenciaNomes: players.slice(0, 11), sequenciaJogadores: [...snapshots.slice(0, 10), { nome: "K", jogos: "x" }]
});
assert.equal(mmPartial.sequenciaJogadores, undefined); // P
assert.equal(mmPartial.sequenciaNomes.length, 11);
assert.equal(mmPartial.rodadaAtual, 10);
assert.equal(mmPartial.acertos, 10);

// Q: Onze Inicial antigo com partidaId null continua compatível.
const oldLineup = storage.normalizeLineup({
    data: date, partidaId: null, etapa: "escalacao", palpiteMandante: 1, palpiteVisitante: 0,
    nomesResolvidos: ["A"], nomesForaDaLista: [], errosEscalacao: 0, concluido: false
}, { hiddenNames: ["A", "B", "C"], playerNames: players });
assert.equal(oldLineup.partidaId, null); // Q
assert.equal(oldLineup.etapa, "escalacao");
const currentLineup = storage.normalizeLineup({
    data: date, partidaId: "partida-valida", etapa: "concluido", palpiteMandante: 1, palpiteVisitante: 0,
    nomesResolvidos: ["A", "B", "C"], nomesForaDaLista: ["D"], errosEscalacao: 1,
    exactScore: true, concluido: true
}, { matchIds: ["partida-valida"], hiddenNames: ["A", "B", "C"], playerNames: players,
    realScore: { mandante: 1, visitante: 0 } });
assert.equal(currentLineup.concluido, true);
assert.equal(currentLineup.etapa, "concluido");

// R: partidaId conhecido como inválido descarta somente esse save.
assert.equal(storage.normalizeLineup({ data: date, partidaId: "inexistente" }, { matchIds: ["partida-valida"] }), null); // R

// S/T: complete é sempre derivado dos quatro modos normalizados.
const threeOfFour = historyWith({ ...validModes, lineup: { ...validModes.lineup, completed: false }, complete: true });
assert.equal(threeOfFour.days[date].complete, false); // S
const fourOfFour = historyWith({ ...validModes, complete: false, completionCelebrated: true });
assert.equal(fourOfFour.days[date].complete, true); // T
assert.equal(fourOfFour.days[date].completionCelebrated, true);

// U: outcome arbitrário não produz conclusão/vitória.
const arbitrary = historyWith({ ...validModes, photo: { ...validModes.photo, outcome: "talvez" } });
assert.equal(arbitrary.days[date].photo.completed, false); // U
assert.equal(arbitrary.days[date].photo.outcome, null);

// V: um dia inválido não remove dias válidos vizinhos.
const multiple = storage.normalizeHistory({ version: 1, days: {
    [date]: { ...validModes },
    "2026-02-31": { ...validModes },
    "2026-08-22": "corrompido",
    "2026-08-23": { ...validModes }
} });
assert.deepEqual(Object.keys(multiple.days), [date, "2026-08-23"]); // V

// W: normalizar novamente produz o mesmo estado (equivalente ao F5, sem loop de escrita).
assert.deepEqual(storage.normalizeHistory(fourOfFour), fourOfFour); // W
assert.deepEqual(storage.normalizeMoreLess(mmV2), mmV2);

// X: uma data válida diferente é preservada; a escolha do dia corrente continua no modo.
assert.equal(storage.normalizeClassic({ data: "2026-08-22", tentativas: [], status: "playing" }).data, "2026-08-22"); // X

// Limites adicionais solicitados.
const lineupLimits = storage.normalizeLineup({
    data: date, partidaId: null, etapa: "concluido", palpiteMandante: -1, palpiteVisitante: 99,
    nomesResolvidos: ["A", "B", "C", "D"], errosEscalacao: -5, concluido: true
}, { hiddenNames: ["A", "B", "C"] });
assert.equal(lineupLimits.etapa, "placar");
assert.equal(lineupLimits.nomesResolvidos.length, 3);
assert.equal(lineupLimits.errosEscalacao, 0);

console.log("storage.test.js: cenários A–X aprovados");
