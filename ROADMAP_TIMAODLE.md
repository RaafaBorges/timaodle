# TIMÃODLE --- ROADMAP E CONTEXTO DO PROJETO

**Versão do documento:** 2.8\
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

## ✅ v2.7 — CONCLUÍDA: CONSOLIDAÇÃO RESPONSIVA E ACESSIBILIDADE

Concluído em 21/08/2026:

1.  Auditoria estrutural inicial do CSS e da responsividade.
2.  Baseline permanente das relações entre HTML, JavaScript e CSS.
3.  Contrato documentado de IDs, classes dinâmicas, estados e elementos essenciais.
4.  Viewports canônicos definidos para 360, 390, 412, 430, 480, 768 px,
    desktop amplo e mobile com pouca altura.
5.  Checklist visual reutilizável e smoke headless opcional, sem dependência no runner.
6.  Shell global consolidado com eixo central, gutters compartilhados e scroll previsível.
7.  Descontinuidade de largura da Home em 480/481 px removida.
8.  Home consolidada em uma única área proprietária, com responsividade fluida.
9.  Componentes compartilhados de busca, autocomplete, ações, status e feedback consolidados.
10. Consolidação individual do Foto, Clássico, Mais ou Menos e Onze Inicial.
11. Correção responsiva específica do modal Como Jogar.
12. Limpeza estrutural final do CSS, com movimento reduzido e widget lateral revisados.
13. CSS morto confirmado removido.
14. Autocompletes acessíveis com semântica combobox/listbox e navegação por teclado.
15. Validação manual final aprovada em navegador real.

Pendências não bloqueantes:

-   validação com leitor de tela real;
-   smoke headless, indisponível no ambiente atual;
-   validação histórica das quatro partidas em 4-2-3-1;
-   bases históricas residuais do CSS do Onze Inicial.

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


## 21/08/2026 — v2.7 iniciada: baseline responsiva e proteção estrutural

Implementado:
- contrato central da interface com IDs essenciais por área, seletores CSS críticos,
  classes aplicadas dinamicamente e estados visuais dos quatro modos;
- teste estático permanente entre `index.html`, `script.js` e `style.css`, cobrindo
  130 IDs, IDs duplicados, referências literais de `getElementById`, modais e scroll lock;
- matriz canônica com 360, 390, 412, 430, 480, 768 e 1440 px, além de 412 × 600
  para viewport mobile de pouca altura;
- documentação das classes dinâmicas separada por Home, Clássico, Foto, Mais ou Menos,
  Onze Inicial, modais e painel de links;
- checklist visual curto e reutilizável para shell, modos, modais, nomes longos,
  overflow horizontal, foco e viewport baixo;
- smoke test opcional com navegador headless para medir `scrollWidth` e elementos visíveis
  fora da viewport, sem integrar essa dependência ao runner obrigatório;
- teste estrutural incluído em `node tests/run-tests.js`;
- nenhum arquivo de produção, CSS, HTML, mecânica, save, histórico ou JSON foi alterado.

Testado:
- `node tests/run-tests.js`: storage A–X, 39 cenários de regras e 14 cenários
  estruturais aprovados; 130 IDs conferidos;
- `node --check tests/viewport-smoke.js`;
- tentativa real do smoke em Chrome e Edge headless: ambos indisponíveis neste ambiente
  porque o processo GPU encerra antes da renderização; o utilitário registra `SKIP` seguro;
- screenshots e validação visual real não foram executados pela mesma limitação ambiental.

Pendências:
- executar `node tests/viewport-smoke.js` em ambiente onde Chrome/Edge headless renderize;
- percorrer `tests/visual-checklist.md` em navegador real nos viewports canônicos;
- criar cobertura automatizada futura para estados internos complexos dos modos e modais;
- consolidar CSS e breakpoints; esta etapa criou somente a proteção anterior à refatoração.

Próximo passo:
- iniciar a consolidação responsiva pelo shell global (viewport, body, header, conteúdo e
  footer), preservando o visual e usando a baseline para detectar regressões estruturais.


## 21/08/2026 — v2.7: consolidação incremental do shell global

Implementado:
- tokens `--shell-max-width`, `--shell-gutter` e `--shell-inline-space` como fonte única
  para o eixo estrutural de header, conteúdo e footer;
- gutter fluido entre 12 e 16 px, sem salto estrutural em 480/481 px;
- `body.app-shell` mantém fallback em `100vh` seguido de `100dvh`, sem a antiga
  `min-height` concorrente;
- `.page-content` permanece como único dono do scroll vertical principal, enquanto body e
  wrapper apenas delimitam a viewport do aplicativo;
- scrollbar principal preservada na extremidade da janela e na paleta preto/dourado;
- regras tardias de largura e padding do wrapper/page-content incorporadas à definição
  principal do shell;
- header e footer passaram a consumir os mesmos tokens de eixo e gutter do conteúdo;
- Home preservada em sua estrutura, com os quatro grupos principais usando limite comum
  de 400 px em ambos os lados do breakpoint de 480 px, removendo o salto para 360 px em 481;
- removidos overrides globais redundantes dos blocos mobile de 480 e 360 px;
- contrato estrutural ampliado para proteger tokens, scroll, alinhamento e continuidade
  da largura da Home;
- nenhuma mecânica, save, JSON ou layout interno dos quatro modos foi alterado.

