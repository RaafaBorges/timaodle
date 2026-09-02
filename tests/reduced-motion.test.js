"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { scriptSource, compileFunctions } = require("./script-harness.js");
const { calcularProgressoDoResumo } = require("../history-stats.js");

const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");
const moreLessModeSource = fs.readFileSync(path.join(__dirname, "..", "more-less-mode.js"), "utf8");

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

function apiConfete(reduzirMovimento) {
    const chamadas = [];
    const api = compileFunctions(["prefereMovimentoReduzido", "dispararConfetes"], {
        window: { matchMedia: () => ({ matches: reduzirMovimento }) },
        confetti: opcoes => chamadas.push(opcoes)
    });
    return { ...api, chamadas };
}

test("movimento reduzido impede o confete decorativo", () => {
    const { dispararConfetes, chamadas } = apiConfete(true);
    dispararConfetes();
    assert.equal(chamadas.length, 0);
});

test("preferência normal preserva o confete existente", () => {
    const { dispararConfetes, chamadas } = apiConfete(false);
    dispararConfetes();
    assert.deepEqual(chamadas, [{ particleCount: 120, spread: 80, origin: { y: 0.6 } }]);
});

test("conclusão 4/4 independe do confete", () => {
    const concluido = { started: true, completed: true };
    const progresso = calcularProgressoDoResumo({
        classic: concluido,
        photo: concluido,
        moreLess: concluido,
        lineup: concluido
    });
    assert.equal(progresso.complete, true);
    assert.equal(progresso.progress, "4/4");
});

test("Mais ou Menos preserva o atraso lógico de 1,5 segundo", () => {
    assert.match(moreLessModeSource, /const ATRASO_AVANCO_MM = 1500;/);
    assert.match(moreLessModeSource, /setTimeoutFn\([\s\S]*?}, ATRASO_AVANCO_MM\);/);
});

test("Foto remove apenas transições decorativas sob movimento reduzido", () => {
    assert.equal((css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g) || []).length, 1);
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?#photoView \.photo-toggle-overlay-btn,[\s\S]*?#photoView \.photo-img,[\s\S]*?#photoView \.photo-dots \.dot-attempt\s*\{\s*transition:\s*none;/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?#photoView \.photo-toggle-overlay-btn:hover\s*\{\s*transform:\s*none;/);
    assert.match(css, /#photoView \.photo-img\s*\{[\s\S]*?filter:\s*blur\(24px\) grayscale\(100%\);[\s\S]*?transform:\s*scale\(1\.15\);/);
});

console.log(`reduced-motion.test.js: ${scenarios} cenários aprovados`);
