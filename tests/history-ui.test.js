"use strict";

const assert = require("node:assert/strict");
const HistoryUI = require("../history-ui.js");
const historyStats = require("../history-stats.js");

const TODAY = "2026-08-21";
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

class FakeClassList {
    constructor() { this.values = new Set(); }
    add(...names) { names.forEach(name => this.values.add(name)); }
    remove(...names) { names.forEach(name => this.values.delete(name)); }
    toggle(name, force) {
        const active = force === undefined ? !this.values.has(name) : Boolean(force);
        if (active) this.values.add(name); else this.values.delete(name);
        return active;
    }
    contains(name) { return this.values.has(name); }
}

class FakeElement {
    constructor(tagName = "div") {
        this.tagName = tagName.toUpperCase();
        this.children = [];
        this.listeners = new Map();
        this.attributes = new Map();
        this.classList = new FakeClassList();
        this.className = "";
        this.dataset = {};
        this.disabled = false;
        this.tabIndex = 0;
        this.textContent = "";
        this.modeRows = null;
        this.focused = false;
    }
    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }
    dispatch(type, event = {}) {
        for (const listener of this.listeners.get(type) || []) listener({ target: this, ...event });
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name); }
    appendChild(child) { this.children.push(child); return child; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = [...children]; }
    contains(target) { return this === target || this.children.some(child => child.contains?.(target)); }
    focus() { this.focused = true; }
    closest(selector) {
        return selector === ".history-day-button" && this.className.includes("history-day-button") ? this : null;
    }
    descendants() { return this.children.flatMap(child => [child, ...(child.descendants?.() || [])]); }
    querySelector(selector) {
        const mode = selector.match(/^\[data-history-mode="([^"]+)"\]$/)?.[1];
        if (mode && this.modeRows) return this.modeRows[mode] || null;
        const date = selector.match(/^\[data-history-date="([^"]+)"\]$/)?.[1];
        if (date) return this.descendants().find(item => item.dataset?.historyDate === date) || null;
        return null;
    }
    querySelectorAll(selector) {
        if (selector === ".history-day-button") {
            return this.descendants().filter(item => item.className.includes("history-day-button"));
        }
        return [];
    }
}

function emptyDay() {
    return historyStats.criarResumoDiaVazio();
}

function completeDay() {
    return {
        classic: { started: true, completed: true, outcome: "won", attempts: 1 },
        photo: { started: true, completed: true, outcome: "won", attempts: 2 },
        moreLess: { started: true, completed: true, outcome: "won", hits: 8, rounds: 10 },
        lineup: { started: true, completed: true, outcome: "won", phase: "completed", resolved: 3, total: 3, errors: 0, exactScore: true },
        complete: true,
        completionCelebrated: false
    };
}

function createFixture(history = { version: 1, trackingStartedAt: "2026-06-15", days: {} }) {
    const names = [
        "openButton", "modal", "closeButton", "previousMonth", "nextMonth", "monthTitle",
        "calendarGrid", "daySummary", "summaryEmpty", "noRecord", "dayDetails",
        "selectedDateTitle", "classicSummary", "photoSummary", "moreLessSummary",
        "lineupSummary", "lineupExactScore", "overallProgress", "historicalStreak",
        "historicalStreakText"
    ];
    const elements = Object.fromEntries(names.map(name => [name, new FakeElement()]));
    elements.dayDetails.modeRows = Object.fromEntries(
        ["classic", "photo", "moreLess", "lineup"].map(name => [name, new FakeElement()])
    );
    const dialogEvents = [];
    const mode = HistoryUI.createHistoryUI({
        documentApi: { createElement: tag => new FakeElement(tag) },
        elements,
        getHistory: () => history,
        getCurrentDate: () => TODAY,
        openDialog: (...args) => dialogEvents.push(["open", ...args]),
        closeDialog: (...args) => dialogEvents.push(["close", ...args])
    });
    return { mode, elements, dialogEvents };
}

test("contratos Node e browser expõem a factory", () => {
    assert.equal(typeof HistoryUI.createHistoryUI, "function");
    assert.equal(globalThis.TimaodleHistoryUI, HistoryUI);
});

