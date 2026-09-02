"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../core.js");
const moreLessCore = require("../more-less-core.js");
const lineupCore = require("../lineup-core.js");

const partidas = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "partidas.json"), "utf8"));
const api = lineupCore.createLineupCore({
    getMatches: () => partidas,
    hashString: core.hashString,
    embaralharComSemente: moreLessCore.embaralharComSemente
});
const datasCongeladas = {
    "2025-01-01": ["internacional-2009", "Chicão > William > Cristian"],
    "2025-07-09": ["santos-2005", "Fábio Costa > Coelho > Ricardinho"],
    "2026-08-25": ["palmeiras-2011", "Alessandro > Leandro Castán > Wallace"],
    "2027-03-12": ["palmeiras-2018", "Sidcley > Ángel Romero > Clayson"],
    "2028-12-31": ["palmeiras-2017", "Fágner > Camacho > Ángel Romero"]
};

const tests = [];
function test(nome, callback) { tests.push([nome, callback]); }

test("contratos Node e browser", () => {
    assert.equal(globalThis.TimaodleLineupCore, lineupCore);
    assert.equal(typeof lineupCore.selecionarPartidaDoDia, "function");
    assert.equal(typeof lineupCore.createLineupCore, "function");
    assert.equal(lineupCore.MAX_OCULTOS_ESCALACAO, 3);
});

test("coleção vazia preserva fallback null", () => {
    assert.equal(lineupCore.selecionarPartidaDoDia([], "2026-08-25", core.hashString, moreLessCore.embaralharComSemente), null);
});

test("seed da partida usa data mais sufixo onze", () => {
    const entradas = [];
    lineupCore.selecionarPartidaDoDia(partidas, "DATA_TESTE", texto => {
        entradas.push(texto);
        return 0;
    }, moreLessCore.embaralharComSemente);
    assert.equal(entradas[0], "DATA_TESTE-onze");
});

test("seed dos slots inclui o ID real da partida", () => {
    const entradas = [];
    lineupCore.selecionarPartidaDoDia(partidas, "DATA_TESTE", texto => {
        entradas.push(texto);
        return 0;
    }, moreLessCore.embaralharComSemente);
    assert.equal(entradas[1], `DATA_TESTE-onze-slots-${partidas[0].id}`);
});

test("mesma data retorna a mesma partida e os mesmos slots", () => {
    assert.deepEqual(api.selecionarPartidaDoDia("2026-08-25"), api.selecionarPartidaDoDia("2026-08-25"));
});

test("datas diferentes retornam seleções coerentes", () => {
    const selecoes = Object.keys(datasCongeladas).map(data => api.selecionarPartidaDoDia(data));
    assert.ok(selecoes.every(selecao => partidas.some(partida => partida.id === selecao.id)));
    assert.ok(new Set(selecoes.map(selecao => selecao.id)).size > 1);
});

test("sempre projeta exatamente três ocultos e oito visíveis", () => {
    for (const data of Object.keys(datasCongeladas)) {
        const selecao = api.selecionarPartidaDoDia(data);
        assert.equal(selecao.jogadores_ocultos.length, 3, data);
        assert.equal(selecao.jogadores_visiveis.length, 8, data);
    }
});

test("slots ocultos são únicos e possuem IDs válidos", () => {
    const selecao = api.selecionarPartidaDoDia("2026-08-25");
    const ids = selecao.jogadores_ocultos.map(slot => slot.slot_id);
    assert.equal(new Set(ids).size, 3);
    assert.ok(ids.every(id => /^slot-\d+$/.test(id)));
});

test("todos os jogadores projetados pertencem à partida", () => {
    const selecao = api.selecionarPartidaDoDia("2026-08-25");
    const partida = partidas.find(item => item.id === selecao.id);
    const nomesOriginais = new Set(partida.titulares.map(jogador => jogador.nome));
    const nomesProjetados = [
        ...selecao.jogadores_visiveis.map(jogador => jogador.nome),
        ...selecao.jogadores_ocultos.map(jogador => jogador.nome_correto)
    ];
    assert.ok(nomesProjetados.every(nome => nomesOriginais.has(nome)));
    assert.equal(new Set(nomesProjetados).size, 11);
});

