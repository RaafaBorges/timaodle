(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodlePhotoCatalog = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const PASTA_FOTOS_PADRAO = "fotos/";

    function slugify(nome) {
        return nome
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    function validarManifestoFotos(jogadores, manifesto) {
        if (!Array.isArray(manifesto)) throw new Error("O manifesto de fotos precisa ser um array.");

        const nomesCadastrados = new Set(jogadores.map(jogador => jogador.nome));
        return [...new Set(
            manifesto
                .filter(entrada => typeof entrada === "string")
                .map(entrada => entrada.trim())
                .filter(nome => nome && nomesCadastrados.has(nome))
        )];
    }

    function selecionarJogadorFotoDoDia(pool, dataStr, hashString) {
        if (pool.length === 0) return null;
        return pool[hashString(dataStr + "-foto") % pool.length];
    }

    function calcularDificuldadeFoto(estreia) {
        if (estreia <= 1975) return { label: "Difícil", classe: "dificil" };
        if (estreia <= 1989) return { label: "Médio", classe: "medio" };
        return { label: "Fácil", classe: "facil" };
    }

    function createPhotoCatalog(configuracao) {
        const {
            jogadores,
            manifesto,
            hashString,
            pastaFotos = PASTA_FOTOS_PADRAO
        } = configuracao;
        const nomesComFoto = validarManifestoFotos(jogadores, manifesto);
        const nomesComFotoSet = new Set(nomesComFoto);
        const pool = jogadores.filter(jogador => nomesComFotoSet.has(jogador.nome));

        function caminhoFoto(nome) {
            return `${pastaFotos}${slugify(nome)}.jpg`;
        }

        function temFoto(nome) {
            return nomesComFotoSet.has(nome);
        }

        function fotoDoJogador(nome) {
            return temFoto(nome) ? caminhoFoto(nome) : "";
        }

        function jogadorDoDia(dataStr) {
            return selecionarJogadorFotoDoDia(pool, dataStr, hashString);
        }

        function jogadorDoEstado(estado, dataStr) {
            const jogadorSalvo = estado?.data === dataStr && typeof estado.jogadorNome === "string"
                ? jogadores.find(jogador => jogador.nome === estado.jogadorNome)
                : null;
            return jogadorSalvo || jogadorDoDia(dataStr);
        }

        return {
            nomes: () => [...nomesComFoto],
            jogadores: () => [...pool],
            temFoto,
            caminhoFoto,
            fotoDoJogador,
            jogadorDoDia,
            jogadorDoEstado,
            dificuldade: jogador => calcularDificuldadeFoto(jogador.estreia)
        };
    }

    return {
        PASTA_FOTOS_PADRAO,
        slugify,
        validarManifestoFotos,
        selecionarJogadorFotoDoDia,
        calcularDificuldadeFoto,
        createPhotoCatalog
    };
});
