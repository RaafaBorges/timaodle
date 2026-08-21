# TIMÃODLE --- ROADMAP E CONTEXTO DO PROJETO

**Versão do documento:** 2.6\
**Data:** 21/08/2026\
**Projeto:** Timãodle\
**Objetivo deste arquivo:** servir como documento de contexto para
qualquer IA ou desenvolvedor que continuar o projeto (ChatGPT, Claude,
Gemini, Copilot etc.).

------------------------------------------------------------------------

## 1. REGRA PRINCIPAL PARA QUALQUER IA

Antes de modificar o projeto:

1.  Leia este arquivo inteiro.
2.  Analise os arquivos atuais do projeto antes de assumir como algo
    funciona.
3.  Não reescreva o projeto do zero.
4.  Preserve funcionalidades que já estejam funcionando.
5.  Faça mudanças pequenas e verificáveis.
6.  Depois de cada etapa concluída, atualize este roadmap.
7.  Marque o checklist correspondente como concluído.
8.  Registre alterações importantes na seção **Histórico de
    Implementações**.
9.  Se uma alteração mudar a arquitetura ou os dados, documente isso
    aqui.
10. Ao finalizar uma tarefa, informe claramente:

-   o que foi feito;
-   o que foi testado;
-   o que ficou pendente;
-   qual é o próximo item recomendado.

**Importante:** este arquivo é a fonte de contexto do projeto. Se outra
IA receber o projeto sem conhecer a conversa anterior, ela deve
conseguir entender o estado atual lendo este documento.

------------------------------------------------------------------------

# 2. VISÃO DO PROJETO

O **Timãodle** é um jogo inspirado em Wordle, focado no Corinthians.

A aplicação atualmente é feita com:

-   HTML
-   CSS
-   JavaScript puro
-   JSON para dados
-   imagens locais

Não há necessidade de framework/build system neste estágio.

A ideia é oferecer vários modos de desafio relacionados a jogadores,
partidas e história do Corinthians.

------------------------------------------------------------------------

# 3. ESTRUTURA ATUAL

Estrutura principal conhecida:

``` text
corinthiansdle/
├── index.html
├── style.css
├── script.js
├── jogadores.json
├── partidas.json
├── fotos-manifest.json
├── fotos/
├── assets/
├── README.md
├── contato.html
├── cookies.html
├── privacidade.html
└── termos.html
```

### Arquivo central

`script.js`

Atualmente concentra grande parte da lógica dos modos do jogo.

**Não separar em vários arquivos imediatamente.**

A refatoração deve acontecer depois que os quatro modos principais
estiverem consolidados.

------------------------------------------------------------------------

# 4. MODOS EXISTENTES

## 4.1 Modo Diário --- 🟢 MADURO

Mecânica principal:

-   jogador secreto baseado na data;
-   mesma resposta diária para todos;
-   autocomplete;
-   comparação entre jogador escolhido e jogador secreto;
-   posição;
-   nacionalidade;
-   estreia;
-   pé;
-   títulos;
-   gols;
-   assistências;
-   cores de acerto/aproximação/erro;
-   setas para valores maiores/menores;
-   limite de tentativas;
-   localStorage;
-   jogador de ontem;
-   contador para próximo desafio;
-   compartilhamento;
-   estatísticas;
-   nome/apelido;
-   animação de vitória.

### Checklist

-   [x] Escolha diária determinística
-   [x] Autocomplete
-   [x] Comparação de atributos
-   [x] Tentativas
-   [x] Feedback visual
-   [x] Persistência
-   [x] Estatísticas
-   [x] Compartilhamento
-   [x] Contador diário
-   [x] Jogador de ontem
-   [x] Fallback visual para atributos históricos ausentes

------------------------------------------------------------------------

## 4.2 Modo Foto --- 🟢 FUNCIONAL

Mecânica:

-   foto começa difícil de identificar;
-   progressivamente fica mais clara;
-   usuário tenta adivinhar;
-   até 6 tentativas;
-   autocomplete;
-   manifesto de fotos;
-   dificuldade;
-   preto e branco;
-   persistência diária;
-   sorteio determinístico;
-   resultado;
-   confete;
-   tutorial.

### Dados atuais

-   `jogadores.json`: aproximadamente 156 jogadores.
-   Jogadores com foto: 136 de 156 (`87,18%`).
-   20 jogadores ainda não possuem foto e têm `jogos: null`.

### Checklist

-   [x] Foto diária
-   [x] Progressão visual
-   [x] Tentativas
-   [x] Autocomplete
-   [x] Persistência
-   [x] Sorteio determinístico
-   [x] Resultado
-   [x] Confete
-   [x] Tutorial
-   [x] Persistir a identidade do jogador diário após o início do desafio
-   [x] Fallback local para foto indisponível
-   [x] Integrar lote de 16 jogadores com `jogos` válido
-   [ ] Completar fotos dos jogadores restantes

------------------------------------------------------------------------

# 5. MODO MAIS OU MENOS

## Estado: 🟢 FUNCIONAL / POLIMENTO VISUAL CONCLUÍDO

Mecânica:

``` text
Jogador A
   ↓
Mais ou Menos?
   ↓
Jogador B
   ↓
Mais ou Menos?
   ↓
Jogador C
   ↓
...
```

Configuração atual:

-   10 rodadas;
-   objetivo de pelo menos 7 acertos;
-   comparação baseada em número de jogos;
-   campo usado atualmente: `jogos`;
-   jogadores disponíveis dependem do conjunto de jogadores com foto.

O `jogadores.json` atual já possui o campo `jogos`.

Exemplo:

``` json
{
  "nome": "Ado",
  "jogos": 206
}
```

### Ponto importante

A implementação atual utiliza jogadores com foto.

Portanto:

> Adicionar um jogador ao `jogadores.json` não significa automaticamente
> que ele aparecerá no Mais ou Menos se ele não tiver foto.

### Checklist

-   [x] Mecânica de comparação
-   [x] Campo `jogos`
-   [x] 10 rodadas
-   [x] Sistema de acertos
-   [x] Persistência
-   [x] Resultado
-   [x] Estrutura visual inicial
-   [x] Polimento visual seguindo a identidade do Timãodle
-   [x] Melhorar feedback de acerto/erro
-   [x] Destacar rodada, acertos e meta de 7
-   [x] Revisar resultado final
-   [x] Adaptar layout para desktop, tablet, mobile e 360 px
-   [x] Revisar seleção dos jogadores
-   [x] Completar fotos dos 136 jogadores com `jogos` válido
-   [x] Revisar balanceamento das comparações
-   [x] Restringir o pool a jogadores fotografados com `jogos` numérico e finito
-   [x] Fallback local para foto indisponível

------------------------------------------------------------------------

# 6. MODO ONZE INICIAL

## Estado: 🟡 FUNCIONAL / POLIMENTO EM ANDAMENTO

Este é o principal próximo foco do projeto.

Conceito:

1.  Mostrar uma partida.
2.  Usuário tenta adivinhar o placar.
3.  Mostrar resultado real.
4.  Mostrar o campo.
5.  Alguns jogadores podem estar visíveis.
6.  Outros ficam escondidos.
7.  Usuário tenta descobrir os jogadores.
8.  Jogadores corretos aparecem nas posições corretas.

### Dados atuais

`partidas.json` possui aproximadamente 9 partidas.

As partidas já possuem:

-   competição;
-   mandante;
-   visitante;
-   placar real;
-   formação;
-   titulares;
-   posição `top`;
-   posição `left`.

### Estado atual

A persistência do Onze Inicial já foi implementada: partida diária, palpite de placar, jogadores descobertos, erros e conclusão sobrevivem ao recarregamento. O desafio usa 3 jogadores ocultos por partida.

### Checklist prioritário

-   [x] Salvar partida diária
-   [x] Salvar palpite do placar
-   [x] Salvar jogadores descobertos
-   [x] Salvar progresso completo
-   [x] Recuperar estado após F5
-   [x] Impedir reinício indevido
-   [x] Finalizar partida corretamente
-   [x] Tela de resultado
-   [x] Compartilhamento
-   [x] Contador para próximo desafio
-   [x] Melhorar feedback do palpite
-   [x] Melhorar campo
-   [x] Polimento responsivo e visual do campo, busca e resultado
-   [x] Proteger nomes longos no campo em desktop e mobile
-   [x] Auditar visualmente as 9 partidas existentes
-   [x] Adaptar rótulos em linhas com 4 ou mais jogadores
-   [ ] Melhorar posições dos jogadores
-   [ ] Validar historicamente as distribuições declaradas como 4-2-3-1
-   [x] Melhorar autocomplete
-   [ ] Testar em mobile
-   [ ] Expandir banco de partidas

------------------------------------------------------------------------

# 7. BANCO DE JOGADORES

Arquivo:

`jogadores.json`

Estado aproximado:

**156 jogadores**

Dados existentes incluem:

-   nome;
-   posição;
-   nacionalidade;
-   estreia;
-   jogos;
-   pé;
-   títulos;
-   gols;
-   assistências.

Não foram identificados nomes duplicados no conjunto analisado.

### Checklist

