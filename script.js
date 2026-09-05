/* ==========================================================================
   TIMÃODLE — MODO DIÁRIO
   Um desafio por dia, igual para todo mundo, baseado na data local
   (AAAA-MM-DD) usada como semente do sorteio do jogador secreto.
   ========================================================================== */

const CHAVE_ESTADO_DIARIO = "timaodle_daily_state";
const CHAVE_STATS = "timaodle_stats";
const CHAVE_USERNAME = "timaodle_username";
const CHAVE_HISTORICO = "timaodle_history_v1";
const VERSAO_HISTORICO = 1;
const URL_OFICIAL_TIMAODLE = "timaodle.net";
const NormalizadoresStorage = globalThis.TimaodleStorage;
const {
    formatarDataLocal, hashString
} = globalThis.TimaodleCore;
const {
    quantidadeSegura, criarResumoDiaVazio,
    normalizarResumoClassico, normalizarResumoFoto, normalizarResumoMaisMenos,
    normalizarResumoOnzeInicial, calcularProgressoDoResumo, numeroHistoricoValido,
    obterProgressoHistorico, calcularStreakGeral, calcularEstatisticasIntegradas
} = globalThis.TimaodleHistoryStats;
const {
    pluralizarQuantidade,
    gerarTextoCompartilhamentoDiario: construirTextoCompartilhamentoDiario,
    gerarTextoCompartilhamentoClassico: construirTextoCompartilhamentoClassico,
    gerarTextoCompartilhamentoFoto: construirTextoCompartilhamentoFoto,
    gerarTextoCompartilhamentoMM: construirTextoCompartilhamentoMM,
    gerarTextoCompartilhamentoOnze: construirTextoCompartilhamentoOnze,
    compartilharTexto
} = globalThis.TimaodleSharing;
const infraestruturaDialogs = globalThis.TimaodleUI.criarInfraestruturaDialogs(document);
const {
    abrirDialog: abrirModalAcessivel,
    fecharDialog: fecharModalAcessivel,
    prenderFocoNoDialog: prenderFocoNoModal
} = infraestruturaDialogs;
const {
    filtrarSugestoes,
    criarAutocomplete
} = globalThis.TimaodleAutocomplete;
const { embaralharComSemente } = globalThis.TimaodleMoreLessCore;

function lerJsonLocalStorage(chave) {
    try {
        return NormalizadoresStorage.parseJson(localStorage.getItem(chave));
    } catch {
        return null;
    }
}

function persistirNormalizacaoSegura(chave, original, normalizado) {
    if (!normalizado || !NormalizadoresStorage.isObject(original)) return normalizado;
    try {
        if (JSON.stringify(original) !== JSON.stringify(normalizado)) {
            localStorage.setItem(chave, JSON.stringify(normalizado));
        }
    } catch (error) {
        console.warn(`Não foi possível persistir a normalização de ${chave}:`, error);
    }
    return normalizado;
}

let jogadores = [];
let classicMode = null;
let photoMode = null;
let moreLessMode = null;

// Estatísticas legadas do Clássico. Não representam o streak geral e são
// mantidas somente por compatibilidade com instalações existentes.
function carregarEstatisticasLegadas() {
    const salvo = lerJsonLocalStorage(CHAVE_STATS);
    return persistirNormalizacaoSegura(
        CHAVE_STATS,
        salvo,
        NormalizadoresStorage.normalizeLegacyStats(salvo)
    );
}

let stats = carregarEstatisticasLegadas();

// Elementos da Interface
const homeView = document.getElementById("homeView");
const gameView = document.getElementById("gameView");
const btnPlayDiario = document.getElementById("btnPlayDiario");
const backHomeBtn = document.getElementById("backHomeBtn");
const welcomeGreetingEl = document.getElementById("welcomeGreeting");
const homeDailyProgressEl = document.getElementById("homeDailyProgress");
const homeProgressTitleEl = document.getElementById("homeProgressTitle");
const homeProgressMessageEl = document.getElementById("homeProgressMessage");
const homeProgressValueEl = document.getElementById("homeProgressValue");
const homeProgressUnitEl = document.getElementById("homeProgressUnit");
const homeProgressBarEl = document.getElementById("homeProgressBar");
const homeProgressFillEl = document.getElementById("homeProgressFill");
const homeModesEl = document.getElementById("homeModes");
const homeStreakCurrentEl = document.getElementById("homeStreakCurrent");
const homeStreakBestEl = document.getElementById("homeStreakBest");
const homeCompletionSummaryEl = document.getElementById("homeCompletionSummary");
const homeCompletionActionsEl = document.getElementById("homeCompletionActions");
const shareDailyResultBtn = document.getElementById("shareDailyResultBtn");
const homeCompletionMetricEls = {
    classic: document.getElementById("homeCompletionClassic"),
    photo: document.getElementById("homeCompletionPhoto"),
    moreLess: document.getElementById("homeCompletionMoreLess"),
    lineup: document.getElementById("homeCompletionLineup")
};
const homeStatusEls = {
    classic: document.getElementById("homeStatusClassic"),
    photo: document.getElementById("homeStatusPhoto"),
    moreLess: document.getElementById("homeStatusMoreLess"),
    lineup: document.getElementById("homeStatusLineup")
};
const btnOpenIntegratedStats = document.getElementById("btnOpenIntegratedStats");
const integratedStatsModal = document.getElementById("integratedStatsModal");
const btnCloseIntegratedStats = document.getElementById("btnCloseIntegratedStats");
const integratedStatsContent = document.getElementById("integratedStatsContent");
const btnOpenHowToPlay = document.getElementById("btnOpenHowToPlay");
const howToPlayModal = document.getElementById("howToPlayModal");
const btnCloseHowToPlay = document.getElementById("btnCloseHowToPlay");
const finalResultModal = document.getElementById("finalResultModal");
const finalResultCloseBtn = document.getElementById("finalResultCloseBtn");
const finalResultModeEl = document.getElementById("finalResultMode");
const finalResultTitleEl = document.getElementById("finalResultTitle");
const finalResultMetricEl = document.getElementById("finalResultMetric");
const finalResultSecondaryEl = document.getElementById("finalResultSecondary");
const finalResultShareBtn = document.getElementById("finalResultShareBtn");
const finalResultPendingEl = document.getElementById("finalResultPending");
const finalResultPendingModesEl = document.getElementById("finalResultPendingModes");
const finalResultCompleteDayEl = document.getElementById("finalResultCompleteDay");
const finalResultHomeBtn = document.getElementById("finalResultHomeBtn");
let finalResultModeType = null;

const searchInput = document.getElementById("searchInput");
const autocompleteList = document.getElementById("autocompleteList");
const attemptsContainer = document.getElementById("attemptsContainer");
const pageContentEl = document.getElementById("pageContent");
const timerCountdownEl = document.getElementById("timerCountdown");
const timerCountdownHomeEl = document.getElementById("timerCountdownHome");
const yesterdayPlayerEl = document.getElementById("yesterdayPlayer");
const dailyEndMessageEl = document.getElementById("dailyEndMessage");
const shareResultBtn = document.getElementById("shareResultBtn");

// Modal de Boas-Vindas
const welcomeModal = document.getElementById("welcomeModal");
const welcomeNameInput = document.getElementById("welcomeNameInput");
const welcomeSubmitBtn = document.getElementById("welcomeSubmitBtn");

// ==========================================================================
// NOME DO JOGADOR (primeira visita)
// ==========================================================================

function aplicarSaudacao(nome) {
    if (!welcomeGreetingEl) return;
    if (nome) {
        const destaqueNome = document.createElement("strong");
        destaqueNome.textContent = nome;
        welcomeGreetingEl.replaceChildren(
            document.createTextNode("Fala, "),
            destaqueNome,
            document.createTextNode("! 🖤")
        );
        welcomeGreetingEl.classList.remove("hidden");
    } else {
        welcomeGreetingEl.replaceChildren();
        welcomeGreetingEl.classList.add("hidden");
    }
}

