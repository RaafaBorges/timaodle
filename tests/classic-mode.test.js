"use strict";

const assert = require("node:assert/strict");
const classic = require("../classic-mode.js");
const autocomplete = require("../autocomplete.js");
const sharing = require("../sharing.js");
const core = require("../core.js");

class ClassList {
    constructor(classes = []) { this.classes = new Set(classes); }
    add(...names) { names.forEach(name => this.classes.add(name)); }
    remove(...names) { names.forEach(name => this.classes.delete(name)); }
    contains(name) { return this.classes.has(name); }
    toggle(name, active) { active ? this.add(name) : this.remove(name); }
}

class ElementMock {
    constructor(tagName = "div", classes = []) {
        this.tagName = tagName;
        this.classList = new ClassList(classes);
        this.children = [];
        this.listeners = new Map();
        this.attributes = new Map();
        this.dataset = {};
        this.value = "";
        this.innerText = "";
        this._innerHTML = "";
        this.disabled = false;
        this.scrollTop = 0;
    }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type).add(listener);
    }
    removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
    dispatch(type, event = {}) { for (const listener of this.listeners.get(type) || []) listener(event); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    removeAttribute(name) { this.attributes.delete(name); }
    appendChild(child) { this.children.push(child); }
    insertBefore(child, before) {
        if (!before) this.children.push(child);
        else this.children.splice(this.children.indexOf(before), 0, child);
    }
    get firstChild() { return this.children[0] || null; }
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
    { nome: "Ángel", posicao: "ATA", nacionalidade: "Paraguai", estreia: 2014, pe: "Direito", titulos: "2x Paulista", gols: 50, assistencias: 20 },
    { nome: "Cássio", posicao: "GOL", nacionalidade: "Brasil", estreia: 2012, pe: "Esquerdo", titulos: "Libertadores, Mundial", gols: 0, assistencias: null },
    { nome: "Sócrates", posicao: "MEI", nacionalidade: "Brasil", estreia: 1978, pe: "Direito", titulos: "Paulista", gols: 172, assistencias: undefined }
];

function criarAmbiente({ saveInicial = null, date = "2026-08-25" } = {}) {
    const documentApi = new DocumentMock();
    const elements = {
        searchInput: new ElementMock("input"),
        autocompleteList: new ElementMock("div"),
        attemptsContainer: new ElementMock("div"),
        endMessage: new ElementMock("p", ["hidden"]),
        shareButton: new ElementMock("button", ["hidden"]),
        pageContent: new ElementMock("main")
    };
    elements.shareButton.innerText = "Compartilhar resultado";
    let save = saveInicial ? structuredClone(saveInicial) : null;
    const saves = [];
    const scheduled = [];
    const completions = [];
    const shared = [];
    let wins = 0;
    let celebrations = 0;
    let alerts = 0;
    const mode = classic.createClassicMode({
        documentApi,
        elements,
        getPlayers: () => players,
        getDate: () => date,
        hashString: core.hashString,
        autocomplete: { create: autocomplete.criarAutocomplete, filter: autocomplete.filtrarSugestoes },
        storage: {
            load: () => save ? structuredClone(save) : null,
            save: state => { save = structuredClone(state); saves.push(structuredClone(state)); }
        },
        sharing: {
            build: sharing.gerarTextoCompartilhamentoClassico,
            share: async (text, options) => { shared.push({ text, options }); return { status: "shared" }; }
        },
        getChallengeNumber: () => 42,
        officialUrl: "timaodle.net",
        onWin: () => wins++,
        onComplete: () => completions.push("classic"),
        celebrate: () => celebrations++,
        alertApi: () => alerts++,
        schedule: (callback, delay) => scheduled.push({ callback, delay })
    });
    function flush() {
        while (scheduled.length) {
            scheduled.sort((a, b) => a.delay - b.delay);
            scheduled.shift().callback();
        }
    }
    function selecionar(nome) {
        elements.searchInput.value = nome;
        elements.searchInput.dispatch("input");
        assert.equal(elements.autocompleteList.children.length, 1, nome);
        elements.autocompleteList.children[0].dispatch("click", { target: elements.autocompleteList.children[0] });
    }
    return {
        mode, elements, documentApi, saves, scheduled, completions, shared,
        getSave: () => save, getWins: () => wins, getCelebrations: () => celebrations,
        getAlerts: () => alerts, flush, selecionar
    };
}

const tests = [];
function test(name, callback) { tests.push([name, callback]); }

test("contratos browser e Node", () => {
    assert.equal(globalThis.TimaodleClassic, classic);
    assert.equal(typeof classic.createClassicMode, "function");
});

test("seleção diária preserva hash módulo pool", () => {
    for (const date of ["2025-01-01", "2026-08-25", "2028-12-31"]) {
        assert.equal(classic.selecionarJogadorDiario(players, date, core.hashString), players[core.hashString(date) % players.length]);
    }
});

test("novo dia inicializa e salva estado playing", () => {
    const env = criarAmbiente();
    env.mode.start();
    assert.deepEqual(env.getSave(), { data: "2026-08-25", tentativas: [], status: "playing" });
    assert.equal(env.mode.getState().status, "playing");
    assert.equal(env.elements.attemptsContainer.children.length, 0);
});

test("save em andamento restaura tentativas sem duplicar", () => {
    const env = criarAmbiente({ saveInicial: { data: "2026-08-25", tentativas: ["Ángel", "Cássio"], status: "playing" } });
    env.mode.start();
    assert.equal(env.elements.attemptsContainer.children.length, 2);
    env.mode.start();
    assert.equal(env.elements.attemptsContainer.children.length, 2);
    assert.equal(env.scheduled.length, 0);
});