-   [x] Estrutura básica
-   [x] Número de jogos
-   [x] Dados estatísticos
-   [x] Jogadores usados no Modo Diário
-   [ ] Completar fotos
-   [ ] Revisar dados inconsistentes
-   [ ] Padronizar nomes
-   [ ] Padronizar posições
-   [ ] Documentar formato oficial do JSON

------------------------------------------------------------------------

# 8. BANCO DE PARTIDAS

Arquivo:

`partidas.json`

Estado aproximado:

**9 partidas**

Estrutura inclui:

-   competição;
-   mandante;
-   visitante;
-   placar;
-   formação;
-   titulares;
-   coordenadas dos jogadores.

### Problema

9 partidas são insuficientes para manter um modo diário por muito tempo.

### Meta

Expandir progressivamente:

``` text
9
↓
50
↓
100
↓
365+
```

### Checklist

-   [ ] 50 partidas
-   [ ] 100 partidas
-   [ ] 365+ partidas
-   [ ] Revisar dados históricos
-   [x] Garantir titulares completos nas 9 partidas atuais
-   [x] Garantir posições válidas nas 9 partidas atuais
-   [ ] Garantir formação
-   [ ] Criar validação dos dados

------------------------------------------------------------------------

# 9. FOTOS

Arquivo de controle:

`fotos-manifest.json`

Pasta:

`fotos/`

O sistema utiliza um manifesto para controlar as fotos.

### Regra

Manter o sistema baseado em manifesto.

Não colocar uma lista gigante de fotos diretamente no `script.js`.

### Checklist

-   [x] Manifesto
-   [x] Fotos locais
-   [x] Integração com jogadores
-   [ ] Completar fotos dos jogadores
-   [x] Validar fotos quebradas e oferecer fallback visual
-   [x] Padronizar nomes de arquivos atuais
-   [x] Validar o manifesto defensivamente em runtime
-   [x] Integrar lote de 16 fotos em JPEG 480×480

------------------------------------------------------------------------

# 10. PERSISTÊNCIA

Atualmente o projeto utiliza `localStorage`.

Estado:

  Modo            Persistência
  --------------- -----------------
  Diário          ✅
  Foto            ✅
  Mais ou Menos   ✅
  Onze Inicial    ✅

### Objetivo

Todos os modos diários devem:

-   sobreviver a F5;
-   sobreviver ao fechamento do navegador;
-   não permitir reinício acidental;
-   guardar resultado;
-   guardar estatísticas necessárias.

------------------------------------------------------------------------

# 11. PRÓXIMA ORDEM DE DESENVOLVIMENTO

## FASE 1 --- FINALIZAR ONZE INICIAL

Prioridade máxima.

``` text
[x] Persistência
[x] Estado da partida
[x] Palpite do placar
[x] Descoberta de jogadores
[x] Recuperação após F5
[x] Finalização
[x] Resultado
[x] Compartilhamento
[x] Contador diário
```

------------------------------------------------------------------------

## FASE 2 --- POLIMENTO DO MAIS OU MENOS

``` text
[x] Visual
[x] Feedback
[x] Animações
[x] Balanceamento
[x] Seleção de jogadores
[ ] Fotos
[x] Resultado final
```

------------------------------------------------------------------------

## FASE 3 --- EXPANDIR DADOS

``` text
[ ] Mais jogadores
[ ] Completar fotos
[ ] 50 partidas
[ ] 100 partidas
[ ] 365+ partidas
```

------------------------------------------------------------------------

## FASE 4 --- ESTATÍSTICAS E EXPERIÊNCIA

``` text
[x] Camada versionada de histórico e progresso diário
[x] Progresso diário integrado na Home
[x] Conclusão visual 4/4
[x] Estatísticas integradas gerais
[x] Sequência diária de dias completos 4/4
[ ] Melhor sequência
[ ] Taxa de acerto
[x] Infraestrutura de histórico
[ ] Interface de histórico/calendário
[ ] Compartilhamento consistente
[ ] Melhor tela de resultado
```

------------------------------------------------------------------------

## FASE 5 --- REFATORAÇÃO

Somente depois dos modos principais estarem consolidados.

Possível estrutura:

``` text
js/
├── app.js
├── data.js
├── utils.js
├── storage.js
├── ui.js
├── daily.js
├── foto.js
├── mais-menos.js
└── onze-inicial.js
```

A refatoração deve preservar o comportamento atual.

------------------------------------------------------------------------

# 12. POSSÍVEIS FUTUROS MODOS

Ainda não implementar sem concluir as fases anteriores.

Ideias:

``` text
[ ] Modo Infinito
[ ] Modo Duelo
[ ] Desafio por época
[ ] Desafio por posição
[ ] Quem jogou com quem?
[ ] Escalação histórica
[ ] Adivinhe a temporada
[ ] Adivinhe a partida
[ ] Modo carreira
```

Essas ideias são backlog, não prioridades atuais.

------------------------------------------------------------------------

# 13. REGRAS DE DESENVOLVIMENTO

### Não fazer

-   Não reescrever o projeto inteiro sem necessidade.
-   Não remover funcionalidades existentes sem autorização.
-   Não trocar a tecnologia sem necessidade.
-   Não substituir JSON por banco de dados sem planejamento.
-   Não criar dependências externas desnecessárias.
-   Não alterar dados históricos sem validar.
-   Não quebrar o funcionamento offline/local atual.

### Fazer

-   Trabalhar incrementalmente.
-   Testar cada alteração.
-   Manter compatibilidade com os dados existentes.
-   Atualizar este roadmap após cada etapa.
-   Documentar decisões importantes.
-   Verificar console do navegador.
-   Testar desktop e mobile quando houver mudança visual.

------------------------------------------------------------------------

# 14. CHECKLIST DE CADA IMPLEMENTAÇÃO

Toda tarefa concluída deve seguir este formato:

``` text
TAREFA:
[ ] Nome da tarefa

IMPLEMENTADO:
[ ] Item
[ ] Item
[ ] Item

TESTADO:
[ ] Desktop
[ ] Mobile
[ ] Recarregar página
[ ] Console sem erros

PENDÊNCIAS:
[ ] Item
[ ] Item

PRÓXIMO PASSO:
Nome da próxima tarefa
```

Depois disso, atualizar o checklist principal deste arquivo.

------------------------------------------------------------------------

# 15. HISTÓRICO DE IMPLEMENTAÇÕES

## 19/08/2026 --- Análise inicial

-   Projeto analisado.
-   Estrutura atual identificada.
-   4 modos identificados:
    -   Diário;
    -   Foto;
    -   Mais ou Menos;
    -   Onze Inicial.
-   `jogadores.json` analisado.
-   Campo `jogos` confirmado.
-   Aproximadamente 156 jogadores identificados.
-   Aproximadamente 120 jogadores com fotos.
-   `partidas.json` identificado com aproximadamente 9 partidas.
-   `script.js` identificado como arquivo central.
-   Sintaxe JavaScript validada.
-   Principal prioridade definida: finalizar o Onze Inicial.
-   Segunda prioridade: polir Mais ou Menos.
-   Terceira prioridade: expandir os dados.

------------------------------------------------------------------------

# 16. ESTADO ATUAL

### 🟢 Pronto

-   [x] Modo Diário
-   [x] Modo Foto
-   [x] Base do Mais ou Menos
-   [x] Banco de jogadores
-   [x] Campo `jogos`
-   [x] Sistema de fotos
-   [x] Base do Onze Inicial
-   [x] Compartilhamento unificado do dia 4/4

### 🟡 Em desenvolvimento

-   [ ] Onze Inicial
-   [ ] Polimento Mais ou Menos
-   [ ] Expansão de partidas
-   [ ] Completar fotos

### 🔴 Ainda não iniciado

-   [ ] Novos modos
-   [ ] Refatoração completa
-   [ ] Sistema avançado de estatísticas
-   [ ] Recursos online/backend

------------------------------------------------------------------------

# 17. PRÓXIMA TAREFA OFICIAL

## ✅ v2.6 — CONCLUÍDA: ESTABILIDADE E HARDENING

Concluído:

1.  Hardening básico e remoção de controles/spoilers de desenvolvimento.
2.  Normalização defensiva dos saves individuais e do histórico integrado.
3.  Recálculo seguro do indicador diário `complete`, preservando saves e migrações.
4.  Como Jogar e acessibilidade básica dos modais.
5.  Polimento visual, feedback sobreposto e avanço automático do Mais ou Menos.
6.  Suíte permanente de regressão para storage, streak, progresso, estatísticas,
    Mais ou Menos v2 e compartilhamento diário sem spoilers.

Próxima fase planejada — **v2.7 (ainda não iniciada):**

1.  Revisão estrutural mobile.
2.  Consolidação do CSS e dos breakpoints.
3.  Consistência visual dos quatro modos.
4.  Semântica ARIA completa dos autocompletes.
5.  Testes em dispositivos e leitores de tela reais.

------------------------------------------------------------------------

# 18. COMO UMA NOVA IA DEVE CONTINUAR

Se este arquivo for entregue a outra IA, ela deve começar
perguntando/confirmando apenas o necessário e então:

