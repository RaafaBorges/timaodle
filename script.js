/* ==========================================================================
   TIMÃODLE — MODO DIÁRIO
   Um desafio por dia, igual para todo mundo, baseado na data local
   (AAAA-MM-DD) usada como semente do sorteio do jogador secreto.
   ========================================================================== */

const CHAVE_ESTADO_DIARIO = "timaodle_daily_state";
const CHAVE_STATS = "timaodle_stats";
const CHAVE_USERNAME = "timaodle_username";
const CHAVE_ESTADO_ESCALACAO = "timaodle_escalacao_daily_state";
const CHAVE_HISTORICO = "timaodle_history_v1";
const VERSAO_HISTORICO = 1;

let jogadores = [];
let jogadorSecreto = null;
let jogoAtivo = true;
let selectedIndex = -1; // Índice do item selecionado no autocomplete via teclado

// Estatísticas legadas do Clássico. Não representam o streak geral e são
// mantidas somente por compatibilidade com instalações existentes.
function carregarEstatisticasLegadas() {
    const padrao = { jogos: 0, vitorias: 0, streak: 0, maxStreak: 0 };
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_STATS));
        return salvo && typeof salvo === "object" && !Array.isArray(salvo)
            ? { ...padrao, ...salvo }
            : padrao;
    } catch {
        return padrao;
    }
}

let stats = carregarEstatisticasLegadas();

// Elementos da Interface
const homeView = document.getElementById("homeView");
const gameView = document.getElementById("gameView");
const btnPlayDiario = document.getElementById("btnPlayDiario");
const backHomeBtn = document.getElementById("backHomeBtn");
const welcomeGreetingEl = document.getElementById("welcomeGreeting");

const searchInput = document.getElementById("searchInput");
const autocompleteList = document.getElementById("autocompleteList");
const attemptsContainer = document.getElementById("attemptsContainer");
const pageContentEl = document.getElementById("pageContent");
const timerCountdownEl = document.getElementById("timerCountdown");
const timerCountdownHomeEl = document.getElementById("timerCountdownHome");
const yesterdayPlayerEl = document.getElementById("yesterdayPlayer");
const dailyEndMessageEl = document.getElementById("dailyEndMessage");
const shareResultBtn = document.getElementById("shareResultBtn");

// Modal de Boas-Vindas
const welcomeModal = document.getElementById("welcomeModal");
const welcomeNameInput = document.getElementById("welcomeNameInput");
const welcomeSubmitBtn = document.getElementById("welcomeSubmitBtn");

// ==========================================================================
// NOME DO JOGADOR (primeira visita)
// ==========================================================================

function aplicarSaudacao(nome) {
    if (!welcomeGreetingEl) return;
    if (nome) {
        welcomeGreetingEl.innerHTML = `Fala, <strong>${nome}</strong>! 🖤`;
        welcomeGreetingEl.classList.remove("hidden");
    } else {
        welcomeGreetingEl.classList.add("hidden");
    }
}

function verificarPrimeiraVisita() {
    const nomeSalvo = localStorage.getItem(CHAVE_USERNAME);
    if (nomeSalvo) {
        aplicarSaudacao(nomeSalvo);
        return;
    }
    welcomeModal.classList.remove("hidden");
    welcomeNameInput.focus();
}

function salvarNomeUsuario() {
    const nome = welcomeNameInput.value.trim() || "Torcedor";
    localStorage.setItem(CHAVE_USERNAME, nome);
    aplicarSaudacao(nome);
    welcomeModal.classList.add("hidden");
}

welcomeSubmitBtn.addEventListener("click", salvarNomeUsuario);
welcomeNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        salvarNomeUsuario();
    }
});

// ==========================================================================
// DATA / SEMENTE DO DESAFIO DIÁRIO
// ==========================================================================

// Data local no formato AAAA-MM-DD (não usa UTC, respeita o fuso do jogador)
function getDataLocalString() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

// ==========================================================================
// HISTÓRICO E PROGRESSO DIÁRIO INTEGRADO — V1
// Guarda apenas resumos; os saves detalhados dos modos continuam sendo a
// fonte de verdade do desafio atual.
// ==========================================================================

function dataHistoricoValida(data) {
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const [ano, mes, dia] = data.split("-").map(Number);
    const conferida = new Date(Date.UTC(ano, mes - 1, dia));
    return conferida.getUTCFullYear() === ano
        && conferida.getUTCMonth() === mes - 1
        && conferida.getUTCDate() === dia;
}

function quantidadeSegura(valor, maximo = Number.MAX_SAFE_INTEGER) {
    return Number.isFinite(valor) ? Math.min(maximo, Math.max(0, Math.trunc(valor))) : 0;
}

function criarResumoModoBase() {
    return { started: false, completed: false, outcome: null };
}

function criarResumoDiaVazio() {
    return {
        classic: { ...criarResumoModoBase(), attempts: 0 },
        photo: { ...criarResumoModoBase(), attempts: 0 },
        moreLess: { ...criarResumoModoBase(), hits: 0, rounds: 0 },
        lineup: { ...criarResumoModoBase(), resolved: 0, total: 3, errors: 0, exactScore: null },
        complete: false
    };
}

function normalizarResumoClassico(estado) {
    if (!estado || typeof estado !== "object" || !dataHistoricoValida(estado.data)) return null;
    const completed = estado.status === "won";
    return {
        started: true,
        completed,
        outcome: completed ? "won" : null,
        attempts: Array.isArray(estado.tentativas) ? estado.tentativas.length : 0
    };
}

function normalizarResumoFoto(estado) {
    if (!estado || typeof estado !== "object" || !dataHistoricoValida(estado.data)) return null;
    const completed = estado.status === "won" || estado.status === "lost";
    return {
        started: true,
        completed,
        outcome: completed ? estado.status : null,
        attempts: Array.isArray(estado.tentativas) ? estado.tentativas.length : 0
    };
}

function normalizarResumoMaisMenos(estado) {
    if (!estado || typeof estado !== "object" || !dataHistoricoValida(estado.data)) return null;
    const rounds = quantidadeSegura(estado.rodadaAtual, 10);
    const completed = rounds >= 10 && (estado.status === "won" || estado.status === "lost");
    return {
        started: true,
        completed,
        outcome: completed ? estado.status : null,
        hits: quantidadeSegura(estado.acertos, 10),
        rounds
    };
}

function normalizarResumoOnzeInicial(estado) {
    if (!estado || typeof estado !== "object" || !dataHistoricoValida(estado.data)) return null;
    const completed = estado.concluido === true && estado.etapa === "concluido";
    return {
        started: true,
        completed,
        outcome: completed ? "won" : null,
        resolved: Math.min(3, new Set(Array.isArray(estado.nomesResolvidos) ? estado.nomesResolvidos : []).size),
        total: 3,
        errors: quantidadeSegura(estado.errosEscalacao),
        exactScore: typeof estado.exactScore === "boolean" ? estado.exactScore : null
    };
}

function carregarHistorico() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_HISTORICO));
        if (!salvo || salvo.version !== VERSAO_HISTORICO
            || !salvo.days || typeof salvo.days !== "object" || Array.isArray(salvo.days)) {
            return { version: VERSAO_HISTORICO, days: {} };
        }
        return salvo;
    } catch {
        return { version: VERSAO_HISTORICO, days: {} };
    }
}

function salvarHistorico(historico) {
    try {
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
    } catch (error) {
        console.warn("Não foi possível salvar o histórico diário:", error);
    }
}

function lerJsonLocalStorage(chave) {
    try {
        return JSON.parse(localStorage.getItem(chave));
    } catch {
        return null;
    }
}

function mesclarResumoModo(anterior, atual) {
    if (anterior?.completed === true && atual?.completed !== true) return anterior;
    return atual;
}

function calcularProgressoDoResumo(dia) {
    const modos = [dia.classic, dia.photo, dia.moreLess, dia.lineup];
    const started = modos.filter(modo => modo?.started === true).length;
    const completed = modos.filter(modo => modo?.completed === true).length;
    return {
        started,
        completed,
        total: 4,
        progress: `${completed}/4`,
        complete: completed === 4
    };
}

function sincronizarProgressoDiario() {
    const historico = carregarHistorico();
    const estados = [
        ["classic", lerJsonLocalStorage(CHAVE_ESTADO_DIARIO), normalizarResumoClassico],
        ["photo", lerJsonLocalStorage(CHAVE_ESTADO_FOTO), normalizarResumoFoto],
        ["moreLess", lerJsonLocalStorage(CHAVE_ESTADO_MM), normalizarResumoMaisMenos],
        ["lineup", lerJsonLocalStorage(CHAVE_ESTADO_ESCALACAO), normalizarResumoOnzeInicial]
    ];

    estados.forEach(([modo, estado, normalizar]) => {
        const resumo = normalizar(estado);
        if (!resumo) return;
        const dia = historico.days[estado.data] && typeof historico.days[estado.data] === "object"
            ? historico.days[estado.data]
            : criarResumoDiaVazio();
        dia[modo] = mesclarResumoModo(dia[modo], resumo);
        dia.complete = calcularProgressoDoResumo(dia).complete;
        historico.days[estado.data] = dia;
    });

    salvarHistorico(historico);
    return historico;
}

function obterProgressoDiario(data = getDataLocalString()) {
    const historico = carregarHistorico();
    const dia = historico.days[data] && typeof historico.days[data] === "object"
        ? historico.days[data]
        : criarResumoDiaVazio();
    return { data, ...calcularProgressoDoResumo(dia), modes: dia };
}

// Hash simples e determinístico (mesma string sempre gera o mesmo número)
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // mantém unsigned 32-bit
    }
    return hash;
}

// Escolhe o jogador secreto do dia com base na data — determinístico:
// a mesma data sempre resulta no mesmo jogador, para todo mundo.
function sortearJogadorDoDia(dataStr) {
    const hash = hashString(dataStr);
    const index = hash % jogadores.length;
    return jogadores[index];
}

// ==========================================================================
// CONTAGEM REGRESSIVA ATÉ A MEIA-NOITE (PRÓXIMO DESAFIO)
// ==========================================================================
let timerInterval = null;

function atualizarTimer() {
    const agora = new Date();
    const meiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 0, 0);
    const diffMs = meiaNoite - agora;

    if (diffMs <= 0) {
        // Virou o dia — recarrega para pegar o novo desafio automaticamente
        window.location.reload();
        return;
    }

    const horas = String(Math.floor(diffMs / 3600000)).padStart(2, "0");
    const minutos = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, "0");
    const segundos = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, "0");
    const texto = `${horas}:${minutos}:${segundos}`;

    if (timerCountdownEl) timerCountdownEl.innerText = texto;
    if (timerCountdownHomeEl) timerCountdownHomeEl.innerText = texto;
    if (escNextChallengeCountdownEl) escNextChallengeCountdownEl.innerText = texto;

    // No Modo Foto, depois que o desafio do dia termina (ganhou ou
    // perdeu), o rótulo de tentativas vira a contagem pro próximo dia.
    if (photoAttemptsLabelEl && estadoFotoDiario && estadoFotoDiario.status !== "playing") {
        photoAttemptsLabelEl.innerText = `Próximo em ${texto}`;
    }

    if (typeof mmRoundLabelEl !== "undefined" && mmRoundLabelEl && estadoMMDiario && estadoMMDiario.status !== "playing") {
        mmRoundLabelEl.innerText = `Próximo em ${texto}`;
    }
}

