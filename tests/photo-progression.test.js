"use strict";

const assert = require("node:assert/strict");
const { scriptSource, compileFunctions } = require("./script-harness.js");

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

const levelsSource = scriptSource.match(/const NIVEIS_FOTO = (\[[\s\S]*?\n\]);/)?.[1];
assert.ok(levelsSource, "NIVEIS_FOTO não encontrado");
const levels = Function(`"use strict"; return ${levelsSource};`)();

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

test("renderização associa o número de tentativas ao nível correspondente", () => {
    const photoImgEl = { style: {} };
    const scope = {
        NIVEIS_FOTO: levels,
        tentativasFoto: [],
        pretoEBrancoAtivo: true,
        photoImgEl
    };
    const { atualizarImagemFoto } = compileFunctions(["atualizarImagemFoto"], scope);

    levels.forEach((level, attempts) => {
        scope.tentativasFoto.length = attempts;
        atualizarImagemFoto();
        assert.equal(photoImgEl.style.filter, `blur(${level.blur}px) grayscale(${level.gray}%)`);
    });
});

test("restauração salva repõe tentativas antes de atualizar a imagem", () => {
    const photoStart = scriptSource.indexOf("function iniciarDesafioFotoDoDia");
    const photoEnd = scriptSource.indexOf("function fecharAutocompleteFoto", photoStart);
    const restore = scriptSource.slice(photoStart, photoEnd);
    assert.match(restore, /tentativasFoto = \[\.\.\.estadoFotoDiario\.tentativas\];[\s\S]*?atualizarImagemFoto\(\);/);
});

test("vitória e derrota revelam a foto sem blur", () => {
    const photoStart = scriptSource.indexOf("function fazerPalpiteFoto");
    const photoEnd = scriptSource.indexOf("photoSearchInput.addEventListener", photoStart);
    const guesses = scriptSource.slice(photoStart, photoEnd);
    assert.match(guesses, /if \(acertou\)[\s\S]*?style\.filter = "blur\(0px\) grayscale\(0%\)";/);
    assert.match(guesses, /else if \(tentativasFoto\.length >= MAX_TENTATIVAS_FOTO\)[\s\S]*?style\.filter = "blur\(0px\) grayscale\(0%\)";/);
});

console.log(`photo-progression.test.js: ${scenarios} cenários aprovados`);
