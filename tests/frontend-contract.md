# Contrato estrutural do frontend — v2.7

Este mapa documenta estados que ligam `script.js`, `index.html` e `style.css`.
O teste permanente correspondente é `frontend-structure.test.js`.

## Classes dinâmicas essenciais

- Home: `hidden`, `is-complete`, `is-not-started`, `is-in-progress`, `is-completed`, `celebrate-once`.
- Clássico: `autocomplete-active`, `reveal`, `correct`, `partial`, `wrong`, `shake`.
- Foto: `active`, `image-fallback`, `used`, `wrong-used`, `correct`, `wrong`, `facil`, `medio`, `dificil`.
- Mais ou Menos: `answered`, `answer-correct`, `answer-wrong`, `revealed`, `correct-answer`, `tie`, `resultado-final`, `mm-round-enter`, `won`, `lost`.
- Onze Inicial: `dense-line`, `correct`, `acertou`, `errou`, `hidden`.
- Modais/autocompletes: `hidden`, `modal-open`, `autocomplete-active`.
- Links úteis: `open`.

`reveal`, `shake`, `celebrate-once` e `mm-round-enter` são decorativas. Elas entram no
mapa para evitar CSS órfão, mas não representam estado persistido nem regra do jogo.

As setas do Clássico são conteúdo textual (`↑`/`↓`), não classes. As etapas do Onze
Inicial são representadas principalmente pela visibilidade de elementos e pelo save;
não existe uma classe única para cada etapa.

## Viewports canônicos

- 360 × 800
- 390 × 844
- 412 × 915
- 430 × 932
- 480 × 900
- 768 × 1024
- 1440 × 1000 (desktop amplo)
- 412 × 600 (viewport baixo)

O runner Node não depende de navegador. O smoke test real de overflow é separado:

```text
node tests/viewport-smoke.js
```

## Shell global

- `body.app-shell` mantém a viewport travada; `.page-content` é o único scroll vertical principal.
- `--shell-max-width`, `--shell-gutter` e `--shell-inline-space` alinham header, conteúdo e footer.
- O gutter varia fluidamente entre 12 e 16 px, sem salto estrutural em 480/481 px.
- Os quatro grupos principais da Home usam o mesmo limite de 400 px nos dois lados de 480 px.

## Home

- A seção principal da Home concentra estrutura, progresso, streak, estatísticas, conclusão e cards dos modos.
- Espaçamentos, padding e tipografia responsiva usam `clamp()` onde substituem os antigos overrides de 360/480 px.
- Permanece apenas a exceção visual de 480 px para mudar a borda de conclusão 4/4 de lateral para superior.
- `is-complete`, `is-in-progress`, `is-completed` e `celebrate-once` continuam protegidas como estados do JavaScript.

## Componentes compartilhados

- `.search-box` e `.autocomplete-items` controlam aparência, foco, scroll e alvos de toque; cada modo mantém somente largura e posicionamento próprios.
- Onze Inicial preserva a variante de busca com 52 px, avatar e lista mais alta; o autocomplete ARIA completo continua pendente.
- `.daily-status-bar`, `.back-btn`, `.daily-end-message` e `.escalacao-feedback` compartilham estrutura sem apagar suas diferenças semânticas.
- `.share-btn` e `.form-submit-btn` compartilham a ação dourada; Home, Onze Inicial e formulários mantêm variantes locais.
- Botões e resultados específicos do Mais ou Menos permanecem fora dessa base.