function iniciarTimer() {
    atualizarTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(atualizarTimer, 1000);
}

// ==========================================================================
// PERSISTÊNCIA DIÁRIA (localStorage)
// ==========================================================================

function carregarEstadoDiario() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_ESTADO_DIARIO));
    } catch {
        return null;
    }
}

function salvarEstadoDiario(estado) {
    localStorage.setItem(CHAVE_ESTADO_DIARIO, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

// Estado atual do desafio de hoje, mantido em memória e sincronizado
// com o localStorage a cada tentativa.
let estadoDiario = null;

// ==========================================================================
// NAVEGAÇÃO — TELA INICIAL ⇄ MODO DIÁRIO
// (estrutura pronta para receber outros modos no futuro)
// ==========================================================================

btnPlayDiario.addEventListener("click", () => {
    homeView.classList.add("hidden");
    gameView.classList.remove("hidden");
    if (jogadores.length === 0) {
        carregarJogadores().then(() => iniciarDesafioDiario());
    } else {
        iniciarDesafioDiario();
    }
});

backHomeBtn.addEventListener("click", () => {
    gameView.classList.add("hidden");
    homeView.classList.remove("hidden");
});

// ==========================================================================
// CARREGAMENTO DOS JOGADORES E INÍCIO DO DESAFIO DO DIA
// ==========================================================================

async function carregarJogadores() {
    try {
        const response = await fetch('jogadores.json');
        jogadores = await response.json();
    } catch (error) {
        console.error("Erro ao carregar o JSON:", error);
        alert("Erro ao carregar a base de jogadores. Verifique se o servidor local está rodando.");
    }
}

function iniciarDesafioDiario() {
    if (jogadores.length === 0) return;

    const hoje = getDataLocalString();
    jogadorSecreto = sortearJogadorDoDia(hoje);
    console.log("Desafio do dia:", hoje, "→ Jogador Secreto:", jogadorSecreto.nome);

    const salvo = carregarEstadoDiario();

    if (salvo?.data) sincronizarProgressoDiario();

    if (salvo && salvo.data === hoje) {
        // Mesmo dia — restaura tentativas e status salvos
        estadoDiario = salvo;
        attemptsContainer.innerHTML = "";
        (estadoDiario.tentativas || []).forEach(nomeTentativa => {
            const jogadorTentativa = jogadores.find(j => j.nome === nomeTentativa);
            if (jogadorTentativa) renderizarTentativa(jogadorTentativa, { instantaneo: true });
        });
        if (pageContentEl) pageContentEl.scrollTop = 0;
        jogoAtivo = estadoDiario.status === "playing";
        if (estadoDiario.status === "won") {
            mostrarFimDeJogo(false);
        }
    } else {
        // Novo dia — reseta o desafio
        estadoDiario = { data: hoje, tentativas: [], status: "playing" };
        salvarEstadoDiario(estadoDiario);
        attemptsContainer.innerHTML = "";
        jogoAtivo = true;
        dailyEndMessageEl.classList.add("hidden");
        shareResultBtn.classList.add("hidden");
        searchInput.disabled = false;
    }

    searchInput.value = "";
    fecharAutocomplete();
}

// ==========================================================================
// AUTOCOMPLETE
// ==========================================================================

function fecharAutocomplete() {
    autocompleteList.innerHTML = "";
    selectedIndex = -1;
}

function atualizarDestaqueAutocomplete(items) {
    Array.from(items).forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add("autocomplete-active");
            item.scrollIntoView({ block: "nearest" });
        } else {
            item.classList.remove("autocomplete-active");
        }
    });
}

// Evento de Digitação (Filtro do Autocomplete)
searchInput.addEventListener("input", function () {
    if (!jogoAtivo) return;
    const value = normalizarBusca(this.value.trim());
    fecharAutocomplete();

    if (!value) return;

    const filtrados = jogadores.filter(j =>
        normalizarBusca(j.nome).includes(value) &&
        !(estadoDiario?.tentativas || []).includes(j.nome)
    );

    filtrados.forEach(j => {
        const item = document.createElement("div");
        item.innerText = j.nome;
        item.dataset.nome = j.nome;

        item.addEventListener("click", function () {
            fazerPalpite(j);
            searchInput.value = "";
            fecharAutocomplete();
        });

        autocompleteList.appendChild(item);
    });
});

// Navegação via Teclado (Setas Cima/Baixo e Enter)
searchInput.addEventListener("keydown", function (e) {
    if (!jogoAtivo) return;

    const items = autocompleteList.getElementsByTagName("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex++;
        if (selectedIndex >= items.length) selectedIndex = 0;
        atualizarDestaqueAutocomplete(items);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex--;
        if (selectedIndex < 0) selectedIndex = items.length - 1;
        atualizarDestaqueAutocomplete(items);
    } else if (e.key === "Enter") {
        e.preventDefault();

        // Se navegou com as setas, escolhe o item selecionado; senão, escolhe a 1ª opção
        const indexParaEscolher = selectedIndex >= 0 ? selectedIndex : 0;
        const nomeSelecionado = items[indexParaEscolher].dataset.nome;
        const jogadorObjeto = jogadores.find(j => j.nome === nomeSelecionado);

        if (jogadorObjeto) {
            fazerPalpite(jogadorObjeto);
            searchInput.value = "";
            fecharAutocomplete();
        }
    } else if (e.key === "Escape") {
        fecharAutocomplete();
    }
});

document.addEventListener("click", function (e) {
    if (e.target !== searchInput) {
        fecharAutocomplete();
    }
});

// ==========================================================================
// COMPARAÇÃO DE ATRIBUTOS
// ==========================================================================

function compararTexto(palpite, correto) {
    if (palpite === correto) return { classe: "correct", texto: palpite };
    return { classe: "wrong", texto: palpite };
}

function compararNumero(palpite, correto) {
    if (palpite === correto) {
        return { classe: "correct", texto: palpite };
    } else if (palpite < correto) {
        return { classe: "wrong", texto: `${palpite} ↑` };
    } else {
        return { classe: "wrong", texto: `${palpite} ↓` };
    }
}

function extrairNomesTitulos(textoTitulos) {
    if (!textoTitulos) return [];
    return textoTitulos
        .split(',')
        .map(item => item.replace(/\d+x\s*/gi, '').trim().toLowerCase())
        .filter(item => item.length > 0);
}

function compararTitulos(palpiteTitulos, corretoTitulos) {
    if (palpiteTitulos === corretoTitulos) return { classe: "correct", texto: palpiteTitulos };

    const nomesPalpite = extrairNomesTitulos(palpiteTitulos);
    const nomesCorreto = extrairNomesTitulos(corretoTitulos);

    const temCoincidencia = nomesPalpite.some(titulo => nomesCorreto.includes(titulo));
    if (temCoincidencia) return { classe: "partial", texto: palpiteTitulos };

    return { classe: "wrong", texto: palpiteTitulos };
}

function dispararConfetes() {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
}

// ==========================================================================
// ESTATÍSTICAS (registradas em segundo plano)
// ==========================================================================

function salvarEstatisticaVitoria() {
    stats.jogos++;
    stats.vitorias++;
    stats.streak++;
    if (stats.streak > stats.maxStreak) {
        stats.maxStreak = stats.streak;
    }
    localStorage.setItem(CHAVE_STATS, JSON.stringify(stats));
}

// ==========================================================================
// COMPARTILHAR RESULTADO
// ==========================================================================

// Data de referência do "Desafio #1" — usada só para numerar os desafios
// no texto compartilhado (ajustável conforme a data real de lançamento).
const DATA_LANCAMENTO = new Date(2026, 0, 1);

function numeroDoDesafio(dataStr) {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    const dataAtual = new Date(ano, mes - 1, dia);
    const diffDias = Math.round((dataAtual - DATA_LANCAMENTO) / 86400000);
    return diffDias + 1;
}

// Recria o grid de emojis a partir dos nomes já tentados hoje, sem
// depender de nada além do que já está salvo no estado diário.
function gerarGridEmojis() {
    const emojiPorClasse = { correct: "🟩", partial: "🟨", wrong: "🟥" };

    return estadoDiario.tentativas.map(nomeTentativa => {
        const palpite = jogadores.find(j => j.nome === nomeTentativa);
        if (!palpite) return "";

        const colunas = [
            { classe: palpite.nome === jogadorSecreto.nome ? "correct" : "wrong" },
            compararTexto(palpite.posicao, jogadorSecreto.posicao),
            compararTexto(palpite.nacionalidade, jogadorSecreto.nacionalidade),
            compararNumero(palpite.estreia, jogadorSecreto.estreia),
            compararTexto(palpite.pe, jogadorSecreto.pe),
            compararTitulos(palpite.titulos, jogadorSecreto.titulos),
            compararNumero(palpite.gols, jogadorSecreto.gols),
            compararNumero(palpite.assistencias, jogadorSecreto.assistencias),
        ];

        return colunas.map(c => emojiPorClasse[c.classe]).join("");
    }).join("\n");
}

function gerarTextoCompartilhamento() {
    const hoje = getDataLocalString();
    const numero = numeroDoDesafio(hoje);
    const tentativas = estadoDiario.tentativas.length;
    const grid = gerarGridEmojis();

    return `Timãodle #${numero} — ${tentativas}/∞ 🖤\n\n${grid}\n\ntimaodle.net`;
}

async function compartilharResultado() {
    const texto = gerarTextoCompartilhamento();

    if (navigator.share) {
        try {
            await navigator.share({ text: texto });
            return;
        } catch {
            // Usuário cancelou o compartilhamento nativo — tenta copiar como alternativa
        }
    }

    try {
        await navigator.clipboard.writeText(texto);
        const textoOriginal = shareResultBtn.innerText;
        shareResultBtn.innerText = "Copiado! ✅";
        setTimeout(() => { shareResultBtn.innerText = textoOriginal; }, 2000);
    } catch {
        alert(texto); // Último recurso — mostra o texto pra copiar manualmente
    }
}

shareResultBtn.addEventListener("click", compartilharResultado);



function mostrarFimDeJogo(comAnimacao) {
    jogoAtivo = false;
    fecharAutocomplete();

    dailyEndMessageEl.classList.remove("hidden");
    dailyEndMessageEl.innerHTML = `🎉 Você acertou! O jogador de hoje era <strong>${jogadorSecreto.nome}</strong>. Volte amanhã para um novo desafio.`;
    shareResultBtn.classList.remove("hidden");

    if (comAnimacao) {
        dispararConfetes();
    }
}

