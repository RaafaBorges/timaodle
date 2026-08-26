"use strict";

const assert = require("node:assert/strict");
const photoMode = require("../photo-mode.js");
const photoCatalog = require("../photo-catalog.js");
const autocomplete = require("../autocomplete.js");
const sharing = require("../sharing.js");
const core = require("../core.js");

class ClassList {
    constructor(classes = []) { this.classes = new Set(classes); }
    add(...names) { names.forEach(name => this.classes.add(name)); }
    remove(...names) { names.forEach(name => this.classes.delete(name)); }
    toggle(name, active) { active ? this.add(name) : this.remove(name); }
    contains(name) { return this.classes.has(name); }
}

class ElementMock {
    constructor(tagName = "div", classes = []) {
        this.tagName = tagName;
        this.classList = new ClassList(classes);
        this.listeners = new Map();
        this.attributes = new Map();
        this.dataset = {};
        this.children = [];
        this.style = {};
        this.value = "";
        this.innerText = "";
        this.textContent = "";
        this._innerHTML = "";
        this.disabled = false;
    }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type).add(listener);
    }
    dispatch(type, event = {}) { for (const listener of this.listeners.get(type) || []) listener(event); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    removeAttribute(name) { this.attributes.delete(name); }
    appendChild(child) { this.children.push(child); }
    getElementsByTagName(tag) { return this.children.filter(child => child.tagName === tag); }
    scrollIntoView() {}
    set innerHTML(value) { this._innerHTML = value; if (value === "") this.children = []; }
    get innerHTML() { return this._innerHTML; }
}

class DocumentMock extends ElementMock {
    constructor() { super("document"); }
    createElement(tagName) { return new ElementMock(tagName); }
}

const players = [
    { nome: "Ado", estreia: 1970 },
    { nome: "Basílio", estreia: 1975 },
    { nome: "Cássio", estreia: 2012 },
    { nome: "Danilo", estreia: 2010 },
    { nome: "Emerson", estreia: 2011 },
    { nome: "Fagner", estreia: 2014 },
    { nome: "Gil", estreia: 2013 }
];

function criarAmbiente({ saveInicial = null, tutorialVisto = false, data = "2026-08-25" } = {}) {
    const documentApi = new DocumentMock();
    const elements = {
        view: new ElementMock("section", ["hidden"]),
        playButton: new ElementMock("button"),
        backButton: new ElementMock("button"),
        image: new ElementMock("img"),
        dots: new ElementMock(),
        attemptsLabel: new ElementMock(),
        difficultyBadge: new ElementMock("span", ["hidden"]),
        searchInput: new ElementMock("input"),
        autocompleteList: new ElementMock(),
        attemptsList: new ElementMock(),
        endMessage: new ElementMock("p", ["hidden"]),
        shareButton: new ElementMock("button", ["hidden"]),
        grayscaleToggle: new ElementMock("button", ["active"]),
        tutorialCloseButton: new ElementMock("button")
    };
    elements.shareButton.innerText = "COMPARTILHAR RESULTADO";
    const catalog = photoCatalog.createPhotoCatalog({
        jogadores: players,
        manifesto: players.map(player => player.nome),
        hashString: core.hashString
    });
    let save = saveInicial ? structuredClone(saveInicial) : null;
    const saves = [];
    const progress = [];
    const shared = [];
    const photos = [];
    let completions = 0;
    let celebrations = 0;
    let tutorialOpen = 0;
    let tutorialClose = 0;
    let seen = tutorialVisto;
    let beforeOpen = 0;
    let backs = 0;
    const mode = photoMode.createPhotoMode({
        documentApi,
        elements,
        getDate: () => data,
        getCatalog: () => catalog,
        autocomplete: { create: autocomplete.criarAutocomplete, filter: autocomplete.filtrarSugestoes },
        storage: {
            load: () => save ? structuredClone(save) : null,
            save: state => {
                save = structuredClone(state);
                saves.push(structuredClone(state));
                progress.push(state.status);
            }
        },
        sharing: {
            build: sharing.gerarTextoCompartilhamentoFoto,
            share: async (text, button) => { shared.push({ text, button }); return true; },
            getChallengeNumber: () => 235,
            getDefaultFeedbackButton: () => null,
            officialUrl: "https://timaodle.net"
        },
        tutorial: {
            isSeen: () => seen,
            markSeen: () => { seen = true; },
            open: () => { tutorialOpen++; },
            close: () => { tutorialClose++; }
        },
        navigation: {
            beforeOpen: async () => { beforeOpen++; },
            back: () => { backs++; }
        },
        setPlayerPhoto: (element, player) => { photos.push(player.nome); element.src = catalog.caminhoFoto(player.nome); },
        onCelebrate: () => { celebrations++; },
        onComplete: () => { completions++; }
    });
    function selecionar(player) {
        elements.searchInput.value = player.nome;
        elements.searchInput.dispatch("input");
        const option = elements.autocompleteList.children.find(item => item.innerText === player.nome);
        assert.ok(option, `sugestão ausente: ${player.nome}`);
        option.dispatch("click", { target: option });
    }
    return {
        mode, elements, catalog, saves, progress, shared, photos, selecionar,
        getSave: () => save,
        getCompletions: () => completions,
        getCelebrations: () => celebrations,
        getTutorialOpen: () => tutorialOpen,
        getTutorialClose: () => tutorialClose,
        isTutorialSeen: () => seen,
        getBeforeOpen: () => beforeOpen,
        getBacks: () => backs
    };
}

