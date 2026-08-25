/* ==========================================================================
   TIMÃODLE — MODO DIÁRIO
   Um desafio por dia, igual para todo mundo, baseado na data local
   (AAAA-MM-DD) usada como semente do sorteio do jogador secreto.
   ========================================================================== */

const CHAVE_ESTADO_DIARIO = "timaodle_daily_state";
const CHAVE_STATS = "timaodle_stats";
const CHAVE_USERNAME = "timaodle_username";
const CHAVE_ESTADO_ESCALACAO = "timaodle_escalacao_daily_state";
const CHAVE_HISTORICO = "timaodle_history_v1";
const VERSAO_HISTORICO = 1;
const URL_OFICIAL_TIMAODLE = "timaodle.net";
const NormalizadoresStorage = globalThis.TimaodleStorage;
const {
    formatarDataLocal, componentesDataCivil, criarDataCivilString,
    compararDatasCivis, diasNoMesCivil, deslocamentoPrimeiraSemanaCivil,
    moverMesCivil, moverDataCivil, hashString
} = globalThis.TimaodleCore;
const {
    quantidadeSegura, criarResumoDiaVazio,
    normalizarResumoClassico, normalizarResumoFoto, normalizarResumoMaisMenos,
    normalizarResumoOnzeInicial, calcularProgressoDoResumo, obterResumoHistoricoDia,
    obterSequenciaHistoricaDoDia, numeroHistoricoValido,
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
let jogadorSecreto = null;
let jogoAtivo = true;
let selectedIndex = -1; // Índice do item selecionado no autocomplete via teclado

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
const btnOpenHistory = document.getElementById("btnOpenHistory");
const historyModal = document.getElementById("historyModal");
const btnCloseHistory = document.getElementById("btnCloseHistory");
const historyPreviousMonth = document.getElementById("historyPreviousMonth");
const historyNextMonth = document.getElementById("historyNextMonth");
const historyMonthTitle = document.getElementById("historyMonthTitle");
const historyCalendarGrid = document.getElementById("historyCalendarGrid");
const historyDaySummary = document.getElementById("historyDaySummary");
const historySummaryEmpty = document.getElementById("historySummaryEmpty");
const historyNoRecord = document.getElementById("historyNoRecord");
const historyDayDetails = document.getElementById("historyDayDetails");
const historySelectedDateTitle = document.getElementById("historySelectedDateTitle");
const historyClassicSummary = document.getElementById("historyClassicSummary");
const historyPhotoSummary = document.getElementById("historyPhotoSummary");
const historyMoreLessSummary = document.getElementById("historyMoreLessSummary");
const historyLineupSummary = document.getElementById("historyLineupSummary");
const historyLineupExactScore = document.getElementById("historyLineupExactScore");
const historyOverallProgress = document.getElementById("historyOverallProgress");
const historyHistoricalStreak = document.getElementById("historyHistoricalStreak");
const historyHistoricalStreakText = document.getElementById("historyHistoricalStreakText");
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

function dataHistoricoValida(data) {
    return NormalizadoresStorage.validDate(data);
}

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

function dataNavegavelHistorico(data, historico, hoje = getDataLocalString()) {
    if (!dataHistoricoValida(data) || !dataHistoricoValida(hoje)) return false;
    const inicio = dataHistoricoValida(historico?.trackingStartedAt) ? historico.trackingStartedAt : hoje;
    return compararDatasCivis(data, inicio) >= 0 && compararDatasCivis(data, hoje) <= 0;
}

function limitarDataNavegavelHistorico(data, historico, hoje = getDataLocalString()) {
    if (!dataHistoricoValida(data) || !dataHistoricoValida(hoje)) return null;
    const inicio = dataHistoricoValida(historico?.trackingStartedAt) ? historico.trackingStartedAt : hoje;
    if (compararDatasCivis(inicio, hoje) > 0) return null;
    if (compararDatasCivis(data, inicio) < 0) return inicio;
    if (compararDatasCivis(data, hoje) > 0) return hoje;
    return data;
}

function obterDataFocoSemanaHistorico(data, limiteFinal, historico, hoje = getDataLocalString()) {
    const civil = componentesDataCivil(data);
    if (!civil || (limiteFinal !== "inicio" && limiteFinal !== "fim")) return null;
    const diaSemana = new Date(Date.UTC(civil.year, civil.month - 1, civil.day)).getUTCDay();
    const deslocamentoSegunda = (diaSemana + 6) % 7;
    const deslocamento = limiteFinal === "inicio" ? -deslocamentoSegunda : 6 - deslocamentoSegunda;
    return limitarDataNavegavelHistorico(moverDataCivil(data, deslocamento), historico, hoje);
}

function obterDataFocoMesHistorico(data, direcao, historico, hoje = getDataLocalString()) {
    const civil = componentesDataCivil(data);
    if (!civil || (direcao !== -1 && direcao !== 1)) return null;
    const destino = moverMesCivil(civil.year, civil.month, direcao);
    const limites = obterLimitesMesesHistorico(historico, hoje);
    if (compararMesesCivis(destino, limites.firstMonth) < 0
        || compararMesesCivis(destino, limites.currentMonth) > 0) return data;
    const dia = Math.min(civil.day, diasNoMesCivil(destino.year, destino.month));
    return limitarDataNavegavelHistorico(
        criarDataCivilString(destino.year, destino.month, dia), historico, hoje
    ) || data;
}

function resolverNavegacaoTecladoHistorico(tecla, dataFoco, dataSelecionada, historico, hoje = getDataLocalString()) {
    if (!dataNavegavelHistorico(dataFoco, historico, hoje)) return { handled: false };
    if (tecla === "Enter" || tecla === " " || tecla === "Spacebar") {
        return { handled: true, focusDate: dataFoco, selectedDate: dataFoco, selectionChanged: dataSelecionada !== dataFoco };
    }

    const deslocamentos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let proximoFoco = dataFoco;
    if (Object.prototype.hasOwnProperty.call(deslocamentos, tecla)) {
        const candidato = moverDataCivil(dataFoco, deslocamentos[tecla]);
        proximoFoco = dataNavegavelHistorico(candidato, historico, hoje) ? candidato : dataFoco;
    } else if (tecla === "Home" || tecla === "End") {
        proximoFoco = obterDataFocoSemanaHistorico(
            dataFoco, tecla === "Home" ? "inicio" : "fim", historico, hoje
        ) || dataFoco;
    } else if (tecla === "PageUp" || tecla === "PageDown") {
        proximoFoco = obterDataFocoMesHistorico(
            dataFoco, tecla === "PageUp" ? -1 : 1, historico, hoje
        ) || dataFoco;
    } else {
        return { handled: false };
    }

    return { handled: true, focusDate: proximoFoco, selectedDate: dataSelecionada, selectionChanged: false };
}

function compararMesesCivis(mesA, mesB) {
    if (!mesA || !mesB || !Number.isInteger(mesA.year) || !Number.isInteger(mesA.month)
        || !Number.isInteger(mesB.year) || !Number.isInteger(mesB.month)) return null;
    const indiceA = mesA.year * 12 + mesA.month - 1;
    const indiceB = mesB.year * 12 + mesB.month - 1;
    return indiceA === indiceB ? 0 : indiceA < indiceB ? -1 : 1;
}

function obterLimitesMesesHistorico(historico, hoje = getDataLocalString()) {
    const hojeCivil = componentesDataCivil(hoje) || componentesDataCivil(getDataLocalString());
    const tracking = dataHistoricoValida(historico?.trackingStartedAt)
        ? componentesDataCivil(historico.trackingStartedAt)
        : hojeCivil;
    const currentMonth = { year: hojeCivil.year, month: hojeCivil.month };
    const trackingMonth = { year: tracking.year, month: tracking.month };
    const firstMonth = compararMesesCivis(trackingMonth, currentMonth) > 0
        ? currentMonth
        : trackingMonth;
    return { firstMonth, currentMonth };
}

function limitarMesAoHistorico(year, month, historico, hoje = getDataLocalString()) {
    const solicitado = moverMesCivil(year, month, 0);
    const limites = obterLimitesMesesHistorico(historico, hoje);
    if (!solicitado || compararMesesCivis(solicitado, limites.firstMonth) < 0) return { ...limites.firstMonth };
    if (compararMesesCivis(solicitado, limites.currentMonth) > 0) return { ...limites.currentMonth };
    return solicitado;
}

function obterNavegacaoMesHistorico(year, month, historico, hoje = getDataLocalString()) {
    const displayedMonth = limitarMesAoHistorico(year, month, historico, hoje);
    const { firstMonth, currentMonth } = obterLimitesMesesHistorico(historico, hoje);
    const canGoPrevious = compararMesesCivis(displayedMonth, firstMonth) > 0;
    const canGoNext = compararMesesCivis(displayedMonth, currentMonth) < 0;
    return {
        displayedMonth,
        firstMonth,
        currentMonth,
        canGoPrevious,
        canGoNext,
        previousMonth: canGoPrevious ? moverMesCivil(displayedMonth.year, displayedMonth.month, -1) : null,
        nextMonth: canGoNext ? moverMesCivil(displayedMonth.year, displayedMonth.month, 1) : null
    };
}

function obterEstadoDiaHistorico(data, historico, hoje = getDataLocalString()) {
    const isToday = data === hoje;
    const isFuture = compararDatasCivis(data, hoje) === 1;
    const trackingStartedAt = dataHistoricoValida(historico?.trackingStartedAt)
        ? historico.trackingStartedAt
        : hoje;
    const isBeforeTracking = compararDatasCivis(data, trackingStartedAt) === -1;
    const hasRecord = Object.prototype.hasOwnProperty.call(historico?.days || {}, data);
    const registro = hasRecord && historico.days[data] && typeof historico.days[data] === "object"
        ? historico.days[data]
        : criarResumoDiaVazio();
    const progresso = calcularProgressoDoResumo(registro);
    let state = "no-record";
    if (isFuture) state = "future";
    else if (isBeforeTracking) state = "before-tracking";
    else if (hasRecord && progresso.complete) state = "complete";
    else if (hasRecord && progresso.completed > 0) state = "partial";
    else if (hasRecord && progresso.started > 0) state = "started";
    else if (hasRecord) state = "recorded";

    return {
        date: data,
        day: componentesDataCivil(data)?.day || null,
        isToday,
        isFuture,
        isBeforeTracking,
        hasRecord,
        startedCount: progresso.started,
        completedCount: progresso.completed,
        complete: progresso.complete,
        state
    };
}



function gerarGradeMensalHistorico(year, month, historico, hoje = getDataLocalString()) {
    const navigation = obterNavegacaoMesHistorico(year, month, historico, hoje);
    const displayedMonth = navigation.displayedMonth;
    const totalDays = diasNoMesCivil(displayedMonth.year, displayedMonth.month);
    const days = Array.from({ length: totalDays }, (_, index) => {
        const date = criarDataCivilString(displayedMonth.year, displayedMonth.month, index + 1);
        return obterEstadoDiaHistorico(date, historico, hoje);
    });
    return {
        year: displayedMonth.year,
        month: displayedMonth.month,
        daysInMonth: totalDays,
        firstWeekOffset: deslocamentoPrimeiraSemanaCivil(displayedMonth.year, displayedMonth.month),
        days,
        navigation
    };
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

const MESES_HISTORICO = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];
const CLASSES_ESTADO_HISTORICO = [
    "is-future", "is-before-tracking", "is-no-record", "is-recorded",
    "is-started", "is-partial", "is-complete"
];
const estadoHistoricoUI = {
    year: null,
    month: null,
    selectedDate: null,
    focusedDate: null,
    history: null,
    today: null
};

function obterDataFocoInicialHistorico(grade, dataSelecionada, hoje) {
    const navegaveis = grade?.days?.filter(dia => !dia.isFuture && !dia.isBeforeTracking) || [];
    if (navegaveis.length === 0) return null;
    const datasNavegaveis = new Set(navegaveis.map(dia => dia.date));
    if (datasNavegaveis.has(dataSelecionada)) return dataSelecionada;
    if (datasNavegaveis.has(hoje)) return hoje;
    return navegaveis.filter(dia => dia.hasRecord).at(-1)?.date || navegaveis[0].date;
}

function obterTabIndexDiaHistorico(dia, dataFoco) {
    return dia && !dia.isFuture && !dia.isBeforeTracking && dia.date === dataFoco ? 0 : -1;
}

function formatarDataHistorico(data, incluirAno = true) {
    const civil = componentesDataCivil(data);
    if (!civil) return "";
    const texto = `${civil.day} DE ${MESES_HISTORICO[civil.month - 1]}`;
    return incluirAno ? `${texto} DE ${civil.year}` : texto;
}

function rotuloAcessivelDiaHistorico(dia) {
    const partes = [formatarDataHistorico(dia.date).toLocaleLowerCase("pt-BR")];
    if (dia.isToday) partes.push("hoje");
    if (dia.isFuture) partes.push("data futura");
    else if (dia.isBeforeTracking) partes.push("histórico indisponível para esta data");
    else if (!dia.hasRecord) partes.push("sem registro disponível");
    else if (dia.complete) partes.push("4 de 4 desafios concluídos");
    else if (dia.completedCount > 0) partes.push(`${dia.completedCount} de 4 desafios concluídos`);
    else if (dia.startedCount > 0) partes.push("desafio iniciado, nenhum de 4 concluído");
    else partes.push("registro sem progresso concluído");
    return partes.join(", ");
}

function textoIndicadorDiaHistorico(dia) {
    if (dia.complete) return "✓ 4/4";
    if (dia.completedCount > 0) return `${dia.completedCount}/4`;
    if (dia.state === "started") return "• 0/4";
    if (dia.state === "recorded") return "0/4";
    return "";
}

function renderizarResumoDiaHistorico(dia) {
    if (!historyDaySummary) return;
    if (!dia) {
        historySummaryEmpty?.classList.remove("hidden");
        historySelectedDateTitle?.classList.add("hidden");
        historyNoRecord?.classList.add("hidden");
        historyDayDetails?.classList.add("hidden");
        historyHistoricalStreak?.classList.add("hidden");
        return;
    }
    const resumo = obterResumoHistoricoDia(dia.date, estadoHistoricoUI.history);
    historySummaryEmpty?.classList.add("hidden");
    if (historySelectedDateTitle) {
        historySelectedDateTitle.textContent = formatarDataHistorico(dia.date);
        historySelectedDateTitle.classList.remove("hidden");
    }

    if (!resumo.hasRecord) {
        historyNoRecord?.classList.remove("hidden");
        historyDayDetails?.classList.add("hidden");
        historyHistoricalStreak?.classList.add("hidden");
        return;
    }

    historyNoRecord?.classList.add("hidden");
    historyDayDetails?.classList.remove("hidden");
    if (historyClassicSummary) historyClassicSummary.textContent = resumo.classic.statusText;
    if (historyPhotoSummary) historyPhotoSummary.textContent = resumo.photo.statusText;
    if (historyMoreLessSummary) historyMoreLessSummary.textContent = resumo.moreLess.statusText;
    if (historyLineupSummary) historyLineupSummary.textContent = resumo.lineup.statusText;
    historyLineupExactScore?.classList.toggle("hidden", !resumo.lineup.exactScore);

    const estados = {
        classic: resumo.classic,
        photo: resumo.photo,
        moreLess: resumo.moreLess,
        lineup: resumo.lineup
    };
    Object.entries(estados).forEach(([modo, estado]) => {
        const linha = historyDayDetails?.querySelector(`[data-history-mode="${modo}"]`);
        if (!linha) return;
        linha.classList.remove("is-not-started", "is-in-progress", "is-completed", "is-won", "is-lost");
        linha.classList.add(!estado.started ? "is-not-started" : estado.completed ? "is-completed" : "is-in-progress");
        if (estado.outcome === "won") linha.classList.add("is-won");
        if (estado.outcome === "lost") linha.classList.add("is-lost");
    });

    if (historyOverallProgress) {
        historyOverallProgress.textContent = `${resumo.completedCount}/4 DESAFIOS`;
        historyOverallProgress.classList.toggle("is-complete", resumo.complete);
    }
    const sequencia = resumo.complete
        ? obterSequenciaHistoricaDoDia(dia.date, estadoHistoricoUI.history, estadoHistoricoUI.today)
        : null;
    const mostrarSequencia = sequencia?.belongs === true;
    historyHistoricalStreak?.classList.toggle("hidden", !mostrarSequencia);
    if (mostrarSequencia && historyHistoricalStreakText) {
        const dias = sequencia.throughSelectedDate;
        historyHistoricalStreakText.textContent = `Sequência até este dia: ${dias} ${dias === 1 ? "dia" : "dias"}`;
    }
}

function selecionarDiaHistorico(data, devolverFoco = false) {
    const grade = gerarGradeMensalHistorico(
        estadoHistoricoUI.year,
        estadoHistoricoUI.month,
        estadoHistoricoUI.history,
        estadoHistoricoUI.today
    );
    const dia = grade.days.find(item => item.date === data && !item.isFuture && !item.isBeforeTracking);
    if (!dia) return;
    estadoHistoricoUI.selectedDate = data;
    estadoHistoricoUI.focusedDate = data;
    renderizarCalendarioHistorico();
    if (devolverFoco) historyCalendarGrid?.querySelector(`[data-history-date="${data}"]`)?.focus();
}

function renderizarCalendarioHistorico(atualizarResumo = true) {
    if (!historyCalendarGrid || !estadoHistoricoUI.history || !estadoHistoricoUI.today) return;
    const grade = gerarGradeMensalHistorico(
        estadoHistoricoUI.year,
        estadoHistoricoUI.month,
        estadoHistoricoUI.history,
        estadoHistoricoUI.today
    );
    estadoHistoricoUI.year = grade.year;
    estadoHistoricoUI.month = grade.month;
    const focoExisteNaGrade = grade.days.some(dia => dia.date === estadoHistoricoUI.focusedDate
        && !dia.isFuture && !dia.isBeforeTracking);
    if (!focoExisteNaGrade) {
        estadoHistoricoUI.focusedDate = obterDataFocoInicialHistorico(
            grade, estadoHistoricoUI.selectedDate, estadoHistoricoUI.today
        );
    }
    if (historyMonthTitle) historyMonthTitle.textContent = `${MESES_HISTORICO[grade.month - 1]} ${grade.year}`;
    if (historyPreviousMonth) historyPreviousMonth.disabled = !grade.navigation.canGoPrevious;
    if (historyNextMonth) historyNextMonth.disabled = !grade.navigation.canGoNext;

    historyCalendarGrid.replaceChildren();
    for (let index = 0; index < grade.firstWeekOffset; index++) {
        const vazio = document.createElement("span");
        vazio.className = "history-calendar-empty";
        vazio.setAttribute("aria-hidden", "true");
        historyCalendarGrid.appendChild(vazio);
    }

    grade.days.forEach(dia => {
        const selecionado = dia.date === estadoHistoricoUI.selectedDate;
        const classeEstado = `is-${dia.state}`;
        const celula = document.createElement("div");
        celula.className = `history-day-cell ${CLASSES_ESTADO_HISTORICO.includes(classeEstado) ? classeEstado : "is-no-record"}${dia.isToday ? " is-today" : ""}${selecionado ? " is-selected" : ""}`;
        celula.setAttribute("role", "gridcell");
        celula.setAttribute("aria-selected", String(selecionado));

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "history-day-button";
        botao.dataset.historyDate = dia.date;
        botao.disabled = dia.isFuture || dia.isBeforeTracking;
        botao.tabIndex = obterTabIndexDiaHistorico(dia, estadoHistoricoUI.focusedDate);
        botao.setAttribute("aria-label", rotuloAcessivelDiaHistorico(dia));
        botao.setAttribute("aria-pressed", String(selecionado));
        if (dia.isToday) botao.setAttribute("aria-current", "date");

        const numero = document.createElement("span");
        numero.className = "history-day-number";
        numero.textContent = String(dia.day);
        botao.appendChild(numero);

        if (dia.isToday) {
            const hoje = document.createElement("span");
            hoje.className = "history-today-marker";
            hoje.textContent = "HOJE";
            botao.appendChild(hoje);
        }

        const indicador = textoIndicadorDiaHistorico(dia);
        if (indicador) {
            const progresso = document.createElement("span");
            progresso.className = "history-day-progress";
            progresso.textContent = indicador;
            botao.appendChild(progresso);
        }

        if (!botao.disabled) botao.addEventListener("click", () => selecionarDiaHistorico(dia.date, true));
        celula.appendChild(botao);
        historyCalendarGrid.appendChild(celula);
    });

    if (atualizarResumo) {
        const selecionado = estadoHistoricoUI.selectedDate
            ? obterEstadoDiaHistorico(estadoHistoricoUI.selectedDate, estadoHistoricoUI.history, estadoHistoricoUI.today)
            : null;
        renderizarResumoDiaHistorico(selecionado);
    }
}

function atualizarFocoRovingHistorico(data) {
    if (!historyCalendarGrid || !dataNavegavelHistorico(data, estadoHistoricoUI.history, estadoHistoricoUI.today)) return;
    const alvo = historyCalendarGrid.querySelector(`[data-history-date="${data}"]`);
    if (!alvo || alvo.disabled) return;
    historyCalendarGrid.querySelectorAll(".history-day-button").forEach(botao => {
        botao.tabIndex = botao === alvo ? 0 : -1;
    });
    estadoHistoricoUI.focusedDate = data;
    alvo.focus();
}

function navegarCalendarioHistoricoPorTeclado(event) {
    const botao = event.target.closest?.(".history-day-button");
    if (!botao || botao.disabled || !historyCalendarGrid?.contains(botao)) return;
    const resultado = resolverNavegacaoTecladoHistorico(
        event.key,
        botao.dataset.historyDate,
        estadoHistoricoUI.selectedDate,
        estadoHistoricoUI.history,
        estadoHistoricoUI.today
    );
    if (!resultado.handled) return;
    event.preventDefault();

    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        selecionarDiaHistorico(resultado.focusDate, true);
        return;
    }

    const civil = componentesDataCivil(resultado.focusDate);
    if (!civil) return;
    if (civil.year === estadoHistoricoUI.year && civil.month === estadoHistoricoUI.month) {
        atualizarFocoRovingHistorico(resultado.focusDate);
        return;
    }
    estadoHistoricoUI.year = civil.year;
    estadoHistoricoUI.month = civil.month;
    estadoHistoricoUI.focusedDate = resultado.focusDate;
    renderizarCalendarioHistorico(false);
    historyCalendarGrid.querySelector(`[data-history-date="${resultado.focusDate}"]`)?.focus();
}