Testado:
- baseline anterior executada antes da alteração e aprovada;
- `node tests/run-tests.js`: storage A–X, 39 cenários de regras e 15 cenários estruturais;
- `node tests/storage.test.js`;
- `node --check script.js`, `storage-normalizers.js` e testes JavaScript envolvidos;
- três JSONs validados, sem alteração;
- CSS com chaves balanceadas;
- `git diff --check` aprovado, com apenas avisos locais de LF/CRLF;
- `node tests/viewport-smoke.js`: `SKIP`, pois Chrome/Edge headless continua encerrando
  o processo GPU antes da renderização.

Pendências:
- validar manualmente eixo central, header, Home, footer, scroll e overflow horizontal em
  360, 412, 480, 481/482, 768, desktop e 412 × 600;
- a revisão responsiva completa, a consolidação da Home e os modos individuais continuam
  pendentes;
- não iniciar a consolidação do Onze Inicial antes das etapas globais e da Home.

Próximo passo:
- executar a validação visual manual do shell e, se aprovada, consolidar incrementalmente
  somente a Home e seus breakpoints.


## 21/08/2026 — v2.7: consolidação estrutural da Home

Implementado:
- estilos de estrutura, Timãodle do Dia, progresso, streak, estatísticas, compartilhar,
  conclusão e cards dos modos reunidos em uma única área proprietária do CSS;
- largura comum de 400 px e gutters do shell preservados em todos os estados;
- valores tipográficos vencedores de `.btn-title`, `.pill-text` e informações diárias
  incorporados às regras-base, eliminando overrides tardios;
- espaçamentos, padding e tamanhos responsivos convertidos para `clamp()` onde os valores
  existentes de desktop, 480 e 360 px podiam ser interpolados sem redesenho;
- media queries específicas da Home reduzidas de quatro para duas: uma exceção visual em
  480 px para a borda do card 4/4 e uma para `prefers-reduced-motion`;
- estados `is-complete`, `is-in-progress`, `is-completed` e `celebrate-once` preservados;
- contrato estrutural ampliado para proteger a propriedade fluida da Home;
- widget lateral, footer global e layouts internos dos quatro modos preservados.

Limpeza:
- removido o bloco tardio duplicado de conclusão, estados e responsividade da Home;
- removido o media query de 360 px exclusivo da Home;
- removidos do media query de 480 px os overrides substituídos por valores fluidos;
- removidas redefinições tardias de títulos, pills, timer/jogador anterior e título mobile.

Medição estática:
- regras/blocos relacionados à Home: 73 antes e 54 depois;
- seletores proprietários distintos: 55 antes e 52 depois;
- media queries contendo regras da Home: quatro antes e duas depois.

Testado:
- baseline anterior aprovada antes das alterações;
- `node tests/run-tests.js`: storage A–X, 39 cenários de regras e 15 cenários estruturais;
- `node tests/storage.test.js`;
- `node --check script.js`, `storage-normalizers.js` e testes envolvidos;
- três JSONs válidos e sem alteração;
- CSS com chaves balanceadas e `git diff --check` aprovado;
- `node tests/viewport-smoke.js`: `SKIP` por indisponibilidade do processo GPU no headless.

Pendências:
- validar visualmente Home 0/4, em andamento e 4/4, streak zero/positivo, estatísticas e
  compartilhamento nos viewports canônicos e em 481/482 px;
- widget lateral continua pendente e fora da consolidação da Home;
- os quatro modos ainda não foram consolidados; a revisão responsiva da v2.7 continua aberta.

Próximo passo:
- validar a Home em navegador real e tratar o widget lateral como etapa isolada antes de
  iniciar a consolidação responsiva dos modos.


## 21/08/2026 — v2.7: correção responsiva do modal Como Jogar

Implementado:
- limite específico do Como Jogar ampliado de 620 para 700 px, sem afetar os demais modais;
- largura vinculada à viewport com margem lateral segura de 16 px;
- grid dos quatro modos convertido para `auto-fit`, alternando entre uma e duas colunas
  conforme o espaço real e mantendo o desktop em 2 × 2;
- cards protegidos com `min-width: 0` e textos com quebra normal por palavras;
- `max-height` específico usa fallback por `100vh` e `100dvh`, preservando header, botão
  de fechar e scroll interno apenas quando o conteúdo excede a viewport;
- focus trap, Escape, retorno de foco, semântica ARIA e bloqueio de scroll preservados;
- contrato estrutural ampliado para proteger largura, altura e grid do modal.

Testado:
- `node tests/run-tests.js`: storage A–X, 39 cenários de regras e 16 cenários estruturais;
- `node tests/storage.test.js`;
- `node --check script.js`, `storage-normalizers.js` e teste estrutural;
- CSS com chaves balanceadas e `git diff --check` aprovado;
- IDs e atributos `role`, `aria-modal` e `aria-labelledby` preservados estaticamente.

Pendências:
- validar visualmente 360 × 800, 390 × 844, 412 × 915, 480 × 900, 768 × 1024,
  1024 × 768, 1280 × 720, 1440 × 900 e 1920 × 1080;
- a v2.7 não avançou de fase; permanecem as pendências de widget lateral e modos.

Próximo passo:
- confirmar o modal em navegador real e retomar a próxima etapa incremental da v2.7.


## 21/08/2026 — v2.7: consolidação dos componentes compartilhados

