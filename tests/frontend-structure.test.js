"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const contract = require("./frontend-contract.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

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

const htmlIds = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match => match[1]);
const htmlIdSet = new Set(htmlIds);

function cssRule(selector) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1] || "";
}

test("IDs do HTML são únicos", () => {
    const duplicates = htmlIds.filter((id, index) => htmlIds.indexOf(id) !== index);
    assert.deepEqual([...new Set(duplicates)], []);
});

test("IDs literais usados por getElementById existem no HTML", () => {
    const referenced = [...script.matchAll(/getElementById\(\s*["']([^"']+)["']\s*\)/g)]
        .map(match => match[1]);
    const missing = [...new Set(referenced)].filter(id => !htmlIdSet.has(id));
    assert.deepEqual(missing, []);
});

for (const [area, ids] of Object.entries(contract.essentialIds)) {
    test(`estrutura essencial: ${area}`, () => {
        const missing = ids.filter(id => !htmlIdSet.has(id));
        assert.deepEqual(missing, []);
    });
}

test("seletores CSS essenciais permanecem definidos", () => {
    const missing = contract.essentialCssSelectors.filter(selector => !css.includes(selector));
    assert.deepEqual(missing, []);
});

test("CSS permanece estruturalmente balanceado", () => {
    const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
    assert.equal((semComentarios.match(/\{/g) || []).length, (semComentarios.match(/\}/g) || []).length);
});

test("classes dinâmicas relevantes permanecem ligadas ao JS", () => {
    const all = [...new Set(Object.values(contract.dynamicClasses).flat())];
    const missing = all.filter(className => !script.includes(className));
    assert.deepEqual(missing, []);
});

test("estados estruturais dos quatro modos têm contrato CSS", () => {
    const stateSelectors = [
        ".home-progress-card.is-complete", ".cell.correct", ".photo-attempt-item.correct",
        ".mm-player-candidate.answer-correct", ".mm-round-feedback.wrong",
        ".player-chip.dense-line", ".slot-btn.correct", ".lineup-result-card"
    ];
    assert.deepEqual(stateSelectors.filter(selector => !css.includes(selector)), []);
});