test("ordem relativa dos titulares permanece intacta", () => {
    const selecao = api.selecionarPartidaDoDia("2026-08-25");
    const partida = partidas.find(item => item.id === selecao.id);
    assert.deepEqual(
        selecao.jogadores_visiveis.map(jogador => jogador.nome),
        partida.titulares.filter((_, indice) => !selecao.jogadores_ocultos.some(slot => slot.slot_id === `slot-${indice}`)).map(jogador => jogador.nome)
    );
    assert.deepEqual(
        selecao.jogadores_ocultos.map(jogador => jogador.nome_correto),
        partida.titulares.filter((_, indice) => selecao.jogadores_ocultos.some(slot => slot.slot_id === `slot-${indice}`)).map(jogador => jogador.nome)
    );
});

test("chamadas retornam projeções independentes", () => {
    const primeira = api.selecionarPartidaDoDia("2026-08-25");
    primeira.jogadores_ocultos[0].nome_correto = "ALTERADO";
    primeira.jogadores_visiveis[0].nome = "ALTERADO";
    const segunda = api.selecionarPartidaDoDia("2026-08-25");
    assert.notEqual(segunda.jogadores_ocultos[0].nome_correto, "ALTERADO");
    assert.notEqual(segunda.jogadores_visiveis[0].nome, "ALTERADO");
});

test("array de partidas e titulares não são mutados", () => {
    const antes = JSON.stringify(partidas);
    api.selecionarPartidaDoDia("2026-08-25");
    assert.equal(JSON.stringify(partidas), antes);
});

test("ID e metadados reais da partida são preservados", () => {
    const selecao = api.selecionarPartidaDoDia("2026-08-25");
    const partida = partidas.find(item => item.id === selecao.id);
    for (const campo of ["id", "competicao", "mandante", "visitante", "local_tag", "data", "estadio", "placar_real"]) {
        assert.deepEqual(selecao[campo], partida[campo], campo);
    }
});

test("posição e coordenadas dos titulares são preservadas", () => {
    const selecao = api.selecionarPartidaDoDia("2026-08-25");
    const partida = partidas.find(item => item.id === selecao.id);
    for (const jogador of selecao.jogadores_visiveis) {
        const original = partida.titulares.find(item => item.nome === jogador.nome);
        assert.deepEqual([jogador.posicao_abrev, jogador.top, jogador.left], [original.posicao_abrev, original.top, original.left]);
    }
    for (const slot of selecao.jogadores_ocultos) {
        const indice = Number(slot.slot_id.slice(5));
        const original = partida.titulares[indice];
        assert.deepEqual([slot.nome_correto, slot.posicao_abrev, slot.top, slot.left], [original.nome, original.posicao_abrev, original.top, original.left]);
    }
});

test("factory consulta a coleção atual sem capturar snapshot", () => {
    let colecao = partidas;
    const runtime = lineupCore.createLineupCore({
        getMatches: () => colecao,
        hashString: core.hashString,
        embaralharComSemente: moreLessCore.embaralharComSemente
    });
    assert.ok(runtime.selecionarPartidaDoDia("2026-08-25"));
    colecao = [];
    assert.equal(runtime.selecionarPartidaDoDia("2026-08-25"), null);
});

test("cinco datas congeladas preservam partida e ocultos", () => {
    for (const [data, [id, ocultos]] of Object.entries(datasCongeladas)) {
        const selecao = api.selecionarPartidaDoDia(data);
        assert.equal(selecao.id, id, data);
        assert.equal(selecao.jogadores_ocultos.map(slot => slot.nome_correto).join(" > "), ocultos, data);
    }
});

test("seleção não depende de DOM, Date, storage, fetch ou navigator", () => {
    const fonte = fs.readFileSync(path.join(__dirname, "..", "lineup-core.js"), "utf8");
    assert.doesNotMatch(fonte, /\bdocument\b|\blocalStorage\b|\bfetch\b|\bnavigator\b|new Date\s*\(/);
});

for (const [nome, callback] of tests) {
    try {
        callback();
    } catch (error) {
        error.message = `${nome}: ${error.message}`;
        throw error;
    }
}

console.log(`lineup-core.test.js: ${tests.length} cenários aprovados`);