function navegarMesHistorico(direcao) {
    if (direcao !== -1 && direcao !== 1) return;
    const gradeAtual = gerarGradeMensalHistorico(
        estadoHistoricoUI.year,
        estadoHistoricoUI.month,
        estadoHistoricoUI.history,
        estadoHistoricoUI.today
    );
    const destino = direcao < 0 ? gradeAtual.navigation.previousMonth : gradeAtual.navigation.nextMonth;
    if (!destino) return;
    estadoHistoricoUI.year = destino.year;
    estadoHistoricoUI.month = destino.month;
    const novaGrade = gerarGradeMensalHistorico(
        destino.year,
        destino.month,
        estadoHistoricoUI.history,
        estadoHistoricoUI.today
    );
    estadoHistoricoUI.selectedDate = novaGrade.days
        .filter(dia => dia.hasRecord && !dia.isFuture && !dia.isBeforeTracking)
        .at(-1)?.date || null;
    estadoHistoricoUI.focusedDate = null;
    renderizarCalendarioHistorico();
}

function abrirHistorico() {
    const today = getDataLocalString();
    const civil = componentesDataCivil(today);
    if (!civil) return;
    estadoHistoricoUI.history = carregarHistorico();
    estadoHistoricoUI.today = today;
    estadoHistoricoUI.year = civil.year;
    estadoHistoricoUI.month = civil.month;
    estadoHistoricoUI.selectedDate = today;
    estadoHistoricoUI.focusedDate = today;
    renderizarCalendarioHistorico();
    abrirModalAcessivel(historyModal, btnOpenHistory, btnCloseHistory);
}

function fecharHistorico() {
    fecharModalAcessivel(historyModal, btnOpenHistory);
}

const focoAnteriorPorModal = new WeakMap();

function elementosFocaveisDoModal(modal) {
    if (!modal) return [];
    return Array.from(modal.querySelectorAll(
        'button:not([disabled]):not([tabindex="-1"]), summary:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
    )).filter(elemento => elemento.getClientRects().length > 0);
}

function abrirModalAcessivel(modal, origem, focoInicial) {
    if (!modal) return;
    focoAnteriorPorModal.set(modal, origem || document.activeElement);
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    (focoInicial || elementosFocaveisDoModal(modal)[0] || modal).focus();
}

function fecharModalAcessivel(modal, focoAlternativo) {
    if (!modal) return;
    modal.classList.add("hidden");
    if (!document.querySelector(".modal:not(.hidden)")) document.body.classList.remove("modal-open");
    const origem = focoAnteriorPorModal.get(modal) || focoAlternativo;
    focoAnteriorPorModal.delete(modal);
    if (origem && !origem.closest?.(".hidden")) origem.focus();
    else focoAlternativo?.focus();
}

function prenderFocoNoModal(event, modal) {
    if (event.key !== "Tab" || !modal || modal.classList.contains("hidden")) return;
    const focaveis = elementosFocaveisDoModal(modal);
    if (focaveis.length === 0) {
        event.preventDefault();
        modal.focus();
        return;
    }
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
    }
}

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
        const tentativas = estadoDiario?.tentativas?.length || 0;
        return { outcome: "won", title: "GANHOU", metric: pluralResultado(tentativas, "TENTATIVA", "TENTATIVAS") };
    }
    if (tipo === "photo") {
        const tentativas = estadoFotoDiario?.tentativas?.length || 0;
        const venceu = estadoFotoDiario?.status === "won";
        return { outcome: venceu ? "won" : "lost", title: venceu ? "GANHOU" : "PERDEU", metric: `${tentativas} / ${MAX_TENTATIVAS_FOTO} TENTATIVAS` };
    }
    if (tipo === "moreLess") {
        const venceu = estadoMMDiario?.status === "won";
        return { outcome: venceu ? "won" : "lost", title: venceu ? "GANHOU" : "PERDEU", metric: `${acertosMM} / ${RODADAS_MM} ACERTOS` };
    }
    const total = dadosEscalacao?.jogadores_ocultos?.length || 3;
    const erros = Number.isFinite(errosEscalacao) ? errosEscalacao : 0;
    return {
        outcome: "completed",
        title: "CONCLUÍDO",
        metric: `${total} / ${total} JOGADORES`,
        secondary: `${pluralResultado(erros, "ERRO", "ERROS")}${estadoEscalacao?.exactScore === true ? " · PLACAR EXATO" : ""}`
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
    cancelarAvancoAutomaticoMM();
    ocultarViewsDeJogo();
    homeView.classList.remove("hidden");
    renderizarProgressoHome();
    const progresso = obterProgressoDiario();
    (progresso.complete ? shareDailyResultBtn : btnPlayDiario)?.focus({ preventScroll: true });
}

