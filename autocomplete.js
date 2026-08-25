(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleAutocomplete = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function normalizarTextoBusca(valor) {
        return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function filtrarSugestoes(items, busca, configuracao = {}) {
        const termo = normalizarTextoBusca(String(busca).trim());
        if (!termo) return [];
        const getLabel = configuracao.getLabel || (item => String(item));
        const incluir = configuracao.incluir || (() => true);
        const filtrados = items.filter(item =>
            normalizarTextoBusca(getLabel(item)).includes(termo) && incluir(item)
        );
        return Number.isFinite(configuracao.limite)
            ? filtrados.slice(0, configuracao.limite)
            : filtrados;
    }

    function prepararOpcao(item, prefixo, indice) {
        item.id = `${prefixo}-option-${indice}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", "false");
    }

    function sincronizarAria(input, items, indiceAtivo) {
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

    function criarAutocomplete(configuracao) {
        const {
            documentApi, input, listbox, prefixo, obterSugestoes,
            getLabel, renderizarOpcao, onSelect, estaAtivo = () => true,
            rolarOpcaoAtiva = false
        } = configuracao;
        let indiceAtivo = -1;
        let sugestoesAtuais = [];

        function fechar() {
            listbox.innerHTML = "";
            indiceAtivo = -1;
            sugestoesAtuais = [];
            sincronizarAria(input, [], indiceAtivo);
        }

        function atualizarDestaque(items) {
            sincronizarAria(input, items, indiceAtivo);
            if (rolarOpcaoAtiva && indiceAtivo >= 0) {
                items[indiceAtivo].scrollIntoView({ block: "nearest" });
            }
        }

        function selecionar(item) {
            onSelect(item);
        }

        function aoDigitar() {
            if (!estaAtivo()) return;
            const busca = normalizarTextoBusca(input.value.trim());
            fechar();
            if (!busca) return;
            sugestoesAtuais = obterSugestoes(busca);
            sugestoesAtuais.forEach((item, indice) => {
                const opcao = documentApi.createElement("div");
                prepararOpcao(opcao, prefixo, indice);
                renderizarOpcao(opcao, item);
                opcao.dataset.nome = getLabel(item);
                opcao.addEventListener("click", () => selecionar(item));
                listbox.appendChild(opcao);
            });
            sincronizarAria(input, listbox.children, indiceAtivo);
        }

        function aoPressionarTecla(event) {
            if (!estaAtivo()) return;
            const items = listbox.getElementsByTagName("div");
            if (items.length === 0) return;
            if (event.key === "ArrowDown") {
                event.preventDefault();
                indiceAtivo = (indiceAtivo + 1) % items.length;
                atualizarDestaque(items);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                indiceAtivo = (indiceAtivo - 1 + items.length) % items.length;
                atualizarDestaque(items);
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (indiceAtivo < 0) return;
                const selecionado = sugestoesAtuais[indiceAtivo];
                if (selecionado) selecionar(selecionado);
            } else if (event.key === "Escape") {
                fechar();
            }
        }

        function aoClicarNoDocumento(event) {
            if (event.target !== input) fechar();
        }

        input.addEventListener("input", aoDigitar);
        input.addEventListener("keydown", aoPressionarTecla);
        documentApi.addEventListener("click", aoClicarNoDocumento);

        return {
            fechar,
            obterIndiceAtivo: () => indiceAtivo,
            remover() {
                input.removeEventListener("input", aoDigitar);
                input.removeEventListener("keydown", aoPressionarTecla);
                documentApi.removeEventListener("click", aoClicarNoDocumento);
                fechar();
            }
        };
    }

    return {
        normalizarTextoBusca,
        filtrarSugestoes,
        prepararOpcao,
        sincronizarAria,
        criarAutocomplete
    };
});
