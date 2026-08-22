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

const modeConfig = {
    classic: { label: "CLÁSSICO" },
    photo: { label: "FOTO" },
    moreLess: { label: "MAIS OU MENOS" },
    lineup: { label: "ONZE INICIAL" }
};

const { modosPendentesResultado } = compileFunctions(["modosPendentesResultado"], {
    FINAL_RESULT_MODES: modeConfig
});

test("continuidade filtra modo atual e concluídos", () => {
    const progresso = { modes: {
        classic: { started: true, completed: true },
        photo: { started: false, completed: false },
        moreLess: { started: true, completed: false },
        lineup: { started: true, completed: true }
    }};
    assert.deepEqual(modosPendentesResultado("classic", progresso), [
        { tipo: "photo", label: "FOTO", status: "NÃO INICIADO" },
        { tipo: "moreLess", label: "MAIS OU MENOS", status: "EM ANDAMENTO" }
    ]);
});

test("4/4 não oferece continuidade", () => {
    const completed = { started: true, completed: true };
    assert.deepEqual(modosPendentesResultado("lineup", { modes: {
        classic: completed, photo: completed, moreLess: completed, lineup: completed
    }}), []);
});

function apiFoto(estado) {
    return compileFunctions(["gerarTextoCompartilhamentoFoto"], {
        numeroDoDesafio: () => 235,
        getDataLocalString: () => "2026-08-22",
        estadoFotoDiario: estado,
        MAX_TENTATIVAS_FOTO: 6,
        URL_OFICIAL_TIMAODLE: "https://timaodle.net"
    });
}

test("compartilhamento Foto cobre vitória sem spoiler", () => {
    const secret = "Jogador Ultrassecreto";
    const texto = apiFoto({ status: "won", tentativas: ["A", secret] }).gerarTextoCompartilhamentoFoto();
    assert.match(texto, /TIMÃODLE — FOTO #235/);
    assert.match(texto, /GANHOU — 2\/6/);
    assert.ok(!texto.includes(secret));
    assert.ok(!texto.includes("A\n"));
});

test("compartilhamento Foto cobre derrota sem resposta", () => {
    const tentativas = ["A", "B", "C", "D", "E", "F"];
    const texto = apiFoto({ status: "lost", tentativas }).gerarTextoCompartilhamentoFoto();
    assert.match(texto, /PERDEU — 6\/6/);
    tentativas.forEach(nome => assert.ok(!texto.includes(`${nome}\n`)));
});

function apiMM(estado, acertos = 7) {
    return compileFunctions(["gerarTextoCompartilhamentoMM"], {
        numeroDoDesafio: () => 235,
        getDataLocalString: () => "2026-08-22",
        estadoMMDiario: estado,
        acertosMM: acertos,
        RODADAS_MM: 10,
        URL_OFICIAL_TIMAODLE: "https://timaodle.net"
    });
}

test("compartilhamento MM resume rodadas sem jogadores ou respostas", () => {
    const secret = "Sequência Ultrassecreta";
    const historico = Array.from({ length: 10 }, (_, index) => ({
        candidato: `${secret} ${index}`,
        correto: index < 8,
        direcao: index % 2 ? "mais" : "menos"
    }));
    const texto = apiMM({ status: "won", historico }, 8).gerarTextoCompartilhamentoMM();
    assert.match(texto, /TIMÃODLE — MAIS OU MENOS #235/);
    assert.match(texto, /GANHOU — 8\/10 ACERTOS/);
    assert.ok(!texto.includes(secret));
    assert.ok(!texto.includes("mais"));
    assert.ok(!texto.includes("menos\n"));
});

test("overlay abre somente em conclusões imediatas", () => {
    assert.match(scriptSource, /mostrarFimDeJogo\(comAnimacao\)[\s\S]*?if \(comAnimacao\)[\s\S]*?abrirResultadoFinal\("classic"\)/);
    assert.match(scriptSource, /mostrarFimDeJogoMM\(comAnimacao\)[\s\S]*?if \(comAnimacao\) abrirResultadoFinal\("moreLess"\)/);
    assert.ok(!/iniciarDesafioDiario\(\)[\s\S]{0,1200}abrirResultadoFinal/.test(scriptSource));
    assert.ok(!/iniciarDesafioFotoDoDia\(\)[\s\S]{0,2200}abrirResultadoFinal/.test(scriptSource));
});

test("fechar, Home, Escape e navegação pendente usam infraestrutura compartilhada", () => {
    for (const token of [
        'finalResultCloseBtn?.addEventListener("click", fecharResultadoFinal)',
        'finalResultHomeBtn?.addEventListener("click", voltarParaHomeDoResultado)',
        'button.addEventListener("click", () => navegarDoResultadoParaModo(tipo))',
        'modalAtivo === finalResultModal',
        'prenderFocoNoModal(event, modalAtivo)'
    ]) assert.ok(scriptSource.includes(token), token);
});

console.log(`final-result.test.js: ${scenarios} cenários aprovados`);