btnOpenIntegratedStats?.addEventListener("click", abrirEstatisticasIntegradas);
btnCloseIntegratedStats?.addEventListener("click", fecharEstatisticasIntegradas);
btnOpenHistory?.addEventListener("click", abrirHistorico);
btnCloseHistory?.addEventListener("click", fecharHistorico);
historyPreviousMonth?.addEventListener("click", () => navegarMesHistorico(-1));
historyNextMonth?.addEventListener("click", () => navegarMesHistorico(1));
historyCalendarGrid?.addEventListener("keydown", navegarCalendarioHistoricoPorTeclado);
btnOpenHowToPlay?.addEventListener("click", abrirComoJogar);
btnCloseHowToPlay?.addEventListener("click", fecharComoJogar);
integratedStatsModal?.addEventListener("click", event => {
    if (event.target === integratedStatsModal) fecharEstatisticasIntegradas();
});
historyModal?.addEventListener("click", event => {
    if (event.target === historyModal) fecharHistorico();
});
howToPlayModal?.addEventListener("click", event => {
    if (event.target === howToPlayModal) fecharComoJogar();
});
finalResultCloseBtn?.addEventListener("click", fecharResultadoFinal);
finalResultHomeBtn?.addEventListener("click", voltarParaHomeDoResultado);
finalResultShareBtn?.addEventListener("click", () => {
    if (finalResultModeType === "classic") compartilharResultado();
    else if (finalResultModeType === "photo") compartilharResultadoFoto();
    else if (finalResultModeType === "moreLess") compartilharResultadoMM();
    else if (finalResultModeType === "lineup") compartilharResultadoEscalacao();
});
finalResultModal?.addEventListener("click", event => {
    if (event.target === finalResultModal) fecharResultadoFinal();
});
document.addEventListener("keydown", event => {
    const modalTutorialFoto = document.getElementById("photoTutorialModal");
    const modalAtivo = [finalResultModal, howToPlayModal, integratedStatsModal, historyModal, modalTutorialFoto]
        .find(modal => modal && !modal.classList.contains("hidden"));
    if (!modalAtivo) return;
    if (event.key === "Escape") {
        if (modalAtivo === finalResultModal) fecharResultadoFinal();
        else if (modalAtivo === howToPlayModal) fecharComoJogar();
        else if (modalAtivo === integratedStatsModal) fecharEstatisticasIntegradas();
        else if (modalAtivo === historyModal) fecharHistorico();
        else fecharTutorialFoto();
        return;
    }
    prenderFocoNoModal(event, modalAtivo);
});

// Escolhe o jogador secreto do dia com base na data — determinístico:
// a mesma data sempre resulta no mesmo jogador, para todo mundo.
function sortearJogadorDoDia(dataStr) {
    const hash = hashString(dataStr);
    const index = hash % jogadores.length;
    return jogadores[index];
}

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
    if (photoAttemptsLabelEl && estadoFotoDiario && estadoFotoDiario.status !== "playing") {
        photoAttemptsLabelEl.innerText = `Próximo em ${texto}`;
    }

    if (typeof mmRoundLabelEl !== "undefined" && mmRoundLabelEl && estadoMMDiario && estadoMMDiario.status !== "playing") {
        mmRoundLabelEl.innerText = `Próximo em ${texto}`;
    }
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
        secretName: jogadorSecreto?.nome || null
    });
    return persistirNormalizacaoSegura(CHAVE_ESTADO_DIARIO, salvo, normalizado);
}