function verificarPrimeiraVisita() {
    const nomeSalvo = localStorage.getItem(CHAVE_USERNAME);
    if (nomeSalvo) {
        aplicarSaudacao(nomeSalvo);
        return;
    }
    welcomeModal.classList.remove("hidden");
    welcomeNameInput.focus();
}

function salvarNomeUsuario() {
    const nome = welcomeNameInput.value.trim() || "Torcedor";
    localStorage.setItem(CHAVE_USERNAME, nome);
    aplicarSaudacao(nome);
    welcomeModal.classList.add("hidden");
}

welcomeSubmitBtn.addEventListener("click", salvarNomeUsuario);
welcomeNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        salvarNomeUsuario();
    }
});

// ==========================================================================
// DATA / SEMENTE DO DESAFIO DIÁRIO
// ==========================================================================

// Data local no formato AAAA-MM-DD (não usa UTC, respeita o fuso do jogador)
function getDataLocalString() {
    return formatarDataLocal(new Date());
}

// ==========================================================================
// HISTÓRICO E PROGRESSO DIÁRIO INTEGRADO — V1
// Guarda apenas resumos; os saves detalhados dos modos continuam sendo a
// fonte de verdade do desafio atual.
// ==========================================================================

function carregarHistorico() {
    const salvo = lerJsonLocalStorage(CHAVE_HISTORICO);
    const normalizado = NormalizadoresStorage.normalizeHistory(
        salvo,
        VERSAO_HISTORICO,
        getDataLocalString()
    );
    if (!NormalizadoresStorage.isObject(salvo)) {
        salvarHistorico(normalizado);
        return normalizado;
    }
    return persistirNormalizacaoSegura(CHAVE_HISTORICO, salvo, normalizado);
}

function salvarHistorico(historico) {
    try {
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
    } catch (error) {
        console.warn("Não foi possível salvar o histórico diário:", error);
    }
}

function sincronizarProgressoDiario() {
    const historico = carregarHistorico();
    const estados = [
        ["classic", carregarEstadoDiario(), normalizarResumoClassico],
        ["photo", carregarEstadoFoto(), normalizarResumoFoto],
        ["moreLess", carregarEstadoMM(), normalizarResumoMaisMenos],
        ["lineup", carregarEstadoEscalacao(), normalizarResumoOnzeInicial]
    ];

    estados.forEach(([modo, estado, normalizar]) => {
        const resumo = normalizar(estado);
        if (!resumo) return;
        const dia = historico.days[estado.data] && typeof historico.days[estado.data] === "object"
            ? historico.days[estado.data]
            : criarResumoDiaVazio();
        // O save individual normalizado é a autoridade do jogo corrente.
        // O histórico nunca promove ou mantém um estado que esse save não confirma.
        dia[modo] = resumo;
        dia.complete = calcularProgressoDoResumo(dia).complete;
        historico.days[estado.data] = dia;
    });

    salvarHistorico(historico);
    renderizarProgressoHome();
    return historico;
}

function obterProgressoDiario(data = getDataLocalString()) {
    return obterProgressoHistorico(carregarHistorico(), data);
}

function obterStreakGeral(dataReferencia = getDataLocalString()) {
    return calcularStreakGeral(carregarHistorico(), dataReferencia);
}

function obterEstatisticasIntegradas(dataReferencia = getDataLocalString()) {
    return calcularEstatisticasIntegradas(carregarHistorico(), dataReferencia);
}







function marcarConclusaoCelebrada(data) {
    const historico = carregarHistorico();
    const dia = historico.days[data];
    if (!dia || dia.complete !== true || dia.completionCelebrated === true) return false;
    dia.completionCelebrated = true;
    salvarHistorico(historico);
    return true;
}

function gerarTextoCompartilhamentoDiario(data = getDataLocalString()) {
    const progresso = obterProgressoDiario(data);
    const streak = obterStreakGeral(data);
    return construirTextoCompartilhamentoDiario({ data, progresso, streak, url: URL_OFICIAL_TIMAODLE });
}

let timerFeedbackCompartilhamentoDiario = null;

function mostrarFeedbackCompartilhamentoDiario(texto, duracao = 2000) {
    if (!shareDailyResultBtn) return;
    clearTimeout(timerFeedbackCompartilhamentoDiario);
    shareDailyResultBtn.textContent = texto;
    timerFeedbackCompartilhamentoDiario = setTimeout(() => {
        shareDailyResultBtn.textContent = "COMPARTILHAR DIA";
    }, duracao);
}

async function compartilharResultadoDiario() {
    const texto = gerarTextoCompartilhamentoDiario();
    if (!texto) return false;
    const resultado = await compartilharTexto(texto);
    if (resultado.shareError && resultado.shareError.name !== "AbortError") {
        console.warn("Falha ao compartilhar o resumo diário:", resultado.shareError);
    }
    if (resultado.status === "shared") return true;
    if (resultado.status === "cancelled") return false;
    if (resultado.status === "copied") {
        mostrarFeedbackCompartilhamentoDiario("COPIADO! ✓");
        return true;
    }
    if (resultado.copyError) console.warn("Falha ao copiar o resumo diário:", resultado.copyError);
    mostrarFeedbackCompartilhamentoDiario("NÃO FOI POSSÍVEL COPIAR", 2600);
    return false;
}

function statusVisualDoModo(modo, tipo) {
    if (!modo?.started) return { estado: "not-started", rotulo: "NÃO INICIADO", detalhe: "Comece o desafio" };

    if (modo.completed) {
        const detalheConcluido = tipo === "moreLess"
            ? `${modo.hits}/10 acertos`
            : tipo === "lineup"
                ? "3/3 jogadores"
                : pluralizarQuantidade(modo.attempts, "tentativa", "tentativas");
        return { estado: "completed", rotulo: "✓ CONCLUÍDO", detalhe: detalheConcluido };
    }

    if (tipo === "classic") {
        return { estado: "in-progress", rotulo: "EM ANDAMENTO", detalhe: pluralizarQuantidade(modo.attempts, "tentativa", "tentativas") };
    }
    if (tipo === "photo") {
        return { estado: "in-progress", rotulo: "EM ANDAMENTO", detalhe: `Tentativa ${Math.min(6, modo.attempts + 1)}/6` };
    }
    if (tipo === "moreLess") {
        return { estado: "in-progress", rotulo: "EM ANDAMENTO", detalhe: `Rodada ${Math.min(10, modo.rounds + 1)}/10 · ${pluralizarQuantidade(modo.hits, "acerto", "acertos")}` };
    }
    const naFaseDePlacar = modo.phase === "score" || (!modo.phase && modo.resolved === 0);
    return {
        estado: "in-progress",
        rotulo: "EM ANDAMENTO",
        detalhe: naFaseDePlacar ? "PLACAR" : `${modo.resolved}/3 jogadores`
    };
}