``` text
1. Ler ROADMAP.md
2. Analisar os arquivos atuais
3. Identificar a tarefa marcada como "PRÓXIMA TAREFA OFICIAL"
4. Implementar somente essa etapa
5. Testar
6. Atualizar ROADMAP.md
7. Informar o resultado
```

Não assumir que o código atual é exatamente igual ao descrito aqui.

**O código real sempre tem prioridade sobre uma descrição
desatualizada.**

Se houver divergência entre este documento e o projeto:

1.  verificar o código;
2.  verificar os JSONs;
3.  atualizar este documento;
4.  só então continuar.

------------------------------------------------------------------------

# 19. VISÃO FINAL DO PROJETO

O objetivo é transformar o Timãodle em uma experiência completa de
desafios diários do Corinthians, com vários modos independentes, mas
compartilhando:

-   jogadores;
-   partidas;
-   fotos;
-   estatísticas;
-   sistema de progresso;
-   identidade visual;
-   compartilhamento;
-   desafios diários.

A prioridade é **qualidade e consistência**, não quantidade de modos.

Primeiro deixar os modos existentes excelentes.

Depois expandir.


## 19/08/2026 — Onze Inicial: desafio reduzido para 3 jogadores

- Quantidade de titulares ocultos reduzida de 5 para 3.
- Objetivo: deixar o modo mais rápido, acessível e saudável no início.
- O restante dos titulares continua visível como contexto no campo.
- Progresso do desafio agora é exibido em escala de 0/3 a 3/3.
- Mensagem de conclusão atualizada para refletir os 3 jogadores ocultos.
- A seleção continua determinística por data, preservando o desafio diário.


## 19/08/2026 — Onze Inicial: conclusão, compartilhamento e scrollbar

- Tela final de resultado criada em preto, branco e dourado.
- Resumo mostra placar real e palpite do usuário.
- Desempenho dos 3 jogadores ocultos aparece como `3/3` ao concluir.
- Contador de erros adicionado e persistido no `localStorage`.
- Nomes tentados fora do onze aparecem no resumo final.
- Botão de compartilhar resultado adicionado, com Web Share API e fallback para copiar.
- Compartilhamento inclui placar, desempenho nos jogadores e quantidade de erros.
- Resultado final é reconstruído corretamente ao reabrir um desafio já concluído.
- Scrollbar da área principal foi movida visualmente para a borda direita da janela, sem alargar o conteúdo central.
- Scrollbar recebeu track preto e thumb dourado, seguindo a paleta oficial do Timãodle.
- Scrollbar do autocomplete também foi padronizada.
- `script.js` validado com `node --check`.

### Próximo passo recomendado

- [ ] Testar o Onze Inicial em desktop e mobile com atenção a tamanhos extremos.
- [x] Adicionar contador para o próximo desafio ao resultado do Onze Inicial.
- [ ] Revisar posições dos jogadores no campo nas 9 partidas atuais.
- [ ] Depois, voltar ao polimento do Mais ou Menos.


## 19/08/2026 — Onze Inicial: polimento responsivo e visual

Implementado:
- estilos finais isolados em `#escalacaoView`, sem alterar os outros modos;
- cards do confronto, escalação e resultado adaptados para desktop, mobile e telas de até 360 px;
- nomes de jogadores protegidos em até duas linhas, sem escapar do campo;
- fotos, nomes, posições e espaços do campo redimensionados por breakpoint;
- busca e autocomplete ampliados, com foco mais visível, rolagem interna e itens mais confortáveis para toque;
- tela de resultado com rótulos, números, erros e botão de compartilhamento mais legíveis;
- scrollbar principal preservada na extremidade direita, em preto e dourado;
- regra de 3 jogadores ocultos preservada;
- inconsistências antigas do roadmap sobre a persistência do Onze Inicial corrigidas.

Testado:
- `node --check script.js` executado sem erros;
- estrutura CSS verificada com blocos balanceados;
- `jogadores.json` e `partidas.json` validados por leitura via Node.js;
- 9 partidas confirmadas com 11 titulares;
- constante de 3 jogadores ocultos confirmada;
- `git diff --check` executado sem erros de whitespace;
- `partidas.json` confirmado sem alterações.

Pendências:
- teste visual manual em navegadores desktop e mobile reais, indisponíveis neste ambiente;
- revisão visual individual das coordenadas nas 9 partidas;
- contador para o próximo desafio no resultado do Onze Inicial.

Próximo passo:
- testar manualmente o Onze Inicial em desktop e mobile e corrigir somente eventuais casos extremos encontrados.


## 19/08/2026 — Onze Inicial: contador para o próximo desafio

Implementado:
- contador `HH:MM:SS` adicionado à tela de conclusão do Onze Inicial;
- label `PRÓXIMO DESAFIO EM` e tempo em destaque dourado, com números grandes e tabulares;
- cálculo existente até a meia-noite local reutilizado;
- intervalo global existente reutilizado, sem criação de timers adicionais;
- resultado restaurado após F5 continua exibindo o contador atualizado;
- apresentação adaptada para desktop e mobile;
- regra de 3 jogadores ocultos e dados de partidas preservados.

Testado:
- `node --check script.js` executado sem erros;
- referência do novo elemento conferida entre HTML e JavaScript;
- apenas um `setInterval` confirmado em todo o `script.js`;
- `git diff --check` executado sem erros de whitespace;
- `partidas.json` confirmado sem alterações.

Pendências para considerar o Onze Inicial maduro:
- testar manualmente o fluxo completo, incluindo conclusão e F5, em navegadores desktop e mobile reais;
- revisar visualmente as coordenadas dos jogadores nas 9 partidas atuais;
- remover botão e mensagens de desenvolvimento antes da publicação final;
- expandir o banco de partidas para reduzir repetições do desafio diário.

Próximo passo:
- executar a validação manual completa do Onze Inicial em desktop e mobile.


## 19/08/2026 — Onze Inicial: auditoria das partidas e linhas densas

Implementado:
- auditoria estrutural e visual concluída nas 9 partidas existentes;
- confirmados 11 titulares e posições/coordenadas válidas em todas as partidas;
- linhas com 4 ou mais jogadores agora são identificadas durante a renderização;
- adaptação visual restrita aos rótulos dessas linhas, sem alterar os marcadores ou as coordenadas do JSON;
- nomes continuam limitados a 2 linhas;
- larguras, fonte e espaçamento de linhas densas ajustados para desktop, tablet, mobile e telas de aproximadamente 360 px;
- São Paulo 2015 (`top 34`) e Palmeiras 2018 (`top 16`) confirmados como os únicos casos densos atuais;
- `partidas.json`, escalações e formações declaradas preservados.

Testado:
- `node --check script.js` executado sem erros;
- detecção de linhas densas verificada nas 9 partidas;
- estrutura CSS verificada;
- `git diff --check` executado sem erros de whitespace;
- constante de 3 jogadores ocultos confirmada;
- `partidas.json` confirmado sem alterações.

Pendências:
- validar historicamente Boca Juniors 2012, Vasco da Gama 2012, Palmeiras 2011 e Palmeiras 2017 antes de corrigir suas distribuições `4-2-3-1`;
- testar visualmente o campo em navegadores desktop e mobile reais;
- remover recursos de desenvolvimento antes da publicação final;
- expandir o banco de partidas.

Próximo passo:
- realizar a validação histórica das quatro partidas `4-2-3-1`, sem alterar dados antes da confirmação.


## 19/08/2026 — Mais ou Menos: polimento visual completo

Implementado:
- cards dos dois jogadores reorganizados, com fotos maiores e melhor enquadradas;
- nomes em branco e número de jogos como principal destaque dourado;
- progresso com 10 etapas, total de acertos e meta de 7 visíveis;
- botões MAIS e MENOS maiores, distintos e adequados para toque;
- estados hover, active, acerto, erro e indicação da resposta correta;
- número de jogos do candidato revelado com animação curta;
- feedback textual informa explicitamente se a resposta era MAIS, MENOS ou empate;
- tela final própria com vitória/derrota, pontuação em 10 e situação da meta;
- layout adaptado para desktop, tablet, mobile e telas de aproximadamente 360 px;
- suporte a movimento reduzido preservado;
- seleção diária, jogadores com foto, persistência, 10 rodadas, meta de 7 e comparação por `jogos` preservados.

Testado:
- `node --check script.js` executado sem erros;
- referências entre IDs do HTML e JavaScript verificadas;
- estrutura CSS e breakpoints verificados;
- constantes de 10 rodadas, meta de 7 e campo `jogos` confirmadas;
- chave existente de persistência confirmada;
- `git diff --check` executado sem erros de whitespace;
- `jogadores.json` e `partidas.json` confirmados sem alterações.

Pendências:
- teste visual e funcional manual das 10 rodadas em navegadores desktop e mobile reais;
- revisar seleção e balanceamento das comparações em etapa separada;
- revisar cobertura e qualidade das fotos usadas pelo modo;
- avaliar compartilhamento do resultado, que ainda não existe no Mais ou Menos.

Próximo passo:
- validar manualmente o modo completo em desktop e mobile antes de revisar balanceamento e seleção.


## 19/08/2026 — Mais ou Menos v2: seleção balanceada

