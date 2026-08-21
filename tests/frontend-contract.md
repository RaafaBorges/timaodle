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

## Modo Foto

- `#photoView` possui limite próprio de 400 px e continua fluido abaixo desse valor.
- Imagem quadrada e lista de tentativas compartilham o limite fluido de 320 px.
- Enquadramento, fallback e estados de revelação permanecem proprietários do modo.
- Busca, autocomplete, barra de status e mensagem final consomem a base compartilhada sem overrides responsivos.
- O tutorial continua sob a infraestrutura comum e acessível de modais, sem CSS duplicado no Foto.

## Modo Clássico

- `#gameView` delimita tabuleiro, tentativas, células, animações e estados de comparação.
- Desktop preserva oito colunas na ordem Jogador, Posição, Nacionalidade, Estreia, Pé,
  Títulos, Gols e Assistências.
- Em até 480 px, o cabeçalho é ocultado e cada tentativa vira uma grade de duas colunas;
  Jogador e Títulos ocupam a largura completa.
- As labels mobile permanecem ligadas à ordem das oito células por `nth-child`.
- Células usam quebra normal de palavras, com `overflow-wrap: break-word` apenas como proteção.
- Busca, autocomplete, status, mensagem final e compartilhamento continuam na base compartilhada.

## Mais ou Menos

- `#maisMenosView` delimita todos os cards, jogadores, ações, feedback e resultado do modo.
- View e painel usam limites fluidos de 540 e 520 px, respectivamente.
- Os nomes permanecem limitados a duas linhas e usam quebra natural por palavras.
- O overlay é absoluto e contido pelo `.mm-card`, com entrada de 180 ms e barra temporal de 1,5 s.
- O atraso funcional de 1,5 s continua definido no JavaScript por `ATRASO_AVANCO_MM`.
- Os breakpoints 680, 480 e 360 px preservam a escala de fotos 88, 80, 72 e 64 px.
- O bloco de movimento reduzido desativa revelação, overlay, barra temporal e entrada da rodada.

## Onze Inicial

- `#escalacaoView` limita o modo a 440 px e seus painéis a `min(430px, 100%)`.
- `.pitch` preserva proporção 2/3; `.player-chip` continua absoluto, portanto `top` e `left`
  percentuais do JSON permanecem a fonte das coordenadas.
- Labels de jogadores aceitam até duas linhas e usam quebra natural por palavras.
- `dense-line` é aplicada pelo JavaScript quando quatro ou mais atletas compartilham a mesma
  coordenada `top`; reduz somente largura, padding e fonte do rótulo, sem mover o marcador.
- Placar, busca com avatar, feedback `aria-live`, resultado, countdown e compartilhar mantêm
  variantes proprietárias.
- Os breakpoints 480 e 360 px preservam os degraus de campo, jogadores, labels e placar.

## Hardening responsivo final

- Existe um único bloco `prefers-reduced-motion`, cobrindo celebração 4/4, Clássico,
  Onze Inicial, widget e todas as animações temporais do Mais ou Menos.
- O widget permanece fixo na lateral no desktop e migra para o canto inferior direito até
  480 px; seu painel usa limites vinculados ao viewport e não participa da largura do shell.
- Seletores confirmadamente mortos do modal estatístico antigo e das caixas inexistentes
  do campo não fazem mais parte do CSS.
- A validação ARIA completa dos três autocompletes permanece uma etapa funcional separada.
