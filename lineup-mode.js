(function (global) {
    "use strict";

    const STORAGE_KEY = "timaodle_escalacao_daily_state";
    const FEEDBACK_DELAY_MS = 2200;
    const REVEAL_DELAY_MS = 500;
    const SHARE_FEEDBACK_DELAY_MS = 1800;

    function createLineupMode(options) {
        const {
            documentApi, elements, lineupCore, getDate, getPlayers, storage,
            createAutocomplete, filterSuggestions, getPlayerPhoto,
            buildShareText, shareText, onCelebrate, onComplete,
            setTimeoutFn = setTimeout
        } = options;

        let match = null;
        let resolvedNames = new Set();
        let outsideNames = [];
        let hits = 0;
        let errors = 0;
        let state = null;

        const autocomplete = createAutocomplete({
            documentApi,
            input: elements.searchInput,
            listbox: elements.autocompleteList,
            prefixo: "lineup",
            getLabel: player => player.nome,
            obterSugestoes: query => filterSuggestions(getPlayers(), query, {
                getLabel: player => player.nome,
                limite: 8
            }),
            renderizarOpcao: (item, player) => {
                const photo = getPlayerPhoto(player.nome);
                const avatarHtml = photo
                    ? `<img src="${photo}" class="autocomplete-avatar-img" alt="" aria-hidden="true">`
                    : '<span class="autocomplete-avatar-img" aria-hidden="true"></span>';
                item.innerHTML = `${avatarHtml}<span>${player.nome}</span>`;
            },
            onSelect: player => processGuess(player.nome)
        });

        function normalizationContext() {
            return {
                lineupNames: match
                    ? [...match.jogadores_visiveis, ...match.jogadores_ocultos]
                        .map(player => player.nome || player.nome_correto)
                    : null,
                hiddenNames: match?.jogadores_ocultos?.map(slot => slot.nome_correto) || null,
                realScore: match?.placar_real || null
            };
        }

        function save() {
            if (state) storage.save(state);
        }

        function createNewState(today) {
            return {
                data: today,
                partidaId: match.id || null,
                etapa: "placar",
                palpiteMandante: null,
                palpiteVisitante: null,
                nomesResolvidos: [],
                nomesForaDaLista: [],
                errosEscalacao: 0,
                exactScore: null,
                concluido: false
            };
        }

        function syncState(today) {
            const saved = storage.load(normalizationContext());
            const currentMatchId = match.id || null;
            const compatible = saved && saved.data === today
                && (saved.partidaId === currentMatchId || saved.partidaId == null);

            if (compatible) {
                state = saved;
                let migrated = false;
                if (state.partidaId == null && currentMatchId != null) {
                    state.partidaId = currentMatchId;
                    migrated = true;
                }
                if (state.etapa !== "placar" && typeof state.exactScore !== "boolean") {
                    const real = match.placar_real;
                    state.exactScore = state.palpiteMandante === real.mandante
                        && state.palpiteVisitante === real.visitante;
                    migrated = true;
                }
                if (migrated) save();
            } else {
                state = createNewState(today);
                save();
            }
        }

        function renderContext() {
            elements.competition.innerText = match.competicao;
            elements.matchup.innerText = `${match.mandante} — ${match.visitante}`;
            elements.localTag.innerText = match.local_tag;
            elements.dateStadium.innerText = `${match.data} · ${match.estadio}`;
            elements.homeName.innerText = match.mandante;
            elements.awayName.innerText = match.visitante;
            elements.awayCrest.innerText = match.visitante.slice(0, 3).toUpperCase();
            elements.homeNameResult.innerText = match.mandante;
            elements.awayNameResult.innerText = match.visitante;
            elements.awayCrestResult.innerText = match.visitante.slice(0, 3).toUpperCase();
        }

        function restoreScoreResult() {
            const real = match.placar_real;
            const homeGuess = state.palpiteMandante;
            const awayGuess = state.palpiteVisitante;
            const exact = homeGuess === real.mandante && awayGuess === real.visitante;
            elements.finalScore.innerText = `${real.mandante}–${real.visitante}`;
            elements.scoreGuessResult.className = `match-score-guess-result ${exact ? "acertou" : "errou"}`;
            elements.scoreGuessResult.innerText = exact
                ? `✓ Acertaste ${homeGuess}–${awayGuess}!`
                : `✗ Disseste ${homeGuess}–${awayGuess}`;
            elements.scoreGuess.classList.add("hidden");
            elements.scoreResult.classList.remove("hidden");
            elements.lineupCard.classList.remove("hidden");
        }

        function start() {
            const today = getDate();
            match = lineupCore.selecionarPartidaDoDia(today);
            if (!match) {
                elements.matchup.innerText = "Não foi possível carregar as partidas (partidas.json).";
                return;
            }
            renderContext();
            syncState(today);
            elements.scoreGuess.classList.remove("hidden");
            elements.scoreResult.classList.add("hidden");
            elements.lineupCard.classList.add("hidden");
            elements.endMessage.classList.add("hidden");
            elements.completionCard.classList.add("hidden");
            elements.homeScoreInput.value = "";
            elements.awayScoreInput.value = "";
            if (state.etapa === "placar") return;
            elements.homeScoreInput.value = state.palpiteMandante ?? "";
            elements.awayScoreInput.value = state.palpiteVisitante ?? "";
            restoreScoreResult();
            startLineup();
        }

        function confirmScore() {
            const homeGuess = parseInt(elements.homeScoreInput.value, 10);
            const awayGuess = parseInt(elements.awayScoreInput.value, 10);
            if (isNaN(homeGuess) || isNaN(awayGuess)) {
                elements.homeScoreInput.focus();
                return;
            }
            state.palpiteMandante = homeGuess;
            state.palpiteVisitante = awayGuess;
            state.exactScore = homeGuess === match.placar_real.mandante
                && awayGuess === match.placar_real.visitante;
            state.etapa = "escalacao";
            save();
            restoreScoreResult();
            startLineup();
        }

        function startLineup() {
            const restored = Array.isArray(state?.nomesResolvidos) ? state.nomesResolvidos : [];
            const restoredOutside = Array.isArray(state?.nomesForaDaLista) ? state.nomesForaDaLista : [];
            resolvedNames = new Set(match.jogadores_visiveis.map(player => player.nome));
            restored.forEach(name => resolvedNames.add(name));
            outsideNames = [...restoredOutside];
            errors = Number.isFinite(state?.errosEscalacao) ? state.errosEscalacao : outsideNames.length;
            hits = match.jogadores_ocultos.filter(slot => resolvedNames.has(slot.nome_correto)).length;
            elements.feedback.classList.add("hidden");
            elements.searchInput.value = "";
            elements.searchInput.disabled = Boolean(state?.concluido);
            autocomplete.fechar();
            renderProgress();
            renderMissing();
            renderOutside();
            renderField();
            if (state?.concluido) {
                elements.endMessage.classList.add("hidden");
                renderCompletion();
            } else {
                elements.completionCard.classList.add("hidden");
            }
        }

        function renderField() {
            elements.pitch.innerHTML = "";
            const rowCounts = [...match.jogadores_visiveis, ...match.jogadores_ocultos]
                .reduce((counts, player) => {
                    counts.set(player.top, (counts.get(player.top) || 0) + 1);
                    return counts;
                }, new Map());
            const dense = top => (rowCounts.get(top) || 0) >= 4;
            match.jogadores_visiveis.forEach(player => {
                elements.pitch.appendChild(createVisibleChip(player.nome, player.top, player.left, false, dense(player.top)));
            });
            match.jogadores_ocultos.forEach(slot => {
                elements.pitch.appendChild(resolvedNames.has(slot.nome_correto)
                    ? createVisibleChip(slot.nome_correto, slot.top, slot.left, true, dense(slot.top))
                    : createHiddenChip(slot, dense(slot.top)));
            });
        }

        function createVisibleChip(name, top, left, revealed = false, dense = false) {
            const chip = documentApi.createElement("div");
            chip.className = `player-chip${dense ? " dense-line" : ""}`;
            chip.style.top = `${top}%`;
            chip.style.left = `${left}%`;
            const photo = getPlayerPhoto(name);
            const dotHtml = photo
                ? `<img src="${photo}" class="chip-dot" alt="Foto de ${name}" style="object-fit:cover;object-position:center top;">`
                : '<span class="chip-dot" aria-hidden="true"></span>';
            chip.innerHTML = `${dotHtml}<span class="chip-label${revealed ? " correct" : ""}">${name}</span>`;
            return chip;
        }

        function createHiddenChip(slot, dense = false) {
            const chip = documentApi.createElement("div");
            chip.className = `player-chip${dense ? " dense-line" : ""}`;
            chip.style.top = `${slot.top}%`;
            chip.style.left = `${slot.left}%`;
            chip.dataset.slotId = slot.slot_id;
            chip.innerHTML = `<span class="slot-btn" id="slot-btn-${slot.slot_id}">?</span>\n+                <span class="chip-label-slot">${slot.posicao_abrev}</span>`;
            return chip;
        }

        function renderMissing() {
            elements.missing.innerHTML = '<span class="lineup-faltam-label">FALTAM</span>';
            match.jogadores_ocultos.filter(slot => !resolvedNames.has(slot.nome_correto)).forEach(slot => {
                const pill = documentApi.createElement("span");
                pill.className = "faltam-pill";
                pill.innerText = slot.posicao_abrev;
                elements.missing.appendChild(pill);
            });
        }

        function renderProgress() {
            const total = match.jogadores_ocultos.length;
            elements.progress.innerText = `${hits}/${total} JOGADORES`;
            elements.dots.innerHTML = "";
            for (let index = 0; index < total; index++) {
                const dot = documentApi.createElement("span");
                dot.className = "dot-attempt";
                if (index < hits) dot.classList.add("used");
                elements.dots.appendChild(dot);
            }
        }

        function renderOutside() {
            if (outsideNames.length === 0) {
                elements.outsideList.classList.add("hidden");
                return;
            }
            elements.outsideList.classList.remove("hidden");
            elements.outsideList.innerHTML = `<strong>Fora:</strong> ${outsideNames.join(", ")}`;
        }

        function showFeedback(message) {
            elements.feedback.classList.remove("hidden");
            elements.feedback.innerText = message;
            setTimeoutFn(() => elements.feedback.classList.add("hidden"), FEEDBACK_DELAY_MS);
        }

        function processGuess(name) {
            elements.searchInput.value = "";
            autocomplete.fechar();
            elements.searchInput.focus();
            if (resolvedNames.has(name)) {
                showFeedback("Esse já está no onze.");
                return;
            }
            const slot = match.jogadores_ocultos.find(item => item.nome_correto === name);
            if (!slot) {
                errors++;
                if (!outsideNames.includes(name)) outsideNames.push(name);
                if (state) {
                    state.nomesForaDaLista = [...outsideNames];
                    state.errosEscalacao = errors;
                    save();
                }
                renderOutside();
                showFeedback("Esse jogador não estava no onze inicial.");
                return;
            }
            resolvedNames.add(name);
            hits++;
            if (state) {
                state.nomesResolvidos = match.jogadores_ocultos
                    .filter(item => resolvedNames.has(item.nome_correto))
                    .map(item => item.nome_correto);
                save();
            }
            documentApi.getElementById(`slot-btn-${slot.slot_id}`)?.classList.add("correct");
            renderProgress();
            renderMissing();
            setTimeoutFn(() => {
                renderField();
                if (hits >= match.jogadores_ocultos.length) {
                    elements.searchInput.disabled = true;
                    if (state) {
                        state.etapa = "concluido";
                        state.concluido = true;
                        state.nomesResolvidos = match.jogadores_ocultos.map(item => item.nome_correto);
                        save();
                    }
                    elements.endMessage.classList.add("hidden");
                    renderCompletion();
                    onCelebrate();
                    onComplete();
                }
            }, REVEAL_DELAY_MS);
        }

        function renderCompletion() {
            if (!match || !state) return;
            const real = match.placar_real;
            const homeGuess = state.palpiteMandante;
            const awayGuess = state.palpiteVisitante;
            const exact = homeGuess === real.mandante && awayGuess === real.visitante;
            const total = match.jogadores_ocultos.length;
            elements.summaryRealScore.innerText = `${real.mandante}–${real.visitante}`;
            elements.summaryGuess.innerText = `${homeGuess}–${awayGuess}`;
            elements.summaryGuessStatus.innerText = exact ? "✓ PLACAR EXATO" : "PLACAR DIFERENTE";
            elements.summaryGuessStatus.className = `result-status ${exact ? "acertou" : "errou"}`;
            elements.summaryHits.innerText = `${hits}/${total}`;
            elements.summaryErrors.innerText = String(errors);
            if (outsideNames.length > 0) {
                elements.summaryErrorDetails.classList.remove("hidden");
                elements.summaryErrorDetails.innerHTML = `<strong>Tentativas fora do onze:</strong> ${outsideNames.join(", ")}`;
            } else {
                elements.summaryErrorDetails.classList.add("hidden");
                elements.summaryErrorDetails.innerHTML = "";
            }
            elements.completionCard.classList.remove("hidden");
        }

        function buildSharingText() {
            return buildShareText({
                mandante: match.mandante,
                visitante: match.visitante,
                placarReal: match.placar_real,
                palpite: { mandante: state.palpiteMandante, visitante: state.palpiteVisitante },
                acertos: hits,
                total: match.jogadores_ocultos.length,
                erros: errors
            });
        }

        async function share(button = elements.shareButton) {
            const result = await shareText(buildSharingText(), { button });
            if (result?.status === "copied" && button) {
                const original = button.innerText;
                button.innerText = "Copiado! ✓";
                setTimeoutFn(() => { button.innerText = original; }, SHARE_FEEDBACK_DELAY_MS);
            }
            return result;
        }

        elements.confirmScoreButton.addEventListener("click", confirmScore);
        elements.shareButton.addEventListener("click", () => share());

        return {
            start,
            share,
            processGuess,
            getState: () => state,
            getMatch: () => match,
            getHits: () => hits,
            getErrors: () => errors,
            getOutsideNames: () => [...outsideNames],
            getNormalizationContext: normalizationContext
        };
    }

    const api = { STORAGE_KEY, REVEAL_DELAY_MS, createLineupMode };
    if (typeof module !== "undefined" && module.exports) module.exports = api;
    global.TimaodleLineupMode = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
