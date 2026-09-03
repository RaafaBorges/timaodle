"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const LineupMode = require("../lineup-mode.js");
let scenarios = 0, assertions = 0;
const tests = [];
const test = (name, run) => tests.push({ name, run });
const equal = (a, b, m) => { assertions++; assert.equal(a, b, m); };
const deepEqual = (a, b, m) => { assertions++; assert.deepEqual(a, b, m); };
const match = (a, b, m) => { assertions++; assert.match(a, b, m); };
const ok = (a, m) => { assertions++; assert.ok(a, m); };
class Classes { constructor() { this.items = new Set(); } add(...xs) { xs.forEach(x => this.items.add(x)); } remove(...xs) { xs.forEach(x => this.items.delete(x)); } contains(x) { return this.items.has(x); } }
class El {
    constructor() { this.classList = new Classes(); this.className = ""; this.innerText = ""; this.value = ""; this.disabled = false; this.style = {}; this.dataset = {}; this.children = []; this.listeners = {}; this._html = ""; }
    set innerHTML(v) { this._html = v; this.children = []; } get innerHTML() { return this._html; }
    appendChild(x) { this.children.push(x); return x; } focus() { this.focused = true; }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    async click() { for (const fn of this.listeners.click || []) await fn(); }
}
const partida = {
    id: "santos-2005", competicao: "BRASILEIRO 2005", mandante: "Corinthians", visitante: "Santos", local_tag: "CASA", data: "31 de julho de 2005", estadio: "Pacaembu", placar_real: { mandante: 7, visitante: 1 },
    jogadores_visiveis: Array.from({ length: 8 }, (_, i) => ({ nome: `Visível ${i}`, posicao_abrev: "MEI", top: i < 4 ? 70 : 40, left: i * 10 })),
    jogadores_ocultos: [
        { slot_id: "slot-3", nome_correto: "Betão", posicao_abrev: "ZAG", top: 72, left: 40 },
        { slot_id: "slot-5", nome_correto: "Marcelo Mattos", posicao_abrev: "VOL", top: 50, left: 65 },
        { slot_id: "slot-7", nome_correto: "Carlos Alberto", posicao_abrev: "MEI", top: 30, left: 50 }
    ]
};
const names = "competition matchup localTag dateStadium scoreGuess homeName awayName awayCrest homeScoreInput awayScoreInput confirmScoreButton scoreResult homeNameResult awayNameResult awayCrestResult finalScore scoreGuessResult lineupCard progress dots missing pitch searchInput autocompleteList feedback outsideList endMessage completionCard summaryRealScore summaryGuess summaryGuessStatus summaryHits summaryErrors summaryErrorDetails shareButton".split(" ");
function save(overrides = {}) { return { data: "2026-09-02", partidaId: "santos-2005", etapa: "placar", palpiteMandante: null, palpiteVisitante: null, nomesResolvidos: [], nomesForaDaLista: [], errosEscalacao: 0, exactScore: null, concluido: false, ...overrides }; }
function setup(saved = null) {
    const elements = Object.fromEntries(names.map(n => [n, new El()])); const timers = [], saves = [], events = []; let ac, payload;
    const documentApi = { createElement: () => new El(), getElementById: () => new El() };
    const players = [...partida.jogadores_visiveis, ...partida.jogadores_ocultos.map(x => ({ nome: x.nome_correto })), { nome: "Sócrates" }];
    const mode = LineupMode.createLineupMode({ documentApi, elements, lineupCore: { selecionarPartidaDoDia: d => (events.push(`select:${d}`), partida) }, getDate: () => "2026-09-02", getPlayers: () => players,
        storage: { load: context => (events.push("load"), setup.context = context, saved && structuredClone(saved)), save: state => (saves.push(structuredClone(state)), events.push(`save:${state.etapa}`)) },
        createAutocomplete: config => (ac = config, { fechar: () => events.push("close") }), filterSuggestions: (pool, query, options) => ({ pool, query, options }), getPlayerPhoto: n => n === "Betão" ? "betao.webp" : null,
        buildShareText: p => (payload = p, "texto-onze"), shareText: async text => (events.push(`share:${text}`), { status: "copied" }), onCelebrate: () => events.push("celebrate"), onComplete: () => events.push("complete"), setTimeoutFn: (fn, delay) => (timers.push({ fn, delay }), timers.length) });
    return { mode, elements, timers, saves, events, players, ac: () => ac, payload: () => payload };
}
function active(overrides = {}) { const e = setup(save({ etapa: "escalacao", palpiteMandante: 7, palpiteVisitante: 1, exactScore: true, ...overrides })); e.mode.start(); return e; }

