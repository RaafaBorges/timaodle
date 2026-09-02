"use strict";

const assert = require("node:assert/strict");
const moreLessMode = require("../more-less-mode.js");
const moreLessCore = require("../more-less-core.js");
const sharingModule = require("../sharing.js");

class ClassList {
    constructor(classes = []) { this.classes = new Set(classes); }
    add(...names) { names.forEach(name => this.classes.add(name)); }
    remove(...names) { names.forEach(name => this.classes.delete(name)); }
    toggle(name, active) { active ? this.add(name) : this.remove(name); }
    contains(name) { return this.classes.has(name); }
}

class ElementMock {
    constructor(classes = []) {
        this.classList = new ClassList(classes);
        this.listeners = new Map();
        this.children = [];
        this.innerText = "";
        this._innerHTML = "";
        this.disabled = false;
        this.offsetWidth = 100;
    }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type).add(listener);
    }
    dispatch(type) { return Promise.all([...this.listeners.get(type) || []].map(listener => listener())); }
    appendChild(child) { this.children.push(child); }
    set innerHTML(value) { this._innerHTML = value; if (value === "") this.children = []; }
    get innerHTML() { return this._innerHTML; }
}

const criarJogadores = (valores = [100, 120, 90, 90, 140, 80, 160, 70, 180, 60, 200]) =>
    valores.map((jogos, indice) => ({ nome: `Jogador ${indice}`, jogos, nacionalidade: "Brasil", posicao: "Meia" }));

function criarEstado(jogadores, rodadaAtual, acertos, status = "playing") {
    return {
        data: "2026-08-25",
        rodadaAtual,
        acertos,
        referenciaAtualNome: jogadores[rodadaAtual].nome,
        historico: Array.from({ length: rodadaAtual }, (_, indice) => ({ candidato: jogadores[indice + 1].nome, correto: indice < acertos })),
        status,
        versaoAlgoritmo: 2,
        sequenciaNomes: jogadores.map(jogador => jogador.nome),
        sequenciaJogadores: jogadores.map(jogador => ({ ...jogador }))
    };
}

