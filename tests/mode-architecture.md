# Arquitetura dos modos — auditoria do Checkpoint 6A

Data da auditoria: 25/08/2026.
Base auditada: `main` em `82a573e`, `script.js` com 3.336 linhas.
Escopo: documentação do comportamento existente. Nenhuma recomendação abaixo representa mudança já implementada.

## 1. Mapa atual de `script.js`

As faixas são contíguas e somam exatamente 3.336 linhas. A classificação é aproximada porque alguns blocos têm chamadas transversais.

| Categoria | Faixas | Linhas | Conteúdo dominante |
|---|---:|---:|---|
| J — integração entre módulos | 1–46 | 46 | namespaces de storage, core, history-stats, sharing, dialogs e autocomplete |
| A — bootstrap/orquestração | 47–169; 3315–3336 | 145 | helpers gerais de storage, estado/base global, referências DOM e inicialização |
| B — Home | 170–225; 419–608 | 246 | primeira visita, data local, sincronização e renderização do progresso diário |
| H — Histórico/UI restante | 226–418; 609–1098 | 683 | histórico, estatísticas integradas, calendário, dialogs e Como Jogar |
| G — resultado/overlay | 1099–1226 | 128 | dados do resultado, continuidade, 4/4, Home, sharing e listeners do overlay |
| C — Clássico | 1227–1704 | 478 | sorteio, timer, save, navegação, regras, render, tentativa e sharing |
| I — utilitários residuais | 1705–1733 | 29 | widget de links úteis e listeners globais próprios |
| D — Foto | 1734–2116 | 383 | manifesto, imagens, dificuldade, save, runtime, autocomplete e tutorial |
| E — Mais ou Menos | 2117–2718 | 602 | geração v1/v2, snapshots, runtime, timers, save, render e conclusão |
| F — Onze Inicial | 2719–3314 | 596 | partida, slots, placar, campo, save/migração, autocomplete e conclusão |

Responsabilidades transversais ainda misturadas nos blocos dos modos: `atualizarTimer` escreve também em Foto, MM e Onze; helpers de foto vivem no início de Foto, mas são consumidos por MM e Onze; builders específicos de Foto/MM ficam no bloco do Clássico; todo save chama `sincronizarProgressoDiario`.

## 2. Clássico

### Estado e dependências

Globals próprios: `jogadorSecreto`, `jogoAtivo`, `stats`, `estadoDiario`, `timerInterval` e `DATA_LANCAMENTO`. Compartilhados: `jogadores`, data/core, normalizadores, histórico/Home, overlay, sharing, confete e autocomplete.

| Grupo | Funções/estado | DOM | Storage | Dependências e chamadas principais |
|---|---|---|---|---|
| Pure domain | `sortearJogadorDoDia`, `atributoAusente`, `formatarAtributoClassico`, `compararTexto`, `compararNumero`, `extrairNomesTitulos`, `compararTitulos`, `numeroDoDesafio` | não | não | `hashString`, `jogadores`, data civil/Date; chamadas por início, render e sharing |
| State | `carregarEstadoDiario`, `salvarEstadoDiario`, `carregarEstatisticasLegadas`, `salvarEstatisticaVitoria` | não | lê/escreve | `NormalizadoresStorage`, `localStorage`, `sincronizarProgressoDiario` |
| DOM/render | `iniciarDesafioDiario`, `renderizarTentativa`, `mostrarFimDeJogo`, `atualizarTimer` | lê/escreve | início lê indiretamente | usa estado, jogadores, comparadores, confete, overlay e timers |
| Events | listeners de `btnPlayDiario`, `backHomeBtn`, `shareResultBtn` | sim | indireto | registrados uma vez no bootstrap |
| Adapter | `fecharAutocomplete` e configuração `autocompleteClassico` | sim | não | pool `jogadores`, exclui tentativas; `onSelect` chama `fazerPalpite` |
| Integration | `carregarJogadores`, `fazerPalpite`, `gerarGridEmojis`, `gerarTextoCompartilhamento`, `compartilharResultado` | parcial | escreve via save | JSON, sharing, animação, overlay e histórico |