// ==========================================================================
// RENDERIZAÇÃO DE UMA TENTATIVA (linha do tabuleiro)
// ==========================================================================

// options.instantaneo = true -> usado ao restaurar tentativas salvas
// (sem animação de flip, aparece já revelado)
function renderizarTentativa(palpite, options = {}) {
    const instantaneo = options.instantaneo === true;

    const row = document.createElement("div");
    row.className = "attempt-row";

    const cNome = { classe: palpite.nome === jogadorSecreto.nome ? "correct" : "wrong", texto: palpite.nome };
    const cPosicao = compararTexto(palpite.posicao, jogadorSecreto.posicao);
    const cNac = compararTexto(palpite.nacionalidade, jogadorSecreto.nacionalidade);
    const cEstreia = compararNumero(palpite.estreia, jogadorSecreto.estreia);
    const cPe = compararTexto(palpite.pe, jogadorSecreto.pe);
    const cTitulos = compararTitulos(palpite.titulos, jogadorSecreto.titulos);
    const cGols = compararNumero(palpite.gols, jogadorSecreto.gols);
    const cAssists = compararNumero(palpite.assistencias, jogadorSecreto.assistencias);

    const colunas = [cNome, cPosicao, cNac, cEstreia, cPe, cTitulos, cGols, cAssists];

    colunas.forEach((col, index) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.title = col.texto;

        const cellText = document.createElement("span");
        cellText.className = "cell-text";
        cellText.innerText = col.texto;
        cell.appendChild(cellText);

        if (instantaneo) {
            cell.classList.add("reveal", col.classe);
        } else {
            setTimeout(() => {
                cell.classList.add("reveal");
                setTimeout(() => cell.classList.add(col.classe), 300);
            }, index * 200);
        }

        row.appendChild(cell);
    });

    // Palpite mais recente sempre no topo — tanto ao vivo quanto ao
    // restaurar o estado salvo (mesmo comportamento nos dois casos).
    attemptsContainer.insertBefore(row, attemptsContainer.firstChild);
    if (!instantaneo) {
        if (pageContentEl) pageContentEl.scrollTop = 0;
    }

    return { row, ehAcerto: palpite.nome === jogadorSecreto.nome, totalColunas: colunas.length };
}

// ==========================================================================
// FAZER UM PALPITE (tentativas ilimitadas até acertar)
// ==========================================================================

function fazerPalpite(palpite) {
    if (!jogoAtivo) return;

    const { row, ehAcerto, totalColunas } = renderizarTentativa(palpite, { instantaneo: false });

    // Persiste a tentativa no estado diário
    estadoDiario.tentativas.push(palpite.nome);
    salvarEstadoDiario(estadoDiario);

    const tempoTotalAnimacao = (totalColunas * 200) + 400;

    setTimeout(() => {
        if (ehAcerto) {
            estadoDiario.status = "won";
            salvarEstadoDiario(estadoDiario);
            salvarEstatisticaVitoria();
            setTimeout(() => mostrarFimDeJogo(true), 400);
        } else {
            row.classList.add("shake");
        }
    }, tempoTotalAnimacao);
}

// ==========================================================================
// WIDGET DE LINKS ÚTEIS
// ==========================================================================
(function () {
    const widget = document.getElementById("usefulLinksWidget");
    const btn = document.getElementById("usefulLinksBtn");
    const arrow = document.getElementById("usefulLinksArrow");
    if (!widget || !btn) return;

    function setState(isOpen) {
        widget.classList.toggle("open", isOpen);
        btn.setAttribute("aria-expanded", isOpen);
        if (arrow) arrow.textContent = isOpen ? "❮" : "❯";
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setState(!widget.classList.contains("open"));
    });

    document.addEventListener("click", (e) => {
        if (!widget.contains(e.target)) setState(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setState(false);
    });
})();

/* ==========================================================================
   TIMÃODLE — MODO FOTO
   Modo novo e independente do Modo Diário: adivinhe o jogador a partir
   de uma foto que começa borrada e em preto-e-branco, e vai "focando"
   a cada tentativa. A lista de quem tem foto disponível vem de
   fotos-manifest.json — pra adicionar um jogador novo no modo, basta
   colocar o arquivo em fotos/<slug-do-nome>.jpg e incluir o nome nesse
   arquivo (não precisa mexer neste script.js).
   ========================================================================== */

const PASTA_FOTOS = "fotos/";
const MAX_TENTATIVAS_FOTO = 6;
const CHAVE_ESTADO_FOTO = "timaodle_foto_daily_state";
const CHAVE_TUTORIAL_FOTO = "timaodle_foto_tutorial_visto";

// Preenchido dinamicamente a partir de fotos-manifest.json (ver
// carregarManifestoFotos() lá embaixo).
let JOGADORES_COM_FOTO = [];

function validarManifestoFotos(manifesto) {
    if (!Array.isArray(manifesto)) throw new Error("O manifesto de fotos precisa ser um array.");

    const nomesCadastrados = new Set(jogadores.map(jogador => jogador.nome));
    return [...new Set(
        manifesto
            .filter(entrada => typeof entrada === "string")
            .map(entrada => entrada.trim())
            .filter(nome => nome && nomesCadastrados.has(nome))
    )];
}

async function carregarManifestoFotos() {
    try {
        const response = await fetch('fotos-manifest.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const manifesto = await response.json();
        if (jogadores.length === 0) await carregarJogadores();
        JOGADORES_COM_FOTO = validarManifestoFotos(manifesto);
    } catch (error) {
        console.error("Erro ao carregar fotos-manifest.json:", error);
        JOGADORES_COM_FOTO = [];
    }
}

// Níveis de blur/preto-e-branco por tentativa (índice 0 = antes de
// qualquer palpite; cada palpite avança um nível). Blur reduzido em
// relação à primeira versão — ficava difícil demais no início.
const NIVEIS_FOTO = [
    { blur: 14, gray: 100 },
    { blur: 10, gray: 80 },
    { blur: 7, gray: 60 },
    { blur: 4, gray: 40 },
    { blur: 2, gray: 20 },
    { blur: 0, gray: 0 },
];

function slugify(nome) {
    return nome
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

const FOTO_INDISPONIVEL_DATA_URI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-label="Foto indisponível">
        <rect width="480" height="480" fill="#11110f"/>
        <circle cx="240" cy="170" r="72" fill="#25231e" stroke="#b9975a" stroke-width="8"/>
        <path d="M112 380c12-82 58-126 128-126s116 44 128 126" fill="#25231e" stroke="#b9975a" stroke-width="8" stroke-linecap="round"/>
        <text x="240" y="430" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle">Foto indisponível</text>
    </svg>
`)}`;

function definirFotoJogador(elemento, jogador) {
    if (!elemento || !jogador?.nome) return;

    const nome = jogador.nome;
    elemento.classList.remove("image-fallback");
    elemento.alt = `Foto de ${nome}`;
    elemento.onerror = () => {
        elemento.onerror = null;
        elemento.classList.add("image-fallback");
        elemento.alt = `Foto indisponível de ${nome}`;
        elemento.src = FOTO_INDISPONIVEL_DATA_URI;
    };
    elemento.src = `${PASTA_FOTOS}${slugify(nome)}.jpg`;
}

// Elementos da interface do Modo Foto
const photoView = document.getElementById("photoView");
const btnPlayFoto = document.getElementById("btnPlayFoto");
const backHomeBtnFoto = document.getElementById("backHomeBtnFoto");
const photoImgEl = document.getElementById("photoImg");
const photoDotsEl = document.getElementById("photoDots");
const photoAttemptsLabelEl = document.getElementById("photoAttemptsLabel");
const photoDifficultyBadgeEl = document.getElementById("photoDifficultyBadge");
const photoSearchInput = document.getElementById("photoSearchInput");
const photoAutocompleteList = document.getElementById("photoAutocompleteList");
const photoAttemptsListEl = document.getElementById("photoAttemptsList");
const photoEndMessageEl = document.getElementById("photoEndMessage");
const photoGrayscaleToggle = document.getElementById("photoGrayscaleToggle");
const photoTutorialModal = document.getElementById("photoTutorialModal");
const photoTutorialCloseBtn = document.getElementById("photoTutorialCloseBtn");

let jogadorSecretoFoto = null;
let tentativasFoto = [];
let fotoAtiva = true;
let selectedIndexFoto = -1;
let pretoEBrancoAtivo = true;
let estadoFotoDiario = null;

function jogadoresComFotoObjetos() {
    return jogadores.filter(j => JOGADORES_COM_FOTO.includes(j.nome));
}

function jogadorTemJogosValidosMM(jogador) {
    return jogador
        && Object.prototype.hasOwnProperty.call(jogador, CAMPO_STAT_MM)
        && typeof jogador[CAMPO_STAT_MM] === "number"
        && Number.isFinite(jogador[CAMPO_STAT_MM]);
}

function jogadoresElegiveisMM() {
    return jogadoresComFotoObjetos().filter(jogadorTemJogosValidosMM);
}

// Mesma lógica de semente por data do Modo Diário, mas com um "tempero"
// diferente (+"-foto") — assim o jogador do dia no Modo Foto normalmente
// não é o mesmo do Modo Diário de atributos.
function sortearJogadorFotoDoDia(dataStr) {
    const pool = jogadoresComFotoObjetos();
    if (pool.length === 0) return null;
    const hash = hashString(dataStr + "-foto");
    return pool[hash % pool.length];
}

function obterJogadorFotoDoEstado(estado, dataStr) {
    const jogadorSalvo = estado?.data === dataStr && typeof estado.jogadorNome === "string"
        ? jogadores.find(jogador => jogador.nome === estado.jogadorNome)
        : null;
    return jogadorSalvo || sortearJogadorFotoDoDia(dataStr);
}

function carregarEstadoFoto() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_ESTADO_FOTO));
    } catch {
        return null;
    }
}