test("save concluído restaura resultado sem overlay ou celebração", () => {
    const secret = classic.selecionarJogadorDiario(players, "2026-08-25", core.hashString);
    const env = criarAmbiente({ saveInicial: { data: "2026-08-25", tentativas: [secret.nome], status: "won" } });
    env.mode.start();
    assert.equal(env.elements.endMessage.classList.contains("hidden"), false);
    assert.equal(env.elements.shareButton.classList.contains("hidden"), false);
    assert.deepEqual(env.completions, []);
    assert.equal(env.getCelebrations(), 0);
});

test("comparações preservam oito colunas reais", () => {
    const result = classic.criarComparacoes(players[0], players[1]);
    assert.equal(result.length, 8);
    assert.equal(result[0].texto, "Ángel");
});

test("texto, números e setas permanecem idênticos", () => {
    assert.deepEqual(classic.compararTexto("Brasil", "Brasil"), { classe: "correct", texto: "Brasil" });
    assert.deepEqual(classic.compararNumero(9, 10), { classe: "wrong", texto: "9 ↑" });
    assert.deepEqual(classic.compararNumero(11, 10), { classe: "wrong", texto: "11 ↓" });
});

test("zero permanece valor real", () => {
    assert.deepEqual(classic.compararNumero(0, 0), { classe: "correct", texto: "0" });
    assert.deepEqual(classic.compararNumero(0, 1), { classe: "wrong", texto: "0 ↑" });
});

test("null undefined e vazio permanecem ausência", () => {
    assert.deepEqual(classic.compararNumero(null, 1), { classe: "wrong", texto: "—" });
    assert.deepEqual(classic.compararNumero(undefined, undefined), { classe: "correct", texto: "—" });
    assert.equal(classic.atributoAusente("  "), true);
});

test("títulos preservam correto parcial e errado", () => {
    assert.equal(classic.compararTitulos("2x Paulista", "2x Paulista").classe, "correct");
    assert.equal(classic.compararTitulos("Paulista, Brasileiro", "2x Paulista").classe, "partial");
    assert.equal(classic.compararTitulos("Libertadores", "Paulista").classe, "wrong");
});

test("tentativa errada incrementa, salva e aplica shake", () => {
    const env = criarAmbiente();
    env.mode.start();
    const secret = env.mode.getSecretPlayer();
    const wrong = players.find(player => player !== secret);
    env.selecionar(wrong.nome);
    assert.deepEqual(env.getSave().tentativas, [wrong.nome]);
    assert.equal(env.getSave().status, "playing");
    env.flush();
    assert.equal(env.elements.attemptsContainer.children[0].classList.contains("shake"), true);
    assert.deepEqual(env.completions, []);
});

test("tentativa correta salva, vence e conclui após animação", () => {
    const env = criarAmbiente();
    env.mode.start();
    env.selecionar(env.mode.getSecretPlayer().nome);
    assert.equal(env.getSave().tentativas.length, 1);
    env.flush();
    assert.equal(env.getSave().status, "won");
    assert.equal(env.getWins(), 1);
    assert.equal(env.getCelebrations(), 1);
    assert.deepEqual(env.completions, ["classic"]);
});

test("cada escrita passa pelo adapter de save", () => {
    const env = criarAmbiente();
    env.mode.start();
    env.selecionar(env.mode.getSecretPlayer().nome);
    env.flush();
    assert.deepEqual(env.saves.map(save => save.status), ["playing", "playing", "won"]);
});

test("autocomplete exclui tentativa já feita", () => {
    const env = criarAmbiente();
    env.mode.start();
    const wrong = players.find(player => player !== env.mode.getSecretPlayer());
    env.selecionar(wrong.nome);
    env.elements.searchInput.value = wrong.nome;
    env.elements.searchInput.dispatch("input");
    assert.equal(env.elements.autocompleteList.children.length, 0);
});

test("sharing mantém builder e opções byte-for-byte", async () => {
    const env = criarAmbiente();
    env.mode.start();
    env.selecionar(env.mode.getSecretPlayer().nome);
    env.flush();
    await env.mode.compartilharResultado();
    const expectedGrid = classic.criarGridEmojis(env.getSave().tentativas, players, env.mode.getSecretPlayer());
    const expected = sharing.gerarTextoCompartilhamentoClassico({ numero: 42, tentativas: 1, grid: expectedGrid, url: "timaodle.net" });
    assert.equal(env.shared[0].text, expected);
    assert.deepEqual(env.shared[0].options, { copiarAoCancelar: true });
});

test("duas instâncias mantêm estado independente", () => {
    const one = criarAmbiente({ date: "2026-08-25" });
    const two = criarAmbiente({ date: "2026-08-26" });
    one.mode.start();
    two.mode.start();
    one.selecionar(one.mode.getSecretPlayer().nome);
    assert.equal(one.mode.getState().tentativas.length, 1);
    assert.equal(two.mode.getState().tentativas.length, 0);
});

(async () => {
    let scenarios = 0;
    for (const [name, callback] of tests) {
        try { await callback(); scenarios++; }
        catch (error) { error.message = `${name}: ${error.message}`; throw error; }
    }
    console.log(`classic-mode.test.js: ${scenarios} cenários aprovados`);
})().catch(error => { console.error(error); process.exit(1); });
