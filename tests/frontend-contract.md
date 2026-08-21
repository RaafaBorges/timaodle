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
