"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const photoMode = require("../photo-mode.js");
const photoModeSource = fs.readFileSync(path.join(__dirname, "..", "photo-mode.js"), "utf8");

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

const levels = photoMode.NIVEIS_FOTO;

test("Foto usa seis estados de blur na progressão aprovada", () => {
    assert.deepEqual(levels.map(level => level.blur), [9, 7, 5, 3, 1, 0]);
});

test("blur diminui estritamente a cada tentativa e termina zerado", () => {
    assert.equal(levels.length, 6);
    for (let index = 1; index < levels.length; index++) {
        assert.ok(levels[index].blur < levels[index - 1].blur);
    }
    assert.equal(levels.at(-1).blur, 0);
});

test("runtime associa o número de tentativas ao nível correspondente", () => {
    levels.forEach((level, attempts) => {
        assert.equal(photoMode.obterNivelFoto(attempts), level);
    });
});

test("restauração salva repõe tentativas antes de atualizar a imagem", () => {
    assert.match(photoModeSource, /tentativas = \[\.\.\.estado\.tentativas\];[\s\S]*?atualizarImagem\(\);/);
});

test("vitória e derrota revelam a foto sem blur", () => {
    assert.match(photoModeSource, /function revelarResultado[\s\S]*?style\.filter = "blur\(0px\) grayscale\(0%\)";/);
    assert.match(photoModeSource, /if \(acertou \|\| tentativas\.length >= MAX_TENTATIVAS_FOTO\)/);
});

console.log(`photo-progression.test.js: ${scenarios} cenários aprovados`);
