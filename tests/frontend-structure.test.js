"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const contract = require("./frontend-contract.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const historyStats = fs.readFileSync(path.join(root, "history-stats.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "ui.js"), "utf8");
const autocomplete = fs.readFileSync(path.join(root, "autocomplete.js"), "utf8");
const classic = fs.readFileSync(path.join(root, "classic-mode.js"), "utf8");
const photoCatalog = fs.readFileSync(path.join(root, "photo-catalog.js"), "utf8");
const photoMode = fs.readFileSync(path.join(root, "photo-mode.js"), "utf8");
const moreLessCore = fs.readFileSync(path.join(root, "more-less-core.js"), "utf8");
const moreLessMode = fs.readFileSync(path.join(root, "more-less-mode.js"), "utf8");
const lineupCore = fs.readFileSync(path.join(root, "lineup-core.js"), "utf8");
const lineupMode = fs.readFileSync(path.join(root, "lineup-mode.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const partidas = JSON.parse(fs.readFileSync(path.join(root, "partidas.json"), "utf8"));

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

test("core clássico carrega antes do script principal", () => {
    const coreIndex = html.indexOf('<script src="core.js"></script>');
    const scriptIndex = html.indexOf('<script src="script.js"></script>');
    assert.ok(coreIndex >= 0);
    assert.ok(scriptIndex > coreIndex);
});

test("derivação histórica carrega entre core e script principal", () => {
    const coreIndex = html.indexOf('<script src="core.js"></script>');
    const historyStatsIndex = html.indexOf('<script src="history-stats.js"></script>');
    const scriptIndex = html.indexOf('<script src="script.js"></script>');
    assert.ok(historyStatsIndex > coreIndex);
    assert.ok(scriptIndex > historyStatsIndex);
});

test("sharing clássico carrega depois das derivações e antes do script principal", () => {
    const historyStatsIndex = html.indexOf('<script src="history-stats.js"></script>');
    const sharingIndex = html.indexOf('<script src="sharing.js"></script>');
    const scriptIndex = html.indexOf('<script src="script.js"></script>');
    assert.ok(sharingIndex > historyStatsIndex);
    assert.ok(scriptIndex > sharingIndex);
});

test("infraestruturas de UI carregam depois de sharing e antes do script principal", () => {
    const sharingIndex = html.indexOf('<script src="sharing.js"></script>');
    const uiIndex = html.indexOf('<script src="ui.js"></script>');
    const autocompleteIndex = html.indexOf('<script src="autocomplete.js"></script>');
    const classicIndex = html.indexOf('<script src="classic-mode.js"></script>');
    const photoCatalogIndex = html.indexOf('<script src="photo-catalog.js"></script>');
    const photoModeIndex = html.indexOf('<script src="photo-mode.js"></script>');
    const moreLessCoreIndex = html.indexOf('<script src="more-less-core.js"></script>');
    const moreLessModeIndex = html.indexOf('<script src="more-less-mode.js"></script>');
    const lineupCoreIndex = html.indexOf('<script src="lineup-core.js"></script>');
    const lineupModeIndex = html.indexOf('<script src="lineup-mode.js"></script>');
    const scriptIndex = html.indexOf('<script src="script.js"></script>');
    assert.ok(uiIndex > sharingIndex);
    assert.ok(autocompleteIndex > uiIndex);
    assert.ok(classicIndex > autocompleteIndex);
    assert.ok(photoCatalogIndex > classicIndex);
    assert.ok(photoModeIndex > photoCatalogIndex);
    assert.ok(moreLessCoreIndex > photoModeIndex);
    assert.ok(moreLessModeIndex > moreLessCoreIndex);
    assert.ok(lineupCoreIndex > moreLessModeIndex);
    assert.ok(lineupModeIndex > lineupCoreIndex);
    assert.ok(scriptIndex > lineupModeIndex);
    assert.ok(ui.includes("TimaodleUI"));
    assert.ok(autocomplete.includes("TimaodleAutocomplete"));
    assert.ok(classic.includes("TimaodleClassic"));
    assert.ok(photoCatalog.includes("TimaodlePhotoCatalog"));
    assert.ok(photoMode.includes("TimaodlePhotoMode"));
    assert.ok(moreLessCore.includes("TimaodleMoreLessCore"));
    assert.ok(moreLessMode.includes("TimaodleMoreLessMode"));
    assert.ok(lineupCore.includes("TimaodleLineupCore"));
    assert.ok(lineupMode.includes("TimaodleLineupMode"));
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
    const missing = all.filter(className =>
        !script.includes(className) && !ui.includes(className)
            && !autocomplete.includes(className) && !classic.includes(className)
            && !photoCatalog.includes(className)
            && !photoMode.includes(className) && !moreLessMode.includes(className)
            && !lineupMode.includes(className)
    );
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
    const dialogs = {
        photoTutorialModal: "photoTutorialCloseBtn",
        integratedStatsModal: "btnCloseIntegratedStats",
        historyModal: "btnCloseHistory",
        howToPlayModal: "btnCloseHowToPlay",
        finalResultModal: "finalResultCloseBtn"
    };
    for (const [id, closeId] of Object.entries(dialogs)) {
        const tag = html.match(new RegExp(`<[^>]+id=["']${id}["'][^>]*>`, "i"))?.[0] || "";
        assert.match(tag, /role=["']dialog["']/i, id);
        assert.match(tag, /aria-modal=["']true["']/i, id);
        assert.match(tag, /aria-labelledby=/i, id);
        assert.ok(htmlIdSet.has(closeId), closeId);
    }
    assert.ok(ui.includes('classList.add("modal-open")'));
    assert.ok(ui.includes('classList.remove("modal-open")'));
});

test("Fase C usa um único overlay final acessível e responsivo", () => {
    const modal = html.match(/<div id="finalResultModal"[^>]*>/)?.[0] || "";
    assert.match(modal, /role="dialog"/);
    assert.match(modal, /aria-modal="true"/);
    assert.match(modal, /aria-labelledby="finalResultTitle"/);
    assert.match(html, /id="finalResultTitle"[^>]*tabindex="-1"/);
    assert.match(cssRule(".final-result-modal-content"), /width:\s*min\(700px/);
    assert.match(cssRule(".final-result-modal-content"), /max-height:\s*min\(calc\(100dvh - 32px\),\s*760px\)/);
    assert.match(cssRule(".final-result-close"), /width:\s*44px/);
    assert.match(cssRule(".final-result-close"), /height:\s*44px/);
    assert.match(cssRule(".final-result-scroll"), /overflow-y:\s*auto/);
    assert.match(cssRule(".final-result-pending-modes"), /repeat\(auto-fit,\s*minmax\(150px,\s*1fr\)\)/);
    assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*?\.final-result-pending-modes\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
    assert.equal((html.match(/id="finalResultModal"/g) || []).length, 1);
    for (const tipo of ["classic", "photo", "moreLess", "lineup"]) {
        assert.ok(script.includes(`abrirResultadoFinal("${tipo}")`), tipo);
    }
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
    assert.match(ui, /button:not\(\[disabled\]\):not\(\[tabindex="-1"\]\)/);
    assert.match(cssRule(".history-day-button:focus-visible"), /outline:/);
});

test("Calendário histórico explica estados visuais sem alterar sua semântica", () => {
    const legend = html.match(/<div class="history-calendar-legend"[\s\S]*?<\/div>/)?.[0] || "";
    assert.match(legend, /aria-label="Legenda do calendário"/);
    for (const [state, label] of [
        ["no-record", "Sem registro"], ["recorded", "Registro 0/4"],
        ["started", "Iniciado"], ["partial", "Parcial"], ["complete", "4/4"]
    ]) {
        assert.ok(legend.includes(`class="is-${state}"`), state);
        assert.ok(legend.includes(label), label);
    }
    assert.ok(!legend.includes("future"));
    assert.ok(!legend.includes("before-tracking"));
    assert.equal((legend.match(/aria-hidden="true"/g) || []).length, 5);
    assert.match(cssRule(".history-day-button"), /min-height:\s*44px/);
    assert.match(cssRule(".history-weekdays > span"), /font-size:\s*10px/);
    assert.match(cssRule(".history-day-cell.is-no-record .history-day-button"), /border-style:\s*dashed/);
    assert.match(css, /\.history-day-cell\.is-partial \.history-day-button\s*\{[^}]*border-color:/);
    assert.match(cssRule(".history-day-cell.is-today .history-day-button::before"), /background:\s*var\(--gold\)/);
    assert.match(cssRule(".history-day-cell.is-selected .history-day-button"), /border-color:\s*var\(--ink\)/);
});

test("Resumo histórico preserva quatro modos, progresso e estado sem registro", () => {
    for (const id of [
        "historyDaySummary", "historySelectedDateTitle", "historyNoRecord", "historyDayDetails",
        "historyClassicSummary", "historyPhotoSummary", "historyMoreLessSummary",
        "historyLineupSummary", "historyOverallProgress", "historyHistoricalStreak",
        "historyHistoricalStreakText"
    ]) assert.ok(htmlIdSet.has(id), id);
    for (const mode of ["classic", "photo", "moreLess", "lineup"]) {
        assert.ok(html.includes(`data-history-mode="${mode}"`), mode);
    }
    assert.ok(!htmlIdSet.has("historyDayPlaceholder"));
    assert.ok(historyStats.includes("function obterResumoHistoricoDia(data, historico)"));
    assert.ok(script.includes("historyClassicSummary.textContent = resumo.classic.statusText"));
    assert.ok(script.includes("historyPhotoSummary.textContent = resumo.photo.statusText"));
    assert.ok(script.includes("historyMoreLessSummary.textContent = resumo.moreLess.statusText"));
    assert.ok(script.includes("historyLineupSummary.textContent = resumo.lineup.statusText"));
    assert.ok(script.includes('historyLineupExactScore?.classList.toggle("hidden", !resumo.lineup.exactScore)'));
    assert.ok(script.includes('historyOverallProgress.classList.toggle("is-complete", resumo.complete)'));
    assert.ok(historyStats.includes("function obterSequenciaHistoricaDoDia(data, historico"));
    assert.ok(script.includes('historyHistoricalStreak?.classList.toggle("hidden", !mostrarSequencia)'));
    assert.ok(script.includes("sequencia.throughSelectedDate"));
    for (const selector of [
        ".history-day-summary", ".history-no-record", ".history-mode-summary",
        ".history-exact-score", ".history-overall-progress.is-complete", ".history-historical-streak"
    ]) assert.ok(css.includes(selector), selector);
});

test("Detalhe diário prioriza data e progresso sem criar cards por modo", () => {
    const details = html.match(/<div id="historyDayDetails"[\s\S]*?<p id="historyHistoricalStreak"/)?.[0] || "";
    const progressIndex = details.indexOf('id="historyOverallProgress"');
    const classicIndex = details.indexOf('data-history-mode="classic"');
    const photoIndex = details.indexOf('data-history-mode="photo"');
    const moreLessIndex = details.indexOf('data-history-mode="moreLess"');
    const lineupIndex = details.indexOf('data-history-mode="lineup"');
    assert.ok(progressIndex >= 0 && progressIndex < classicIndex);
    assert.ok(classicIndex < photoIndex && photoIndex < moreLessIndex && moreLessIndex < lineupIndex);
    assert.ok(script.includes("historySelectedDateTitle.textContent = formatarDataHistorico(dia.date);"));
    assert.match(cssRule(".history-day-summary"), /background:\s*transparent/);
    assert.doesNotMatch(cssRule(".history-day-summary"), /border-left:/);
    assert.match(cssRule(".history-mode-summary"), /border-bottom:/);
    assert.match(cssRule(".history-mode-summary"), /background:\s*transparent/);
    assert.doesNotMatch(cssRule(".history-mode-summary"), /border-radius:/);
    assert.match(cssRule(".history-overall-progress"), /font-size:\s*clamp\(25px/);
    assert.match(cssRule(".history-exact-score"), /border:\s*0/);
    assert.match(cssRule(".history-historical-streak"), /background:\s*transparent/);
});

test("Estatísticas e Histórico ampliam somente em tablet e desktop", () => {
    assert.equal((css.match(/@media\s*\(min-width:\s*700px\)/g) || []).length, 1);
    const statsDesktop = cssRule("#integratedStatsModal .integrated-stats-modal-content");
    const historyDesktop = cssRule("#historyModal .history-modal-content");
    assert.match(statsDesktop, /width:\s*min\(820px,\s*calc\(100vw - 48px\)\)/);
    assert.match(statsDesktop, /max-width:\s*820px/);
    assert.match(historyDesktop, /width:\s*min\(720px,\s*calc\(100vw - 48px\)\)/);
    assert.match(historyDesktop, /max-width:\s*720px/);
    assert.match(cssRule("#historyModal .history-month-navigation,\n    #historyModal .history-weekdays,\n    #historyModal .history-calendar-grid,\n    #historyModal .history-calendar-legend"), /max-width:\s*620px/);
    assert.match(cssRule(".integrated-mode-grid"), /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(cssRule(".integrated-stats-primary"), /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(cssRule(".history-modal-content"), /width:\s*min\(500px/);
});

test("Estatísticas gerais preservam dados e separam hierarquia sem caixas redundantes", () => {
    for (const className of [
        "integrated-stats-primary", "integrated-streak-summary", "integrated-streak-current",
        "integrated-streak-record", "integrated-completion-summary", "integrated-completion-values",
        "integrated-stats-secondary", "integrated-stats-registered"
    ]) assert.ok(script.includes(`class="${className}"`), className);
    for (const expression of [
        "geral.currentStreak", "geral.bestStreak", "geral.completeDays", "geral.completeDayRate",
        "geral.playedDays", "geral.completedModes", "geral.wins", "geral.registeredDays"
    ]) assert.ok(script.includes(`\${${expression}}`), expression);
    assert.ok(script.includes("if (geral.playedDays === 0)"));
    assert.ok(script.includes("Suas estatísticas começarão a aparecer conforme você joga"));
    assert.ok(!script.includes('class="integrated-stat-box"'));
    assert.match(cssRule(".integrated-stat-label"), /font-size:\s*11px/);
    assert.match(cssRule(".integrated-stats-secondary"), /repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
});

test("Estatísticas por modo usam detalhes nativos fechados e preservam ordem e dados", () => {
    const statsRender = script.slice(
        script.indexOf("function renderizarEstatisticasIntegradas()"),
        script.indexOf("const MESES_HISTORICO")
    );
    const modeTitles = ["CLÁSSICO", "FOTO", "MAIS OU MENOS", "ONZE INICIAL"];
    let previousIndex = -1;
    for (const title of modeTitles) {
        const index = statsRender.indexOf(`<h3>${title}</h3>`);
        assert.ok(index > previousIndex, title);
        previousIndex = index;
    }
    assert.equal((statsRender.match(/<details class="integrated-mode-details">/g) || []).length, 4);
    assert.equal((statsRender.match(/<summary>Ver detalhes<\/summary>/g) || []).length, 4);
    assert.ok(!statsRender.includes('<details class="integrated-mode-details" open>'));
    assert.equal((statsRender.match(/estadoVazioEstatisticaModo\(\)/g) || []).length, 4);
    for (const metric of [
        "classic.averageAttemptsWins", "photo.winRate", "photo.averageAttemptsWins",
        "moreLess.winRate", "moreLess.averageHits", "lineup.averageErrors"
    ]) assert.ok(statsRender.includes(metric), metric);
    for (const distribution of ["classic.distribution", "photo.distribution", "moreLess.distribution"]) {
        assert.ok(statsRender.includes(`formatarDistribuicao(${distribution})`), distribution);
    }
    assert.ok(ui.includes('summary:not([tabindex="-1"])'));
    assert.match(cssRule(".integrated-mode-details summary"), /min-height:\s*44px/);
    assert.match(css, /\.integrated-mode-details summary:focus-visible\s*\{[^}]*outline:/);
    assert.match(cssRule(".distribution-chip"), /border-bottom:/);
    assert.doesNotMatch(cssRule(".distribution-chip"), /background:/);
});

test("Como Jogar preserva largura e grid responsivos próprios", () => {
    const modalRule = cssRule(".integrated-stats-modal-content.help-modal-content");
    const gridRule = cssRule(".help-mode-grid");
    const helpModal = html.match(/<div id="howToPlayModal"[\s\S]*?<div id="finalResultModal"/)?.[0] || "";
    assert.match(modalRule, /width:\s*min\(700px/);
    assert.match(modalRule, /max-height:[^;]*100dvh/);
    assert.match(gridRule, /repeat\(auto-fit/);
    assert.match(gridRule, /min\(280px,\s*100%\)/);
    assert.ok(css.includes("word-break: normal"));
    for (const mode of ["CLÁSSICO", "FOTO", "MAIS OU MENOS", "ONZE INICIAL"]) {
        assert.ok(helpModal.includes(`<h3>${mode}</h3>`), mode);
    }
    assert.match(helpModal, /autocomplete/i);
    assert.match(helpModal, /0\/4[\s\S]*?4\/4/);
    assert.match(helpModal, /<h3>COMPARTILHAMENTO<\/h3>/);
});

test("componentes compartilhados preservam base e variantes", () => {
    assert.match(cssRule(".search-box input"), /min-height:\s*50px/);
    assert.match(cssRule(".search-box input:focus"), /box-shadow:[^;]*var\(--gold-soft\)/);
    assert.match(cssRule(".autocomplete-items"), /max-height:\s*190px/);
    assert.match(cssRule(".autocomplete-items div"), /min-height:\s*46px/);
    assert.match(cssRule(".back-btn"), /min-width:\s*44px/);
    assert.match(cssRule(".back-btn"), /min-height:\s*44px/);
    assert.match(cssRule(".daily-status-bar"), /display:\s*grid/);
    assert.match(cssRule(".daily-end-message"), /font-size:\s*14px/);
    assert.ok(css.includes(".share-btn,\n.form-submit-btn"));
    assert.ok(css.includes("#escalacaoView .search-box input"), "variante de busca do Onze Inicial ausente");
});

test("navegação e iconografia v3.0 preservam contrato acessível monocromático", () => {
    const backIds = ["backHomeBtn", "backHomeBtnFoto", "backHomeBtnMM", "backHomeBtnEsc"];
    for (const id of backIds) {
        const button = html.match(new RegExp(`<button[^>]+id=["']${id}["'][\\s\\S]*?<\\/button>`, "i"))?.[0] || "";
        assert.match(button, /aria-label=["']Voltar para a Home["']/i, id);
        assert.match(button, /class=["']back-arrow["'][^>]*aria-hidden=["']true["']/i, id);
        assert.match(button, /←/, id);
        assert.doesNotMatch(button, /⬅/, id);
    }
    assert.match(cssRule(".back-btn:focus-visible"), /outline:/);
    assert.match(cssRule(".back-btn"), /background-color:\s*rgba\(255, 255, 255, 0\.035\)/);
    assert.match(cssRule(".back-btn"), /border-radius:\s*var\(--radius-s\)/);
    assert.ok(html.includes('class="ui-icon contrast-icon"'));
    assert.match(html.match(/<button[^>]+id=["']photoGrayscaleToggle["'][^>]*>/i)?.[0] || "", /aria-label=/i);
    for (const emoji of ["⬅", "📤", "🎨", "🗓️", "🖼️", "⚖️", "🧩", "🔥"]) {
        assert.ok(!html.includes(emoji), `emoji permanente restante: ${emoji}`);
    }
});

test("Modo Foto preserva layout fluido e estados visuais próprios", () => {
    assert.match(cssRule("#photoView"), /max-width:\s*400px/);
    assert.match(cssRule("#photoView .photo-card,\n#photoView .photo-attempts-list"), /width:\s*min\(320px,\s*100%\)/);
    assert.match(cssRule("#photoView .photo-card"), /aspect-ratio:\s*1\s*\/\s*1/);
    assert.match(cssRule("#photoView .photo-img"), /object-fit:\s*cover/);
    assert.match(cssRule("#photoView .photo-img"), /object-position:\s*center top/);
    assert.match(cssRule("#photoView .photo-img.image-fallback"), /filter:\s*none\s*!important/);
    const shareButton = html.match(/<button[^>]+id=["']photoShareResultBtn["'][^>]*>[^<]*<\/button>/i)?.[0] || "";
    assert.match(shareButton, /class=["'][^"']*share-btn[^"']*photo-share-result[^"']*hidden/);
    assert.match(shareButton, /type=["']button["']/);
    assert.match(shareButton, />COMPARTILHAR<\/button>/);
    assert.match(cssRule("#photoView .photo-share-result"), /width:\s*min\(320px,\s*100%\)/);
    assert.match(photoMode, /for \(let i = 0; i < MAX_TENTATIVAS_FOTO; i\+\+\)/);
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
    assert.match(desktopGrid, /grid-template-columns:\s*1\.3fr 1\.05fr 1\.25fr 0\.85fr 1fr 1\.6fr 0\.7fr 0\.8fr/);
    assert.match(desktopGrid, /gap:\s*7px/);
    assert.match(cssRule("#gameView .cell"), /word-break:\s*normal/);
    assert.match(cssRule("#gameView .cell"), /overflow-wrap:\s*break-word/);

    const mobileStart = css.indexOf("/* No mobile, Jogador e Títulos");
    const mobileEnd = css.indexOf("/* ==========================================================================\n   MODAL", mobileStart);
    const mobileCss = css.slice(mobileStart, mobileEnd);
    assert.match(mobileCss, /@media\s*\(max-width:\s*480px\)/);
    assert.match(mobileCss, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(mobileCss, /nth-child\(1\)[\s\S]*nth-child\(6\)[\s\S]*grid-column:\s*1\s*\/\s*-1/);
    assert.match(mobileCss, /nth-child\(6\) \.cell-text\s*\{[^}]*white-space:\s*normal/);
    assert.doesNotMatch(mobileCss, /text-overflow:\s*ellipsis|-webkit-line-clamp/);
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
    const guessRule = cssRule("#maisMenosView .mm-guess-btn");
    assert.match(guessRule, /border:\s*2px solid rgba\(255, 255, 255, 0\.42\)/);
    assert.match(guessRule, /background:\s*rgba\(255, 255, 255, 0\.045\)/);
    assert.doesNotMatch(css, /#maisMenosView \.mm-btn-(?:mais|menos)\s*\{/);
    for (const state of ["correct", "correct-answer", "wrong"]) {
        assert.ok(css.includes(`.mm-guess-btn.${state}`), state);
    }
    const shareButton = html.match(/<button[^>]+id=["']mmShareResultBtn["'][^>]*>[^<]*<\/button>/i)?.[0] || "";
    assert.match(shareButton, /class=["'][^"']*share-btn[^"']*mm-share-result[^"']*hidden/);
    assert.match(shareButton, /type=["']button["']/);
    assert.match(html, /id="mmHitsLabel"[^>]*>0 ACERTOS<\/strong>/);
    assert.match(html, /class="mm-goal">Meta: <strong>7 acertos<\/strong>/);
    assert.ok(!html.includes('class="mm-progress-label"'));
    assert.ok(!html.includes('id="mmCaptionRound"'));
    assert.match(moreLessMode, /for \(let indice = 0; indice < RODADAS_MM; indice\+\+\)/);
    assert.ok(moreLessMode.includes("const ATRASO_AVANCO_MM = 1500"));
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
    assert.match(cssRule("#escalacaoView"), /max-width:\s*480px/);
    assert.match(cssRule("#escalacaoView .game-sticky-top,\n#escalacaoView .match-card,\n#escalacaoView .lineup-card,\n#escalacaoView .lineup-result-card"), /width:\s*min\(470px,\s*100%\)/);
    assert.match(cssRule(".pitch"), /aspect-ratio:\s*2\s*\/\s*3/);
    assert.match(cssRule(".player-chip"), /position:\s*absolute/);
    assert.match(cssRule("#escalacaoView .player-chip .chip-label"), /-webkit-line-clamp:\s*2/);
    assert.match(cssRule("#escalacaoView .player-chip .chip-label"), /overflow-wrap:\s*break-word/);
    assert.match(cssRule("#escalacaoView .player-chip.dense-line"), /width:\s*82px/);
    assert.match(cssRule("#escalacaoView .match-score-row"), /grid-template-columns:\s*minmax\(66px/);
    assert.ok(css.includes("#escalacaoView .escalacao-feedback"));
    assert.ok(css.includes("#escalacaoView .lineup-result-errors"));
    assert.ok(css.includes("#escalacaoView .lineup-next-challenge-time"));
    assert.match(lineupCore, /const MAX_OCULTOS_ESCALACAO = 3/);
    assert.match(lineupMode, /elements\.progress\.innerText = `\$\{hits\}\/\$\{total\} JOGADORES`/);
    assert.match(lineupCore, /partida\.titulares\.forEach\(\(jogador, indice\) =>/);
    assert.match(lineupCore, /top: jogador\.top,[\s\S]*?left: jogador\.left/);
    assert.match(lineupMode, /if \(state\?\.concluido\)[\s\S]*renderCompletion\(\)/);
    assert.ok(lineupMode.includes("buildShareText"));
    assert.ok(html.includes('id="escalacaoSearchInput"'));
    assert.ok(html.includes('id="escalacaoAutocompleteList"'));
    assert.ok(html.includes('id="escalacaoDots"'));
    assert.ok(html.includes('id="escalacaoFaltam"'));
    assert.ok(!html.includes("Seu resumo da partida de hoje"));
    assert.ok(partidas.length > 0);
    partidas.forEach(partida => {
        assert.equal(partida.titulares.length, 11, partida.id);
        partida.titulares.forEach(jogador => {
            assert.ok(Number.isFinite(jogador.top) && jogador.top >= 0 && jogador.top <= 100, `${partida.id}: top`);
            assert.ok(Number.isFinite(jogador.left) && jogador.left >= 0 && jogador.left <= 100, `${partida.id}: left`);
        });
    });
    for (const nome of ["Ángel Romero", "Jorge Henrique", "Leandro Castán"]) {
        assert.ok(partidas.some(partida => partida.titulares.some(jogador => jogador.nome === nome)), nome);
    }
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
        'removeAttribute("aria-activedescendant")'
    ]) {
        assert.ok(autocomplete.includes(token), token);
    }
    assert.ok(classic.includes('prefixo: "classic"'));
    assert.ok(photoMode.includes('prefixo: "photo"'));
    assert.ok(lineupMode.includes('prefixo: "lineup"'));
    assert.ok(autocomplete.includes('event.key === "Escape"'));
    assert.ok(autocomplete.includes("if (indiceAtivo < 0) return"));
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
    assert.match(cssRule(".home-menu"), /max-width:\s*920px/);
    assert.match(cssRule(".mode-buttons-container"), /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(cssRule(".home-menu"), /gap:\s*clamp\(/);
    assert.match(cssRule(".pokedle-btn"), /padding:\s*clamp\(/);
    assert.match(cssRule(".btn-title"), /font-size:\s*clamp\(/);
    assert.equal((css.match(/\.btn-title\s*\{/g) || []).length, 1);
    assert.equal((css.match(/\.pill-text\s*\{/g) || []).length, 1);
});

test("Fase B organiza Home em hoje, modos e jornada pessoal", () => {
    const progressIndex = html.indexOf('id="homeDailyProgress"');
    const classicIndex = html.indexOf('id="btnPlayDiario"');
    const photoIndex = html.indexOf('id="btnPlayFoto"');
    const moreLessIndex = html.indexOf('id="btnPlayMaisMenos"');
    const lineupIndex = html.indexOf('id="btnPlayEscalacao"');
    const contextIndex = html.indexOf('class="home-daily-info"');
    const personalIndex = html.indexOf('id="homePersonalTitle"');
    const statsIndex = html.indexOf('id="btnOpenIntegratedStats"');
    const historyIndex = html.indexOf('id="btnOpenHistory"');

    assert.ok([progressIndex, classicIndex, photoIndex, moreLessIndex, lineupIndex, contextIndex,
        personalIndex, statsIndex, historyIndex].every(index => index >= 0));
    assert.ok(progressIndex < classicIndex);
    assert.ok(classicIndex < photoIndex && photoIndex < moreLessIndex && moreLessIndex < lineupIndex);
    assert.ok(lineupIndex < contextIndex && contextIndex < personalIndex);
    assert.ok(personalIndex < statsIndex && statsIndex < historyIndex);
    assert.equal((html.match(/class="pokedle-btn active"/g) || []).length, 4);
    assert.equal((html.match(/class="mode-entry"/g) || []).length, 4);
    assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*?\.mode-buttons-container\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
});

test("fechamento da Fase B oculta os modos somente no estado 4/4", () => {
    assert.ok(script.includes('homeModesEl?.classList.toggle("hidden", progresso.complete)'));
    assert.ok(script.includes('homeCompletionSummaryEl.classList.toggle("hidden", !progresso.complete)'));
    assert.ok(script.includes('homeCompletionActionsEl.classList.toggle("hidden", !progresso.complete)'));
    assert.ok(script.includes("shareDailyResultBtn.disabled = !progresso.complete"));
    assert.match(cssRule(".pokedle-btn.is-completed"), /border-color:\s*var\(--line\)/);
    assert.match(cssRule(".pokedle-btn.is-completed .mode-progress-status strong"), /color:\s*var\(--gold\)/);
});

test("polimento A.1 simplifica Home e hierarquia do Clássico", () => {
    assert.ok(!html.includes('class="pill-icon"'), "ícones decorativos dos modos ainda presentes");
    assert.ok(!html.includes("mode-icon"), "classe visual antiga dos modos ainda presente");
    for (const subtitle of [
        "Um novo desafio por dia",
        "Adivinhe o jogador pela foto",
        "10 rodadas · Mais ou menos jogos",
        "Complete a escalação"
    ]) {
        assert.ok(html.includes(subtitle), subtitle);
    }
    assert.match(cssRule(".btn-pill"), /border:\s*0/);
    assert.match(cssRule(".daily-label"), /font-size:\s*18px/);
    assert.match(css, /\n\.daily-timer\s*\{[^}]*font-size:\s*12px/);
    assert.match(cssRule("#gameView .search-box input"), /min-height:\s*44px/);
    assert.match(cssRule("#gameView .board-header"), /border-bottom:\s*1px solid var\(--line-soft\)/);
    assert.doesNotMatch(cssRule("#gameView .board-header .col"), /border-bottom:/);
});

test("Fase A.2 dá hierarquia própria ao cabeçalho do Foto", () => {
    const header = html.match(/<div class="daily-status-bar photo-mode-header">[\s\S]*?<\/div>\s*<span class="daily-timer photo-progress"[^>]*>[^<]*<\/span>/)?.[0] || "";
    assert.match(header, /id="backHomeBtnFoto"/);
    assert.match(header, /class="photo-mode-identity"/);
    assert.match(header, />Modo Foto</);
    assert.match(header, /id="photoDifficultyBadge"/);
    assert.match(header, /id="photoAttemptsLabel">0 \/ 6 TENTATIVAS/);
    assert.match(cssRule("#photoView .photo-mode-header"), /grid-template-columns:\s*minmax\(0, 1fr\) auto minmax\(0, 1fr\)/);
    assert.match(cssRule("#photoView .search-box input"), /min-height:\s*44px/);
    assert.match(cssRule("#photoView .photo-toggle-overlay-btn"), /border-radius:\s*var\(--radius-m\)/);
    assert.match(html.match(/<button[^>]+id="photoGrayscaleToggle"[^>]*>/)?.[0] || "", /aria-label="Alternar contraste preto e branco da foto"/);
});

test("Fase A.3 centraliza títulos e integra labels do Clássico", () => {
    const statusRule = cssRule(".daily-status-bar");
    assert.match(statusRule, /grid-template-columns:\s*minmax\(0, 1fr\) auto minmax\(0, 1fr\)/);
    assert.match(cssRule(".back-btn"), /justify-self:\s*start/);
    assert.match(cssRule(".daily-label"), /justify-self:\s*center/);
    assert.match(cssRule(".daily-status-bar .daily-timer"), /justify-self:\s*end/);
    const headerRule = cssRule("#gameView .board-header");
    assert.match(headerRule, /background:\s*transparent/);
    assert.match(headerRule, /border-bottom:\s*1px solid var\(--line-soft\)/);
    assert.doesNotMatch(headerRule, /border-top:/);
    assert.match(cssRule("#gameView .board-header .col"), /color:\s*var\(--ink-muted\)/);
    assert.match(html, /<div class="col" title="Assistências">ASSIST\.<\/div>/);
});

test("Fase A.4 remove a superfície ancestral do cabeçalho do Clássico", () => {
    assert.match(css, /\n\.game-sticky-top\s*\{[^}]*background-color:\s*transparent/);
    assert.match(cssRule("#gameView .board-header"), /background:\s*transparent/);
    assert.match(cssRule("#gameView .board-header"), /border-bottom:\s*1px solid var\(--line-soft\)/);
});

test("polimento A.5 reforça labels sem alterar a grade do Clássico", () => {
    const labelsRule = cssRule("#gameView .board-header .col");
    assert.match(labelsRule, /font-size:\s*11px/);
    assert.match(labelsRule, /font-weight:\s*700/);
    assert.match(labelsRule, /letter-spacing:\s*0/);
    assert.match(labelsRule, /white-space:\s*nowrap/);
    assert.match(labelsRule, /justify-content:\s*center/);
    assert.match(cssRule("#gameView .board-header,\n#gameView .attempt-row"), /grid-template-columns:\s*1\.3fr 1\.05fr 1\.25fr 0\.85fr 1fr 1\.6fr 0\.7fr 0\.8fr/);
});

test("Fase A.6 preserva uma única grade desktop mais confortável", () => {
    const desktopGrid = cssRule("#gameView .board-header,\n#gameView .attempt-row");
    assert.match(desktopGrid, /grid-template-columns:\s*1\.3fr 1\.05fr 1\.25fr 0\.85fr 1fr 1\.6fr 0\.7fr 0\.8fr/);
    assert.match(desktopGrid, /gap:\s*7px/);
    assert.match(cssRule("#gameView"), /min-width:\s*0/);
    assert.match(css, /@media\s*\(max-width:\s*480px\)[\s\S]*?#gameView \.attempt-row\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});

test("Fase A.7 protege a região sticky somente no mobile", () => {
    assert.match(css, /\n\.game-sticky-top\s*\{[^}]*z-index:\s*20[^}]*background-color:\s*transparent/);
    const responsiveStart = css.indexOf("/* ==========================================================================\n   RESPONSIVO");
    const responsiveEnd = css.indexOf("/* ==========================================================================\n   PÁGINAS LEGAIS", responsiveStart);
    const responsiveCss = css.slice(responsiveStart, responsiveEnd);
    assert.match(responsiveCss, /@media\s*\(max-width:\s*480px\)/);
    assert.match(responsiveCss, /\.game-sticky-top\s*\{[^}]*background-color:\s*rgba\(11, 11, 10, 0\.97\)/);
    assert.match(responsiveCss, /\.game-sticky-top\s*\{[^}]*border-bottom:\s*1px solid var\(--line-soft\)/);
    assert.match(cssRule(".autocomplete-items"), /z-index:\s*99/);
});

test("Fase A.8 compacta o sticky mobile sem reduzir alvos", () => {
    const responsiveStart = css.indexOf("/* ==========================================================================\n   RESPONSIVO");
    const responsiveEnd = css.indexOf("/* ==========================================================================\n   PÁGINAS LEGAIS", responsiveStart);
    const responsiveCss = css.slice(responsiveStart, responsiveEnd);
    assert.match(responsiveCss, /\.game-sticky-top\s*\{[^}]*gap:\s*5px[^}]*padding-bottom:\s*6px/);
    assert.match(responsiveCss, /#photoView \.game-sticky-top\s*\{[^}]*gap:\s*5px[^}]*padding-bottom:\s*6px/);
    assert.match(responsiveCss, /\.daily-status-bar\s*\{[^}]*border-bottom:\s*0[^}]*padding:\s*2px 0 5px/);
    assert.match(responsiveCss, /\.back-btn\s*\{[^}]*width:\s*44px[^}]*background-color:\s*rgba\(255, 255, 255, 0\.02\)/);
    assert.match(cssRule(".back-btn"), /min-height:\s*44px/);
    assert.match(responsiveCss, /#gameView \.daily-timer\s*\{[^}]*font-size:\s*10px[^}]*font-weight:\s*500/);
    assert.match(responsiveCss, /#gameView \.daily-timer strong\s*\{[^}]*font-size:\s*12px[^}]*font-weight:\s*800/);
});

test("Fase A.5 integra os quatro cabeçalhos ao canvas principal", () => {
    const statusRule = cssRule(".daily-status-bar");
    assert.match(statusRule, /background:\s*transparent/);
    assert.match(statusRule, /border:\s*0/);
    assert.match(statusRule, /border-bottom:\s*1px solid var\(--line-soft\)/);
    assert.match(statusRule, /border-radius:\s*0/);
    assert.doesNotMatch(statusRule, /linear-gradient|box-shadow/);
    assert.match(css, /\n\.game-sticky-top\s*\{[^}]*background-color:\s*transparent/);
    assert.doesNotMatch(css, /#gameView \.game-sticky-top\s*\{/);
});

console.log(`frontend-structure.test.js: ${scenarios} cenários estruturais aprovados; ${htmlIds.length} IDs verificados`);
