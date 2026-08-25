"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const sharing = require("../sharing.js");

let scenarios = 0;
async function test(name, callback) {
    try {
        await callback();
        scenarios++;
    } catch (error) {
        error.message = `${name}: ${error.message}`;
        throw error;
    }
}

const completeModes = {
    classic: { started: true, completed: true, outcome: "won", attempts: 1 },
    photo: { started: true, completed: true, outcome: "won", attempts: 2 },
    moreLess: { started: true, completed: true, outcome: "won", hits: 7, rounds: 10 },
    lineup: { started: true, completed: true, outcome: "won", resolved: 3, total: 3, errors: 0 }
};

async function main() {
    await test("namespace browser e CommonJS expõem a mesma API", () => {
        assert.equal(sharing, globalThis.TimaodleSharing);
        assert.equal(typeof sharing.compartilharTexto, "function");
    });
    await test("Clássico preserva string completa", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoClassico({
            numero: 235, tentativas: 2, grid: "🟥🟨🟩\n🟩🟩🟩", url: "timaodle.net"
        }), "Timãodle #235 — 2/∞ 🖤\n\n🟥🟨🟩\n🟩🟩🟩\n\ntimaodle.net");
    });
    await test("Foto preserva vitória, limites, grade e URL", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoFoto({
            numero: 235, tentativas: 2, venceu: true, maxTentativas: 6, url: "timaodle.net"
        }), "TIMÃODLE — FOTO #235\nGANHOU — 2/6\n\n⬛🟨▫️▫️▫️▫️\n\ntimaodle.net");
    });
    await test("Foto preserva derrota em seis tentativas", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoFoto({
            numero: 235, tentativas: 6, venceu: false, maxTentativas: 6, url: "timaodle.net"
        }), "TIMÃODLE — FOTO #235\nPERDEU — 6/6\n\n⬛⬛⬛⬛⬛⬛\n\ntimaodle.net");
    });
    await test("MM preserva vitória e somente resultados sem jogadores", () => {
        const resultados = Array.from({ length: 10 }, (_, i) => ({ correto: i < 7, jogador: `SEGREDO_${i}` }));
        const texto = sharing.gerarTextoCompartilhamentoMM({
            numero: 235, venceu: true, acertos: 7, rodadas: 10, resultados, url: "timaodle.net"
        });
        assert.equal(texto, "TIMÃODLE — MAIS OU MENOS #235\nGANHOU — 7/10 ACERTOS\n\n🟨🟨🟨🟨🟨🟨🟨⬛⬛⬛\n\ntimaodle.net");
        assert.doesNotMatch(texto, /SEGREDO/);
    });
    await test("MM preserva derrota e zero acertos", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoMM({
            numero: 1, venceu: false, acertos: 0, rodadas: 10,
            resultados: Array.from({ length: 10 }, () => ({ correto: false })), url: "timaodle.net"
        }), "TIMÃODLE — MAIS OU MENOS #1\nPERDEU — 0/10 ACERTOS\n\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n\ntimaodle.net");
    });
    await test("Onze Inicial preserva placar exato e string completa", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoOnze({
            mandante: "Corinthians", visitante: "Chelsea", placarReal: { mandante: 1, visitante: 0 },
            palpite: { mandante: 1, visitante: 0 }, acertos: 3, total: 3, erros: 1
        }), [
            "TIMÃODLE — ONZE INICIAL ⚽", "Corinthians 1–0 Chelsea", "🟨 Palpite: 1–0",
            "🟨🟨🟨 Jogadores: 3/3", "❌ Erros: 1", "Vai Corinthians! 🖤🤍"
        ].join("\n"));
    });
    await test("Onze Inicial preserva indicador de placar diferente", () => {
        const texto = sharing.gerarTextoCompartilhamentoOnze({
            mandante: "Corinthians", visitante: "Chelsea", placarReal: { mandante: 1, visitante: 0 },
            palpite: { mandante: 2, visitante: 1 }, acertos: 2, total: 3, erros: 0
        });
        assert.match(texto, /⬛ Palpite: 2–1/);
        assert.match(texto, /🟨🟨⬛ Jogadores: 2\/3/);
    });
    await test("Compartilhar Dia preserva singular, espaços, emojis e URL", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoDiario({
            data: "2026-08-21", progresso: { complete: true, modes: completeModes },
            streak: { current: 1 }, url: "timaodle.net"
        }), [
            "TIMÃODLE — 21/08/2026 🖤🤍", "", "✅ Clássico — 1 tentativa",
            "✅ Foto — 2/6 · vitória", "✅ Mais ou Menos — 7/10 · vitória",
            "✅ Onze Inicial — 3/3 · 0 erros", "", "🔥 Sequência: 1 dia",
            "🏁 4/4 desafios concluídos", "", "timaodle.net"
        ].join("\n"));
    });
    await test("Compartilhar Dia preserva derrotas, plural e streak ausente", () => {
        const modes = {
            ...completeModes,
            classic: { ...completeModes.classic, attempts: 2 },
            photo: { ...completeModes.photo, outcome: "lost", attempts: 6 },
            moreLess: { ...completeModes.moreLess, outcome: "lost", hits: 6 },
            lineup: { ...completeModes.lineup, errors: 2 }
        };
        const texto = sharing.gerarTextoCompartilhamentoDiario({
            data: "2026-08-21", progresso: { complete: true, modes }, streak: { current: 0 }, url: "timaodle.net"
        });
        assert.match(texto, /2 tentativas/);
        assert.match(texto, /Foto — 6\/6 · derrota/);
        assert.match(texto, /Mais ou Menos — 6\/10 · derrota/);
        assert.match(texto, /2 erros/);
        assert.doesNotMatch(texto, /Sequência:/);
    });
    await test("Compartilhar Dia incompleto continua indisponível", () => {
        assert.equal(sharing.gerarTextoCompartilhamentoDiario({
            data: "2026-08-21", progresso: { complete: false, modes: completeModes }, streak: { current: 0 }, url: "timaodle.net"
        }), null);
    });
    await test("builders ignoram campos secretos adicionais", () => {
        const contaminated = Object.fromEntries(Object.entries(completeModes).map(([key, value]) => [key, {
            ...value, secretName: `SEGREDO_${key}`, sequence: ["SEGREDO"], hiddenPlayers: ["SEGREDO"], games: 999
        }]));
        const texto = sharing.gerarTextoCompartilhamentoDiario({
            data: "2026-08-21", progresso: { complete: true, modes: contaminated }, streak: { current: 1 }, url: "timaodle.net"
        });
        assert.doesNotMatch(texto, /SEGREDO|999/);
    });
    await test("Web Share recebe somente o texto e encerra com sucesso", async () => {
        const calls = [];
        const result = await sharing.compartilharTexto("texto", { navigatorApi: { share: value => calls.push(value) } });
        assert.deepEqual(calls, [{ text: "texto" }]);
        assert.equal(result.status, "shared");
    });
    await test("cancelamento nativo não aciona clipboard por padrão", async () => {
        let copies = 0;
        const abort = Object.assign(new Error("cancelado"), { name: "AbortError" });
        const result = await sharing.compartilharTexto("texto", { navigatorApi: {
            share: () => Promise.reject(abort), clipboard: { writeText: () => { copies++; } }
        } });
        assert.equal(result.status, "cancelled");
        assert.equal(copies, 0);
    });
    await test("Clássico pode manter cópia após cancelamento", async () => {
        const abort = Object.assign(new Error("cancelado"), { name: "AbortError" });
        const result = await sharing.compartilharTexto("texto", {
            navigatorApi: { share: () => Promise.reject(abort), clipboard: { writeText: () => Promise.resolve() } },
            copiarAoCancelar: true
        });
        assert.equal(result.status, "copied");
    });
    await test("clipboard é usado quando Web Share está indisponível", async () => {
        const copies = [];
        const result = await sharing.compartilharTexto("texto", {
            navigatorApi: { clipboard: { writeText: value => copies.push(value) } }
        });
        assert.deepEqual(copies, ["texto"]);
        assert.equal(result.status, "copied");
    });
    await test("fallback injetado cobre clipboard indisponível ou com falha", async () => {
        const fallback = [];
        const result = await sharing.compartilharTexto("texto", {
            navigatorApi: { clipboard: { writeText: () => Promise.reject(new Error("falhou")) } },
            copiarFallback: value => { fallback.push(value); return true; }
        });
        assert.deepEqual(fallback, ["texto"]);
        assert.equal(result.status, "copied");
        assert.ok(result.copyError instanceof Error);
    });
    await test("ausência de todos os caminhos retorna falha", async () => {
        assert.equal((await sharing.compartilharTexto("texto", { navigatorApi: {} })).status, "failed");
    });
    await test("sharing não acessa DOM, storage, estado dos modos, fetch ou listeners", () => {
        const source = fs.readFileSync(path.join(__dirname, "..", "sharing.js"), "utf8");
        assert.doesNotMatch(source, /\b(document|localStorage|fetch)\b|addEventListener/);
        assert.doesNotMatch(source, /estadoDiario|estadoFotoDiario|estadoMMDiario|estadoEscalacao/);
    });

    console.log(`sharing.test.js: ${scenarios} cenários aprovados`);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
