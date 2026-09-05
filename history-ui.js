(function (root, factory) {
    const core = typeof module === "object" && module.exports ? require("./core.js") : root?.TimaodleCore;
    const historyStats = typeof module === "object" && module.exports ? require("./history-stats.js") : root?.TimaodleHistoryStats;
    const api = factory(core, historyStats);
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleHistoryUI = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (core, historyStats) {
    "use strict";

    const {
        formatarDataLocal, componentesDataCivil, criarDataCivilString,
        compararDatasCivis, diasNoMesCivil, deslocamentoPrimeiraSemanaCivil,
        moverMesCivil, moverDataCivil, dataCivilValida
    } = core;
    const {
        criarResumoDiaVazio, calcularProgressoDoResumo,
        obterResumoHistoricoDia, obterSequenciaHistoricaDoDia
    } = historyStats;

    const MESES_HISTORICO = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];
    const CLASSES_ESTADO_HISTORICO = [
        "is-future", "is-before-tracking", "is-no-record", "is-recorded",
        "is-started", "is-partial", "is-complete"
    ];

    function getDataLocalString() {
        return formatarDataLocal(new Date());
    }

    function dataNavegavelHistorico(data, historico, hoje = getDataLocalString()) {
        if (!dataCivilValida(data) || !dataCivilValida(hoje)) return false;
        const inicio = dataCivilValida(historico?.trackingStartedAt) ? historico.trackingStartedAt : hoje;
        return compararDatasCivis(data, inicio) >= 0 && compararDatasCivis(data, hoje) <= 0;
    }

    function limitarDataNavegavelHistorico(data, historico, hoje = getDataLocalString()) {
        if (!dataCivilValida(data) || !dataCivilValida(hoje)) return null;
        const inicio = dataCivilValida(historico?.trackingStartedAt) ? historico.trackingStartedAt : hoje;
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
        const tracking = dataCivilValida(historico?.trackingStartedAt)
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
        const trackingStartedAt = dataCivilValida(historico?.trackingStartedAt)
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

    function createHistoryUI(configuracao) {
        const {
            documentApi, elements, getHistory, getCurrentDate,
            openDialog, closeDialog
        } = configuracao;
        const estado = {
            year: null,
            month: null,
            selectedDate: null,
            focusedDate: null,
            history: null,
            today: null
        };
        let initialized = false;

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
            if (!elements.daySummary) return;
            if (!dia) {
                elements.summaryEmpty?.classList.remove("hidden");
                elements.selectedDateTitle?.classList.add("hidden");
                elements.noRecord?.classList.add("hidden");
                elements.dayDetails?.classList.add("hidden");
                elements.historicalStreak?.classList.add("hidden");
                return;
            }
            const resumo = obterResumoHistoricoDia(dia.date, estado.history);
            elements.summaryEmpty?.classList.add("hidden");
            if (elements.selectedDateTitle) {
                elements.selectedDateTitle.textContent = formatarDataHistorico(dia.date);
                elements.selectedDateTitle.classList.remove("hidden");
            }

            if (!resumo.hasRecord) {
                elements.noRecord?.classList.remove("hidden");
                elements.dayDetails?.classList.add("hidden");
                elements.historicalStreak?.classList.add("hidden");
                return;
            }

            elements.noRecord?.classList.add("hidden");
            elements.dayDetails?.classList.remove("hidden");
            if (elements.classicSummary) elements.classicSummary.textContent = resumo.classic.statusText;
            if (elements.photoSummary) elements.photoSummary.textContent = resumo.photo.statusText;
            if (elements.moreLessSummary) elements.moreLessSummary.textContent = resumo.moreLess.statusText;
            if (elements.lineupSummary) elements.lineupSummary.textContent = resumo.lineup.statusText;
            elements.lineupExactScore?.classList.toggle("hidden", !resumo.lineup.exactScore);

            const estados = {
                classic: resumo.classic,
                photo: resumo.photo,
                moreLess: resumo.moreLess,
                lineup: resumo.lineup
            };
            Object.entries(estados).forEach(([modo, estadoModo]) => {
                const linha = elements.dayDetails?.querySelector(`[data-history-mode="${modo}"]`);
                if (!linha) return;
                linha.classList.remove("is-not-started", "is-in-progress", "is-completed", "is-won", "is-lost");
                linha.classList.add(!estadoModo.started ? "is-not-started" : estadoModo.completed ? "is-completed" : "is-in-progress");
                if (estadoModo.outcome === "won") linha.classList.add("is-won");
                if (estadoModo.outcome === "lost") linha.classList.add("is-lost");
            });

            if (elements.overallProgress) {
                elements.overallProgress.textContent = `${resumo.completedCount}/4 DESAFIOS`;
                elements.overallProgress.classList.toggle("is-complete", resumo.complete);
            }
            const sequencia = resumo.complete
                ? obterSequenciaHistoricaDoDia(dia.date, estado.history, estado.today)
                : null;
            const mostrarSequencia = sequencia?.belongs === true;
            elements.historicalStreak?.classList.toggle("hidden", !mostrarSequencia);
            if (mostrarSequencia && elements.historicalStreakText) {
                const dias = sequencia.throughSelectedDate;
                elements.historicalStreakText.textContent = `Sequência até este dia: ${dias} ${dias === 1 ? "dia" : "dias"}`;
            }
        }

        function selecionarDiaHistorico(data, devolverFoco = false) {
            const grade = gerarGradeMensalHistorico(estado.year, estado.month, estado.history, estado.today);
            const dia = grade.days.find(item => item.date === data && !item.isFuture && !item.isBeforeTracking);
            if (!dia) return;
            estado.selectedDate = data;
            estado.focusedDate = data;
            renderizarCalendarioHistorico();
            if (devolverFoco) elements.calendarGrid?.querySelector(`[data-history-date="${data}"]`)?.focus();
        }

        function renderizarCalendarioHistorico(atualizarResumo = true) {
            if (!elements.calendarGrid || !estado.history || !estado.today) return;
            const grade = gerarGradeMensalHistorico(estado.year, estado.month, estado.history, estado.today);
            estado.year = grade.year;
            estado.month = grade.month;
            const focoExisteNaGrade = grade.days.some(dia => dia.date === estado.focusedDate
                && !dia.isFuture && !dia.isBeforeTracking);
            if (!focoExisteNaGrade) {
                estado.focusedDate = obterDataFocoInicialHistorico(grade, estado.selectedDate, estado.today);
            }
            if (elements.monthTitle) elements.monthTitle.textContent = `${MESES_HISTORICO[grade.month - 1]} ${grade.year}`;
            if (elements.previousMonth) elements.previousMonth.disabled = !grade.navigation.canGoPrevious;
            if (elements.nextMonth) elements.nextMonth.disabled = !grade.navigation.canGoNext;

            elements.calendarGrid.replaceChildren();
            for (let index = 0; index < grade.firstWeekOffset; index++) {
                const vazio = documentApi.createElement("span");
                vazio.className = "history-calendar-empty";
                vazio.setAttribute("aria-hidden", "true");
                elements.calendarGrid.appendChild(vazio);
            }

            grade.days.forEach(dia => {
                const selecionado = dia.date === estado.selectedDate;
                const classeEstado = `is-${dia.state}`;
                const celula = documentApi.createElement("div");
                celula.className = `history-day-cell ${CLASSES_ESTADO_HISTORICO.includes(classeEstado) ? classeEstado : "is-no-record"}${dia.isToday ? " is-today" : ""}${selecionado ? " is-selected" : ""}`;
                celula.setAttribute("role", "gridcell");
                celula.setAttribute("aria-selected", String(selecionado));

                const botao = documentApi.createElement("button");
                botao.type = "button";
                botao.className = "history-day-button";
                botao.dataset.historyDate = dia.date;
                botao.disabled = dia.isFuture || dia.isBeforeTracking;
                botao.tabIndex = obterTabIndexDiaHistorico(dia, estado.focusedDate);
                botao.setAttribute("aria-label", rotuloAcessivelDiaHistorico(dia));
                botao.setAttribute("aria-pressed", String(selecionado));
                if (dia.isToday) botao.setAttribute("aria-current", "date");

                const numero = documentApi.createElement("span");
                numero.className = "history-day-number";
                numero.textContent = String(dia.day);
                botao.appendChild(numero);

                if (dia.isToday) {
                    const hoje = documentApi.createElement("span");
                    hoje.className = "history-today-marker";
                    hoje.textContent = "HOJE";
                    botao.appendChild(hoje);
                }

                const indicador = textoIndicadorDiaHistorico(dia);
                if (indicador) {
                    const progresso = documentApi.createElement("span");
                    progresso.className = "history-day-progress";
                    progresso.textContent = indicador;
                    botao.appendChild(progresso);
                }

                if (!botao.disabled) botao.addEventListener("click", () => selecionarDiaHistorico(dia.date, true));
                celula.appendChild(botao);
                elements.calendarGrid.appendChild(celula);
            });

            if (atualizarResumo) {
                const selecionado = estado.selectedDate
                    ? obterEstadoDiaHistorico(estado.selectedDate, estado.history, estado.today)
                    : null;
                renderizarResumoDiaHistorico(selecionado);
            }
        }

        function atualizarFocoRovingHistorico(data) {
            if (!elements.calendarGrid || !dataNavegavelHistorico(data, estado.history, estado.today)) return;
            const alvo = elements.calendarGrid.querySelector(`[data-history-date="${data}"]`);
            if (!alvo || alvo.disabled) return;
            elements.calendarGrid.querySelectorAll(".history-day-button").forEach(botao => {
                botao.tabIndex = botao === alvo ? 0 : -1;
            });
            estado.focusedDate = data;
            alvo.focus();
        }

        function navegarCalendarioHistoricoPorTeclado(event) {
            const botao = event.target.closest?.(".history-day-button");
            if (!botao || botao.disabled || !elements.calendarGrid?.contains(botao)) return;
            const resultado = resolverNavegacaoTecladoHistorico(
                event.key, botao.dataset.historyDate, estado.selectedDate, estado.history, estado.today
            );
            if (!resultado.handled) return;
            event.preventDefault();

            if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
                selecionarDiaHistorico(resultado.focusDate, true);
                return;
            }

            const civil = componentesDataCivil(resultado.focusDate);
            if (!civil) return;
            if (civil.year === estado.year && civil.month === estado.month) {
                atualizarFocoRovingHistorico(resultado.focusDate);
                return;
            }
            estado.year = civil.year;
            estado.month = civil.month;
            estado.focusedDate = resultado.focusDate;
            renderizarCalendarioHistorico(false);
            elements.calendarGrid.querySelector(`[data-history-date="${resultado.focusDate}"]`)?.focus();
        }

        function navegarMesHistorico(direcao) {
            if (direcao !== -1 && direcao !== 1) return;
            const gradeAtual = gerarGradeMensalHistorico(estado.year, estado.month, estado.history, estado.today);
            const destino = direcao < 0 ? gradeAtual.navigation.previousMonth : gradeAtual.navigation.nextMonth;
            if (!destino) return;
            estado.year = destino.year;
            estado.month = destino.month;
            const novaGrade = gerarGradeMensalHistorico(destino.year, destino.month, estado.history, estado.today);
            estado.selectedDate = novaGrade.days
                .filter(dia => dia.hasRecord && !dia.isFuture && !dia.isBeforeTracking)
                .at(-1)?.date || null;
            estado.focusedDate = null;
            renderizarCalendarioHistorico();
        }

        function open() {
            const today = getCurrentDate();
            const civil = componentesDataCivil(today);
            if (!civil) return;
            estado.history = getHistory();
            estado.today = today;
            estado.year = civil.year;
            estado.month = civil.month;
            estado.selectedDate = today;
            estado.focusedDate = today;
            renderizarCalendarioHistorico();
            openDialog(elements.modal, elements.openButton, elements.closeButton);
        }

        function close() {
            closeDialog(elements.modal, elements.openButton);
        }

        function init() {
            if (initialized) return;
            initialized = true;
            elements.openButton?.addEventListener("click", open);
            elements.closeButton?.addEventListener("click", close);
            elements.previousMonth?.addEventListener("click", () => navegarMesHistorico(-1));
            elements.nextMonth?.addEventListener("click", () => navegarMesHistorico(1));
            elements.calendarGrid?.addEventListener("keydown", navegarCalendarioHistoricoPorTeclado);
        }

        return {
            init,
            open,
            close,
            render: renderizarCalendarioHistorico,
            getState: () => ({ ...estado })
        };
    }

    const calendar = {
        dataNavegavelHistorico,
        limitarDataNavegavelHistorico,
        obterDataFocoSemanaHistorico,
        obterDataFocoMesHistorico,
        resolverNavegacaoTecladoHistorico,
        compararMesesCivis,
        obterLimitesMesesHistorico,
        limitarMesAoHistorico,
        obterNavegacaoMesHistorico,
        obterEstadoDiaHistorico,
        gerarGradeMensalHistorico,
        obterDataFocoInicialHistorico,
        obterTabIndexDiaHistorico
    };

    return { MESES_HISTORICO, CLASSES_ESTADO_HISTORICO, calendar, createHistoryUI };
});