Implementado:
- seção proprietária para busca, autocomplete, ações, status e feedback compartilhados;
- inputs de busca consolidados com altura de 50 px, padding, tipografia, placeholder,
  foco dourado perceptível e estado disabled;
- autocomplete consolidado com container, itens de 46 px, estado ativo/hover, scroll,
  overscroll, sombra, borda, z-index e scrollbar da paleta;
- botões dourados `.share-btn` e `.form-submit-btn` compartilham base, hover, active e
  disabled; compartilhar, formulário e Onze Inicial mantêm variantes próprias;
- botão voltar ampliado de 30 para 40 px como compromisso entre alvo de toque e altura
  compacta das barras de status;
- `daily-status-bar`, label e timer incorporaram os valores vencedores da cascata;
- estrutura visual comum de `daily-end-message` e `escalacao-feedback` consolidada,
  preservando tipografia e borda específicas do Onze Inicial;
- valores globais duplicados de legibilidade incorporados à base e removidos das camadas tardias;
- nenhuma classe, JavaScript, mecânica, save, JSON ou layout interno dos modos foi alterado.

Variantes preservadas:
- Onze Inicial: input de 52 px, borda/caret, autocomplete mais alto, avatar e nomes longos;
- Mais ou Menos: botões MAIS/MENOS, overlay e resultado final totalmente isolados;
- cards finais de MM e Onze Inicial permanecem separados por não serem estruturalmente equivalentes;
- Home e modal Como Jogar preservados.

Medição estática:
- blocos relacionados aos componentes compartilhados: 54 antes e 37 depois;
- seletores distintos: 41 antes e 37 depois;
- media queries com overrides desses componentes: uma antes e zero depois.

Testado:
- baseline anterior aprovada antes das alterações;
- `node tests/run-tests.js`: storage A–X, 39 cenários de regras e 17 cenários estruturais;
- `node tests/storage.test.js`;
- `node --check script.js`, `storage-normalizers.js` e testes envolvidos;
- CSS balanceado, `git diff --check` aprovado e três JSONs válidos/inalterados;
- `node tests/viewport-smoke.js`: permanece `SKIP` por indisponibilidade do processo GPU.

Pendências:
- validação visual e de teclado dos componentes em desktop, mobile e 412 × 600;
- semântica ARIA completa de combobox/listbox/option continua pendente para etapa própria;
- consolidação individual de Clássico, Foto, Mais ou Menos e Onze Inicial ainda pendente;
- widget lateral continua fora desta etapa.

Próximo passo:
- validar os componentes compartilhados em navegador real e iniciar a consolidação individual
  pelo modo de menor risco, mantendo o Onze Inicial para uma etapa posterior.


## 21/08/2026 — v2.7: consolidação individual do Modo Foto

Implementado:
- estilos do Foto isolados sob `#photoView`, com propriedade clara de layout, imagem,
  revelação, progresso e tentativas;
- limite do modo formalizado em 400 px, com proteção fluida para viewports menores;
- imagem quadrada e lista de tentativas consolidadas em `width: min(320px, 100%)`;
- enquadramento, fallback, blur controlado pelo JavaScript, transição e seis tentativas preservados;
- busca, autocomplete, status, resultado e tutorial continuam usando as bases compartilhadas;
- seletores globais do Foto removidos em favor de seletores proprietários, sem novos breakpoints.

Medição estática:
- 13 blocos proprietários antes e 15 depois, incluindo os dois blocos estruturais que
  explicitam largura e proteção de conteúdo;
- 13 seletores globais do Foto substituídos por equivalentes sob `#photoView`;
- media queries específicas do Foto: zero antes e zero depois.

Testado:
- baseline completa aprovada antes da alteração;
- contrato estrutural ampliado para largura, proporção, enquadramento, fallback e estados;
- testes automatizados e validações estáticas registrados no relatório desta etapa.

Pendências:
- validar visualmente o Foto nos estados inicial, 1 e 5 tentativas, vitória, derrota,
  tutorial e fallback em navegador real;
- confirmar ausência de overflow em 360, 390, 412, 430, 480, 768 px, desktop e 412 × 600;
- Clássico, Mais ou Menos e Onze Inicial ainda aguardam consolidação individual;
- a v2.7 permanece em andamento.

Próximo passo:
- validar visualmente o Modo Foto e consolidar o próximo modo em uma etapa isolada.


## 21/08/2026 — v2.7: consolidação individual do Modo Clássico

Implementado:
- estilos exclusivos do Clássico reunidos em uma área proprietária sob `#gameView`;
- grade desktop de oito colunas preservada com as mesmas proporções e ordem de atributos;
- grade mobile de duas colunas movida para junto da base do modo, sem alterar o breakpoint
  de 480 px nem a dependência segura da ordem das células;
- Jogador e Títulos continuam ocupando a largura completa no mobile;
- células passaram a declarar explicitamente quebra normal por palavras, preservando
  `overflow-wrap: break-word` como proteção para conteúdo excepcional;
- estados `correct`, `partial`, `wrong`, animações, setas e fallback `—` preservados;
- busca, autocomplete, barra de status, resultado e compartilhamento continuam usando
  os componentes compartilhados sem overrides redundantes;
- JavaScript, HTML, persistência, mecânicas e JSONs permaneceram intactos.

Limpeza:
- seletores globais exclusivos de tabuleiro, tentativas e células substituídos por
  equivalentes sob `#gameView`;
- bloco responsivo do Clássico removido da seção responsiva genérica e incorporado à
  área do modo;
