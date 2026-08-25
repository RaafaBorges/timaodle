"use strict";

const assert = require("node:assert/strict");
const ui = require("../ui.js");

class ClassList {
    constructor(classes = []) { this.classes = new Set(classes); }
    add(name) { this.classes.add(name); }
    remove(name) { this.classes.delete(name); }
    contains(name) { return this.classes.has(name); }
}

class EventTargetMock {
    constructor() { this.listeners = new Map(); }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type).add(listener);
    }
    removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
    dispatch(type, event = {}) { for (const listener of this.listeners.get(type) || []) listener(event); }
}

function criarElemento(documentApi, { hidden = false, visible = true } = {}) {
    const elemento = new EventTargetMock();
    elemento.classList = new ClassList(hidden ? ["hidden"] : []);
    elemento.focus = () => { documentApi.activeElement = elemento; };
    elemento.getClientRects = () => visible ? [{}] : [];
    elemento.closest = selector => selector === ".hidden" && elemento.hiddenAncestor ? {} : null;
    return elemento;
}

function criarAmbiente() {
    const documentApi = new EventTargetMock();
    documentApi.body = { classList: new ClassList() };
    documentApi.dialogs = [];
    documentApi.querySelector = selector => selector === ".modal:not(.hidden)"
        ? documentApi.dialogs.find(dialog => !dialog.classList.contains("hidden")) || null : null;
    const dialog = criarElemento(documentApi, { hidden: true });
    dialog.focusables = [];
    dialog.querySelectorAll = selector => { dialog.lastSelector = selector; return dialog.focusables; };
    documentApi.dialogs.push(dialog);
    return { documentApi, dialog, api: ui.criarInfraestruturaDialogs(documentApi) };
}

function tecla(key, shiftKey = false) {
    return { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
}

let scenarios = 0;
function test(name, callback) {
    try { callback(); scenarios++; }
    catch (error) { error.message = `${name}: ${error.message}`; throw error; }
}

test("contrato CommonJS e global", () => {
    assert.equal(globalThis.TimaodleUI, ui);
    assert.equal(typeof ui.criarInfraestruturaDialogs, "function");
});

test("filtra focáveis invisíveis com o seletor legado", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    const visivel = criarElemento(documentApi);
    dialog.focusables = [visivel, criarElemento(documentApi, { visible: false })];
    assert.deepEqual(api.elementosFocaveisDoDialog(dialog), [visivel]);
    assert.match(dialog.lastSelector, /button:not\(\[disabled\]\)/);
    assert.match(dialog.lastSelector, /\[tabindex\]:not\(\[tabindex="-1"\]\)/);
});

test("abre, bloqueia scroll e prioriza foco inicial", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    const origem = criarElemento(documentApi);
    const inicial = criarElemento(documentApi);
    dialog.focusables = [criarElemento(documentApi)];
    api.abrirDialog(dialog, origem, inicial);
    assert.equal(dialog.classList.contains("hidden"), false);
    assert.equal(documentApi.body.classList.contains("modal-open"), true);
    assert.equal(documentApi.activeElement, inicial);
});

test("abertura usa primeiro focável e depois o diálogo", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    const primeiro = criarElemento(documentApi);
    dialog.focusables = [primeiro];
    api.abrirDialog(dialog);
    assert.equal(documentApi.activeElement, primeiro);
    dialog.classList.add("hidden");
    dialog.focusables = [];
    api.abrirDialog(dialog);
    assert.equal(documentApi.activeElement, dialog);
});

test("Tab e Shift+Tab circulam nos extremos", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    const primeiro = criarElemento(documentApi);
    const ultimo = criarElemento(documentApi);
    dialog.classList.remove("hidden");
    dialog.focusables = [primeiro, ultimo];
    documentApi.activeElement = ultimo;
    const tab = tecla("Tab");
    api.prenderFocoNoDialog(tab, dialog);
    assert.equal(tab.prevented, true);
    assert.equal(documentApi.activeElement, primeiro);
    const shiftTab = tecla("Tab", true);
    api.prenderFocoNoDialog(shiftTab, dialog);
    assert.equal(shiftTab.prevented, true);
    assert.equal(documentApi.activeElement, ultimo);
});