Implementado:
- algoritmo versionado com semente `data + "-mm-v2"`;
- plano diário determinístico com 3 comparações fáceis (`121+`), 4 médias (`31–120`) e 3 difíceis (`1–30`);
- plano prévio de MAIS/MENOS com proporção entre 4/6 e 6/4, máximo de 3 respostas iguais e máximo de 4 alternâncias consecutivas;
- seleção sem jogadores repetidos e sem empates quando há alternativa;
- tentativas determinísticas de planos viáveis antes dos fallbacks graduais;
- fallbacks para faixa ampliada, direção planejada, qualquer não empate e qualquer jogador disponível;
- sequência completa e snapshot dos 11 jogadores salvos no `localStorage`;
- mudanças no banco ou manifesto durante o dia não alteram uma sequência v2 já iniciada após F5;
- migração pequena: estados v1 do mesmo dia recriam e persistem sua sequência v1, sem reiniciar a partida;
- visual, 10 rodadas, meta de 7, campo `jogos` e pool de jogadores com foto preservados.

Simulação v1 × v2:
- 3.653 datas, de 2020 a 2029, totalizando 36.530 comparações por versão;
- diferença média: v1 `173,38`, v2 `103,38` jogos;
- mediana: v1 `136`, v2 `71` jogos;
- v1: 42 empates, 4.767 diferenças de 1–30, 11.749 de 31–120 e 19.972 de 121+;
- v2: 0 empates, 10.959 difíceis, 14.612 médias e 10.959 fáceis, exatamente 3/4/3 por desafio;
- v2: 18.336 respostas MAIS e 18.194 MENOS;
- nenhum jogador repetido e nenhuma falha de determinismo;
- estratégia de inverter a resposta anterior: v1 `6,51/10` e `51,33%` de vitórias; v2 `5,47/10` e `15,99%` de vitórias;
- nenhum dos 3.653 desafios deixou de cumprir 3/4/3;
- nenhum fallback foi usado na amostra;
- 3.524 desafios encontraram plano viável na primeira tentativa, 122 na segunda e 7 na terceira;
- geração v2 medida em média de `1,84 ms`, com máximo observado de `43 ms` no ambiente de teste.

Testado:
- `node --check script.js` executado sem erros;
- `git diff --check` executado sem erros de whitespace;
- JSONs validados sem alterações;
- mesma data gera a mesma sequência;
- sequência possui 11 jogadores únicos e 10 rodadas;
- planos de dificuldade e direção validados;
- snapshot salvo restaura a mesma sequência mesmo sem o pool carregado;
- gerador v1 mantido determinístico para migração;
- meta de vitória permanece em 7 acertos.

Pendências:
- testar manualmente desafio novo, migração v1, F5 e conclusão em navegadores desktop e mobile reais;
- monitorar a dificuldade percebida com jogadores reais antes de recalibrar faixas ou meta;
- revisar cobertura e qualidade das fotos;
- avaliar compartilhamento do resultado em etapa futura.

Próximo passo:
- validar o Mais ou Menos v2 de ponta a ponta em navegadores desktop e mobile reais.


## 19/08/2026 — Camada de segurança do sistema de fotos

Implementado:
- manifesto validado em runtime como array, limitado a strings não vazias, sem duplicatas e com correspondência em `jogadores.json`;
- pool do Mais ou Menos restrito a jogadores fotografados com `jogos` presente, do tipo `number` e finito;
- jogadores fotografados sem `jogos` válido continuam permitidos exclusivamente no Modo Foto;
- fallback reutilizável, local e sem dependências para falhas de imagem no Foto e no Mais ou Menos;
- fallback remove o handler de erro antes de aplicar a silhueta, impedindo repetição infinita;
- textos alternativos atualizados com o nome do jogador e estado de indisponibilidade;
- nome do jogador secreto salvo no estado diário do Modo Foto;
- estados antigos do Foto sem o nome salvo fazem um único sorteio determinístico e são migrados;
- jogador já persistido permanece igual após F5 mesmo que o manifesto seja alterado;
- algoritmo v2, seed diária, snapshots, 10 rodadas, meta de 7 e visual do Mais ou Menos preservados.

Testado:
- `node --check script.js` sem erros;
- `git diff --check` sem erros de whitespace;
- `jogadores.json`, `fotos-manifest.json` e `partidas.json` validados e confirmados sem alterações;
- manifesto atual validado com 120 nomes e casos artificiais de duplicata, espaços, tipos inválidos e jogador inexistente;
- pool atual confirmado com os mesmos 120 jogadores elegíveis;
- casos artificiais com `jogos` nulo, ausente, textual e infinito rejeitados pelo Mais ou Menos;
- jogador fotografado com `jogos` nulo confirmado como disponível no Modo Foto;
- restauração do jogador diário confirmada após simulação de mudança no pool;
- falha de imagem simulada com fallback aplicado, `alt` atualizado e handler removido sem loop;
- estrutura CSS confirmada com 573 blocos balanceados.

Pendências:
- adicionar fotos dos 16 jogadores que já possuem `jogos` válido;
- validar historicamente `jogos` dos 20 jogadores atualmente com valor `null` antes de liberá-los no Mais ou Menos;
- testar visualmente o fallback e os fluxos completos em navegadores desktop e mobile reais.

Próximo passo:
- adicionar as fotos dos 16 jogadores com `jogos` válido e repetir a auditoria técnica do conjunto.


## 19/08/2026 — Integração do lote de 16 fotos

Implementado:
- adicionados ao manifesto Adílson Batista, Batata, Betão, Caçapava, Edvaldo, Fabinho, Felipe Augusto, Jairo, Jango, Jorge Henrique, Júlio César, Leandro Castán, Malcom, Pedrinho, Silvinho e Índio;
- cobertura ampliada de `120/156` (`76,92%`) para `136/156` (`87,18%`);
- pool do Modo Foto ampliado para 136 jogadores;
- pool elegível do Mais ou Menos ampliado para 136 jogadores;
- proteção contra `jogos` inválido e toda a lógica do algoritmo v2 preservadas.

Testado:
- 136 entradas únicas no manifesto e 136 arquivos físicos;
- correspondência completa entre manifesto, arquivos e `jogadores.json`;
- nenhuma entrada sem arquivo, arquivo órfão, colisão de slug ou diferença problemática de caixa;
- todas as 136 imagens legíveis, em JPEG, com 480×480 e proporção 1:1;
- os 136 jogadores do manifesto possuem `jogos` numérico e finito;
- os 20 jogadores com `jogos: null` continuam fora do Mais ou Menos;
- 1.680 datas do Mais ou Menos simuladas entre 2025 e 2029;
- todos os 16 novos jogadores apareceram na simulação;
- todas as sequências simuladas mantiveram 11 jogadores únicos e o plano 3/4/3, sem uso de fallback;
- `node --check script.js`, validação dos JSONs e `git diff --check` executados sem erros.

Pendências:
- permanecem 20 jogadores sem foto e com `jogos: null`, aguardando validação histórica;
- testar visualmente os modos Foto e Mais ou Menos em navegadores desktop e mobile reais.

Próximo passo:
- decidir entre validar/adicionar os 20 jogadores restantes ou continuar o desenvolvimento de funcionalidades dos modos atuais.


## 20/08/2026 — Histórico e progresso diário v1

Implementado:
- criada a chave versionada `timaodle_history_v1`;
- histórico central indexado por data e limitado a resumos compactos dos quatro modos;
- normalizadores independentes para Clássico, Foto, Mais ou Menos e Onze Inicial;
- progresso reutilizável com modos iniciados, concluídos, total, texto `0/4` a `4/4` e indicador de dia completo;
- derrotas no Foto e Mais ou Menos contam como desafios concluídos;
- conclusão do Onze Inicial depende dos 3 jogadores, independentemente do palpite de placar;
- sincronização central após os salvamentos dos quatro modos e durante a inicialização;
- importação segura dos saves existentes, sem reconstruir histórico anterior;
- leitura defensiva para histórico inexistente, malformado ou com versão inesperada;
- leitura defensiva de `timaodle_stats`, mantido como legado exclusivo do Clássico;
- ID real da partida incluído na seleção do Onze Inicial;
- migração compatível de saves do Onze Inicial com `partidaId: null`, preservando progresso e registrando `exactScore`;
- todas as chaves detalhadas anteriores preservadas.

Estrutura resumida por dia:
- `classic`: `started`, `completed`, `outcome`, `attempts`;
- `photo`: `started`, `completed`, `outcome`, `attempts`;
- `moreLess`: `started`, `completed`, `outcome`, `hits`, `rounds`;
- `lineup`: `started`, `completed`, `outcome`, `phase`, `resolved`, `total`, `errors`, `exactScore`;
- `complete`: conclusão dos quatro modos;
- `completionCelebrated`: controla a celebração única do dia.

Testado:
- `node --check script.js` e `git diff --check` sem erros;
- saves e histórico inexistentes ou malformados;
- importação do dia atual e compatibilidade com saves antigos;
- sincronização repetida do mesmo dia sem duplicação;
- mudança de data preservando o resumo anterior;
- progresso `0/4`, `1/4`, `2/4`, `3/4` e `4/4`;
- derrota no Foto e no Mais ou Menos contando como conclusão;
- Onze Inicial concluído contando com `exactScore: false`;
- Clássico em andamento não contando como concluído;
- `timaodle_stats` malformado sem quebrar a inicialização;
- JSONs de dados validados e confirmados sem alterações.