- nenhuma propriedade visual residual ou regra do shell, Home, Foto, MM ou Onze Inicial removida.

Medição estática:
- blocos/regras proprietários do Clássico: 28 antes e 29 depois, incluindo o novo bloco
  estrutural de propriedade do modo;
- 12 seletores globais exclusivos substituídos por seletores escopados em `#gameView`;
- media queries específicas: duas antes e duas depois; mobile e movimento reduzido são
  exceções necessárias e não foram fragmentadas.

Testado:
- baseline completa aprovada antes da alteração;
- contrato estrutural ampliado para oito colunas, grade mobile, labels, quebra de palavras
  e três estados de comparação;
- testes automatizados e validações estáticas registrados no relatório desta etapa.

Pendências:
- validar visualmente os estados inicial, 1, 3, 6+ e muitas tentativas em navegador real;
- confirmar títulos longos, fallback `—`, gols/assistências zero, cores, setas,
  autocomplete, compartilhar e scroll nos viewports canônicos;
- Mais ou Menos e Onze Inicial ainda aguardam consolidação individual;
- a v2.7 permanece em andamento.

Próximo passo:
- validar visualmente o Clássico e consolidar o Mais ou Menos em uma etapa isolada.


## 21/08/2026 — v2.7: consolidação individual do Mais ou Menos

Implementado:
- estilos do Mais ou Menos reunidos integralmente sob `#maisMenosView`;
- largura do painel formalizada em `min(520px, 100%)`, dentro da view de até 540 px;
- propriedades residuais da base antiga incorporadas aos cards, fotos, nomes, estatísticas,
  divisor, botões e legenda sem alterar o resultado visual vigente;
- nomes continuam limitados a duas linhas e passaram de `overflow-wrap: anywhere` para
  `break-word`, mantendo contenção com quebra mais natural;
- fotos e fallback preservam `object-fit`, enquadramento e escala 88 → 80 → 72 → 64 px;
- botões preservam hover, active, disabled, acerto, erro e bloqueio durante a resposta;
- overlay contido no card, textos ACERTOU/QUASE, animação de 180 ms, barra de 1,5 s,
  `aria-live` e movimento reduzido preservados;
- resultado final, vitória/derrota, placar em 10, meta de 7 e countdown preservados;
- algoritmo v2, plano 3/4/3, seed, snapshots, fluxo, persistência, HTML, JavaScript e JSONs intactos.

Limpeza:
- removida a base global antiga de seletores `.mm-*` após incorporar todas as propriedades residuais;
- removidos oito overrides tardios de hierarquia que já eram superados pelo polimento escopado;
- removidos dois overrides mobile globais de nome e estatística, também superados pela seção final;
- somente `.mm-dots` permanece fora do escopo por ser uma base comprovadamente compartilhada
  com o progresso do Onze Inicial; nenhum seletor exclusivo do MM ficou global.

Medição estática:
- blocos associados ao MM: aproximadamente 131 antes e 100 depois;
- seletores associados distintos: aproximadamente 98 antes e 75 depois;
- breakpoints proprietários: três antes e três depois (680, 480 e 360 px), mantidos
  porque controlam degraus reais de foto, card e tipografia;
- uma media query adicional de `prefers-reduced-motion` permanece necessária.

Testado:
- baseline completa aprovada antes da alteração;
- contrato estrutural ampliado para limites fluidos, nomes em duas linhas, overlay,
  temporização, breakpoints, escala de fotos e movimento reduzido;
- testes automatizados e validações estáticas registrados no relatório desta etapa.

Pendências:
- validar visualmente rodada inicial, quatro combinações de resposta, nomes longos,
  overlay, rodada 9 → 10, vitória, derrota e F5 em navegador real;
- confirmar cards, barra temporal, resultado, scroll e ausência de overflow nos viewports
  360, 390, 412, 430, 480, 680, 768, desktop e 412 × 600;
- Onze Inicial ainda aguarda consolidação individual;
- a v2.7 permanece em andamento.

Próximo passo:
- validar visualmente o Mais ou Menos e consolidar o Onze Inicial em etapa isolada e de maior risco.


## 21/08/2026 — v2.7: consolidação individual do Onze Inicial

Implementado:
- camada final do Onze Inicial formalizada sob `#escalacaoView`, cobrindo layout, placar,
  campo, jogadores, busca, feedback, resultado e responsividade;
- painéis principais convertidos de `width` + `max-width` para `min(430px, 100%)`,
  preservando o limite visual e protegendo viewports estreitas;
- proporção 2/3, desenho do campo, pseudo-elementos e posicionamento absoluto preservados;
- nenhuma coordenada `top`/`left`, formação, escalação ou partida foi alterada;
- nomes de jogadores, confronto, times, autocomplete, feedback e resultado passaram de
  `overflow-wrap: anywhere` para `break-word`, mantendo contenção com quebra mais natural;
- labels continuam limitadas a duas linhas;
- `dense-line` preservado: aplicado quando quatro ou mais atletas dividem a mesma linha
  (`top`), reduz apenas largura/padding/fonte do rótulo e não desloca o marcador;
- placar, três jogadores ocultos, erros, jogador fora do onze, fotos, conclusão,
  countdown, compartilhamento, F5, histórico e persistência preservados.