Fluxo: abrir modo → garantir `jogadores.json` → `sortearJogadorDoDia(data)` → normalizar/restaurar save → renderizar tentativas instantâneas → autocomplete → `fazerPalpite` → render animado → salvar → em acerto atualizar stats/histórico → resultado estático e overlay.

Fronteira futura segura: um módulo deve receber `players`, data/hash, storage adapter, autocomplete adapter, elementos DOM e callbacks `onProgressChanged`, `onCompleted`, `onShare`. O carregamento único de `jogadores.json`, Home, overlay e timer geral devem permanecer no orquestrador.

## 3. Foto

### Estado e dependências

Constantes/estado próprios: `PASTA_FOTOS`, `MAX_TENTATIVAS_FOTO`, `CHAVE_ESTADO_FOTO`, `CHAVE_TUTORIAL_FOTO`, `NIVEIS_FOTO`, `jogadorSecretoFoto`, `tentativasFoto`, `fotoAtiva`, `pretoEBrancoAtivo`, `estadoFotoDiario`. `JOGADORES_COM_FOTO`, `slugify`, `definirFotoJogador`, `jogadoresComFotoObjetos` e elegibilidade fotográfica são hoje compartilhados com MM/Onze.

| Grupo | Funções | Efeitos/dependências |
|---|---|---|
| Pure domain | `validarManifestoFotos`, `slugify`, `calcularDificuldadeFoto`, `sortearJogadorFotoDoDia`, `obterJogadorFotoDoEstado` | manifesto/jogadores, `hashString(data + "-foto")`; sorteio é **DETERMINISM-CRITICAL** |
| State | `carregarEstadoFoto`, `salvarEstadoFoto` | normalizador, chave própria, sincronização do histórico |
| DOM/render | `definirFotoJogador`, `renderizarDotsFoto`, `atualizarImagemFoto`, `atualizarCompartilhamentoEstaticoFoto` | imagem, blur/grayscale, dots, texto e ação estática |
| Runtime | `iniciarDesafioFotoDoDia`, `fazerPalpiteFoto` | restauração, seis tentativas, vitória/derrota, confete e overlay |
| Adapter | `fecharAutocompleteFoto`, `autocompleteFoto` | somente pool fotográfico; exclui tentados; chama `fazerPalpiteFoto` |
| Integration | `carregarManifestoFotos`, sharing Foto, tutorial e navegação | fetch do manifesto, dialog compartilhado, `localStorage` do tutorial |

F5/reentrada: o save normalizado resolve a identidade persistida do jogador; tentativas são restauradas antes de `atualizarImagemFoto`; estado concluído revela blur 0 e oferece sharing estático sem reabrir overlay.

Fronteira futura: antes de `photo-mode.js`, separar conceitualmente (não agora) o catálogo compartilhado de fotos do runtime do modo. O módulo Foto receberia catálogo, players, storage, DOM, autocomplete e callbacks de integração. Dificuldade, níveis, tentativas e conclusão sairiam juntos.

## 4. Mais ou Menos

### A — geração determinística

**DETERMINISM-CRITICAL:** `gerarPRNG`, `embaralharComSemente`, `embaralharComRngMM`, `maiorSequenciaIgualMM`, `maiorSequenciaAlternadaMM`, `gerarPlanoDirecoesMM`, `direcaoComparacaoMM`, `dificuldadeComparacaoMM`, `atendeDificuldadeExpandidaMM`, `construirSequenciaExataMM`, `construirSequenciaComFallbackMM`, `gerarDesafioMMV2`, `gerarSequenciaMMV1`, `jogadorTemJogosValidosMM` e `jogadoresElegiveisMM`.