function criarAmbiente({ jogadores = criarJogadores(), saveInicial = null } = {}) {
    const elemento = classes => new ElementMock(classes);
    const elements = {
        view: elemento(), playButton: elemento(), backButton: elemento(), roundLabel: elemento(),
        dots: elemento(), hitsLabel: elemento(), referencePhoto: elemento(), referenceName: elemento(),
        referenceMeta: elemento(), referenceStat: elemento(), referenceStatLabel: elemento(),
        candidatePhoto: elemento(), candidateName: elemento(), candidateMeta: elemento(),
        candidateStat: elemento(), candidateStatLabel: elemento(), candidateRow: elemento(),
        dividerText: elemento(), lessButton: elemento(), moreButton: elemento(), roundResult: elemento(["hidden"]),
        endMessage: elemento(["hidden"]), shareButton: elemento(["hidden"]), card: elemento()
    };
    let save = saveInicial ? structuredClone(saveInicial) : null;
    const saves = [];
    const timers = new Map();
    const cleared = [];
    const shared = [];
    let nextTimer = 1;
    let celebrations = 0;
    let completions = 0;
    let loadedStates = 0;
    let opens = 0;
    let loads = 0;
    let backs = 0;
    const mode = moreLessMode.createMoreLessMode({
        documentApi: { createElement: () => elemento() },
        elements,
        getDate: () => "2026-08-25",
        getPlayers: () => jogadores,
        isEligiblePlayer: jogador => jogador && Number.isFinite(jogador.jogos),
        core: {
            generateV1: () => jogadores,
            generateV2: () => ({ sequencia: jogadores, planoDificuldades: Array(10).fill("facil"), planoDirecoes: Array(10).fill("mais") }),
            direction: moreLessCore.direcaoComparacaoMM
        },
        storage: {
            load: () => save ? structuredClone(save) : null,
            save: estado => { save = structuredClone(estado); saves.push(structuredClone(estado)); }
        },
        onStateLoaded: () => { loadedStates++; },
        sharing: {
            build: sharingModule.gerarTextoCompartilhamentoMM,
            share: async (texto, botao) => { shared.push({ texto, botao }); return true; },
            getChallengeNumber: () => 235,
            getDefaultFeedbackButton: () => null,
            officialUrl: "https://timaodle.net"
        },
        navigation: {
            beforeOpen: () => { opens++; },
            loadData: async () => { loads++; },
            back: () => { backs++; }
        },
        setPlayerPhoto: (element, jogador) => { element.player = jogador.nome; },
        onCelebrate: () => { celebrations++; },
        onComplete: () => { completions++; },
        setTimeoutFn: (callback, delay) => { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
        clearTimeoutFn: id => { cleared.push(id); timers.delete(id); }
    });
    const runTimer = () => {
        const [id, timer] = timers.entries().next().value || [];
        if (!timer) return;
        timers.delete(id);
        timer.callback();
    };
    return {
        mode, elements, jogadores, saves, timers, cleared, shared, runTimer,
        getSave: () => save,
        getCelebrations: () => celebrations,
        getCompletions: () => completions,
        getLoadedStates: () => loadedStates,
        getOpens: () => opens,
        getLoads: () => loads,
        getBacks: () => backs
    };
}

const tests = [];
function test(name, callback) { tests.push([name, callback]); }

test("contratos browser e Node", () => {
    assert.equal(globalThis.TimaodleMoreLessMode, moreLessMode);
    assert.equal(typeof moreLessMode.createMoreLessMode, "function");
    assert.equal(moreLessMode.RODADAS_MM, 10);
    assert.equal(moreLessMode.MIN_ACERTOS_MM, 7);
    assert.equal(moreLessMode.ATRASO_AVANCO_MM, 1500);
});

test("novo dia cria save v2 com snapshot e planos intactos", () => {
    const env = criarAmbiente();
    env.mode.start();
    assert.equal(env.getSave().status, "playing");
    assert.equal(env.getSave().sequenciaJogadores.length, 11);
    assert.equal(env.getSave().planoDificuldades.length, 10);
    assert.equal(env.getSave().planoDirecoes.length, 10);
});

test("render inicial mantém dez rodadas e referência/candidato", () => {
    const env = criarAmbiente();
    env.mode.start();
    assert.equal(env.elements.dots.children.length, 10);
    assert.equal(env.elements.roundLabel.innerText, "Rodada 1/10");
    assert.equal(env.elements.referenceName.innerText, "Jogador 0");
    assert.equal(env.elements.candidateStat.innerText, "?");
});

test("resposta mais correta atualiza feedback, acerto e save", () => {
    const env = criarAmbiente();
    env.mode.start();
    env.mode.respond("mais");
    assert.equal(env.mode.getHits(), 1);
    assert.equal(env.getSave().rodadaAtual, 1);
    assert.ok(env.elements.moreButton.classList.contains("correct"));
});

test("resposta errada revela direção correta", () => {
    const env = criarAmbiente();
    env.mode.start();
    env.mode.respond("menos");
    assert.equal(env.mode.getHits(), 0);
    assert.ok(env.elements.lessButton.classList.contains("wrong"));
    assert.ok(env.elements.moreButton.classList.contains("correct-answer"));
});

test("empate aceita qualquer direção e preserva texto", () => {
    const jogadores = criarJogadores([90, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]);
    const env = criarAmbiente({ jogadores });
    env.mode.start();
    env.mode.respond("menos");
    assert.equal(env.mode.getHits(), 1);
    assert.ok(env.elements.roundResult.classList.contains("tie"));
    assert.match(env.elements.roundResult.innerHTML, /mesmo número de jogos/);
});

test("transição bloqueia resposta dupla e mantém um único timer", () => {
    const env = criarAmbiente();
    env.mode.start();
    env.mode.respond("mais");
    env.mode.respond("mais");
    assert.equal(env.mode.getRound(), 1);
    assert.equal(env.timers.size, 1);
    assert.equal([...env.timers.values()][0].delay, 1500);
});

test("timer de 1500 ms avança e libera a próxima rodada", () => {
    const env = criarAmbiente();
    env.mode.start();
    env.mode.respond("mais");
    env.runTimer();
    assert.equal(env.elements.roundLabel.innerText, "Rodada 2/10");
    assert.equal(env.mode.isTransitioning(), false);
});

test("F5 restaura rodada, acertos, histórico e snapshot", () => {
    const jogadores = criarJogadores();
    const salvo = criarEstado(jogadores, 4, 3);
    const env = criarAmbiente({ jogadores, saveInicial: salvo });
    env.mode.start();
    assert.equal(env.mode.getRound(), 4);
    assert.equal(env.mode.getHits(), 3);
    assert.equal(env.getLoadedStates(), 1);
    assert.equal(env.elements.dots.children.filter(dot => dot.classList.contains("used")).length, 3);
});

test("save legado sem snapshot regenera v1 uma vez", () => {
    const jogadores = criarJogadores();
    const salvo = { data: "2026-08-25", rodadaAtual: 0, acertos: 0, referenciaAtualNome: jogadores[0].nome, historico: [], status: "playing" };
    const env = criarAmbiente({ jogadores, saveInicial: salvo });
    env.mode.start();
    assert.equal(env.getSave().versaoAlgoritmo, 1);
    assert.equal(env.getSave().sequenciaJogadores.length, 11);
});

test("resultado concluído restaura estático sem overlay", () => {
    const jogadores = criarJogadores();
    const env = criarAmbiente({ jogadores, saveInicial: criarEstado(jogadores, 10, 7, "won") });
    env.mode.start();
    assert.equal(env.getCompletions(), 0);
    assert.ok(!env.elements.shareButton.classList.contains("hidden"));
    assert.match(env.elements.endMessage.innerHTML, /VITÓRIA/);
});

test("6 de 10 conclui como derrota após atraso", () => {
    const jogadores = criarJogadores([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]);
    const env = criarAmbiente({ jogadores, saveInicial: criarEstado(jogadores, 9, 6) });
    env.mode.start();
    env.mode.respond("menos");
    assert.equal(env.getSave().status, "lost");
    env.runTimer();
    assert.equal(env.getCompletions(), 1);
    assert.equal(env.getCelebrations(), 0);
});

test("7 de 10 conclui como vitória e celebra", () => {
    const jogadores = criarJogadores([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]);
    const env = criarAmbiente({ jogadores, saveInicial: criarEstado(jogadores, 9, 6) });
    env.mode.start();
    env.mode.respond("mais");
    assert.equal(env.getSave().status, "won");
    env.runTimer();
    assert.equal(env.getCelebrations(), 1);
    assert.match(env.elements.endMessage.innerHTML, /7<span>\/10/);
});

test("10 de 10 preserva resultado perfeito", () => {
    const jogadores = criarJogadores([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]);
    const env = criarAmbiente({ jogadores, saveInicial: criarEstado(jogadores, 9, 9) });
    env.mode.start();
    env.mode.respond("mais");
    env.runTimer();
    assert.equal(env.mode.getHits(), 10);
    assert.match(env.elements.endMessage.innerHTML, /10<span>\/10/);
});

test("sharing permanece sem nomes ou direções", async () => {
    const jogadores = criarJogadores();
    const env = criarAmbiente({ jogadores, saveInicial: criarEstado(jogadores, 10, 7, "won") });
    env.mode.start();
    await env.mode.share(env.elements.shareButton);
    assert.match(env.shared[0].texto, /GANHOU — 7\/10 ACERTOS/);
    assert.ok(!env.shared[0].texto.includes("Jogador"));
});

test("countdown só substitui o rótulo após conclusão", () => {
    const jogadores = criarJogadores();
    const env = criarAmbiente({ jogadores, saveInicial: criarEstado(jogadores, 10, 7, "won") });
    env.mode.start();
    env.mode.updateCountdown("01:02:03");
    assert.equal(env.elements.roundLabel.innerText, "Próximo em 01:02:03");
});

test("play/back carregam dados, cancelam timer e preservam listeners únicos", async () => {
    const env = criarAmbiente();
    assert.equal(env.elements.moreButton.listeners.get("click").size, 1);
    await env.elements.playButton.dispatch("click");
    assert.equal(env.getOpens(), 1);
    assert.equal(env.getLoads(), 1);
    env.mode.respond("mais");
    await env.elements.backButton.dispatch("click");
    assert.equal(env.getBacks(), 1);
    assert.equal(env.timers.size, 0);
    assert.ok(env.elements.view.classList.contains("hidden"));
});

(async () => {
    let scenarios = 0;
    for (const [name, callback] of tests) {
        try {
            await callback();
            scenarios++;
        } catch (error) {
            error.message = `${name}: ${error.message}`;
            throw error;
        }
    }
    console.log(`more-less-mode.test.js: ${scenarios} cenários aprovados`);
})().catch(error => {
    console.error(error);
    process.exit(1);
});