Tamanho estimado:
- aproximadamente 370 bytes por dia completo;
- aproximadamente 132 KiB após 365 dias;
- aproximadamente 396 KiB após 3 anos.

Pendências:
- histórico confiável começa nesta versão; dias anteriores não podem ser reconstruídos com segurança;
- implementar o progresso diário integrado na Home;
- streak, estatísticas, calendário, conclusão visual 4/4 e compartilhamento unificado permanecem futuros.

Próximo passo:
- implementar o progresso diário integrado na Home usando `obterProgressoDiario()`.


## 20/08/2026 — Progresso diário integrado na Home

Implementado:
- painel compacto “TIMÃODLE DO DIA” com progresso de `0/4` a `4/4` e barra dourada;
- mensagem especial e destaque discreto quando os quatro desafios estão concluídos;
- estados textuais “NÃO INICIADO”, “EM ANDAMENTO” e “✓ CONCLUÍDO” nos quatro cards;
- detalhes de tentativas do Clássico e Foto, rodada/acertos do Mais ou Menos e fase/progresso do Onze Inicial;
- campo compacto `phase` no resumo do Onze Inicial para diferenciar a etapa de placar da escalação;
- atualização da Home na inicialização, após cada save relevante e ao retornar de qualquer modo;
- cards e listeners existentes preservados, inclusive para revisar desafios já concluídos;
- ajustes responsivos específicos para desktop, tablet, mobile e largura de 360 px;
- indicadores acessíveis por texto e ícone, sem depender apenas de cor.

Testado:
- `node --check script.js` sem erros;
- `git diff --check` sem erros de whitespace;
- JSONs de dados validados e confirmados sem alterações;
- cenários automatizados de progresso `0/4`, `1/4`, `2/4`, `3/4` e `4/4`;
- Clássico, Foto e Mais ou Menos em andamento;
- Onze Inicial na fase de placar e com `1/3` e `2/3` jogadores;
- estados concluídos, incluindo placar `8/10` do Mais ou Menos;
- leitura persistida equivalente ao F5 e troca de data retornando `0/4`;
- referências dos novos IDs e listeners de navegação verificadas estaticamente;
- breakpoints de 480 px e 360 px revisados no CSS.

Pendências:
- validar visualmente a Home e o retorno dos quatro modos em navegadores desktop e mobile reais;
- implementar uma conclusão visual 4/4 mais completa em etapa própria;
- streak, estatísticas integradas e compartilhamento unificado continuam futuros;
- calendário permanece fora do escopo atual.

Próximo passo:
- implementar a conclusão visual 4/4 e, depois, evoluir para streak, estatísticas e compartilhamento unificado.


## 20/08/2026 — Conclusão visual diária 4/4

Implementado:
- estado especial “TIMÃODLE DO DIA CONCLUÍDO” com `4/4 DESAFIOS` na Home;
- resumo persistente e sem respostas dos quatro modos;
- métricas seguras: tentativas do Clássico e Foto, acertos do Mais ou Menos e erros do Onze Inicial;
- animação curta em preto, branco e dourado, com respeito a `prefers-reduced-motion`;
- campo `completionCelebrated` no resumo diário de `timaodle_history_v1`;
- celebração consumida somente quando a Home está visível, permitindo que o quarto modo termine antes do retorno;
- celebração exibida uma única vez por data, sem repetição após F5;
- estrutura reservada e oculta para uma futura ação de compartilhamento unificado;
- layout do resumo em grade responsiva, incluindo ajustes para 480 px e 360 px.

Testado:
- transição automatizada de `3/4` para `4/4`;
- título, placar e resumo persistente após conclusão;
- métricas seguras dos quatro modos;
- conclusão enquanto a Home está oculta e celebração no retorno;
- persistência de `completionCelebrated` e ausência de nova celebração equivalente ao F5;
- troca de data retornando progresso `0/4`;
- `node --check script.js` sem erros;
- `git diff --check` sem erros de whitespace;
- estrutura CSS e breakpoints de mobile revisados estaticamente.

Pendências:
- validar visualmente a animação e o card em navegadores desktop e mobile reais;
- streak, estatísticas integradas e compartilhamento unificado continuam futuros;
- calendário permanece fora do escopo atual.

Próximo passo:
- implementar o streak diário integrado usando o histórico versionado, sem depender das estatísticas legadas do Clássico.


## 20/08/2026 — Clássico: atributos ausentes e valores zero

Implementado:
- fallback visual `—` para atributos `null`, `undefined` ou strings vazias;
- valores numéricos `0` preservados explicitamente como informação válida;
- tratamento central aplicado às comparações de texto, números e títulos do Clássico;
- comparações com um lado ausente não exibem setas numéricas enganosas;
- comparação com ambos os lados ausentes preserva a classe visual anterior, mas agora mostra `—`;
- mecânica, cores, saves, histórico v1, progresso 4/4 e compartilhamento preservados;
- `jogadores.json` mantido sem alterações.

Auditoria do banco:
- 156 jogadores analisados;
- 20 jogadores possuem pelo menos um campo `null`; não existem campos ausentes nem strings vazias nos atributos auditados;
- `jogos` é o atributo mais afetado, com 20 valores `null`;
- estreia, pé, títulos, gols e assistências possuem 19 valores `null` cada;
- existem 23 jogadores com `gols: 0` e 53 com `assistencias: 0`;
- o fluxo anterior não usava `valor || ""` e já preservava zeros, mas não tinha fallback explícito para valores ausentes.

Testado:
- Fábio Costa com os cinco atributos históricos `null`, todos exibidos como `—`;
- jogador com `gols: 0`;
- jogador com `assistencias: 0`;
- comparação entre campo ausente e campo preenchido;
- jogador com todos os campos do Clássico preenchidos;
- `node --check script.js` sem erros;
- `git diff --check` sem erros de whitespace;
- `jogadores.json` validado e confirmado sem alterações.

Pendências:
- os valores históricos ausentes continuam aguardando validação antes de qualquer alteração no banco;
- teste visual manual do tabuleiro em navegador real;
- streak diário continua como próxima funcionalidade planejada.

Próximo passo:
- implementar o streak diário integrado usando `timaodle_history_v1`.


## 20/08/2026 — Streak diário integrado 4/4

Implementado:
- função central `obterStreakGeral()` calculada exclusivamente a partir de `timaodle_history_v1.days` com `complete === true`;
- retorno com streak atual, recorde, total de dias completos e último dia completo;
- cálculo direto do histórico, sem cache ou dependência de `timaodle_stats.streak`;
- diferença entre datas baseada em componentes civis e `Date.UTC`, evitando efeitos de horário de verão;
- sequência vigente quando termina hoje ou ontem;
- sequência atual zerada quando o último dia completo é anterior a ontem;
- lacunas reiniciam a próxima sequência em 1, sem duplicar o mesmo dia;
- viradas de mês e ano tratadas como dias consecutivos;
- exibição compacta na Home com sequência atual e recorde;
- mensagem “Comece sua sequência” quando o valor atual é zero;
- streak incluído no card persistente da conclusão 4/4 e atualizado imediatamente após os saves;
- `completionCelebrated`, celebração única, progresso e quatro saves preservados.

Regra do dia em aberto:
- se hoje ainda não foi concluído e ontem encerrou uma sequência válida, essa sequência permanece como atual;
- se ontem não foi completo, o streak atual é zero até que hoje seja concluído.

Testado:
- A: histórico vazio (`0/0/0`);
- B: somente hoje completo;
- C: ontem e hoje completos;
- D: três dias consecutivos;
- E: recorde antigo de 5, lacuna e hoje completo iniciando em 1;
- F: recorde antigo de 5, ontem e hoje incompletos, atual em 0;
- G: hoje em aberto e sequência válida encerrada ontem;
- H: virada de `31/08` para `01/09`;
- I: virada de `31/12` para `01/01`;
- J: mesmo dia sincronizado duas vezes sem duplicação;
- K: recálculo equivalente ao F5 sem alteração do streak;
- L: JSON inválido, histórico estruturalmente malformado e datas inválidas;
- derrota no Foto contando como conclusão durante sincronização dos quatro modos;
- `node --check script.js` e `git diff --check` sem erros;
- JSONs de dados validados e confirmados sem alterações;
- referências de IDs, listeners existentes e estrutura CSS verificados.

Pendências:
- validar visualmente o streak na Home em navegadores desktop, tablet e mobile reais;
- estatísticas integradas, compartilhamento unificado e calendário/histórico visual continuam futuros;
- `timaodle_stats` permanece legado exclusivo do Clássico e não participa do streak geral.

Próximo passo:
- implementar as estatísticas integradas gerais usando o histórico versionado.


## 20/08/2026 — Estatísticas integradas do jogador

