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

function cssRule(selector) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1] || "";
}

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

test("Como Jogar preserva largura e grid responsivos próprios", () => {
    const modalRule = cssRule(".integrated-stats-modal-content.help-modal-content");
    const gridRule = cssRule(".help-mode-grid");
    assert.match(modalRule, /width:\s*min\(700px/);
    assert.match(modalRule, /max-height:[^;]*100dvh/);
    assert.match(gridRule, /repeat\(auto-fit/);
    assert.match(gridRule, /min\(280px,\s*100%\)/);
    assert.ok(css.includes("word-break: normal"));
});

test("viewports canônicos da v2.7 permanecem formalizados", () => {
    assert.deepEqual(contract.viewports.map(viewport => viewport.width), [360, 390, 412, 430, 480, 768, 1440, 412]);
    assert.ok(contract.viewports.some(viewport => viewport.height <= 600), "viewport baixo ausente");
});

test("shell global preserva eixo, gutters e um único scroll vertical", () => {
    for (const token of ["--shell-max-width", "--shell-gutter", "--shell-inline-space"]) {
        assert.ok(css.includes(token), token);
    }
    assert.match(cssRule("body.app-shell"), /overflow:\s*hidden/);
    assert.match(cssRule(".page-content"), /overflow-y:\s*auto/);
    assert.match(cssRule(".header-inner"), /var\(--shell-gutter\)/);
    assert.match(cssRule(".app-shell .page-content"), /var\(--shell-inline-space\)/);
    assert.match(cssRule(".pokedle-footer"), /var\(--shell-inline-space\)/);
    for (const selector of [".home-daily-info", ".mode-buttons-container", ".home-progress-card", ".home-stats-btn"]) {
        assert.match(cssRule(selector), /max-width:\s*400px/, selector);
    }
    assert.match(cssRule(".home-menu"), /gap:\s*clamp\(/);
    assert.match(cssRule(".pokedle-btn"), /padding:\s*clamp\(/);
    assert.match(cssRule(".btn-title"), /font-size:\s*clamp\(/);
    assert.equal((css.match(/\.btn-title\s*\{/g) || []).length, 1);
    assert.equal((css.match(/\.pill-text\s*\{/g) || []).length, 1);
});

console.log(`frontend-structure.test.js: ${scenarios} cenários estruturais aprovados; ${htmlIds.length} IDs verificados`);
