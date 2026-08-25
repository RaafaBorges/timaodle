(function (root, factory) {
    const core = typeof module === "object" && module.exports ? require("./core.js") : root?.TimaodleCore;
    const api = factory(core);
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleHistoryStats = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (core) {
    "use strict";

    const { dataCivilValida, compararDatasCivis, moverDataCivil } = core;

    function quantidadeSegura(valor, maximo = Number.MAX_SAFE_INTEGER) {
        return Number.isFinite(valor) ? Math.min(maximo, Math.max(0, Math.trunc(valor))) : 0;
    }

    function criarResumoModoBase() {
        return { started: false, completed: false, outcome: null };
    }

    function criarResumoDiaVazio() {
        return {
            classic: { ...criarResumoModoBase(), attempts: 0 },
            photo: { ...criarResumoModoBase(), attempts: 0 },
            moreLess: { ...criarResumoModoBase(), hits: 0, rounds: 0 },
            lineup: { ...criarResumoModoBase(), phase: null, resolved: 0, total: 3, errors: 0, exactScore: null },
            complete: false,
            completionCelebrated: false
        };
    }

    function normalizarResumoClassico(estado) {
        if (!estado || typeof estado !== "object" || !dataCivilValida(estado.data)) return null;
        const completed = estado.status === "won";
        return {
            started: true, completed, outcome: completed ? "won" : null,
            attempts: Array.isArray(estado.tentativas) ? estado.tentativas.length : 0
        };
    }

    function normalizarResumoFoto(estado) {
        if (!estado || typeof estado !== "object" || !dataCivilValida(estado.data)) return null;
        const completed = estado.status === "won" || estado.status === "lost";
        return {
            started: true, completed, outcome: completed ? estado.status : null,
            attempts: Array.isArray(estado.tentativas) ? estado.tentativas.length : 0
        };
    }

    function normalizarResumoMaisMenos(estado) {
        if (!estado || typeof estado !== "object" || !dataCivilValida(estado.data)) return null;
        const rounds = quantidadeSegura(estado.rodadaAtual, 10);
        const completed = rounds >= 10 && (estado.status === "won" || estado.status === "lost");
        return {
            started: true, completed, outcome: completed ? estado.status : null,
            hits: quantidadeSegura(estado.acertos, 10), rounds
        };
    }

    function normalizarResumoOnzeInicial(estado) {
        if (!estado || typeof estado !== "object" || !dataCivilValida(estado.data)) return null;
        const completed = estado.concluido === true && estado.etapa === "concluido";
        return {
            started: true, completed, outcome: completed ? "won" : null,
            phase: completed ? "completed" : (estado.etapa === "placar" ? "score" : "lineup"),
            resolved: Math.min(3, new Set(Array.isArray(estado.nomesResolvidos) ? estado.nomesResolvidos : []).size),
            total: 3, errors: quantidadeSegura(estado.errosEscalacao),
            exactScore: typeof estado.exactScore === "boolean" ? estado.exactScore : null
        };
    }

    function calcularProgressoDoResumo(dia) {
        const modos = [dia.classic, dia.photo, dia.moreLess, dia.lineup];
        const started = modos.filter(modo => modo?.started === true).length;
        const completed = modos.filter(modo => modo?.completed === true).length;
        return { started, completed, total: 4, progress: `${completed}/4`, complete: completed === 4 };
    }

    function obterProgressoHistorico(historico, data) {
        const dia = historico?.days?.[data] && typeof historico.days[data] === "object"
            ? historico.days[data]
            : criarResumoDiaVazio();
        return { data, ...calcularProgressoDoResumo(dia), modes: dia };
    }

    function obterResumoHistoricoDia(data, historico) {
        const hasRecord = dataCivilValida(data)
            && Object.prototype.hasOwnProperty.call(historico?.days || {}, data)
            && historico.days[data] && typeof historico.days[data] === "object"
            && !Array.isArray(historico.days[data]);
        const dia = hasRecord ? historico.days[data] : criarResumoDiaVazio();
        const quantidade = (valor, maximo) => Number.isFinite(valor)
            ? Math.min(maximo, Math.max(0, Math.trunc(valor))) : 0;
        const plural = (valor, singular, pluralTexto) => `${valor} ${valor === 1 ? singular : pluralTexto}`;

        const classicSource = dia.classic && typeof dia.classic === "object" ? dia.classic : {};
        const classicStarted = classicSource.started === true;
        const classicCompleted = classicStarted && classicSource.completed === true;
        const classicAttempts = quantidade(classicSource.attempts, 10000);
        const classic = {
            started: classicStarted, completed: classicCompleted, attempts: classicAttempts,
            statusText: !classicStarted ? "Não iniciado"
                : `${classicCompleted ? "Concluído" : "Em andamento"} · ${plural(classicAttempts, "tentativa", "tentativas")}`
        };

        const photoSource = dia.photo && typeof dia.photo === "object" ? dia.photo : {};
        const photoStarted = photoSource.started === true;
        const photoCompleted = photoStarted && photoSource.completed === true;
        const photoOutcome = photoCompleted && (photoSource.outcome === "won" || photoSource.outcome === "lost")
            ? photoSource.outcome : null;
        const photoAttempts = quantidade(photoSource.attempts, 6);
        const photo = {
            started: photoStarted, completed: photoCompleted, outcome: photoOutcome, attempts: photoAttempts,
            statusText: !photoStarted ? "Não iniciado" : photoCompleted
                ? `${photoOutcome === "lost" ? "Derrota" : "Vitória"} · ${photoAttempts}/6`
                : `Em andamento · ${photoAttempts}/6`
        };

        const mmSource = dia.moreLess && typeof dia.moreLess === "object" ? dia.moreLess : {};
        const mmStarted = mmSource.started === true;
        const mmCompleted = mmStarted && mmSource.completed === true;
        const mmOutcome = mmCompleted && (mmSource.outcome === "won" || mmSource.outcome === "lost")
            ? mmSource.outcome : null;
        const mmRounds = quantidade(mmSource.rounds, 10);
        const mmHits = quantidade(mmSource.hits, 10);
        const moreLess = {
            started: mmStarted, completed: mmCompleted, outcome: mmOutcome, hits: mmHits, rounds: mmRounds,
            statusText: !mmStarted ? "Não iniciado" : mmCompleted
                ? `${mmOutcome === "lost" ? "Derrota" : "Vitória"} · ${mmHits}/10`
                : `Em andamento · ${plural(mmRounds, "rodada", "rodadas")} · ${plural(mmHits, "acerto", "acertos")}`
        };

        const lineupSource = dia.lineup && typeof dia.lineup === "object" ? dia.lineup : {};
        const lineupStarted = lineupSource.started === true;
        const lineupCompleted = lineupStarted && lineupSource.completed === true;
        const lineupResolved = quantidade(lineupSource.resolved, 3);
        const lineupTotal = 3;
        const lineupErrors = quantidade(lineupSource.errors, 100000);
        const lineupPhase = lineupCompleted ? "completed"
            : lineupSource.phase === "score" ? "score" : lineupStarted ? "lineup" : null;
        const lineup = {
            started: lineupStarted, completed: lineupCompleted, phase: lineupPhase,
            resolved: lineupResolved, total: lineupTotal, errors: lineupErrors,
            exactScore: lineupSource.exactScore === true,
            statusText: !lineupStarted ? "Não iniciado" : lineupCompleted
                ? `Concluído · ${lineupResolved}/${lineupTotal} · ${plural(lineupErrors, "erro", "erros")}`
                : lineupPhase === "score" ? "Fase do placar" : `Escalação · ${lineupResolved}/${lineupTotal}`
        };

        const modos = [classic, photo, moreLess, lineup];
        const startedCount = modos.filter(modo => modo.started).length;
        const completedCount = modos.filter(modo => modo.completed).length;
        return {
            date: data, hasRecord: Boolean(hasRecord), startedCount, completedCount,
            complete: completedCount === 4, classic, photo, moreLess, lineup
        };
    }

    function obterSequenciaHistoricaDoDia(data, historico, hoje) {
        const semSequencia = { belongs: false, throughSelectedDate: 0, totalRun: 0, startDate: null, endDate: null };
        if (!dataCivilValida(data) || !dataCivilValida(hoje) || compararDatasCivis(data, hoje) > 0) return semSequencia;
        const trackingStartedAt = dataCivilValida(historico?.trackingStartedAt) ? historico.trackingStartedAt : data;
        const diaCompleto = dataConsultada => compararDatasCivis(dataConsultada, trackingStartedAt) >= 0
            && compararDatasCivis(dataConsultada, hoje) <= 0 && historico?.days?.[dataConsultada]?.complete === true;
        if (!diaCompleto(data)) return semSequencia;
        let startDate = data;
        let endDate = data;
        let throughSelectedDate = 1;
        let anterior = moverDataCivil(data, -1);
        while (anterior && diaCompleto(anterior)) {
            startDate = anterior;
            throughSelectedDate++;
            anterior = moverDataCivil(anterior, -1);
        }
        let totalRun = throughSelectedDate;
        let seguinte = moverDataCivil(data, 1);
        while (seguinte && diaCompleto(seguinte)) {
            endDate = seguinte;
            totalRun++;
            seguinte = moverDataCivil(seguinte, 1);
        }
        return { belongs: true, throughSelectedDate, totalRun, startDate, endDate };
    }

    function indiceDiaCivil(data) {
        if (!dataCivilValida(data)) return null;
        const [ano, mes, dia] = data.split("-").map(Number);
        return Math.trunc(Date.UTC(ano, mes - 1, dia) / 86400000);
    }

    function calcularStreakGeral(historico, dataReferencia) {
        const indiceReferencia = indiceDiaCivil(dataReferencia);
        const vazio = { current: 0, best: 0, totalCompleteDays: 0, lastCompleteDate: null };
        if (indiceReferencia === null) return vazio;
        const diasCompletos = Object.entries(historico?.days || {})
            .filter(([data, resumo]) => dataCivilValida(data) && resumo && typeof resumo === "object"
                && resumo.complete === true && indiceDiaCivil(data) <= indiceReferencia)
            .map(([data]) => ({ data, indice: indiceDiaCivil(data) }))
            .sort((a, b) => a.indice - b.indice);
        if (diasCompletos.length === 0) return vazio;
        let melhor = 1;
        let tamanhoSequencia = 1;
        for (let i = 1; i < diasCompletos.length; i++) {
            tamanhoSequencia = diasCompletos[i].indice - diasCompletos[i - 1].indice === 1
                ? tamanhoSequencia + 1 : 1;
            melhor = Math.max(melhor, tamanhoSequencia);
        }
        const ultimo = diasCompletos[diasCompletos.length - 1];
        return {
            current: indiceReferencia - ultimo.indice <= 1 ? tamanhoSequencia : 0,
            best: melhor, totalCompleteDays: diasCompletos.length, lastCompleteDate: ultimo.data
        };
    }

    function mediaHistorica(total, quantidade) {
        return quantidade > 0 ? Number((total / quantidade).toFixed(1)) : 0;
    }
    function percentualHistorico(parte, total) {
        if (total <= 0) return 0;
        return Number(Math.min(100, Math.max(0, (parte / total) * 100)).toFixed(1));
    }
    function numeroHistoricoValido(valor, minimo = 0, maximo = Number.MAX_SAFE_INTEGER) {
        return Number.isFinite(valor) && valor >= minimo && valor <= maximo;
    }

    function calcularEstatisticasIntegradas(historico, dataReferencia) {
        const streak = calcularStreakGeral(historico, dataReferencia);
        const indiceReferencia = indiceDiaCivil(dataReferencia);
        const distribuicaoClassic = { 1: 0, 2: 0, 3: 0, "4+": 0 };
        const distribuicaoFoto = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i + 1, 0]));
        const distribuicaoMaisMenos = Object.fromEntries(Array.from({ length: 11 }, (_, i) => [i, 0]));
        const resultado = {
            geral: { registeredDays: 0, playedDays: 0, completeDays: 0, completedModes: 0, wins: 0,
                completeDayRate: 0, currentStreak: streak.current, bestStreak: streak.best, lastCompleteDate: streak.lastCompleteDate },
            classic: { started: 0, completed: 0, wins: 0, completedAttempts: 0,
                averageAttemptsWins: 0, bestAttempts: 0, distribution: distribuicaoClassic },
            photo: { started: 0, completed: 0, wins: 0, losses: 0, winRate: 0,
                averageAttemptsCompleted: 0, averageAttemptsWins: 0, bestWin: 0, distribution: distribuicaoFoto },
            moreLess: { started: 0, completed: 0, wins: 0, losses: 0, winRate: 0,
                averageHits: 0, bestResult: 0, worstResult: 0, perfectResults: 0,
                sevenPlusResults: 0, distribution: distribuicaoMaisMenos },
            lineup: { started: 0, completed: 0, totalErrors: 0, averageErrors: 0,
                bestErrors: 0, zeroErrorCompletions: 0, exactScores: 0,
                exactScoreRate: 0, exactScoreEvaluated: 0, inconsistentCompletions: 0 }
        };
        if (indiceReferencia === null) return resultado;
        const dias = Object.entries(historico?.days || {}).filter(([data, dia]) =>
            dataCivilValida(data) && indiceDiaCivil(data) <= indiceReferencia
            && dia && typeof dia === "object" && !Array.isArray(dia));
        resultado.geral.registeredDays = dias.length;
        const tentativasClassicVitorias = [];
        const tentativasFotoConcluidas = [];
        const tentativasFotoVitorias = [];
        const resultadosMaisMenos = [];
        const errosLineup = [];
        dias.forEach(([, dia]) => {
            const modos = ["classic", "photo", "moreLess", "lineup"];
            if (modos.some(modo => dia[modo]?.started === true)) resultado.geral.playedDays++;
            if (dia.complete === true) resultado.geral.completeDays++;
            modos.forEach(modo => {
                const resumo = dia[modo];
                if (!resumo || typeof resumo !== "object" || Array.isArray(resumo)) return;
                if (resumo.started === true) resultado[modo].started++;
                if (resumo.completed !== true) return;
                resultado[modo].completed++;
                resultado.geral.completedModes++;
                if (resumo.outcome === "won" || modo === "classic" || modo === "lineup") resultado.geral.wins++;
                if (modo === "classic") {
                    resultado.classic.wins++;
                    if (numeroHistoricoValido(resumo.attempts, 1)) {
                        resultado.classic.completedAttempts += resumo.attempts;
                        tentativasClassicVitorias.push(resumo.attempts);
                        resultado.classic.distribution[resumo.attempts >= 4 ? "4+" : String(resumo.attempts)]++;
                    }
                } else if (modo === "photo") {
                    if (resumo.outcome === "won") resultado.photo.wins++;
                    if (resumo.outcome === "lost") resultado.photo.losses++;
                    if (numeroHistoricoValido(resumo.attempts, 1, 6)) {
                        tentativasFotoConcluidas.push(resumo.attempts);
                        resultado.photo.distribution[resumo.attempts]++;
                        if (resumo.outcome === "won") tentativasFotoVitorias.push(resumo.attempts);
                    }
                } else if (modo === "moreLess") {
                    if (resumo.outcome === "won") resultado.moreLess.wins++;
                    if (resumo.outcome === "lost") resultado.moreLess.losses++;
                    if (numeroHistoricoValido(resumo.hits, 0, 10)) {
                        resultadosMaisMenos.push(resumo.hits);
                        resultado.moreLess.distribution[resumo.hits]++;
                        if (resumo.hits === 10) resultado.moreLess.perfectResults++;
                        if (resumo.hits >= 7) resultado.moreLess.sevenPlusResults++;
                    }
                } else if (numeroHistoricoValido(resumo.errors, 0)) {
                    errosLineup.push(resumo.errors);
                    resultado.lineup.totalErrors += resumo.errors;
                    if (resumo.errors === 0) resultado.lineup.zeroErrorCompletions++;
                }
                if (modo === "lineup") {
                    if (typeof resumo.exactScore === "boolean") {
                        resultado.lineup.exactScoreEvaluated++;
                        if (resumo.exactScore) resultado.lineup.exactScores++;
                    }
                    if (numeroHistoricoValido(resumo.resolved, 0) && numeroHistoricoValido(resumo.total, 1)
                        && resumo.resolved !== resumo.total) resultado.lineup.inconsistentCompletions++;
                }
            });
        });
        resultado.geral.completeDayRate = percentualHistorico(resultado.geral.completeDays, resultado.geral.playedDays);
        resultado.classic.averageAttemptsWins = mediaHistorica(tentativasClassicVitorias.reduce((s, v) => s + v, 0), tentativasClassicVitorias.length);
        resultado.classic.bestAttempts = tentativasClassicVitorias.length ? Math.min(...tentativasClassicVitorias) : 0;
        resultado.photo.winRate = percentualHistorico(resultado.photo.wins, resultado.photo.completed);
        resultado.photo.averageAttemptsCompleted = mediaHistorica(tentativasFotoConcluidas.reduce((s, v) => s + v, 0), tentativasFotoConcluidas.length);
        resultado.photo.averageAttemptsWins = mediaHistorica(tentativasFotoVitorias.reduce((s, v) => s + v, 0), tentativasFotoVitorias.length);
        resultado.photo.bestWin = tentativasFotoVitorias.length ? Math.min(...tentativasFotoVitorias) : 0;
        resultado.moreLess.winRate = percentualHistorico(resultado.moreLess.wins, resultado.moreLess.completed);
        resultado.moreLess.averageHits = mediaHistorica(resultadosMaisMenos.reduce((s, v) => s + v, 0), resultadosMaisMenos.length);
        resultado.moreLess.bestResult = resultadosMaisMenos.length ? Math.max(...resultadosMaisMenos) : 0;
        resultado.moreLess.worstResult = resultadosMaisMenos.length ? Math.min(...resultadosMaisMenos) : 0;
        resultado.lineup.averageErrors = mediaHistorica(resultado.lineup.totalErrors, errosLineup.length);
        resultado.lineup.bestErrors = errosLineup.length ? Math.min(...errosLineup) : 0;
        resultado.lineup.exactScoreRate = percentualHistorico(resultado.lineup.exactScores, resultado.lineup.exactScoreEvaluated);
        return resultado;
    }

    return {
        quantidadeSegura, criarResumoModoBase, criarResumoDiaVazio,
        normalizarResumoClassico, normalizarResumoFoto, normalizarResumoMaisMenos,
        normalizarResumoOnzeInicial, calcularProgressoDoResumo, obterProgressoHistorico,
        obterResumoHistoricoDia, obterSequenciaHistoricaDoDia, indiceDiaCivil,
        calcularStreakGeral, mediaHistorica, percentualHistorico, numeroHistoricoValido,
        calcularEstatisticasIntegradas
    };
});