- v1: `hashString(data + "-mm")`, shuffle e corte de 11 jogadores; mantido para migração.
- v2: `hashString(data + "-mm-v2")`, PRNG, plano de dificuldades 3/4/3, plano de direções com limites de sequências e até 12 tentativas de construção.
- O pool exige foto e `jogos` finito. Fallbacks mantêm resultado determinístico quando o plano exato não fecha.
- Empate é tratado pela comparação existente; não deve ser reinterpretado numa extração.

### B — estado da sessão

`sequenciaMM`, `referenciaAtualMM`, `rodadaAtualMM`, `acertosMM`, `historicoMM`, `mmAtivo`, `estadoMMDiario`, `transicaoMMAtiva`. `iniciarDesafioMMDoDia` hidrata essas variáveis a partir do snapshot ou gera/migra a sequência.

### C — renderização

`renderizarDotsMM`, `renderizarRodadaMM`, `mostrarFimDeJogoMM` e parte de `responderMM`. Dependem de muitos elementos DOM, `definirFotoJogador`, labels, classes de resposta e resultado estático.

### D — timers

`timerAvancoMM`, `cancelarAvancoAutomaticoMM`, `agendarAvancoAutomaticoMM`; atraso funcional fixo `ATRASO_AVANCO_MM = 1500`. A guarda verifica view oculta e estado atual antes de avançar. Há também feedback de sharing e timer global até meia-noite.

### E — persistência

`carregarEstadoMM`, `salvarEstadoMM`, `snapshotSequenciaMM`, `restaurarSequenciaSalvaMM`, `registrarSequenciaNoEstadoMM`. O snapshot completo protege partidas iniciadas contra mudanças futuras do JSON; `sequenciaNomes` sustenta legado. `NormalizadoresStorage.normalizeMoreLess` faz a fronteira de compatibilidade.

### F — integração com resultado

`responderMM` grava histórico e agenda avanço; ao fim, `mostrarFimDeJogoMM(comAnimacao)` define vitória por `MIN_ACERTOS_MM = 7`, atualiza sharing estático e abre overlay apenas em conclusão imediata. Navegação cancela timer pendente.

Fronteira recomendada: dividir MM em dois checkpoints. Primeiro extrair gerador puro v1/v2 com fixtures idênticas; depois runtime/DOM/save/timers. Mover tudo de uma vez elevaria desnecessariamente o risco.

## 5. Onze Inicial

### Seleção determinística

`selecionarPartidaDoDia` usa `hashString(data + "-onze")` para a partida e `hashString(data + "-onze-slots-" + partida.id)` para embaralhar índices. Retorna cópia projetada com exatamente três `jogadores_ocultos` (`MAX_OCULTOS_ESCALACAO`) e os demais visíveis. Essas seeds, o shuffle e a ordem dos titulares são **DETERMINISM-CRITICAL**.

### Estado e persistência

Globals: `PARTIDAS_ESCALACAO`, `dadosEscalacao`, `nomesJaResolvidos`, `nomesForaDaLista`, `acertosEscalacao`, `errosEscalacao`, `estadoEscalacao`. `carregarEstadoEscalacao` fornece contexto ao normalizador; `sincronizarEstadoEscalacaoComPartida` aceita legado sem `partidaId`/`exactScore`; `criarEstadoEscalacaoNovo` define o shape atual.

### UI da partida e campo

`aplicarContextoEscalacao`, `restaurarResultadoEscalacao`, `iniciarTelaEscalacao`, `confirmarPalpitePlacar`, `iniciarOnzeInicial`, `restaurarEstadoOnzeInicial`, `renderizarCampo`, `criarChipVisivel`, `criarChipOculto`, `renderizarFaltam`, `atualizarProgressoEscalacao`, `renderizarForaList`, `mostrarFeedbackEsc` e `renderizarResultadoConclusaoEscalacao`.

As coordenadas `top/left` e `posicao_abrev` vêm de `partidas.json`; o renderer apenas projeta esses valores. O placar é uma etapa anterior ao campo. `processarPalpiteEscalacao` distingue já resolvido, fora do onze e slot oculto correto; atualiza save antes da revelação atrasada de 500 ms.

