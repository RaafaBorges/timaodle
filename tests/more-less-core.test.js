"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const moreLessCore = require("../more-less-core.js");
const core = require("../core.js");

const root = path.join(__dirname, "..");
const players = JSON.parse(fs.readFileSync(path.join(root, "jogadores.json"), "utf8"));
const photoNames = new Set(JSON.parse(fs.readFileSync(path.join(root, "fotos-manifest.json"), "utf8")));
const pool = players.filter(player => photoNames.has(player.nome)
    && Object.prototype.hasOwnProperty.call(player, "jogos")
    && typeof player.jogos === "number" && Number.isFinite(player.jogos));
const api = moreLessCore.createMoreLessCore({ getPool: () => pool, hashString: core.hashString });

const tests = [];
function test(name, callback) { tests.push([name, callback]); }

test("contratos browser e Node", () => {
    assert.equal(globalThis.TimaodleMoreLessCore, moreLessCore);
    assert.equal(typeof moreLessCore.createMoreLessCore, "function");
});

test("PRNG conhecido preserva cinco outputs exatos", () => {
    const rng = moreLessCore.gerarPRNG(123456789);
    assert.deepEqual(Array.from({ length: 5 }, () => Number(rng().toFixed(12))), [
        0.257790743839, 0.970772111556, 0.785328014288, 0.206164579839, 0.303071887465
    ]);
});

test("embaralhamento com semente é puro e estável", () => {
    const original = [1, 2, 3, 4, 5, 6];
    const primeiro = moreLessCore.embaralharComSemente(original, 42);
    assert.deepEqual(primeiro, moreLessCore.embaralharComSemente(original, 42));
    assert.deepEqual(original, [1, 2, 3, 4, 5, 6]);
});

test("seed v1 preserva data + -mm", () => {
    const data = "2026-08-25";
    const esperado = moreLessCore.embaralharComSemente(pool, core.hashString(data + "-mm")).slice(0, 11);
    assert.deepEqual(api.gerarSequenciaMMV1(data).map(player => player.nome), esperado.map(player => player.nome));
});

test("seed v2 preserva data + -mm-v2 e estabilidade", () => {
    const entradasHash = [];
    const primeiro = moreLessCore.gerarDesafioMMV2("2026-08-25", pool, entrada => {
        entradasHash.push(entrada);
        return core.hashString(entrada);
    });
    const segundo = api.gerarDesafioMMV2("2026-08-25");
    assert.deepEqual(entradasHash, ["2026-08-25-mm-v2"]);
    assert.deepEqual(segundo, primeiro);
});

test("dificuldade preserva limites 30 e 120", () => {
    const referencia = { jogos: 200 };
    assert.equal(moreLessCore.dificuldadeComparacaoMM(referencia, { jogos: 230 }), "dificil");
    assert.equal(moreLessCore.dificuldadeComparacaoMM(referencia, { jogos: 231 }), "media");
    assert.equal(moreLessCore.dificuldadeComparacaoMM(referencia, { jogos: 320 }), "media");
    assert.equal(moreLessCore.dificuldadeComparacaoMM(referencia, { jogos: 321 }), "facil");
});

test("buckets reais de dificuldade permanecem formados sem ordenar o pool", () => {
    const referencia = pool[0];
    const buckets = { facil: [], media: [], dificil: [] };
    pool.slice(1).forEach(player => buckets[moreLessCore.dificuldadeComparacaoMM(referencia, player)].push(player.nome));
    assert.equal(Object.values(buckets).flat().length, pool.length - 1);
    for (const nomes of Object.values(buckets)) {
        assert.deepEqual(nomes, pool.filter(player => player !== referencia
            && moreLessCore.dificuldadeComparacaoMM(referencia, player) === Object.keys(buckets).find(key => buckets[key] === nomes))
            .map(player => player.nome));
    }
});

test("direção distingue MAIS MENOS e empate", () => {
    assert.equal(moreLessCore.direcaoComparacaoMM({ jogos: 10 }, { jogos: 11 }), "mais");
    assert.equal(moreLessCore.direcaoComparacaoMM({ jogos: 10 }, { jogos: 9 }), "menos");
    assert.equal(moreLessCore.direcaoComparacaoMM({ jogos: 10 }, { jogos: 10 }), "empate");
});

