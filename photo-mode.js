(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodlePhotoMode = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const MAX_TENTATIVAS_FOTO = 6;
    const NIVEIS_FOTO = [
        { blur: 9, gray: 100 },
        { blur: 7, gray: 80 },
        { blur: 5, gray: 60 },
        { blur: 3, gray: 40 },
        { blur: 1, gray: 20 },
        { blur: 0, gray: 0 }
    ];

    function obterNivelFoto(quantidadeTentativas) {
        return NIVEIS_FOTO[Math.min(quantidadeTentativas, NIVEIS_FOTO.length - 1)];
    }

    function createPhotoMode(configuracao) {
        const {
            documentApi,
            elements,
            getDate,
            getCatalog,
            autocomplete,
            storage,
            sharing,
            tutorial,
            navigation,
            setPlayerPhoto,
            onCelebrate,
            onComplete
        } = configuracao;

        let jogadorSecreto = null;
        let tentativas = [];
        let ativo = true;
        let pretoEBrancoAtivo = true;
        let estado = null;

        function fecharAutocomplete() {
            autocompleteFoto.fechar();
        }

        function atualizarCompartilhamentoEstatico() {
            const concluido = estado?.status === "won" || estado?.status === "lost";
            elements.shareButton?.classList.toggle("hidden", !concluido);
        }

        function renderizarDots() {
            elements.dots.innerHTML = "";
            for (let i = 0; i < MAX_TENTATIVAS_FOTO; i++) {
                const dot = documentApi.createElement("span");
                dot.className = "dot-attempt";
                if (i < tentativas.length) {
                    const acertou = tentativas[i] === jogadorSecreto.nome;
                    dot.classList.add(acertou ? "used" : "wrong-used");
                }
                elements.dots.appendChild(dot);
            }
        }

        function atualizarImagem() {
            const nivel = obterNivelFoto(tentativas.length);
            const gray = pretoEBrancoAtivo ? nivel.gray : 0;
            elements.image.style.filter = `blur(${nivel.blur}px) grayscale(${gray}%)`;
        }

        function renderizarTentativa(nomeTentativa) {
            const acertou = nomeTentativa === jogadorSecreto.nome;
            const item = documentApi.createElement("div");
            item.className = `photo-attempt-item ${acertou ? "correct" : "wrong"}`;
            item.innerText = nomeTentativa;
            elements.attemptsList.appendChild(item);
        }

        function revelarResultado(status) {
            elements.image.style.filter = "blur(0px) grayscale(0%)";
            elements.endMessage.classList.remove("hidden");
            elements.endMessage.innerHTML = status === "won"
                ? `✓ Isso aí! Era o <strong>${jogadorSecreto.nome}</strong> mesmo.`
                : `✕ Suas tentativas acabaram. Era o <strong>${jogadorSecreto.nome}</strong>.`;
        }

        function start() {
            const hoje = getDate();
            const salvo = storage.load();
            jogadorSecreto = getCatalog().jogadorDoEstado(salvo, hoje);

            elements.endMessage.classList.add("hidden");
            elements.attemptsList.innerHTML = "";
            elements.searchInput.value = "";
            fecharAutocomplete();
            elements.shareButton?.classList.add("hidden");

            if (!jogadorSecreto) {
                elements.endMessage.classList.remove("hidden");
                elements.endMessage.innerHTML = "Nenhuma foto cadastrada ainda em fotos-manifest.json.";
                elements.searchInput.disabled = true;
                elements.difficultyBadge.classList.add("hidden");
                return;
            }

            const dificuldade = getCatalog().dificuldade(jogadorSecreto);
            elements.difficultyBadge.textContent = dificuldade.label;
            elements.difficultyBadge.className = `difficulty-badge ${dificuldade.classe}`;
            elements.difficultyBadge.classList.remove("hidden");
            setPlayerPhoto(elements.image, jogadorSecreto);

            if (salvo && salvo.data === hoje) {
                estado = salvo;
                if (estado.jogadorNome !== jogadorSecreto.nome) {
                    estado.jogadorNome = jogadorSecreto.nome;
                    storage.save(estado);
                }
                tentativas = [...estado.tentativas];
                ativo = estado.status === "playing";
                tentativas.forEach(renderizarTentativa);
                atualizarImagem();
                renderizarDots();
                elements.searchInput.disabled = !ativo;
                atualizarCompartilhamentoEstatico();

                if (estado.status === "won" || estado.status === "lost") revelarResultado(estado.status);
                else elements.attemptsLabel.innerText = `${tentativas.length} / ${MAX_TENTATIVAS_FOTO} TENTATIVAS`;
            } else {
                estado = {
                    data: hoje,
                    jogadorNome: jogadorSecreto.nome,
                    tentativas: [],
                    status: "playing"
                };
                storage.save(estado);
                tentativas = [];
                ativo = true;
                elements.searchInput.disabled = false;
                elements.attemptsLabel.innerText = `0 / ${MAX_TENTATIVAS_FOTO} TENTATIVAS`;
                atualizarImagem();
                renderizarDots();
                atualizarCompartilhamentoEstatico();
            }

            if (!tutorial.isSeen()) tutorial.open();
        }

        function fazerPalpite(palpiteJogador) {
            if (!ativo) return;

            tentativas.push(palpiteJogador.nome);
            estado.tentativas = tentativas;
            storage.save(estado);
            const acertou = palpiteJogador.nome === jogadorSecreto.nome;
            renderizarTentativa(palpiteJogador.nome);
            atualizarImagem();
            renderizarDots();
            elements.attemptsLabel.innerText = `${tentativas.length} / ${MAX_TENTATIVAS_FOTO} TENTATIVAS`;

            if (acertou || tentativas.length >= MAX_TENTATIVAS_FOTO) {
                ativo = false;
                estado.status = acertou ? "won" : "lost";
                storage.save(estado);
                elements.searchInput.disabled = true;
                revelarResultado(estado.status);
                atualizarCompartilhamentoEstatico();
                if (acertou) onCelebrate();
                onComplete();
            }
        }

        function gerarTextoCompartilhamento() {
            const numero = sharing.getChallengeNumber(getDate());
            const quantidadeTentativas = estado?.tentativas?.length || 0;
            return sharing.build({
                numero,
                tentativas: quantidadeTentativas,
                venceu: estado?.status === "won",
                maxTentativas: MAX_TENTATIVAS_FOTO,
                url: sharing.officialUrl
            });
        }

        function share(botaoFeedback = sharing.getDefaultFeedbackButton()) {
            return sharing.share(gerarTextoCompartilhamento(), botaoFeedback);
        }

        function fecharTutorial() {
            tutorial.markSeen();
            tutorial.close();
        }

        function atualizarContagemRegressiva(texto) {
            if (estado && estado.status !== "playing") elements.attemptsLabel.innerText = `Próximo em ${texto}`;
        }

        const autocompleteFoto = autocomplete.create({
            documentApi,
            input: elements.searchInput,
            listbox: elements.autocompleteList,
            prefixo: "photo",
            getLabel: jogador => jogador.nome,
            estaAtivo: () => ativo,
            obterSugestoes: busca => autocomplete.filter(getCatalog().jogadores(), busca, {
                getLabel: jogador => jogador.nome,
                incluir: jogador => !tentativas.includes(jogador.nome)
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

        elements.playButton.addEventListener("click", async () => {
            const pronto = navigation.beforeOpen();
            elements.view.classList.remove("hidden");
            await pronto;
            start();
        });
        elements.backButton.addEventListener("click", () => {
            elements.view.classList.add("hidden");
            navigation.back();
        });
        elements.grayscaleToggle.addEventListener("click", () => {
            pretoEBrancoAtivo = !pretoEBrancoAtivo;
            elements.grayscaleToggle.classList.toggle("active", pretoEBrancoAtivo);
            elements.grayscaleToggle.setAttribute("aria-pressed", pretoEBrancoAtivo);
            atualizarImagem();
        });
        elements.shareButton?.addEventListener("click", () => share(elements.shareButton));
        elements.tutorialCloseButton.addEventListener("click", fecharTutorial);

        return {
            start,
            share,
            fecharTutorial,
            atualizarContagemRegressiva,
            getState: () => estado,
            getSecretPlayer: () => jogadorSecreto,
            getAttempts: () => [...tentativas],
            isActive: () => ativo,
            isGrayscaleActive: () => pretoEBrancoAtivo
        };
    }

    return { MAX_TENTATIVAS_FOTO, NIVEIS_FOTO, obterNivelFoto, createPhotoMode };
});