Implementado:
- função central `obterEstatisticasIntegradas()` derivada exclusivamente de `timaodle_history_v1`;
- nenhuma duplicação de contadores ou novo cache no `localStorage`;
- estatísticas gerais de dias registrados, dias jogados, dias 4/4, modos concluídos, vitórias e percentual de dias completos;
- streak atual, recorde e último dia completo reutilizados de `obterStreakGeral()`;
- Clássico com partidas, vitórias, tentativas, média, melhor resultado e distribuição `1`, `2`, `3`, `4+`;
- Foto com vitórias, derrotas, taxa, médias, melhor vitória e distribuição de 1 a 6 tentativas;
- Mais ou Menos com vitórias, derrotas, taxa, média, melhor/pior, 10/10, resultados 7+ e distribuição 0–10;
- Onze Inicial com erros totais/médios, menor resultado, zero erros, placares exatos, taxa e validação de `resolved/total`;
- valores históricos incompletos ignorados nas médias específicas, sem gerar `NaN` ou `Infinity`;
- painel leve aberto por “Ver estatísticas”, mantendo a Home compacta;
- estado vazio explicativo sem importar números anteriores;
- modal acessível por botão, fechamento dedicado, clique no fundo e tecla Escape;
- layout em cards responsivos para desktop, tablet, mobile e 360 px.

Testado:
- A: histórico vazio;
- B: um dia parcial;
- C: um dia completo 4/4;
- D: vários dias consecutivos;
- E/F: Foto e Mais ou Menos perdidos;
- G/H: resultados variados 0–10 e 10/10 no Mais ou Menos;
- I/J: Onze Inicial com zero e vários erros;
- K: placar exato verdadeiro e falso;
- L: campos históricos incompletos e inconsistência `resolved/total`;
- M: histórico com JSON inválido, estrutura malformada e datas inválidas;
- N: recálculo equivalente ao F5;
- O: troca de data ignorando registros futuros;
- nenhuma média não finita e taxas limitadas a 0–100;
- streak integrado coincidente com `obterStreakGeral()`;
- `node --check script.js`, `git diff --check`, JSONs, IDs, listeners e estrutura CSS verificados.

Pendências:
- histórico anterior à criação de `timaodle_history_v1` não pode ser recuperado com segurança;
- testar visualmente o modal completo em navegadores desktop, tablet e mobile reais;
- compartilhamento unificado permanece como próxima etapa;
- calendário/histórico visual continua futuro;
- `timaodle_stats` permanece legado exclusivo do Clássico e não alimenta as novas estatísticas.

Próximo passo:
- implementar o compartilhamento unificado do dia usando os resumos do histórico v1.


## 20/08/2026 — Polimento visual das estatísticas e Home mobile

Implementado:
- modal de estatísticas dividido entre cabeçalho fixo e conteúdo com rolagem interna;
- altura móvel limitada ao viewport disponível, com suporte a `dvh` e áreas seguras;
- botão de fechamento permanece acessível durante toda a rolagem;
- `overscroll-behavior` impede que a rolagem interna seja transferida para a página ao fundo;
- scrollbar interna discreta em preto e dourado;
- labels gerais e dos modos ampliadas moderadamente;
- hierarquia entre números, labels e informações secundárias reforçada;
- distribuições de tentativas e acertos convertidas em chips de faixa/quantidade;
- espaçamento interno dos cards revisado sem remover nenhuma estatística;
- Home passa a aproveitar até 400 px de largura em telas móveis, preservando margens laterais seguras;
- acento vertical dourado do card 4/4 substituído no mobile por um detalhe horizontal mais equilibrado;
- desktop mantém modal centralizado e largura original.

Testado:
- `node --check script.js` e `git diff --check` sem erros;
- IDs do modal e listeners de abertura, fechamento e Escape preservados;
- estrutura CSS e pares de chaves verificados;
- regras responsivas revisadas estaticamente para 360 px, 390 px, 430 px e desktop;
- conteúdo interno mantém os quatro modos e todas as estatísticas acessíveis;
- cálculos, histórico, saves e JSONs confirmados sem alterações nesta etapa.

Pendências:
- validar visualmente rolagem, foco e dimensões em navegadores desktop e dispositivos móveis reais;
- compartilhamento unificado permanece como próxima etapa;
- calendário/histórico visual continua futuro.

Próximo passo:
- implementar o compartilhamento unificado do dia usando os resumos do histórico v1.


## 20/08/2026 — Correção responsiva da Home mobile

Implementado:
- largura da Home consolidada em `100%` da área útil abaixo de 480 px;
- limites antigos de 360/400 px neutralizados apenas dentro da Home mobile;
- margem lateral uniforme de 12 px aplicada ao conteúdo e ao cabeçalho;
- cards de progresso, estatísticas e quatro modos alinhados na mesma largura;
- em 412 px, largura útil calculada em 388 px, com 12 px de margem em cada lado;
- aba de links úteis movida da lateral esquerda para um botão flutuante compacto no canto inferior direito;
- painel de links passa a abrir para cima e para a esquerda, sem alterar a largura do conteúdo;
- posição considera a área segura e evita sobreposição com o botão de desenvolvimento;
- `html` e `body` protegidos contra overflow horizontal no breakpoint móvel;
- desktop e funcionalidade do widget preservados.

Larguras móveis calculadas:
- 360 px: 336 px úteis e margens de 12 px;
- 390 px: 366 px úteis e margens de 12 px;
- 412 px: 388 px úteis e margens de 12 px;
- 430 px: 406 px úteis e margens de 12 px;
- 480 px: 456 px úteis e margens de 12 px.

Testado:
- `node --check script.js` e `git diff --check` sem erros;
- estrutura CSS e breakpoints verificados;
- largura, padding e posicionamento calculados para 360, 390, 412, 430 e 480 px;
- widget e painel fechado/aberto verificados sem ultrapassar `100vw` pelas regras de layout;
- IDs e listener do widget preservados;
- JSONs, mecânicas, saves, histórico, streak e estatísticas confirmados sem alterações.

Pendências:
- medir `document.documentElement.scrollWidth` e `window.innerWidth` em navegador móvel real;
- validar visualmente o alinhamento em dispositivos reais;
- compartilhamento unificado permanece como próxima etapa.

Próximo passo:
- implementar o compartilhamento unificado do dia usando os resumos do histórico v1.


## 21/08/2026 — Compartilhamento unificado do dia 4/4

Implementado:
- botão `COMPARTILHAR DIA` no card persistente de conclusão da Home;
- disponibilidade derivada exclusivamente de `obterProgressoDiario().complete`, permanecendo oculta entre `0/4` e `3/4` e após troca de data;
- função reutilizável `gerarTextoCompartilhamentoDiario()` baseada somente nos resumos seguros de `timaodle_history_v1`;
- texto compacto com data local, tentativas do Clássico, tentativas e resultado do Foto, acertos e resultado do Mais ou Menos, `3/3` e erros do Onze Inicial, streak atual e fechamento `4/4`;
- nenhuma resposta secreta, nome de jogador, palpite, placar ou escalação incluída no resumo;
- URL oficial centralizada em `URL_OFICIAL_TIMAODLE`, também reutilizada pelo compartilhamento individual do Clássico sem alterar seu formato;
- Web Share API como primeira opção, clipboard como fallback e feedback temporário de cópia no próprio botão;
- cancelamento do compartilhamento nativo tratado sem erro e indisponibilidade das duas APIs tratada sem quebrar a interface;
- botão acessível por teclado, com foco visível e dimensões adequadas para toque;
- compartilhamentos individuais do Clássico e Onze Inicial preservados.

Testado:
- geração com vitórias e derrotas, tentativas variadas, acertos variados e erros zero ou maiores;
- streak de um dia e formatação local `DD/MM/AAAA`;
- indisponibilidade entre `0/4` e `3/4` e disponibilidade em `4/4`;
- leitura persistida equivalente ao F5 e troca de data por meio da fonte central de progresso;
- histórico inexistente, JSON inválido e resumos concluídos com métricas incompletas;
- Web Share disponível, clipboard como fallback, cancelamento nativo e ausência de ambas as APIs;
- inspeção automatizada do texto confirmou ausência de nomes, respostas, palpites, placares e jogadores ocultos;
- `node --check script.js` e `git diff --check` sem erros;
- referências dos IDs, listener e regras CSS verificadas estaticamente.

Pendências:
- validar visualmente o botão e o card concluído em navegadores desktop e mobile reais; a captura via Chrome headless falhou neste ambiente por indisponibilidade do processo gráfico;
- compartilhamento unificado não inclui imagem ou compartilhamento de dias passados;
- calendário/histórico visual continua futuro.

Próximo passo:
- definir o escopo do calendário/histórico visual baseado em `timaodle_history_v1` antes de implementar.


## 21/08/2026 — Correção responsiva da comparação do Modo Diário

Implementado:
- tabela desktop do Clássico preservada sem alterações;
- em telas de até 480 px, cada tentativa passa de oito colunas comprimidas para uma grade responsiva de duas colunas;
- Jogador e Títulos ocupam a largura completa da tentativa no mobile;
- cabeçalho único é ocultado somente no mobile e substituído por labels individuais dentro de cada atributo;
- valores receberam fonte, altura de linha e padding mais legíveis;
- palavras comuns usam quebra normal, enquanto textos realmente longos podem quebrar apenas quando necessário;
- cada tentativa ganhou contorno e espaçamento próprios para manter históricos extensos visualmente separados;
- cores, setas, fallback `—`, animação e estrutura das oito células foram preservados.

