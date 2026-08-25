(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleClassic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function selecionarJogadorDiario(jogadores, data, hashString) {
        return jogadores[hashString(data) % jogadores.length];
    }

    function atributoAusente(valor) {
        return valor === null
            || valor === undefined
            || (typeof valor === "string" && valor.trim() === "");
    }

    function formatarAtributo(valor) {
        return atributoAusente(valor) ? "—" : String(valor);
    }

    function compararTexto(palpite, correto) {
        const palpiteAusente = atributoAusente(palpite);
        const corretoAusente = atributoAusente(correto);
        const classe = (palpiteAusente && corretoAusente) || palpite === correto ? "correct" : "wrong";
        return { classe, texto: formatarAtributo(palpite) };
    }

    function compararNumero(palpite, correto) {
        const palpiteAusente = atributoAusente(palpite);
        const corretoAusente = atributoAusente(correto);
        if (palpiteAusente || corretoAusente) {
            return {
                classe: palpiteAusente && corretoAusente ? "correct" : "wrong",
                texto: formatarAtributo(palpite)
            };
        }
        if (palpite === correto) return { classe: "correct", texto: formatarAtributo(palpite) };
        if (palpite < correto) return { classe: "wrong", texto: `${palpite} ↑` };
        return { classe: "wrong", texto: `${palpite} ↓` };
    }

    function extrairNomesTitulos(textoTitulos) {
        if (!textoTitulos) return [];
        return textoTitulos
            .split(",")
            .map(item => item.replace(/\d+x\s*/gi, "").trim().toLowerCase())
            .filter(item => item.length > 0);
    }

    function compararTitulos(palpiteTitulos, corretoTitulos) {
        const palpiteAusente = atributoAusente(palpiteTitulos);
        const corretoAusente = atributoAusente(corretoTitulos);
        if (palpiteAusente || corretoAusente) {
            return {
                classe: palpiteAusente && corretoAusente ? "correct" : "wrong",
                texto: formatarAtributo(palpiteTitulos)
            };
        }
        if (palpiteTitulos === corretoTitulos) {
            return { classe: "correct", texto: formatarAtributo(palpiteTitulos) };
        }
        const nomesPalpite = extrairNomesTitulos(palpiteTitulos);
        const nomesCorreto = extrairNomesTitulos(corretoTitulos);
        const temCoincidencia = nomesPalpite.some(titulo => nomesCorreto.includes(titulo));
        if (temCoincidencia) return { classe: "partial", texto: formatarAtributo(palpiteTitulos) };
        return { classe: "wrong", texto: formatarAtributo(palpiteTitulos) };
    }

    function criarComparacoes(palpite, correto) {
        return [
            { classe: palpite.nome === correto.nome ? "correct" : "wrong", texto: palpite.nome },
            compararTexto(palpite.posicao, correto.posicao),
            compararTexto(palpite.nacionalidade, correto.nacionalidade),
            compararNumero(palpite.estreia, correto.estreia),
            compararTexto(palpite.pe, correto.pe),
            compararTitulos(palpite.titulos, correto.titulos),
            compararNumero(palpite.gols, correto.gols),
            compararNumero(palpite.assistencias, correto.assistencias)
        ];
    }

    function criarGridEmojis(tentativas, jogadores, jogadorSecreto) {
        const emojiPorClasse = { correct: "🟩", partial: "🟨", wrong: "🟥" };
        return tentativas.map(nomeTentativa => {
            const palpite = jogadores.find(jogador => jogador.nome === nomeTentativa);
            if (!palpite) return "";
            return criarComparacoes(palpite, jogadorSecreto)
                .map(comparacao => emojiPorClasse[comparacao.classe])
                .join("");
        }).join("\n");
    }

    function createClassicMode(configuracao) {
        const {
            documentApi,
            elements,
            getPlayers,
            getDate,
            hashString,
            autocomplete,
            storage,
            sharing,
            getChallengeNumber,
            officialUrl,
            onWin,
            onComplete,
            celebrate,
            alertApi,
            schedule = (callback, delay) => setTimeout(callback, delay)
        } = configuracao;

        let jogadorSecreto = null;
        let estado = null;
        let ativo = true;

        function jogadoresAtuais() {
            return getPlayers();
        }

        function getPlayerForDate(data) {
            const jogadores = jogadoresAtuais();
            if (jogadores.length === 0) return null;
            return selecionarJogadorDiario(jogadores, data, hashString);
        }

        function fecharAutocomplete() {
            autocompleteClassico.fechar();
        }

        function renderizarTentativa(palpite, options = {}) {
            const instantaneo = options.instantaneo === true;
            const row = documentApi.createElement("div");
            row.className = "attempt-row";
            const colunas = criarComparacoes(palpite, jogadorSecreto);

            colunas.forEach((coluna, index) => {
                const cell = documentApi.createElement("div");
                cell.className = "cell";
                cell.title = coluna.texto;
                const cellText = documentApi.createElement("span");
                cellText.className = "cell-text";
                cellText.innerText = coluna.texto;
                cell.appendChild(cellText);
                if (instantaneo) {
                    cell.classList.add("reveal", coluna.classe);
                } else {
                    schedule(() => {
                        cell.classList.add("reveal");
                        schedule(() => cell.classList.add(coluna.classe), 300);
                    }, index * 200);
                }
                row.appendChild(cell);
            });

            elements.attemptsContainer.insertBefore(row, elements.attemptsContainer.firstChild);
            if (!instantaneo && elements.pageContent) elements.pageContent.scrollTop = 0;
            return {
                row,
                ehAcerto: palpite.nome === jogadorSecreto.nome,
                totalColunas: colunas.length
            };
        }

        function mostrarFimDeJogo(comAnimacao) {
            ativo = false;
            fecharAutocomplete();
            elements.endMessage.classList.remove("hidden");
            elements.endMessage.innerHTML = `✓ Você acertou! O jogador de hoje era <strong>${jogadorSecreto.nome}</strong>. Volte amanhã para um novo desafio.`;
            elements.shareButton.classList.remove("hidden");
            if (comAnimacao) {
                celebrate();
                onComplete();
            }
        }

        function fazerPalpite(palpite) {
            if (!ativo) return;
            const { row, ehAcerto, totalColunas } = renderizarTentativa(palpite, { instantaneo: false });
            estado.tentativas.push(palpite.nome);
            storage.save(estado);
            const tempoTotalAnimacao = (totalColunas * 200) + 400;
            schedule(() => {
                if (ehAcerto) {
                    estado.status = "won";
                    storage.save(estado);
                    onWin();
                    schedule(() => mostrarFimDeJogo(true), 400);
                } else {
                    row.classList.add("shake");
                }
            }, tempoTotalAnimacao);
        }

        const autocompleteClassico = autocomplete.create({
            documentApi,
            input: elements.searchInput,
            listbox: elements.autocompleteList,
            prefixo: "classic",
            getLabel: jogador => jogador.nome,
            estaAtivo: () => ativo,
            rolarOpcaoAtiva: true,
            obterSugestoes: busca => autocomplete.filter(jogadoresAtuais(), busca, {
                getLabel: jogador => jogador.nome,
                incluir: jogador => !(estado?.tentativas || []).includes(jogador.nome)
            }),
            renderizarOpcao: (item, jogador) => {
                item.innerText = jogador.nome;
            },
            onSelect: jogador => {
                fazerPalpite(jogador);
                elements.searchInput.value = "";
                fecharAutocomplete();
            }
        });

        function start() {
            const jogadores = jogadoresAtuais();
            if (jogadores.length === 0) return;
            const hoje = getDate();
            jogadorSecreto = getPlayerForDate(hoje);
            const salvo = storage.load();

            if (salvo && salvo.data === hoje) {
                estado = salvo;
                elements.attemptsContainer.innerHTML = "";
                (estado.tentativas || []).forEach(nomeTentativa => {
                    const jogadorTentativa = jogadores.find(jogador => jogador.nome === nomeTentativa);
                    if (jogadorTentativa) renderizarTentativa(jogadorTentativa, { instantaneo: true });
                });
                if (elements.pageContent) elements.pageContent.scrollTop = 0;
                ativo = estado.status === "playing";
                if (estado.status === "won") mostrarFimDeJogo(false);
            } else {
                estado = { data: hoje, tentativas: [], status: "playing" };
                storage.save(estado);
                elements.attemptsContainer.innerHTML = "";
                ativo = true;
                elements.endMessage.classList.add("hidden");
                elements.shareButton.classList.add("hidden");
                elements.searchInput.disabled = false;
            }
            elements.searchInput.value = "";
            fecharAutocomplete();
        }

        function gerarTextoCompartilhamento() {
            const numero = getChallengeNumber(getDate());
            const tentativas = estado.tentativas.length;
            const grid = criarGridEmojis(estado.tentativas, jogadoresAtuais(), jogadorSecreto);
            return sharing.build({ numero, tentativas, grid, url: officialUrl });
        }

        async function compartilharResultado() {
            const texto = gerarTextoCompartilhamento();
            const resultado = await sharing.share(texto, { copiarAoCancelar: true });
            if (resultado.status === "shared") return;
            if (resultado.status === "copied") {
                const textoOriginal = elements.shareButton.innerText;
                elements.shareButton.innerText = "Copiado! ✓";
                schedule(() => { elements.shareButton.innerText = textoOriginal; }, 2000);
                return;
            }
            alertApi(texto);
        }

        elements.shareButton.addEventListener("click", compartilharResultado);

        return {
            start,
            getState: () => estado,
            getSecretPlayer: () => jogadorSecreto,
            getPlayerForDate,
            compartilharResultado
        };
    }

    return {
        selecionarJogadorDiario,
        atributoAusente,
        formatarAtributo,
        compararTexto,
        compararNumero,
        extrairNomesTitulos,
        compararTitulos,
        criarComparacoes,
        criarGridEmojis,
        createClassicMode
    };
});