test("trap cobre zero e um focável", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    dialog.classList.remove("hidden");
    const vazio = tecla("Tab");
    api.prenderFocoNoDialog(vazio, dialog);
    assert.equal(vazio.prevented, true);
    assert.equal(documentApi.activeElement, dialog);
    const unico = criarElemento(documentApi);
    dialog.focusables = [unico];
    documentApi.activeElement = unico;
    const tab = tecla("Tab");
    api.prenderFocoNoDialog(tab, dialog);
    assert.equal(tab.prevented, true);
    assert.equal(documentApi.activeElement, unico);
});

test("fecha, restaura foco e preserva lock com outro diálogo", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    const origem = criarElemento(documentApi);
    const outro = criarElemento(documentApi);
    outro.querySelectorAll = () => [];
    documentApi.dialogs.push(outro);
    api.abrirDialog(dialog, origem);
    api.fecharDialog(dialog);
    assert.equal(documentApi.body.classList.contains("modal-open"), true);
    assert.equal(documentApi.activeElement, origem);
    outro.classList.add("hidden");
    api.fecharDialog(dialog);
    assert.equal(documentApi.body.classList.contains("modal-open"), false);
});

test("origem oculta usa fallback de foco", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    const origem = criarElemento(documentApi);
    const fallback = criarElemento(documentApi);
    origem.hiddenAncestor = true;
    api.abrirDialog(dialog, origem);
    api.fecharDialog(dialog, fallback);
    assert.equal(documentApi.activeElement, fallback);
});

test("Escape fecha diálogo ativo e Tab usa o registro", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    let fechamentos = 0;
    const unico = criarElemento(documentApi);
    dialog.classList.remove("hidden");
    dialog.focusables = [unico];
    documentApi.activeElement = unico;
    api.registrarDialogs([{ dialog, onClose: () => fechamentos++, fecharNoBackdrop: true }]);
    documentApi.dispatch("keydown", tecla("Escape"));
    assert.equal(fechamentos, 1);
    const tab = tecla("Tab");
    documentApi.dispatch("keydown", tab);
    assert.equal(tab.prevented, true);
});

test("backdrop ignora conteúdo interno", () => {
    const { dialog, api } = criarAmbiente();
    let fechamentos = 0;
    api.registrarDialogs([{ dialog, onClose: () => fechamentos++, fecharNoBackdrop: true }]);
    dialog.dispatch("click", { target: {} });
    dialog.dispatch("click", { target: dialog });
    assert.equal(fechamentos, 1);
});

test("diálogo configurado sem backdrop não fecha por clique", () => {
    const { dialog, api } = criarAmbiente();
    let fechamentos = 0;
    api.registrarDialogs([{ dialog, onClose: () => fechamentos++, fecharNoBackdrop: false }]);
    dialog.dispatch("click", { target: dialog });
    assert.equal(fechamentos, 0);
});

test("cleanup permite novo ciclo sem callbacks duplicados", () => {
    const { documentApi, dialog, api } = criarAmbiente();
    let fechamentos = 0;
    dialog.classList.remove("hidden");
    const config = [{ dialog, onClose: () => fechamentos++, fecharNoBackdrop: true }];
    const removerPrimeiro = api.registrarDialogs(config);
    removerPrimeiro();
    documentApi.dispatch("keydown", tecla("Escape"));
    dialog.dispatch("click", { target: dialog });
    assert.equal(fechamentos, 0);
    const removerSegundo = api.registrarDialogs(config);
    documentApi.dispatch("keydown", tecla("Escape"));
    dialog.dispatch("click", { target: dialog });
    assert.equal(fechamentos, 2);
    removerSegundo();
});

console.log(`ui.test.js: ${scenarios} cenários aprovados`);
