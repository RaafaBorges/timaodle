(function (root, factory) {
    const core = typeof module === "object" && module.exports ? require("./core.js") : root?.TimaodleCore;
    const api = factory(core);
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleSharing = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (core) {
    "use strict";

    const { dataCivilValida } = core;

    function pluralizarQuantidade(valor, singular, plural) {
        return `${valor} ${valor === 1 ? singular : plural}`;
    }

    function formatarDataCompartilhamento(data) {
        if (!dataCivilValida(data)) return "";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function complementoResultadoCompartilhamento(modo) {
        if (modo?.outcome === "won") return " · vitória";
        if (modo?.outcome === "lost") return " · derrota";
        return "";
    }

    function numeroValido(valor, minimo = 0, maximo = Number.MAX_SAFE_INTEGER) {
        return Number.isFinite(valor) && valor >= minimo && valor <= maximo;
    }

    function gerarTextoCompartilhamentoDiario({ data, progresso, streak, url }) {
        if (!progresso?.complete) return null;
        const { classic, photo, moreLess, lineup } = progresso.modes;
        const linhaClassic = numeroValido(classic?.attempts, 1)
            ? `✅ Clássico — ${pluralizarQuantidade(classic.attempts, "tentativa", "tentativas")}`
            : "✅ Clássico — concluído";
        const linhaFoto = numeroValido(photo?.attempts, 1, 6)
            ? `✅ Foto — ${photo.attempts}/6${complementoResultadoCompartilhamento(photo)}`
            : `✅ Foto — concluído${complementoResultadoCompartilhamento(photo)}`;
        const linhaMaisMenos = numeroValido(moreLess?.hits, 0, 10)
            ? `✅ Mais ou Menos — ${moreLess.hits}/10${complementoResultadoCompartilhamento(moreLess)}`
            : `✅ Mais ou Menos — concluído${complementoResultadoCompartilhamento(moreLess)}`;
        const linhaOnzeInicial = numeroValido(lineup?.errors, 0)
            ? `✅ Onze Inicial — 3/3 · ${pluralizarQuantidade(lineup.errors, "erro", "erros")}`
            : "✅ Onze Inicial — 3/3";
        const linhaStreak = streak?.current > 0
            ? `🔥 Sequência: ${pluralizarQuantidade(streak.current, "dia", "dias")}`
            : null;
        return [
            `TIMÃODLE — ${formatarDataCompartilhamento(data)} 🖤🤍`, "",
            linhaClassic, linhaFoto, linhaMaisMenos, linhaOnzeInicial, "", linhaStreak,
            "🏁 4/4 desafios concluídos", "", url
        ].filter(linha => linha !== null).join("\n");
    }

    function gerarTextoCompartilhamentoClassico({ numero, tentativas, grid, url }) {
        return `Timãodle #${numero} — ${tentativas}/∞ 🖤\n\n${grid}\n\n${url}`;
    }

    function gerarTextoCompartilhamentoFoto({ numero, tentativas, venceu, maxTentativas, url }) {
        const grade = Array.from({ length: maxTentativas }, (_, indice) =>
            indice < tentativas ? (venceu && indice === tentativas - 1 ? "🟨" : "⬛") : "▫️"
        ).join("");
        return `TIMÃODLE — FOTO #${numero}\n${venceu ? "GANHOU" : "PERDEU"} — ${tentativas}/${maxTentativas}\n\n${grade}\n\n${url}`;
    }

    function gerarTextoCompartilhamentoMM({ numero, venceu, acertos, rodadas, resultados, url }) {
        const grade = (resultados || []).map(rodada => rodada.correto ? "🟨" : "⬛").join("");
        return `TIMÃODLE — MAIS OU MENOS #${numero}\n${venceu ? "GANHOU" : "PERDEU"} — ${acertos}/${rodadas} ACERTOS\n\n${grade}\n\n${url}`;
    }

    function gerarTextoCompartilhamentoOnze({ mandante, visitante, placarReal, palpite, acertos, total, erros }) {
        const acertouPlacar = palpite.mandante === placarReal.mandante && palpite.visitante === placarReal.visitante;
        const indicadorPlacar = acertouPlacar ? "🟨" : "⬛";
        const jogadores = "🟨".repeat(acertos) + "⬛".repeat(Math.max(0, total - acertos));
        return [
            "TIMÃODLE — ONZE INICIAL ⚽",
            `${mandante} ${placarReal.mandante}–${placarReal.visitante} ${visitante}`,
            `${indicadorPlacar} Palpite: ${palpite.mandante}–${palpite.visitante}`,
            `${jogadores} Jogadores: ${acertos}/${total}`,
            `❌ Erros: ${erros}`,
            "Vai Corinthians! 🖤🤍"
        ].join("\n");
    }

    async function compartilharTexto(texto, opcoes = {}) {
        const navegador = opcoes.navigatorApi || (typeof navigator !== "undefined" ? navigator : {});
        let shareError = null;
        if (typeof navegador.share === "function") {
            try {
                await navegador.share({ text: texto });
                return { status: "shared", shareError: null, copyError: null };
            } catch (error) {
                shareError = error;
                if (error?.name === "AbortError" && opcoes.copiarAoCancelar !== true) {
                    return { status: "cancelled", shareError, copyError: null };
                }
            }
        }

        let copyError = null;
        if (typeof navegador.clipboard?.writeText === "function") {
            try {
                await navegador.clipboard.writeText(texto);
                return { status: "copied", shareError, copyError: null };
            } catch (error) {
                copyError = error;
            }
        }

        if (typeof opcoes.copiarFallback === "function") {
            try {
                if (await opcoes.copiarFallback(texto)) return { status: "copied", shareError, copyError };
            } catch (error) {
                copyError ||= error;
            }
        }
        return { status: "failed", shareError, copyError };
    }

    return {
        pluralizarQuantidade, formatarDataCompartilhamento, complementoResultadoCompartilhamento,
        gerarTextoCompartilhamentoDiario, gerarTextoCompartilhamentoClassico,
        gerarTextoCompartilhamentoFoto, gerarTextoCompartilhamentoMM,
        gerarTextoCompartilhamentoOnze, compartilharTexto
    };
});
