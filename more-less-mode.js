(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleMoreLessMode = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const CAMPO_STAT_MM = "jogos";
    const ROTULOS_STAT_MM = { gols: "gols", jogos: "jogos", assistencias: "assistências" };
    const RODADAS_MM = 10;
    const MIN_ACERTOS_MM = 7;
    const VERSAO_ALGORITMO_MM = 2;
    const ATRASO_AVANCO_MM = 1500;

    function createMoreLessMode(configuracao) {
        const {
            documentApi,
            elements,
            getDate,
            getPlayers,
            isEligiblePlayer,
            core,
            storage,
            onStateLoaded,
            sharing,
            navigation,
            setPlayerPhoto,
            onCelebrate,
            onComplete,
            setTimeoutFn = setTimeout,
            clearTimeoutFn = clearTimeout
        } = configuracao;

        let sequencia = [];
        let referenciaAtual = null;
        let rodadaAtual = 0;
        let acertos = 0;
        let historico = [];
        let ativo = true;
        let estado = null;
        let timerAvanco = null;
        let transicaoAtiva = false;

        function rotuloStat() {
            return ROTULOS_STAT_MM[CAMPO_STAT_MM] || CAMPO_STAT_MM;
        }

        function atualizarCompartilhamentoEstatico() {
            const concluido = estado?.status === "won" || estado?.status === "lost";
            elements.shareButton?.classList.toggle("hidden", !concluido);
        }

        function snapshotSequencia(lista) {
            return lista.map(jogador => ({ ...jogador }));
        }

        function restaurarSequenciaSalva(estadoSalvo) {
            if (Array.isArray(estadoSalvo?.sequenciaJogadores) && estadoSalvo.sequenciaJogadores.length === RODADAS_MM + 1) {
                const snapshotsValidos = estadoSalvo.sequenciaJogadores.every(jogador =>
                    jogador && typeof jogador.nome === "string" && Number.isFinite(jogador[CAMPO_STAT_MM])
                );
                if (snapshotsValidos) return snapshotSequencia(estadoSalvo.sequenciaJogadores);
            }

            if (Array.isArray(estadoSalvo?.sequenciaNomes) && estadoSalvo.sequenciaNomes.length === RODADAS_MM + 1) {
                const jogadores = getPlayers();
                const restaurada = estadoSalvo.sequenciaNomes.map(nome => jogadores.find(jogador => jogador.nome === nome));
                if (restaurada.every(isEligiblePlayer)) return restaurada;
            }
            return [];
        }

        function registrarSequenciaNoEstado(estadoAtual, lista, versao, detalhes = {}) {
            estadoAtual.versaoAlgoritmo = versao;
            estadoAtual.sequenciaNomes = lista.map(jogador => jogador.nome);
            estadoAtual.sequenciaJogadores = snapshotSequencia(lista);
            if (detalhes.planoDificuldades) estadoAtual.planoDificuldades = [...detalhes.planoDificuldades];
            if (detalhes.planoDirecoes) estadoAtual.planoDirecoes = [...detalhes.planoDirecoes];
        }

        function renderizarDots() {
            elements.dots.innerHTML = "";
            for (let indice = 0; indice < RODADAS_MM; indice++) {
                const dot = documentApi.createElement("span");
                dot.className = "dot-attempt";
                if (indice < historico.length) {
                    dot.classList.add(historico[indice].correto ? "used" : "wrong-used");
                }
                elements.dots.appendChild(dot);
            }
            elements.hitsLabel.innerText = `${acertos} ${acertos === 1 ? "ACERTO" : "ACERTOS"}`;
        }

        function cancelPendingAdvance() {
            if (timerAvanco !== null) {
                clearTimeoutFn(timerAvanco);
                timerAvanco = null;
            }
            transicaoAtiva = false;
        }

        function agendarAvancoAutomatico(finalizou) {
            if (timerAvanco !== null) clearTimeoutFn(timerAvanco);
            timerAvanco = setTimeoutFn(() => {
                timerAvanco = null;
                transicaoAtiva = false;
                if (elements.view.classList.contains("hidden")) return;
                if (finalizou) mostrarFimDeJogo(true);
                else if (ativo && estado?.status === "playing") renderizarRodada();
            }, ATRASO_AVANCO_MM);
        }

        function renderizarRodada() {
            transicaoAtiva = false;
            elements.roundLabel.innerText = `Rodada ${rodadaAtual + 1}/${RODADAS_MM}`;
            elements.dividerText.innerText = `FEZ MAIS OU MENOS ${rotuloStat().toUpperCase()}?`;
            elements.roundResult.classList.add("hidden");
            elements.roundResult.classList.remove("correct", "wrong", "tie");
            elements.candidateRow.classList.remove("answered", "answer-correct", "answer-wrong");
            elements.candidateStat.classList.remove("revealed");

            setPlayerPhoto(elements.referencePhoto, referenciaAtual);
            elements.referenceName.innerText = referenciaAtual.nome;
            elements.referenceMeta.innerText = `${referenciaAtual.nacionalidade} · ${referenciaAtual.posicao}`;
            elements.referenceStat.innerText = referenciaAtual[CAMPO_STAT_MM];
            elements.referenceStatLabel.innerText = rotuloStat().toUpperCase();

            const candidato = sequencia[rodadaAtual + 1];
            setPlayerPhoto(elements.candidatePhoto, candidato);
            elements.candidateName.innerText = candidato.nome;
            elements.candidateMeta.innerText = `${candidato.nacionalidade} · ${candidato.posicao}`;
            elements.candidateStat.innerText = "?";
            elements.candidateStatLabel.innerText = rotuloStat().toUpperCase();

            elements.lessButton.disabled = false;
            elements.moreButton.disabled = false;
            elements.lessButton.innerHTML = `▼ Menos ${rotuloStat()}`;
            elements.moreButton.innerHTML = `▲ Mais ${rotuloStat()}`;
            elements.lessButton.classList.remove("correct", "wrong", "correct-answer");
            elements.moreButton.classList.remove("correct", "wrong", "correct-answer");
            renderizarDots();

            elements.card.classList.remove("mm-round-enter");
            void elements.card.offsetWidth;
            elements.card.classList.add("mm-round-enter");
        }

        function mostrarFimDeJogo(comAnimacao) {
            elements.roundResult.classList.add("hidden");
            elements.endMessage.classList.remove("hidden");
            elements.view.classList.add("resultado-final");
            const venceu = acertos >= MIN_ACERTOS_MM;
            elements.endMessage.className = `mm-result-card ${venceu ? "won" : "lost"}`;
            atualizarCompartilhamentoEstatico();
            elements.endMessage.innerHTML = `
                <span class="mm-result-kicker">MAIS OU MENOS</span>
                <h3>${venceu ? "VITÓRIA!" : "NÃO FOI DESTA VEZ"}</h3>
                <p>${venceu ? "Você bateu a meta do desafio diário." : `Você precisava de ${MIN_ACERTOS_MM} acertos para vencer.`}</p>
                <div class="mm-result-score">
                    <strong>${acertos}<span>/${RODADAS_MM}</span></strong>
                    <small>ACERTOS</small>
                </div>
                <div class="mm-result-goal ${venceu ? "reached" : "missed"}">
                    ${venceu ? "✓ META DE 7 ALCANÇADA" : `FALTARAM ${MIN_ACERTOS_MM - acertos} PARA A META`}
                </div>
                <p class="mm-result-return">Novo desafio à meia-noite.</p>`;
            if (venceu && comAnimacao) onCelebrate();
            if (comAnimacao) onComplete();
        }

        function start() {
            cancelPendingAdvance();
            const hoje = getDate();
            elements.endMessage.classList.add("hidden");
            elements.shareButton?.classList.add("hidden");
            elements.view.classList.remove("resultado-final");
            const salvo = storage.load();
            if (salvo?.data) onStateLoaded();

            if (salvo && salvo.data === hoje) {
                estado = salvo;
                sequencia = restaurarSequenciaSalva(estado);
                if (sequencia.length !== RODADAS_MM + 1) {
                    sequencia = estado.versaoAlgoritmo === VERSAO_ALGORITMO_MM
                        ? core.generateV2(hoje).sequencia
                        : core.generateV1(hoje);
                    registrarSequenciaNoEstado(
                        estado,
                        sequencia,
                        estado.versaoAlgoritmo === VERSAO_ALGORITMO_MM ? VERSAO_ALGORITMO_MM : 1
                    );
                    storage.save(estado);
                }
                if (sequencia.length < RODADAS_MM + 1) {
                    elements.endMessage.classList.remove("hidden");
                    elements.endMessage.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
                    return;
                }
                rodadaAtual = estado.rodadaAtual;
                acertos = estado.acertos;
                historico = estado.historico || [];
                referenciaAtual = sequencia[rodadaAtual]
                    || sequencia.find(jogador => jogador.nome === estado.referenciaAtualNome)
                    || sequencia[0];
                ativo = estado.status === "playing";
                if (!ativo) mostrarFimDeJogo(false);
                else renderizarRodada();
                return;
            }

            const desafioV2 = core.generateV2(hoje);
            sequencia = desafioV2.sequencia;
            if (sequencia.length < RODADAS_MM + 1) {
                elements.endMessage.classList.remove("hidden");
                elements.endMessage.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
                return;
            }
            estado = {
                data: hoje,
                rodadaAtual: 0,
                acertos: 0,
                referenciaAtualNome: sequencia[0].nome,
                historico: [],
                status: "playing"
            };
            registrarSequenciaNoEstado(estado, sequencia, VERSAO_ALGORITMO_MM, desafioV2);
            storage.save(estado);
            rodadaAtual = 0;
            acertos = 0;
            historico = [];
            referenciaAtual = sequencia[0];
            ativo = true;
            renderizarRodada();
        }

        function respond(direcaoEscolhida) {
            if (!ativo || transicaoAtiva) return;
            transicaoAtiva = true;
            const candidato = sequencia[rodadaAtual + 1];
            const statRef = referenciaAtual[CAMPO_STAT_MM];
            const statCand = candidato[CAMPO_STAT_MM];
            const direcaoCorreta = core.direction(referenciaAtual, candidato);
            const empate = direcaoCorreta === "empate";
            const correto = empate || direcaoEscolhida === direcaoCorreta;

            elements.lessButton.disabled = true;
            elements.moreButton.disabled = true;
            const botaoEscolhido = direcaoEscolhida === "mais" ? elements.moreButton : elements.lessButton;
            botaoEscolhido.classList.add(correto ? "correct" : "wrong");
            if (!correto) {
                const botaoCorreto = direcaoCorreta === "mais" ? elements.moreButton : elements.lessButton;
                botaoCorreto.classList.add("correct-answer");
            }
            elements.candidateStat.innerText = statCand;
            elements.candidateStat.classList.add("revealed");
            elements.candidateRow.classList.add("answered", correto ? "answer-correct" : "answer-wrong");
            if (correto) acertos++;
            historico.push({ candidato: candidato.nome, correto });
            renderizarDots();

            elements.roundResult.classList.remove("hidden");
            if (empate) {
                elements.roundResult.classList.add("tie");
                elements.roundResult.innerHTML = `
                    <span class="mm-feedback-announcement">Acertou. ${candidato.nome} tinha o mesmo número de jogos. ${statCand} jogos pelo Corinthians.</span>
                    <span class="mm-feedback-visual" aria-hidden="true">
                        <span class="mm-feedback-icon">✓</span>
                        <strong class="mm-feedback-title">ACERTOU!</strong>
                        <span class="mm-feedback-comparison"><em>${candidato.nome}</em> tinha o mesmo número de jogos</span>
                        <span class="mm-feedback-stat"><b>${statCand}</b> jogos pelo Corinthians</span>
                    </span>`;
            } else if (correto) {
                elements.roundResult.classList.add("correct");
                elements.roundResult.innerHTML = `
                    <span class="mm-feedback-announcement">Acertou. ${candidato.nome} tinha ${direcaoCorreta} jogos. ${statCand} jogos pelo Corinthians.</span>
                    <span class="mm-feedback-visual" aria-hidden="true">
                        <span class="mm-feedback-icon">✓</span>
                        <strong class="mm-feedback-title">ACERTOU!</strong>
                        <span class="mm-feedback-comparison"><em>${candidato.nome}</em> tinha <b>${direcaoCorreta.toUpperCase()}</b> jogos</span>
                        <span class="mm-feedback-stat"><b>${statCand}</b> jogos pelo Corinthians</span>
                    </span>`;
            } else {
                elements.roundResult.classList.add("wrong");
                elements.roundResult.innerHTML = `
                    <span class="mm-feedback-announcement">Quase. ${candidato.nome} tinha ${direcaoCorreta} jogos. ${statCand} jogos pelo Corinthians.</span>
                    <span class="mm-feedback-visual" aria-hidden="true">
                        <span class="mm-feedback-icon">✕</span>
                        <strong class="mm-feedback-title">QUASE!</strong>
                        <span class="mm-feedback-comparison"><em>${candidato.nome}</em> tinha <b>${direcaoCorreta.toUpperCase()}</b> jogos</span>
                        <span class="mm-feedback-stat"><b>${statCand}</b> jogos pelo Corinthians</span>
                    </span>`;
            }

            referenciaAtual = candidato;
            rodadaAtual++;
            estado.rodadaAtual = rodadaAtual;
            estado.acertos = acertos;
            estado.referenciaAtualNome = referenciaAtual.nome;
            estado.historico = historico;
            if (rodadaAtual >= RODADAS_MM) {
                estado.status = acertos >= MIN_ACERTOS_MM ? "won" : "lost";
                storage.save(estado);
                ativo = false;
                agendarAvancoAutomatico(true);
            } else {
                estado.status = "playing";
                storage.save(estado);
                agendarAvancoAutomatico(false);
            }
        }

        function gerarTextoCompartilhamento() {
            return sharing.build({
                numero: sharing.getChallengeNumber(getDate()),
                venceu: estado?.status === "won",
                acertos,
                rodadas: RODADAS_MM,
                resultados: estado?.historico || [],
                url: sharing.officialUrl
            });
        }

        function share(botaoFeedback = sharing.getDefaultFeedbackButton()) {
            return sharing.share(gerarTextoCompartilhamento(), botaoFeedback);
        }

        function updateCountdown(texto) {
            if (estado && estado.status !== "playing") elements.roundLabel.innerText = `Próximo em ${texto}`;
        }

        elements.lessButton.addEventListener("click", () => respond("menos"));
        elements.moreButton.addEventListener("click", () => respond("mais"));
        elements.shareButton?.addEventListener("click", () => share(elements.shareButton));
        elements.playButton.addEventListener("click", async () => {
            cancelPendingAdvance();
            navigation.beforeOpen();
            elements.view.classList.remove("hidden");
            await navigation.loadData();
            start();
        });
        elements.backButton.addEventListener("click", () => {
            cancelPendingAdvance();
            elements.view.classList.add("hidden");
            navigation.back();
        });

        return {
            start,
            respond,
            share,
            gerarTextoCompartilhamento,
            updateCountdown,
            cancelPendingAdvance,
            getState: () => estado,
            getHits: () => acertos,
            getRound: () => rodadaAtual,
            getSequence: () => snapshotSequencia(sequencia),
            isActive: () => ativo,
            isTransitioning: () => transicaoAtiva
        };
    }

    return {
        CAMPO_STAT_MM,
        RODADAS_MM,
        MIN_ACERTOS_MM,
        VERSAO_ALGORITMO_MM,
        ATRASO_AVANCO_MM,
        createMoreLessMode
    };
});