Causa corrigida:
- o breakpoint móvel mantinha as oito colunas do desktop em uma largura reduzida e diminuía as células para 10 px;
- `word-break: break-word` nessas colunas extremamente estreitas permitia a fragmentação visual de palavras como “Lateral”, “Brasil” e “Esquerdo”.

Testado:
- `node --check script.js`;
- `git diff --check`;
- IDs e classes usados pelo tabuleiro verificados;
- estrutura e chaves do CSS verificadas;
- cálculo estático da grade revisado em 360, 390, 412, 430 e 480 px;
- uma, três e seis ou mais tentativas mantêm separação pelo fluxo vertical do `board-body`;
- regras desktop permanecem fora do breakpoint e o compartilhamento do Clássico não foi alterado.

Pendências:
- validar visualmente o histórico de tentativas em navegador mobile real;
- calendário/histórico visual permanece como próxima funcionalidade planejada.

Próximo passo:
- realizar a auditoria geral planejada ou definir o escopo do calendário/histórico visual.


## 21/08/2026 — v2.6: hardening básico para jogadores reais

Implementado:
- removido o `console.log` que revelava diretamente o jogador secreto do Clássico;
- varredura de `console.log`, `console.debug`, `console.table` e `console.info` confirmou ausência de outros logs de respostas ou estado sensível;
- preservados somente `console.warn` e `console.error` úteis para falhas de storage, compartilhamento e carregamento de dados;
- controle `🔄 DEV` removido integralmente da interface de produção;
- removidos também o listener de reset global, a chamada a `localStorage.clear()` e os estilos exclusivos do botão DEV;
- saudação reconstruída com nós de texto e elemento `strong`, preservando o visual sem interpretar o apelido como HTML;
- botão “Como Jogar” mantido neutro e sem erro; a experiência de ajuda completa permanece fora desta etapa.

Varredura de desenvolvimento:
- não foram encontrados outros botões ocultos de desenvolvimento, parâmetros de debug, atalhos de teste, dados falsos, `TODO`, `FIXME` ou `HACK` executáveis;
- o `alert` de falha ao carregar jogadores e o fallback manual do compartilhamento do Clássico foram mantidos por terem função real para o usuário;
- comentários sobre testes e migrações foram mantidos por serem documentação técnica, sem comportamento de produção.

Testado:
- `node --check script.js`;
- `git diff --check`;
- JSONs validados e confirmados sem alterações;
- saudação com apelido normal;
- saudação com `<img src=x onerror=alert(1)>`, mantida literalmente como texto e sem criação de imagem;
- ausência de `devResetBtn`, `.dev-reset-btn`, `localStorage.clear()` e listeners órfãos associados;
- busca final sem `console.log/debug/table/info` e sem impressão de respostas diárias;
- referências de navegação da Home e dos quatro modos verificadas estaticamente.

Pendências:
- implementar a experiência completa de “Como Jogar” em etapa própria;
- normalizar defensivamente saves malformados dos quatro modos;
- reduzir a exposição antecipada da sequência/plano do Mais ou Menos dentro dos limites de uma aplicação client-side;
- realizar teste manual dos fluxos em navegador real.

Próximo passo:
- implementar a normalização defensiva dos saves individuais e do campo `complete` do histórico, preservando compatibilidade.


## 21/08/2026 — v2.6: normalização defensiva de saves e histórico

Implementado:
- unidade pequena e independente `storage-normalizers.js`, carregada antes de `script.js` e reutilizável pelo navegador e Node;
- leitura JSON segura central preservada, sem apagar outras chaves quando uma delas falha;
- persistência automática apenas quando um objeto recuperável foi efetivamente normalizado, com comparação para evitar loops de escrita;
- datas validadas como dias civis reais no formato `AAAA-MM-DD`, sem conversão do desafio local para UTC;
- números limitados a inteiros finitos e faixas plausíveis de cada mecânica;
- Clássico filtra tentativas inválidas/inexistentes e neutraliza vitória sem tentativa compatível;
- Foto valida jogador persistido, tentativas e outcome; jogador fora do pool reinicia somente o desafio Foto do dia, permitindo novo sorteio determinístico seguro;
- Mais ou Menos preserva v1, v2, seed, snapshots válidos, sequência iniciada, rodada e acertos; snapshots corrompidos são descartados isoladamente quando nomes suficientes ainda permitem recuperação;
- Onze Inicial preserva a migração de `partidaId: null`, filtra resolvidos, limita erros e placares, e descarta save com ID explicitamente inválido após a lista de partidas estar disponível;
- histórico v1 normalizado dia a dia, descartando apenas datas/estruturas inválidas;
- outcomes limitados a `won`, `lost` ou estado neutro conforme a mecânica;
- `complete` agora é sempre derivado de `classic.completed && photo.completed && moreLess.completed && lineup.completed`;
- `completionCelebrated` só permanece verdadeiro para um dia realmente 4/4;
- streak, estatísticas e compartilhamento passam a consumir o histórico já normalizado.

Autoridade dos dados:
- jogo atual/em andamento: save individual normalizado;
- histórico, streak e estatísticas: `timaodle_history_v1` normalizado;
- sincronização deriva resumos somente dos saves válidos e nunca usa histórico malformado para sobrescrever o progresso detalhado.

Compatibilidade preservada:
- mesmas oito chaves de `localStorage`;
- saves atuais válidos;
- MM v1 e v2;
- snapshots do MM;
- Onze Inicial antigo com `partidaId: null`;
- progresso 4/4, celebração única, streak, estatísticas e compartilhamentos.

Testes permanentes:
- criada `tests/storage.test.js` com `node:assert/strict`, sem framework, bundler ou dependência;
- execução: `node tests/storage.test.js`;
- cenários A–X cobrem storage inexistente, JSON truncado, objetos/arrays/null, tipos errados, limites, datas impossíveis, saves atuais e antigos, corrupção dos quatro modos, divergências de `complete`, outcome arbitrário, isolamento entre dias, F5/idempotência e troca de data.

Testado:
- `node tests/storage.test.js` com cenários A–X aprovados;
- `node --check storage-normalizers.js`;
- `node --check script.js`;
- `git diff --check`;
- três JSONs validados e confirmados sem alterações;
- ordem dos scripts e referências literais de IDs verificadas.

Pendências:
- executar os quatro fluxos completos e migrações em navegador real com cópias de saves de produção;
- ampliar a suíte permanente para seed/determinismo, streak e estatísticas integradas;
- exposição antecipada do MM no DevTools continua fora do escopo desta etapa;
- experiência “Como Jogar” continua pendente.

Próximo passo:
- adicionar testes permanentes de histórico/streak/estatísticas ou implementar a ajuda básica, antes de consolidar responsividade e CSS.


## 21/08/2026 — v2.6: Como Jogar e acessibilidade básica

Implementado:
- botão `?` do header convertido em ação real, com `aria-label="Como jogar"`;
- modal “Como Jogar” com resumo do Timãodle, dos quatro modos, progresso 4/4, streak, estatísticas e compartilhamento diário;
- conteúdo curto organizado em cards, com rolagem interna e layout de duas colunas no desktop e uma coluna no mobile;
- semântica `role="dialog"`, `aria-modal` e `aria-labelledby` aplicada ao novo modal e ao tutorial do Foto;
- controle compartilhado de abertura/fechamento, Escape, foco inicial, retorno de foco e bloqueio da rolagem de fundo;
- focus trap simples para Como Jogar, tutorial do Foto e estatísticas, incluindo Tab e Shift+Tab;
- botão de fechamento com nome acessível no novo modal;
- tutorial do Foto preserva a chave de “tutorial visto” e devolve foco ao campo de busca;
- modal de estatísticas preserva fechamento por fundo/Escape e agora prende foco corretamente;
- feedback principal do Onze Inicial recebeu `aria-live="polite"`;
- fotos dos jogadores no campo do Onze Inicial receberam alt com o nome; avatares decorativos do autocomplete foram ocultados da árvore acessível;
- nenhum novo movimento obrigatório foi introduzido; a ajuda reutiliza os padrões estáticos atuais e respeita as regras existentes de reduced motion.

Testado:
- harness DOM mínimo para abertura, foco inicial, Tab, Shift+Tab, bloqueio de scroll, fechamento e retorno de foco;
- semântica dos três diálogos e associação dos títulos;
- nome acessível do botão de ajuda;
- IDs HTML únicos;
- alt e `aria-live` do Onze Inicial;
- regras responsivas verificadas estaticamente para 360 px, mobile e desktop;
- CSS balanceado;
- `node tests/storage.test.js` com A–X aprovados;
- `node --check storage-normalizers.js`;
- `node --check script.js`;
- `git diff --check`;
- JSONs confirmados sem alterações.

Pendências:
- validar os três modais em navegador e leitor de tela reais;
- implementar semântica completa de combobox/listbox/option e `aria-activedescendant` nos autocompletes na v2.7;
- modal de boas-vindas ainda deve ser incorporado à mesma infraestrutura acessível em etapa futura;
- ampliar testes permanentes para streak, estatísticas e interações DOM em ambiente de navegador.

