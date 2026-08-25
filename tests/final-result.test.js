"use strict";

const assert = require("node:assert/strict");
const { scriptSource, compileFunctions } = require("./script-harness.js");
const sharing = require("../sharing.js");

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
    return { gerarTextoCompartilhamentoFoto: () => sharing.gerarTextoCompartilhamentoFoto({
        numero: 235,
        tentativas: estado.tentativas.length,
        venceu: estado.status === "won",
        maxTentativas: 6,
        url: "https://timaodle.net"
    }) };
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

function visibilidadeCompartilhamentoFoto(status) {
    const operacoes = [];
    const { atualizarCompartilhamentoEstaticoFoto } = compileFunctions(["atualizarCompartilhamentoEstaticoFoto"], {
        estadoFotoDiario: { status },
        photoShareResultBtn: { classList: { toggle: (...args) => operacoes.push(args) } }
    });
    atualizarCompartilhamentoEstaticoFoto();
    return operacoes;
}

test("resultado estático do Foto oferece Compartilhar em vitória e derrota", () => {
    assert.deepEqual(visibilidadeCompartilhamentoFoto("won"), [["hidden", false]]);
    assert.deepEqual(visibilidadeCompartilhamentoFoto("lost"), [["hidden", false]]);
    assert.deepEqual(visibilidadeCompartilhamentoFoto("playing"), [["hidden", true]]);
});

test("Compartilhar estático reutiliza builder e infraestrutura do overlay", () => {
    const botao = { innerText: "COMPARTILHAR" };
    const recebidos = [];
    const texto = sharing.gerarTextoCompartilhamentoFoto({
        numero: 235, tentativas: 2, venceu: true, maxTentativas: 6, url: "https://timaodle.net"
    });
    const api = compileFunctions(["compartilharResultadoFoto"], {
        gerarTextoCompartilhamentoFoto: () => texto,
        compartilharTextoNovoModo: (texto, feedback) => recebidos.push({ texto, feedback }),
        finalResultShareBtn: null
    });
    api.compartilharResultadoFoto(botao);
    assert.deepEqual(recebidos, [{ texto, feedback: botao }]);
    assert.ok(!recebidos[0].texto.includes("Resposta secreta"));
});

test("restauração do Foto concluído mostra ação estática sem reabrir overlay", () => {
    assert.match(scriptSource, /iniciarDesafioFotoDoDia\(\)[\s\S]*?estadoFotoDiario = salvo;[\s\S]*?atualizarCompartilhamentoEstaticoFoto\(\)/);
    assert.ok(!/iniciarDesafioFotoDoDia\(\)[\s\S]{0,2600}abrirResultadoFinal/.test(scriptSource));
    assert.ok(scriptSource.includes('photoShareResultBtn?.addEventListener("click", () => compartilharResultadoFoto(photoShareResultBtn))'));
});

function apiMM(estado, acertos = 7) {
    return { gerarTextoCompartilhamentoMM: () => sharing.gerarTextoCompartilhamentoMM({
        numero: 235, venceu: estado.status === "won", acertos, rodadas: 10,
        resultados: estado.historico, url: "https://timaodle.net"
    }) };
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

function visibilidadeCompartilhamentoMM(status) {
    const operacoes = [];
    const { atualizarCompartilhamentoEstaticoMM } = compileFunctions(["atualizarCompartilhamentoEstaticoMM"], {
        estadoMMDiario: { status },
        mmShareResultBtn: { classList: { toggle: (...args) => operacoes.push(args) } }
    });
    atualizarCompartilhamentoEstaticoMM();
    return operacoes;
}

test("resultado estático do MM oferece Compartilhar em vitória e derrota", () => {
    assert.deepEqual(visibilidadeCompartilhamentoMM("won"), [["hidden", false]]);
    assert.deepEqual(visibilidadeCompartilhamentoMM("lost"), [["hidden", false]]);
    assert.deepEqual(visibilidadeCompartilhamentoMM("playing"), [["hidden", true]]);
});

test("Compartilhar estático do MM reutiliza builder e preserva limites", () => {
    for (const [status, acertos, esperado] of [["lost", 6, "PERDEU"], ["won", 7, "GANHOU"], ["won", 10, "GANHOU"]]) {
        const botao = { innerText: "COMPARTILHAR" };
        const recebidos = [];
        const segredo = `Jogador secreto ${acertos}`;
        const historico = Array.from({ length: 10 }, (_, indice) => ({
            candidato: `${segredo} ${indice}`,
            correto: indice < acertos,
            direcao: indice % 2 ? "mais" : "menos"
        }));
        const texto = sharing.gerarTextoCompartilhamentoMM({
            numero: 235, venceu: status === "won", acertos, rodadas: 10,
            resultados: historico, url: "https://timaodle.net"
        });
        const api = compileFunctions(["compartilharResultadoMM"], {
            gerarTextoCompartilhamentoMM: () => texto,
            compartilharTextoNovoModo: (texto, feedback) => recebidos.push({ texto, feedback }),
            finalResultShareBtn: null
        });
        api.compartilharResultadoMM(botao);
        assert.deepEqual(recebidos, [{ texto, feedback: botao }]);
        assert.match(recebidos[0].texto, new RegExp(`${esperado} — ${acertos}/10 ACERTOS`));
        assert.ok(!recebidos[0].texto.includes(segredo));
        assert.ok(!recebidos[0].texto.includes("mais\n"));
        assert.ok(!recebidos[0].texto.includes("menos\n"));
    }
});

test("restauração do MM concluído mostra ação estática após o feedback", () => {
    assert.match(scriptSource, /iniciarDesafioMMDoDia\(\)[\s\S]*?if \(!mmAtivo\) \{\s*mostrarFimDeJogoMM\(false\)/);
    assert.match(scriptSource, /function mostrarFimDeJogoMM\(comAnimacao\)[\s\S]*?atualizarCompartilhamentoEstaticoMM\(\)/);
    assert.ok(!/iniciarDesafioMMDoDia\(\)[\s\S]{0,4500}abrirResultadoFinal/.test(scriptSource));
    assert.match(scriptSource, /agendarAvancoAutomaticoMM\(true\)[\s\S]*?function mostrarFimDeJogoMM/);
    assert.ok(scriptSource.includes('mmShareResultBtn?.addEventListener("click", () => compartilharResultadoMM(mmShareResultBtn))'));
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