Limpeza:
- removidos cinco overrides mobile globais comprovadamente superados pela camada final;
- resultado mobile antes separado foi incorporado ao breakpoint proprietário de 480 px;
- seletor de nomes dos times no polimento visual passou a ser explicitamente escopado;
- bases estruturais antigas do campo foram mantidas quando ainda forneciam propriedades
  residuais essenciais, evitando uma reescrita arriscada.

Medição estática:
- blocos associados ao Onze Inicial: aproximadamente 197 antes e 192 depois;
- seletores associados distintos: aproximadamente 118 antes e 124 depois; o aumento vem
  do escopo explícito em `#escalacaoView`, não de novos componentes;
- camadas funcionais reduzidas de quatro para três: base estrutural, polimento visual e
  camada proprietária final;
- media queries relacionadas ao modo: seis antes e quatro depois, incluindo movimento reduzido;
- breakpoints proprietários preservados em 480 e 360 px, sem novos breakpoints.

Testado:
- baseline completa aprovada antes da alteração;
- contrato estrutural ampliado para campo, player absoluto, label em duas linhas,
  `dense-line`, placar, feedback, resultado e countdown;
- testes automatizados e validações estáticas registrados no relatório desta etapa.

Pendências:
- validação visual real de placar, transição, campo comum/denso, nomes longos,
  resolvidos, erros, jogador fora do onze e resultado;
- confirmar scroll e ausência de overflow em 360, 390, 412, 430, 480, 768, desktop e 412 × 600;
- quatro partidas em 4-2-3-1 continuam pendentes de validação histórica, fora desta etapa;
- a v2.7 permanece em andamento.

Próximo passo:
- executar validação visual real dos quatro modos consolidados antes da auditoria final da v2.7.


## 21/08/2026 — v2.7: auditoria e limpeza estrutural final

Implementado:
- auditoria pós-refatoração comparada ao commit final da v2.6 (`e830feb`);
- cinco blocos de `prefers-reduced-motion` consolidados em um único bloco, preservando
  celebração 4/4, Clássico, Onze Inicial, widget, overlay e barra temporal do MM;
- CSS morto confirmado removido: `.stats-grid`, `.stat-box`, `.stat-number`, `.stat-label`,
  `.pitch-box-top`, `.pitch-box-bottom` e o alias `.escalacao-end-message`;
- override antigo de 230 px do painel do widget removido por ser totalmente superado pela
  regra final `min(260px, calc(100vw - 24px))` no mesmo breakpoint;
- widget preservado fixo na lateral do desktop e no canto inferior direito do mobile,
  sem participar do eixo do shell nem criar largura estrutural;
- contrato estrutural ampliado apenas para movimento reduzido, contenção do widget e
  ausência dos seletores mortos confirmados;
- nenhuma mecânica, HTML, JavaScript, save, seed, texto ou JSON foi alterado.

Métricas objetivas (`style.css`):
- final da v2.6 → agora: 4.709 → 4.262 linhas;
- blocos aproximados: 683 → 592;
- seletores distintos: 527 → 499;
- seletores repetidos: 168 → 128;
- media queries: 20 → 14;
- `!important`: 2 → 2, ambos ainda necessários (`.hidden` e fallback contra filtro inline).

Mapa final de media queries:
- 480 px: Home (conclusão), Clássico, header, tipografia global, duas camadas residuais
  do Onze Inicial, MM e widget;
- 600 px: modal de estatísticas;
- 360 px: modais/estatísticas, Onze Inicial e MM;
- 680 px: MM;
- movimento reduzido: um bloco global consolidado;
- não existem media queries em 768 px; esse tamanho usa as regras fluidas de base.

Auditoria de CSS morto:
- confirmadamente morto e removido: grupos listados acima;
- provavelmente morto: nenhum após cruzamento com todos os HTMLs, JS e contrato;
- incerto e preservado: bases históricas do Onze Inicial que ainda fornecem propriedades
  residuais e seletores das páginas legais/contato;
- ainda necessário: classes dinâmicas documentadas no contrato.

Consistência visual:
- diferenças de largura dos modos, altura do input do Onze Inicial, cards e resultados
  foram classificadas como intencionais;
- status bar, voltar, foco, autocomplete e ações comuns permanecem na base compartilhada;
- nenhuma inconsistência acidental adicional de baixo risco foi confirmada nesta auditoria.

Autocompletes:
- teclado atual preserva setas, Enter, Escape e estado visual `.autocomplete-active`;
- pendem `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`,
  `role="listbox"`, `role="option"` e sincronização da seleção ARIA;
- essa alteração permanece separada por envolver HTML e comportamento dinâmico.

Pendências:
- smoke test continua dependente de navegador headless funcional;
- validação visual manual completa nos viewports prioritários ainda obrigatória;
- ARIA completa dos três autocompletes continua pendente;
- quatro formações 4-2-3-1 ainda aguardam validação histórica;
- a v2.7 não está marcada como concluída.

Próximo passo:
- executar o checklist visual final e, depois, implementar a semântica ARIA dos autocompletes.


## 21/08/2026 — v2.7: acessibilidade completa dos autocompletes

Implementado:
- inputs do Clássico, Foto e Onze Inicial convertidos semanticamente em `combobox`
  com `aria-autocomplete="list"`,
  com nomes acessíveis e `aria-controls` apontando para listboxes reais e exclusivas;
- listas marcadas como `role="listbox"`;
- sugestões recebem `role="option"`, IDs previsíveis por modo e `aria-selected`;
- `aria-expanded` acompanha lista aberta/fechada e `aria-activedescendant` acompanha
  exatamente a option destacada;