test("dificuldade expandida preserva faixas e rejeita empate", () => {
    const referencia = { jogos: 200 };
    assert.equal(moreLessCore.atendeDificuldadeExpandidaMM(referencia, { jogos: 200 }, "dificil"), false);
    assert.equal(moreLessCore.atendeDificuldadeExpandidaMM(referencia, { jogos: 245 }, "dificil"), true);
    assert.equal(moreLessCore.atendeDificuldadeExpandidaMM(referencia, { jogos: 216 }, "media"), true);
    assert.equal(moreLessCore.atendeDificuldadeExpandidaMM(referencia, { jogos: 291 }, "facil"), true);
});

test("plano mantém 3 fáceis 4 médias e 3 difíceis", () => {
    const desafio = api.gerarDesafioMMV2("2026-08-25");
    assert.deepEqual(desafio.planoDificuldades.reduce((total, dificuldade) => {
        total[dificuldade]++;
        return total;
    }, { facil: 0, media: 0, dificil: 0 }), { facil: 3, media: 4, dificil: 3 });
});

test("sequência v2 contém onze jogadores únicos", () => {
    const nomes = api.gerarDesafioMMV2("2026-08-25").sequencia.map(player => player.nome);
    assert.equal(nomes.length, 11);
    assert.equal(new Set(nomes).size, 11);
});

test("plano mantém quatro a seis respostas MAIS", () => {
    const plano = api.gerarDesafioMMV2("2026-08-25").planoDirecoes;
    const mais = plano.filter(direcao => direcao === "mais").length;
    assert.ok(mais >= 4 && mais <= 6);
    assert.equal(plano.length - mais, 10 - mais);
});

test("repetição e alternância preservam limites", () => {
    const plano = api.gerarDesafioMMV2("2026-08-25").planoDirecoes;
    assert.ok(moreLessCore.maiorSequenciaIgualMM(plano) <= 3);
    assert.ok(moreLessCore.maiorSequenciaAlternadaMM(plano) <= 4);
});

test("fallback graduado preserva sequência única e registra grupos", () => {
    const pequeno = Array.from({ length: 11 }, (_, index) => ({ nome: `P${index}`, jogos: index }));
    const resultado = moreLessCore.construirSequenciaComFallbackMM(
        pequeno,
        Array(10).fill("facil"),
        Array(10).fill("mais")
    );
    assert.equal(resultado.sequencia.length, 11);
    assert.equal(new Set(resultado.sequencia.map(player => player.nome)).size, 11);
    assert.ok(resultado.fallbacks.every(indice => indice >= 1));
});

test("dados reais preservam pool fingerprint e fixture conhecida", () => {
    assert.equal(pool.length, 157);
    const desafio = api.gerarDesafioMMV2("2026-08-25");
    assert.equal(desafio.sequencia.map(player => player.nome).join(" > "), "Marcelo Djian > Baltazar > Roberto Belangero > Deivid > Luizão > Félix Torres > José Martínez > Memphis Depay > Ado > Neto > Edílson Capetinha");
    assert.deepEqual(desafio.fallbacks, Array(10).fill(0));
});

test("datas diferentes variam sem contaminar chamadas", () => {
    const datas = ["2025-01-01", "2026-08-25", "2028-12-31"];
    const assinaturas = datas.map(data => api.gerarDesafioMMV2(data).sequencia.map(player => player.nome).join("|"));
    assert.equal(new Set(assinaturas).size, datas.length);
    assert.equal(api.gerarDesafioMMV2(datas[0]).sequencia.map(player => player.nome).join("|"), assinaturas[0]);
});

test("duas instâncias preservam pools independentes", () => {
    const invertido = [...pool].reverse();
    const primeira = moreLessCore.createMoreLessCore({ getPool: () => pool, hashString: core.hashString });
    const segunda = moreLessCore.createMoreLessCore({ getPool: () => invertido, hashString: core.hashString });
    const data = "2026-08-25";
    assert.notDeepEqual(
        primeira.gerarSequenciaMMV1(data).map(player => player.nome),
        segunda.gerarSequenciaMMV1(data).map(player => player.nome)
    );
    assert.deepEqual(primeira.gerarSequenciaMMV1(data), api.gerarSequenciaMMV1(data));
});

for (const [name, callback] of tests) {
    try { callback(); }
    catch (error) { error.message = `${name}: ${error.message}`; throw error; }
}

console.log(`more-less-core.test.js: ${tests.length} cenários aprovados`);