Próximo passo:
- concluir a v2.6 com testes permanentes de histórico/streak/estatísticas e revisão final de hardening antes da consolidação responsiva da v2.7.


## 21/08/2026 — v2.6: polimento de UX do Mais ou Menos

Implementado:
- avanço automático após cada resposta, preservando o feedback de acerto, erro ou empate por 1,5 segundo;
- remoção do botão “Próxima rodada”, do listener e do estilo exclusivo que ficaram desnecessários;
- feedback mais direto com os textos `✓ ACERTOU — ERA MAIS/MENOS` e `✕ ERROU — ERA MAIS/MENOS`, mantendo a revelação do valor e as cores existentes;
- bloqueio imediato dos botões e trava lógica durante a transição, evitando duplo clique, escolhas alternadas rápidas e nova ativação por teclado;
- timer único e controlado, cancelado ao voltar para a Home ou reinicializar o modo;
- persistência da resposta, rodada, acertos e histórico antes do início do timer, mantendo o F5 coerente sem alterar o formato do save;
- rodada 10 permanece com o feedback por 1,5 segundo e abre diretamente o resultado final, sem criar rodada 11;
- transição leve de 200 ms na entrada da rodada, desativada por `prefers-reduced-motion` sem remover o tempo de leitura;
- algoritmo v2, seed, plano 3/4/3, sequência, snapshots, 10 rodadas e meta de 7 preservados.

Testado:
- fluxos de acerto e erro nas direções MAIS e MENOS;
- bloqueio de duplo clique, alternância rápida e ativação por teclado durante a pausa;
- cancelamento ao sair para a Home e ao reinicializar o modo;
- recuperação coerente por F5 com o estado já persistido;
- transição da rodada 9 para 10, vitória com 7+ e derrota com menos de 7;
- atualização do histórico diário, estatísticas e progresso 4/4 pelo salvamento existente;
- reduced motion verificado na regra CSS;
- `node tests/storage.test.js`;
- `node --check storage-normalizers.js`;
- `node --check script.js`;
- `git diff --check`;
- JSONs confirmados sem alterações.

Pendências:
- validar o ritmo de 1,5 segundo e a transição em navegador e dispositivos reais;
- concluir os testes permanentes de histórico, streak e estatísticas previstos para a v2.6;
- autocompletes com semântica ARIA completa permanecem planejados para a v2.7.

Próximo passo:
- concluir a v2.6 com testes permanentes de histórico/streak/estatísticas e revisão final de hardening.


## 21/08/2026 — v2.6 concluída: suíte permanente de regressão

Implementado:
- harness Node controlado que extrai e executa as funções reais de `script.js` sem carregar o DOM e sem alterar código de produção;
- suíte permanente com `node:assert/strict`, zero dependências externas e execução individual possível;
- runner único `node tests/run-tests.js` para storage e regras do jogo;
- 13 cenários de streak, incluindo histórico vazio, hoje/ontem, quebras, recorde, reinício, viradas de mês/ano, ano bissexto, normalização e ordem das datas;
- progresso diário coberto de 0/4 a 4/4, incluindo modo iniciado, vitória, derrota e histórico ausente;
- MM v2 validado em 180 datas contra o pool real: determinismo, 11 jogadores únicos, 10 rodadas, zero empates, jogos finitos, plano 3/4/3, direções, limites de sequências e variedade;
- resultado do MM coberto em 0/10, 6/10, 7/10 e 10/10, incluindo limites normalizados e conclusão somente na décima rodada;
- estatísticas integradas cobertas para vazio, parcial, 4/4, múltiplos dias, vitórias, derrotas, distribuições, placar exato, erros e dados normalizados;
- compartilhamento coberto para vitórias, derrotas, singular/plural e streak zero/positivo;
- teste anti-spoiler permanente com marcadores para segredos dos quatro modos, sequência, jogos, direções, confronto, placar e palpite;
- nenhum arquivo de produção, interface, CSS, mecânica, seed, dificuldade, save ou JSON foi alterado nesta etapa.

Testado:
- `node tests/run-tests.js`: storage A–X e 39 novos cenários aprovados em menos de 1 segundo;
- MM v2 simulado em 180 datas, sem fallback nas datas da amostra e com todas as invariantes aprovadas;
- teste anti-spoiler aprovado sem vazamento de nenhum marcador;
- `node tests/storage.test.js` preservado e aprovado;
- `node --check` em todos os arquivos JavaScript de produção e teste;
- `git diff --check`;
- `jogadores.json`, `partidas.json` e `fotos-manifest.json` validados como JSON, sem alteração feita por esta implementação.

Conclusão da v2.6:
- hardening, normalização defensiva, Como Jogar, acessibilidade básica, polimento automático do Mais ou Menos e regressão permanente concluídos;
- a v2.6 está encerrada; a v2.7 permanece apenas planejada.

Pendências transferidas para v2.7:
- revisão estrutural mobile;
- consolidação do CSS e dos breakpoints;
- consistência visual dos quatro modos;
- ARIA completa dos autocompletes;
- testes em dispositivos e leitores de tela reais.

Próximo passo:
- planejar a revisão estrutural mobile da v2.7, sem iniciar alterações antes de definir o escopo.


## 21/08/2026 — v2.6: polimento visual e textual do feedback do Mais ou Menos

Implementado:
- linguagem do overlay reformulada para `ACERTOU!` ou `QUASE!`, seguida de uma frase natural com jogador e direção correta;
- `MAIS`/`MENOS` destacado na cor do estado e número de jogos destacado em dourado;
- composição centralizada com ícone, título, nome legível e informação numérica hierarquizada;
- fundo preto translúcido com blur leve, deixando verde/vermelho apenas no contorno e nos detalhes de estado;
- barra inferior discreta esvazia durante os mesmos 1,5 segundo do avanço automático;
- animação de entrada reduzida para 180 ms e desativada, junto da barra, por `prefers-reduced-motion`;
- frase exclusiva para tecnologia assistiva dentro do `aria-live`, sem depender da cor ou da concatenação dos elementos decorativos;
- timer, bloqueio de resposta, cancelamento, F5, save, histórico, estatísticas, rodada 10 e algoritmo v2 preservados.

Testado:
- conteúdo de acerto MAIS/MENOS e erro MAIS/MENOS;
- nome curto e nome longo com quebra por palavras;
- estrutura responsiva inspecionada para 360, 390, 412 e 430 px e desktop;
- texto acessível e `aria-live` preservados;
- barra sincronizada em 1,5 segundo e reduced motion sem animação;
- rodada 10 preservada pelo fluxo existente;
- `node tests/storage.test.js`;
- `node --check script.js`;
- `git diff --check`;
- JSONs confirmados sem alterações.

Pendências:
- validar visualmente a leitura em 1,5 segundo e o comportamento com leitor de tela em navegador/dispositivo real;
- permanecem as mesmas pendências funcionais da v2.6, sem nova feature ou avanço de versão.

Próximo passo:
- concluir a v2.6 com testes permanentes de histórico/streak/estatísticas e revisão final de hardening.


## 21/08/2026 — v2.6: feedback sobreposto do Mais ou Menos

Implementado:
- feedback de acerto, erro e empate convertido em overlay temporário contido pelo card do Mais ou Menos;
- camada escura translúcida mantém a rodada visível e atenuada, sem cobrir header/footer ou ocupar espaço no fluxo da página;
- hierarquia visual separa resultado, direção correta e jogador/número de jogos;
- verde e vermelho existentes preservados para os estados, com branco e dourado nos destaques;
- o mesmo elemento `aria-live="polite"` foi preservado dentro do card;
- timer único de 1,5 segundo, cancelamento, bloqueio de interação, persistência e avanço automático permaneceram inalterados;
- animação curta do overlay continua desativada por `prefers-reduced-motion`.

Testado:
- acerto e erro com conteúdo e classes visuais correspondentes;
- overlay absoluto limitado ao card e removido do fluxo da página;
- estrutura responsiva inspecionada para 360, 390, 412 e 430 px e desktop;
- saída durante o timer, rodada 10 e reduced motion preservados pela implementação existente;
- `node tests/storage.test.js`;
- `node --check storage-normalizers.js`;
- `node --check script.js`;
- `git diff --check`;
- JSONs confirmados sem alterações.

Pendências:
- validar contraste, ritmo e enquadramento do overlay em navegador e dispositivos reais;
- permanecem as mesmas pendências funcionais da v2.6, sem nova feature ou avanço de versão.

Próximo passo:
- concluir a v2.6 com testes permanentes de histórico/streak/estatísticas e revisão final de hardening.


## 21/08/2026 — encerramento da v2.6

Estado final:
- v2.6 concluída após aprovação da suíte permanente de storage e regras do jogo;
- 39 novos cenários de regras e 180 datas do MM v2 aprovados;
- teste anti-spoiler aprovado;
- nenhuma mecânica ou interface foi alterada para viabilizar os testes.

Pendências transferidas para v2.7:
- revisão estrutural mobile;
- consolidação do CSS/breakpoints;
- consistência visual entre os quatro modos;
- ARIA completa dos autocompletes;
- validação em dispositivos e leitores de tela reais.

Próximo passo:
- planejar o escopo da v2.7; a fase ainda não foi iniciada.