function salvarEstadoFoto(estado) {
    localStorage.setItem(CHAVE_ESTADO_FOTO, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

function renderizarDotsFoto() {
    photoDotsEl.innerHTML = "";
    for (let i = 0; i < MAX_TENTATIVAS_FOTO; i++) {
        const dot = document.createElement("span");
        dot.className = "dot-attempt";
        if (i < tentativasFoto.length) {
            const acertou = tentativasFoto[i] === jogadorSecretoFoto.nome;
            dot.classList.add(acertou ? "used" : "wrong-used");
        }
        photoDotsEl.appendChild(dot);
    }
}

function atualizarImagemFoto() {
    const nivel = NIVEIS_FOTO[Math.min(tentativasFoto.length, NIVEIS_FOTO.length - 1)];
    const gray = pretoEBrancoAtivo ? nivel.gray : 0;
    photoImgEl.style.filter = `blur(${nivel.blur}px) grayscale(${gray}%)`;
}

function calcularDificuldadeFoto(estreia) {
    if (estreia <= 1975) return { label: "Difícil", classe: "dificil" };
    if (estreia <= 1989) return { label: "Médio", classe: "medio" };
    return { label: "Fácil", classe: "facil" };
}

function iniciarDesafioFotoDoDia() {
    const hoje = getDataLocalString();
    const salvo = carregarEstadoFoto();
    if (salvo?.data) sincronizarProgressoDiario();
    jogadorSecretoFoto = obterJogadorFotoDoEstado(salvo, hoje);

    photoEndMessageEl.classList.add("hidden");
    photoAttemptsListEl.innerHTML = "";
    photoSearchInput.value = "";
    fecharAutocompleteFoto();

    if (!jogadorSecretoFoto) {
        photoEndMessageEl.classList.remove("hidden");
        photoEndMessageEl.innerHTML = "Nenhuma foto cadastrada ainda em fotos-manifest.json.";
        photoSearchInput.disabled = true;
        photoDifficultyBadgeEl.classList.add("hidden");
        return;
    }

    const dificuldade = calcularDificuldadeFoto(jogadorSecretoFoto.estreia);
    photoDifficultyBadgeEl.textContent = dificuldade.label;
    photoDifficultyBadgeEl.className = `difficulty-badge ${dificuldade.classe}`;
    photoDifficultyBadgeEl.classList.remove("hidden");

    definirFotoJogador(photoImgEl, jogadorSecretoFoto);

    if (salvo && salvo.data === hoje) {
        estadoFotoDiario = salvo;
        if (estadoFotoDiario.jogadorNome !== jogadorSecretoFoto.nome) {
            estadoFotoDiario.jogadorNome = jogadorSecretoFoto.nome;
            salvarEstadoFoto(estadoFotoDiario);
        }
        tentativasFoto = [...estadoFotoDiario.tentativas];
        fotoAtiva = estadoFotoDiario.status === "playing";

        tentativasFoto.forEach(nomeTentativa => {
            const acertou = nomeTentativa === jogadorSecretoFoto.nome;
            const item = document.createElement("div");
            item.className = `photo-attempt-item ${acertou ? "correct" : "wrong"}`;
            item.innerText = nomeTentativa;
            photoAttemptsListEl.appendChild(item);
        });

        atualizarImagemFoto();
        renderizarDotsFoto();
        photoSearchInput.disabled = !fotoAtiva;

        if (estadoFotoDiario.status === "won") {
            photoImgEl.style.filter = "blur(0px) grayscale(0%)";
            photoEndMessageEl.classList.remove("hidden");
            photoEndMessageEl.innerHTML = `🎉 Isso aí! Era o <strong>${jogadorSecretoFoto.nome}</strong> mesmo.`;
        } else if (estadoFotoDiario.status === "lost") {
            photoImgEl.style.filter = "blur(0px) grayscale(0%)";
            photoEndMessageEl.classList.remove("hidden");
            photoEndMessageEl.innerHTML = `❌ Suas tentativas acabaram. Era o <strong>${jogadorSecretoFoto.nome}</strong>.`;
        } else {
            photoAttemptsLabelEl.innerText = `Tentativa ${tentativasFoto.length}/${MAX_TENTATIVAS_FOTO}`;
        }
    } else {
        estadoFotoDiario = {
            data: hoje,
            jogadorNome: jogadorSecretoFoto.nome,
            tentativas: [],
            status: "playing"
        };
        salvarEstadoFoto(estadoFotoDiario);
        tentativasFoto = [];
        fotoAtiva = true;
        photoSearchInput.disabled = false;
        photoAttemptsLabelEl.innerText = `Tentativa 0/${MAX_TENTATIVAS_FOTO}`;
        atualizarImagemFoto();
        renderizarDotsFoto();
    }

    // Tutorial do botão de preto-e-branco — só na primeira vez que
    // a pessoa abre o Modo Foto.
    if (!localStorage.getItem(CHAVE_TUTORIAL_FOTO)) {
        photoTutorialModal.classList.remove("hidden");
    }
}

function fecharAutocompleteFoto() {
    photoAutocompleteList.innerHTML = "";
    selectedIndexFoto = -1;
}

function fazerPalpiteFoto(palpiteJogador) {
    if (!fotoAtiva) return;

    tentativasFoto.push(palpiteJogador.nome);
    estadoFotoDiario.tentativas = tentativasFoto;
    salvarEstadoFoto(estadoFotoDiario);

    const acertou = palpiteJogador.nome === jogadorSecretoFoto.nome;

    const item = document.createElement("div");
    item.className = `photo-attempt-item ${acertou ? "correct" : "wrong"}`;
    item.innerText = palpiteJogador.nome;
    photoAttemptsListEl.appendChild(item);

    atualizarImagemFoto();
    renderizarDotsFoto();
    photoAttemptsLabelEl.innerText = `Tentativa ${tentativasFoto.length}/${MAX_TENTATIVAS_FOTO}`;

    if (acertou) {
        fotoAtiva = false;
        estadoFotoDiario.status = "won";
        salvarEstadoFoto(estadoFotoDiario);
        photoSearchInput.disabled = true;
        photoImgEl.style.filter = "blur(0px) grayscale(0%)";
        photoEndMessageEl.classList.remove("hidden");
        photoEndMessageEl.innerHTML = `🎉 Isso aí! Era o <strong>${jogadorSecretoFoto.nome}</strong> mesmo.`;
        dispararConfetes();
    } else if (tentativasFoto.length >= MAX_TENTATIVAS_FOTO) {
        fotoAtiva = false;
        estadoFotoDiario.status = "lost";
        salvarEstadoFoto(estadoFotoDiario);
        photoSearchInput.disabled = true;
        photoImgEl.style.filter = "blur(0px) grayscale(0%)";
        photoEndMessageEl.classList.remove("hidden");
        photoEndMessageEl.innerHTML = `❌ Suas tentativas acabaram. Era o <strong>${jogadorSecretoFoto.nome}</strong>.`;
    }
}

// Autocomplete do Modo Foto — restrito só aos jogadores com foto
photoSearchInput.addEventListener("input", function () {
    if (!fotoAtiva) return;
    const value = normalizarBusca(this.value.trim());
    fecharAutocompleteFoto();
    if (!value) return;

    const jaTentados = tentativasFoto;
    const filtrados = jogadoresComFotoObjetos().filter(j =>
        normalizarBusca(j.nome).includes(value) && !jaTentados.includes(j.nome)
    );

    filtrados.forEach(j => {
        const item = document.createElement("div");
        item.innerText = j.nome;
        item.dataset.nome = j.nome;
        item.addEventListener("click", function () {
            fazerPalpiteFoto(j);
            photoSearchInput.value = "";
            fecharAutocompleteFoto();
        });
        photoAutocompleteList.appendChild(item);
    });
});

photoSearchInput.addEventListener("keydown", function (e) {
    if (!fotoAtiva) return;
    const items = photoAutocompleteList.getElementsByTagName("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndexFoto = (selectedIndexFoto + 1) % items.length;
        Array.from(items).forEach((el, i) => el.classList.toggle("autocomplete-active", i === selectedIndexFoto));
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndexFoto = (selectedIndexFoto - 1 + items.length) % items.length;
        Array.from(items).forEach((el, i) => el.classList.toggle("autocomplete-active", i === selectedIndexFoto));
    } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = selectedIndexFoto >= 0 ? selectedIndexFoto : 0;
        const nome = items[idx].dataset.nome;
        const jogadorObjeto = jogadores.find(j => j.nome === nome);
        if (jogadorObjeto) {
            fazerPalpiteFoto(jogadorObjeto);
            photoSearchInput.value = "";
            fecharAutocompleteFoto();
        }
    } else if (e.key === "Escape") {
        fecharAutocompleteFoto();
    }
});

document.addEventListener("click", function (e) {
    if (e.target !== photoSearchInput) fecharAutocompleteFoto();
});

// Navegação
btnPlayFoto.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    photoView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());

    if (tarefas.length > 0) await Promise.all(tarefas);
    iniciarDesafioFotoDoDia();
});

backHomeBtnFoto.addEventListener("click", () => {
    photoView.classList.add("hidden");
    homeView.classList.remove("hidden");
});

photoGrayscaleToggle.addEventListener("click", () => {
    pretoEBrancoAtivo = !pretoEBrancoAtivo;
    photoGrayscaleToggle.classList.toggle("active", pretoEBrancoAtivo);
    photoGrayscaleToggle.setAttribute("aria-pressed", pretoEBrancoAtivo);
    atualizarImagemFoto();
});

photoTutorialCloseBtn.addEventListener("click", () => {
    photoTutorialModal.classList.add("hidden");
    localStorage.setItem(CHAVE_TUTORIAL_FOTO, "1");
});

/* ==========================================================================
   TIMÃODLE — JOGOU MAIS OU MENOS
   Desafio diário (mesma sequência pra todo mundo, no mesmo dia): compara
   estatísticas de 11 jogadores em sequência (1 referência inicial + 10
   comparações). Acerta se adivinha se o próximo jogador tem MAIS ou MENOS
   que o atual — a referência sempre avança pro jogador seguinte, acertando
   ou errando. Precisa de pelo menos 7 acertos em 10 pra vencer.

   IMPORTANTE: o jogadores.json agora tem o campo "jogos" (número de
   partidas disputadas pelo Corinthians), usado como estatística de
   comparação. Pra trocar por outro critério no futuro (ex: gols),
   troque só a constante CAMPO_STAT_MM abaixo — o resto se adapta.
   ========================================================================== */

const CAMPO_STAT_MM = "jogos"; // agora usando o dado real de partidas jogadas
const ROTULOS_STAT_MM = { gols: "gols", jogos: "jogos", assistencias: "assistências" };
function rotuloStatMM() { return ROTULOS_STAT_MM[CAMPO_STAT_MM] || CAMPO_STAT_MM; }
const RODADAS_MM = 10;
const MIN_ACERTOS_MM = 7;
const CHAVE_ESTADO_MM = "timaodle_mm_daily_state";
const VERSAO_ALGORITMO_MM = 2;
const PLANO_DIFICULDADES_MM = ["facil", "facil", "facil", "media", "media", "media", "media", "dificil", "dificil", "dificil"];

