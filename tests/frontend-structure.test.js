"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const contract = require("./frontend-contract.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

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

const htmlIds = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match => match[1]);
const htmlIdSet = new Set(htmlIds);

test("IDs do HTML são únicos", () => {
    const duplicates = htmlIds.filter((id, index) => htmlIds.indexOf(id) !== index);
    assert.deepEqual([...new Set(duplicates)], []);
});

test("IDs literais usados por getElementById existem no HTML", () => {
    const referenced = [...script.matchAll(/getElementById\(\s*["']([^"']+)["']\s*\)/g)]
        .map(match => match[1]);
    const missing = [...new Set(referenced)].filter(id => !htmlIdSet.has(id));
    assert.deepEqual(missing, []);
});

for (const [area, ids] of Object.entries(contract.essentialIds)) {
    test(`estrutura essencial: ${area}`, () => {
        const missing = ids.filter(id => !htmlIdSet.has(id));
        assert.deepEqual(missing, []);
    });
}

test("seletores CSS essenciais permanecem definidos", () => {
    const missing = contract.essentialCssSelectors.filter(selector => !css.includes(selector));
    assert.deepEqual(missing, []);
});

test("classes dinâmicas relevantes permanecem ligadas ao JS", () => {
    const all = [...new Set(Object.values(contract.dynamicClasses).flat())];
    const missing = all.filter(className => !script.includes(className));
    assert.deepEqual(missing, []);
});

test("estados estruturais dos quatro modos têm contrato CSS", () => {
    const stateSelectors = [
        ".home-progress-card.is-complete", ".cell.correct", ".photo-attempt-item.correct",
        ".mm-player-candidate.answer-correct", ".mm-round-feedback.wrong",
        ".player-chip.dense-line", ".slot-btn.correct", ".lineup-result-card"
    ];
    assert.deepEqual(stateSelectors.filter(selector => !css.includes(selector)), []);
});

test("modais preservam semântica e bloqueio de scroll", () => {
    for (const id of ["photoTutorialModal", "integratedStatsModal", "howToPlayModal"]) {
        const tag = html.match(new RegExp(`<[^>]+id=["']${id}["'][^>]*>`, "i"))?.[0] || "";
        assert.match(tag, /role=["']dialog["']/i, id);
        assert.match(tag, /aria-modal=["']true["']/i, id);
        assert.match(tag, /aria-labelledby=/i, id);
    }
    assert.ok(script.includes('classList.add("modal-open")'));
    assert.ok(script.includes('classList.remove("modal-open")'));
});

test("viewports canônicos da v2.7 permanecem formalizados", () => {
    assert.deepEqual(contract.viewports.map(viewport => viewport.width), [360, 390, 412, 430, 480, 768, 1440, 412]);
    assert.ok(contract.viewports.some(viewport => viewport.height <= 600), "viewport baixo ausente");
});

console.log(`frontend-structure.test.js: ${scenarios} cenários estruturais aprovados; ${htmlIds.length} IDs verificados`);