test("API e constantes", () => { equal(typeof LineupMode.createLineupMode, "function"); equal(LineupMode.STORAGE_KEY, "timaodle_escalacao_daily_state"); equal(LineupMode.REVEAL_DELAY_MS, 500); });
test("estado encapsulado", () => { const e = setup(); equal(e.mode.getState(), null); equal(Object.keys(e.mode).length, 9); });
test("seleção via core", () => { const e = setup(); e.mode.start(); equal(e.events[0], "select:2026-09-02"); equal(e.mode.getMatch().id, "santos-2005"); });
test("novo save com shape exato", () => { const e = setup(); e.mode.start(); deepEqual(e.saves[0], save()); equal(Object.keys(e.saves[0]).length, 10); });
test("contexto da partida", () => { const e = setup(); e.mode.start(); equal(e.elements.competition.innerText, "BRASILEIRO 2005"); equal(e.elements.matchup.innerText, "Corinthians — Santos"); equal(e.elements.dateStadium.innerText, "31 de julho de 2005 · Pacaembu"); });
test("placar começa obrigatório", () => { const e = setup(); e.mode.start(); equal(e.elements.homeScoreInput.value, ""); equal(e.elements.awayScoreInput.value, ""); ok(e.elements.lineupCard.classList.contains("hidden")); });
test("placar inválido", async () => { const e = setup(); e.mode.start(); await e.elements.confirmScoreButton.click(); equal(e.mode.getState().etapa, "placar"); equal(e.elements.homeScoreInput.focused, true); });
test("placar exato", async () => { const e = setup(); e.mode.start(); e.elements.homeScoreInput.value = "7"; e.elements.awayScoreInput.value = "1"; await e.elements.confirmScoreButton.click(); equal(e.mode.getState().exactScore, true); equal(e.saves.at(-1).etapa, "escalacao"); ok(!e.elements.lineupCard.classList.contains("hidden")); });
test("placar incorreto", async () => { const e = setup(); e.mode.start(); e.elements.homeScoreInput.value = "1"; e.elements.awayScoreInput.value = "0"; await e.elements.confirmScoreButton.click(); equal(e.mode.getState().exactScore, false); match(e.elements.scoreGuessResult.className, /errou/); });
test("campo 11 8 3", () => { const e = active(); equal(e.elements.pitch.children.length, 11); equal(e.elements.pitch.children.filter(x => x.innerHTML.includes("slot-btn")).length, 3); equal(e.elements.pitch.children.length - 3, 8); });
test("slots congelados", () => { deepEqual(partida.jogadores_ocultos.map(x => x.slot_id), ["slot-3", "slot-5", "slot-7"]); const html = active().elements.pitch.children.map(x => x.innerHTML).join(" "); match(html, /slot-btn-slot-3/); match(html, /slot-btn-slot-7/); });
test("coordenadas", () => { const e = active(); equal(e.elements.pitch.children[0].style.top, "70%"); equal(e.elements.pitch.children[0].style.left, "0%"); match(e.elements.pitch.children[0].className, /dense-line/); });
test("foto e fallback", () => { const html = active({ nomesResolvidos: ["Betão"] }).elements.pitch.children.map(x => x.innerHTML).join(" "); match(html, /betao\.webp/); match(html, /chip-dot/); });
test("autocomplete pool e limite", () => { const e = setup(); const r = e.ac().obterSugestoes("be"); equal(e.ac().prefixo, "lineup"); equal(r.pool.length, e.players.length); equal(r.options.limite, 8); });
test("autocomplete avatar", () => { const e = active(), item = new El(); e.ac().renderizarOpcao(item, { nome: "Betão" }); match(item.innerHTML, /autocomplete-avatar-img/); match(item.innerHTML, /Betão/); });
test("duplicado", () => { const e = active(), n = e.saves.length; e.mode.processGuess("Visível 0"); equal(e.mode.getHits(), 0); equal(e.saves.length, n); match(e.elements.feedback.innerText, /já está/); });
test("acerto e save", () => { const e = active(); e.mode.processGuess("Betão"); equal(e.mode.getHits(), 1); deepEqual(e.mode.getState().nomesResolvidos, ["Betão"]); equal(e.elements.progress.innerText, "1/3 JOGADORES"); });
test("atraso de 500 ms", () => { const e = active(); e.mode.processGuess("Betão"); equal(e.timers.at(-1).delay, 500); equal(e.elements.pitch.children.some(x => x.innerHTML.includes("Betão")), false); e.timers.at(-1).fn(); equal(e.elements.pitch.children.some(x => x.innerHTML.includes("Betão")), true); });
test("Fora repetido", () => { const e = active(); e.mode.processGuess("Sócrates"); e.mode.processGuess("Sócrates"); equal(e.mode.getErrors(), 2); deepEqual(e.mode.getOutsideNames(), ["Sócrates"]); equal(e.mode.getState().errosEscalacao, 2); });
test("Fora persistido e visual", () => { const e = active(); e.mode.processGuess("Sócrates"); deepEqual(e.saves.at(-1).nomesForaDaLista, ["Sócrates"]); match(e.elements.outsideList.innerHTML, /Sócrates/); match(e.elements.feedback.innerText, /não estava/); });
test("progresso 0 a 3", () => { const e = active(); equal(e.elements.progress.innerText, "0/3 JOGADORES"); equal(e.elements.dots.children.length, 3); e.mode.processGuess("Betão"); equal(e.elements.progress.innerText, "1/3 JOGADORES"); });
test("F5 restaura runtime", () => { const e = active({ nomesResolvidos: ["Betão"], nomesForaDaLista: ["Sócrates"], errosEscalacao: 2 }); equal(e.mode.getHits(), 1); equal(e.mode.getErrors(), 2); deepEqual(e.mode.getOutsideNames(), ["Sócrates"]); });
test("legado partidaId null", () => { const e = active({ partidaId: null }); equal(e.mode.getState().partidaId, "santos-2005"); equal(e.saves[0].partidaId, "santos-2005"); });
test("conclusão salva antes dos efeitos", () => { const e = active({ nomesResolvidos: ["Betão", "Marcelo Mattos"] }); e.mode.processGuess("Carlos Alberto"); equal(e.mode.getState().concluido, false); e.timers.at(-1).fn(); equal(e.mode.getState().concluido, true); ok(e.events.indexOf("save:concluido") < e.events.indexOf("celebrate")); ok(e.events.indexOf("celebrate") < e.events.indexOf("complete")); });
test("efeitos únicos", () => { const e = active({ nomesResolvidos: ["Betão", "Marcelo Mattos"] }); e.mode.processGuess("Carlos Alberto"); e.timers.at(-1).fn(); equal(e.events.filter(x => x === "celebrate").length, 1); equal(e.events.filter(x => x === "complete").length, 1); });
test("resultado estático", () => { const e = active({ nomesResolvidos: partida.jogadores_ocultos.map(x => x.nome_correto), concluido: true, etapa: "concluido", errosEscalacao: 1 }); equal(e.elements.summaryRealScore.innerText, "7–1"); equal(e.elements.summaryHits.innerText, "3/3"); equal(e.elements.summaryErrors.innerText, "1"); ok(!e.elements.completionCard.classList.contains("hidden")); });
test("reentrada sem overlay", () => { const e = active({ nomesResolvidos: partida.jogadores_ocultos.map(x => x.nome_correto), concluido: true, etapa: "concluido" }); equal(e.events.includes("complete"), false); equal(e.events.includes("celebrate"), false); equal(e.elements.searchInput.disabled, true); });
test("sharing e countdown global", async () => { const e = active({ concluido: true, etapa: "concluido", errosEscalacao: 2 }); await e.mode.share(); equal(e.events.includes("share:texto-onze"), true); equal(e.payload().total, 3); equal(e.payload().erros, 2); const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8"); match(script, /escNextChallengeCountdownEl\.innerText = texto/); match(script, /setInterval\(atualizarTimer, 1000\)/); for (const n of ["dadosEscalacao", "nomesJaResolvidos", "nomesForaDaLista", "acertosEscalacao", "errosEscalacao", "estadoEscalacao"]) equal(new RegExp(`let ${n}`).test(script), false); });

(async () => { for (const t of tests) { try { await t.run(); scenarios++; } catch (e) { e.message = `${t.name}: ${e.message}`; throw e; } } console.log(`lineup-mode.test.js: ${scenarios} cenários, ${assertions} assertions aprovadas`); })().catch(e => { console.error(e); process.exitCode = 1; });