// Elementos da interface
const maisMenosView = document.getElementById("maisMenosView");
const btnPlayMaisMenos = document.getElementById("btnPlayMaisMenos");
const backHomeBtnMM = document.getElementById("backHomeBtnMM");
const mmRoundLabelEl = document.getElementById("mmRoundLabel");
const mmDotsEl = document.getElementById("mmDots");
const mmHitsLabelEl = document.getElementById("mmHitsLabel");
const mmRefFotoEl = document.getElementById("mmRefFoto");
const mmRefNomeEl = document.getElementById("mmRefNome");
const mmRefMetaEl = document.getElementById("mmRefMeta");
const mmRefStatEl = document.getElementById("mmRefStat");
const mmRefStatLabelEl = document.getElementById("mmRefStatLabel");
const mmCandFotoEl = document.getElementById("mmCandFoto");
const mmCandNomeEl = document.getElementById("mmCandNome");
const mmCandMetaEl = document.getElementById("mmCandMeta");
const mmCandStatEl = document.getElementById("mmCandStat");
const mmCandStatLabelEl = document.getElementById("mmCandStatLabel");
const mmCandRowEl = document.getElementById("mmCandRow");
const mmDividerTextEl = document.getElementById("mmDividerText");
const mmCaptionRoundEl = document.getElementById("mmCaptionRound");
const mmBtnMenos = document.getElementById("mmBtnMenos");
const mmBtnMais = document.getElementById("mmBtnMais");
const mmRoundResultEl = document.getElementById("mmRoundResult");
const mmNextBtn = document.getElementById("mmNextBtn");
const mmEndMessageEl = document.getElementById("mmEndMessage");

let sequenciaMM = [];
let referenciaAtualMM = null;
let rodadaAtualMM = 0;
let acertosMM = 0;
let historicoMM = [];
let mmAtivo = true;
let estadoMMDiario = null;

// Gerador de números pseudoaleatórios com semente (determinístico —
// mesma semente sempre gera a mesma sequência).
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
        const disponiveis = poolPriorizado.filter(j => !usados.has(j.nome));
        const direcao = planoDirecoes[rodada];
        const dificuldade = planoDificuldades[rodada];
        const grupos = [
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) === direcao && dificuldadeComparacaoMM(referencia, j) === dificuldade),
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) === direcao && atendeDificuldadeExpandidaMM(referencia, j, dificuldade)),
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) === direcao),
            disponiveis.filter(j => direcaoComparacaoMM(referencia, j) !== "empate"),
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

function gerarDesafioMMV2(dataStr) {
    const pool = jogadoresElegiveisMM();
    if (pool.length < RODADAS_MM + 1) {
        return { sequencia: [], planoDificuldades: [], planoDirecoes: [], fallbacks: [] };
    }

    const rng = gerarPRNG(hashString(dataStr + "-mm-v2"));
    let ultimoPlanoDificuldades = [];
    let ultimoPlanoDirecoes = [];
    let ultimoPoolPriorizado = [];

    // Alguns planos são inviáveis quando uma direção e uma faixa não têm
    // candidato a partir da referência atual. Tentamos novos planos, sempre
    // com o mesmo PRNG diário, antes de flexibilizar qualquer regra.
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

// Mantido somente para migrar com segurança partidas v1 iniciadas antes
// da publicação do algoritmo balanceado.
function gerarSequenciaMMV1(dataStr) {
    const pool = jogadoresElegiveisMM();
    if (pool.length < RODADAS_MM + 1) return [];
    return embaralharComSemente(pool, hashString(dataStr + "-mm")).slice(0, RODADAS_MM + 1);
}

function carregarEstadoMM() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_ESTADO_MM));
    } catch {
        return null;
    }
}

function salvarEstadoMM(estado) {
    localStorage.setItem(CHAVE_ESTADO_MM, JSON.stringify(estado));
    sincronizarProgressoDiario();
}

function snapshotSequenciaMM(sequencia) {
    return sequencia.map(jogador => ({ ...jogador }));
}

function restaurarSequenciaSalvaMM(estado) {
    if (Array.isArray(estado?.sequenciaJogadores) && estado.sequenciaJogadores.length === RODADAS_MM + 1) {
        const snapshotsValidos = estado.sequenciaJogadores.every(j =>
            j && typeof j.nome === "string" && Number.isFinite(j[CAMPO_STAT_MM])
        );
        if (snapshotsValidos) return snapshotSequenciaMM(estado.sequenciaJogadores);
    }

    if (Array.isArray(estado?.sequenciaNomes) && estado.sequenciaNomes.length === RODADAS_MM + 1) {
        const restaurada = estado.sequenciaNomes.map(nome => jogadores.find(j => j.nome === nome));
        if (restaurada.every(jogadorTemJogosValidosMM)) return restaurada;
    }
    return [];
}

function registrarSequenciaNoEstadoMM(estado, sequencia, versao, detalhes = {}) {
    estado.versaoAlgoritmo = versao;
    estado.sequenciaNomes = sequencia.map(j => j.nome);
    estado.sequenciaJogadores = snapshotSequenciaMM(sequencia);
    if (detalhes.planoDificuldades) estado.planoDificuldades = [...detalhes.planoDificuldades];
    if (detalhes.planoDirecoes) estado.planoDirecoes = [...detalhes.planoDirecoes];
}

function renderizarDotsMM() {
    mmDotsEl.innerHTML = "";
    for (let i = 0; i < RODADAS_MM; i++) {
        const dot = document.createElement("span");
        dot.className = "dot-attempt";
        if (i < historicoMM.length) {
            dot.classList.add(historicoMM[i].correto ? "used" : "wrong-used");
        }
        mmDotsEl.appendChild(dot);
    }
    mmHitsLabelEl.innerText = `${acertosMM} ${acertosMM === 1 ? "ACERTO" : "ACERTOS"}`;
}

const FLAGS_NACIONALIDADE = {
    "Brasil": "🇧🇷", "Argentina": "🇦🇷", "Paraguai": "🇵🇾", "Equador": "🇪🇨",
    "Venezuela": "🇻🇪", "Colômbia": "🇨🇴", "Peru": "🇵🇪", "Holanda": "🇳🇱", "Portugal": "🇵🇹",
};
function flagDoJogador(nacionalidade) {
    return FLAGS_NACIONALIDADE[nacionalidade] || "🌎";
}

function renderizarRodadaMM() {
    mmRoundLabelEl.innerText = `Rodada ${rodadaAtualMM + 1}/${RODADAS_MM}`;
    mmCaptionRoundEl.innerText = rodadaAtualMM + 1;
    mmDividerTextEl.innerText = `FEZ MAIS OU MENOS ${rotuloStatMM().toUpperCase()}?`;
    mmRoundResultEl.classList.add("hidden");
    mmRoundResultEl.classList.remove("correct", "wrong", "tie");
    mmNextBtn.classList.add("hidden");
    mmCandRowEl.classList.remove("answered", "answer-correct", "answer-wrong");
    mmCandStatEl.classList.remove("revealed");

    definirFotoJogador(mmRefFotoEl, referenciaAtualMM);
    mmRefNomeEl.innerText = referenciaAtualMM.nome;
    mmRefMetaEl.innerHTML = `${flagDoJogador(referenciaAtualMM.nacionalidade)} ${referenciaAtualMM.posicao}`;
    mmRefStatEl.innerText = referenciaAtualMM[CAMPO_STAT_MM];
    mmRefStatLabelEl.innerText = rotuloStatMM().toUpperCase();

    const candidato = sequenciaMM[rodadaAtualMM + 1];
    definirFotoJogador(mmCandFotoEl, candidato);
    mmCandNomeEl.innerText = candidato.nome;
    mmCandMetaEl.innerHTML = `${flagDoJogador(candidato.nacionalidade)} ${candidato.posicao}`;
    mmCandStatEl.innerText = "?";
    mmCandStatLabelEl.innerText = rotuloStatMM().toUpperCase();

    mmBtnMenos.disabled = false;
    mmBtnMais.disabled = false;
    mmBtnMenos.innerHTML = `▼ Menos ${rotuloStatMM()}`;
    mmBtnMais.innerHTML = `▲ Mais ${rotuloStatMM()}`;
    mmBtnMenos.classList.remove("correct", "wrong");
    mmBtnMais.classList.remove("correct", "wrong");
    mmBtnMenos.classList.remove("correct-answer");
    mmBtnMais.classList.remove("correct-answer");

    renderizarDotsMM();
}

function iniciarDesafioMMDoDia() {
    const hoje = getDataLocalString();
    mmEndMessageEl.classList.add("hidden");
    maisMenosView.classList.remove("resultado-final");

    const salvo = carregarEstadoMM();

    if (salvo?.data) sincronizarProgressoDiario();

    if (salvo && salvo.data === hoje) {
        estadoMMDiario = salvo;
        sequenciaMM = restaurarSequenciaSalvaMM(estadoMMDiario);

        if (sequenciaMM.length !== RODADAS_MM + 1) {
            // Estados anteriores ao v2 não guardavam a sequência. Recriamos
            // a v1 uma única vez e passamos a persistir seu snapshot.
            sequenciaMM = estadoMMDiario.versaoAlgoritmo === VERSAO_ALGORITMO_MM
                ? gerarDesafioMMV2(hoje).sequencia
                : gerarSequenciaMMV1(hoje);
            registrarSequenciaNoEstadoMM(
                estadoMMDiario,
                sequenciaMM,
                estadoMMDiario.versaoAlgoritmo === VERSAO_ALGORITMO_MM ? VERSAO_ALGORITMO_MM : 1
            );
            salvarEstadoMM(estadoMMDiario);
        }

        if (sequenciaMM.length < RODADAS_MM + 1) {
            mmEndMessageEl.classList.remove("hidden");
            mmEndMessageEl.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
            return;
        }

        rodadaAtualMM = estadoMMDiario.rodadaAtual;
        acertosMM = estadoMMDiario.acertos;
        historicoMM = estadoMMDiario.historico || [];
        referenciaAtualMM = sequenciaMM[rodadaAtualMM]
            || sequenciaMM.find(j => j.nome === estadoMMDiario.referenciaAtualNome)
            || sequenciaMM[0];
        mmAtivo = estadoMMDiario.status === "playing";

        if (!mmAtivo) {
            mostrarFimDeJogoMM(false);
        } else {
            renderizarRodadaMM();
        }
    } else {
        const desafioV2 = gerarDesafioMMV2(hoje);
        sequenciaMM = desafioV2.sequencia;

        if (sequenciaMM.length < RODADAS_MM + 1) {
            mmEndMessageEl.classList.remove("hidden");
            mmEndMessageEl.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
            return;
        }

        estadoMMDiario = {
            data: hoje,
            rodadaAtual: 0,
            acertos: 0,
            referenciaAtualNome: sequenciaMM[0].nome,
            historico: [],
            status: "playing",
        };
        registrarSequenciaNoEstadoMM(estadoMMDiario, sequenciaMM, VERSAO_ALGORITMO_MM, desafioV2);
        salvarEstadoMM(estadoMMDiario);

        rodadaAtualMM = 0;
        acertosMM = 0;
        historicoMM = [];
        referenciaAtualMM = sequenciaMM[0];
        mmAtivo = true;

        renderizarRodadaMM();
    }
}