- dois helpers pequenos centralizam somente preparação de options e sincronização ARIA;
- ArrowDown/ArrowUp preservam navegação circular e classe visual ativa;
- Enter agora exige uma option ativa, evitando selecionar silenciosamente o primeiro item;
- Escape fecha os três autocompletes, incluindo o Onze Inicial, e mantém foco no input;
- clique/toque, hover, Tab, clique externo, lista vazia e reconstrução preservados;
- filtros, pools, tentativas, três ocultos, avatares, feedbacks e mecânicas permaneceram intactos;
- nenhum CSS, algoritmo, save, seed ou JSON foi alterado.

Testado:
- baseline completa aprovada antes da alteração;
- contrato permanente ampliado para os três pares combobox/listbox e para criação e
  sincronização das options;
- testes automatizados e validações estáticas registrados no relatório desta etapa.

Pendências:
- validar manualmente com teclado e leitor de tela abertura, setas, Enter, Escape, Tab,
  clique, lista vazia, nova busca e clique externo nos três modos;
- validação visual/manual real da v2.7 continua sendo a última etapa;
- quatro formações 4-2-3-1 seguem pendentes de validação histórica;
- a v2.7 ainda não foi marcada como concluída.

Próximo passo:
- executar a validação manual final da v2.7 em Live Server, incluindo teclado e leitor de tela.


## 21/08/2026 — Fechamento oficial da v2.7

**v2.7 — CONCLUÍDA**

Validação final:
- validação manual final aprovada em navegador real;
- shell, Home, quatro modos, modais, widget lateral, movimento reduzido e autocompletes
  acessíveis incluídos no aceite final;
- baseline responsiva permanente e contrato de frontend preservados como proteção contra regressões.

Testado no fechamento:
- `node tests/run-tests.js`: suíte completa aprovada, com cenários A–X de storage,
  39 cenários de regras e 23 cenários estruturais;
- `node tests/storage.test.js`: cenários A–X aprovados;
- `node --check script.js` e `node --check storage-normalizers.js`: aprovados;
- `git diff --check`: aprovado;
- `jogadores.json`, `partidas.json` e `fotos-manifest.json`: JSONs válidos e inalterados;
- 130 IDs verificados sem duplicidade pelo contrato de frontend;
- `style.css`: 616 aberturas e 616 fechamentos de bloco;
- smoke de viewport não executado porque o navegador headless permanece indisponível.

Escopo concluído:
- baseline responsiva permanente;
- consolidação do shell global e da Home;
- correção responsiva do Como Jogar;
- consolidação dos componentes compartilhados;
- consolidação individual do Foto, Clássico, Mais ou Menos e Onze Inicial;
- limpeza estrutural final do CSS;
- `prefers-reduced-motion` consolidado;
- widget lateral revisado;
- CSS morto confirmado removido;
- autocompletes acessíveis com combobox/listbox e navegação por teclado;
- validação manual final em navegador real.

Métricas finais da v2.7:
- CSS: 4.709 → 4.262 linhas;
- blocos aproximados: 683 → 592;
- seletores distintos: 527 → 499;
- seletores repetidos: 168 → 128;
- `@media`: 20 → 14;
- `!important`: 2 → 2.

Pendências futuras, sem bloqueio para a v2.7:
- validação com leitor de tela real;
- smoke headless, atualmente indisponível no ambiente;
- validação histórica das quatro partidas 4-2-3-1;
- bases históricas residuais do CSS do Onze Inicial.

## 🚧 v2.8 — EM ANDAMENTO: CALENDÁRIO / HISTÓRICO VISUAL

Fases:
- [x] Fase A — modelo, datas civis, limites e testes permanentes;
- [x] Fase B — modal e calendário visual;
- [x] Fase C — resumo detalhado e seguro do dia selecionado;
- [x] Fase D — acessibilidade e navegação por teclado;
- [ ] Fase E — streak histórico, polimento e validação final.

Estado atual:
- `timaodle_history_v1` continua sendo a única fonte diária;
- metadata `trackingStartedAt` integrada ao mesmo objeto, sem nova chave de storage;
- calendário visual, modal, resumo seguro e navegação avançada por teclado estão implementados;
- Fase E permanece como próxima etapa para streak histórico, polimento e validação final.


## 21/08/2026 — v2.8 Fase A: modelo, limites e testes do histórico visual

Implementado:
- histórico v1 evoluído para `{ version, trackingStartedAt, days }`;
- migração defensiva preserva metadata válida, usa o menor dia válido quando a metadata
  está ausente/inválida e usa a data local na primeira execução com histórico vazio;
- primeira criação do histórico persiste a metadata sem criar entrada diária artificial;
- `trackingStartedAt` válido nunca é movido automaticamente para uma data posterior;
- helpers puros adicionados para datas civis, comparação, quantidade de dias, início da
  semana na segunda-feira, virada de mês/ano, limites e navegação permitida;
- grade mensal retorna somente dados, com estado independente de hoje e campos para futuro,
  período anterior ao tracking, presença de registro, modos iniciados/concluídos e 4/4;
- estados derivados disponíveis: `future`, `before-tracking`, `no-record`, `recorded`,
  `started`, `partial` e `complete`;
- nenhuma derivação chama `obterProgressoDiario()` em loop, altera dias ou consome
  `completionCelebrated`;