### Integrações

- Autocomplete usa toda a base de jogadores, limite 8 e renderer com avatar.
- Fotos usam catálogo/slug compartilhados.
- Sharing usa `construirTextoCompartilhamentoOnze` e fallback de clipboard específico.
- Conclusão salva `etapa = "concluido"`, `concluido = true`, revela campo, dispara confete e overlay.
- Countdown vem do timer global e não deve entrar no módulo de campo.

Fronteira futura: extrair primeiro seleção/projeção determinística para um módulo puro; depois runtime do placar/campo com storage adapter. Fetch de JSONs, Home, countdown e overlay permanecem no orquestrador.

## 6. Matriz de dependências

`DIRECT` significa chamada/leitura no bloco do modo; `INDIRECT` significa acesso por helper central, callback ou dado previamente preparado.

| Dependência | Clássico | Foto | MM | Onze |
|---|---|---|---|---|
| core | DIRECT | DIRECT | DIRECT | DIRECT |
| history-stats | INDIRECT | INDIRECT | INDIRECT | INDIRECT |
| sharing | DIRECT | DIRECT | DIRECT | DIRECT |
| ui/dialogs | INDIRECT | DIRECT | INDIRECT | INDIRECT |
| autocomplete | DIRECT | DIRECT | NONE | DIRECT |
| storage normalizers | DIRECT | DIRECT | DIRECT | DIRECT |
| `jogadores.json` | DIRECT | DIRECT | DIRECT | DIRECT |
| `partidas.json` | NONE | NONE | NONE | DIRECT |
| `fotos-manifest.json` | NONE | DIRECT | DIRECT | DIRECT |
| overlay | DIRECT | DIRECT | DIRECT | DIRECT |
| Home | INDIRECT | INDIRECT | INDIRECT | INDIRECT |
| timers | DIRECT | DIRECT/INDIRECT | DIRECT | DIRECT/INDIRECT |
| DOM | DIRECT | DIRECT | DIRECT | DIRECT |

Acoplamentos escondidos:

- `sincronizarProgressoDiario` lê os quatro saves e é chamado por todos os writers.
- `atualizarTimer` conhece elementos/estados de Clássico, Foto, MM e Onze.
- catálogo/fallback de fotos está no bloco Foto, mas MM e Onze dependem dele.
- sharing Foto/MM está fisicamente no bloco Clássico.
- `dispararConfetes`, data/número do desafio e carregamento de jogadores são compartilhados.
- overlay lê diretamente globals internos dos quatro modos para montar métricas.

## 7. Globals relevantes

| Global | Escritor(es) | Leitor(es) | Encapsulável | Risco |
|---|---|---|---|---|
| `jogadores` | `carregarJogadores` | quatro modos, overlay/sharing | manter como dado injetado | alto impacto transversal |
| `jogadorSecreto`, `jogoAtivo`, `estadoDiario` | runtime Clássico | render, autocomplete, sharing, overlay, histórico | sim, estado Classic | médio |
| `stats` | legado Classic | writer de vitória | sim, mas compatibilidade legada | médio |
| `JOGADORES_COM_FOTO` | manifesto | Foto, MM, Onze | catálogo compartilhado | alto se movido junto de Foto |
| `jogadorSecretoFoto`, `tentativasFoto`, `fotoAtiva`, `pretoEBrancoAtivo`, `estadoFotoDiario` | runtime Foto | render, save, autocomplete, overlay/sharing | sim, estado Photo | médio |
| `sequenciaMM`, `referenciaAtualMM`, `rodadaAtualMM`, `acertosMM`, `historicoMM`, `mmAtivo`, `estadoMMDiario` | runtime MM | render, save, sharing, overlay | sim, estado MM | alto |
| `timerAvancoMM`, `transicaoMMAtiva` | timer/runtime MM | resposta, navegação | sim, lifecycle MM | alto |
| `PARTIDAS_ESCALACAO`, `dadosEscalacao` | loader/seleção Onze | save, campo, sharing, overlay | dados injetados + estado Onze | alto |
| `nomesJaResolvidos`, `nomesForaDaLista`, `acertosEscalacao`, `errosEscalacao`, `estadoEscalacao` | runtime Onze | render/save/overlay | sim, estado Lineup | alto |
| `finalResultModeType` | overlay | fechar/compartilhar | permanecer no orquestrador | baixo |
| `timerInterval` | timer global | bootstrap | permanecer compartilhado | baixo |

