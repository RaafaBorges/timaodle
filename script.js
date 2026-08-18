/* ==========================================================================
   TIMÃODLE — MODO DIÁRIO
   Um desafio por dia, igual para todo mundo, baseado na data local
   (AAAA-MM-DD) usada como semente do sorteio do jogador secreto.
   ========================================================================== */

const CHAVE_ESTADO_DIARIO = "timaodle_daily_state";
const CHAVE_STATS = "timaodle_stats";
const CHAVE_USERNAME = "timaodle_username";

let jogadores = [];
let jogadorSecreto = null;
let jogoAtivo = true;
let selectedIndex = -1; // Índice do item selecionado no autocomplete via teclado

// Estrutura de Estatísticas no localStorage (mantida em segundo plano,
// sem exibição na interface por enquanto)
let stats = JSON.parse(localStorage.getItem(CHAVE_STATS)) || {
    jogos: 0,
    vitorias: 0,
    streak: 0,
    maxStreak: 0
};

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
    const value = this.value.toLowerCase().trim();
    fecharAutocomplete();

    if (!value) return;

    const filtrados = jogadores.filter(j =>
        j.nome.toLowerCase().includes(value) &&
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

async function carregarManifestoFotos() {
    try {
        const response = await fetch('fotos-manifest.json');
        JOGADORES_COM_FOTO = await response.json();
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

// Mesma lógica de semente por data do Modo Diário, mas com um "tempero"
// diferente (+"-foto") — assim o jogador do dia no Modo Foto normalmente
// não é o mesmo do Modo Diário de atributos.
function sortearJogadorFotoDoDia(dataStr) {
    const pool = jogadoresComFotoObjetos();
    if (pool.length === 0) return null;
    const hash = hashString(dataStr + "-foto");
    return pool[hash % pool.length];
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
    jogadorSecretoFoto = sortearJogadorFotoDoDia(hoje);

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

    const salvo = carregarEstadoFoto();
    photoImgEl.src = `${PASTA_FOTOS}${slugify(jogadorSecretoFoto.nome)}.jpg`;

    if (salvo && salvo.data === hoje) {
        estadoFotoDiario = salvo;
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
        estadoFotoDiario = { data: hoje, tentativas: [], status: "playing" };
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
    const value = this.value.toLowerCase().trim();
    fecharAutocompleteFoto();
    if (!value) return;

    const jaTentados = tentativasFoto;
    const filtrados = jogadoresComFotoObjetos().filter(j =>
        j.nome.toLowerCase().includes(value) && !jaTentados.includes(j.nome)
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

// Elementos da interface
const maisMenosView = document.getElementById("maisMenosView");
const btnPlayMaisMenos = document.getElementById("btnPlayMaisMenos");
const backHomeBtnMM = document.getElementById("backHomeBtnMM");
const mmRoundLabelEl = document.getElementById("mmRoundLabel");
const mmDotsEl = document.getElementById("mmDots");
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

// Sorteia a sequência do dia: 1 jogador de referência inicial + 10
// candidatos, todos diferentes entre si — mesma sequência pra todo
// mundo, no mesmo dia (semente = data + "-mm").
function gerarSequenciaMM(dataStr) {
    const pool = jogadoresComFotoObjetos();
    if (pool.length < RODADAS_MM + 1) return [];
    const semente = hashString(dataStr + "-mm");
    return embaralharComSemente(pool, semente).slice(0, RODADAS_MM + 1);
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
    mmNextBtn.classList.add("hidden");

    mmRefFotoEl.src = `${PASTA_FOTOS}${slugify(referenciaAtualMM.nome)}.jpg`;
    mmRefNomeEl.innerText = referenciaAtualMM.nome;
    mmRefMetaEl.innerHTML = `${flagDoJogador(referenciaAtualMM.nacionalidade)} ${referenciaAtualMM.posicao}`;
    mmRefStatEl.innerText = referenciaAtualMM[CAMPO_STAT_MM];
    mmRefStatLabelEl.innerText = rotuloStatMM().toUpperCase();

    const candidato = sequenciaMM[rodadaAtualMM + 1];
    mmCandFotoEl.src = `${PASTA_FOTOS}${slugify(candidato.nome)}.jpg`;
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

    renderizarDotsMM();
}

function iniciarDesafioMMDoDia() {
    const hoje = getDataLocalString();
    sequenciaMM = gerarSequenciaMM(hoje);

    mmEndMessageEl.classList.add("hidden");
    maisMenosView.classList.remove("resultado-final");

    if (sequenciaMM.length < RODADAS_MM + 1) {
        mmEndMessageEl.classList.remove("hidden");
        mmEndMessageEl.innerHTML = "Fotos insuficientes cadastradas ainda para este modo.";
        return;
    }

    const salvo = carregarEstadoMM();

    if (salvo && salvo.data === hoje) {
        estadoMMDiario = salvo;
        rodadaAtualMM = estadoMMDiario.rodadaAtual;
        acertosMM = estadoMMDiario.acertos;
        historicoMM = estadoMMDiario.historico || [];
        referenciaAtualMM = jogadores.find(j => j.nome === estadoMMDiario.referenciaAtualNome) || sequenciaMM[0];
        mmAtivo = estadoMMDiario.status === "playing";

        if (!mmAtivo) {
            mostrarFimDeJogoMM(false);
        } else {
            renderizarRodadaMM();
        }
    } else {
        estadoMMDiario = {
            data: hoje,
            rodadaAtual: 0,
            acertos: 0,
            referenciaAtualNome: sequenciaMM[0].nome,
            historico: [],
            status: "playing",
        };
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
    const correto = empate || (direcaoEscolhida === "mais" ? statCand > statRef : statCand < statRef);

    mmBtnMenos.disabled = true;
    mmBtnMais.disabled = true;
    const botaoEscolhido = direcaoEscolhida === "mais" ? mmBtnMais : mmBtnMenos;
    botaoEscolhido.classList.add(correto ? "correct" : "wrong");

    mmCandStatEl.innerText = statCand;

    if (correto) acertosMM++;
    historicoMM.push({ candidato: candidato.nome, correto });
    renderizarDotsMM();

    mmRoundResultEl.classList.remove("hidden");
    if (empate) {
        mmRoundResultEl.innerHTML = `🤝 Empate técnico (${statCand} ${rotuloStatMM()} pros dois) — contou como acerto!`;
    } else if (correto) {
        mmRoundResultEl.innerHTML = `✅ Acertou! <strong>${candidato.nome}</strong> tinha ${statCand} ${rotuloStatMM()}.`;
    } else {
        mmRoundResultEl.innerHTML = `❌ Essa não! <strong>${candidato.nome}</strong> tinha ${statCand} ${rotuloStatMM()}.`;
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

    const venceu = acertosMM >= MIN_ACERTOS_MM;
    if (venceu) {
        mmEndMessageEl.innerHTML = `🏆 Vitória! Você acertou <strong>${acertosMM}/${RODADAS_MM}</strong> comparações.`;
        if (comAnimacao) dispararConfetes();
    } else {
        mmEndMessageEl.innerHTML = `😔 Não foi dessa vez — <strong>${acertosMM}/${RODADAS_MM}</strong> acertos (precisa de ${MIN_ACERTOS_MM}). Volte amanhã!`;
    }
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

let dadosEscalacao = null;
let nomesJaResolvidos = new Set(); // nomes já revelados (visíveis + ocultos acertados)
let nomesForaDaLista = [];
let acertosEscalacao = 0;
let selectedIndexEsc = -1;

// Ignora acentos e maiúsculas/minúsculas na busca.
function normalizarBusca(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function carregarEscalacao() {
    try {
        const response = await fetch('escalacao-exemplo.json');
        dadosEscalacao = await response.json();
    } catch (error) {
        console.error("Erro ao carregar escalacao-exemplo.json:", error);
        dadosEscalacao = null;
    }
}

function fotoOuGenerico(nome) {
    const slug = slugify(nome);
    return JOGADORES_COM_FOTO.includes(nome) ? `${PASTA_FOTOS}${slug}.jpg` : "";
}

// ---------- ETAPA 1: contexto da partida + palpite de placar ----------
function iniciarTelaEscalacao() {
    if (!dadosEscalacao) {
        escConfrontoEl.innerText = "Não foi possível carregar a partida de exemplo.";
        return;
    }

    escCompeticaoEl.innerText = dadosEscalacao.competicao;
    escConfrontoEl.innerText = `${dadosEscalacao.mandante} — ${dadosEscalacao.visitante}`;
    escLocalTagEl.innerText = dadosEscalacao.local_tag;
    escDataEstadioEl.innerText = `${dadosEscalacao.data} · ${dadosEscalacao.estadio}`;

    escNomeMandanteEl.innerText = dadosEscalacao.mandante;
    escNomeVisitanteEl.innerText = dadosEscalacao.visitante;
    escCrestVisitanteEl.innerText = dadosEscalacao.visitante.slice(0, 3).toUpperCase();

    escScoreGuessEl.classList.remove("hidden");
    escResultadoFinalEl.classList.add("hidden");
    escLineupCardEl.classList.add("hidden");
    escalacaoEndMessageEl.classList.add("hidden");
    escScoreMandanteInput.value = "";
    escScoreVisitanteInput.value = "";
}

function confirmarPalpitePlacar() {
    const palpiteMandante = parseInt(escScoreMandanteInput.value, 10);
    const palpiteVisitante = parseInt(escScoreVisitanteInput.value, 10);

    if (isNaN(palpiteMandante) || isNaN(palpiteVisitante)) {
        escScoreMandanteInput.focus();
        return;
    }

    const real = dadosEscalacao.placar_real;
    const acertouPlacar = palpiteMandante === real.mandante && palpiteVisitante === real.visitante;

    escNomeMandante2El.innerText = dadosEscalacao.mandante;
    escNomeVisitante2El.innerText = dadosEscalacao.visitante;
    escCrestVisitante2El.innerText = dadosEscalacao.visitante.slice(0, 3).toUpperCase();
    escPlacarFinalEl.innerText = `${real.mandante}–${real.visitante}`;

    escPalpitePlacarResultadoEl.className = `match-score-guess-result ${acertouPlacar ? "acertou" : "errou"}`;
    escPalpitePlacarResultadoEl.innerText = acertouPlacar
        ? `✓ Acertaste ${palpiteMandante}–${palpiteVisitante}!`
        : `✗ Disseste ${palpiteMandante}–${palpiteVisitante}`;

    escScoreGuessEl.classList.add("hidden");
    escResultadoFinalEl.classList.remove("hidden");
    escLineupCardEl.classList.remove("hidden");

    iniciarOnzeInicial();
}

escConfirmarPlacarBtn.addEventListener("click", confirmarPalpitePlacar);

// ---------- ETAPA 2: onze inicial ----------
function iniciarOnzeInicial() {
    nomesJaResolvidos = new Set(dadosEscalacao.jogadores_visiveis.map(j => j.nome));
    nomesForaDaLista = [];
    acertosEscalacao = 0;
    escalacaoFeedbackEl.classList.add("hidden");
    escalacaoForaListEl.classList.add("hidden");
    escalacaoSearchInput.value = "";
    escalacaoSearchInput.disabled = false;
    fecharAutocompleteEsc();

    atualizarProgressoEscalacao();
    renderizarFaltam();
    renderizarCampo();
}

function renderizarCampo() {
    pitchFieldEl.innerHTML = "";

    dadosEscalacao.jogadores_visiveis.forEach(j => {
        pitchFieldEl.appendChild(criarChipVisivel(j.nome, j.top, j.left));
    });

    dadosEscalacao.jogadores_ocultos.forEach(slot => {
        const jaResolvido = nomesJaResolvidos.has(slot.nome_correto);
        const chip = jaResolvido
            ? criarChipVisivel(slot.nome_correto, slot.top, slot.left, true)
            : criarChipOculto(slot);
        pitchFieldEl.appendChild(chip);
    });
}

function criarChipVisivel(nome, top, left, revelado = false) {
    const chip = document.createElement("div");
    chip.className = "player-chip";
    chip.style.top = `${top}%`;
    chip.style.left = `${left}%`;

    const foto = fotoOuGenerico(nome);
    const dotHtml = foto
        ? `<img src="${foto}" class="chip-dot" style="object-fit:cover;object-position:center top;">`
        : `<span class="chip-dot"></span>`;

    chip.innerHTML = `${dotHtml}<span class="chip-label${revelado ? " correct" : ""}">${nome}</span>`;
    return chip;
}

function criarChipOculto(slot) {
    const chip = document.createElement("div");
    chip.className = "player-chip";
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
        if (!nomesForaDaLista.includes(nomeDigitado)) {
            nomesForaDaLista.push(nomeDigitado);
            renderizarForaList();
        }
        return;
    }

    nomesJaResolvidos.add(nomeDigitado);
    acertosEscalacao++;

    const btn = document.getElementById(`slot-btn-${slot.slot_id}`);
    if (btn) btn.classList.add("correct");

    atualizarProgressoEscalacao();
    renderizarFaltam();

    setTimeout(() => {
        renderizarCampo();

        if (acertosEscalacao >= dadosEscalacao.jogadores_ocultos.length) {
            escalacaoSearchInput.disabled = true;
            escalacaoEndMessageEl.classList.remove("hidden");
            escalacaoEndMessageEl.innerHTML = "🏆 Escalação completa! Você identificou os 11 titulares.";
            dispararConfetes();
        }
    }, 500);
}

// Navegação
btnPlayEscalacao.addEventListener("click", async () => {
    homeView.classList.add("hidden");
    escalacaoView.classList.remove("hidden");

    const tarefas = [];
    if (jogadores.length === 0) tarefas.push(carregarJogadores());
    if (JOGADORES_COM_FOTO.length === 0) tarefas.push(carregarManifestoFotos());
    if (!dadosEscalacao) tarefas.push(carregarEscalacao());

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

