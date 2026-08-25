(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleUI = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const SELETOR_FOCAVEIS = 'button:not([disabled]):not([tabindex="-1"]), summary:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

    function criarInfraestruturaDialogs(documentApi = globalThis.document) {
        const focoAnteriorPorDialog = new WeakMap();

        function elementosFocaveisDoDialog(dialog) {
            if (!dialog) return [];
            return Array.from(dialog.querySelectorAll(SELETOR_FOCAVEIS))
                .filter(elemento => elemento.getClientRects().length > 0);
        }

        function abrirDialog(dialog, origem, focoInicial) {
            if (!dialog) return;
            focoAnteriorPorDialog.set(dialog, origem || documentApi.activeElement);
            dialog.classList.remove("hidden");
            documentApi.body.classList.add("modal-open");
            (focoInicial || elementosFocaveisDoDialog(dialog)[0] || dialog).focus();
        }

        function fecharDialog(dialog, focoAlternativo) {
            if (!dialog) return;
            dialog.classList.add("hidden");
            if (!documentApi.querySelector(".modal:not(.hidden)")) {
                documentApi.body.classList.remove("modal-open");
            }
            const origem = focoAnteriorPorDialog.get(dialog) || focoAlternativo;
            focoAnteriorPorDialog.delete(dialog);
            if (origem && !origem.closest?.(".hidden")) origem.focus();
            else focoAlternativo?.focus();
        }

        function prenderFocoNoDialog(event, dialog) {
            if (event.key !== "Tab" || !dialog || dialog.classList.contains("hidden")) return;
            const focaveis = elementosFocaveisDoDialog(dialog);
            if (focaveis.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }
            const primeiro = focaveis[0];
            const ultimo = focaveis[focaveis.length - 1];
            if (event.shiftKey && documentApi.activeElement === primeiro) {
                event.preventDefault();
                ultimo.focus();
            } else if (!event.shiftKey && documentApi.activeElement === ultimo) {
                event.preventDefault();
                primeiro.focus();
            }
        }

        function registrarDialogs(configuracoes) {
            const validas = configuracoes.filter(config => config?.dialog && typeof config.onClose === "function");
            const listenersBackdrop = [];
            validas.forEach(config => {
                if (config.fecharNoBackdrop !== true) return;
                const listener = event => {
                    if (event.target === config.dialog) config.onClose();
                };
                config.dialog.addEventListener("click", listener);
                listenersBackdrop.push([config.dialog, listener]);
            });

            const listenerTeclado = event => {
                const ativa = validas.find(config => !config.dialog.classList.contains("hidden"));
                if (!ativa) return;
                if (event.key === "Escape") {
                    ativa.onClose();
                    return;
                }
                prenderFocoNoDialog(event, ativa.dialog);
            };
            documentApi.addEventListener("keydown", listenerTeclado);

            return function removerRegistro() {
                listenersBackdrop.forEach(([dialog, listener]) => dialog.removeEventListener("click", listener));
                documentApi.removeEventListener("keydown", listenerTeclado);
            };
        }

        return {
            elementosFocaveisDoDialog,
            abrirDialog,
            fecharDialog,
            prenderFocoNoDialog,
            registrarDialogs
        };
    }

    return { criarInfraestruturaDialogs };
});