## 8. Listeners e lifecycle

| Modo | Registrados uma vez | Dinâmicos/render | Timers/callbacks | Risco ao modularizar |
|---|---|---|---|---|
| Clássico | abrir, voltar, compartilhar; autocomplete registra input/keydown/document click | nenhum listener por tentativa | flips 200/300 ms, conclusão, feedback share | evitar registrar autocomplete novamente em cada abertura |
| Foto | abrir, voltar, contraste, sharing, tutorial; autocomplete 3 listeners fixos | opções recebem click enquanto renderizadas | feedback share; dialog via `ui.js` | catálogo assíncrono e tutorial não podem duplicar registro |
| MM | menos, mais, abrir, voltar, sharing | nenhum listener por rodada | timer único de 1500 ms cancelável | cleanup do timer é contrato crítico |
| Onze | confirmar placar, abrir, voltar, sharing; autocomplete 3 listeners fixos | cada opção recebe click; chips não têm listeners | feedback 2200 ms, revelação 500 ms, share 1800 ms | callbacks tardios e reentrada exigem guarda/lifecycle |

Listeners de autocomplete são criados uma vez na avaliação de `script.js`; itens recebem um click por render e são descartados com a lista. Histórico e overlay possuem listeners próprios, fora dos modos. Não há hoje montagem/desmontagem de módulos; uma futura factory deve ser criada uma única vez ou oferecer `destroy()` real.

## 9. Storage por modo

| Modo | Chave | Shape observado | Leitura/migração | Escrita/restauração |
|---|---|---|---|---|
| Clássico | `timaodle_daily_state` | data, jogador secreto/identidade normalizada, `tentativas`, `status` | `normalizeClassic`, validado contra players/segredo | a cada palpite e vitória; re-render instantâneo |
| Foto | `timaodle_foto_daily_state` | data, jogador, `tentativas`, `status` | `normalizePhoto`, player names e pool fotográfico | a cada tentativa/conclusão; blur derivado da quantidade |
| MM | `timaodle_mm_daily_state` | data, status, rodada, acertos, histórico, versão, nomes, snapshots, planos | `normalizeMoreLess`; restaura snapshot, nomes ou regenera v1/v2 | a cada resposta/transição relevante; resultado estático em reentrada |
| Onze | `timaodle_escalacao_daily_state` | data, partidaId, etapa, palpites, resolvidos, fora, erros, exactScore, concluído | `normalizeLineup`; migra `partidaId` e `exactScore` ausentes | placar, erro, acerto e conclusão; reconstitui campo |

Todos escrevem diretamente no `localStorage` por helpers do `script.js` e depois chamam `sincronizarProgressoDiario`. O histórico integrado usa `timaodle_history_v1`; os modos não escrevem seu shape manualmente, mas provocam sua sincronização central. Clássico também mantém `timaodle_stats`; Foto mantém `timaodle_foto_tutorial_visto`.

## 10. DOM por modo

- **Clássico — owned:** `gameView`, `searchInput`, `autocompleteList`, `attemptsContainer`, mensagem final, botão share, timer e retorno. **Shared/external:** `homeView`, `pageContent`, overlay e confete.
- **Foto — owned:** `photoView`, imagem, dificuldade, contraste, input/listbox, dots, tentativas, resultado estático e tutorial. **Shared/external:** Home, overlay, timer e catálogo de fotos.
- **MM — owned:** `maisMenosView`, card/referência/candidato, botões Mais/Menos, stats, feedback, dots, resultado e share. **Shared/external:** Home, overlay, timer e imagens.
- **Onze — owned:** `escalacaoView`, contexto, inputs/botão de placar, resultado, campo, input/listbox, FALTAM, Fora, progresso, completion e share. **Shared/external:** Home, overlay, countdown e imagens.