const tests = [];
function test(name, callback) { tests.push([name, callback]); }

test("contratos browser e Node", () => {
    assert.equal(globalThis.TimaodlePhotoMode, photoMode);
    assert.equal(typeof photoMode.createPhotoMode, "function");
});

test("novo dia seleciona jogador, dificuldade e salva estado playing", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    const secret = env.catalog.jogadorDoDia("2026-08-25");
    assert.equal(env.mode.getSecretPlayer(), secret);
    assert.deepEqual(env.getSave(), { data: "2026-08-25", jogadorNome: secret.nome, tentativas: [], status: "playing" });
    assert.equal(env.elements.difficultyBadge.textContent, env.catalog.dificuldade(secret).label);
    assert.equal(env.photos.at(-1), secret.nome);
});

test("tentativa zero inicia em 9px e seis dots", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    assert.equal(env.elements.image.style.filter, "blur(9px) grayscale(100%)");
    assert.equal(env.elements.dots.children.length, 6);
    assert.equal(env.elements.attemptsLabel.innerText, "0 / 6 TENTATIVAS");
});

test("cinco erros percorrem 7 5 3 1 0 sem concluir antes da hora", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    const secret = env.mode.getSecretPlayer();
    const wrong = players.filter(player => player !== secret).slice(0, 5);
    const filtros = [];
    wrong.forEach(player => { env.selecionar(player); filtros.push(env.elements.image.style.filter); });
    assert.deepEqual(filtros, [
        "blur(7px) grayscale(80%)", "blur(5px) grayscale(60%)", "blur(3px) grayscale(40%)",
        "blur(1px) grayscale(20%)", "blur(0px) grayscale(0%)"
    ]);
    assert.equal(env.mode.getState().status, "playing");
});

test("vitória em 1 de 6 revela, salva e emite callbacks", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    env.selecionar(env.mode.getSecretPlayer());
    assert.equal(env.mode.getState().status, "won");
    assert.equal(env.elements.image.style.filter, "blur(0px) grayscale(0%)");
    assert.equal(env.elements.attemptsLabel.innerText, "1 / 6 TENTATIVAS");
    assert.equal(env.getCelebrations(), 1);
    assert.equal(env.getCompletions(), 1);
});

test("derrota em seis erros revela e não celebra", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    const secret = env.mode.getSecretPlayer();
    players.filter(player => player !== secret).slice(0, 6).forEach(env.selecionar);
    assert.equal(env.mode.getState().status, "lost");
    assert.equal(env.elements.attemptsLabel.innerText, "6 / 6 TENTATIVAS");
    assert.equal(env.elements.image.style.filter, "blur(0px) grayscale(0%)");
    assert.equal(env.getCelebrations(), 0);
    assert.equal(env.getCompletions(), 1);
});

test("save adapter recebe tentativa e status na mesma sequência", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    env.selecionar(env.mode.getSecretPlayer());
    assert.deepEqual(env.progress, ["playing", "playing", "won"]);
});

test("F5 em andamento restaura lista dots filtro e exclusão do autocomplete", () => {
    const base = criarAmbiente({ tutorialVisto: true });
    base.mode.start();
    const wrong = players.find(player => player !== base.mode.getSecretPlayer());
    base.selecionar(wrong);
    const env = criarAmbiente({ saveInicial: base.getSave(), tutorialVisto: true });
    env.mode.start();
    assert.equal(env.elements.attemptsList.children.length, 1);
    assert.equal(env.elements.image.style.filter, "blur(7px) grayscale(80%)");
    env.elements.searchInput.value = wrong.nome;
    env.elements.searchInput.dispatch("input");
    assert.equal(env.elements.autocompleteList.children.length, 0);
});