function salvarEstadoDiario(estado) {
    localStorage.setItem(CHAVE_ESTADO_DIARIO, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

// Estado atual do desafio de hoje, mantido em memória e sincronizado
// com o localStorage a cada tentativa.
let estadoDiario = null;

// ==========================================================================
// NAVEGAÇÃO — TELA INICIAL ⇄ MODO DIÁRIO
// (estrutura pronta para receber outros modos no futuro)
// ==========================================================================

btnPlayDiario.addEventListener("click", () => {
    homeView.classList.add("hidden");
    gameView.classList.remove("hidden");
    if (jogadores.length === 0) {
        carregarJogadores().then(() => iniciarDesafioDiario());
    } else {
        iniciarDesafioDiario();
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

function iniciarDesafioDiario() {
    if (jogadores.length === 0) return;

    const hoje = getDataLocalString();
    jogadorSecreto = sortearJogadorDoDia(hoje);

    const salvo = carregarEstadoDiario();

    if (salvo?.data) sincronizarProgressoDiario();

    if (salvo && salvo.data === hoje) {
        // Mesmo dia — restaura tentativas e status salvos
        estadoDiario = salvo;
        attemptsContainer.innerHTML = "";
        (estadoDiario.tentativas || []).forEach(nomeTentativa => {
            const jogadorTentativa = jogadores.find(j => j.nome === nomeTentativa);
            if (jogadorTentativa) renderizarTentativa(jogadorTentativa, { instantaneo: true });
        });
        if (pageContentEl) pageContentEl.scrollTop = 0;
        jogoAtivo = estadoDiario.status === "playing";
        if (estadoDiario.status === "won") {
            mostrarFimDeJogo(false);
        }
    } else {
        // Novo dia — reseta o desafio
        estadoDiario = { data: hoje, tentativas: [], status: "playing" };
        salvarEstadoDiario(estadoDiario);
        attemptsContainer.innerHTML = "";
        jogoAtivo = true;
        dailyEndMessageEl.classList.add("hidden");
        shareResultBtn.classList.add("hidden");
        searchInput.disabled = false;
    }

    searchInput.value = "";
    fecharAutocomplete();
}

// ==========================================================================
// AUTOCOMPLETE
// ==========================================================================

function prepararOpcaoAutocomplete(item, prefixo, indice) {
    item.id = `${prefixo}-option-${indice}`;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", "false");
}

function sincronizarAriaAutocomplete(input, items, indiceAtivo) {
    const opcoes = Array.from(items);
    input.setAttribute("aria-expanded", opcoes.length > 0 ? "true" : "false");

    let idAtivo = "";
    opcoes.forEach((item, indice) => {
        const ativo = indice === indiceAtivo;
        item.classList.toggle("autocomplete-active", ativo);
        item.setAttribute("aria-selected", ativo ? "true" : "false");
        if (ativo) idAtivo = item.id;
    });

    if (idAtivo) input.setAttribute("aria-activedescendant", idAtivo);
    else input.removeAttribute("aria-activedescendant");
}

function fecharAutocomplete() {
    autocompleteList.innerHTML = "";
    selectedIndex = -1;
    sincronizarAriaAutocomplete(searchInput, [], selectedIndex);
}

function atualizarDestaqueAutocomplete(items) {
    sincronizarAriaAutocomplete(searchInput, items, selectedIndex);
    if (selectedIndex >= 0) items[selectedIndex].scrollIntoView({ block: "nearest" });
}

// Evento de Digitação (Filtro do Autocomplete)
searchInput.addEventListener("input", function () {
    if (!jogoAtivo) return;
    const value = normalizarBusca(this.value.trim());
    fecharAutocomplete();

    if (!value) return;

    const filtrados = jogadores.filter(j =>
        normalizarBusca(j.nome).includes(value) &&
        !(estadoDiario?.tentativas || []).includes(j.nome)
    );

    filtrados.forEach((j, indice) => {
        const item = document.createElement("div");
        prepararOpcaoAutocomplete(item, "classic", indice);
        item.innerText = j.nome;
        item.dataset.nome = j.nome;

        item.addEventListener("click", function () {
            fazerPalpite(j);
            searchInput.value = "";
            fecharAutocomplete();
        });

        autocompleteList.appendChild(item);
    });
    sincronizarAriaAutocomplete(searchInput, autocompleteList.children, selectedIndex);
});

// Navegação via Teclado (Setas Cima/Baixo e Enter)
searchInput.addEventListener("keydown", function (e) {
    if (!jogoAtivo) return;

    const items = autocompleteList.getElementsByTagName("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex++;
        if (selectedIndex >= items.length) selectedIndex = 0;
        atualizarDestaqueAutocomplete(items);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex--;
        if (selectedIndex < 0) selectedIndex = items.length - 1;
        atualizarDestaqueAutocomplete(items);
    } else if (e.key === "Enter") {
        e.preventDefault();

        // Se navegou com as setas, escolhe o item selecionado; senão, escolhe a 1ª opção
        if (selectedIndex < 0) return;
        const nomeSelecionado = items[selectedIndex].dataset.nome;
        const jogadorObjeto = jogadores.find(j => j.nome === nomeSelecionado);

        if (jogadorObjeto) {
            fazerPalpite(jogadorObjeto);
            searchInput.value = "";
            fecharAutocomplete();
        }
    } else if (e.key === "Escape") {
        fecharAutocomplete();
    }
});

document.addEventListener("click", function (e) {
    if (e.target !== searchInput) {
        fecharAutocomplete();
    }
});

// ==========================================================================
// COMPARAÇÃO DE ATRIBUTOS
// ==========================================================================

function atributoAusente(valor) {
    return valor === null
        || valor === undefined
        || (typeof valor === "string" && valor.trim() === "");
}

function formatarAtributoClassico(valor) {
    return atributoAusente(valor) ? "—" : String(valor);
}

function compararTexto(palpite, correto) {
    const palpiteAusente = atributoAusente(palpite);
    const corretoAusente = atributoAusente(correto);
    const classe = (palpiteAusente && corretoAusente) || palpite === correto ? "correct" : "wrong";
    return { classe, texto: formatarAtributoClassico(palpite) };
}

function compararNumero(palpite, correto) {
    const palpiteAusente = atributoAusente(palpite);
    const corretoAusente = atributoAusente(correto);
    if (palpiteAusente || corretoAusente) {
        return {
            classe: palpiteAusente && corretoAusente ? "correct" : "wrong",
            texto: formatarAtributoClassico(palpite)
        };
    }

    if (palpite === correto) {
        return { classe: "correct", texto: formatarAtributoClassico(palpite) };
    } else if (palpite < correto) {
        return { classe: "wrong", texto: `${palpite} ↑` };
    } else {
        return { classe: "wrong", texto: `${palpite} ↓` };
    }
}

function extrairNomesTitulos(textoTitulos) {
    if (!textoTitulos) return [];
    return textoTitulos
        .split(',')
        .map(item => item.replace(/\d+x\s*/gi, '').trim().toLowerCase())
        .filter(item => item.length > 0);
}

function compararTitulos(palpiteTitulos, corretoTitulos) {
    const palpiteAusente = atributoAusente(palpiteTitulos);
    const corretoAusente = atributoAusente(corretoTitulos);
    if (palpiteAusente || corretoAusente) {
        return {
            classe: palpiteAusente && corretoAusente ? "correct" : "wrong",
            texto: formatarAtributoClassico(palpiteTitulos)
        };
    }

    if (palpiteTitulos === corretoTitulos) {
        return { classe: "correct", texto: formatarAtributoClassico(palpiteTitulos) };
    }

    const nomesPalpite = extrairNomesTitulos(palpiteTitulos);
    const nomesCorreto = extrairNomesTitulos(corretoTitulos);

    const temCoincidencia = nomesPalpite.some(titulo => nomesCorreto.includes(titulo));
    if (temCoincidencia) return { classe: "partial", texto: formatarAtributoClassico(palpiteTitulos) };

    return { classe: "wrong", texto: formatarAtributoClassico(palpiteTitulos) };
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

// Recria o grid de emojis a partir dos nomes já tentados hoje, sem
// depender de nada além do que já está salvo no estado diário.
function gerarGridEmojis() {
    const emojiPorClasse = { correct: "🟩", partial: "🟨", wrong: "🟥" };

    return estadoDiario.tentativas.map(nomeTentativa => {
        const palpite = jogadores.find(j => j.nome === nomeTentativa);
        if (!palpite) return "";

        const colunas = [
            { classe: palpite.nome === jogadorSecreto.nome ? "correct" : "wrong" },
            compararTexto(palpite.posicao, jogadorSecreto.posicao),
            compararTexto(palpite.nacionalidade, jogadorSecreto.nacionalidade),
            compararNumero(palpite.estreia, jogadorSecreto.estreia),
            compararTexto(palpite.pe, jogadorSecreto.pe),
            compararTitulos(palpite.titulos, jogadorSecreto.titulos),
            compararNumero(palpite.gols, jogadorSecreto.gols),
            compararNumero(palpite.assistencias, jogadorSecreto.assistencias),
        ];

        return colunas.map(c => emojiPorClasse[c.classe]).join("");
    }).join("\n");
}

function gerarTextoCompartilhamento() {
    const hoje = getDataLocalString();
    const numero = numeroDoDesafio(hoje);
    const tentativas = estadoDiario.tentativas.length;
    const grid = gerarGridEmojis();

    return construirTextoCompartilhamentoClassico({ numero, tentativas, grid, url: URL_OFICIAL_TIMAODLE });
}

async function compartilharResultado() {
    const texto = gerarTextoCompartilhamento();
    const resultado = await compartilharTexto(texto, { copiarAoCancelar: true });
    if (resultado.status === "shared") return;
    if (resultado.status === "copied") {
        const textoOriginal = shareResultBtn.innerText;
        shareResultBtn.innerText = "Copiado! ✓";
        setTimeout(() => { shareResultBtn.innerText = textoOriginal; }, 2000);
        return;
    }
    alert(texto); // Último recurso — mostra o texto pra copiar manualmente
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

function gerarTextoCompartilhamentoFoto() {
    const numero = numeroDoDesafio(getDataLocalString());
    const tentativas = estadoFotoDiario?.tentativas?.length || 0;
    const venceu = estadoFotoDiario?.status === "won";
    return construirTextoCompartilhamentoFoto({
        numero, tentativas, venceu, maxTentativas: MAX_TENTATIVAS_FOTO, url: URL_OFICIAL_TIMAODLE
    });
}

function compartilharResultadoFoto(botaoFeedback = finalResultShareBtn) {
    return compartilharTextoNovoModo(gerarTextoCompartilhamentoFoto(), botaoFeedback);
}

function gerarTextoCompartilhamentoMM() {
    const numero = numeroDoDesafio(getDataLocalString());
    const venceu = estadoMMDiario?.status === "won";
    return construirTextoCompartilhamentoMM({
        numero, venceu, acertos: acertosMM, rodadas: RODADAS_MM,
        resultados: estadoMMDiario?.historico || [], url: URL_OFICIAL_TIMAODLE
    });
}

function compartilharResultadoMM(botaoFeedback = finalResultShareBtn) {
    return compartilharTextoNovoModo(gerarTextoCompartilhamentoMM(), botaoFeedback);
}

shareResultBtn.addEventListener("click", compartilharResultado);
shareDailyResultBtn?.addEventListener("click", compartilharResultadoDiario);



function mostrarFimDeJogo(comAnimacao) {
    jogoAtivo = false;
    fecharAutocomplete();

    dailyEndMessageEl.classList.remove("hidden");
    dailyEndMessageEl.innerHTML = `✓ Você acertou! O jogador de hoje era <strong>${jogadorSecreto.nome}</strong>. Volte amanhã para um novo desafio.`;
    shareResultBtn.classList.remove("hidden");

    if (comAnimacao) {
        dispararConfetes();
        abrirResultadoFinal("classic");
    }
}

// ==========================================================================
// RENDERIZAÇÃO DE UMA TENTATIVA (linha do tabuleiro)
// ==========================================================================

// options.instantaneo = true -> usado ao restaurar tentativas salvas
// (sem animação de flip, aparece já revelado)
function renderizarTentativa(palpite, options = {}) {
    const instantaneo = options.instantaneo === true;

    const row = document.createElement("div");
    row.className = "attempt-row";

    const cNome = { classe: palpite.nome === jogadorSecreto.nome ? "correct" : "wrong", texto: palpite.nome };
    const cPosicao = compararTexto(palpite.posicao, jogadorSecreto.posicao);
    const cNac = compararTexto(palpite.nacionalidade, jogadorSecreto.nacionalidade);
    const cEstreia = compararNumero(palpite.estreia, jogadorSecreto.estreia);
    const cPe = compararTexto(palpite.pe, jogadorSecreto.pe);
    const cTitulos = compararTitulos(palpite.titulos, jogadorSecreto.titulos);
    const cGols = compararNumero(palpite.gols, jogadorSecreto.gols);
    const cAssists = compararNumero(palpite.assistencias, jogadorSecreto.assistencias);

    const colunas = [cNome, cPosicao, cNac, cEstreia, cPe, cTitulos, cGols, cAssists];

    colunas.forEach((col, index) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.title = col.texto;

        const cellText = document.createElement("span");
        cellText.className = "cell-text";
        cellText.innerText = col.texto;
        cell.appendChild(cellText);

        if (instantaneo) {
            cell.classList.add("reveal", col.classe);
        } else {
            setTimeout(() => {
                cell.classList.add("reveal");
                setTimeout(() => cell.classList.add(col.classe), 300);
            }, index * 200);
        }

        row.appendChild(cell);
    });

    // Palpite mais recente sempre no topo — tanto ao vivo quanto ao
    // restaurar o estado salvo (mesmo comportamento nos dois casos).
    attemptsContainer.insertBefore(row, attemptsContainer.firstChild);
    if (!instantaneo) {
        if (pageContentEl) pageContentEl.scrollTop = 0;
    }

    return { row, ehAcerto: palpite.nome === jogadorSecreto.nome, totalColunas: colunas.length };
}

// ==========================================================================
// FAZER UM PALPITE (tentativas ilimitadas até acertar)
// ==========================================================================

function fazerPalpite(palpite) {
    if (!jogoAtivo) return;

    const { row, ehAcerto, totalColunas } = renderizarTentativa(palpite, { instantaneo: false });

    // Persiste a tentativa no estado diário
    estadoDiario.tentativas.push(palpite.nome);
    salvarEstadoDiario(estadoDiario);

    const tempoTotalAnimacao = (totalColunas * 200) + 400;

    setTimeout(() => {
        if (ehAcerto) {
            estadoDiario.status = "won";
            salvarEstadoDiario(estadoDiario);
            salvarEstatisticaVitoria();
            setTimeout(() => mostrarFimDeJogo(true), 400);
        } else {
            row.classList.add("shake");
        }
    }, tempoTotalAnimacao);
}

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

const PASTA_FOTOS = "fotos/";
const MAX_TENTATIVAS_FOTO = 6;
const CHAVE_ESTADO_FOTO = "timaodle_foto_daily_state";
const CHAVE_TUTORIAL_FOTO = "timaodle_foto_tutorial_visto";

// Preenchido dinamicamente a partir de fotos-manifest.json (ver
// carregarManifestoFotos() lá embaixo).
let JOGADORES_COM_FOTO = [];

function validarManifestoFotos(manifesto) {
    if (!Array.isArray(manifesto)) throw new Error("O manifesto de fotos precisa ser um array.");

    const nomesCadastrados = new Set(jogadores.map(jogador => jogador.nome));
    return [...new Set(
        manifesto
            .filter(entrada => typeof entrada === "string")
            .map(entrada => entrada.trim())
            .filter(nome => nome && nomesCadastrados.has(nome))
    )];
}

async function carregarManifestoFotos() {
    try {
        const response = await fetch('fotos-manifest.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const manifesto = await response.json();
        if (jogadores.length === 0) await carregarJogadores();
        JOGADORES_COM_FOTO = validarManifestoFotos(manifesto);
    } catch (error) {
        console.error("Erro ao carregar fotos-manifest.json:", error);
        JOGADORES_COM_FOTO = [];
    }
}

// Níveis de blur/preto-e-branco por tentativa (índice 0 = antes de
// qualquer palpite; cada palpite avança um nível). Blur reduzido em
// relação à primeira versão — ficava difícil demais no início.
const NIVEIS_FOTO = [
    { blur: 9, gray: 100 },
    { blur: 7, gray: 80 },
    { blur: 5, gray: 60 },
    { blur: 3, gray: 40 },
    { blur: 1, gray: 20 },
    { blur: 0, gray: 0 },
];

function slugify(nome) {
    return nome
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
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
    elemento.src = `${PASTA_FOTOS}${slugify(nome)}.jpg`;
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

let jogadorSecretoFoto = null;
let tentativasFoto = [];
let fotoAtiva = true;
let selectedIndexFoto = -1;
let pretoEBrancoAtivo = true;
let estadoFotoDiario = null;

function jogadoresComFotoObjetos() {
    return jogadores.filter(j => JOGADORES_COM_FOTO.includes(j.nome));
}

function jogadorTemJogosValidosMM(jogador) {
    return jogador
        && Object.prototype.hasOwnProperty.call(jogador, CAMPO_STAT_MM)
        && typeof jogador[CAMPO_STAT_MM] === "number"
        && Number.isFinite(jogador[CAMPO_STAT_MM]);
}

function jogadoresElegiveisMM() {
    return jogadoresComFotoObjetos().filter(jogadorTemJogosValidosMM);
}

// Mesma lógica de semente por data do Modo Diário, mas com um "tempero"
// diferente (+"-foto") — assim o jogador do dia no Modo Foto normalmente
// não é o mesmo do Modo Diário de atributos.
function sortearJogadorFotoDoDia(dataStr) {
    const pool = jogadoresComFotoObjetos();
    if (pool.length === 0) return null;
    const hash = hashString(dataStr + "-foto");
    return pool[hash % pool.length];
}

function obterJogadorFotoDoEstado(estado, dataStr) {
    const jogadorSalvo = estado?.data === dataStr && typeof estado.jogadorNome === "string"
        ? jogadores.find(jogador => jogador.nome === estado.jogadorNome)
        : null;
    return jogadorSalvo || sortearJogadorFotoDoDia(dataStr);
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

function atualizarCompartilhamentoEstaticoFoto() {
    const concluido = estadoFotoDiario?.status === "won" || estadoFotoDiario?.status === "lost";
    photoShareResultBtn?.classList.toggle("hidden", !concluido);
}

function renderizarDotsFoto() {
    photoDotsEl.innerHTML = "";
    for (let i = 0; i < MAX_TENTATIVAS_FOTO; i++) {
        const dot = document.createElement("span");
        dot.className = "dot-attempt";
        if (i < tentativasFoto.length) {
            const acertou = tentativasFoto[i] === jogadorSecretoFoto.nome;
            dot.classList.add(acertou ? "used" : "wrong-used");
        }
        photoDotsEl.appendChild(dot);
    }
}

function atualizarImagemFoto() {
    const nivel = NIVEIS_FOTO[Math.min(tentativasFoto.length, NIVEIS_FOTO.length - 1)];
    const gray = pretoEBrancoAtivo ? nivel.gray : 0;
    photoImgEl.style.filter = `blur(${nivel.blur}px) grayscale(${gray}%)`;
}

function calcularDificuldadeFoto(estreia) {
    if (estreia <= 1975) return { label: "Difícil", classe: "dificil" };
    if (estreia <= 1989) return { label: "Médio", classe: "medio" };
    return { label: "Fácil", classe: "facil" };
}

function iniciarDesafioFotoDoDia() {
    const hoje = getDataLocalString();
    const salvo = carregarEstadoFoto();
    if (salvo?.data) sincronizarProgressoDiario();
    jogadorSecretoFoto = obterJogadorFotoDoEstado(salvo, hoje);

    photoEndMessageEl.classList.add("hidden");
    photoAttemptsListEl.innerHTML = "";
    photoSearchInput.value = "";
    fecharAutocompleteFoto();
    photoShareResultBtn?.classList.add("hidden");

    if (!jogadorSecretoFoto) {
        photoEndMessageEl.classList.remove("hidden");
        photoEndMessageEl.innerHTML = "Nenhuma foto cadastrada ainda em fotos-manifest.json.";
        photoSearchInput.disabled = true;
        photoDifficultyBadgeEl.classList.add("hidden");
        return;
    }

    const dificuldade = calcularDificuldadeFoto(jogadorSecretoFoto.estreia);
    photoDifficultyBadgeEl.textContent = dificuldade.label;
    photoDifficultyBadgeEl.className = `difficulty-badge ${dificuldade.classe}`;
    photoDifficultyBadgeEl.classList.remove("hidden");

    definirFotoJogador(photoImgEl, jogadorSecretoFoto);

    if (salvo && salvo.data === hoje) {
        estadoFotoDiario = salvo;
        if (estadoFotoDiario.jogadorNome !== jogadorSecretoFoto.nome) {
            estadoFotoDiario.jogadorNome = jogadorSecretoFoto.nome;
            salvarEstadoFoto(estadoFotoDiario);
        }
        tentativasFoto = [...estadoFotoDiario.tentativas];
        fotoAtiva = estadoFotoDiario.status === "playing";

        tentativasFoto.forEach(nomeTentativa => {
            const acertou = nomeTentativa === jogadorSecretoFoto.nome;
            const item = document.createElement("div");
            item.className = `photo-attempt-item ${acertou ? "correct" : "wrong"}`;
            item.innerText = nomeTentativa;
            photoAttemptsListEl.appendChild(item);
        });

        atualizarImagemFoto();
        renderizarDotsFoto();
        photoSearchInput.disabled = !fotoAtiva;
        atualizarCompartilhamentoEstaticoFoto();

        if (estadoFotoDiario.status === "won") {
            photoImgEl.style.filter = "blur(0px) grayscale(0%)";
            photoEndMessageEl.classList.remove("hidden");
            photoEndMessageEl.innerHTML = `✓ Isso aí! Era o <strong>${jogadorSecretoFoto.nome}</strong> mesmo.`;
        } else if (estadoFotoDiario.status === "lost") {
            photoImgEl.style.filter = "blur(0px) grayscale(0%)";
            photoEndMessageEl.classList.remove("hidden");
            photoEndMessageEl.innerHTML = `✕ Suas tentativas acabaram. Era o <strong>${jogadorSecretoFoto.nome}</strong>.`;
        } else {
            photoAttemptsLabelEl.innerText = `${tentativasFoto.length} / ${MAX_TENTATIVAS_FOTO} TENTATIVAS`;
        }
    } else {
        estadoFotoDiario = {
            data: hoje,
            jogadorNome: jogadorSecretoFoto.nome,
            tentativas: [],
            status: "playing"
        };
        salvarEstadoFoto(estadoFotoDiario);
        tentativasFoto = [];
        fotoAtiva = true;
        photoSearchInput.disabled = false;
        photoAttemptsLabelEl.innerText = `0 / ${MAX_TENTATIVAS_FOTO} TENTATIVAS`;
        atualizarImagemFoto();
        renderizarDotsFoto();
        atualizarCompartilhamentoEstaticoFoto();
    }

    // Tutorial do botão de preto-e-branco — só na primeira vez que
    // a pessoa abre o Modo Foto.
    if (!localStorage.getItem(CHAVE_TUTORIAL_FOTO)) {
        abrirModalAcessivel(photoTutorialModal, photoSearchInput, photoTutorialCloseBtn);
    }
}

function fecharAutocompleteFoto() {
    photoAutocompleteList.innerHTML = "";
    selectedIndexFoto = -1;
    sincronizarAriaAutocomplete(photoSearchInput, [], selectedIndexFoto);
}

function fazerPalpiteFoto(palpiteJogador) {
    if (!fotoAtiva) return;

    tentativasFoto.push(palpiteJogador.nome);
    estadoFotoDiario.tentativas = tentativasFoto;
    salvarEstadoFoto(estadoFotoDiario);

    const acertou = palpiteJogador.nome === jogadorSecretoFoto.nome;

    const item = document.createElement("div");
    item.className = `photo-attempt-item ${acertou ? "correct" : "wrong"}`;
    item.innerText = palpiteJogador.nome;
    photoAttemptsListEl.appendChild(item);

    atualizarImagemFoto();
    renderizarDotsFoto();
    photoAttemptsLabelEl.innerText = `${tentativasFoto.length} / ${MAX_TENTATIVAS_FOTO} TENTATIVAS`;

    if (acertou) {
        fotoAtiva = false;
        estadoFotoDiario.status = "won";
        salvarEstadoFoto(estadoFotoDiario);
        photoSearchInput.disabled = true;
        photoImgEl.style.filter = "blur(0px) grayscale(0%)";
        photoEndMessageEl.classList.remove("hidden");
        photoEndMessageEl.innerHTML = `✓ Isso aí! Era o <strong>${jogadorSecretoFoto.nome}</strong> mesmo.`;
        atualizarCompartilhamentoEstaticoFoto();
        dispararConfetes();
        abrirResultadoFinal("photo");
    } else if (tentativasFoto.length >= MAX_TENTATIVAS_FOTO) {
        fotoAtiva = false;
        estadoFotoDiario.status = "lost";
        salvarEstadoFoto(estadoFotoDiario);
        photoSearchInput.disabled = true;
        photoImgEl.style.filter = "blur(0px) grayscale(0%)";
        photoEndMessageEl.classList.remove("hidden");
        photoEndMessageEl.innerHTML = `✕ Suas tentativas acabaram. Era o <strong>${jogadorSecretoFoto.nome}</strong>.`;
        atualizarCompartilhamentoEstaticoFoto();
        abrirResultadoFinal("photo");
    }
}

// Autocomplete do Modo Foto — restrito só aos jogadores com foto
photoSearchInput.addEventListener("input", function () {
    if (!fotoAtiva) return;
    const value = normalizarBusca(this.value.trim());
    fecharAutocompleteFoto();
    if (!value) return;

    const jaTentados = tentativasFoto;
    const filtrados = jogadoresComFotoObjetos().filter(j =>
        normalizarBusca(j.nome).includes(value) && !jaTentados.includes(j.nome)
    );

    filtrados.forEach((j, indice) => {
        const item = document.createElement("div");
        prepararOpcaoAutocomplete(item, "photo", indice);
        item.innerText = j.nome;
        item.dataset.nome = j.nome;
        item.addEventListener("click", function () {
            fazerPalpiteFoto(j);
            photoSearchInput.value = "";
            fecharAutocompleteFoto();
        });
        photoAutocompleteList.appendChild(item);
    });
    sincronizarAriaAutocomplete(photoSearchInput, photoAutocompleteList.children, selectedIndexFoto);
});

photoSearchInput.addEventListener("keydown", function (e) {
    if (!fotoAtiva) return;
    const items = photoAutocompleteList.getElementsByTagName("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndexFoto = (selectedIndexFoto + 1) % items.length;
        sincronizarAriaAutocomplete(photoSearchInput, items, selectedIndexFoto);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndexFoto = (selectedIndexFoto - 1 + items.length) % items.length;
        sincronizarAriaAutocomplete(photoSearchInput, items, selectedIndexFoto);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndexFoto < 0) return;
        const nome = items[selectedIndexFoto].dataset.nome;
        const jogadorObjeto = jogadores.find(j => j.nome === nome);
        if (jogadorObjeto) {
            fazerPalpiteFoto(jogadorObjeto);
            photoSearchInput.value = "";
            fecharAutocompleteFoto();
        }
    } else if (e.key === "Escape") {
        fecharAutocompleteFoto();
    }
});

document.addEventListener("click", function (e) {
    if (e.target !== photoSearchInput) fecharAutocompleteFoto();
});

// Navegação
btnPlayFoto.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    photoView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());

    if (tarefas.length > 0) await Promise.all(tarefas);
    iniciarDesafioFotoDoDia();
});

backHomeBtnFoto.addEventListener("click", () => {
    photoView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderizarProgressoHome();
});

photoGrayscaleToggle.addEventListener("click", () => {
    pretoEBrancoAtivo = !pretoEBrancoAtivo;
    photoGrayscaleToggle.classList.toggle("active", pretoEBrancoAtivo);
    photoGrayscaleToggle.setAttribute("aria-pressed", pretoEBrancoAtivo);
    atualizarImagemFoto();
});

photoShareResultBtn?.addEventListener("click", () => compartilharResultadoFoto(photoShareResultBtn));

function fecharTutorialFoto() {
    localStorage.setItem(CHAVE_TUTORIAL_FOTO, "1");
    fecharModalAcessivel(photoTutorialModal, photoSearchInput);
}

photoTutorialCloseBtn.addEventListener("click", fecharTutorialFoto);

/* ==========================================================================
   TIMÃODLE — JOGOU MAIS OU MENOS
   Desafio diário (mesma sequência pra todo mundo, no mesmo dia): compara
   estatísticas de 11 jogadores em sequência (1 referência inicial + 10
   comparações). Acerta se adivinha se o próximo jogador tem MAIS ou MENOS
   que o atual — a referência sempre avança pro jogador seguinte, acertando
   ou errando. Precisa de pelo menos 7 acertos em 10 pra vencer.

   IMPORTANTE: o jogadores.json agora tem o campo "jogos" (número de
   partidas disputadas pelo Corinthians), usado como estatística de
   comparação. Pra trocar por outro critério no futuro (ex: gols),
   troque só a constante CAMPO_STAT_MM abaixo — o resto se adapta.
   ========================================================================== */

const CAMPO_STAT_MM = "jogos"; // agora usando o dado real de partidas jogadas
const ROTULOS_STAT_MM = { gols: "gols", jogos: "jogos", assistencias: "assistências" };
function rotuloStatMM() { return ROTULOS_STAT_MM[CAMPO_STAT_MM] || CAMPO_STAT_MM; }
const RODADAS_MM = 10;
const MIN_ACERTOS_MM = 7;
const CHAVE_ESTADO_MM = "timaodle_mm_daily_state";
const VERSAO_ALGORITMO_MM = 2;
const ATRASO_AVANCO_MM = 1500;
const PLANO_DIFICULDADES_MM = ["facil", "facil", "facil", "media", "media", "media", "media", "dificil", "dificil", "dificil"];

// Elementos da interface
const maisMenosView = document.getElementById("maisMenosView");
const btnPlayMaisMenos = document.getElementById("btnPlayMaisMenos");
const backHomeBtnMM = document.getElementById("backHomeBtnMM");
const mmRoundLabelEl = document.getElementById("mmRoundLabel");
const mmDotsEl = document.getElementById("mmDots");
const mmHitsLabelEl = document.getElementById("mmHitsLabel");
const mmRefFotoEl = document.getElementById("mmRefFoto");
const mmRefNomeEl = document.getElementById("mmRefNome");
const mmRefMetaEl = document.getElementById("mmRefMeta");
const mmRefStatEl = document.getElementById("mmRefStat");
const mmRefStatLabelEl = document.getElementById("mmRefStatLabel");
const mmCandFotoEl = document.getElementById("mmCandFoto");
const mmCandNomeEl = document.getElementById("mmCandNome");
const mmCandMetaEl = document.getElementById("mmCandMeta");
const mmCandStatEl = document.getElementById("mmCandStat");
const mmCandStatLabelEl = document.getElementById("mmCandStatLabel");
const mmCandRowEl = document.getElementById("mmCandRow");
const mmDividerTextEl = document.getElementById("mmDividerText");
const mmBtnMenos = document.getElementById("mmBtnMenos");
const mmBtnMais = document.getElementById("mmBtnMais");
const mmRoundResultEl = document.getElementById("mmRoundResult");
const mmEndMessageEl = document.getElementById("mmEndMessage");
const mmShareResultBtn = document.getElementById("mmShareResultBtn");
const mmCardEl = maisMenosView.querySelector(".mm-card");

let sequenciaMM = [];
let referenciaAtualMM = null;
let rodadaAtualMM = 0;
let acertosMM = 0;
let historicoMM = [];
let mmAtivo = true;
let estadoMMDiario = null;
let timerAvancoMM = null;
let transicaoMMAtiva = false;

// Gerador de números pseudoaleatórios com semente (determinístico —
// mesma semente sempre gera a mesma sequência).
function gerarPRNG(semente) {
    let s = semente >>> 0;
    return function () {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function embaralharComSemente(array, semente) {
    const rng = gerarPRNG(semente);
    const resultado = [...array];
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

function embaralharComRngMM(array, rng) {
    const resultado = [...array];
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

function maiorSequenciaIgualMM(plano) {
    let maior = 1;
    let atual = 1;
    for (let i = 1; i < plano.length; i++) {
        atual = plano[i] === plano[i - 1] ? atual + 1 : 1;
        maior = Math.max(maior, atual);
    }
    return maior;
}

function maiorSequenciaAlternadaMM(plano) {
    let maior = 1;
    let atual = 1;
    for (let i = 1; i < plano.length; i++) {
        atual = plano[i] !== plano[i - 1] ? atual + 1 : 1;
        maior = Math.max(maior, atual);
    }
    return maior;
}

function gerarPlanoDirecoesMM(rng) {
    const quantidadeMais = 4 + Math.floor(rng() * 3);
    const base = [
        ...Array(quantidadeMais).fill("mais"),
        ...Array(RODADAS_MM - quantidadeMais).fill("menos")
    ];

    for (let tentativa = 0; tentativa < 80; tentativa++) {
        const plano = embaralharComRngMM(base, rng);
        if (maiorSequenciaIgualMM(plano) <= 3 && maiorSequenciaAlternadaMM(plano) <= 4) {
            return plano;
        }
    }

    return quantidadeMais === 4
        ? ["mais", "menos", "menos", "mais", "menos", "mais", "mais", "menos", "menos", "menos"]
        : quantidadeMais === 6
            ? ["mais", "mais", "menos", "mais", "menos", "menos", "mais", "mais", "menos", "mais"]
            : ["mais", "menos", "mais", "mais", "menos", "menos", "mais", "menos", "menos", "mais"];
}

function direcaoComparacaoMM(referencia, candidato) {
    const valorReferencia = referencia[CAMPO_STAT_MM];
    const valorCandidato = candidato[CAMPO_STAT_MM];
    if (valorCandidato === valorReferencia) return "empate";
    return valorCandidato > valorReferencia ? "mais" : "menos";
}

function dificuldadeComparacaoMM(referencia, candidato) {
    const diferenca = Math.abs(candidato[CAMPO_STAT_MM] - referencia[CAMPO_STAT_MM]);
    if (diferenca <= 30) return "dificil";
    if (diferenca <= 120) return "media";
    return "facil";
}

function atendeDificuldadeExpandidaMM(referencia, candidato, dificuldade) {
    const diferenca = Math.abs(candidato[CAMPO_STAT_MM] - referencia[CAMPO_STAT_MM]);
    if (diferenca === 0) return false;
    if (dificuldade === "dificil") return diferenca <= 45;
    if (dificuldade === "media") return diferenca >= 16 && diferenca <= 160;
    return diferenca >= 91;
}

function construirSequenciaExataMM(poolPriorizado, planoDificuldades, planoDirecoes) {
    const MAX_TENTATIVAS_EXATAS_MM = poolPriorizado.length;

    for (let tentativa = 0; tentativa < MAX_TENTATIVAS_EXATAS_MM; tentativa++) {
        const inicial = poolPriorizado[tentativa % poolPriorizado.length];
        const sequencia = [inicial];
        const usados = new Set([inicial.nome]);
        let completa = true;

        for (let rodada = 0; rodada < RODADAS_MM; rodada++) {
            const referencia = sequencia[sequencia.length - 1];
            const candidatos = poolPriorizado.filter(candidato =>
                !usados.has(candidato.nome)
                && direcaoComparacaoMM(referencia, candidato) === planoDirecoes[rodada]
                && dificuldadeComparacaoMM(referencia, candidato) === planoDificuldades[rodada]
            );

            if (candidatos.length === 0) {
                completa = false;
                break;
            }

            const indice = (tentativa * 7 + rodada * 3) % candidatos.length;
            const candidato = candidatos[indice];
            usados.add(candidato.nome);
            sequencia.push(candidato);
        }

        if (completa) return sequencia;
    }
    return [];
}

function construirSequenciaComFallbackMM(poolPriorizado, planoDificuldades, planoDirecoes) {
    const sequencia = [poolPriorizado[0]];
    const usados = new Set([poolPriorizado[0].nome]);
    const fallbacks = [];

    for (let rodada = 0; rodada < RODADAS_MM; rodada++) {
        const referencia = sequencia[sequencia.length - 1];
        const disponiveis = poolPriorizado.filter(j => !usados.has(j.nome));
        const direcao = planoDirecoes[rodada];
        const dificuldade = planoDificuldades[rodada];
        const grupos = [
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) === direcao && dificuldadeComparacaoMM(referencia, j) === dificuldade),
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) === direcao && atendeDificuldadeExpandidaMM(referencia, j, dificuldade)),
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) === direcao),
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) !== "empate"),
            disponiveis
        ];
        const indiceGrupo = grupos.findIndex(grupo => grupo.length > 0);
        const candidato = grupos[indiceGrupo][0];
        fallbacks.push(indiceGrupo);
        usados.add(candidato.nome);
        sequencia.push(candidato);
    }

    return { sequencia, fallbacks };
}

function gerarDesafioMMV2(dataStr) {
    const pool = jogadoresElegiveisMM();
    if (pool.length < RODADAS_MM + 1) {
        return { sequencia: [], planoDificuldades: [], planoDirecoes: [], fallbacks: [] };
    }

    const rng = gerarPRNG(hashString(dataStr + "-mm-v2"));
    let ultimoPlanoDificuldades = [];
    let ultimoPlanoDirecoes = [];
    let ultimoPoolPriorizado = [];

    // Alguns planos são inviáveis quando uma direção e uma faixa não têm
    // candidato a partir da referência atual. Tentamos novos planos, sempre
    // com o mesmo PRNG diário, antes de flexibilizar qualquer regra.
    for (let tentativaPlano = 0; tentativaPlano < 12; tentativaPlano++) {
        ultimoPlanoDificuldades = embaralharComRngMM(PLANO_DIFICULDADES_MM, rng);
        ultimoPlanoDirecoes = gerarPlanoDirecoesMM(rng);
        ultimoPoolPriorizado = embaralharComRngMM(pool, rng);
        const sequenciaExata = construirSequenciaExataMM(
            ultimoPoolPriorizado,
            ultimoPlanoDificuldades,
            ultimoPlanoDirecoes
        );

        if (sequenciaExata.length === RODADAS_MM + 1) {
            return {
                sequencia: sequenciaExata,
                planoDificuldades: ultimoPlanoDificuldades,
                planoDirecoes: ultimoPlanoDirecoes,
                fallbacks: Array(RODADAS_MM).fill(0),
                tentativasPlano: tentativaPlano + 1
            };
        }
    }

    const resultadoFallback = construirSequenciaComFallbackMM(
        ultimoPoolPriorizado,
        ultimoPlanoDificuldades,
        ultimoPlanoDirecoes
    );
    return {
        ...resultadoFallback,
        planoDificuldades: ultimoPlanoDificuldades,
        planoDirecoes: ultimoPlanoDirecoes,
        tentativasPlano: 12
    };
}

// Mantido somente para migrar com segurança partidas v1 iniciadas antes
// da publicação do algoritmo balanceado.
function gerarSequenciaMMV1(dataStr) {
    const pool = jogadoresElegiveisMM();
    if (pool.length < RODADAS_MM + 1) return [];
    return embaralharComSemente(pool, hashString(dataStr + "-mm")).slice(0, RODADAS_MM + 1);
}

function carregarEstadoMM() {
    const salvo = lerJsonLocalStorage(CHAVE_ESTADO_MM);
    const normalizado = NormalizadoresStorage.normalizeMoreLess(salvo);
    return persistirNormalizacaoSegura(CHAVE_ESTADO_MM, salvo, normalizado);
}

function salvarEstadoMM(estado) {
    localStorage.setItem(CHAVE_ESTADO_MM, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

function atualizarCompartilhamentoEstaticoMM() {
    const concluido = estadoMMDiario?.status === "won" || estadoMMDiario?.status === "lost";
    mmShareResultBtn?.classList.toggle("hidden", !concluido);
}

function snapshotSequenciaMM(sequencia) {
    return sequencia.map(jogador => ({ ...jogador }));
}

function restaurarSequenciaSalvaMM(estado) {
    if (Array.isArray(estado?.sequenciaJogadores) && estado.sequenciaJogadores.length === RODADAS_MM + 1) {
        const snapshotsValidos = estado.sequenciaJogadores.every(j =>
            j && typeof j.nome === "string" && Number.isFinite(j[CAMPO_STAT_MM])
        );
        if (snapshotsValidos) return snapshotSequenciaMM(estado.sequenciaJogadores);
    }

    if (Array.isArray(estado?.sequenciaNomes) && estado.sequenciaNomes.length === RODADAS_MM + 1) {
        const restaurada = estado.sequenciaNomes.map(nome => jogadores.find(j => j.nome === nome));
        if (restaurada.every(jogadorTemJogosValidosMM)) return restaurada;
    }
    return [];
}

function registrarSequenciaNoEstadoMM(estado, sequencia, versao, detalhes = {}) {
    estado.versaoAlgoritmo = versao;
    estado.sequenciaNomes = sequencia.map(j => j.nome);
    estado.sequenciaJogadores = snapshotSequenciaMM(sequencia);
    if (detalhes.planoDificuldades) estado.planoDificuldades = [...detalhes.planoDificuldades];
    if (detalhes.planoDirecoes) estado.planoDirecoes = [...detalhes.planoDirecoes];
}

function renderizarDotsMM() {
    mmDotsEl.innerHTML = "";
    for (let i = 0; i < RODADAS_MM; i++) {
        const dot = document.createElement("span");
        dot.className = "dot-attempt";
        if (i < historicoMM.length) {
            dot.classList.add(historicoMM[i].correto ? "used" : "wrong-used");
        }
        mmDotsEl.appendChild(dot);
    }
    mmHitsLabelEl.innerText = `${acertosMM} ${acertosMM === 1 ? "ACERTO" : "ACERTOS"}`;
}

function cancelarAvancoAutomaticoMM() {
    if (timerAvancoMM !== null) {
        clearTimeout(timerAvancoMM);
        timerAvancoMM = null;
    }
    transicaoMMAtiva = false;
}

function agendarAvancoAutomaticoMM(finalizou) {
    if (timerAvancoMM !== null) clearTimeout(timerAvancoMM);

    timerAvancoMM = setTimeout(() => {
        timerAvancoMM = null;
        transicaoMMAtiva = false;

        // Sair do modo cancela o timer, mas esta guarda também impede uma
        // mutação tardia caso a view tenha sido ocultada por outro fluxo.
        if (maisMenosView.classList.contains("hidden")) return;

        if (finalizou) {
            mostrarFimDeJogoMM(true);
        } else if (mmAtivo && estadoMMDiario?.status === "playing") {
            renderizarRodadaMM();
        }
    }, ATRASO_AVANCO_MM);
}

function renderizarRodadaMM() {
    transicaoMMAtiva = false;
    mmRoundLabelEl.innerText = `Rodada ${rodadaAtualMM + 1}/${RODADAS_MM}`;
    mmDividerTextEl.innerText = `FEZ MAIS OU MENOS ${rotuloStatMM().toUpperCase()}?`;
    mmRoundResultEl.classList.add("hidden");
    mmRoundResultEl.classList.remove("correct", "wrong", "tie");
    mmCandRowEl.classList.remove("answered", "answer-correct", "answer-wrong");
    mmCandStatEl.classList.remove("revealed");

    definirFotoJogador(mmRefFotoEl, referenciaAtualMM);
    mmRefNomeEl.innerText = referenciaAtualMM.nome;
    mmRefMetaEl.innerText = `${referenciaAtualMM.nacionalidade} · ${referenciaAtualMM.posicao}`;
    mmRefStatEl.innerText = referenciaAtualMM[CAMPO_STAT_MM];
    mmRefStatLabelEl.innerText = rotuloStatMM().toUpperCase();

    const candidato = sequenciaMM[rodadaAtualMM + 1];
    definirFotoJogador(mmCandFotoEl, candidato);
    mmCandNomeEl.innerText = candidato.nome;
    mmCandMetaEl.innerText = `${candidato.nacionalidade} · ${candidato.posicao}`;
    mmCandStatEl.innerText = "?";
    mmCandStatLabelEl.innerText = rotuloStatMM().toUpperCase();

    mmBtnMenos.disabled = false;
    mmBtnMais.disabled = false;
    mmBtnMenos.innerHTML = `▼ Menos ${rotuloStatMM()}`;
    mmBtnMais.innerHTML = `▲ Mais ${rotuloStatMM()}`;
    mmBtnMenos.classList.remove("correct", "wrong");
    mmBtnMais.classList.remove("correct", "wrong");
    mmBtnMenos.classList.remove("correct-answer");
    mmBtnMais.classList.remove("correct-answer");

    renderizarDotsMM();

    mmCardEl.classList.remove("mm-round-enter");
    void mmCardEl.offsetWidth;
    mmCardEl.classList.add("mm-round-enter");
}

function iniciarDesafioMMDoDia() {
    cancelarAvancoAutomaticoMM();
    const hoje = getDataLocalString();
    mmEndMessageEl.classList.add("hidden");
    mmShareResultBtn?.classList.add("hidden");
    maisMenosView.classList.remove("resultado-final");

    const salvo = carregarEstadoMM();

    if (salvo?.data) sincronizarProgressoDiario();

    if (salvo && salvo.data === hoje) {
        estadoMMDiario = salvo;
        sequenciaMM = restaurarSequenciaSalvaMM(estadoMMDiario);

        if (sequenciaMM.length !== RODADAS_MM + 1) {
            // Estados anteriores ao v2 não guardavam a sequência. Recriamos
            // a v1 uma única vez e passamos a persistir seu snapshot.
            sequenciaMM = estadoMMDiario.versaoAlgoritmo === VERSAO_ALGORITMO_MM
                ? gerarDesafioMMV2(hoje).sequencia
                : gerarSequenciaMMV1(hoje);
            registrarSequenciaNoEstadoMM(
                estadoMMDiario,
                sequenciaMM,
                estadoMMDiario.versaoAlgoritmo === VERSAO_ALGORITMO_MM ? VERSAO_ALGORITMO_MM : 1
            );
            salvarEstadoMM(estadoMMDiario);
        }

        if (sequenciaMM.length < RODADAS_MM + 1) {
            mmEndMessageEl.classList.remove("hidden");
            mmEndMessageEl.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
            return;
        }

        rodadaAtualMM = estadoMMDiario.rodadaAtual;
        acertosMM = estadoMMDiario.acertos;
        historicoMM = estadoMMDiario.historico || [];
        referenciaAtualMM = sequenciaMM[rodadaAtualMM]
            || sequenciaMM.find(j => j.nome === estadoMMDiario.referenciaAtualNome)
            || sequenciaMM[0];
        mmAtivo = estadoMMDiario.status === "playing";

        if (!mmAtivo) {
            mostrarFimDeJogoMM(false);
        } else {
            renderizarRodadaMM();
        }
    } else {
        const desafioV2 = gerarDesafioMMV2(hoje);
        sequenciaMM = desafioV2.sequencia;

        if (sequenciaMM.length < RODADAS_MM + 1) {
            mmEndMessageEl.classList.remove("hidden");
            mmEndMessageEl.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
            return;
        }

        estadoMMDiario = {
            data: hoje,
            rodadaAtual: 0,
            acertos: 0,
            referenciaAtualNome: sequenciaMM[0].nome,
            historico: [],
            status: "playing",
        };
        registrarSequenciaNoEstadoMM(estadoMMDiario, sequenciaMM, VERSAO_ALGORITMO_MM, desafioV2);
        salvarEstadoMM(estadoMMDiario);

        rodadaAtualMM = 0;
        acertosMM = 0;
        historicoMM = [];
        referenciaAtualMM = sequenciaMM[0];
        mmAtivo = true;

        renderizarRodadaMM();
    }
}

function responderMM(direcaoEscolhida) {
    if (!mmAtivo || transicaoMMAtiva) return;
    transicaoMMAtiva = true;

    const candidato = sequenciaMM[rodadaAtualMM + 1];
    const statRef = referenciaAtualMM[CAMPO_STAT_MM];
    const statCand = candidato[CAMPO_STAT_MM];
    const empate = statCand === statRef;
    const direcaoCorreta = empate ? "empate" : (statCand > statRef ? "mais" : "menos");
    const correto = empate || (direcaoEscolhida === "mais" ? statCand > statRef : statCand < statRef);

    mmBtnMenos.disabled = true;
    mmBtnMais.disabled = true;
    const botaoEscolhido = direcaoEscolhida === "mais" ? mmBtnMais : mmBtnMenos;
    botaoEscolhido.classList.add(correto ? "correct" : "wrong");
    if (!correto) {
        const botaoCorreto = direcaoCorreta === "mais" ? mmBtnMais : mmBtnMenos;
        botaoCorreto.classList.add("correct-answer");
    }

    mmCandStatEl.innerText = statCand;
    mmCandStatEl.classList.add("revealed");
    mmCandRowEl.classList.add("answered", correto ? "answer-correct" : "answer-wrong");

    if (correto) acertosMM++;
    historicoMM.push({ candidato: candidato.nome, correto });
    renderizarDotsMM();

    mmRoundResultEl.classList.remove("hidden");
    if (empate) {
        mmRoundResultEl.classList.add("tie");
        mmRoundResultEl.innerHTML = `
            <span class="mm-feedback-announcement">Acertou. ${candidato.nome} tinha o mesmo número de jogos. ${statCand} jogos pelo Corinthians.</span>
            <span class="mm-feedback-visual" aria-hidden="true">
                <span class="mm-feedback-icon">✓</span>
                <strong class="mm-feedback-title">ACERTOU!</strong>
                <span class="mm-feedback-comparison"><em>${candidato.nome}</em> tinha o mesmo número de jogos</span>
                <span class="mm-feedback-stat"><b>${statCand}</b> jogos pelo Corinthians</span>
            </span>`;
    } else if (correto) {
        mmRoundResultEl.classList.add("correct");
        mmRoundResultEl.innerHTML = `
            <span class="mm-feedback-announcement">Acertou. ${candidato.nome} tinha ${direcaoCorreta} jogos. ${statCand} jogos pelo Corinthians.</span>
            <span class="mm-feedback-visual" aria-hidden="true">
                <span class="mm-feedback-icon">✓</span>
                <strong class="mm-feedback-title">ACERTOU!</strong>
                <span class="mm-feedback-comparison"><em>${candidato.nome}</em> tinha <b>${direcaoCorreta.toUpperCase()}</b> jogos</span>
                <span class="mm-feedback-stat"><b>${statCand}</b> jogos pelo Corinthians</span>
            </span>`;
    } else {
        mmRoundResultEl.classList.add("wrong");
        mmRoundResultEl.innerHTML = `
            <span class="mm-feedback-announcement">Quase. ${candidato.nome} tinha ${direcaoCorreta} jogos. ${statCand} jogos pelo Corinthians.</span>
            <span class="mm-feedback-visual" aria-hidden="true">
                <span class="mm-feedback-icon">✕</span>
                <strong class="mm-feedback-title">QUASE!</strong>
                <span class="mm-feedback-comparison"><em>${candidato.nome}</em> tinha <b>${direcaoCorreta.toUpperCase()}</b> jogos</span>
                <span class="mm-feedback-stat"><b>${statCand}</b> jogos pelo Corinthians</span>
            </span>`;
    }

    // O jogador de referência sempre avança pro próximo candidato,
    // acertando ou errando — só a pontuação (acertosMM) depende do acerto.
    referenciaAtualMM = candidato;
    rodadaAtualMM++;

    estadoMMDiario.rodadaAtual = rodadaAtualMM;
    estadoMMDiario.acertos = acertosMM;
    estadoMMDiario.referenciaAtualNome = referenciaAtualMM.nome;
    estadoMMDiario.historico = historicoMM;

    if (rodadaAtualMM >= RODADAS_MM) {
        estadoMMDiario.status = acertosMM >= MIN_ACERTOS_MM ? "won" : "lost";
        salvarEstadoMM(estadoMMDiario);
        mmAtivo = false;
        agendarAvancoAutomaticoMM(true);
    } else {
        estadoMMDiario.status = "playing";
        salvarEstadoMM(estadoMMDiario);
        agendarAvancoAutomaticoMM(false);
    }
}

function mostrarFimDeJogoMM(comAnimacao) {
    mmRoundResultEl.classList.add("hidden");
    mmEndMessageEl.classList.remove("hidden");
    maisMenosView.classList.add("resultado-final");

    const venceu = acertosMM >= MIN_ACERTOS_MM;
    mmEndMessageEl.className = `mm-result-card ${venceu ? "won" : "lost"}`;
    atualizarCompartilhamentoEstaticoMM();
    mmEndMessageEl.innerHTML = `
        <span class="mm-result-kicker">MAIS OU MENOS</span>
        <h3>${venceu ? "VITÓRIA!" : "NÃO FOI DESTA VEZ"}</h3>
        <p>${venceu ? "Você bateu a meta do desafio diário." : `Você precisava de ${MIN_ACERTOS_MM} acertos para vencer.`}</p>
        <div class="mm-result-score">
            <strong>${acertosMM}<span>/${RODADAS_MM}</span></strong>
            <small>ACERTOS</small>
        </div>
        <div class="mm-result-goal ${venceu ? "reached" : "missed"}">
            ${venceu ? "✓ META DE 7 ALCANÇADA" : `FALTARAM ${MIN_ACERTOS_MM - acertosMM} PARA A META`}
        </div>
        <p class="mm-result-return">Novo desafio à meia-noite.</p>`;
    if (venceu && comAnimacao) dispararConfetes();
    if (comAnimacao) abrirResultadoFinal("moreLess");
}

mmBtnMenos.addEventListener("click", () => responderMM("menos"));
mmBtnMais.addEventListener("click", () => responderMM("mais"));
mmShareResultBtn?.addEventListener("click", () => compartilharResultadoMM(mmShareResultBtn));

btnPlayMaisMenos.addEventListener("click", async () => {
    cancelarAvancoAutomaticoMM();
    homeView.classList.add("hidden");
    maisMenosView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());

    if (tarefas.length > 0) await Promise.all(tarefas);
    iniciarDesafioMMDoDia();
});

backHomeBtnMM.addEventListener("click", () => {
    cancelarAvancoAutomaticoMM();
    maisMenosView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderizarProgressoHome();
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
let dadosEscalacao = null;
let nomesJaResolvidos = new Set(); // nomes já revelados (visíveis + ocultos acertados)
let nomesForaDaLista = [];
let acertosEscalacao = 0;
let errosEscalacao = 0;
let selectedIndexEsc = -1;
const MAX_OCULTOS_ESCALACAO = 3;
let estadoEscalacao = null;

// Ignora acentos e maiúsculas/minúsculas na busca.
function normalizarBusca(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function carregarPartidasEscalacao() {
    try {
        const response = await fetch('partidas.json');
        PARTIDAS_ESCALACAO = await response.json();
    } catch (error) {
        console.error("Erro ao carregar partidas.json:", error);
        PARTIDAS_ESCALACAO = [];
    }
}

// Sorteia a partida do dia (semente pela data) e, dentro dela, sorteia
// quais 3 dos 11 titulares ficam ocultos — mesma sequência pra todo
// mundo, no mesmo dia.
function selecionarPartidaDoDia(dataStr) {
    if (PARTIDAS_ESCALACAO.length === 0) return null;

    const hashPartida = hashString(dataStr + "-onze");
    const partida = PARTIDAS_ESCALACAO[hashPartida % PARTIDAS_ESCALACAO.length];

    const hashSlots = hashString(dataStr + "-onze-slots-" + partida.id);
    const indices = embaralharComSemente(
        partida.titulares.map((_, i) => i),
        hashSlots
    );
    const indicesOcultos = new Set(indices.slice(0, MAX_OCULTOS_ESCALACAO));

    const jogadores_visiveis = [];
    const jogadores_ocultos = [];
    partida.titulares.forEach((j, i) => {
        if (indicesOcultos.has(i)) {
            jogadores_ocultos.push({
                slot_id: `slot-${i}`,
                posicao_abrev: j.posicao_abrev,
                top: j.top,
                left: j.left,
                nome_correto: j.nome,
            });
        } else {
            jogadores_visiveis.push({ nome: j.nome, posicao_abrev: j.posicao_abrev, top: j.top, left: j.left });
        }
    });

    return {
        id: partida.id,
        competicao: partida.competicao,
        mandante: partida.mandante,
        visitante: partida.visitante,
        local_tag: partida.local_tag,
        data: partida.data,
        estadio: partida.estadio,
        placar_real: partida.placar_real,
        jogadores_visiveis,
        jogadores_ocultos,
    };
}

function fotoOuGenerico(nome) {
    const slug = slugify(nome);
    return JOGADORES_COM_FOTO.includes(nome) ? `${PASTA_FOTOS}${slug}.jpg` : "";
}

// ---------- ETAPA 1: contexto da partida + palpite de placar ----------
function carregarEstadoEscalacao() {
    const salvo = lerJsonLocalStorage(CHAVE_ESTADO_ESCALACAO);
    const normalizado = NormalizadoresStorage.normalizeLineup(salvo, {
        matchIds: PARTIDAS_ESCALACAO.length ? PARTIDAS_ESCALACAO.map(partida => partida.id) : null,
        playerNames: jogadores.length ? jogadores.map(jogador => jogador.nome) : null,
        lineupNames: dadosEscalacao
            ? [...dadosEscalacao.jogadores_visiveis, ...dadosEscalacao.jogadores_ocultos]
                .map(jogador => jogador.nome || jogador.nome_correto)
            : null,
        hiddenNames: dadosEscalacao?.jogadores_ocultos?.map(slot => slot.nome_correto) || null,
        realScore: dadosEscalacao?.placar_real || null
    });
    return persistirNormalizacaoSegura(CHAVE_ESTADO_ESCALACAO, salvo, normalizado);
}

function salvarEstadoEscalacao() {
    if (!estadoEscalacao) return;
    localStorage.setItem(CHAVE_ESTADO_ESCALACAO, JSON.stringify(estadoEscalacao));
    sincronizarProgressoDiario();
}

function criarEstadoEscalacaoNovo(hoje) {
    return {
        data: hoje,
        partidaId: dadosEscalacao.id || null,
        etapa: "placar",
        palpiteMandante: null,
        palpiteVisitante: null,
        nomesResolvidos: [],
        nomesForaDaLista: [],
        errosEscalacao: 0,
        exactScore: null,
        concluido: false
    };
}

function sincronizarEstadoEscalacaoComPartida(hoje) {
    const salvo = carregarEstadoEscalacao();
    if (salvo?.data) sincronizarProgressoDiario();

    const partidaIdAtual = dadosEscalacao.id || null;
    const saveCompativel = salvo && salvo.data === hoje
        && (salvo.partidaId === partidaIdAtual || salvo.partidaId == null);

    if (saveCompativel) {
        estadoEscalacao = salvo;
        let migrou = false;
        if (estadoEscalacao.partidaId == null && partidaIdAtual != null) {
            estadoEscalacao.partidaId = partidaIdAtual;
            migrou = true;
        }
        if (estadoEscalacao.etapa !== "placar" && typeof estadoEscalacao.exactScore !== "boolean") {
            const real = dadosEscalacao.placar_real;
            estadoEscalacao.exactScore = estadoEscalacao.palpiteMandante === real.mandante
                && estadoEscalacao.palpiteVisitante === real.visitante;
            migrou = true;
        }
        if (migrou) salvarEstadoEscalacao();
    } else {
        estadoEscalacao = criarEstadoEscalacaoNovo(hoje);
        salvarEstadoEscalacao();
    }
}

function aplicarContextoEscalacao() {
    escCompeticaoEl.innerText = dadosEscalacao.competicao;
    escConfrontoEl.innerText = `${dadosEscalacao.mandante} — ${dadosEscalacao.visitante}`;
    escLocalTagEl.innerText = dadosEscalacao.local_tag;
    escDataEstadioEl.innerText = `${dadosEscalacao.data} · ${dadosEscalacao.estadio}`;

    escNomeMandanteEl.innerText = dadosEscalacao.mandante;
    escNomeVisitanteEl.innerText = dadosEscalacao.visitante;
    escCrestVisitanteEl.innerText = dadosEscalacao.visitante.slice(0, 3).toUpperCase();
    escNomeMandante2El.innerText = dadosEscalacao.mandante;
    escNomeVisitante2El.innerText = dadosEscalacao.visitante;
    escCrestVisitante2El.innerText = dadosEscalacao.visitante.slice(0, 3).toUpperCase();
}

function restaurarResultadoEscalacao() {
    const real = dadosEscalacao.placar_real;
    const palpiteMandante = estadoEscalacao.palpiteMandante;
    const palpiteVisitante = estadoEscalacao.palpiteVisitante;
    const acertouPlacar = palpiteMandante === real.mandante && palpiteVisitante === real.visitante;

    escPlacarFinalEl.innerText = `${real.mandante}–${real.visitante}`;
    escPalpitePlacarResultadoEl.className = `match-score-guess-result ${acertouPlacar ? "acertou" : "errou"}`;
    escPalpitePlacarResultadoEl.innerText = acertouPlacar
        ? `✓ Acertaste ${palpiteMandante}–${palpiteVisitante}!`
        : `✗ Disseste ${palpiteMandante}–${palpiteVisitante}`;

    escScoreGuessEl.classList.add("hidden");
    escResultadoFinalEl.classList.remove("hidden");
    escLineupCardEl.classList.remove("hidden");
}

function iniciarTelaEscalacao() {
    const hoje = getDataLocalString();
    dadosEscalacao = selecionarPartidaDoDia(hoje);

    if (!dadosEscalacao) {
        escConfrontoEl.innerText = "Não foi possível carregar as partidas (partidas.json).";
        return;
    }

    aplicarContextoEscalacao();
    sincronizarEstadoEscalacaoComPartida(hoje);

    escScoreGuessEl.classList.remove("hidden");
    escResultadoFinalEl.classList.add("hidden");
    escLineupCardEl.classList.add("hidden");
    escalacaoEndMessageEl.classList.add("hidden");
    escCompletionCardEl.classList.add("hidden");
    escScoreMandanteInput.value = "";
    escScoreVisitanteInput.value = "";

    if (estadoEscalacao.etapa === "placar") return;

    escScoreMandanteInput.value = estadoEscalacao.palpiteMandante ?? "";
    escScoreVisitanteInput.value = estadoEscalacao.palpiteVisitante ?? "";
    restaurarResultadoEscalacao();
    restaurarEstadoOnzeInicial();
}

function confirmarPalpitePlacar() {
    const palpiteMandante = parseInt(escScoreMandanteInput.value, 10);
    const palpiteVisitante = parseInt(escScoreVisitanteInput.value, 10);

    if (isNaN(palpiteMandante) || isNaN(palpiteVisitante)) {
        escScoreMandanteInput.focus();
        return;
    }

    estadoEscalacao.palpiteMandante = palpiteMandante;
    estadoEscalacao.palpiteVisitante = palpiteVisitante;
    estadoEscalacao.exactScore = palpiteMandante === dadosEscalacao.placar_real.mandante
        && palpiteVisitante === dadosEscalacao.placar_real.visitante;
    estadoEscalacao.etapa = "escalacao";
    salvarEstadoEscalacao();

    restaurarResultadoEscalacao();
    iniciarOnzeInicial();
}

escConfirmarPlacarBtn.addEventListener("click", confirmarPalpitePlacar);

// ---------- ETAPA 2: onze inicial ----------
function iniciarOnzeInicial() {
    const resolvidos = Array.isArray(estadoEscalacao?.nomesResolvidos)
        ? estadoEscalacao.nomesResolvidos
        : [];
    const fora = Array.isArray(estadoEscalacao?.nomesForaDaLista)
        ? estadoEscalacao.nomesForaDaLista
        : [];

    nomesJaResolvidos = new Set(dadosEscalacao.jogadores_visiveis.map(j => j.nome));
    resolvidos.forEach(nome => nomesJaResolvidos.add(nome));
    nomesForaDaLista = [...fora];
    errosEscalacao = Number.isFinite(estadoEscalacao?.errosEscalacao)
        ? estadoEscalacao.errosEscalacao
        : nomesForaDaLista.length;
    acertosEscalacao = dadosEscalacao.jogadores_ocultos.filter(slot => nomesJaResolvidos.has(slot.nome_correto)).length;
    escalacaoFeedbackEl.classList.add("hidden");
    escalacaoSearchInput.value = "";
    escalacaoSearchInput.disabled = Boolean(estadoEscalacao?.concluido);
    fecharAutocompleteEsc();

    atualizarProgressoEscalacao();
    renderizarFaltam();
    renderizarForaList();
    renderizarCampo();

    if (estadoEscalacao?.concluido) {
        escalacaoEndMessageEl.classList.add("hidden");
        renderizarResultadoConclusaoEscalacao();
    } else {
        escCompletionCardEl.classList.add("hidden");
    }
}

function restaurarEstadoOnzeInicial() {
    iniciarOnzeInicial();
}

function renderizarCampo() {
    pitchFieldEl.innerHTML = "";

    const quantidadePorLinha = [...dadosEscalacao.jogadores_visiveis, ...dadosEscalacao.jogadores_ocultos]
        .reduce((contagem, jogador) => {
            contagem.set(jogador.top, (contagem.get(jogador.top) || 0) + 1);
            return contagem;
        }, new Map());
    const linhaDensa = (top) => (quantidadePorLinha.get(top) || 0) >= 4;

    dadosEscalacao.jogadores_visiveis.forEach(j => {
        pitchFieldEl.appendChild(criarChipVisivel(j.nome, j.top, j.left, false, linhaDensa(j.top)));
    });

    dadosEscalacao.jogadores_ocultos.forEach(slot => {
        const jaResolvido = nomesJaResolvidos.has(slot.nome_correto);
        const chip = jaResolvido
            ? criarChipVisivel(slot.nome_correto, slot.top, slot.left, true, linhaDensa(slot.top))
            : criarChipOculto(slot, linhaDensa(slot.top));
        pitchFieldEl.appendChild(chip);
    });
}

function criarChipVisivel(nome, top, left, revelado = false, linhaDensa = false) {
    const chip = document.createElement("div");
    chip.className = `player-chip${linhaDensa ? " dense-line" : ""}`;
    chip.style.top = `${top}%`;
    chip.style.left = `${left}%`;

    const foto = fotoOuGenerico(nome);
    const dotHtml = foto
        ? `<img src="${foto}" class="chip-dot" alt="Foto de ${nome}" style="object-fit:cover;object-position:center top;">`
        : `<span class="chip-dot" aria-hidden="true"></span>`;

    chip.innerHTML = `${dotHtml}<span class="chip-label${revelado ? " correct" : ""}">${nome}</span>`;
    return chip;
}

function criarChipOculto(slot, linhaDensa = false) {
    const chip = document.createElement("div");
    chip.className = `player-chip${linhaDensa ? " dense-line" : ""}`;
    chip.style.top = `${slot.top}%`;
    chip.style.left = `${slot.left}%`;
    chip.dataset.slotId = slot.slot_id;
    chip.innerHTML = `<span class="slot-btn" id="slot-btn-${slot.slot_id}">?</span>
        <span class="chip-label-slot">${slot.posicao_abrev}</span>`;
    return chip;
}

function renderizarFaltam() {
    escalacaoFaltamEl.innerHTML = '<span class="lineup-faltam-label">FALTAM</span>';
    dadosEscalacao.jogadores_ocultos
        .filter(slot => !nomesJaResolvidos.has(slot.nome_correto))
        .forEach(slot => {
            const pill = document.createElement("span");
            pill.className = "faltam-pill";
            pill.innerText = slot.posicao_abrev;
            escalacaoFaltamEl.appendChild(pill);
        });
}

function atualizarProgressoEscalacao() {
    const total = dadosEscalacao.jogadores_ocultos.length;
    escalacaoProgressEl.innerText = `${acertosEscalacao}/${total} JOGADORES`;

    escalacaoDotsEl.innerHTML = "";
    for (let i = 0; i < total; i++) {
        const dot = document.createElement("span");
        dot.className = "dot-attempt";
        if (i < acertosEscalacao) dot.classList.add("used");
        escalacaoDotsEl.appendChild(dot);
    }
}

function renderizarForaList() {
    if (nomesForaDaLista.length === 0) {
        escalacaoForaListEl.classList.add("hidden");
        return;
    }
    escalacaoForaListEl.classList.remove("hidden");
    escalacaoForaListEl.innerHTML = `<strong>Fora:</strong> ${nomesForaDaLista.join(", ")}`;
}

function fecharAutocompleteEsc() {
    escalacaoAutocompleteList.innerHTML = "";
    selectedIndexEsc = -1;
    sincronizarAriaAutocomplete(escalacaoSearchInput, [], selectedIndexEsc);
}

function mostrarFeedbackEsc(texto) {
    escalacaoFeedbackEl.classList.remove("hidden");
    escalacaoFeedbackEl.innerText = texto;
    setTimeout(() => escalacaoFeedbackEl.classList.add("hidden"), 2200);
}

// Busca em TODA a base de jogadores (não só os 11 da partida) — assim
// errar de propósito mostra corretamente que o jogador "tá fora".
escalacaoSearchInput.addEventListener("input", function () {
    const valor = normalizarBusca(this.value.trim());
    fecharAutocompleteEsc();
    if (!valor) return;

    const filtrados = jogadores.filter(j => normalizarBusca(j.nome).includes(valor)).slice(0, 8);

    filtrados.forEach((j, indice) => {
        const item = document.createElement("div");
        prepararOpcaoAutocomplete(item, "lineup", indice);
        const foto = fotoOuGenerico(j.nome);
        const avatarHtml = foto
            ? `<img src="${foto}" class="autocomplete-avatar-img" alt="" aria-hidden="true">`
            : `<span class="autocomplete-avatar-img" aria-hidden="true"></span>`;
        item.innerHTML = `${avatarHtml}<span>${j.nome}</span>`;
        item.dataset.nome = j.nome;
        item.addEventListener("click", () => processarPalpiteEscalacao(j.nome));
        escalacaoAutocompleteList.appendChild(item);
    });
    sincronizarAriaAutocomplete(escalacaoSearchInput, escalacaoAutocompleteList.children, selectedIndexEsc);
});

escalacaoSearchInput.addEventListener("keydown", function (e) {
    const items = escalacaoAutocompleteList.getElementsByTagName("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndexEsc = (selectedIndexEsc + 1) % items.length;
        sincronizarAriaAutocomplete(escalacaoSearchInput, items, selectedIndexEsc);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndexEsc = (selectedIndexEsc - 1 + items.length) % items.length;
        sincronizarAriaAutocomplete(escalacaoSearchInput, items, selectedIndexEsc);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndexEsc < 0) return;
        processarPalpiteEscalacao(items[selectedIndexEsc].dataset.nome);
    } else if (e.key === "Escape") {
        fecharAutocompleteEsc();
    }
});

document.addEventListener("click", function (e) {
    if (e.target !== escalacaoSearchInput) fecharAutocompleteEsc();
});

// ==========================================================================
// LÓGICA DE VALIDAÇÃO
// O jogo descobre sozinho onde o nome digitado se encaixa — não precisa
// escolher o slot manualmente.
// ==========================================================================
function processarPalpiteEscalacao(nomeDigitado) {
    escalacaoSearchInput.value = "";
    fecharAutocompleteEsc();
    escalacaoSearchInput.focus();

    if (nomesJaResolvidos.has(nomeDigitado)) {
        mostrarFeedbackEsc("Esse já está no onze.");
        return;
    }

    const slot = dadosEscalacao.jogadores_ocultos.find(s => s.nome_correto === nomeDigitado);

    if (!slot) {
        errosEscalacao++;
        if (!nomesForaDaLista.includes(nomeDigitado)) {
            nomesForaDaLista.push(nomeDigitado);
        }
        if (estadoEscalacao) {
            estadoEscalacao.nomesForaDaLista = [...nomesForaDaLista];
            estadoEscalacao.errosEscalacao = errosEscalacao;
            salvarEstadoEscalacao();
        }
        renderizarForaList();
        mostrarFeedbackEsc("Esse jogador não estava no onze inicial.");
        return;
    }

    nomesJaResolvidos.add(nomeDigitado);
    acertosEscalacao++;
    if (estadoEscalacao) {
        estadoEscalacao.nomesResolvidos = dadosEscalacao.jogadores_ocultos
            .filter(s => nomesJaResolvidos.has(s.nome_correto))
            .map(s => s.nome_correto);
        salvarEstadoEscalacao();
    }

    const btn = document.getElementById(`slot-btn-${slot.slot_id}`);
    if (btn) btn.classList.add("correct");

    atualizarProgressoEscalacao();
    renderizarFaltam();

    setTimeout(() => {
        renderizarCampo();

        if (acertosEscalacao >= dadosEscalacao.jogadores_ocultos.length) {
            escalacaoSearchInput.disabled = true;
            if (estadoEscalacao) {
                estadoEscalacao.etapa = "concluido";
                estadoEscalacao.concluido = true;
                estadoEscalacao.nomesResolvidos = dadosEscalacao.jogadores_ocultos.map(s => s.nome_correto);
                salvarEstadoEscalacao();
            }
            escalacaoEndMessageEl.classList.add("hidden");
            renderizarResultadoConclusaoEscalacao();
            dispararConfetes();
            abrirResultadoFinal("lineup");
        }
    }, 500);
}

function renderizarResultadoConclusaoEscalacao() {
    if (!dadosEscalacao || !estadoEscalacao) return;

    const real = dadosEscalacao.placar_real;
    const palpiteM = estadoEscalacao.palpiteMandante;
    const palpiteV = estadoEscalacao.palpiteVisitante;
    const acertouPlacar = palpiteM === real.mandante && palpiteV === real.visitante;
    const total = dadosEscalacao.jogadores_ocultos.length;

    escResumoPlacarRealEl.innerText = `${real.mandante}–${real.visitante}`;
    escResumoPalpiteEl.innerText = `${palpiteM}–${palpiteV}`;
    escResumoPalpiteStatusEl.innerText = acertouPlacar ? "✓ PLACAR EXATO" : "PLACAR DIFERENTE";
    escResumoPalpiteStatusEl.className = `result-status ${acertouPlacar ? "acertou" : "errou"}`;
    escResumoAcertosEl.innerText = `${acertosEscalacao}/${total}`;
    escResumoErrosEl.innerText = String(errosEscalacao);

    if (nomesForaDaLista.length > 0) {
        escResumoErrosDetalheEl.classList.remove("hidden");
        escResumoErrosDetalheEl.innerHTML = `<strong>Tentativas fora do onze:</strong> ${nomesForaDaLista.join(", ")}`;
    } else {
        escResumoErrosDetalheEl.classList.add("hidden");
        escResumoErrosDetalheEl.innerHTML = "";
    }

    escCompletionCardEl.classList.remove("hidden");
}

function montarTextoCompartilhamentoEscalacao() {
    const real = dadosEscalacao.placar_real;
    const palpiteM = estadoEscalacao.palpiteMandante;
    const palpiteV = estadoEscalacao.palpiteVisitante;
    const total = dadosEscalacao.jogadores_ocultos.length;
    return construirTextoCompartilhamentoOnze({
        mandante: dadosEscalacao.mandante,
        visitante: dadosEscalacao.visitante,
        placarReal: real,
        palpite: { mandante: palpiteM, visitante: palpiteV },
        acertos: acertosEscalacao,
        total,
        erros: errosEscalacao
    });
}

async function compartilharResultadoEscalacao() {
    const texto = montarTextoCompartilhamentoEscalacao();
    const copiarFallback = textoFallback => {
        const area = document.createElement("textarea");
        area.value = textoFallback;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const copiado = document.execCommand("copy");
        area.remove();
        return copiado;
    };
    const resultado = await compartilharTexto(texto, { copiarFallback });
    if (resultado.shareError && resultado.shareError.name !== "AbortError") {
        console.warn("Falha ao compartilhar resultado do Onze Inicial:", resultado.shareError);
    }
    if (resultado.status === "copied") {
        const original = escShareLineupBtn.innerText;
        escShareLineupBtn.innerText = "Copiado! ✓";
        setTimeout(() => { escShareLineupBtn.innerText = original; }, 1800);
    }
}

escShareLineupBtn.addEventListener("click", compartilharResultadoEscalacao);

// Navegação
btnPlayEscalacao.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    escalacaoView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());
    if (PARTIDAS_ESCALACAO.length === 0) tarefas.push(carregarPartidasEscalacao());

    if (tarefas.length > 0) await Promise.all(tarefas);
    iniciarTelaEscalacao();
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
        const jogadorOntem = sortearJogadorDoDia(ontemStr);
        yesterdayPlayerEl.innerText = jogadorOntem.nome;
    }
});

carregarManifestoFotos();
sincronizarProgressoDiario();