test("modais preservam semântica e bloqueio de scroll", () => {
    for (const id of ["photoTutorialModal", "integratedStatsModal", "historyModal", "howToPlayModal"]) {
        const tag = html.match(new RegExp(`<[^>]+id=["']${id}["'][^>]*>`, "i"))?.[0] || "";
        assert.match(tag, /role=["']dialog["']/i, id);
        assert.match(tag, /aria-modal=["']true["']/i, id);
        assert.match(tag, /aria-labelledby=/i, id);
    }
    assert.ok(script.includes('classList.add("modal-open")'));
    assert.ok(script.includes('classList.remove("modal-open")'));
});

test("Histórico preserva modal, calendário e estados acessíveis", () => {
    const modal = html.match(/<div[^>]+id=["']historyModal["'][^>]*>/i)?.[0] || "";
    const grid = html.match(/<div[^>]+id=["']historyCalendarGrid["'][^>]*>/i)?.[0] || "";
    assert.match(modal, /role=["']dialog["']/i);
    assert.match(modal, /aria-modal=["']true["']/i);
    assert.match(modal, /aria-labelledby=["']historyModalTitle["']/i);
    assert.match(grid, /role=["']grid["']/i);
    assert.match(html.match(/<h3[^>]+id=["']historyMonthTitle["'][^>]*>/i)?.[0] || "", /aria-live=["']polite["']/i);
    assert.ok(html.includes('id="btnOpenHistory"'));
    assert.ok(html.includes('id="historyPreviousMonth"'));
    assert.ok(html.includes('id="historyNextMonth"'));
    assert.match(cssRule(".history-modal-content"), /width:\s*min\(500px/);
    assert.match(cssRule(".history-modal-content"), /max-height:[^;]*100dvh/);
    assert.match(cssRule(".history-calendar-grid"), /grid-template-columns:\s*repeat\(7/);
    for (const state of ["future", "before-tracking", "no-record", "recorded", "started", "partial", "complete"]) {
        assert.ok(css.includes(`.history-day-cell.is-${state}`), state);
        assert.ok(script.includes(`is-${state}`), state);
    }
    for (const token of [
        'setAttribute("aria-selected"', 'setAttribute("aria-pressed"',
        'setAttribute("aria-current", "date")', "botao.disabled = dia.isFuture || dia.isBeforeTracking",
        "botao.tabIndex = obterTabIndexDiaHistorico", 'addEventListener("keydown", navegarCalendarioHistoricoPorTeclado)',
        "function resolverNavegacaoTecladoHistorico", "function atualizarFocoRovingHistorico",
        "renderizarCalendarioHistorico(false)", "event.preventDefault()",
        "historyPreviousMonth.disabled = !grade.navigation.canGoPrevious",
        "historyNextMonth.disabled = !grade.navigation.canGoNext",
        "abrirModalAcessivel(historyModal", "fecharModalAcessivel(historyModal"
    ]) assert.ok(script.includes(token), token);
    assert.match(script, /button:not\(\[disabled\]\):not\(\[tabindex="-1"\]\)/);
    assert.match(cssRule(".history-day-button:focus-visible"), /outline:/);
});

test("Resumo histórico preserva quatro modos, progresso e estado sem registro", () => {
    for (const id of [
        "historyDaySummary", "historySelectedDateTitle", "historyNoRecord", "historyDayDetails",
        "historyClassicSummary", "historyPhotoSummary", "historyMoreLessSummary",
        "historyLineupSummary", "historyOverallProgress"
    ]) assert.ok(htmlIdSet.has(id), id);
    for (const mode of ["classic", "photo", "moreLess", "lineup"]) {
        assert.ok(html.includes(`data-history-mode="${mode}"`), mode);
    }
    assert.ok(!htmlIdSet.has("historyDayPlaceholder"));
    assert.ok(script.includes("function obterResumoHistoricoDia(data, historico)"));
    assert.ok(script.includes("historyClassicSummary.textContent = resumo.classic.statusText"));
    assert.ok(script.includes("historyPhotoSummary.textContent = resumo.photo.statusText"));
    assert.ok(script.includes("historyMoreLessSummary.textContent = resumo.moreLess.statusText"));
    assert.ok(script.includes("historyLineupSummary.textContent = resumo.lineup.statusText"));
    assert.ok(script.includes('historyOverallProgress.classList.toggle("is-complete", resumo.complete)'));
    for (const selector of [
        ".history-day-summary", ".history-no-record", ".history-mode-summary",
        ".history-exact-score", ".history-overall-progress.is-complete"
    ]) assert.ok(css.includes(selector), selector);
});

test("Estatísticas e Histórico ampliam somente em tablet e desktop", () => {
    assert.equal((css.match(/@media\s*\(min-width:\s*700px\)/g) || []).length, 1);
    const statsDesktop = cssRule("#integratedStatsModal .integrated-stats-modal-content");
    const historyDesktop = cssRule("#historyModal .history-modal-content");
    assert.match(statsDesktop, /width:\s*min\(820px,\s*calc\(100vw - 48px\)\)/);
    assert.match(statsDesktop, /max-width:\s*820px/);
    assert.match(historyDesktop, /width:\s*min\(720px,\s*calc\(100vw - 48px\)\)/);
    assert.match(historyDesktop, /max-width:\s*720px/);
    assert.match(cssRule("#historyModal .history-month-navigation,\n    #historyModal .history-weekdays,\n    #historyModal .history-calendar-grid"), /max-width:\s*620px/);
    assert.match(cssRule(".integrated-mode-grid"), /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(cssRule(".integrated-stats-general"), /repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(cssRule(".history-modal-content"), /width:\s*min\(500px/);
});

test("Como Jogar preserva largura e grid responsivos próprios", () => {
    const modalRule = cssRule(".integrated-stats-modal-content.help-modal-content");
    const gridRule = cssRule(".help-mode-grid");
    assert.match(modalRule, /width:\s*min\(700px/);
    assert.match(modalRule, /max-height:[^;]*100dvh/);
    assert.match(gridRule, /repeat\(auto-fit/);
    assert.match(gridRule, /min\(280px,\s*100%\)/);
    assert.ok(css.includes("word-break: normal"));
});

test("componentes compartilhados preservam base e variantes", () => {
    assert.match(cssRule(".search-box input"), /min-height:\s*50px/);
    assert.match(cssRule(".search-box input:focus"), /box-shadow:[^;]*var\(--gold-soft\)/);
    assert.match(cssRule(".autocomplete-items"), /max-height:\s*190px/);
    assert.match(cssRule(".autocomplete-items div"), /min-height:\s*46px/);
    assert.match(cssRule(".back-btn"), /width:\s*40px/);
    assert.match(cssRule(".daily-status-bar"), /display:\s*flex/);
    assert.match(cssRule(".daily-end-message"), /font-size:\s*14px/);
    assert.ok(css.includes(".share-btn,\n.form-submit-btn"));
    assert.ok(css.includes("#escalacaoView .search-box input"), "variante de busca do Onze Inicial ausente");
});

test("Modo Foto preserva layout fluido e estados visuais próprios", () => {
    assert.match(cssRule("#photoView"), /max-width:\s*400px/);
    assert.match(cssRule("#photoView .photo-card,\n#photoView .photo-attempts-list"), /width:\s*min\(320px,\s*100%\)/);
    assert.match(cssRule("#photoView .photo-card"), /aspect-ratio:\s*1\s*\/\s*1/);
    assert.match(cssRule("#photoView .photo-img"), /object-fit:\s*cover/);
    assert.match(cssRule("#photoView .photo-img"), /object-position:\s*center top/);
    assert.match(cssRule("#photoView .photo-img.image-fallback"), /filter:\s*none\s*!important/);
    for (const selector of [
        "#photoView .photo-dots .dot-attempt.used",
        "#photoView .photo-dots .dot-attempt.wrong-used",
        "#photoView .photo-attempt-item.correct",
        "#photoView .photo-attempt-item.wrong"
    ]) {
        assert.ok(css.includes(selector), selector);
    }
});

test("Modo Clássico preserva oito colunas no desktop e duas no mobile", () => {
    const desktopGrid = cssRule("#gameView .board-header,\n#gameView .attempt-row");
    assert.match(desktopGrid, /grid-template-columns:\s*1\.3fr 1fr 1fr 0\.7fr 1\.15fr 1\.6fr 0\.7fr 0\.75fr/);
    assert.match(cssRule("#gameView .cell"), /word-break:\s*normal/);
    assert.match(cssRule("#gameView .cell"), /overflow-wrap:\s*break-word/);

    const mobileStart = css.indexOf("/* No mobile, Jogador e Títulos");
    const mobileEnd = css.indexOf("/* ==========================================================================\n   MODAL", mobileStart);
    const mobileCss = css.slice(mobileStart, mobileEnd);
    assert.match(mobileCss, /@media\s*\(max-width:\s*480px\)/);
    assert.match(mobileCss, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(mobileCss, /nth-child\(1\)[\s\S]*nth-child\(6\)[\s\S]*grid-column:\s*1\s*\/\s*-1/);
    for (const label of ["JOGADOR", "POSIÇÃO", "NACIONALIDADE", "ESTREIA", "PÉ", "TÍTULOS", "GOLS", "ASSISTÊNCIAS"]) {
        assert.ok(mobileCss.includes(`content: "${label}"`), label);
    }
    for (const state of ["correct", "partial", "wrong"]) {
        assert.ok(css.includes(`#gameView .cell.${state}`), state);
    }
});

test("Mais ou Menos preserva layout, overlay e escala responsiva", () => {
    assert.match(cssRule("#maisMenosView"), /max-width:\s*540px/);
    assert.match(cssRule("#maisMenosView .game-sticky-top,\n#maisMenosView .mm-card,\n#maisMenosView .mm-result-card"), /width:\s*min\(520px,\s*100%\)/);
    assert.match(cssRule("#maisMenosView .mm-player-name"), /-webkit-line-clamp:\s*2/);
    assert.match(cssRule("#maisMenosView .mm-player-name"), /overflow-wrap:\s*break-word/);
    assert.match(cssRule("#maisMenosView .mm-round-feedback"), /position:\s*absolute/);
    assert.match(cssRule("#maisMenosView .mm-round-feedback"), /inset:\s*0/);
    assert.match(cssRule("#maisMenosView .mm-round-feedback::after"), /animation:\s*mm-feedback-timer 1\.5s/);
    assert.ok(script.includes("const ATRASO_AVANCO_MM = 1500"));
    for (const breakpoint of [680, 480, 360]) {
        assert.ok(css.includes(`@media (max-width: ${breakpoint}px)`), `${breakpoint}px`);
    }
    for (const size of [88, 80, 72, 64]) {
        assert.ok(css.includes(`width: ${size}px`), `${size}px`);
    }
    const reducedMotionStart = css.lastIndexOf("@media (prefers-reduced-motion: reduce)", css.indexOf("HOME MOBILE"));
    const reducedMotionCss = css.slice(reducedMotionStart, css.indexOf("HOME MOBILE"));
    assert.ok(reducedMotionCss.includes("#maisMenosView .mm-round-feedback::after"));
    assert.match(reducedMotionCss, /animation:\s*none/);
});

test("Onze Inicial preserva campo, dense-line, placar e resultado", () => {
    assert.match(cssRule("#escalacaoView"), /max-width:\s*440px/);
    assert.match(cssRule("#escalacaoView .game-sticky-top,\n#escalacaoView .match-card,\n#escalacaoView .lineup-card,\n#escalacaoView .lineup-result-card"), /width:\s*min\(430px,\s*100%\)/);
    assert.match(cssRule(".pitch"), /aspect-ratio:\s*2\s*\/\s*3/);
    assert.match(cssRule(".player-chip"), /position:\s*absolute/);
    assert.match(cssRule("#escalacaoView .player-chip .chip-label"), /-webkit-line-clamp:\s*2/);
    assert.match(cssRule("#escalacaoView .player-chip .chip-label"), /overflow-wrap:\s*break-word/);
    assert.match(cssRule("#escalacaoView .player-chip.dense-line"), /width:\s*78px/);
    assert.match(cssRule("#escalacaoView .match-score-row"), /grid-template-columns:\s*minmax\(66px/);
    assert.ok(css.includes("#escalacaoView .escalacao-feedback"));
    assert.ok(css.includes("#escalacaoView .lineup-result-errors"));
    assert.ok(css.includes("#escalacaoView .lineup-next-challenge-time"));
    for (const breakpoint of [480, 360]) {
        assert.ok(css.includes(`@media (max-width: ${breakpoint}px)`), `${breakpoint}px`);
    }
});

test("hardening responsivo final preserva movimento reduzido e widget", () => {
    assert.equal((css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g) || []).length, 1);
    for (const selector of [
        ".home-progress-card.celebrate-once", ".slot-btn.correct",
        "#gameView .cell.reveal", "#gameView .shake", ".useful-links-btn",
        "#maisMenosView .mm-round-feedback", "#maisMenosView .mm-round-feedback::after"
    ]) {
        assert.ok(css.includes(selector), selector);
    }
    assert.match(cssRule(".useful-links-widget"), /position:\s*fixed/);
    assert.match(cssRule(".useful-links-panel"), /max-width:\s*calc\(100vw - 70px\)/);
    assert.ok(css.includes("width: min(260px, calc(100vw - 24px))"));
    for (const deadSelector of [".stats-grid", ".stat-box", ".stat-number", ".pitch-box-top", ".pitch-box-bottom", ".escalacao-end-message"]) {
        assert.ok(!css.includes(deadSelector), deadSelector);
    }
});

test("autocompletes preservam contrato combobox, listbox e options ARIA", () => {
    const pairs = [
        ["searchInput", "autocompleteList"],
        ["photoSearchInput", "photoAutocompleteList"],
        ["escalacaoSearchInput", "escalacaoAutocompleteList"]
    ];
    for (const [inputId, listId] of pairs) {
        const input = html.match(new RegExp(`<input[^>]+id=["']${inputId}["'][^>]*>`, "i"))?.[0] || "";
        const list = html.match(new RegExp(`<div[^>]+id=["']${listId}["'][^>]*>`, "i"))?.[0] || "";
        assert.match(input, /role=["']combobox["']/i, inputId);
        assert.match(input, /aria-autocomplete=["']list["']/i, inputId);
        assert.match(input, /aria-expanded=["']false["']/i, inputId);
        assert.ok(input.includes(`aria-controls="${listId}"`), inputId);
        assert.match(input, /aria-label=/i, inputId);
        assert.match(list, /role=["']listbox["']/i, listId);
    }
    for (const token of [
        'setAttribute("role", "option")', 'setAttribute("aria-selected", "false")',
        'setAttribute("aria-selected", ativo ? "true" : "false")',
        'setAttribute("aria-expanded"', 'setAttribute("aria-activedescendant"',
        'removeAttribute("aria-activedescendant")', '"classic"', '"photo"', '"lineup"'
    ]) {
        assert.ok(script.includes(token), token);
    }
    assert.ok(script.includes('e.key === "Escape"'));
    assert.ok(script.includes("if (selectedIndex < 0) return"));
    assert.ok(script.includes("if (selectedIndexFoto < 0) return"));
    assert.ok(script.includes("if (selectedIndexEsc < 0) return"));
});

test("viewports canônicos da v2.7 permanecem formalizados", () => {
    assert.deepEqual(contract.viewports.map(viewport => viewport.width), [360, 390, 412, 430, 480, 768, 1440, 412]);
    assert.ok(contract.viewports.some(viewport => viewport.height <= 600), "viewport baixo ausente");
});

test("shell global preserva eixo, gutters e um único scroll vertical", () => {
    for (const token of ["--shell-max-width", "--shell-gutter", "--shell-inline-space"]) {
        assert.ok(css.includes(token), token);
    }
    assert.match(cssRule("body.app-shell"), /overflow:\s*hidden/);
    assert.match(cssRule(".page-content"), /overflow-y:\s*auto/);
    assert.match(cssRule(".header-inner"), /var\(--shell-gutter\)/);
    assert.match(cssRule(".app-shell .page-content"), /var\(--shell-inline-space\)/);
    assert.match(cssRule(".pokedle-footer"), /var\(--shell-inline-space\)/);
    for (const selector of [".home-daily-info", ".mode-buttons-container", ".home-progress-card", ".home-stats-btn"]) {
        assert.match(cssRule(selector), /max-width:\s*400px/, selector);
    }
    assert.match(cssRule(".home-menu"), /gap:\s*clamp\(/);
    assert.match(cssRule(".pokedle-btn"), /padding:\s*clamp\(/);
    assert.match(cssRule(".btn-title"), /font-size:\s*clamp\(/);
    assert.equal((css.match(/\.btn-title\s*\{/g) || []).length, 1);
    assert.equal((css.match(/\.pill-text\s*\{/g) || []).length, 1);
});

console.log(`frontend-structure.test.js: ${scenarios} cenários estruturais aprovados; ${htmlIds.length} IDs verificados`);