test("API pública mantém factory coesa e helpers sob calendar", () => {
    assert.deepEqual(Object.keys(HistoryUI).sort(), ["CLASSES_ESTADO_HISTORICO", "MESES_HISTORICO", "calendar", "createHistoryUI"]);
    assert.equal(Object.keys(HistoryUI.calendar).length, 13);
});

test("init registra listeners uma única vez", () => {
    const { mode, elements } = createFixture();
    mode.init();
    mode.init();
    assert.equal(elements.openButton.listeners.get("click").length, 1);
    assert.equal(elements.calendarGrid.listeners.get("keydown").length, 1);
});

test("open inicializa mês, seleção, foco e dialog", () => {
    const { mode, elements, dialogEvents } = createFixture();
    mode.init();
    elements.openButton.dispatch("click");
    assert.deepEqual(mode.getState(), {
        year: 2026, month: 8, selectedDate: TODAY, focusedDate: TODAY,
        history: { version: 1, trackingStartedAt: "2026-06-15", days: {} }, today: TODAY
    });
    assert.equal(elements.monthTitle.textContent, "AGOSTO 2026");
    assert.equal(dialogEvents[0][0], "open");
});

test("grade renderiza offsets e todos os dias do mês", () => {
    const { mode, elements } = createFixture();
    mode.open();
    const grade = HistoryUI.calendar.gerarGradeMensalHistorico(2026, 8, mode.getState().history, TODAY);
    assert.equal(elements.calendarGrid.children.length, grade.firstWeekOffset + 31);
    assert.equal(elements.calendarGrid.querySelectorAll(".history-day-button").length, 31);
});

test("dia atual preserva seleção, aria-current e roving tabindex", () => {
    const { mode, elements } = createFixture();
    mode.open();
    const todayButton = elements.calendarGrid.querySelector(`[data-history-date="${TODAY}"]`);
    assert.equal(todayButton.getAttribute("aria-current"), "date");
    assert.equal(todayButton.getAttribute("aria-pressed"), "true");
    assert.equal(todayButton.tabIndex, 0);
});

test("navegação para mês anterior preserva limites", () => {
    const { mode, elements } = createFixture();
    mode.init();
    mode.open();
    elements.previousMonth.dispatch("click");
    assert.deepEqual([mode.getState().year, mode.getState().month], [2026, 7]);
    assert.equal(elements.monthTitle.textContent, "JULHO 2026");
    assert.equal(elements.nextMonth.disabled, false);
});

test("teclado move foco sem alterar seleção", () => {
    const { mode, elements } = createFixture();
    mode.init();
    mode.open();
    const todayButton = elements.calendarGrid.querySelector(`[data-history-date="${TODAY}"]`);
    let prevented = false;
    elements.calendarGrid.dispatch("keydown", {
        target: todayButton,
        key: "ArrowLeft",
        preventDefault: () => { prevented = true; }
    });
    assert.equal(prevented, true);
    assert.equal(mode.getState().focusedDate, "2026-08-20");
    assert.equal(mode.getState().selectedDate, TODAY);
});

test("resumo completo preserva modos, placar exato e streak", () => {
    const history = { version: 1, trackingStartedAt: "2026-08-20", days: {
        "2026-08-20": completeDay(), [TODAY]: completeDay()
    } };
    const { mode, elements } = createFixture(history);
    mode.open();
    assert.equal(elements.classicSummary.textContent, "Concluído · 1 tentativa");
    assert.equal(elements.lineupExactScore.classList.contains("hidden"), false);
    assert.equal(elements.overallProgress.textContent, "4/4 DESAFIOS");
    assert.equal(elements.historicalStreakText.textContent, "Sequência até este dia: 2 dias");
});

test("close delega foco e lifecycle ao adapter de dialog", () => {
    const { mode, elements, dialogEvents } = createFixture({ version: 1, trackingStartedAt: TODAY, days: { [TODAY]: emptyDay() } });
    mode.open();
    mode.close();
    assert.deepEqual(dialogEvents.at(-1), ["close", elements.modal, elements.openButton]);
});

console.log(`history-ui.test.js: ${scenarios} cenários aprovados`);