Os 168 IDs atuais são contratos. Elementos owned podem futuramente ser agrupados num objeto `elements`; elementos shared devem ser fornecidos por callback/adaptador, não buscados pelo módulo de modo.

## 11. Overlay, Home e Histórico

Contrato atual de conclusão:

- Clássico chama `abrirResultadoFinal("classic")` após vitória animada.
- Foto chama `abrirResultadoFinal("photo")` em vitória ou sexta tentativa/derrota.
- MM chama `abrirResultadoFinal("moreLess")` após o atraso da décima rodada.
- Onze chama `abrirResultadoFinal("lineup")` ao resolver o terceiro oculto.

`dadosResultadoFinal` lê globals dos modos para produzir outcome/métrica; `renderizarModosPendentesResultado` consulta progresso central; sharing do overlay despacha por `finalResultModeType`. Contrato mínimo futuro recomendado: `onCompleted({ mode, outcome, metric, secondary? })`, enquanto o orquestrador continua responsável por progresso 4/4, continuidade, Home, dialog e despacho de sharing.

Histórico: cada save chama `sincronizarProgressoDiario`; este carrega os quatro saves normalizados, deriva resumo via `history-stats` e persiste somente o resumo permitido em `timaodle_history_v1`. Portanto a dependência dos modos com Histórico é indireta, mas obrigatória. Um storage adapter futuro deve preservar o callback de sincronização depois de cada escrita.

## 12. Funções determinism-critical

- Compartilhadas: `getDataLocalString`, `hashString`, ordem original dos JSONs e elegibilidade dos pools.
- Clássico: `sortearJogadorDoDia`.
- Foto: `validarManifestoFotos`, `jogadoresComFotoObjetos`, `sortearJogadorFotoDoDia`, `obterJogadorFotoDoEstado` e seed `-foto`.
- MM: toda a cadeia listada na seção 4, seeds `-mm` e `-mm-v2`, plano 3/4/3, ordem dos fallbacks e snapshots.
- Onze: `selecionarPartidaDoDia`, shuffle herdado, seed `-onze`, seed `-onze-slots-${partida.id}`, ordem dos titulares e limite três.

`tests/daily-determinism.test.js` fixa 65 assertions em cinco datas e fingerprints dos quatro modos. `game-rules.test.js` adiciona 180 datas para MM v2. Essas funções não devem ser editadas durante movimentação sem comparar fixtures antes/depois.

## 13. Cobertura existente e lacunas

| Modo | Proteção direta | Proteção indireta | Dependência de harness | Lacunas antes do runtime modular |
|---|---|---|---|---|
| Clássico | determinismo; comparações via regras/estrutura; autocomplete | storage, sharing, overlay, histórico | `script-harness` extrai sorteio e funções | lifecycle DOM completo e animações são sobretudo manuais |
| Foto | `photo-progression` (5), determinismo, autocomplete, final-result/sharing | storage, reduced-motion, estrutura | forte extração textual de `script.js` | teste usa marcador textual antigo/frágil; runtime completo ainda manual |
| MM | 180 datas/invariantes, determinismo, resultado/sharing | storage, reduced-motion, histórico | extrai grande cadeia pelo harness | timers/transição/reentrada têm parte estrutural, não DOM integrado |
| Onze | determinismo, sharing, storage, estrutura/autocomplete | overlay, histórico, IDs | extrai seleção via harness | placar/campo/acerto/erro/migração não têm suíte DOM dedicada |

Não foi criado `mode-contracts.test.js` neste checkpoint: as invariantes de maior risco (seeds, MM, saves, autocomplete, sharing, overlay e IDs) já têm cobertura executável. Criar um teste documental genérico duplicaria contratos. Antes de cada extração de runtime, porém, deve-se adicionar caracterização dirigida ao modo: primeiro corrigir a fragilidade textual de Foto; antes de Onze, cobrir seleção de placar, erro/acerto e restauração; antes do runtime MM, testar explicitamente cancelamento/guarda do timer.

