(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleStorage = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const isObject = valor => valor !== null && typeof valor === "object" && !Array.isArray(valor);

    function parseJson(texto) {
        if (typeof texto !== "string") return null;
        try {
            return JSON.parse(texto);
        } catch {
            return null;
        }
    }

    function validDate(data) {
        if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
        const [ano, mes, dia] = data.split("-").map(Number);
        const conferida = new Date(Date.UTC(ano, mes - 1, dia));
        return conferida.getUTCFullYear() === ano
            && conferida.getUTCMonth() === mes - 1
            && conferida.getUTCDate() === dia;
    }

    function intInRange(valor, minimo, maximo, padrao = minimo) {
        return Number.isFinite(valor)
            ? Math.min(maximo, Math.max(minimo, Math.trunc(valor)))
            : padrao;
    }

    function stringSet(valores) {
        if (valores instanceof Set) return valores;
        return Array.isArray(valores) ? new Set(valores) : null;
    }

    function nameList(valor, permitidos = null, maximo = Number.MAX_SAFE_INTEGER) {
        if (!Array.isArray(valor)) return [];
        const conhecidos = stringSet(permitidos);
        const resultado = [];
        const usados = new Set();
        for (const nome of valor) {
            if (typeof nome !== "string" || !nome.trim() || usados.has(nome)) continue;
            if (conhecidos && !conhecidos.has(nome)) continue;
            usados.add(nome);
            resultado.push(nome);
            if (resultado.length >= maximo) break;
        }
        return resultado;
    }

    function normalizeLegacyStats(valor) {
        const base = { jogos: 0, vitorias: 0, streak: 0, maxStreak: 0 };
        if (!isObject(valor)) return base;
        const jogos = intInRange(valor.jogos, 0, 1000000);
        const vitorias = intInRange(valor.vitorias, 0, jogos);
        const streak = intInRange(valor.streak, 0, jogos);
        const maxStreak = Math.max(streak, intInRange(valor.maxStreak, 0, jogos));
        return { jogos, vitorias, streak, maxStreak };
    }

    function normalizeClassic(valor, opcoes = {}) {
        if (!isObject(valor) || !validDate(valor.data)) return null;
        const tentativas = nameList(valor.tentativas, opcoes.playerNames);
        const venceuComEstrutura = valor.status === "won" && tentativas.length > 0
            && (!opcoes.secretName || tentativas.includes(opcoes.secretName));
        return { data: valor.data, tentativas, status: venceuComEstrutura ? "won" : "playing" };
    }

    function normalizePhoto(valor, opcoes = {}) {
        if (!isObject(valor) || !validDate(valor.data)) return null;
        const pool = stringSet(opcoes.photoNames);
        const jogadorValido = typeof valor.jogadorNome === "string"
            && valor.jogadorNome.trim() && (!pool || pool.has(valor.jogadorNome));
        if (!jogadorValido) {
            return { data: valor.data, jogadorNome: null, tentativas: [], status: "playing" };
        }

        const tentativas = nameList(valor.tentativas, opcoes.playerNames, 6);
        const venceu = valor.status === "won" && tentativas.includes(valor.jogadorNome);
        const perdeu = valor.status === "lost" && tentativas.length >= 6 && !tentativas.includes(valor.jogadorNome);
        return {
            data: valor.data,
            jogadorNome: valor.jogadorNome,
            tentativas,
            status: venceu ? "won" : perdeu ? "lost" : "playing"
        };
    }

    function validSnapshotList(valor) {
        if (!Array.isArray(valor) || valor.length !== 11) return null;
        const nomes = new Set();
        const resultado = [];
        for (const jogador of valor) {
            if (!isObject(jogador) || typeof jogador.nome !== "string" || !jogador.nome.trim()
                || nomes.has(jogador.nome) || !Number.isFinite(jogador.jogos)) return null;
            nomes.add(jogador.nome);
            resultado.push({ ...jogador, jogos: Number(jogador.jogos) });
        }
        return resultado;
    }

    function normalizeMoreLess(valor) {
        if (!isObject(valor) || !validDate(valor.data)) return null;
        const versaoAlgoritmo = valor.versaoAlgoritmo === 2 ? 2 : 1;
        let sequenciaJogadores = validSnapshotList(valor.sequenciaJogadores);
        let sequenciaNomes = nameList(valor.sequenciaNomes, null, 11);
        if (sequenciaNomes.length !== 11) sequenciaNomes = [];
        if (!sequenciaJogadores && sequenciaNomes.length === 0) sequenciaJogadores = null;
        if (sequenciaJogadores && sequenciaNomes.length === 0) {
            sequenciaNomes = sequenciaJogadores.map(jogador => jogador.nome);
        }

        const nomesDaSequencia = new Set(sequenciaNomes);
        const rodadaAtual = intInRange(valor.rodadaAtual, 0, 10);
        const acertos = intInRange(valor.acertos, 0, rodadaAtual);
        const historico = Array.isArray(valor.historico)
            ? valor.historico.slice(0, rodadaAtual).filter(item => isObject(item)
                && typeof item.candidato === "string" && typeof item.correto === "boolean"
                && (nomesDaSequencia.size === 0 || nomesDaSequencia.has(item.candidato)))
                .map(item => ({ candidato: item.candidato, correto: item.correto }))
            : [];
        const finalizado = rodadaAtual === 10;
        const status = finalizado ? (acertos >= 7 ? "won" : "lost") : "playing";
        const referenciaAtualNome = sequenciaNomes[rodadaAtual]
            || (typeof valor.referenciaAtualNome === "string" ? valor.referenciaAtualNome : null);
        const normalizado = {
            data: valor.data,
            versaoAlgoritmo,
            rodadaAtual,
            acertos,
            referenciaAtualNome,
            historico,
            status
        };
        if (sequenciaNomes.length === 11) normalizado.sequenciaNomes = sequenciaNomes;
        if (sequenciaJogadores) normalizado.sequenciaJogadores = sequenciaJogadores;
        if (Array.isArray(valor.planoDificuldades) && valor.planoDificuldades.length === 10
            && valor.planoDificuldades.every(item => ["facil", "media", "dificil"].includes(item))) {
            normalizado.planoDificuldades = [...valor.planoDificuldades];
        }
        if (Array.isArray(valor.planoDirecoes) && valor.planoDirecoes.length === 10
            && valor.planoDirecoes.every(item => item === "mais" || item === "menos")) {
            normalizado.planoDirecoes = [...valor.planoDirecoes];
        }
        return normalizado;
    }

    function normalizeLineup(valor, opcoes = {}) {
        if (!isObject(valor) || !validDate(valor.data)) return null;
        const ids = stringSet(opcoes.matchIds);
        const partidaId = valor.partidaId === null || valor.partidaId === undefined
            ? null
            : typeof valor.partidaId === "string" && (!ids || ids.has(valor.partidaId))
                ? valor.partidaId
                : undefined;
        if (partidaId === undefined) return null;

        const ocultos = stringSet(opcoes.hiddenNames);
        const resolvidos = nameList(valor.nomesResolvidos, ocultos, 3);
        const fora = nameList(valor.nomesForaDaLista, opcoes.playerNames, 1000);
        const errosEscalacao = intInRange(valor.errosEscalacao, 0, 100000);
        const placarM = Number.isInteger(valor.palpiteMandante) && valor.palpiteMandante >= 0 && valor.palpiteMandante <= 20
            ? valor.palpiteMandante : null;
        const placarV = Number.isInteger(valor.palpiteVisitante) && valor.palpiteVisitante >= 0 && valor.palpiteVisitante <= 20
            ? valor.palpiteVisitante : null;
        const temPlacar = placarM !== null && placarV !== null;
        const total = ocultos ? Math.min(3, ocultos.size) : 3;
        const concluido = valor.concluido === true && temPlacar && resolvidos.length === total;
        const etapa = !temPlacar ? "placar" : concluido ? "concluido" : "escalacao";
        let exactScore = typeof valor.exactScore === "boolean" ? valor.exactScore : null;
        if (temPlacar && isObject(opcoes.realScore)
            && Number.isFinite(opcoes.realScore.mandante) && Number.isFinite(opcoes.realScore.visitante)) {
            exactScore = placarM === opcoes.realScore.mandante && placarV === opcoes.realScore.visitante;
        }
        return {
            data: valor.data,
            partidaId,
            etapa,
            palpiteMandante: placarM,
            palpiteVisitante: placarV,
            nomesResolvidos: resolvidos,
            nomesForaDaLista: fora,
            errosEscalacao,
            exactScore,
            concluido
        };
    }

    function normalizeHistoryMode(tipo, valor) {
        const base = { started: false, completed: false, outcome: null };
        if (!isObject(valor)) {
            if (tipo === "classic" || tipo === "photo") return { ...base, attempts: 0 };
            if (tipo === "moreLess") return { ...base, hits: 0, rounds: 0 };
            return { ...base, phase: null, resolved: 0, total: 3, errors: 0, exactScore: null };
        }

        const started = valor.started === true;
        if (tipo === "classic") {
            const attempts = intInRange(valor.attempts, 0, 10000);
            const completed = started && valor.completed === true && attempts >= 1;
            return { started, completed, outcome: completed ? "won" : null, attempts };
        }
        if (tipo === "photo") {
            const attempts = intInRange(valor.attempts, 0, 6);
            const outcome = valor.outcome === "won" || valor.outcome === "lost" ? valor.outcome : null;
            const completed = started && valor.completed === true && outcome !== null && attempts >= 1;
            return { started, completed, outcome: completed ? outcome : null, attempts };
        }
        if (tipo === "moreLess") {
            const rounds = intInRange(valor.rounds, 0, 10);
            const hits = intInRange(valor.hits, 0, rounds);
            const completed = started && valor.completed === true && rounds === 10;
            const outcome = completed ? (hits >= 7 ? "won" : "lost") : null;
            return { started, completed, outcome, hits, rounds };
        }

        const resolved = intInRange(valor.resolved, 0, 3);
        const errors = intInRange(valor.errors, 0, 100000);
        const completed = started && valor.completed === true && resolved === 3;
        const phase = completed ? "completed"
            : valor.phase === "score" ? "score"
                : started ? "lineup" : null;
        return {
            started, completed, outcome: completed ? "won" : null, phase,
            resolved, total: 3, errors,
            exactScore: typeof valor.exactScore === "boolean" ? valor.exactScore : null
        };
    }

    function normalizeHistory(valor, version = 1) {
        if (!isObject(valor) || valor.version !== version || !isObject(valor.days)) {
            return { version, days: {} };
        }
        const days = {};
        for (const [data, dia] of Object.entries(valor.days)) {
            if (!validDate(data) || !isObject(dia)) continue;
            const classic = normalizeHistoryMode("classic", dia.classic);
            const photo = normalizeHistoryMode("photo", dia.photo);
            const moreLess = normalizeHistoryMode("moreLess", dia.moreLess);
            const lineup = normalizeHistoryMode("lineup", dia.lineup);
            const complete = classic.completed && photo.completed && moreLess.completed && lineup.completed;
            days[data] = {
                classic, photo, moreLess, lineup, complete,
                completionCelebrated: complete && dia.completionCelebrated === true
            };
        }
        return { version, days };
    }

    return {
        isObject, parseJson, validDate, intInRange, nameList,
        normalizeLegacyStats, normalizeClassic, normalizePhoto,
        normalizeMoreLess, normalizeLineup, normalizeHistory, normalizeHistoryMode
    };
});
