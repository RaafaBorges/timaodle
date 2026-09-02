(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleLineupCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const MAX_OCULTOS_ESCALACAO = 3;

    function selecionarPartidaDoDia(partidas, dataStr, hashString, embaralharComSemente) {
        if (partidas.length === 0) return null;

        const hashPartida = hashString(dataStr + "-onze");
        const partida = partidas[hashPartida % partidas.length];
        const hashSlots = hashString(dataStr + "-onze-slots-" + partida.id);
        const indices = embaralharComSemente(
            partida.titulares.map((_, indice) => indice),
            hashSlots
        );
        const indicesOcultos = new Set(indices.slice(0, MAX_OCULTOS_ESCALACAO));
        const jogadores_visiveis = [];
        const jogadores_ocultos = [];

        partida.titulares.forEach((jogador, indice) => {
            if (indicesOcultos.has(indice)) {
                jogadores_ocultos.push({
                    slot_id: `slot-${indice}`,
                    posicao_abrev: jogador.posicao_abrev,
                    top: jogador.top,
                    left: jogador.left,
                    nome_correto: jogador.nome
                });
            } else {
                jogadores_visiveis.push({
                    nome: jogador.nome,
                    posicao_abrev: jogador.posicao_abrev,
                    top: jogador.top,
                    left: jogador.left
                });
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
            jogadores_ocultos
        };
    }

    function createLineupCore(configuracao) {
        const { getMatches, hashString, embaralharComSemente } = configuracao;
        return {
            selecionarPartidaDoDia: dataStr => selecionarPartidaDoDia(
                getMatches(), dataStr, hashString, embaralharComSemente
            )
        };
    }

    return {
        MAX_OCULTOS_ESCALACAO,
        selecionarPartidaDoDia,
        createLineupCore
    };
});