## 14. Ranking e ordem recomendada

| Ordem | Modo/parte | Risco | Motivo |
|---:|---|---|---|
| 1 | Clássico | MÉDIO | fluxo maduro, sem manifesto próprio, sem derrota, estado menor; ainda toca animação, sharing, histórico e overlay |
| 2 | Foto | MÉDIO | bloco menor e mecânica linear; depende do catálogo fotográfico compartilhado e de tutorial/dialog |
| 3 | MM | ALTO | maior núcleo determinístico, snapshots/migração, fallbacks e timer funcional; deve ser dividido |
| 4 | Onze Inicial | MUITO ALTO | dois estágios, dois JSONs, migração, campo coordenado, autocomplete, timers e grande superfície DOM |

Embora Foto tenha menos linhas, Clássico deve sair primeiro porque não exige decidir previamente onde ficará o catálogo de imagens compartilhado por três modos.

## 15. Próximos checkpoints propostos

1. **6B — caracterização e extração do Clássico:** adicionar testes direcionados ao estado/render antes do movimento; criar `classic-mode.js`; manter loaders/Home/overlay no orquestrador.
2. **6C — catálogo compartilhado de fotos:** extrair somente manifesto, slug, fallback e elegibilidade para uso de Foto/MM/Onze, com fingerprints dos pools.
3. **6D — extração do modo Foto:** mover níveis, dificuldade, estado e runtime; corrigir previamente testes textuais frágeis.
4. **6E — core determinístico do MM:** mover PRNG, planos, seleção v1/v2 e fallbacks para módulo puro, mantendo fingerprints e 180 datas.
5. **6F — runtime do MM:** mover estado, snapshots, render e timers com caracterização específica de lifecycle/reentrada.
6. **6G — seleção determinística do Onze:** mover partida/slots para módulo puro sem tocar no campo.
7. **6H — runtime do Onze:** caracterizar placar, campo, migração, acertos/erros e então mover DOM/state.
8. **6I — limpeza do orquestrador:** remover adaptadores mortos somente após quatro módulos estáveis; reauditar listeners, globals e carregamento.

## 16. Estimativas

| Extração | Linhas que podem sair de `script.js` | Novo módulo aproximado | Complexidade |
|---|---:|---:|---|
| Clássico | 360–430 | 420–520 | média |
| catálogo fotográfico | 80–120 distribuídas | 100–150 | média/transversal |
| Foto | 280–340 adicionais | 340–430 | média |
| MM core | 190–250 | 230–310 | alta por determinismo |
| MM runtime | 260–330 | 330–430 | alta por timers/save |
| Onze seleção | 50–90 | 80–130 | alta por fingerprints |
| Onze runtime | 400–500 | 500–650 | muito alta |

Há sobreposição: as estimativas não devem ser somadas mecanicamente. Ao final, `script.js` deveria manter bootstrap, loaders JSON, referências compartilhadas, Home, Histórico/Estatísticas, overlay, timer global e adaptadores pequenos. Uma faixa plausível é 1.300–1.700 linhas, sem meta rígida.

## 17. Critérios de segurança para futuras extrações

- conservar nomes/ordem dos JSONs e seeds byte a byte;
- construir cada módulo com browser namespace + CommonJS, sem ES Modules;
- injetar storage/DOM/callbacks em vez de importar regras de Home/overlay;
- criar uma única instância por modo e oferecer cleanup quando houver timers/listeners;
- não mover simultaneamente domínio determinístico e runtime de MM/Onze;
- manter `sincronizarProgressoDiario` depois de toda escrita;
- comparar fingerprints, shapes normalizados, listener counts e reentrada antes/depois;
- validar manualmente F5, conclusão imediata versus reentrada e mobile após cada extração.