function renderizarProgressoHome() {
    if (!homeDailyProgressEl || !homeProgressValueEl || !homeProgressFillEl) return;

    const progresso = obterProgressoDiario();
    homeProgressValueEl.textContent = progresso.progress;
    homeProgressFillEl.style.width = `${(progresso.completed / progresso.total) * 100}%`;
    homeProgressBarEl?.setAttribute("aria-valuenow", String(progresso.completed));
    homeDailyProgressEl.classList.toggle("is-complete", progresso.complete);
    homeModesEl?.classList.toggle("hidden", progresso.complete);
    if (homeProgressTitleEl) homeProgressTitleEl.textContent = progresso.complete ? "TIMÃODLE DO DIA CONCLUÍDO" : "TIMÃODLE DO DIA";
    if (homeProgressUnitEl) homeProgressUnitEl.textContent = progresso.complete ? "DESAFIOS" : "CONCLUÍDOS";

    if (homeProgressMessageEl) {
        homeProgressMessageEl.textContent = progresso.complete
            ? "Dia completo. Você encarou todos os desafios!"
            : progresso.completed === 0
                ? "Quatro desafios esperam por você."
                : `${progresso.completed} de 4 concluídos. Continue jogando!`;
    }

    const streak = obterStreakGeral(progresso.data);
    if (homeStreakCurrentEl) {
        homeStreakCurrentEl.textContent = streak.current > 0
            ? `${streak.current} ${streak.current === 1 ? "dia" : "dias"}`
            : "Comece sua sequência";
    }
    if (homeStreakBestEl) {
        homeStreakBestEl.textContent = `${streak.best} ${streak.best === 1 ? "dia" : "dias"}`;
    }

    if (homeCompletionSummaryEl) {
        homeCompletionSummaryEl.classList.toggle("hidden", !progresso.complete);
        if (progresso.complete) {
            homeCompletionMetricEls.classic.textContent = pluralizarQuantidade(progresso.modes.classic.attempts, "tentativa", "tentativas");
            homeCompletionMetricEls.photo.textContent = pluralizarQuantidade(progresso.modes.photo.attempts, "tentativa", "tentativas");
            homeCompletionMetricEls.moreLess.textContent = `${progresso.modes.moreLess.hits}/10 acertos`;
            homeCompletionMetricEls.lineup.textContent = pluralizarQuantidade(progresso.modes.lineup.errors, "erro", "erros");
        }
    }

    if (homeCompletionActionsEl) {
        homeCompletionActionsEl.classList.toggle("hidden", !progresso.complete);
    }
    if (shareDailyResultBtn) shareDailyResultBtn.disabled = !progresso.complete;

    Object.entries(homeStatusEls).forEach(([tipo, elemento]) => {
        if (!elemento) return;
        const status = statusVisualDoModo(progresso.modes[tipo], tipo);
        const botao = elemento.closest(".pokedle-btn");
        botao?.classList.remove("is-not-started", "is-in-progress", "is-completed");
        botao?.classList.add(`is-${status.estado}`);
        elemento.innerHTML = `<strong>${status.rotulo}</strong><span>${status.detalhe}</span>`;
    });

    const homeVisivel = !homeView?.classList.contains("hidden");
    if (progresso.complete && !progresso.modes.completionCelebrated && homeVisivel
        && marcarConclusaoCelebrada(progresso.data)) {
        if (!prefereMovimentoReduzido()) {
            homeDailyProgressEl.classList.remove("celebrate-once");
            void homeDailyProgressEl.offsetWidth;
            homeDailyProgressEl.classList.add("celebrate-once");
            homeDailyProgressEl.addEventListener("animationend", () => {
                homeDailyProgressEl.classList.remove("celebrate-once");
            }, { once: true });
        }
    }

    if (integratedStatsModal && !integratedStatsModal.classList.contains("hidden")) {
        renderizarEstatisticasIntegradas();
    }
}

function itemEstatistica(valor, rotulo) {
    return `<div><strong>${valor}</strong><span>${rotulo}</span></div>`;
}

function valorEstatisticaComAmostra(valor, temAmostra, sufixo = "") {
    return temAmostra ? `${valor}${sufixo}` : "—";
}

function estadoVazioEstatisticaModo() {
    return '<p class="integrated-mode-empty">Jogue este modo para construir suas estatísticas.</p>';
}

function formatarDistribuicao(distribuicao) {
    return Object.entries(distribuicao)
        .map(([faixa, total]) => `
            <span class="distribution-chip">
                <span>${faixa}</span>
                <strong>${total}</strong>
            </span>`)
        .join("");
}

function renderizarEstatisticasIntegradas() {
    if (!integratedStatsContent) return;
    const estatisticas = obterEstatisticasIntegradas();
    const { geral, classic, photo, moreLess, lineup } = estatisticas;

    if (geral.playedDays === 0) {
        integratedStatsContent.innerHTML = `
            <p class="stats-empty-state">Suas estatísticas começarão a aparecer conforme você joga os desafios diários.</p>`;
        return;
    }

    integratedStatsContent.innerHTML = `
        <section class="integrated-stats-general" aria-label="Estatísticas gerais">
            <div class="integrated-stats-primary">
                <div class="integrated-streak-summary">
                    <div class="integrated-streak-current">
                        <span class="integrated-stat-label">Sequência atual</span>
                        <strong>${geral.currentStreak}</strong>
                        <span class="integrated-stat-context">dias 4/4 consecutivos</span>
                    </div>
                    <div class="integrated-streak-record">
                        <span>Recorde</span>
                        <strong>${geral.bestStreak}</strong>
                        <small>dias</small>
                    </div>
                </div>
                <div class="integrated-completion-summary">
                    <span class="integrated-stat-label">Desempenho completo</span>
                    <div class="integrated-completion-values">
                        <div>
                            <strong>${geral.completeDays}</strong>
                            <span>dias 4/4</span>
                        </div>
                        <div>
                            <strong>${geral.completeDayRate}%</strong>
                            <span>dos dias jogados</span>
                        </div>
                    </div>
                </div>
            </div>
            <dl class="integrated-stats-secondary">
                <div><dt>Dias jogados</dt><dd>${geral.playedDays}</dd></div>
                <div><dt>Modos concluídos</dt><dd>${geral.completedModes}</dd></div>
                <div><dt>Vitórias</dt><dd>${geral.wins}</dd></div>
            </dl>
            <p class="integrated-stats-registered">
                <span>Dias registrados no histórico</span>
                <strong>${geral.registeredDays}</strong>
                <small>Inclui dias armazenados mesmo sem desafio iniciado.</small>
            </p>
        </section>
        <div class="integrated-mode-grid">
            <section class="integrated-mode-card">
                <h3>CLÁSSICO</h3>
                ${classic.started === 0 ? estadoVazioEstatisticaModo() : `
                    <div class="integrated-mode-primary">
                        ${itemEstatistica(classic.completed, "Concluídos")}
                        ${itemEstatistica(valorEstatisticaComAmostra(classic.averageAttemptsWins, classic.completedAttempts > 0), "Média de tentativas")}
                    </div>
                    <p class="integrated-mode-secondary">
                        <span><strong>${classic.started}</strong> iniciados</span>
                        <span><strong>${valorEstatisticaComAmostra(classic.bestAttempts, classic.completedAttempts > 0)}</strong> melhor resultado</span>
                    </p>
                    <details class="integrated-mode-details">
                        <summary>Ver detalhes</summary>
                        <div class="integrated-mode-stats">
                            ${itemEstatistica(classic.wins, "Vitórias")}
                            ${itemEstatistica(classic.completedAttempts, "Tentativas acumuladas")}
                        </div>
                        <div class="integrated-distribution">
                            <span class="distribution-title">Distribuição de tentativas</span>
                            <div class="distribution-grid">${formatarDistribuicao(classic.distribution)}</div>
                        </div>
                    </details>`}
            </section>
            <section class="integrated-mode-card">
                <h3>FOTO</h3>
                ${photo.started === 0 ? estadoVazioEstatisticaModo() : `
                    <div class="integrated-mode-primary">
                        ${itemEstatistica(photo.wins, "Vitórias")}
                        ${itemEstatistica(valorEstatisticaComAmostra(photo.winRate, photo.completed > 0, "%"), "Taxa de vitória")}
                        ${itemEstatistica(valorEstatisticaComAmostra(photo.averageAttemptsWins, photo.wins > 0), "Média por vitória")}
                    </div>
                    <p class="integrated-mode-secondary">
                        <span><strong>${photo.completed}</strong> concluídos</span>
                        <span><strong>${photo.losses}</strong> derrotas</span>
                        <span><strong>${valorEstatisticaComAmostra(photo.bestWin, photo.wins > 0)}</strong> melhor vitória</span>
                    </p>
                    <details class="integrated-mode-details">
                        <summary>Ver detalhes</summary>
                        <div class="integrated-mode-stats">
                            ${itemEstatistica(photo.started, "Iniciados")}
                            ${itemEstatistica(valorEstatisticaComAmostra(photo.averageAttemptsCompleted, photo.completed > 0), "Média geral")}
                        </div>
                        <div class="integrated-distribution">
                            <span class="distribution-title">Distribuição de tentativas</span>
                            <div class="distribution-grid">${formatarDistribuicao(photo.distribution)}</div>
                        </div>
                    </details>`}
            </section>
            <section class="integrated-mode-card">
                <h3>MAIS OU MENOS</h3>
                ${moreLess.started === 0 ? estadoVazioEstatisticaModo() : `
                    <div class="integrated-mode-primary">
                        ${itemEstatistica(moreLess.wins, "Vitórias")}
                        ${itemEstatistica(valorEstatisticaComAmostra(moreLess.winRate, moreLess.completed > 0, "%"), "Taxa de vitória")}
                        ${itemEstatistica(valorEstatisticaComAmostra(moreLess.averageHits, moreLess.completed > 0), "Média de acertos")}
                    </div>
                    <p class="integrated-mode-secondary">
                        <span><strong>${moreLess.completed}</strong> concluídos</span>
                        <span><strong>${valorEstatisticaComAmostra(moreLess.bestResult, moreLess.completed > 0)}</strong> melhor</span>
                        <span><strong>${moreLess.sevenPlusResults}</strong> resultados 7+</span>
                    </p>
                    <details class="integrated-mode-details">
                        <summary>Ver detalhes</summary>
                        <div class="integrated-mode-stats">
                            ${itemEstatistica(moreLess.started, "Iniciados")}
                            ${itemEstatistica(moreLess.losses, "Derrotas")}
                            ${itemEstatistica(valorEstatisticaComAmostra(moreLess.worstResult, moreLess.completed > 0), "Pior resultado")}
                            ${itemEstatistica(moreLess.perfectResults, "Resultados 10/10")}
                        </div>
                        <div class="integrated-distribution">
                            <span class="distribution-title">Distribuição de acertos</span>
                            <div class="distribution-grid distribution-grid-wide">${formatarDistribuicao(moreLess.distribution)}</div>
                        </div>
                    </details>`}
            </section>
            <section class="integrated-mode-card">
                <h3>ONZE INICIAL</h3>
                ${lineup.started === 0 ? estadoVazioEstatisticaModo() : `
                    <div class="integrated-mode-primary">
                        ${itemEstatistica(lineup.completed, "Concluídos")}
                        ${itemEstatistica(valorEstatisticaComAmostra(lineup.averageErrors, lineup.completed > 0), "Média de erros")}
                    </div>
                    <p class="integrated-mode-secondary">
                        <span><strong>${valorEstatisticaComAmostra(lineup.bestErrors, lineup.completed > 0)}</strong> menor número de erros</span>
                        <span><strong>${lineup.exactScores}</strong> placares exatos</span>
                    </p>
                    <details class="integrated-mode-details">
                        <summary>Ver detalhes</summary>
                        <div class="integrated-mode-stats">
                            ${itemEstatistica(lineup.started, "Iniciados")}
                            ${itemEstatistica(lineup.totalErrors, "Erros acumulados")}
                            ${itemEstatistica(lineup.zeroErrorCompletions, "Conclusões sem erros")}
                            ${itemEstatistica(valorEstatisticaComAmostra(lineup.exactScoreRate, lineup.exactScoreEvaluated > 0, "%"), "Taxa de placar exato")}
                        </div>
                    </details>`}
            </section>
        </div>`;
}