function responderMM(direcaoEscolhida) {
    if (!mmAtivo) return;

    const candidato = sequenciaMM[rodadaAtualMM + 1];
    const statRef = referenciaAtualMM[CAMPO_STAT_MM];
    const statCand = candidato[CAMPO_STAT_MM];
    const empate = statCand === statRef;
    const direcaoCorreta = empate ? "empate" : (statCand > statRef ? "mais" : "menos");
    const correto = empate || (direcaoEscolhida === "mais" ? statCand > statRef : statCand < statRef);

    mmBtnMenos.disabled = true;
    mmBtnMais.disabled = true;
    const botaoEscolhido = direcaoEscolhida === "mais" ? mmBtnMais : mmBtnMenos;
    botaoEscolhido.classList.add(correto ? "correct" : "wrong");
    if (!correto) {
        const botaoCorreto = direcaoCorreta === "mais" ? mmBtnMais : mmBtnMenos;
        botaoCorreto.classList.add("correct-answer");
    }

    mmCandStatEl.innerText = statCand;
    mmCandStatEl.classList.add("revealed");
    mmCandRowEl.classList.add("answered", correto ? "answer-correct" : "answer-wrong");

    if (correto) acertosMM++;
    historicoMM.push({ candidato: candidato.nome, correto });
    renderizarDotsMM();

    mmRoundResultEl.classList.remove("hidden");
    if (empate) {
        mmRoundResultEl.classList.add("tie");
        mmRoundResultEl.innerHTML = `<strong>EMPATE</strong><span>Os dois têm ${statCand} ${rotuloStatMM()}. Qualquer opção contou como acerto.</span>`;
    } else if (correto) {
        mmRoundResultEl.classList.add("correct");
        mmRoundResultEl.innerHTML = `<strong>ACERTOU — ERA ${direcaoCorreta.toUpperCase()}</strong><span>${candidato.nome} tem ${statCand} ${rotuloStatMM()} pelo Corinthians.</span>`;
    } else {
        mmRoundResultEl.classList.add("wrong");
        mmRoundResultEl.innerHTML = `<strong>A RESPOSTA ERA ${direcaoCorreta.toUpperCase()}</strong><span>${candidato.nome} tem ${statCand} ${rotuloStatMM()} pelo Corinthians.</span>`;
    }

    // O jogador de referência sempre avança pro próximo candidato,
    // acertando ou errando — só a pontuação (acertosMM) depende do acerto.
    referenciaAtualMM = candidato;
    rodadaAtualMM++;

    estadoMMDiario.rodadaAtual = rodadaAtualMM;
    estadoMMDiario.acertos = acertosMM;
    estadoMMDiario.referenciaAtualNome = referenciaAtualMM.nome;
    estadoMMDiario.historico = historicoMM;

    if (rodadaAtualMM >= RODADAS_MM) {
        estadoMMDiario.status = acertosMM >= MIN_ACERTOS_MM ? "won" : "lost";
        salvarEstadoMM(estadoMMDiario);
        mmAtivo = false;
        setTimeout(() => mostrarFimDeJogoMM(true), 900);
    } else {
        estadoMMDiario.status = "playing";
        salvarEstadoMM(estadoMMDiario);
        mmNextBtn.classList.remove("hidden");
    }
}

function mostrarFimDeJogoMM(comAnimacao) {
    mmRoundResultEl.classList.add("hidden");
    mmNextBtn.classList.add("hidden");
    mmEndMessageEl.classList.remove("hidden");
    maisMenosView.classList.add("resultado-final");

    const venceu = acertosMM >= MIN_ACERTOS_MM;
    mmEndMessageEl.className = `mm-result-card ${venceu ? "won" : "lost"}`;
    mmEndMessageEl.innerHTML = `
        <span class="mm-result-kicker">MAIS OU MENOS</span>
        <h3>${venceu ? "VITÓRIA!" : "NÃO FOI DESTA VEZ"}</h3>
        <p>${venceu ? "Você bateu a meta do desafio diário." : `Você precisava de ${MIN_ACERTOS_MM} acertos para vencer.`}</p>
        <div class="mm-result-score">
            <strong>${acertosMM}<span>/${RODADAS_MM}</span></strong>
            <small>ACERTOS</small>
        </div>
        <div class="mm-result-goal ${venceu ? "reached" : "missed"}">
            ${venceu ? "✓ META DE 7 ALCANÇADA" : `FALTARAM ${MIN_ACERTOS_MM - acertosMM} PARA A META`}
        </div>
        <p class="mm-result-return">Novo desafio à meia-noite.</p>`;
    if (venceu && comAnimacao) dispararConfetes();
}

mmBtnMenos.addEventListener("click", () => responderMM("menos"));
mmBtnMais.addEventListener("click", () => responderMM("mais"));
mmNextBtn.addEventListener("click", renderizarRodadaMM);

btnPlayMaisMenos.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    maisMenosView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());

    if (tarefas.length > 0) await Promise.all(tarefas);
    iniciarDesafioMMDoDia();
});

backHomeBtnMM.addEventListener("click", () => {
    maisMenosView.classList.add("hidden");
    homeView.classList.remove("hidden");
});

/* ==========================================================================
   TIMÃODLE — ONZE INICIAL (protótipo do "Modo Escalação")
   Ainda SEM persistência diária de propósito — é um protótipo funcional
   pra validar a mecânica antes de polir (semente por data, mais partidas
   de exemplo, etc. ficam pra depois).

   Fluxo: 1) a pessoa palpita o placar final; 2) confirma e o resultado
   real é revelado; 3) o card do onze inicial aparece, com um único campo
   de busca (sem modal) — a cada nome digitado, o jogo confere sozinho se
   esse nome corresponde a algum jogador ainda oculto e revela o slot
   certo automaticamente, ou mostra "Fora" se não fazia parte do time.

   Estrutura de dados (escalacao-exemplo.json):
   {
     "competicao": string, "mandante": string, "visitante": string,
     "local_tag": string, "data": string, "estadio": string,
     "placar_real": { "mandante": number, "visitante": number },
     "jogadores_visiveis": [{ nome, posicao_abrev, top, left }],   // dados já revelados
     "jogadores_ocultos":  [{ slot_id, posicao_abrev, top, left, nome_correto }] // a adivinhar
   }
   "top" e "left" são porcentagens (0-100) de posição no campo.
   ========================================================================== */

const escalacaoView = document.getElementById("escalacaoView");
const btnPlayEscalacao = document.getElementById("btnPlayEscalacao");
const backHomeBtnEsc = document.getElementById("backHomeBtnEsc");

// Card de contexto / palpite de placar
const escCompeticaoEl = document.getElementById("escCompeticao");
const escConfrontoEl = document.getElementById("escConfronto");
const escLocalTagEl = document.getElementById("escLocalTag");
const escDataEstadioEl = document.getElementById("escDataEstadio");
const escScoreGuessEl = document.getElementById("escScoreGuess");
const escEscudoMandanteEl = document.getElementById("escEscudoMandante");
const escNomeMandanteEl = document.getElementById("escNomeMandante");
const escCrestVisitanteEl = document.getElementById("escCrestVisitante");
const escNomeVisitanteEl = document.getElementById("escNomeVisitante");
const escScoreMandanteInput = document.getElementById("escScoreMandante");
const escScoreVisitanteInput = document.getElementById("escScoreVisitante");
const escConfirmarPlacarBtn = document.getElementById("escConfirmarPlacar");
const escResultadoFinalEl = document.getElementById("escResultadoFinal");
const escEscudoMandante2El = document.getElementById("escEscudoMandante2");
const escNomeMandante2El = document.getElementById("escNomeMandante2");
const escCrestVisitante2El = document.getElementById("escCrestVisitante2");
const escNomeVisitante2El = document.getElementById("escNomeVisitante2");
const escPlacarFinalEl = document.getElementById("escPlacarFinal");
const escPalpitePlacarResultadoEl = document.getElementById("escPalpitePlacarResultado");

// Card do onze inicial
const escLineupCardEl = document.getElementById("escLineupCard");
const escalacaoProgressEl = document.getElementById("escalacaoProgress");
const escalacaoDotsEl = document.getElementById("escalacaoDots");
const escalacaoFaltamEl = document.getElementById("escalacaoFaltam");
const pitchFieldEl = document.getElementById("pitchField");
const escalacaoSearchInput = document.getElementById("escalacaoSearchInput");
const escalacaoAutocompleteList = document.getElementById("escalacaoAutocompleteList");
const escalacaoFeedbackEl = document.getElementById("escalacaoFeedback");
const escalacaoForaListEl = document.getElementById("escalacaoForaList");
const escalacaoEndMessageEl = document.getElementById("escalacaoEndMessage");
const escCompletionCardEl = document.getElementById("escCompletionCard");
const escResumoPlacarRealEl = document.getElementById("escResumoPlacarReal");
const escResumoPalpiteEl = document.getElementById("escResumoPalpite");
const escResumoPalpiteStatusEl = document.getElementById("escResumoPalpiteStatus");
const escResumoAcertosEl = document.getElementById("escResumoAcertos");
const escResumoErrosEl = document.getElementById("escResumoErros");
const escResumoErrosDetalheEl = document.getElementById("escResumoErrosDetalhe");
const escNextChallengeCountdownEl = document.getElementById("escNextChallengeCountdown");
const escShareLineupBtn = document.getElementById("escShareLineupBtn");

let PARTIDAS_ESCALACAO = [];
let dadosEscalacao = null;
let nomesJaResolvidos = new Set(); // nomes já revelados (visíveis + ocultos acertados)
let nomesForaDaLista = [];
let acertosEscalacao = 0;
let errosEscalacao = 0;
let selectedIndexEsc = -1;
const MAX_OCULTOS_ESCALACAO = 3;
let estadoEscalacao = null;

// Ignora acentos e maiúsculas/minúsculas na busca.
function normalizarBusca(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function carregarPartidasEscalacao() {
    try {
        const response = await fetch('partidas.json');
        PARTIDAS_ESCALACAO = await response.json();
    } catch (error) {
        console.error("Erro ao carregar partidas.json:", error);
        PARTIDAS_ESCALACAO = [];
    }
}

// Sorteia a partida do dia (semente pela data) e, dentro dela, sorteia
// quais 3 dos 11 titulares ficam ocultos — mesma sequência pra todo
// mundo, no mesmo dia.
function selecionarPartidaDoDia(dataStr) {
    if (PARTIDAS_ESCALACAO.length === 0) return null;

    const hashPartida = hashString(dataStr + "-onze");
    const partida = PARTIDAS_ESCALACAO[hashPartida % PARTIDAS_ESCALACAO.length];

    const hashSlots = hashString(dataStr + "-onze-slots-" + partida.id);
    const indices = embaralharComSemente(
        partida.titulares.map((_, i) => i),
        hashSlots
    );
    const indicesOcultos = new Set(indices.slice(0, MAX_OCULTOS_ESCALACAO));

    const jogadores_visiveis = [];
    const jogadores_ocultos = [];
    partida.titulares.forEach((j, i) => {
        if (indicesOcultos.has(i)) {
            jogadores_ocultos.push({
                slot_id: `slot-${i}`,
                posicao_abrev: j.posicao_abrev,
                top: j.top,
                left: j.left,
                nome_correto: j.nome,
            });
        } else {
            jogadores_visiveis.push({ nome: j.nome, posicao_abrev: j.posicao_abrev, top: j.top, left: j.left });
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
        jogadores_ocultos,
    };
}

function fotoOuGenerico(nome) {
    const slug = slugify(nome);
    return JOGADORES_COM_FOTO.includes(nome) ? `${PASTA_FOTOS}${slug}.jpg` : "";
}

// ---------- ETAPA 1: contexto da partida + palpite de placar ----------
function carregarEstadoEscalacao() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_ESTADO_ESCALACAO));
    } catch {
        return null;
    }
}

