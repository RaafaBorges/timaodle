"use strict";

const assert = require("node:assert/strict");
const autocomplete = require("../autocomplete.js");

class ClassList {
    constructor() { this.classes = new Set(); }
    toggle(name, active) { active ? this.classes.add(name) : this.classes.delete(name); }
    contains(name) { return this.classes.has(name); }
}

class ElementMock {
    constructor(tagName = "div") {
        this.tagName = tagName;
        this.listeners = new Map();
        this.attributes = new Map();
        this.classList = new ClassList();
        this.dataset = {};
        this.children = [];
        this.value = "";
        this.scrollCount = 0;
    }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type).add(listener);
    }
    removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
    dispatch(type, event = {}) { for (const listener of this.listeners.get(type) || []) listener(event); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    removeAttribute(name) { this.attributes.delete(name); }
    appendChild(child) { this.children.push(child); }
    getElementsByTagName(tag) { return this.children.filter(child => child.tagName === tag); }
    scrollIntoView() { this.scrollCount++; }
    set innerHTML(value) { if (value === "") this.children = []; this._innerHTML = value; }
    get innerHTML() { return this._innerHTML || ""; }
}

class DocumentMock extends ElementMock {
    createElement(tagName) { return new ElementMock(tagName); }
}

function tecla(key, shiftKey = false) {
    return { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
}

function criarInstancia(opcoes = {}) {
    const documentApi = new DocumentMock("document");
    const input = new ElementMock("input");
    const listbox = new ElementMock("div");
    const items = opcoes.items || ["Ángel Romero", "João Victor", "Cássio Ramos"];
    const selecionados = [];
    const api = autocomplete.criarAutocomplete({
        documentApi,
        input,
        listbox,
        prefixo: opcoes.prefixo || "test",
        getLabel: item => item,
        obterSugestoes: busca => autocomplete.filtrarSugestoes(items, busca, opcoes.filtro),
        renderizarOpcao: (elemento, item) => { elemento.innerText = item; },
        onSelect: item => selecionados.push(item),
        estaAtivo: opcoes.estaAtivo,
        rolarOpcaoAtiva: opcoes.rolarOpcaoAtiva
    });
    return { documentApi, input, listbox, selecionados, api };
}

let scenarios = 0;
function test(name, callback) {
    try { callback(); scenarios++; }
    catch (error) { error.message = `${name}: ${error.message}`; throw error; }
}

test("expõe contrato CommonJS e global", () => {
    assert.equal(globalThis.TimaodleAutocomplete, autocomplete);
    assert.equal(typeof autocomplete.criarAutocomplete, "function");
});

test("normaliza acentos e caixa sem alterar espaços internos", () => {
    assert.equal(autocomplete.normalizarTextoBusca("JoÃO ÁNGEL"), "joao angel");
    assert.equal(autocomplete.normalizarTextoBusca("  Cássio  Ramos "), "  cassio  ramos ");
});

test("filtra por substring preservando ordem", () => {
    const items = ["João Pedro", "Cássio Ramos", "João Victor", "Romero"];
    assert.deepEqual(autocomplete.filtrarSugestoes(items, "JOAO"), ["João Pedro", "João Victor"]);
    assert.deepEqual(autocomplete.filtrarSugestoes(items, "ramos"), ["Cássio Ramos"]);
});

test("filtro preserva predicate e limite", () => {
    const items = ["A1", "A2", "A3", "A4"];
    assert.deepEqual(autocomplete.filtrarSugestoes(items, "a", {
        incluir: item => item !== "A2", limite: 2
    }), ["A1", "A3"]);
    assert.deepEqual(autocomplete.filtrarSugestoes(items, "   "), []);
});

test("fixtures dos três modos mantêm sugestões legadas", () => {
    const jogadores = [
        { nome: "Ángel Romero", foto: true }, { nome: "João Victor", foto: false },
        { nome: "João Pedro", foto: true }, { nome: "Cássio Ramos", foto: true },
        { nome: "Romero Britto", foto: true }, { nome: "Fábio Santos", foto: true },
        { nome: "Róger Guedes", foto: true }, { nome: "Renato Augusto", foto: true },
        { nome: "Paulinho", foto: true }, { nome: "Yuri Alberto", foto: true }
    ];
    const getLabel = jogador => jogador.nome;
    const legado = (pool, busca, incluir = () => true, limite) => {
        const valor = busca.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const encontrados = pool.filter(jogador =>
            jogador.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(valor)
            && incluir(jogador)
        );
        return Number.isFinite(limite) ? encontrados.slice(0, limite) : encontrados;
    };
    const casos = ["angel", "João", "ramos", "ro", "renato aug"];
    for (const busca of casos) {
        const tentados = ["João Pedro"];
        assert.deepEqual(
            autocomplete.filtrarSugestoes(jogadores, busca, { getLabel, incluir: j => !tentados.includes(j.nome) }),
            legado(jogadores, busca, j => !tentados.includes(j.nome))
        );
        const fotos = jogadores.filter(j => j.foto);
        assert.deepEqual(
            autocomplete.filtrarSugestoes(fotos, busca, { getLabel, incluir: j => !tentados.includes(j.nome) }),
            legado(fotos, busca, j => !tentados.includes(j.nome))
        );
        assert.deepEqual(
            autocomplete.filtrarSugestoes(jogadores, busca, { getLabel, limite: 8 }),
            legado(jogadores, busca, () => true, 8)
        );
    }
});

test("input abre lista com IDs e ARIA previsíveis", () => {
    const { input, listbox } = criarInstancia({ prefixo: "classic" });
    input.value = "a";
    input.dispatch("input");
    assert.equal(listbox.children.length, 3);
    assert.equal(listbox.children[0].id, "classic-option-0");
    assert.equal(listbox.children[0].getAttribute("role"), "option");
    assert.equal(listbox.children[0].getAttribute("aria-selected"), "false");
    assert.equal(input.getAttribute("aria-expanded"), "true");
});

test("busca vazia e lista sem resultados permanecem fechadas", () => {
    const { input, listbox } = criarInstancia();
    input.value = "   ";
    input.dispatch("input");
    assert.equal(listbox.children.length, 0);
    assert.equal(input.getAttribute("aria-expanded"), "false");
    input.value = "inexistente";
    input.dispatch("input");
    assert.equal(input.getAttribute("aria-expanded"), "false");
});

test("ArrowDown e ArrowUp fazem wrap e sincronizam active descendant", () => {
    const { input, listbox, api } = criarInstancia();
    input.value = "a";
    input.dispatch("input");
    input.dispatch("keydown", tecla("ArrowDown"));
    assert.equal(api.obterIndiceAtivo(), 0);
    assert.equal(input.getAttribute("aria-activedescendant"), "test-option-0");
    assert.equal(listbox.children[0].getAttribute("aria-selected"), "true");
    input.dispatch("keydown", tecla("ArrowUp"));
    assert.equal(api.obterIndiceAtivo(), 2);
    assert.equal(input.getAttribute("aria-activedescendant"), "test-option-2");
});

test("Enter sem índice não seleciona e Enter ativo chama callback", () => {
    const { input, selecionados } = criarInstancia();
    input.value = "a";
    input.dispatch("input");
    const enterVazio = tecla("Enter");
    input.dispatch("keydown", enterVazio);
    assert.equal(enterVazio.prevented, true);
    assert.deepEqual(selecionados, []);
    input.dispatch("keydown", tecla("ArrowDown"));
    input.dispatch("keydown", tecla("Enter"));
    assert.deepEqual(selecionados, ["Ángel Romero"]);
});

test("clique em opção seleciona o item correspondente", () => {
    const { input, listbox, selecionados } = criarInstancia();
    input.value = "joao";
    input.dispatch("input");
    listbox.children[0].dispatch("click", { target: listbox.children[0] });
    assert.deepEqual(selecionados, ["João Victor"]);
});

test("Escape fecha e limpa ARIA e índice", () => {
    const { input, listbox, api } = criarInstancia();
    input.value = "a";
    input.dispatch("input");
    input.dispatch("keydown", tecla("ArrowDown"));
    input.dispatch("keydown", tecla("Escape"));
    assert.equal(listbox.children.length, 0);
    assert.equal(api.obterIndiceAtivo(), -1);
    assert.equal(input.getAttribute("aria-expanded"), "false");
    assert.equal(input.getAttribute("aria-activedescendant"), null);
});

test("clique no input preserva e clique externo fecha", () => {
    const { documentApi, input, listbox } = criarInstancia();
    input.value = "a";
    input.dispatch("input");
    documentApi.dispatch("click", { target: input });
    assert.equal(listbox.children.length, 3);
    documentApi.dispatch("click", { target: {} });
    assert.equal(listbox.children.length, 0);
});

test("instância inativa ignora input e teclado", () => {
    const { input, listbox } = criarInstancia({ estaAtivo: () => false });
    input.value = "a";
    input.dispatch("input");
    input.dispatch("keydown", tecla("ArrowDown"));
    assert.equal(listbox.children.length, 0);
});

test("scroll da opção ativa é configurável", () => {
    const { input, listbox } = criarInstancia({ rolarOpcaoAtiva: true });
    input.value = "a";
    input.dispatch("input");
    input.dispatch("keydown", tecla("ArrowDown"));
    assert.equal(listbox.children[0].scrollCount, 1);
});

test("duas instâncias mantêm índices independentes", () => {
    const primeira = criarInstancia({ prefixo: "one" });
    const segunda = criarInstancia({ prefixo: "two" });
    primeira.input.value = "a";
    segunda.input.value = "a";
    primeira.input.dispatch("input");
    segunda.input.dispatch("input");
    primeira.input.dispatch("keydown", tecla("ArrowDown"));
    primeira.input.dispatch("keydown", tecla("ArrowDown"));
    segunda.input.dispatch("keydown", tecla("ArrowDown"));
    assert.equal(primeira.api.obterIndiceAtivo(), 1);
    assert.equal(segunda.api.obterIndiceAtivo(), 0);
});

test("remoção limpa listeners e permite dois ciclos sem duplicação", () => {
    const ambiente = criarInstancia();
    ambiente.input.value = "a";
    ambiente.input.dispatch("input");
    ambiente.documentApi.dispatch("click", { target: {} });
    assert.equal(ambiente.listbox.children.length, 0);
    ambiente.input.dispatch("input");
    assert.equal(ambiente.listbox.children.length, 3);
    ambiente.input.dispatch("keydown", tecla("ArrowDown"));
    ambiente.input.dispatch("keydown", tecla("Enter"));
    assert.deepEqual(ambiente.selecionados, ["Ángel Romero"]);
    ambiente.api.remover();
    ambiente.input.dispatch("input");
    ambiente.input.dispatch("keydown", tecla("ArrowDown"));
    ambiente.documentApi.dispatch("click", { target: {} });
    assert.equal(ambiente.listbox.children.length, 0);
    assert.equal(ambiente.api.obterIndiceAtivo(), -1);
});

console.log(`autocomplete.test.js: ${scenarios} cenários aprovados`);