- suíte permanente `tests/history-calendar.test.js` integrada ao runner principal.

Testado:
- 40 cenários permanentes do calendário e migração;
- fevereiro comum e bissexto, meses iniciando segunda/domingo, viradas de mês e ano;
- estados 0/4 a 4/4, hoje parcial/completo, futuro, ausência de registro e pré-tracking;
- metadata válida, ausente e inválida, histórico vazio/malformado, idempotência,
  zeros válidos e preservação de `completionCelebrated`;
- limites inferior/superior e bloqueio do próximo mês no mês atual;
- suíte completa, sintaxe, JSONs e whitespace validados no encerramento da etapa.

Compatibilidade preservada:
- saves dos quatro modos, progresso, streak, estatísticas, compartilhamento, MM v2,
  seeds e celebração 4/4;
- `jogadores.json`, `partidas.json` e `fotos-manifest.json` inalterados;
- `index.html` e `style.css` inalterados.

Pendências:
- o calendário ainda não possui interface;
- validação visual e acessível pertence às fases seguintes;
- datas sem entrada devem continuar usando linguagem neutra, sem afirmar que o usuário não jogou.

Próximo passo:
- implementar a Fase B em etapa isolada: botão na Home, modal específico e grade mensal
  responsiva consumindo exclusivamente as derivações concluídas nesta fase.


## 21/08/2026 — v2.8 Fase B: modal de histórico e calendário visual

Implementado:
- botão secundário `HISTÓRICO` integrado ao lado de Estatísticas, sem adicionar outro card à Home;
- modal próprio de 500 px, fluido até 360 px, com header fora da área rolável e altura
  protegida por `100dvh`;
- infraestrutura acessível existente reutilizada para foco inicial, focus trap, Escape,
  retorno de foco, fechamento pelo backdrop e bloqueio do scroll da página;
- navegação mensal em PT-BR, com botões reais desabilitados no primeiro mês permitido
  e no mês atual;
- grade de sete colunas iniciada na segunda-feira, sem células interativas fora do mês;
- estados visuais proprietários para futuro, pré-tracking, sem registro, registro 0/4,
  iniciado 0/4, parcial e completo;
- hoje e seleção funcionam como dimensões independentes dos estados de progresso;
- dias completos usam borda, check e texto `4/4`, sem depender somente da cor;
- futuro e pré-tracking não são selecionáveis; dias sem registro são selecionáveis e
  mostram a mensagem neutra `SEM REGISTRO DISPONÍVEL`;
- abertura no mês atual com hoje selecionado; mudança de mês seleciona o último registro
  disponível ou deixa o placeholder neutro;
- seleção, ano e mês permanecem apenas em memória; nenhum storage ou dia é modificado;
- placeholder básico limitado à data e ao progresso agregado, sem métricas dos modos.

Acessibilidade:
- `role="dialog"`, `aria-modal`, `aria-labelledby`, botão fechar nomeado e grid rotulada;
- `aria-current="date"` para hoje, `aria-selected`/`aria-pressed` para seleção e labels
  completas por data;
- botões futuros/pré-tracking realmente desabilitados e navegação mensal com nomes acessíveis;
- navegação avançada por setas dentro da grade permanece reservada para a Fase D.

Testado:
- suíte completa aprovada com storage A–X, 39 cenários de regras, 40 cenários do
  calendário e 24 cenários estruturais;
- 139 IDs verificados sem duplicidade;
- contrato permanente ampliado para botão, modal, largura, sete colunas, estados,
  limites, seleção e semântica acessível;
- `script.js` e `storage-normalizers.js` aprovados por `node --check`;
- `git diff --check`, três JSONs e 651 pares de chaves CSS aprovados;
- teste visual real nos viewports prioritários continua pendente.

Compatibilidade preservada:
- Fase A, `trackingStartedAt`, histórico v1, progresso, streak, estatísticas,
  compartilhamento, celebração 4/4, saves, seeds e quatro modos;
- nenhum JSON foi alterado;
- nenhum resumo detalhado, streak histórico por dia ou compartilhamento antigo foi adicionado.

Próximo passo:
- implementar a Fase C: resumo seguro e detalhado dos quatro modos para o dia selecionado,
  sem respostas, palpites ou outros spoilers.


## 21/08/2026 — v2.8 Fase C: resumo detalhado e seguro do dia

Implementado:
- função pura `obterResumoHistoricoDia(data, historico)` baseada exclusivamente no resumo
  normalizado de `timaodle_history_v1.days[data]`;
- retorno por allowlist com data, presença de registro, progresso geral e somente flags,
  outcomes e contadores seguros dos quatro modos;
- Clássico com não iniciado, andamento e concluído, incluindo tentativas e pluralização;
- Foto com não iniciado, andamento, vitória e derrota, sempre em escala de 6 tentativas;
- Mais ou Menos com não iniciado, andamento, vitória e derrota, incluindo rodadas,
  acertos, pluralização e preservação de zero acertos;
- Onze Inicial com não iniciado, fase do placar, escalação em andamento, conclusão,
  resolvidos, erros e indicador discreto somente para `exactScore === true`;
- quatro linhas compactas substituem o placeholder para dias registrados, com progresso
  geral de `0/4` a `4/4` e destaque dourado no fechamento completo;
- dia registrado `0/4` mantém os estados individuais dos modos e continua distinto de
  uma data sem registro;