function salvarEstadoEscalacao() {
    if (!estadoEscalacao) return;
    localStorage.setItem(CHAVE_ESTADO_ESCALACAO, JSON.stringify(estadoEscalacao));
    sincronizarProgressoDiario();
}

function criarEstadoEscalacaoNovo(hoje) {
    return {
        data: hoje,
        partidaId: dadosEscalacao.id || null,
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

function sincronizarEstadoEscalacaoComPartida(hoje) {
    const salvo = carregarEstadoEscalacao();
    if (salvo?.data) sincronizarProgressoDiario();

    const partidaIdAtual = dadosEscalacao.id || null;
    const saveCompativel = salvo && salvo.data === hoje
        && (salvo.partidaId === partidaIdAtual || salvo.partidaId == null);

    if (saveCompativel) {
        estadoEscalacao = salvo;
        let migrou = false;
        if (estadoEscalacao.partidaId == null && partidaIdAtual != null) {
            estadoEscalacao.partidaId = partidaIdAtual;
            migrou = true;
        }
        if (estadoEscalacao.etapa !== "placar" && typeof estadoEscalacao.exactScore !== "boolean") {
            const real = dadosEscalacao.placar_real;
            estadoEscalacao.exactScore = estadoEscalacao.palpiteMandante === real.mandante
                && estadoEscalacao.palpiteVisitante === real.visitante;
            migrou = true;
        }
        if (migrou) salvarEstadoEscalacao();
    } else {
        estadoEscalacao = criarEstadoEscalacaoNovo(hoje);
        salvarEstadoEscalacao();
    }
}

function aplicarContextoEscalacao() {
    escCompeticaoEl.innerText = dadosEscalacao.competicao;
    escConfrontoEl.innerText = `${dadosEscalacao.mandante} — ${dadosEscalacao.visitante}`;
    escLocalTagEl.innerText = dadosEscalacao.local_tag;
    escDataEstadioEl.innerText = `${dadosEscalacao.data} · ${dadosEscalacao.estadio}`;

    escNomeMandanteEl.innerText = dadosEscalacao.mandante;
    escNomeVisitanteEl.innerText = dadosEscalacao.visitante;
    escCrestVisitanteEl.innerText = dadosEscalacao.visitante.slice(0, 3).toUpperCase();
    escNomeMandante2El.innerText = dadosEscalacao.mandante;
    escNomeVisitante2El.innerText = dadosEscalacao.visitante;
    escCrestVisitante2El.innerText = dadosEscalacao.visitante.slice(0, 3).toUpperCase();
}

function restaurarResultadoEscalacao() {
    const real = dadosEscalacao.placar_real;
    const palpiteMandante = estadoEscalacao.palpiteMandante;
    const palpiteVisitante = estadoEscalacao.palpiteVisitante;
    const acertouPlacar = palpiteMandante === real.mandante && palpiteVisitante === real.visitante;

    escPlacarFinalEl.innerText = `${real.mandante}–${real.visitante}`;
    escPalpitePlacarResultadoEl.className = `match-score-guess-result ${acertouPlacar ? "acertou" : "errou"}`;
    escPalpitePlacarResultadoEl.innerText = acertouPlacar
        ? `✓ Acertaste ${palpiteMandante}–${palpiteVisitante}!`
        : `✗ Disseste ${palpiteMandante}–${palpiteVisitante}`;

    escScoreGuessEl.classList.add("hidden");
    escResultadoFinalEl.classList.remove("hidden");
    escLineupCardEl.classList.remove("hidden");
}

function iniciarTelaEscalacao() {
    const hoje = getDataLocalString();
    dadosEscalacao = selecionarPartidaDoDia(hoje);

    if (!dadosEscalacao) {
        escConfrontoEl.innerText = "Não foi possível carregar as partidas (partidas.json).";
        return;
    }

    aplicarContextoEscalacao();
    sincronizarEstadoEscalacaoComPartida(hoje);

    escScoreGuessEl.classList.remove("hidden");
    escResultadoFinalEl.classList.add("hidden");
    escLineupCardEl.classList.add("hidden");
    escalacaoEndMessageEl.classList.add("hidden");
    escCompletionCardEl.classList.add("hidden");
    escScoreMandanteInput.value = "";
    escScoreVisitanteInput.value = "";

    if (estadoEscalacao.etapa === "placar") return;

    escScoreMandanteInput.value = estadoEscalacao.palpiteMandante ?? "";
    escScoreVisitanteInput.value = estadoEscalacao.palpiteVisitante ?? "";
    restaurarResultadoEscalacao();
    restaurarEstadoOnzeInicial();
}

function confirmarPalpitePlacar() {
    const palpiteMandante = parseInt(escScoreMandanteInput.value, 10);
    const palpiteVisitante = parseInt(escScoreVisitanteInput.value, 10);

    if (isNaN(palpiteMandante) || isNaN(palpiteVisitante)) {
        escScoreMandanteInput.focus();
        return;
    }

    estadoEscalacao.palpiteMandante = palpiteMandante;
    estadoEscalacao.palpiteVisitante = palpiteVisitante;
    estadoEscalacao.exactScore = palpiteMandante === dadosEscalacao.placar_real.mandante
        && palpiteVisitante === dadosEscalacao.placar_real.visitante;
    estadoEscalacao.etapa = "escalacao";
    salvarEstadoEscalacao();

    restaurarResultadoEscalacao();
    iniciarOnzeInicial();
}

escConfirmarPlacarBtn.addEventListener("click", confirmarPalpitePlacar);

// ---------- ETAPA 2: onze inicial ----------
function iniciarOnzeInicial() {
    const resolvidos = Array.isArray(estadoEscalacao?.nomesResolvidos)
        ? estadoEscalacao.nomesResolvidos
        : [];
    const fora = Array.isArray(estadoEscalacao?.nomesForaDaLista)
        ? estadoEscalacao.nomesForaDaLista
        : [];

    nomesJaResolvidos = new Set(dadosEscalacao.jogadores_visiveis.map(j => j.nome));
    resolvidos.forEach(nome => nomesJaResolvidos.add(nome));
    nomesForaDaLista = [...fora];
    errosEscalacao = Number.isFinite(estadoEscalacao?.errosEscalacao)
        ? estadoEscalacao.errosEscalacao
        : nomesForaDaLista.length;
    acertosEscalacao = dadosEscalacao.jogadores_ocultos.filter(slot => nomesJaResolvidos.has(slot.nome_correto)).length;
    escalacaoFeedbackEl.classList.add("hidden");
    escalacaoSearchInput.value = "";
    escalacaoSearchInput.disabled = Boolean(estadoEscalacao?.concluido);
    fecharAutocompleteEsc();

    atualizarProgressoEscalacao();
    renderizarFaltam();
    renderizarForaList();
    renderizarCampo();

    if (estadoEscalacao?.concluido) {
        escalacaoEndMessageEl.classList.add("hidden");
        renderizarResultadoConclusaoEscalacao();
    } else {
        escCompletionCardEl.classList.add("hidden");
    }
}

function restaurarEstadoOnzeInicial() {
    iniciarOnzeInicial();
}

function renderizarCampo() {
    pitchFieldEl.innerHTML = "";

    const quantidadePorLinha = [...dadosEscalacao.jogadores_visiveis, ...dadosEscalacao.jogadores_ocultos]
        .reduce((contagem, jogador) => {
            contagem.set(jogador.top, (contagem.get(jogador.top) || 0) + 1);
            return contagem;
        }, new Map());
    const linhaDensa = (top) => (quantidadePorLinha.get(top) || 0) >= 4;

    dadosEscalacao.jogadores_visiveis.forEach(j => {
        pitchFieldEl.appendChild(criarChipVisivel(j.nome, j.top, j.left, false, linhaDensa(j.top)));
    });

    dadosEscalacao.jogadores_ocultos.forEach(slot => {
        const jaResolvido = nomesJaResolvidos.has(slot.nome_correto);
        const chip = jaResolvido
            ? criarChipVisivel(slot.nome_correto, slot.top, slot.left, true, linhaDensa(slot.top))
            : criarChipOculto(slot, linhaDensa(slot.top));
        pitchFieldEl.appendChild(chip);
    });
}

function criarChipVisivel(nome, top, left, revelado = false, linhaDensa = false) {
    const chip = document.createElement("div");
    chip.className = `player-chip${linhaDensa ? " dense-line" : ""}`;
    chip.style.top = `${top}%`;
    chip.style.left = `${left}%`;

    const foto = fotoOuGenerico(nome);
    const dotHtml = foto
        ? `<img src="${foto}" class="chip-dot" style="object-fit:cover;object-position:center top;">`
        : `<span class="chip-dot"></span>`;

    chip.innerHTML = `${dotHtml}<span class="chip-label${revelado ? " correct" : ""}">${nome}</span>`;
    return chip;
}

function criarChipOculto(slot, linhaDensa = false) {
    const chip = document.createElement("div");
    chip.className = `player-chip${linhaDensa ? " dense-line" : ""}`;
    chip.style.top = `${slot.top}%`;
    chip.style.left = `${slot.left}%`;
    chip.dataset.slotId = slot.slot_id;
    chip.innerHTML = `<span class="slot-btn" id="slot-btn-${slot.slot_id}">?</span>
        <span class="chip-label-slot">${slot.posicao_abrev}</span>`;
    return chip;
}

function renderizarFaltam() {
    escalacaoFaltamEl.innerHTML = '<span class="lineup-faltam-label">FALTAM</span>';
    dadosEscalacao.jogadores_ocultos
        .filter(slot => !nomesJaResolvidos.has(slot.nome_correto))
        .forEach(slot => {
            const pill = document.createElement("span");
            pill.className = "faltam-pill";
            pill.innerText = slot.posicao_abrev;
            escalacaoFaltamEl.appendChild(pill);
        });
}

function atualizarProgressoEscalacao() {
    const total = dadosEscalacao.jogadores_ocultos.length;
    escalacaoProgressEl.innerText = `${acertosEscalacao}/${total}`;

    escalacaoDotsEl.innerHTML = "";
    for (let i = 0; i < total; i++) {
        const dot = document.createElement("span");
        dot.className = "dot-attempt";
        if (i < acertosEscalacao) dot.classList.add("used");
        escalacaoDotsEl.appendChild(dot);
    }
}

function renderizarForaList() {
    if (nomesForaDaLista.length === 0) {
        escalacaoForaListEl.classList.add("hidden");
        return;
    }
    escalacaoForaListEl.classList.remove("hidden");
    escalacaoForaListEl.innerHTML = `<strong>Fora:</strong> ${nomesForaDaLista.join(", ")}`;
}

function fecharAutocompleteEsc() {
    escalacaoAutocompleteList.innerHTML = "";
    selectedIndexEsc = -1;
}

function mostrarFeedbackEsc(texto) {
    escalacaoFeedbackEl.classList.remove("hidden");
    escalacaoFeedbackEl.innerText = texto;
    setTimeout(() => escalacaoFeedbackEl.classList.add("hidden"), 2200);
}

// Busca em TODA a base de jogadores (não só os 11 da partida) — assim
// errar de propósito mostra corretamente que o jogador "tá fora".
escalacaoSearchInput.addEventListener("input", function () {
    const valor = normalizarBusca(this.value.trim());
    fecharAutocompleteEsc();
    if (!valor) return;

    const filtrados = jogadores.filter(j => normalizarBusca(j.nome).includes(valor)).slice(0, 8);

    filtrados.forEach(j => {
        const item = document.createElement("div");
        const foto = fotoOuGenerico(j.nome);
        const avatarHtml = foto
            ? `<img src="${foto}" class="autocomplete-avatar-img">`
            : `<span class="autocomplete-avatar-img"></span>`;
        item.innerHTML = `${avatarHtml}<span>${j.nome}</span>`;
        item.dataset.nome = j.nome;
        item.addEventListener("click", () => processarPalpiteEscalacao(j.nome));
        escalacaoAutocompleteList.appendChild(item);
    });
});

escalacaoSearchInput.addEventListener("keydown", function (e) {
    const items = escalacaoAutocompleteList.getElementsByTagName("div");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndexEsc = (selectedIndexEsc + 1) % items.length;
        Array.from(items).forEach((el, i) => el.classList.toggle("autocomplete-active", i === selectedIndexEsc));
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndexEsc = (selectedIndexEsc - 1 + items.length) % items.length;
        Array.from(items).forEach((el, i) => el.classList.toggle("autocomplete-active", i === selectedIndexEsc));
    } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = selectedIndexEsc >= 0 ? selectedIndexEsc : 0;
        processarPalpiteEscalacao(items[idx].dataset.nome);
    }
});

