(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleMoreLessCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const CAMPO_STAT_MM = "jogos";
    const RODADAS_MM = 10;
    const PLANO_DIFICULDADES_MM = ["facil", "facil", "facil", "media", "media", "media", "media", "dificil", "dificil", "dificil"];

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
            const disponiveis = poolPriorizado.filter(jogador => !usados.has(jogador.nome));
            const direcao = planoDirecoes[rodada];
            const dificuldade = planoDificuldades[rodada];
            const grupos = [
                disponiveis.filter(jogador => direcaoComparacaoMM(referencia, jogador) === direcao && dificuldadeComparacaoMM(referencia, jogador) === dificuldade),
                disponiveis.filter(jogador => direcaoComparacaoMM(referencia, jogador) === direcao && atendeDificuldadeExpandidaMM(referencia, jogador, dificuldade)),
                disponiveis.filter(jogador => direcaoComparacaoMM(referencia, jogador) === direcao),
                disponiveis.filter(jogador => direcaoComparacaoMM(referencia, jogador) !== "empate"),
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

    function gerarDesafioMMV2(dataStr, pool, hashString) {
        if (pool.length < RODADAS_MM + 1) {
            return { sequencia: [], planoDificuldades: [], planoDirecoes: [], fallbacks: [] };
        }

        const rng = gerarPRNG(hashString(dataStr + "-mm-v2"));
        let ultimoPlanoDificuldades = [];
        let ultimoPlanoDirecoes = [];
        let ultimoPoolPriorizado = [];

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

    function gerarSequenciaMMV1(dataStr, pool, hashString) {
        if (pool.length < RODADAS_MM + 1) return [];
        return embaralharComSemente(pool, hashString(dataStr + "-mm")).slice(0, RODADAS_MM + 1);
    }

    function createMoreLessCore(configuracao) {
        const { getPool, hashString } = configuracao;
        return {
            gerarDesafioMMV2: dataStr => gerarDesafioMMV2(dataStr, getPool(), hashString),
            gerarSequenciaMMV1: dataStr => gerarSequenciaMMV1(dataStr, getPool(), hashString)
        };
    }

    return {
        gerarPRNG,
        embaralharComSemente,
        embaralharComRngMM,
        maiorSequenciaIgualMM,
        maiorSequenciaAlternadaMM,
        gerarPlanoDirecoesMM,
        direcaoComparacaoMM,
        dificuldadeComparacaoMM,
        atendeDificuldadeExpandidaMM,
        construirSequenciaExataMM,
        construirSequenciaComFallbackMM,
        gerarDesafioMMV2,
        gerarSequenciaMMV1,
        createMoreLessCore
    };
});