const historyUIElements = {
    openButton: document.getElementById("btnOpenHistory"),
    modal: document.getElementById("historyModal"),
    closeButton: document.getElementById("btnCloseHistory"),
    previousMonth: document.getElementById("historyPreviousMonth"),
    nextMonth: document.getElementById("historyNextMonth"),
    monthTitle: document.getElementById("historyMonthTitle"),
    calendarGrid: document.getElementById("historyCalendarGrid"),
    daySummary: document.getElementById("historyDaySummary"),
    summaryEmpty: document.getElementById("historySummaryEmpty"),
    noRecord: document.getElementById("historyNoRecord"),
    dayDetails: document.getElementById("historyDayDetails"),
    selectedDateTitle: document.getElementById("historySelectedDateTitle"),
    classicSummary: document.getElementById("historyClassicSummary"),
    photoSummary: document.getElementById("historyPhotoSummary"),
    moreLessSummary: document.getElementById("historyMoreLessSummary"),
    lineupSummary: document.getElementById("historyLineupSummary"),
    lineupExactScore: document.getElementById("historyLineupExactScore"),
    overallProgress: document.getElementById("historyOverallProgress"),
    historicalStreak: document.getElementById("historyHistoricalStreak"),
    historicalStreakText: document.getElementById("historyHistoricalStreakText")
};
const historyUI = TimaodleHistoryUI.createHistoryUI({
    documentApi: document,
    elements: historyUIElements,
    getHistory: carregarHistorico,
    getCurrentDate: getDataLocalString,
    openDialog: abrirModalAcessivel,
    closeDialog: fecharModalAcessivel
});
historyUI.init();

function abrirEstatisticasIntegradas() {
    renderizarEstatisticasIntegradas();
    abrirModalAcessivel(integratedStatsModal, btnOpenIntegratedStats, btnCloseIntegratedStats);
}

function fecharEstatisticasIntegradas() {
    fecharModalAcessivel(integratedStatsModal, btnOpenIntegratedStats);
}

function abrirComoJogar() {
    abrirModalAcessivel(howToPlayModal, btnOpenHowToPlay, btnCloseHowToPlay);
}

function fecharComoJogar() {
    fecharModalAcessivel(howToPlayModal, btnOpenHowToPlay);
}

const FINAL_RESULT_MODES = {
    classic: { label: "CLÁSSICO", buttonId: "btnPlayDiario", viewId: "gameView", backId: "backHomeBtn" },
    photo: { label: "FOTO", buttonId: "btnPlayFoto", viewId: "photoView", backId: "backHomeBtnFoto" },
    moreLess: { label: "MAIS OU MENOS", buttonId: "btnPlayMaisMenos", viewId: "maisMenosView", backId: "backHomeBtnMM" },
    lineup: { label: "ONZE INICIAL", buttonId: "btnPlayEscalacao", viewId: "escalacaoView", backId: "backHomeBtnEsc" }
};