document.addEventListener("click", function (e) {
    if (e.target !== escalacaoSearchInput) fecharAutocompleteEsc();
});

// ==========================================================================
// LÓGICA DE VALIDAÇÃO
// O jogo descobre sozinho onde o nome digitado se encaixa — não precisa
// escolher o slot manualmente.
// ==========================================================================
function processarPalpiteEscalacao(nomeDigitado) {
    escalacaoSearchInput.value = "";
    fecharAutocompleteEsc();
    escalacaoSearchInput.focus();

    if (nomesJaResolvidos.has(nomeDigitado)) {
        mostrarFeedbackEsc("Esse já está no onze.");
        return;
    }

    const slot = dadosEscalacao.jogadores_ocultos.find(s => s.nome_correto === nomeDigitado);

    if (!slot) {
        errosEscalacao++;
        if (!nomesForaDaLista.includes(nomeDigitado)) {
            nomesForaDaLista.push(nomeDigitado);
        }
        if (estadoEscalacao) {
            estadoEscalacao.nomesForaDaLista = [...nomesForaDaLista];
            estadoEscalacao.errosEscalacao = errosEscalacao;
            salvarEstadoEscalacao();
        }
        renderizarForaList();
        mostrarFeedbackEsc("Esse jogador não estava no onze inicial.");
        return;
    }

    nomesJaResolvidos.add(nomeDigitado);
    acertosEscalacao++;
    if (estadoEscalacao) {
        estadoEscalacao.nomesResolvidos = dadosEscalacao.jogadores_ocultos
            .filter(s => nomesJaResolvidos.has(s.nome_correto))
            .map(s => s.nome_correto);
        salvarEstadoEscalacao();
    }

    const btn = document.getElementById(`slot-btn-${slot.slot_id}`);
    if (btn) btn.classList.add("correct");

    atualizarProgressoEscalacao();
    renderizarFaltam();

    setTimeout(() => {
        renderizarCampo();

        if (acertosEscalacao >= dadosEscalacao.jogadores_ocultos.length) {
            escalacaoSearchInput.disabled = true;
            if (estadoEscalacao) {
                estadoEscalacao.etapa = "concluido";
                estadoEscalacao.concluido = true;
                estadoEscalacao.nomesResolvidos = dadosEscalacao.jogadores_ocultos.map(s => s.nome_correto);
                salvarEstadoEscalacao();
            }
            escalacaoEndMessageEl.classList.add("hidden");
            renderizarResultadoConclusaoEscalacao();
            dispararConfetes();
        }
    }, 500);
}

function renderizarResultadoConclusaoEscalacao() {
    if (!dadosEscalacao || !estadoEscalacao) return;

    const real = dadosEscalacao.placar_real;
    const palpiteM = estadoEscalacao.palpiteMandante;
    const palpiteV = estadoEscalacao.palpiteVisitante;
    const acertouPlacar = palpiteM === real.mandante && palpiteV === real.visitante;
    const total = dadosEscalacao.jogadores_ocultos.length;

    escResumoPlacarRealEl.innerText = `${real.mandante}–${real.visitante}`;
    escResumoPalpiteEl.innerText = `${palpiteM}–${palpiteV}`;
    escResumoPalpiteStatusEl.innerText = acertouPlacar ? "✓ PLACAR EXATO" : "PLACAR DIFERENTE";
    escResumoPalpiteStatusEl.className = `result-status ${acertouPlacar ? "acertou" : "errou"}`;
    escResumoAcertosEl.innerText = `${acertosEscalacao}/${total}`;
    escResumoErrosEl.innerText = String(errosEscalacao);

    if (nomesForaDaLista.length > 0) {
        escResumoErrosDetalheEl.classList.remove("hidden");
        escResumoErrosDetalheEl.innerHTML = `<strong>Tentativas fora do onze:</strong> ${nomesForaDaLista.join(", ")}`;
    } else {
        escResumoErrosDetalheEl.classList.add("hidden");
        escResumoErrosDetalheEl.innerHTML = "";
    }

    escCompletionCardEl.classList.remove("hidden");
}

function montarTextoCompartilhamentoEscalacao() {
    const real = dadosEscalacao.placar_real;
    const palpiteM = estadoEscalacao.palpiteMandante;
    const palpiteV = estadoEscalacao.palpiteVisitante;
    const acertouPlacar = palpiteM === real.mandante && palpiteV === real.visitante;
    const total = dadosEscalacao.jogadores_ocultos.length;
    const indicadorPlacar = acertouPlacar ? "🟨" : "⬛";
    const jogadores = "🟨".repeat(acertosEscalacao) + "⬛".repeat(Math.max(0, total - acertosEscalacao));

    return [
        "TIMÃODLE — ONZE INICIAL ⚽",
        `${dadosEscalacao.mandante} ${real.mandante}–${real.visitante} ${dadosEscalacao.visitante}`,
        `${indicadorPlacar} Palpite: ${palpiteM}–${palpiteV}`,
        `${jogadores} Jogadores: ${acertosEscalacao}/${total}`,
        `❌ Erros: ${errosEscalacao}`,
        "Vai Corinthians! 🖤🤍"
    ].join("\n");
}

async function compartilharResultadoEscalacao() {
    const texto = montarTextoCompartilhamentoEscalacao();
    let copiado = false;

    if (navigator.share) {
        try {
            await navigator.share({ text: texto });
            return;
        } catch (error) {
            if (error?.name !== "AbortError") console.warn("Falha ao compartilhar resultado do Onze Inicial:", error);
            if (error?.name === "AbortError") return;
        }
    }

    try {
        await navigator.clipboard.writeText(texto);
        copiado = true;
    } catch {
        const area = document.createElement("textarea");
        area.value = texto;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        copiado = document.execCommand("copy");
        area.remove();
    }

    if (copiado) {
        const original = escShareLineupBtn.innerText;
        escShareLineupBtn.innerText = "Copiado! ✓";
        setTimeout(() => { escShareLineupBtn.innerText = original; }, 1800);
    }
}

escShareLineupBtn.addEventListener("click", compartilharResultadoEscalacao);

// Navegação
btnPlayEscalacao.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    escalacaoView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());
    if (PARTIDAS_ESCALACAO.length === 0) tarefas.push(carregarPartidasEscalacao());

    if (tarefas.length > 0) await Promise.all(tarefas);
    iniciarTelaEscalacao();
});

backHomeBtnEsc.addEventListener("click", () => {
    escalacaoView.classList.add("hidden");
    homeView.classList.remove("hidden");
});


// ==========================================================================
// INICIALIZAÇÃO GERAL — fica no final do arquivo de propósito, depois de
// todas as variáveis (Modo Diário e Modo Foto) já declaradas.
// ==========================================================================
verificarPrimeiraVisita();
iniciarTimer();

carregarJogadores().then(() => {
    // O "jogador de ontem" usa a mesma lógica determinística do desafio
    // de hoje, só que com a data de ontem — então é sempre o mesmo valor
    // (o jogador que realmente foi a resposta), não muda a cada visita.
    if (yesterdayPlayerEl && jogadores.length > 0) {
        const hoje = new Date();
        const ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);
        const ontemStr = `${ontem.getFullYear()}-${String(ontem.getMonth() + 1).padStart(2, "0")}-${String(ontem.getDate()).padStart(2, "0")}`;
        const jogadorOntem = sortearJogadorDoDia(ontemStr);
        yesterdayPlayerEl.innerText = jogadorOntem.nome;
    }
});

carregarManifestoFotos();
sincronizarProgressoDiario();

// ⚠️ BOTÃO DE RESET — SÓ PARA TESTES, REMOVER ANTES DE LANÇAR DE VERDADE
const devResetBtn = document.getElementById("devResetBtn");
if (devResetBtn) {
    devResetBtn.addEventListener("click", () => {
        const confirmou = confirm(
            "[DEV] Isso vai apagar TODO o progresso salvo (Modo Diário, Modo Foto, Mais ou Menos e nome) e recarregar a página. Confirmar?"
        );
        if (confirmou) {
            localStorage.clear();
            location.reload();
        }
    });
}
