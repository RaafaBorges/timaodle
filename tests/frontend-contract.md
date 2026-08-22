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
- Estatísticas e Histórico dividem uma ação secundária compacta, mantendo o limite de 400 px da Home.

## Histórico / calendário

- `#historyModal` reutiliza a infraestrutura acessível comum sem herdar a largura de outro modal.
- `.history-modal-content` preserva a base fluida de 500 px no mobile, amplia o modal para
  até 720 px a partir de 700 px e continua usando `100dvh` para viewports baixos.
- O modal de Estatísticas amplia somente em tablet/desktop para até 820 px; seu grid 2 × 2
  de modos e as quatro colunas de métricas gerais permanecem inalterados.
- Ambos os modais usam `calc(100vw - 48px)` na camada ampla, garantindo gutters de 24 px.
- A grade possui sete colunas, começa na segunda-feira e consome somente os dados puros da Fase A.
- Estados `future`, `before-tracking`, `no-record`, `recorded`, `started`, `partial` e `complete`
  permanecem combináveis com `is-today` e `is-selected`.
- Futuro e pré-tracking usam botões realmente desabilitados; dias sem registro continuam selecionáveis.
- Seleção e mês exibido existem apenas em memória e não alteram `timaodle_history_v1`.
- A grade usa roving tabindex: somente a data navegável em foco participa da ordem de Tab;
  dias futuros, pré-tracking e vazios nunca recebem foco.
- Setas movem o foco por um ou sete dias, inclusive entre meses; Home/End respeitam a
  semana iniciada na segunda e PageUp/PageDown preservam o dia quando possível.
- Movimento de foco não altera seleção nem resumo. Enter, Espaço e clique confirmam a
  seleção; todos os movimentos respeitam `trackingStartedAt` e hoje.
- A troca de mês por teclado anuncia somente o título do novo mês; o resumo `aria-live`
  continua estável até uma seleção explícita.
- O resumo do dia usa uma allowlist derivada exclusivamente do registro normalizado selecionado.
- Dias completos exibem uma linha compacta com a sequência histórica acumulada até a data
  selecionada; dias parciais, ausentes e futuros não exibem esse destaque.
- O streak histórico deriva somente de `day.complete === true`, respeita `trackingStartedAt`
  e hoje, e não altera nem reutiliza a semântica do streak geral da Home.
- Dias sem registro exibem somente mensagem neutra; registros `0/4` mantêm as quatro linhas
  para distinguir progresso existente de ausência de dados.
- Clássico, Foto, Mais ou Menos e Onze Inicial usam linhas compactas com estados textuais,
  métricas seguras e progresso geral de `0/4` a `4/4`.
- O resumo nunca recebe nomes, tentativas nominais, sequência do MM, valores de jogos,
  jogadores ocultos, confronto, placar ou palpite.

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

## Autocompletes acessíveis

- Clássico, Foto e Onze Inicial usam inputs `role="combobox"`, com nome acessível,
  `aria-controls`, `aria-expanded` e `aria-activedescendant` sincronizados.
- As listas possuem `role="listbox"`; sugestões recebem `role="option"`, ID previsível
  por modo e `aria-selected` coerente com `.autocomplete-active`.
- O foco permanece no input. Setas circulam pelas opções, Enter exige item ativo,
  Escape fecha sem retirar o foco e Tab conserva o fluxo natural.
- Fechamento, clique externo, lista vazia e nova busca removem qualquer descendant antigo.
- Imagens decorativas do autocomplete do Onze Inicial continuam `aria-hidden`.