function pluralResultado(quantidade, singular, plural) {
    return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

function dadosResultadoFinal(tipo) {
    if (tipo === "classic") {
        const tentativas = classicMode?.getState()?.tentativas?.length || 0;
        return { outcome: "won", title: "GANHOU", metric: pluralResultado(tentativas, "TENTATIVA", "TENTATIVAS") };
    }
    if (tipo === "photo") {
        const estado = photoMode?.getState();
        const tentativas = estado?.tentativas?.length || 0;
        const venceu = estado?.status === "won";
        return { outcome: venceu ? "won" : "lost", title: venceu ? "GANHOU" : "PERDEU", metric: `${tentativas} / ${TimaodlePhotoMode.MAX_TENTATIVAS_FOTO} TENTATIVAS` };
    }
    if (tipo === "moreLess") {
        const venceu = moreLessMode?.getState()?.status === "won";
        return { outcome: venceu ? "won" : "lost", title: venceu ? "GANHOU" : "PERDEU", metric: `${moreLessMode?.getHits() || 0} / ${TimaodleMoreLessMode.RODADAS_MM} ACERTOS` };
    }
    const total = lineupMode?.getMatch()?.jogadores_ocultos?.length || 3;
    const erros = lineupMode?.getErrors() || 0;
    return {
        outcome: "completed",
        title: "CONCLUÍDO",
        metric: `${total} / ${total} JOGADORES`,
        secondary: `${pluralResultado(erros, "ERRO", "ERROS")}${lineupMode?.getState()?.exactScore === true ? " · PLACAR EXATO" : ""}`
    };
}

function modosPendentesResultado(tipoAtual, progresso) {
    return Object.keys(FINAL_RESULT_MODES)
        .filter(tipo => tipo !== tipoAtual && progresso?.modes?.[tipo]?.completed !== true)
        .map(tipo => ({
            tipo,
            label: FINAL_RESULT_MODES[tipo].label,
            status: progresso.modes[tipo]?.started ? "EM ANDAMENTO" : "NÃO INICIADO"
        }));
}

function renderizarModosPendentesResultado(tipoAtual, progresso) {
    finalResultPendingModesEl.replaceChildren();
    const pendentes = modosPendentesResultado(tipoAtual, progresso);

    pendentes.forEach(({ tipo, label, status: textoStatus }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "final-result-pending-mode";
        const nome = document.createElement("strong");
        nome.textContent = label;
        const status = document.createElement("span");
        status.textContent = textoStatus;
        button.append(nome, status);
        button.addEventListener("click", () => navegarDoResultadoParaModo(tipo));
        finalResultPendingModesEl.appendChild(button);
    });

    finalResultPendingEl.classList.toggle("hidden", progresso.complete || pendentes.length === 0);
    finalResultCompleteDayEl.classList.toggle("hidden", !progresso.complete);
}

function abrirResultadoFinal(tipo) {
    const config = FINAL_RESULT_MODES[tipo];
    if (!config || !finalResultModal) return;
    const dados = dadosResultadoFinal(tipo);
    const progresso = obterProgressoDiario();
    finalResultModeType = tipo;
    finalResultModeEl.textContent = config.label;
    finalResultTitleEl.textContent = dados.title;
    finalResultMetricEl.textContent = dados.metric;
    finalResultSecondaryEl.textContent = dados.secondary || "";
    finalResultSecondaryEl.classList.toggle("hidden", !dados.secondary);
    finalResultModal.classList.remove("is-won", "is-lost", "is-completed");
    finalResultModal.classList.add(`is-${dados.outcome}`);
    renderizarModosPendentesResultado(tipo, progresso);
    abrirModalAcessivel(finalResultModal, document.getElementById(config.backId), finalResultTitleEl);
}

function fecharResultadoFinal() {
    const config = FINAL_RESULT_MODES[finalResultModeType];
    fecharModalAcessivel(finalResultModal, config ? document.getElementById(config.backId) : null);
}

function ocultarViewsDeJogo() {
    Object.values(FINAL_RESULT_MODES).forEach(config => document.getElementById(config.viewId)?.classList.add("hidden"));
}

function navegarDoResultadoParaModo(tipo) {
    const button = document.getElementById(FINAL_RESULT_MODES[tipo]?.buttonId);
    if (!button) return;
    fecharResultadoFinal();
    ocultarViewsDeJogo();
    homeView.classList.remove("hidden");
    button.click();
}

function voltarParaHomeDoResultado() {
    fecharResultadoFinal();
    moreLessMode?.cancelPendingAdvance();
    ocultarViewsDeJogo();
    homeView.classList.remove("hidden");
    renderizarProgressoHome();
    const progresso = obterProgressoDiario();
    (progresso.complete ? shareDailyResultBtn : btnPlayDiario)?.focus({ preventScroll: true });
}

btnOpenIntegratedStats?.addEventListener("click", abrirEstatisticasIntegradas);
btnCloseIntegratedStats?.addEventListener("click", fecharEstatisticasIntegradas);
btnOpenHowToPlay?.addEventListener("click", abrirComoJogar);
btnCloseHowToPlay?.addEventListener("click", fecharComoJogar);
finalResultCloseBtn?.addEventListener("click", fecharResultadoFinal);
finalResultHomeBtn?.addEventListener("click", voltarParaHomeDoResultado);
finalResultShareBtn?.addEventListener("click", () => {
    if (finalResultModeType === "classic") compartilharResultado();
    else if (finalResultModeType === "photo") photoMode.share();
    else if (finalResultModeType === "moreLess") moreLessMode.share();
    else if (finalResultModeType === "lineup") lineupMode.share(finalResultShareBtn);
});
// ==========================================================================
// CONTAGEM REGRESSIVA ATÉ A MEIA-NOITE (PRÓXIMO DESAFIO)
// ==========================================================================
let timerInterval = null;

function atualizarTimer() {
    const agora = new Date();
    const meiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 0, 0);
    const diffMs = meiaNoite - agora;

    if (diffMs <= 0) {
        // Virou o dia — recarrega para pegar o novo desafio automaticamente
        window.location.reload();
        return;
    }

    const horas = String(Math.floor(diffMs / 3600000)).padStart(2, "0");
    const minutos = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, "0");
    const segundos = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, "0");
    const texto = `${horas}:${minutos}:${segundos}`;

    if (timerCountdownEl) timerCountdownEl.innerText = texto;
    if (timerCountdownHomeEl) timerCountdownHomeEl.innerText = texto;
    if (escNextChallengeCountdownEl) escNextChallengeCountdownEl.innerText = texto;

    // No Modo Foto, depois que o desafio do dia termina (ganhou ou
    // perdeu), o rótulo de tentativas vira a contagem pro próximo dia.
    photoMode?.atualizarContagemRegressiva(texto);

    moreLessMode?.updateCountdown(texto);
}

function iniciarTimer() {
    atualizarTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(atualizarTimer, 1000);
}

// ==========================================================================
// PERSISTÊNCIA DIÁRIA (localStorage)
// ==========================================================================

function carregarEstadoDiario() {
    const salvo = lerJsonLocalStorage(CHAVE_ESTADO_DIARIO);
    const nomes = jogadores.length ? jogadores.map(jogador => jogador.nome) : null;
    const normalizado = NormalizadoresStorage.normalizeClassic(salvo, {
        playerNames: nomes,
        secretName: classicMode?.getSecretPlayer()?.nome || null
    });
    return persistirNormalizacaoSegura(CHAVE_ESTADO_DIARIO, salvo, normalizado);
}