test("F5 concluído restaura resultado estático sem callbacks", () => {
    const data = "2026-08-25";
    const catalog = criarAmbiente({ tutorialVisto: true }).catalog;
    const secret = catalog.jogadorDoDia(data);
    const env = criarAmbiente({ saveInicial: { data, jogadorNome: secret.nome, tentativas: [secret.nome], status: "won" }, tutorialVisto: true });
    env.mode.start();
    assert.equal(env.elements.shareButton.classList.contains("hidden"), false);
    assert.match(env.elements.endMessage.innerHTML, /Isso aí/);
    assert.equal(env.getCompletions(), 0);
    assert.equal(env.getCelebrations(), 0);
});

test("reentrada não duplica tentativas nem listeners", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    const wrong = players.find(player => player !== env.mode.getSecretPlayer());
    env.selecionar(wrong);
    env.mode.start();
    assert.equal(env.elements.attemptsList.children.length, 1);
    for (const element of [env.elements.playButton, env.elements.backButton, env.elements.grayscaleToggle, env.elements.shareButton, env.elements.tutorialCloseButton]) {
        assert.equal(element.listeners.get("click").size, 1);
    }
});

test("contraste alterna grayscale e ARIA sem mudar blur", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    env.elements.grayscaleToggle.dispatch("click");
    assert.equal(env.elements.image.style.filter, "blur(9px) grayscale(0%)");
    assert.equal(env.elements.grayscaleToggle.getAttribute("aria-pressed"), "false");
    env.elements.grayscaleToggle.dispatch("click");
    assert.equal(env.elements.image.style.filter, "blur(9px) grayscale(100%)");
});

test("autocomplete preserva ordem e seleção", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    env.elements.searchInput.value = "a";
    env.elements.searchInput.dispatch("input");
    const encontrados = env.elements.autocompleteList.children.map(item => item.innerText);
    assert.deepEqual(encontrados, autocomplete.filtrarSugestoes(env.catalog.jogadores(), "a", { getLabel: player => player.nome }).map(player => player.nome));
});

test("sharing preserva builder anti-spoiler e botão de feedback", async () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    const secret = env.mode.getSecretPlayer();
    env.selecionar(secret);
    await env.mode.share(env.elements.shareButton);
    assert.match(env.shared[0].text, /TIMÃODLE — FOTO #235/);
    assert.match(env.shared[0].text, /GANHOU — 1\/6/);
    assert.ok(!env.shared[0].text.includes(secret.nome));
    assert.equal(env.shared[0].button, env.elements.shareButton);
});

test("tutorial abre apenas quando não visto", () => {
    const primeira = criarAmbiente();
    primeira.mode.start();
    assert.equal(primeira.getTutorialOpen(), 1);
    primeira.elements.tutorialCloseButton.dispatch("click");
    assert.equal(primeira.isTutorialSeen(), true);
    assert.equal(primeira.getTutorialClose(), 1);
    const vista = criarAmbiente({ tutorialVisto: true });
    vista.mode.start();
    assert.equal(vista.getTutorialOpen(), 0);
});

test("contagem regressiva substitui label somente após conclusão", () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.mode.start();
    env.mode.atualizarContagemRegressiva("01:02:03");
    assert.equal(env.elements.attemptsLabel.innerText, "0 / 6 TENTATIVAS");
    env.selecionar(env.mode.getSecretPlayer());
    env.mode.atualizarContagemRegressiva("01:02:03");
    assert.equal(env.elements.attemptsLabel.innerText, "Próximo em 01:02:03");
});

test("listeners de navegação abrem e voltam pelo adapter", async () => {
    const env = criarAmbiente({ tutorialVisto: true });
    env.elements.playButton.dispatch("click");
    await Promise.resolve();
    assert.equal(env.elements.view.classList.contains("hidden"), false);
    assert.equal(env.getBeforeOpen(), 1);
    env.elements.backButton.dispatch("click");
    assert.equal(env.elements.view.classList.contains("hidden"), true);
    assert.equal(env.getBacks(), 1);
});

test("duas instâncias mantêm estados independentes", () => {
    const primeira = criarAmbiente({ tutorialVisto: true });
    const segunda = criarAmbiente({ tutorialVisto: true, data: "2026-08-26" });
    primeira.mode.start();
    segunda.mode.start();
    primeira.selecionar(primeira.mode.getSecretPlayer());
    assert.equal(primeira.mode.getState().status, "won");
    assert.equal(segunda.mode.getState().status, "playing");
    assert.equal(segunda.mode.getAttempts().length, 0);
});

Promise.resolve().then(async () => {
    for (const [name, callback] of tests) {
        try { await callback(); }
        catch (error) { error.message = `${name}: ${error.message}`; throw error; }
    }
    console.log(`photo-mode.test.js: ${tests.length} cenários aprovados`);
}).catch(error => {
    console.error(error);
    process.exitCode = 1;
});
