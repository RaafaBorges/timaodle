"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../core.js");

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

test("CommonJS expõe o core sem APIs de browser", () => {
    assert.equal(typeof core, "object");
    assert.equal(core, globalThis.TimaodleCore);
    assert.equal(typeof core.hashString, "function");
});
test("hash preserva valores conhecidos", () => {
    assert.equal(core.hashString(""), 0);
    assert.equal(core.hashString("2025-01-01"), 274162049);
    assert.equal(core.hashString("2028-12-31"), 2937626497);
});
test("data local usa componentes civis locais da Date recebida", () => {
    assert.equal(core.formatarDataLocal(new Date(2026, 7, 25, 23, 59, 59)), "2026-08-25");
});
test("validação civil rejeita formato e datas impossíveis", () => {
    assert.equal(core.dataCivilValida("2026-08-25"), true);
    assert.equal(core.dataCivilValida("2026-8-25"), false);
    assert.equal(core.dataCivilValida("2026-02-29"), false);
});
test("componentes civis preservam ano, mês e dia", () => {
    assert.deepEqual(core.componentesDataCivil("2026-08-25"), { year: 2026, month: 8, day: 25 });
    assert.equal(core.componentesDataCivil("inválida"), null);
});
test("criação civil valida preenchimento e limites", () => {
    assert.equal(core.criarDataCivilString(2026, 3, 8), "2026-03-08");
    assert.equal(core.criarDataCivilString(2026, 2, 29), null);
});
test("comparação civil mantém ordem cronológica por string canônica", () => {
    assert.equal(core.compararDatasCivis("2025-12-31", "2026-01-01"), -1);
    assert.equal(core.compararDatasCivis("2026-01-01", "2026-01-01"), 0);
    assert.equal(core.compararDatasCivis("2026-01-02", "2026-01-01"), 1);
});
test("dias do mês cobre ano comum e bissexto", () => {
    assert.equal(core.diasNoMesCivil(2025, 2), 28);
    assert.equal(core.diasNoMesCivil(2028, 2), 29);
});
test("deslocamento semanal continua baseado em segunda-feira", () => {
    assert.equal(core.deslocamentoPrimeiraSemanaCivil(2026, 6), 0);
    assert.equal(core.deslocamentoPrimeiraSemanaCivil(2026, 2), 6);
});
test("movimentação de mês cobre viradas de ano", () => {
    assert.deepEqual(core.moverMesCivil(2026, 12, 1), { year: 2027, month: 1 });
    assert.deepEqual(core.moverMesCivil(2026, 1, -1), { year: 2025, month: 12 });
});
test("movimentação de dia cobre mês, ano e bissexto", () => {
    assert.equal(core.moverDataCivil("2026-01-31", 1), "2026-02-01");
    assert.equal(core.moverDataCivil("2026-12-31", 1), "2027-01-01");
    assert.equal(core.moverDataCivil("2028-02-28", 1), "2028-02-29");
    assert.equal(core.moverDataCivil("2028-03-01", -1), "2028-02-29");
});
test("core não referencia DOM, storage, fetch, listeners ou estado dos modos", () => {
    const source = fs.readFileSync(path.join(__dirname, "..", "core.js"), "utf8");
    assert.doesNotMatch(source, /\b(document|localStorage|fetch)\b|addEventListener/);
    assert.doesNotMatch(source, /jogadores|PARTIDAS_ESCALACAO|JOGADORES_COM_FOTO/);
});

console.log(`daily-core.test.js: ${scenarios} cenários aprovados`);