function salvarEstadoDiario(estado) {
    localStorage.setItem(CHAVE_ESTADO_DIARIO, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

// ==========================================================================
// NAVEGAÇÃO — TELA INICIAL ⇄ MODO DIÁRIO
// (estrutura pronta para receber outros modos no futuro)
// ==========================================================================

btnPlayDiario.addEventListener("click", () => {
    homeView.classList.add("hidden");
    gameView.classList.remove("hidden");
    if (jogadores.length === 0) {
        carregarJogadores().then(() => classicMode.start());
    } else {
        classicMode.start();
    }
});

backHomeBtn.addEventListener("click", () => {
    gameView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderizarProgressoHome();
});

// ==========================================================================
// CARREGAMENTO DOS JOGADORES E INÍCIO DO DESAFIO DO DIA
// ==========================================================================

async function carregarJogadores() {
    try {
        const response = await fetch('jogadores.json');
        jogadores = await response.json();
    } catch (error) {
        console.error("Erro ao carregar o JSON:", error);
        alert("Erro ao carregar a base de jogadores. Verifique se o servidor local está rodando.");
    }
}

function dispararConfetes() {
    if (prefereMovimentoReduzido()) return;

    if (typeof confetti === 'function') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
}

function prefereMovimentoReduzido() {
    return typeof window !== "undefined"
        && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

// ==========================================================================
// ESTATÍSTICAS (registradas em segundo plano)
// ==========================================================================

function salvarEstatisticaVitoria() {
    stats.jogos++;
    stats.vitorias++;
    stats.streak++;
    if (stats.streak > stats.maxStreak) {
        stats.maxStreak = stats.streak;
    }
    localStorage.setItem(CHAVE_STATS, JSON.stringify(stats));
}

// ==========================================================================
// COMPARTILHAR RESULTADO
// ==========================================================================

// Data de referência do "Desafio #1" — usada só para numerar os desafios
// no texto compartilhado (ajustável conforme a data real de lançamento).
const DATA_LANCAMENTO = new Date(2026, 0, 1);

function numeroDoDesafio(dataStr) {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    const dataAtual = new Date(ano, mes - 1, dia);
    const diffDias = Math.round((dataAtual - DATA_LANCAMENTO) / 86400000);
    return diffDias + 1;
}

classicMode = globalThis.TimaodleClassic.createClassicMode({
    documentApi: document,
    elements: {
        searchInput,
        autocompleteList,
        attemptsContainer,
        endMessage: dailyEndMessageEl,
        shareButton: shareResultBtn,
        pageContent: pageContentEl
    },
    getPlayers: () => jogadores,
    getDate: getDataLocalString,
    hashString,
    autocomplete: {
        create: criarAutocomplete,
        filter: filtrarSugestoes
    },
    storage: {
        load: () => {
            const salvo = carregarEstadoDiario();
            if (salvo?.data) sincronizarProgressoDiario();
            return salvo;
        },
        save: salvarEstadoDiario
    },
    sharing: {
        build: construirTextoCompartilhamentoClassico,
        share: compartilharTexto
    },
    getChallengeNumber: numeroDoDesafio,
    officialUrl: URL_OFICIAL_TIMAODLE,
    onWin: salvarEstatisticaVitoria,
    onComplete: () => abrirResultadoFinal("classic"),
    celebrate: dispararConfetes,
    alertApi: texto => alert(texto)
});

function compartilharResultado() {
    return classicMode.compartilharResultado();
}

async function compartilharTextoNovoModo(texto, botaoFeedback = finalResultShareBtn) {
    const resultado = await compartilharTexto(texto);
    if (resultado.status === "shared") return true;
    if (resultado.status === "cancelled") return false;
    if (resultado.status === "copied") {
        if (botaoFeedback) {
            const original = botaoFeedback.innerText;
            botaoFeedback.innerText = "COPIADO! ✓";
            setTimeout(() => { botaoFeedback.innerText = original; }, 2000);
        }
        return true;
    }
    alert(texto);
    return false;
}

shareDailyResultBtn?.addEventListener("click", compartilharResultadoDiario);

// ==========================================================================
// WIDGET DE LINKS ÚTEIS
// ==========================================================================
(function () {
    const widget = document.getElementById("usefulLinksWidget");
    const btn = document.getElementById("usefulLinksBtn");
    const arrow = document.getElementById("usefulLinksArrow");
    if (!widget || !btn) return;

    function setState(isOpen) {
        widget.classList.toggle("open", isOpen);
        btn.setAttribute("aria-expanded", isOpen);
        if (arrow) arrow.textContent = isOpen ? "❮" : "❯";
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setState(!widget.classList.contains("open"));
    });

    document.addEventListener("click", (e) => {
        if (!widget.contains(e.target)) setState(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setState(false);
    });
})();

/* ==========================================================================
   TIMÃODLE — MODO FOTO
   Modo novo e independente do Modo Diário: adivinhe o jogador a partir
   de uma foto que começa borrada e em preto-e-branco, e vai "focando"
   a cada tentativa. A lista de quem tem foto disponível vem de
   fotos-manifest.json — pra adicionar um jogador novo no modo, basta
   colocar o arquivo em fotos/<slug-do-nome>.jpg e incluir o nome nesse
   arquivo (não precisa mexer neste script.js).
   ========================================================================== */

const CHAVE_ESTADO_FOTO = "timaodle_foto_daily_state";
const CHAVE_TUTORIAL_FOTO = "timaodle_foto_tutorial_visto";

// Preenchido dinamicamente a partir de fotos-manifest.json (ver
// carregarManifestoFotos() lá embaixo).
let JOGADORES_COM_FOTO = [];
let catalogoFotos = TimaodlePhotoCatalog.createPhotoCatalog({
    jogadores: [],
    manifesto: [],
    hashString
});

async function carregarManifestoFotos() {
    try {
        const response = await fetch('fotos-manifest.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const manifesto = await response.json();
        if (jogadores.length === 0) await carregarJogadores();
        catalogoFotos = TimaodlePhotoCatalog.createPhotoCatalog({ jogadores, manifesto, hashString });
        JOGADORES_COM_FOTO = catalogoFotos.nomes();
    } catch (error) {
        console.error("Erro ao carregar fotos-manifest.json:", error);
        catalogoFotos = TimaodlePhotoCatalog.createPhotoCatalog({ jogadores, manifesto: [], hashString });
        JOGADORES_COM_FOTO = catalogoFotos.nomes();
    }
}

const FOTO_INDISPONIVEL_DATA_URI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-label="Foto indisponível">
        <rect width="480" height="480" fill="#11110f"/>
        <circle cx="240" cy="170" r="72" fill="#25231e" stroke="#b9975a" stroke-width="8"/>
        <path d="M112 380c12-82 58-126 128-126s116 44 128 126" fill="#25231e" stroke="#b9975a" stroke-width="8" stroke-linecap="round"/>
        <text x="240" y="430" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle">Foto indisponível</text>
    </svg>
`)}`;

function definirFotoJogador(elemento, jogador) {
    if (!elemento || !jogador?.nome) return;

    const nome = jogador.nome;
    elemento.classList.remove("image-fallback");
    elemento.alt = `Foto de ${nome}`;
    elemento.onerror = () => {
        elemento.onerror = null;
        elemento.classList.add("image-fallback");
        elemento.alt = `Foto indisponível de ${nome}`;
        elemento.src = FOTO_INDISPONIVEL_DATA_URI;
    };
    elemento.src = catalogoFotos.caminhoFoto(nome);
}

// Elementos da interface do Modo Foto
const photoView = document.getElementById("photoView");
const btnPlayFoto = document.getElementById("btnPlayFoto");
const backHomeBtnFoto = document.getElementById("backHomeBtnFoto");
const photoImgEl = document.getElementById("photoImg");
const photoDotsEl = document.getElementById("photoDots");
const photoAttemptsLabelEl = document.getElementById("photoAttemptsLabel");
const photoDifficultyBadgeEl = document.getElementById("photoDifficultyBadge");
const photoSearchInput = document.getElementById("photoSearchInput");
const photoAutocompleteList = document.getElementById("photoAutocompleteList");
const photoAttemptsListEl = document.getElementById("photoAttemptsList");
const photoEndMessageEl = document.getElementById("photoEndMessage");
const photoShareResultBtn = document.getElementById("photoShareResultBtn");
const photoGrayscaleToggle = document.getElementById("photoGrayscaleToggle");
const photoTutorialModal = document.getElementById("photoTutorialModal");
const photoTutorialCloseBtn = document.getElementById("photoTutorialCloseBtn");

function jogadoresComFotoObjetos() {
    return catalogoFotos.jogadores();
}

function jogadorTemJogosValidosMM(jogador) {
    return jogador
        && Object.prototype.hasOwnProperty.call(jogador, TimaodleMoreLessMode.CAMPO_STAT_MM)
        && typeof jogador[TimaodleMoreLessMode.CAMPO_STAT_MM] === "number"
        && Number.isFinite(jogador[TimaodleMoreLessMode.CAMPO_STAT_MM]);
}

function jogadoresElegiveisMM() {
    return jogadoresComFotoObjetos().filter(jogadorTemJogosValidosMM);
}

function carregarEstadoFoto() {
    const salvo = lerJsonLocalStorage(CHAVE_ESTADO_FOTO);
    const normalizado = NormalizadoresStorage.normalizePhoto(salvo, {
        playerNames: jogadores.length ? jogadores.map(jogador => jogador.nome) : null,
        photoNames: JOGADORES_COM_FOTO.length ? JOGADORES_COM_FOTO : null
    });
    return persistirNormalizacaoSegura(CHAVE_ESTADO_FOTO, salvo, normalizado);
}

function salvarEstadoFoto(estado) {
    localStorage.setItem(CHAVE_ESTADO_FOTO, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

photoMode = TimaodlePhotoMode.createPhotoMode({
    documentApi: document,
    elements: {
        view: photoView,
        playButton: btnPlayFoto,
        backButton: backHomeBtnFoto,
        image: photoImgEl,
        dots: photoDotsEl,
        attemptsLabel: photoAttemptsLabelEl,
        difficultyBadge: photoDifficultyBadgeEl,
        searchInput: photoSearchInput,
        autocompleteList: photoAutocompleteList,
        attemptsList: photoAttemptsListEl,
        endMessage: photoEndMessageEl,
        shareButton: photoShareResultBtn,
        grayscaleToggle: photoGrayscaleToggle,
        tutorialCloseButton: photoTutorialCloseBtn
    },
    getDate: getDataLocalString,
    getCatalog: () => catalogoFotos,
    autocomplete: { create: criarAutocomplete, filter: filtrarSugestoes },
    storage: {
        load: () => {
            const salvo = carregarEstadoFoto();
            if (salvo?.data) sincronizarProgressoDiario();
            return salvo;
        },
        save: salvarEstadoFoto
    },
    sharing: {
        build: construirTextoCompartilhamentoFoto,
        share: compartilharTextoNovoModo,
        getChallengeNumber: numeroDoDesafio,
        getDefaultFeedbackButton: () => finalResultShareBtn,
        officialUrl: URL_OFICIAL_TIMAODLE
    },
    tutorial: {
        isSeen: () => Boolean(localStorage.getItem(CHAVE_TUTORIAL_FOTO)),
        markSeen: () => localStorage.setItem(CHAVE_TUTORIAL_FOTO, "1"),
        open: () => abrirModalAcessivel(photoTutorialModal, photoSearchInput, photoTutorialCloseBtn),
        close: () => fecharModalAcessivel(photoTutorialModal, photoSearchInput)
    },
    navigation: {
        beforeOpen: async () => {
            homeView.classList.add("hidden");
            const tarefas = [];
            if (jogadores.length === 0) tarefas.push(carregarJogadores());
            if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());
            if (tarefas.length > 0) await Promise.all(tarefas);
        },
        back: () => {
            homeView.classList.remove("hidden");
            renderizarProgressoHome();
        }
    },
    setPlayerPhoto: definirFotoJogador,
    onCelebrate: dispararConfetes,
    onComplete: () => abrirResultadoFinal("photo")
});

infraestruturaDialogs.registrarDialogs([
    { dialog: finalResultModal, onClose: fecharResultadoFinal, fecharNoBackdrop: true },
    { dialog: howToPlayModal, onClose: fecharComoJogar, fecharNoBackdrop: true },
    { dialog: integratedStatsModal, onClose: fecharEstatisticasIntegradas, fecharNoBackdrop: true },
    { dialog: historyUIElements.modal, onClose: historyUI.close, fecharNoBackdrop: true },
    { dialog: photoTutorialModal, onClose: photoMode.fecharTutorial, fecharNoBackdrop: false }
]);

/* ==========================================================================
   TIMÃODLE — JOGOU MAIS OU MENOS
   Runtime extraído para more-less-mode.js; composição e integrações globais.
   ========================================================================== */

const CHAVE_ESTADO_MM = "timaodle_mm_daily_state";
const moreLessCore = TimaodleMoreLessCore.createMoreLessCore({
    getPool: jogadoresElegiveisMM,
    hashString
});

function carregarEstadoMM() {
    const salvo = lerJsonLocalStorage(CHAVE_ESTADO_MM);
    const normalizado = NormalizadoresStorage.normalizeMoreLess(salvo);
    return persistirNormalizacaoSegura(CHAVE_ESTADO_MM, salvo, normalizado);
}

function salvarEstadoMM(estado) {
    localStorage.setItem(CHAVE_ESTADO_MM, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

const maisMenosView = document.getElementById("maisMenosView");
moreLessMode = TimaodleMoreLessMode.createMoreLessMode({
    documentApi: document,
    elements: {
        view: maisMenosView,
        playButton: document.getElementById("btnPlayMaisMenos"),
        backButton: document.getElementById("backHomeBtnMM"),
        roundLabel: document.getElementById("mmRoundLabel"),
        dots: document.getElementById("mmDots"),
        hitsLabel: document.getElementById("mmHitsLabel"),
        referencePhoto: document.getElementById("mmRefFoto"),
        referenceName: document.getElementById("mmRefNome"),
        referenceMeta: document.getElementById("mmRefMeta"),
        referenceStat: document.getElementById("mmRefStat"),
        referenceStatLabel: document.getElementById("mmRefStatLabel"),
        candidatePhoto: document.getElementById("mmCandFoto"),
        candidateName: document.getElementById("mmCandNome"),
        candidateMeta: document.getElementById("mmCandMeta"),
        candidateStat: document.getElementById("mmCandStat"),
        candidateStatLabel: document.getElementById("mmCandStatLabel"),
        candidateRow: document.getElementById("mmCandRow"),
        dividerText: document.getElementById("mmDividerText"),
        lessButton: document.getElementById("mmBtnMenos"),
        moreButton: document.getElementById("mmBtnMais"),
        roundResult: document.getElementById("mmRoundResult"),
        endMessage: document.getElementById("mmEndMessage"),
        shareButton: document.getElementById("mmShareResultBtn"),
        card: maisMenosView.querySelector(".mm-card")
    },
    getDate: getDataLocalString,
    getPlayers: () => jogadores,
    isEligiblePlayer: jogadorTemJogosValidosMM,
    core: {
        generateV1: moreLessCore.gerarSequenciaMMV1,
        generateV2: moreLessCore.gerarDesafioMMV2,
        direction: TimaodleMoreLessCore.direcaoComparacaoMM
    },
    storage: { load: carregarEstadoMM, save: salvarEstadoMM },
    onStateLoaded: sincronizarProgressoDiario,
    sharing: {
        build: construirTextoCompartilhamentoMM,
        share: compartilharTextoNovoModo,
        getChallengeNumber: numeroDoDesafio,
        getDefaultFeedbackButton: () => finalResultShareBtn,
        officialUrl: URL_OFICIAL_TIMAODLE
    },
    navigation: {
        beforeOpen: () => homeView.classList.add("hidden"),
        loadData: async () => {
            const tarefas = [];
            if (jogadores.length === 0) tarefas.push(carregarJogadores());
            if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());
            if (tarefas.length > 0) await Promise.all(tarefas);
        },
        back: () => {
            homeView.classList.remove("hidden");
            renderizarProgressoHome();
        }
    },
    setPlayerPhoto: definirFotoJogador,
    onCelebrate: dispararConfetes,
    onComplete: () => abrirResultadoFinal("moreLess")
});
/* ==========================================================================
   TIMÃODLE — ONZE INICIAL (protótipo do "Modo Escalação")
   Ainda SEM persistência diária de propósito — é um protótipo funcional
   pra validar a mecânica antes de polir (semente por data, mais partidas
   de exemplo, etc. ficam pra depois).

   Fluxo: 1) a pessoa palpita o placar final; 2) confirma e o resultado
   real é revelado; 3) o card do onze inicial aparece, com um único campo
   de busca (sem modal) — a cada nome digitado, o jogo confere sozinho se
   esse nome corresponde a algum jogador ainda oculto e revela o slot
   certo automaticamente, ou mostra "Fora" se não fazia parte do time.

   Estrutura de dados (escalacao-exemplo.json):
   {
     "competicao": string, "mandante": string, "visitante": string,
     "local_tag": string, "data": string, "estadio": string,
     "placar_real": { "mandante": number, "visitante": number },
     "jogadores_visiveis": [{ nome, posicao_abrev, top, left }],   // dados já revelados
     "jogadores_ocultos":  [{ slot_id, posicao_abrev, top, left, nome_correto }] // a adivinhar
   }
   "top" e "left" são porcentagens (0-100) de posição no campo.
   ========================================================================== */

const escalacaoView = document.getElementById("escalacaoView");
const btnPlayEscalacao = document.getElementById("btnPlayEscalacao");
const backHomeBtnEsc = document.getElementById("backHomeBtnEsc");

// Card de contexto / palpite de placar
const escCompeticaoEl = document.getElementById("escCompeticao");
const escConfrontoEl = document.getElementById("escConfronto");
const escLocalTagEl = document.getElementById("escLocalTag");
const escDataEstadioEl = document.getElementById("escDataEstadio");
const escScoreGuessEl = document.getElementById("escScoreGuess");
const escEscudoMandanteEl = document.getElementById("escEscudoMandante");
const escNomeMandanteEl = document.getElementById("escNomeMandante");
const escCrestVisitanteEl = document.getElementById("escCrestVisitante");
const escNomeVisitanteEl = document.getElementById("escNomeVisitante");
const escScoreMandanteInput = document.getElementById("escScoreMandante");
const escScoreVisitanteInput = document.getElementById("escScoreVisitante");
const escConfirmarPlacarBtn = document.getElementById("escConfirmarPlacar");
const escResultadoFinalEl = document.getElementById("escResultadoFinal");
const escEscudoMandante2El = document.getElementById("escEscudoMandante2");
const escNomeMandante2El = document.getElementById("escNomeMandante2");
const escCrestVisitante2El = document.getElementById("escCrestVisitante2");
const escNomeVisitante2El = document.getElementById("escNomeVisitante2");
const escPlacarFinalEl = document.getElementById("escPlacarFinal");
const escPalpitePlacarResultadoEl = document.getElementById("escPalpitePlacarResultado");

// Card do onze inicial
const escLineupCardEl = document.getElementById("escLineupCard");
const escalacaoProgressEl = document.getElementById("escalacaoProgress");
const escalacaoDotsEl = document.getElementById("escalacaoDots");
const escalacaoFaltamEl = document.getElementById("escalacaoFaltam");
const pitchFieldEl = document.getElementById("pitchField");
const escalacaoSearchInput = document.getElementById("escalacaoSearchInput");
const escalacaoAutocompleteList = document.getElementById("escalacaoAutocompleteList");
const escalacaoFeedbackEl = document.getElementById("escalacaoFeedback");
const escalacaoForaListEl = document.getElementById("escalacaoForaList");
const escalacaoEndMessageEl = document.getElementById("escalacaoEndMessage");
const escCompletionCardEl = document.getElementById("escCompletionCard");
const escResumoPlacarRealEl = document.getElementById("escResumoPlacarReal");
const escResumoPalpiteEl = document.getElementById("escResumoPalpite");
const escResumoPalpiteStatusEl = document.getElementById("escResumoPalpiteStatus");
const escResumoAcertosEl = document.getElementById("escResumoAcertos");
const escResumoErrosEl = document.getElementById("escResumoErros");
const escResumoErrosDetalheEl = document.getElementById("escResumoErrosDetalhe");
const escNextChallengeCountdownEl = document.getElementById("escNextChallengeCountdown");
const escShareLineupBtn = document.getElementById("escShareLineupBtn");

let PARTIDAS_ESCALACAO = [];
const lineupCore = TimaodleLineupCore.createLineupCore({
    getMatches: () => PARTIDAS_ESCALACAO,
    hashString,
    embaralharComSemente
});

async function carregarPartidasEscalacao() {
    try {
        const response = await fetch('partidas.json');
        PARTIDAS_ESCALACAO = await response.json();
    } catch (error) {
        console.error("Erro ao carregar partidas.json:", error);
        PARTIDAS_ESCALACAO = [];
    }
}

function carregarEstadoEscalacao(contexto = {}) {
    const salvo = lerJsonLocalStorage(TimaodleLineupMode.STORAGE_KEY);
    const normalizado = NormalizadoresStorage.normalizeLineup(salvo, {
        matchIds: PARTIDAS_ESCALACAO.length ? PARTIDAS_ESCALACAO.map(partida => partida.id) : null,
        playerNames: jogadores.length ? jogadores.map(jogador => jogador.nome) : null,
        ...contexto
    });
    return persistirNormalizacaoSegura(TimaodleLineupMode.STORAGE_KEY, salvo, normalizado);
}

function salvarEstadoEscalacao(estado) {
    if (!estado) return;
    localStorage.setItem(TimaodleLineupMode.STORAGE_KEY, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

const lineupMode = TimaodleLineupMode.createLineupMode({
    documentApi: document,
    elements: {
        competition: escCompeticaoEl, matchup: escConfrontoEl, localTag: escLocalTagEl,
        dateStadium: escDataEstadioEl, scoreGuess: escScoreGuessEl,
        homeName: escNomeMandanteEl, awayName: escNomeVisitanteEl, awayCrest: escCrestVisitanteEl,
        homeScoreInput: escScoreMandanteInput, awayScoreInput: escScoreVisitanteInput,
        confirmScoreButton: escConfirmarPlacarBtn, scoreResult: escResultadoFinalEl,
        homeNameResult: escNomeMandante2El, awayNameResult: escNomeVisitante2El,
        awayCrestResult: escCrestVisitante2El, finalScore: escPlacarFinalEl,
        scoreGuessResult: escPalpitePlacarResultadoEl, lineupCard: escLineupCardEl,
        progress: escalacaoProgressEl, dots: escalacaoDotsEl, missing: escalacaoFaltamEl,
        pitch: pitchFieldEl, searchInput: escalacaoSearchInput,
        autocompleteList: escalacaoAutocompleteList, feedback: escalacaoFeedbackEl,
        outsideList: escalacaoForaListEl, endMessage: escalacaoEndMessageEl,
        completionCard: escCompletionCardEl, summaryRealScore: escResumoPlacarRealEl,
        summaryGuess: escResumoPalpiteEl, summaryGuessStatus: escResumoPalpiteStatusEl,
        summaryHits: escResumoAcertosEl, summaryErrors: escResumoErrosEl,
        summaryErrorDetails: escResumoErrosDetalheEl, shareButton: escShareLineupBtn
    },
    lineupCore,
    getDate: getDataLocalString,
    getPlayers: () => jogadores,
    storage: { load: carregarEstadoEscalacao, save: salvarEstadoEscalacao },
    createAutocomplete: criarAutocomplete,
    filterSuggestions: filtrarSugestoes,
    getPlayerPhoto: nome => catalogoFotos.fotoDoJogador(nome),
    buildShareText: construirTextoCompartilhamentoOnze,
    shareText: texto => compartilharTexto(texto, {
        copiarFallback: textoFallback => {
            const area = document.createElement("textarea");
            area.value = textoFallback;
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            const copiado = document.execCommand("copy");
            area.remove();
            return copiado;
        }
    }),
    onCelebrate: dispararConfetes,
    onComplete: () => abrirResultadoFinal("lineup")
});

btnPlayEscalacao.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    escalacaoView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());
    if (PARTIDAS_ESCALACAO.length === 0) tarefas.push(carregarPartidasEscalacao());

    if (tarefas.length > 0) await Promise.all(tarefas);
    lineupMode.start();
});

backHomeBtnEsc.addEventListener("click", () => {
    escalacaoView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderizarProgressoHome();
});


// ==========================================================================
// INICIALIZAÇÃO GERAL — fica no final do arquivo de propósito, depois de
// todas as variáveis (Modo Diário e Modo Foto) já declaradas.
// ==========================================================================
verificarPrimeiraVisita();
iniciarTimer();

carregarJogadores().then(() => {
    // O "jogador de ontem" usa a mesma lógica determinística do desafio
    // de hoje, só que com a data de ontem — então é sempre o mesmo valor
    // (o jogador que realmente foi a resposta), não muda a cada visita.
    if (yesterdayPlayerEl && jogadores.length > 0) {
        const hoje = new Date();
        const ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);
        const ontemStr = `${ontem.getFullYear()}-${String(ontem.getMonth() + 1).padStart(2, "0")}-${String(ontem.getDate()).padStart(2, "0")}`;
        const jogadorOntem = classicMode.getPlayerForDate(ontemStr);
        yesterdayPlayerEl.innerText = jogadorOntem.nome;
    }
});

carregarManifestoFotos();
sincronizarProgressoDiario();
