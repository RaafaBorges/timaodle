"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const photoCatalog = require("../photo-catalog.js");
const core = require("../core.js");

const root = path.join(__dirname, "..");
const jogadoresReais = JSON.parse(fs.readFileSync(path.join(root, "jogadores.json"), "utf8"));
const manifestoReal = JSON.parse(fs.readFileSync(path.join(root, "fotos-manifest.json"), "utf8"));
const jogadores = [
    { nome: "Sócrates", estreia: 1978 },
    { nome: "Cássio", estreia: 2012 },
    { nome: "Basílio", estreia: 1975 },
    { nome: "Sem Foto", estreia: 2000 }
];

const tests = [];
function test(name, callback) { tests.push([name, callback]); }
function criar(manifesto = ["Cássio", "Sócrates", "Basílio"]) {
    return photoCatalog.createPhotoCatalog({ jogadores, manifesto, hashString: core.hashString });
}
function fnv1a(text) {
    let hash = 0x811c9dc5;
    for (const char of text) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
}

test("contratos browser e Node", () => {
    assert.equal(globalThis.TimaodlePhotoCatalog, photoCatalog);
    assert.equal(typeof photoCatalog.createPhotoCatalog, "function");
});

test("manifesto válido preserva a ordem declarada", () => {
    assert.deepEqual(criar().nomes(), ["Cássio", "Sócrates", "Basílio"]);
});

test("pool preserva a ordem dos jogadores", () => {
    assert.deepEqual(criar().jogadores().map(jogador => jogador.nome), ["Sócrates", "Cássio", "Basílio"]);
});

test("entradas duplicadas inválidas e vazias mantêm o comportamento anterior", () => {
    const catalogo = criar([" Cássio ", "Cássio", null, 7, "", "Desconhecido", "Sócrates"]);
    assert.deepEqual(catalogo.nomes(), ["Cássio", "Sócrates"]);
});

test("manifesto que não é array mantém o erro anterior", () => {
    assert.throws(() => criar({}), /O manifesto de fotos precisa ser um array/);
});

test("associação distingue jogadores com e sem foto", () => {
    const catalogo = criar();
    assert.equal(catalogo.temFoto("Cássio"), true);
    assert.equal(catalogo.temFoto("Sem Foto"), false);
});

test("lookup retorna caminho apenas para foto cadastrada", () => {
    const catalogo = criar();
    assert.equal(catalogo.fotoDoJogador("Cássio"), "fotos/cassio.jpg");
    assert.equal(catalogo.fotoDoJogador("Sem Foto"), "");
});

test("slug e caminho preservam diacríticos e pasta configurável", () => {
    const catalogo = photoCatalog.createPhotoCatalog({ jogadores, manifesto: ["Sócrates"], hashString: core.hashString, pastaFotos: "retratos/" });
    assert.equal(photoCatalog.slugify("Sócrates"), "socrates");
    assert.equal(catalogo.caminhoFoto("Sócrates"), "retratos/socrates.jpg");
});

test("seleção diária usa exatamente hash(data + -foto) módulo pool", () => {
    const catalogo = criar();
    for (const data of ["2025-01-01", "2026-08-25", "2028-12-31"]) {
        const pool = catalogo.jogadores();
        assert.equal(catalogo.jogadorDoDia(data), pool[core.hashString(data + "-foto") % pool.length]);
    }
});

test("pool vazio retorna null na seleção diária", () => {
    assert.equal(criar([]).jogadorDoDia("2026-08-25"), null);
});

test("estado diário válido restaura o jogador salvo", () => {
    assert.equal(criar().jogadorDoEstado({ data: "2026-08-25", jogadorNome: "Cássio" }, "2026-08-25").nome, "Cássio");
});

test("estado ausente ou de outra data usa a seleção diária", () => {
    const catalogo = criar();
    assert.equal(catalogo.jogadorDoEstado({ data: "2026-08-24", jogadorNome: "Cássio" }, "2026-08-25"), catalogo.jogadorDoDia("2026-08-25"));
});

test("dificuldade preserva os três limites", () => {
    assert.deepEqual(photoCatalog.calcularDificuldadeFoto(1975), { label: "Difícil", classe: "dificil" });
    assert.deepEqual(photoCatalog.calcularDificuldadeFoto(1989), { label: "Médio", classe: "medio" });
    assert.deepEqual(photoCatalog.calcularDificuldadeFoto(1990), { label: "Fácil", classe: "facil" });
});

test("operações são puras e retornam coleções defensivas", () => {
    const jogadoresAntes = structuredClone(jogadores);
    const manifesto = ["Cássio", "Sócrates"];
    const manifestoAntes = [...manifesto];
    const catalogo = photoCatalog.createPhotoCatalog({ jogadores, manifesto, hashString: core.hashString });
    catalogo.nomes().push("Intruso");
    catalogo.jogadores().pop();
    assert.deepEqual(jogadores, jogadoresAntes);
    assert.deepEqual(manifesto, manifestoAntes);
    assert.deepEqual(catalogo.nomes(), ["Cássio", "Sócrates"]);
    assert.equal(catalogo.jogadores().length, 2);
});

test("duas instâncias permanecem independentes", () => {
    const primeira = criar(["Cássio"]);
    const segunda = criar(["Sócrates", "Basílio"]);
    assert.deepEqual(primeira.jogadores().map(jogador => jogador.nome), ["Cássio"]);
    assert.deepEqual(segunda.jogadores().map(jogador => jogador.nome), ["Sócrates", "Basílio"]);
});

test("dados reais preservam 157 de 157, fingerprint e cinco datas", () => {
    const catalogo = photoCatalog.createPhotoCatalog({ jogadores: jogadoresReais, manifesto: manifestoReal, hashString: core.hashString });
    const nomes = catalogo.jogadores().map(jogador => jogador.nome);
    assert.equal(jogadoresReais.length, 157);
    assert.equal(manifestoReal.length, 157);
    assert.equal(nomes.length, 157);
    assert.equal(fnv1a(nomes.join("\u001f")), "5be61d7b");
    const esperado = {
        "2025-01-01": "Gil",
        "2025-07-09": "Zé Elias",
        "2026-08-25": "Flávio Minuano",
        "2027-03-12": "Marcelo Djian",
        "2028-12-31": "Hugo Souza"
    };
    for (const [data, nome] of Object.entries(esperado)) assert.equal(catalogo.jogadorDoDia(data).nome, nome, data);
});

for (const [name, callback] of tests) {
    try {
        callback();
    } catch (error) {
        error.message = `${name}: ${error.message}`;
        throw error;
    }
}

console.log(`photo-catalog.test.js: ${tests.length} cenários aprovados`);