- data sem registro mostra somente mensagem neutra, sem afirmar que o usuário não jogou;
- troca de seleção e de mês atualiza imediatamente o resumo sem reload, consulta a saves
  individuais ou escrita no storage;
- região do resumo associada ao heading da data selecionada e atualizada por `aria-live="polite"`.

Segurança:
- a derivação nunca retorna nomes secretos, tentativas nominais, jogadores, sequência MM,
  valores de jogos, direções MAIS/MENOS, ocultos, confronto, placar ou palpite;
- fixture permanente contaminada com nove marcadores de spoiler confirma que nenhum deles
  chega à estrutura segura nem aos textos usados pela UI;
- `trackingStartedAt`, `completionCelebrated`, histórico, saves, seeds e mecânicas não foram alterados.

Testado:
- 29 novos cenários de resumo adicionados à suíte do calendário, agora com 69 cenários;
- todos os estados solicitados de Clássico, Foto, Mais ou Menos e Onze Inicial;
- pluralizações, zero válido, `0/4` a `4/4`, ausência de registro e anti-spoiler;
- suíte completa aprovada com storage A–X, 39 cenários de regras e 25 cenários estruturais;
- 149 IDs verificados sem duplicidade;
- `script.js`, `storage-normalizers.js`, `git diff --check`, três JSONs e 667 pares de
  chaves CSS aprovados;
- teste visual real do resumo nos viewports prioritários continua pendente.

Próximas fases:
- Fase D — navegação por teclado e acessibilidade avançada do calendário;
- Fase E — streak histórico, polimento e validação final da v2.8.


## 21/08/2026 — v2.8: polimento desktop dos modais de Estatísticas e Histórico

Implementado:
- correção exclusivamente visual, sem avanço das fases funcionais da v2.8;
- modal de Estatísticas ampliado de 680 px para até 820 px em telas a partir de 700 px;
- modal de Histórico ampliado de 500 px para até 720 px na mesma camada ampla;
- ambos usam `calc(100vw - 48px)`, preservando gutters mínimos de 24 px em tablet/desktop;
- Estatísticas mantém quatro métricas gerais por linha e os modos em grid 2 × 2, agora
  com cards, gaps e padding mais confortáveis;
- calendário permanece com sete colunas e foi centralizado em até 620 px para crescer sem
  se transformar em uma área excessivamente grande;
- resumo histórico aproveita a largura adicional com coluna de modo mínima de 150 px,
  textos maiores e estados à direita;
- regras mobile de 360 a 480 px permaneceram intactas;
- alturas, `100dvh`, scroll interno, foco, Escape, ARIA, JavaScript e dados não foram alterados.

Testado:
- contrato estrutural ampliado para as larguras 820/720 px, gutters, limite do calendário
  e preservação dos grids existentes;
- suíte completa, sintaxe, JSONs, IDs, CSS e whitespace validados no encerramento;
- validação visual real em tablet e desktop permanece recomendada.

Estado da versão:
- Fase C continua concluída;
- Fase D não foi iniciada;
- próxima etapa funcional permanece a acessibilidade avançada do calendário.


## 21/08/2026 — v2.8 Fase D: acessibilidade avançada do calendário

Implementado:
- roving tabindex na grade: exatamente um dia navegável participa da ordem de Tab;
- dias futuros, anteriores ao `trackingStartedAt` e células vazias permanecem fora do foco;
- foco e seleção são estados independentes; setas, Home/End e PageUp/PageDown movem somente
  o foco, enquanto Enter, Espaço e clique confirmam a seleção;
- setas horizontais avançam um dia e verticais sete dias, atravessando mês e ano quando permitido;
- Home/End encontram o primeiro/último dia navegável da semana iniciada na segunda-feira;
- PageUp/PageDown preservam o dia no mês adjacente ou limitam ao último dia/limite válido;
- limites inferior e superior impedem foco antes do tracking ou depois de hoje;
- foco inicial da grade prioriza seleção, hoje, último registro e primeiro dia permitido;
- troca de mês pelos controles mantém o comportamento de seleção e prepara um foco válido;
- o resumo da Fase C não é atualizado nem anunciado durante mero deslocamento de foco;
- focus trap comum passou a ignorar corretamente botões com `tabindex="-1"`;
- contrato estrutural documenta os novos invariantes de teclado e acessibilidade.

Testado:
- 32 novos cenários permanentes de navegação; suíte do histórico ampliada de 69 para 101 cenários;
- setas, Home/End, PageUp/PageDown, viradas de mês/ano, fevereiro comum/bissexto,
  limites de tracking/hoje, separação foco/seleção e preferência do foco inicial;
- suíte completa, storage, regras dos modos, contrato estrutural, sintaxe, JSONs, IDs,
  CSS balanceado e whitespace validados no encerramento;
- validação manual com teclado e leitor de tela real permanece recomendada.

Compatibilidade preservada:
- conteúdo e allowlist do resumo da Fase C, histórico v1, `trackingStartedAt`, saves,
  progresso, streak atual, estatísticas, compartilhamento, quatro modos e identidade visual;
- `index.html`, `style.css` e os três JSONs permaneceram inalterados.

Pendências:
- validação manual em navegador real de Tab/Shift+Tab, setas, Enter, Espaço e anúncios;
- validação com leitor de tela real;
- Fase E ainda não iniciada.

Próximo passo:
- implementar a Fase E: streak histórico, polimento e validação final da v2.8.
