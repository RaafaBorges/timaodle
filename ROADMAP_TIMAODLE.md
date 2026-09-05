# TIMÃODLE --- ROADMAP E CONTEXTO DO PROJETO

**Versão do documento:** 3.0\
**Data:** 22/08/2026\
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
-   20 jogadores ainda não possuem foto; todos possuem `jogos` numérico e finito.

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

## ✅ v2.8 — CONCLUÍDA: CALENDÁRIO / HISTÓRICO VISUAL

Fases:
- [x] Fase A — modelo do histórico, `trackingStartedAt`, datas civis e limites;
- [x] Fase B — modal e calendário visual;
- [x] Fase C — resumo seguro e detalhado do dia;
- [x] Fase D — acessibilidade avançada e navegação por teclado;
- [x] Fase E — streak histórico e polimento final;
- [x] Validação manual final em navegador real.

Estado atual:
- `timaodle_history_v1` continua sendo a única fonte diária;
- metadata `trackingStartedAt` integrada ao mesmo objeto, sem nova chave de storage;
- calendário visual, modal, resumo seguro e navegação avançada por teclado estão implementados;
- Fases A–E concluídas e aprovadas nas validações automatizada e manual;
- feature de Histórico encerrada oficialmente na v2.8.


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


## 21/08/2026 — v2.8 Fase E: streak histórico e preparação para fechamento

Implementado:
- helper puro `obterSequenciaHistoricaDoDia(data, historico, hoje)` independente do streak
  geral da Home e baseado exclusivamente em `day.complete === true`;
- retorno seguro com pertencimento, sequência até a data selecionada, tamanho total,
  data inicial e data final da sequência;
- períodos parciais, registros 0/4, datas ausentes, futuro e pré-tracking quebram ou não
  participam da sequência;
- viradas de mês, ano e fevereiro bissexto são tratadas pelos helpers civis existentes;
- resumo de dias 4/4 ganhou linha secundária compacta `Sequência até este dia: X dia(s)`;
- streak fica oculto para dias parciais, sem registro e para hoje ainda incompleto;
- apresentação usa somente preto, branco e dourado, sem animação nova ou alteração das
  larguras recentes do modal;
- estados hoje, selecionado, sem registro, parcial, completo, futuro e pré-tracking foram
  revisados e permaneceram distinguíveis sem redesenho;
- contrato estrutural ampliado para proteger o cálculo e a apresentação do streak histórico.

Testado:
- 17 novos cenários permanentes; suíte do calendário ampliada de 101 para 118 cenários;
- sequência de um e vários dias, início/meio/fim, `throughSelectedDate`, `totalRun`,
  `startDate`, `endDate`, interrupção parcial/ausente, mês, ano, bissexto, tracking e futuro;
- hoje completo e hoje parcial validados separadamente;
- suíte completa, storage, regras, anti-spoiler, navegação da Fase D, estrutura frontend,
  sintaxe, JSONs, IDs, CSS balanceado e whitespace validados no encerramento.

Compatibilidade preservada:
- `timaodle_history_v1`, `trackingStartedAt`, estrutura diária, streak geral, saves,
  quatro modos, seeds, estatísticas, calendário, resumo e navegação por teclado;
- nenhum JSON foi alterado e nenhuma animação foi adicionada.

Pendência final:
- validação manual em navegador real nos viewports e fluxos do checklist final;
- a v2.8 permanece **EM ANDAMENTO** até esse aceite manual.

Próximo passo:
- executar a validação manual final e, se aprovada, fechar oficialmente a v2.8 sem adicionar features.


## 21/08/2026 — Fechamento oficial da v2.8

**v2.8 — CONCLUÍDA**

Escopo encerrado:
- Fase A — modelo do histórico, `trackingStartedAt`, datas civis e limites;
- Fase B — modal e calendário visual;
- Fase C — resumo seguro e detalhado do dia selecionado;
- Fase D — acessibilidade avançada, roving tabindex e navegação por teclado;
- Fase E — streak histórico, polimento final e preparação para fechamento;
- `timaodle_history_v1` preservado como única fonte diária da feature.

Validação manual final aprovada em navegador real:
- abertura e fechamento do Histórico, Escape e retorno de foco;
- navegação mensal e limites de `trackingStartedAt` e da data atual;
- dias sem registro, parciais e completos 4/4;
- streak histórico do dia selecionado;
- ArrowLeft/Right, ArrowUp/Down, Home/End e PageUp/PageDown;
- Enter/Espaço, Tab/Shift+Tab e cruzamento entre meses;
- desktop e mobile, sem regressão visual relevante identificada.

Validação técnica do fechamento:
- suíte completa aprovada com storage A–X, 39 cenários de regras, 118 cenários do
  histórico e 27 cenários estruturais;
- 151 IDs verificados sem duplicidade;
- `script.js` e `storage-normalizers.js` aprovados por `node --check`;
- três JSONs válidos e inalterados;
- CSS balanceado, contrato de frontend e `git diff --check` aprovados.

Pendências futuras não bloqueantes:
- validação com leitor de tela real;
- smoke headless quando houver ambiente compatível;
- validação histórica das partidas/formações 4-2-3-1;
- bases históricas residuais do CSS do Onze Inicial já documentadas.

Estado da arquitetura:
- Vanilla JavaScript, HTML e CSS continuam adequados ao porte atual;
- testes permanentes, normalizadores defensivos e contrato estrutural protegem os fluxos centrais;
- nenhuma migração de framework ou grande refatoração é necessária neste momento.

Candidatos naturais para uma versão futura, sem versão iniciada:
- validação e eventual inclusão dos 20 jogadores restantes sem foto e com `jogos: null`;
- validação histórica das formações 4-2-3-1;
- validação acessível com leitor de tela real e smoke headless;
- evolução incremental de funcionalidades somente após definição explícita do próximo escopo.


## ✅ v2.9 — CONCLUÍDA: CONTEÚDO E PRECISÃO

Fases:
- [x] Fase A — auditoria completa dos jogadores, fotos e pools atuais;
- [x] Fase B — cobertura fotográfica concluída: 156/156 fotos (`100%`);
- [x] Fase C — validação e preenchimento das assistências **CONCLUÍDA COM 3 NULLS
  JUSTIFICADOS**: 8 valores confirmados gravados e 3 preservados sem evidência suficiente;
- [x] Fase D — correção pontual de dados: posição de Wallace validada e corrigida para
  `Zagueiro`;
- [x] Fase E — auditoria final aprovada e fechamento oficial da v2.9.

Pendência histórica não bloqueante:
- [x] validação histórica das quatro partidas/formações 4-2-3-1 do Onze Inicial.

Estado inicial confirmado pelo código e pelos dados em 22/08/2026:
- `jogadores.json`: 156 jogadores, 145 completos e 11 com ao menos um campo ausente;
- as 11 lacunas estão exclusivamente em `assistencias: null`; não existem mais valores
  ausentes em `jogos`, diferentemente do contexto histórico anterior do roadmap;
- todos os 156 valores de `jogos` são numéricos e finitos;
- `fotos-manifest.json` é o manifesto efetivamente carregado pelo projeto;
- `jogadores_foto.json` não existe no repositório atual;
- manifesto e pasta `fotos/`: 136 entradas/arquivos, sem duplicidade, órfão, arquivo faltante,
  colisão de slug ou divergência de caixa/extensão;
- Modo Foto: 136 elegíveis e 20 excluídos somente por ausência de foto;
- Mais ou Menos: 136 elegíveis e 20 excluídos somente por ausência de foto;
- Clássico: todos os 156 permanecem elegíveis; lacunas são exibidas como `—` e zero continua válido.

## 22/08/2026 — v2.9 Fase A: auditoria dos jogadores

Auditado:
- presença, nulidade e tipos de `nome`, `posicao`, `nacionalidade`, `estreia`, `jogos`,
  `pe`, `titulos`, `gols` e `assistencias` em todos os 156 jogadores;
- regra de ausência confirmou `null`, propriedade inexistente e string vazia, preservando
  zero como valor válido;
- 11 jogadores incompletos: Carlos Alberto, Coelho, Henrique, Lucca, Marinho,
  Rafael Moura, Uendel, Wallace, Wendel, William e Willian, todos somente sem assistências;
- resolução de fotos por `fotos/<slug-do-nome>.jpg`, manifesto, arquivos físicos,
  correspondência exata com jogadores, acentos, hífens, caixa, extensão e colisões;
- filtros reais do Modo Foto, Mais ou Menos e Clássico;
- fallback `—` e comparações defensivas do Clássico confirmados sem alteração de mecânica.

Fotos ausentes:
- Alex, Bruno Henrique, Camacho, Carlos Alberto, Coelho, Edu Dracena, Fábio Costa,
  Gustavo Nery, Henrique, Lucca, Marcelo Mattos, Marinho, Pedro Henrique, Rafael Moura,
  Rosinei, Uendel, Wallace, Wendel, William e Willian.

Próximas fases planejadas, ainda não executadas:
- Fase B: validar e integrar fotos fornecidas localmente para os 20 jogadores restantes;
- Fase C: pesquisar fontes confiáveis para as 11 assistências ausentes e preencher apenas
  valores confirmados, sem converter ausência de fonte em zero;
- Fase D: validar historicamente as quatro partidas/formações 4-2-3-1;
- Fase E: repetir auditorias, executar suíte completa e preparar o fechamento da v2.9.

Testado:
- baseline completa aprovada com storage A–X, 39 cenários de regras, 118 cenários do
  histórico e 27 cenários estruturais;
- 151 IDs verificados sem duplicidade;
- `script.js` e `storage-normalizers.js` aprovados por `node --check`;
- `jogadores.json`, `partidas.json` e `fotos-manifest.json` validados;
- contrato frontend, CSS balanceado e `git diff --check` aprovados;
- nenhum JSON, arquivo de produção, foto, mecânica, seed, save ou histórico foi alterado.

Próximo passo:
- fornecer manualmente as fotos restantes no padrão JPEG 480×480 para continuidade da Fase B.


## 22/08/2026 — v2.9 Fase B: inventário inicial da cobertura fotográfica

Verificado:
- calculados os 20 nomes esperados conforme o `slugify()` atual;
- nenhum dos 20 arquivos-alvo foi encontrado em `fotos/`, inclusive sob variação de caixa
  ou extensão com o mesmo slug;
- nenhuma imagem foi criada, baixada, editada ou redimensionada;
- `fotos-manifest.json` permaneceu com 136 entradas porque não havia nova foto válida para integrar;
- as 136 fotos atuais continuam legíveis, em JPEG, 480×480 e proporção 1:1;
- manifesto e pasta permanecem em correspondência exata, sem duplicidade, arquivo órfão,
  entrada sem jogador, arquivo ausente ou colisão de slug;
- todos os 156 jogadores possuem `jogos` numérico e finito, portanto cada nova foto válida
  aumentará em uma unidade tanto o pool do Foto quanto o pool do Mais ou Menos.

Impacto atual:
- cobertura: 136/156 (`87,18%`), sem alteração;
- Modo Foto: 136 elegíveis, sem alteração;
- Mais ou Menos: 136 elegíveis, sem alteração;
- 20 jogadores continuam excluídos dos dois modos exclusivamente pela ausência de foto.

Estado da fase:
- **Fase B permanece EM ANDAMENTO**;
- 0 de 20 fotos encontradas e integradas nesta passagem;
- continuação depende do fornecimento manual dos arquivos JPEG 480×480 esperados.

Testado:
- baseline completa, storage, histórico, sintaxe e `git diff --check` aprovados;
- inventário técnico das 136 fotos atuais aprovado;
- `jogadores.json`, `partidas.json` e mecânicas permaneceram inalterados.

Próximo passo:
- adicionar manualmente um lote dos arquivos esperados à pasta `fotos/` e repetir a validação
  antes de modificar o manifesto.


## 22/08/2026 — v2.9 Fase B: integração do primeiro lote de 9 fotos

Integrado:
- validadas e adicionadas ao manifesto as fotos de Alex, Bruno Henrique, Camacho,
  Edu Dracena, Fábio Costa, Gustavo Nery, Marcelo Mattos, Pedro Henrique e Rosinei;
- os nove arquivos são JPEG reais e legíveis, 480×480, proporção 1:1, com nomes
  compatíveis com o `slugify()` atual e hashes distintos;
- `fotos-manifest.json` passou de 136 para 145 entradas únicas;
- cobertura ampliada de 136/156 (`87,18%`) para 145/156 (`92,95%`);
- pool do Modo Foto ampliado de 136 para 145 jogadores;
- pool do Mais ou Menos ampliado de 136 para 145 jogadores, todos com `jogos`
  numérico e finito.

Auditoria após a integração:
- 145 arquivos físicos e 145 entradas no manifesto, em correspondência exata;
- nenhuma duplicidade de nome ou conteúdo, entrada sem jogador, arquivo ausente ou órfão,
  colisão de slug, divergência de caixa/extensão, imagem ilegível ou dimensão incorreta;
- permanecem sem foto Carlos Alberto, Coelho, Henrique, Lucca, Marinho, Rafael Moura,
  Uendel, Wallace, Wendel, William e Willian.

Estado da fase:
- **Fase B permanece EM ANDAMENTO**;
- progresso acumulado: 9 de 20 fotos restantes validadas e integradas;
- faltam 11 arquivos JPEG 480×480 para atingir cobertura fotográfica completa.

Testado:
- baseline e suíte final aprovadas com storage A–X, 39 cenários de regras, simulação do
  Mais ou Menos v2 em 180 datas, 118 cenários de histórico e 27 cenários estruturais;
- 151 IDs verificados, sintaxe de `script.js` e `storage-normalizers.js`, três JSONs,
  contrato frontend, inventário integral das imagens e `git diff --check` aprovados;
- nenhuma mecânica, seed, save, histórico, estatística ou dado de jogador foi alterado.

Próximo passo:
- fornecer e integrar as 11 fotos restantes antes de concluir a Fase B; depois avançar
  à Fase C para validação externa das assistências ausentes.


## 22/08/2026 — v2.9 Fase B: cobertura fotográfica concluída

Integrado:
- validadas e adicionadas ao manifesto as fotos de Carlos Alberto, Coelho, Henrique,
  Lucca, Marinho, Rafael Moura, Uendel, Wallace, Wendel, William e Willian;
- os 11 arquivos são JPEG reais e legíveis, 480×480, proporção 1:1, com slugs corretos,
  correspondência exata em `jogadores.json` e conteúdo não duplicado;
- `fotos-manifest.json` passou de 145 para 156 entradas únicas;
- cobertura ampliada de 145/156 (`92,95%`) para 156/156 (`100%`);
- pool efetivo do Modo Foto ampliado de 145 para 156 jogadores;
- pool efetivo do Mais ou Menos ampliado de 145 para 156 jogadores, todos com `jogos`
  numérico e finito.

Auditoria completa:
- 156 jogadores, 156 entradas únicas e 156 arquivos físicos em correspondência exata;
- 156 JPEGs legíveis, 480×480 e quadrados;
- zero entrada duplicada, arquivo órfão, entrada sem arquivo, entrada sem jogador,
  colisão de slug, divergência de caixa/extensão ou duplicidade de conteúdo;
- algoritmos, seeds, plano 3/4/3, snapshots, persistência, saves e dados dos jogadores
  permaneceram inalterados.

Estado da fase:
- **Fase B — CONCLUÍDA**;
- cobertura fotográfica integral: **156/156 (`100%`)**;
- v2.9 permanece **EM ANDAMENTO**.

Testado:
- suíte permanente completa, testes específicos de storage e histórico, sintaxe de
  `script.js` e `storage-normalizers.js`, três JSONs e `git diff --check` aprovados;
- inventário físico, formato real, legibilidade, dimensões, proporção, slugs,
  correspondências e duplicidades das 156 imagens aprovados;
- pools Foto e Mais ou Menos confirmados pelo mesmo critério usado no código real.

Próximo passo:
- **Fase C — validação externa das 11 assistências atualmente `null`**, sem inferir zero
  nem preencher valores sem fonte confiável.


## 22/08/2026 — v2.9 Fase C: pesquisa das assistências em andamento

Pesquisado:
- identidades, posições e períodos no Corinthians dos 11 jogadores com
  `assistencias: null`;
- estatísticas detalhadas por clube, temporada e competição, priorizando Transfermarkt
  e cruzando o resultado com oGol, Meu Timão e bases históricas complementares;
- escopo de jogos oficiais e diferenças entre as contagens das fontes e os jogos totais
  históricos mantidos pelo projeto;
- zeros foram aceitos somente quando a fonte apresentou explicitamente `0`, sem converter
  traço, campo ausente ou cobertura incompleta em zero.

Resultado da pesquisa:
- **8 confirmados**: Carlos Alberto (5), Coelho (4), Henrique (0), Rafael Moura (0),
  Wallace (0), Wendel (0), William (1) e Willian (5);
- **2 provisórios**: Lucca (3 nas temporadas cobertas, mas 2018 sem assistência
  registrada pela fonte) e Uendel (divergência entre totais publicados);
- **1 sem dado confiável**: Marinho, sem cobertura integral de assistências encontrada;
- `jogadores.json` permaneceu inalterado; a Fase C não está concluída e nenhum valor foi
  incorporado ao banco nesta etapa.

Pendências:
- obter uma fonte integral para Lucca, resolver a divergência de Uendel e localizar uma
  base histórica confiável para Marinho;
- somente depois de aprovação explícita, gravar os oito valores confirmados em
  `jogadores.json` e manter `null` nos casos ainda não comprovados.

Próximo passo:
- revisar e aprovar o relatório da pesquisa; em uma etapa separada, preencher apenas os
  valores confirmados e executar a auditoria completa dos dados.


## 22/08/2026 — v2.9 Fase C: correção da foto de Willian

Corrigido:
- `fotos/willian.jpg` passou a representar Willian Gomes de Siqueira, o Willian Bigode,
  atacante do Corinthians em 2011–2012, em substituição à imagem incompatível de Willian
  Borges da Silva;
- slug, nome no manifesto, ordem, referências e estrutura de `fotos-manifest.json`
  permaneceram inalterados;
- a Fase C continua **EM ANDAMENTO** e nenhum campo de `jogadores.json`, inclusive
  assistências e a posição de Wallace, foi alterado.

Validado:
- nova imagem em JPEG válido e legível, 480×480, proporção 1:1 e sem conteúdo duplicado;
- auditoria integral aprovada com 156 jogadores, 156 entradas únicas e 156 imagens em
  correspondência exata, todas JPEG 480×480 e quadradas;
- zero arquivo órfão, ausente ou duplicado, entrada sem jogador, colisão de slug ou
  divergência de caixa/extensão;
- pools preservados com 156 elegíveis no Modo Foto e 156 no Mais ou Menos;
- suíte permanente, storage, histórico, sintaxe, três JSONs e whitespace aprovados.

Próximo passo:
- em etapa separada, gravar somente os oito valores de assistências confirmados e manter
  `null` nos casos provisórios ou sem dado confiável.


## 22/08/2026 — v2.9 Fase C: assistências confirmadas gravadas

Implementado:
- gravados exclusivamente os valores confirmados de assistências: Carlos Alberto (5),
  Coelho (4), Henrique (0), Rafael Moura (0), Wallace (0), Wendel (0), William (1) e
  Willian (5);
- Lucca, Marinho e Uendel permaneceram com `assistencias: null`, pois a pesquisa não
  produziu evidência suficiente para um valor definitivo;
- zeros foram mantidos como números válidos, sem conversão para string ou fallback visual;
- foto de Willian permanece corrigida para Willian Gomes de Siqueira;
- posição de Wallace permaneceu `Volante` nesta etapa e segue como pendência separada.

Auditoria do banco:
- 156 jogadores, 153 completamente preenchidos e 3 com campo ausente;
- os únicos valores ausentes são as 3 assistências justificadas;
- 24 jogadores possuem `gols: 0` e 59 possuem `assistencias: 0`;
- fallback `—` continua restrito a valores ausentes, enquanto zero é renderizado como `0`;
- comparações com valor desconhecido continuam sem setas de maior/menor.

Testado:
- suíte permanente completa, storage, histórico, sintaxe de `script.js` e
  `storage-normalizers.js` aprovados;
- regressão específica de Henrique, Rafael Moura, Wallace, Wendel, Lucca, Marinho e Uendel;
- três JSONs, 156 fotos, pools Foto/MM, contrato frontend, IDs, CSS balanceado e whitespace
  validados;
- nenhum HTML, CSS, JavaScript, manifesto, partida, foto, save, seed, histórico ou calendário
  foi alterado nesta gravação.

Estado da fase:
- **Fase C — CONCLUÍDA COM 3 NULLS JUSTIFICADOS**.

Próximo passo:
- iniciar a Fase D com a validação histórica das partidas e formações 4-2-3-1; tratar a
  posição de Wallace somente em uma tarefa de correção de dados explicitamente aprovada.


## 22/08/2026 — v2.9 Fase D: correção pontual da posição de Wallace

Implementado:
- identidade reconfirmada como Wallace Reis da Silva, zagueiro do Corinthians em
  2011–2012, compatível com estreia, jogos, gol e títulos existentes no registro;
- alterado exclusivamente `posicao: "Volante"` para `posicao: "Zagueiro"` no registro
  Wallace;
- assistências, demais jogadores, fotos, manifesto, partidas, código, seeds e mecânicas
  permaneceram inalterados.

Impacto validado:
- o Clássico passa a exibir e comparar Wallace como zagueiro;
- o save do Clássico armazena data, nomes das tentativas e status, não snapshots ou objetos
  completos dos jogadores;
- tentativas antigas com o nome Wallace continuam válidas e são restauradas usando os dados
  atuais, sem reset de progresso;
- jogador secreto continua determinístico por data e não depende da posição para o sorteio;
- normalizadores, histórico integrado e saves permaneceram compatíveis;
- pools Foto e Mais ou Menos permaneceram com 156 jogadores.

Testado:
- comparação correta/incorreta de posição de Wallace e restauração de save nominal;
- suíte permanente completa, storage, histórico, sintaxe, três JSONs, 156 fotos, pools,
  frontend contract, IDs, CSS balanceado e whitespace aprovados.

Estado:
- **Fase D — correção pontual de Wallace CONCLUÍDA**;
- v2.9 permanece **EM ANDAMENTO**;
- validação histórica das partidas/formações 4-2-3-1 continua pendente.

Próximo passo:
- realizar a validação histórica das partidas/formações 4-2-3-1 antes da auditoria final
  e do fechamento da v2.9.


## 22/08/2026 — Fechamento oficial da v2.9

**v2.9 — CONCLUÍDA**

Escopo encerrado:
- Fase A — auditoria integral dos 156 jogadores, campos, fotos e pools;
- Fase B — cobertura fotográfica ampliada e validada em 156/156 (`100%`);
- Fase C — oito assistências confirmadas adicionadas e três dados desconhecidos
  justificados preservados como `null`;
- Fase D — posição de Wallace corrigida de volante para zagueiro após validação de
  identidade e compatibilidade;
- Fase E — auditoria final dos dados, imagens, modos, persistência e regressões aprovada.

Estado final dos jogadores:
- 156 jogadores, 153 completamente preenchidos e 3 incompletos apenas por assistências;
- Lucca permanece `null` por cobertura estatística incompleta;
- Marinho permanece `null` por ausência de cobertura integral confiável;
- Uendel permanece `null` por divergência material entre fontes;
- os três casos são **DADOS DESCONHECIDOS JUSTIFICADOS**, não falhas de integridade;
- zero ausências nos demais campos, zero nomes duplicados e 156 valores de `jogos`
  numéricos e finitos;
- 24 jogadores com `gols: 0` e 59 com `assistencias: 0`;
- posições do Clássico limitadas aos seis valores presentes e reconhecidos: Atacante,
  Goleiro, Lateral, Meia, Volante e Zagueiro.

Identidades críticas revalidadas:
- Wallace Reis da Silva: Zagueiro, 59 jogos, 1 gol e 0 assistências; foto e save nominal
  coerentes;
- Willian Gomes de Siqueira, o Willian Bigode: Atacante, 82 jogos, 15 gols e 5
  assistências; `fotos/willian.jpg` correto;
- William Machado de Oliveira: Zagueiro, 161 jogos, 4 gols e 1 assistência;
  `fotos/william.jpg` correto;
- arquivos, slugs e conteúdos de Willian e William permanecem distintos.

Cobertura e modos:
- 156 entradas únicas no manifesto e 156 arquivos físicos em correspondência exata;
- 156 JPEGs estruturalmente válidos, 480×480 e 1:1;
- zero arquivo órfão, ausente ou duplicado, entrada sem jogador, colisão de slug ou
  divergência de caixa/extensão;
- Modo Foto: 156 elegíveis;
- Mais ou Menos: 156 elegíveis, todos com `jogos` numérico e finito;
- Clássico: 156 elegíveis, zero renderizado como `0`, ausência como `—` e desconhecidos
  sem setas enganosas;
- `partidas.json`: 9 partidas, 9 IDs únicos, 11 titulares por partida, posições e
  coordenadas estruturalmente válidas.

Validação final:
- suíte permanente completa aprovada com storage A–X, 39 cenários de regras e simulação
  do Mais ou Menos v2 em 180 datas, 118 cenários de histórico e 27 cenários estruturais;
- 151 IDs verificados sem duplicidade;
- `script.js` e `storage-normalizers.js` aprovados por `node --check`;
- três JSONs válidos, inventário das 156 fotos, frontend contract, CSS balanceado e
  `git diff --check` aprovados;
- histórico, calendário, streak, estatísticas, compartilhamento, `trackingStartedAt`,
  normalizadores e saves existentes permaneceram compatíveis;
- nenhuma feature, mecânica, seed, arquivo de produção ou dado adicional foi alterado no
  fechamento.

Pendências futuras não bloqueantes:
- assistências de Lucca, até existir fonte com cobertura integral;
- assistências de Marinho, até existir fonte histórica confiável;
- assistências de Uendel, até a divergência entre fontes ser resolvida;
- validação histórica das quatro partidas/formações 4-2-3-1;
- validação com leitor de tela real;
- smoke headless quando houver ambiente compatível.

Estado da arquitetura:
- Vanilla JavaScript, HTML e CSS continuam adequados ao porte atual;
- normalizadores defensivos, testes permanentes e contrato estrutural continuam
  protegendo os fluxos centrais;
- nenhuma refatoração ampla ou migração de tecnologia é necessária para o próximo marco.

Candidatos naturais para a próxima etapa, sem nova versão iniciada:
- validação histórica e eventual correção das formações do Onze Inicial;
- polimento de conteúdo e expansão segura do Onze Inicial;
- novas partidas históricas após validação documental;
- melhorias incrementais de retenção e evolução de produto.


## 22/08/2026 — Onze Inicial: validação histórica das formações 4-2-3-1

**Status: EM ANDAMENTO**

Auditado, sem alterar `partidas.json`:
- identificadas e confrontadas com fontes históricas as quatro partidas atualmente
  declaradas como 4-2-3-1: Boca Juniors (2012), Vasco da Gama (2012), Palmeiras (2011)
  e Palmeiras (2017);
- Boca Juniors 2012, Vasco da Gama 2012 e Palmeiras 2017 possuem escalações coerentes
  com as fichas consultadas e distribuição ofensiva suficientemente documentada para
  uma correção futura de coordenadas;
- Palmeiras 2011 requer revisão manual antes de qualquer correção: a escalação
  histórica traz Paulo André e Liedson como titulares, enquanto o JSON atual registra
  Chicão e Danilo;
- a classificação tática nominal varia entre fontes (4-2-3-1, 4-4-1-1, 4-3-3 ou
  4-5-1), mas os papéis e corredores permitem representar as três partidas coerentes
  no modelo 4-2-3-1 usado pelo campo;
- nenhuma escalação, formação, coordenada, mecânica ou arquivo de produção foi
  alterado nesta auditoria.

Resultado provisório:
- **3 partidas PRONTAS PARA CORREÇÃO** de coordenadas em etapa separada;
- **1 partida com REVISÃO MANUAL RECOMENDADA** por divergência de titulares;
- **0 partidas SEM EVIDÊNCIA SUFICIENTE**;
- a validação histórica das quatro partidas permanece **EM ANDAMENTO** e não está
  marcada como concluída.

Testado:
- suíte permanente completa, storage, histórico, sintaxe de `script.js` e
  `storage-normalizers.js`, além de `git diff --check`, aprovados antes da atualização
  documental.

Próximo passo:
- revisar manualmente a escalação de Palmeiras 2011 e, após aprovação explícita,
  aplicar em tarefa separada as correções de titulares e coordenadas recomendadas.


## 22/08/2026 — Onze Inicial: correção das distribuições 4-2-3-1 validadas

Implementado:
- corrigida a linha ofensiva de Boca Juniors 2012 para Emerson Sheik centralizado à
  frente e Alex, Danilo e Jorge Henrique distribuídos em 20/50/80 logo atrás;
- corrigida a linha ofensiva de Vasco da Gama 2012 para Alex como referência central e
  Emerson Sheik, Danilo e Jorge Henrique distribuídos em 20/50/80;
- corrigida a linha ofensiva de Palmeiras 2017 para Jô centralizado à frente e Clayson,
  Rodriguinho e Ángel Romero distribuídos em 20/50/80;
- as três formações permaneceram declaradas como 4-2-3-1;
- IDs, titulares, posições abreviadas, goleiros, defesas, volantes e demais dados
  permaneceram inalterados.

Validado:
- `partidas.json` continua com 9 partidas, IDs preservados e exatamente 11 titulares em
  cada uma;
- validação semântica contra a versão anterior confirmou exclusivamente 12 jogadores
  autorizados e 17 valores escalares de `top`/`left` modificados;
- cada uma das três partidas agora possui um atacante em 12/50 e uma linha de três em
  30/20, 30/50 e 30/80;
- Palmeiras 2011 permaneceu integralmente inalterada;
- suíte permanente, storage, histórico, sintaxe, três JSONs, frontend contract, IDs,
  CSS balanceado e `git diff --check` aprovados;
- saves continuam compatíveis porque IDs e nomes dos titulares não mudaram; o progresso
  salvo por `partidaId`, jogadores descobertos e histórico integrado não é invalidado por
  coordenadas visuais.

Estado:
- Boca Juniors 2012, Vasco da Gama 2012 e Palmeiras 2017: **CORRIGIDAS**;
- validação histórica completa permanece **EM ANDAMENTO**;
- Palmeiras 2011 continua pendente porque exige corrigir os titulares Chicão/Paulo André
  e Danilo/Liedson antes de ajustar sua distribuição.

Próximo passo:
- revisar e aprovar explicitamente a correção de titulares e coordenadas de Palmeiras
  2011 em uma tarefa separada.


## 22/08/2026 — Banco de jogadores: inclusão de Paulo André

Implementado:
- Paulo André adicionado ao `jogadores.json` com os nove campos pesquisados e aprovados;
- banco ampliado de 156 para 157 jogadores, com 157 nomes e slugs únicos;
- pool do Clássico ampliado de 156 para 157 jogadores;
- `fotos/paulo-andre.jpg` não estava disponível, portanto o manifesto permaneceu com
  156 entradas e Paulo André não foi incluído no Foto nem no Mais ou Menos;
- documentado que alterações no tamanho do banco podem mudar o segredo diário do
  Clássico durante o desenvolvimento; por decisão de pré-lançamento, nenhuma migração
  ou persistência adicional foi implementada nesta etapa.

Validado:
- 157 jogadores: 154 completos e 3 incompletos somente por `assistencias: null` em
  Lucca, Marinho e Uendel;
- Paulo André possui posição reconhecida, `jogos: 153` numérico e finito e todos os
  campos preenchidos;
- pools efetivos: Clássico 157, Foto 156 e Mais ou Menos 156;
- Liedson e Paulo André agora existem em `jogadores.json` para a futura correção da
  escalação;
- `partidas.json`, inclusive Palmeiras 2011, e `fotos-manifest.json` permaneceram
  integralmente inalterados;
- suíte permanente, storage, histórico, sintaxe, três JSONs, nomes, slugs, pools,
  frontend contract, IDs, CSS balanceado e `git diff --check` aprovados.

Estado:
- Paulo André está temporariamente disponível apenas no Clássico;
- validação histórica de Palmeiras 2011 permanece **EM ANDAMENTO**;
- falta fornecer `fotos/paulo-andre.jpg` no padrão JPEG 480×480 e, em tarefa separada,
  corrigir os titulares e a distribuição da partida.

Próximo passo:
- validar e integrar a foto de Paulo André quando fornecida ou avançar diretamente para
  a correção histórica de Palmeiras 2011, mantendo o jogador fora de Foto/MM até lá.


## 22/08/2026 — Fotos: integração de Paulo André

Implementado:
- `fotos/paulo-andre.jpg` validada e integrada ao `fotos-manifest.json` sem alterar
  slug, ordem existente, mecânicas, seeds ou persistência;
- manifesto e cobertura fotográfica ampliados de 156 para 157 jogadores;
- pools efetivos do Modo Foto e do Mais ou Menos ampliados de 156 para 157 jogadores.

Validado:
- Paulo André existe em `jogadores.json`, resolve para o slug único `paulo-andre` e
  possui `jogos: 153` numérico e finito;
- a imagem é um JPEG real e legível, mede exatamente 480×480, possui proporção 1:1 e
  conteúdo distinto das demais fotos;
- inventário completo com 157 jogadores, 157 entradas únicas no manifesto e 157
  arquivos físicos correspondentes;
- as 157 imagens são JPEGs legíveis em 480×480, sem arquivos órfãos, ausentes,
  colisões de slug ou duplicidades de conteúdo;
- cobertura final: **157/157 (100%)**; pools finais: Clássico 157, Foto 157 e Mais ou
  Menos 157.

Estado:
- integração fotográfica de Paulo André **CONCLUÍDA**;
- correção histórica de Palmeiras 2011 permanece pendente e não foi alterada nesta
  etapa.

Próximo passo:
- corrigir em tarefa separada os titulares e a distribuição de Palmeiras 2011, agora
  que Paulo André e Liedson estão disponíveis no banco.


## 22/08/2026 — Onze Inicial: conclusão da validação histórica 4-2-3-1

**Status: CONCLUÍDA**

Implementado:
- Palmeiras 2011 corrigida com Paulo André no lugar de Chicão e Liedson no lugar de
  Danilo, preservando os mesmos slots da lista de titulares;
- Paulo André manteve a função `ZAG` e as coordenadas 72/60; Wallace permaneceu `VOL`
  no contexto histórico da partida;
- bloco ofensivo ajustado para Liedson em 12/50 e Jorge Henrique, Alex e Willian em
  30/20, 30/50 e 30/80;
- formação `4-2-3-1` e `local_tag: "NEUTRO"` preservados;
- migração pequena e idempotente adicionada antes da normalização dos nomes do save de
  `palmeiras-2011`, convertendo Chicão em Paulo André e Danilo em Liedson somente nos
  jogadores resolvidos;
- substitutos antes registrados como palpites incorretos são removidos dessa lista e
  promovidos quando correspondem a um slot oculto atual; duplicidades são eliminadas e
  a conclusão é recalculada após a migração;
- erros, placar, `exactScore`, data e `partidaId` permanecem preservados; o histórico
  integrado antigo não é reescrito retroativamente.

Validado:
- Palmeiras 2011 possui exatamente 11 titulares únicos, todos presentes no banco e no
  manifesto, com posições abreviadas válidas e coordenadas entre 0 e 100;
- Paulo André e Liedson presentes; Chicão e Danilo ausentes; goleiro, laterais, demais
  defensores e volantes preservados;
- migração coberta por saves sem progresso, parciais e concluídos, substituições
  individuais e conjuntas, palpite incorreto do substituto, execução duplicada, partida
  diferente e save legado sem `partidaId`;
- Boca 2012, Vasco 2012, Palmeiras 2011 e Palmeiras 2017 possuem 11 titulares e a
  distribuição validada de atacante central em 12/50 mais linha de três em 30/20,
  30/50 e 30/80.

Pendência não bloqueante:
- a semântica de `local_tag: "NEUTRO"` em Palmeiras 2011 permanece como observação
  separada, sem mudança de dado nesta etapa.

Próximo passo:
- realizar teste visual da escalação de Palmeiras 2011 quando ela for selecionada em
  navegador real e tratar `local_tag` somente após formalizar sua semântica no projeto.


## v3.0 — UX & VISUAL POLISH

**Status: CONCLUÍDA — FASES A, B, C, D, E E F CONCLUÍDAS / VALIDAÇÃO FINAL APROVADA**

Objetivo:
- refinar hierarquia, clareza, simplicidade, consistência e conforto responsivo sem
  alterar mecânicas, dados, seeds ou persistência;
- preservar a identidade de jogo do Corinthians em preto, branco e dourado, evitando
  aparência de dashboard corporativo genérico.

Diagnóstico inicial:
- não foi encontrado P0 estrutural evidente na inspeção estática; os fluxos centrais
  permanecem compreensíveis e protegidos pela suíte;
- a Home concentra timer, jogador anterior, progresso, streak, resumo 4/4, duas ações
  secundárias e quatro cards, com Estatísticas/Histórico aparecendo antes dos modos;
- o conteúdo principal da Home permanece limitado a aproximadamente 400 px e uma coluna
  mesmo em desktop amplo, desperdiçando espaço e aumentando o scroll;
- cards dos modos acumulam título, emoji, explicação, divisor e estado, produzindo caixas
  dentro de caixas e repetição visual;
- os quatro botões Voltar usam emoji colorido `⬅`, área de 40×40 e aparência pouco
  integrada à linguagem tipográfica do projeto;
- Foto preserva corretamente a imagem como foco, mas o botão `🎨`, labels do status e
  lista de tentativas competem progressivamente com ela;
- Mais ou Menos possui boa prioridade para fotos, nomes, números e ações, porém mantém
  simultaneamente rodada, acertos, dez marcadores, objetivo, legenda e labels redundantes;
- Onze Inicial tem hierarquia funcional, mas combina card de contexto, placar, campo,
  progresso, faltam, busca, feedback e erros; informações secundárias podem ser reveladas
  conforme a etapa;
- Histórico combina calendário, resumo, quatro linhas, progresso e streak no mesmo fluxo;
  a seleção do dia é clara, mas o resumo pode receber menos peso antes da escolha;
- Estatísticas apresenta oito métricas gerais e até dez métricas por modo, distribuições
  e muitos chips com peso semelhante, sem separar claramente principal, secundário e
  detalhado;
- resultados finais possuem boa identidade individual, mas variam em título, mensagem,
  contador, ação de compartilhar e indicação do próximo desafio;
- o CSS usa 219 declarações de tamanho de fonte com 63 valores distintos, incluindo
  labels de 8–10 px; há 245 declarações de borda e 114 referências diretas ao dourado,
  indicando oportunidade de reduzir ruído sem trocar a identidade.

Prioridades da auditoria:
- **P1 / risco médio:** reordenar a hierarquia da Home e aproveitar melhor desktop;
- **P1 / risco baixo:** substituir Voltar e controles utilitários coloridos por linguagem
  monocromática consistente e alvos de toque de pelo menos 44 px;
- **P1 / risco médio:** criar níveis principal/secundário/detalhado nas Estatísticas;
- **P1 / risco médio:** reduzir informação simultânea no Onze Inicial e no Histórico;
- **P2 / risco baixo:** reduzir emojis decorativos, bordas, pills e dourado concorrente;
- **P2 / risco médio:** harmonizar o esqueleto visual dos resultados finais;
- **P2 / risco baixo:** consolidar escala tipográfica e elevar labels essenciais abaixo
  de 10 px;
- **P3 / risco baixo:** ajustar microespaçamentos, sombras, divisores e animações.

Estado das fases:
- [x] **Fase A — CONCLUÍDA:** linguagem visual compartilhada, iconografia monocromática,
  navegação, cabeçalhos dos modos, buscas e comportamento sticky responsivo;
- [x] **Fase B — CONCLUÍDA — Home:** informação diária
  simplificada, quatro modos priorizados, jornada pessoal separada e desktop ampliado;
- [x] **Fase C — CONCLUÍDA — resultados finais e continuidade do dia:** linguagem compartilhada de
  conclusão, métrica principal, compartilhar, retorno à Home e acesso aos modos ainda
  não concluídos;
- [x] **Fase D — CONCLUÍDA — modos:** Clássico, Foto, Mais ou Menos e Onze Inicial em pequenas
  entregas independentes;
- [x] **Fase E — CONCLUÍDA — Histórico e Estatísticas:** E.1, E.2, E.3, E.4 e E.5 concluídas; validação manual final aprovada; divulgação progressiva e níveis de métricas,
  preservando todos os dados;
- [x] **Fase F — CONCLUÍDA — validação final:** navegador real nos viewports definidos, teclado,
  reduced motion, overflow, contraste e regressão integral.

Objetivos consolidados da Fase B — Home:
- reduzir a quantidade de informação exibida simultaneamente;
- tornar os quatro modos os protagonistas da tela;
- rever a posição e o peso de Estatísticas e Histórico;
- separar progresso do dia de informações históricas;
- rever o bloco **TIMÃODLE DO DIA** e mover ou reformular o streak;
- aproveitar melhor o desktop, que ainda parece excessivamente estreito e vertical;
- preservar um mobile simples, legível e sem excesso de scroll;
- evitar card dentro de card e reduzir o uso decorativo de dourado;
- manter a identidade preto, branco e dourado e todas as mecânicas atuais.

Escopo futuro da Fase C — resultados finais e continuidade do dia:
- ao concluir qualquer modo, apresentar overlay/card com linguagem Timãodle compartilhada,
  sem aparência de modal genérico e sem obrigar estruturas internas idênticas;
- resultado explícito: **GANHOU**, **PERDEU** ou **CONCLUÍDO**, conforme a mecânica real;
- Clássico: **GANHOU** e `X tentativa(s)`, sem inventar derrota inexistente;
- Foto: **GANHOU** ou **PERDEU** e métrica `X/6`;
- Mais ou Menos: **GANHOU** ou **PERDEU** e `X/10 acertos`;
- Onze Inicial: **CONCLUÍDO**, `3/3 jogadores`, `X erro(s)` e placar exato somente como
  informação secundária segura;
- reutilizar os compartilhamentos existentes, sem criar sistema paralelo de resultado;
- oferecer **COMPARTILHAR** e **VOLTAR À HOME** com a navegação atual;
- derivar continuidade exclusivamente de `obterProgressoDiario()` ou da fonte consolidada
  equivalente, distinguindo não iniciado, em andamento e concluído;
- usar a linguagem **AINDA FALTA CONCLUIR** e mostrar somente modos ainda não concluídos,
  permitindo abri-los diretamente pela navegação existente;
- quando o dia estiver completo, mostrar **TIMÃODLE DO DIA COMPLETO — 4/4** sem botões de
  modos pendentes;
- preservar preto, branco e dourado, símbolos monocromáticos e verde/vermelho discretos;
- prever `role` apropriado, título associado, foco inicial, Escape quando aplicável,
  retorno de foco, teclado e alvos de toque;
- validar sem overflow em 360, 390, 412, 430, 480, 768 e desktop;
- não alterar mecânicas, estados, saves ou textos compartilhados além do necessário para
  apresentar a camada comum.

Regra de iconografia da v3.0:
- reduzir a dependência de emojis coloridos na interface permanente sem simplesmente
  trocá-los por outros emojis;
- adotar, nesta ordem, símbolo tipográfico monocromático, SVG simples com `currentColor`,
  CSS e texto sem ícone quando a imagem não acrescentar informação;
- avaliar cada ocorrência como **MANTER**, **SUBSTITUIR POR SÍMBOLO**, **SUBSTITUIR POR
  SVG**, **SUBSTITUIR POR CSS** ou **REMOVER**, sem substituição automática em massa;
- criar uma linguagem pequena e reutilizável em preto, branco e dourado, ligada a
  futebol/Corinthians e com aparência de jogo;
- evitar dependência da renderização nativa de emojis do sistema operacional ou
  navegador e não introduzir cores alheias à identidade por meio dos glifos;
- tratar separadamente os emojis gerados apenas no texto de compartilhamento, pois não
  fazem parte da interface permanente;
- marcar ícones decorativos como ignoráveis por tecnologia assistiva, dar nome acessível
  a todo botão somente com ícone e nunca comunicar estado importante apenas pelo ícone;
- candidatos iniciais da Fase A: `⬅` → `←`/`← VOLTAR`; fogo do streak → símbolo/SVG
  monocromático; compartilhar → SVG `currentColor`; controle `🎨` → ícone de
  filtro/contraste; `✅`/`❌` → `✓`/`✕`; ícones dos quatro modos → SVG, CSS ou remoção
  após avaliação individual.

Restrições preservadas:
- regras, seeds, saves, streak, histórico, pools, banco de jogadores, três ocultos do
  Onze Inicial e balanceamento do Mais ou Menos não fazem parte desta rodada visual;
- foto como protagonista, cores semânticas do Clássico, campo do Onze Inicial e números
  principais do Mais ou Menos devem permanecer reconhecíveis.

Testado nesta auditoria:
- suíte permanente completa, storage, histórico, sintaxe de `script.js` e
  `storage-normalizers.js`, frontend contract, 151 IDs e `git diff --check` aprovados;
- inspeção estática de `index.html`, `style.css`, classes dinâmicas e breakpoints;
- validação visual real nos viewports permanece para cada fase de implementação.

Próximo passo:
- iniciar a Fase A com uma proposta pequena para navegação/ícones e tokens de hierarquia,
  validando o botão Voltar antes de modificar a Home.


## 22/08/2026 — v3.0 Fase A: linguagem visual e navegação

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL APROVADA / E.2 PRÓXIMA**

Implementado:
- os quatro controles Voltar agora usam `← VOLTAR` no desktop e somente `←` no mobile,
  com o mesmo `aria-label`, alvo mínimo de 44×44, hover, active e foco visível;
- criada a base `.ui-icon` para SVGs monocromáticos que herdam `currentColor`, sem
  biblioteca ou cores internas hardcoded;
- calendário, foto, comparação e campo dos cards receberam SVGs decorativos simples;
- streak recebeu chama monocromática em SVG e o controle de contraste do Foto recebeu
  SVG próprio, alvo 44×44 e nome acessível explícito;
- compartilhar passou a usar texto sem ícone na interface; o texto compartilhado em si
  permaneceu intacto;
- mensagens visuais de sucesso/erro do Clássico e Foto passaram a usar `✓`/`✕` no lugar
  de emojis coloridos;
- bandeiras nativas do Mais ou Menos foram substituídas por `Nacionalidade · Posição`,
  preservando e tornando explícita a informação;
- controles de fechar modal e ajuda foram elevados para alvo de 44×44;
- Estatísticas e Histórico mantiveram estrutura e posição, mas seus botões secundários
  deixaram de usar dourado como decoração permanente.

Inventário e decisão:
- **MANTER:** corações preto/branco em saudação e assinatura, águia/badges do footer
  nesta fase, setas tipográficas do Clássico e MM, chevrons do widget e emojis dentro dos
  textos de compartilhamento;
- **SUBSTITUIR POR SÍMBOLO:** `⬅` → `←`/`← VOLTAR`; `✅`/`❌` e celebração visual →
  `✓`/`✕` nas mensagens permanentes;
- **SUBSTITUIR POR SVG:** ícones dos quatro modos, fogo do streak e contraste do Foto,
  todos com `currentColor` e `aria-hidden` quando decorativos;
- **SUBSTITUIR POR CSS:** nenhum caso nesta fase; não foi criada abstração sem benefício;
- **REMOVER:** `📤` dos botões de compartilhar, emojis repetidos nos títulos internos e
  tutorial do Foto, além das bandeiras nativas substituídas por texto;
- compartilhamentos preservam `✅`, `🔥`, quadrados coloridos, bola e corações porque
  pertencem à linguagem textual externa, não à interface permanente.

Proteção permanente:
- contrato estrutural cobre os quatro IDs Voltar, nomes acessíveis, seta monocromática,
  ausência de `⬅`, alvo mínimo, foco visível, SVG de contraste e ausência dos emojis
  coloridos substituídos no HTML;
- frontend contract documenta o padrão compartilhado de navegação e `.ui-icon`.

Riscos e validação manual pendente:
- confirmar legibilidade dos SVGs nas renderizações reais de Windows, macOS, Android e
  navegadores móveis;
- confirmar que `← VOLTAR` não comprime as barras em desktop/tablet e que o alvo circular
  de 44 px permanece confortável no mobile;
- verificar contraste, hover, active e focus-visible nos quatro modos;
- confirmar visualmente que compartilhamentos mantiveram sua grade/texto e que nenhuma
  mudança alterou comportamento funcional.

Checklist manual:
- desktop 1366×768, 1440×900 e 1920×1080: quatro botões Voltar, hover, foco, alinhamento
  e iconografia;
- mobile 360×800, 390×844, 412×915 e 480×900: seta isolada, alvo de toque, ausência de
  overflow e barras de status sem colisão;
- abrir Clássico, Foto, Mais ou Menos e Onze Inicial; testar retorno à Home;
- abrir/fechar Como Jogar, Estatísticas e Histórico; testar foco dos controles de fechar;
- alternar contraste do Foto e verificar `aria-pressed`;
- concluir/copiar resultados e confirmar emojis preservados somente no conteúdo
  compartilhado.

Próximo passo:
- aprovar a Fase A em navegador real; somente depois iniciar a Fase B — Home.


## 22/08/2026 — v3.0 Fase A.1: polimento após validação visual

**Status: VALIDAÇÃO VISUAL NÃO APROVADA / SUPERADA PELA FASE A.2**

Implementado:
- o botão Voltar deixou de usar cápsula/círculo decorativo e passou a integrar a barra
  superior como controle retangular discreto, preservando `← VOLTAR` no desktop, `←` no
  mobile, alvo mínimo de 44×44 e nome acessível;
- a barra superior dos modos ganhou hierarquia mais clara: título principal de 15 px,
  informação de rodada/timer secundária de 12 px e dourado removido do timer concorrente;
- a busca do Clássico foi compactada para 44 px, sem alterar input, autocomplete ou
  comportamento;
- o cabeçalho desktop do Clássico passou a formar uma linha única com divisores externos,
  removendo os oito sublinhados/mini-pills independentes; as labels mobile foram mantidas;
- os quatro SVGs decorativos dos cards da Home foram removidos após validação visual;
- subtítulos da Home foram simplificados e deixaram de usar pill/borda, preservando a
  hierarquia título, descrição e status;
- os SVGs de streak e contraste foram preservados por terem função/identidade próprias.

Proteção permanente:
- o contrato estrutural agora verifica o formato discreto do Voltar, os quatro subtítulos
  sem ícones, a busca compacta e o cabeçalho unificado do Clássico;
- nenhuma mecânica, seed, save, histórico, JSON ou ordem/layout estrutural da Home mudou.

Testado:
- suíte permanente completa, storage, histórico, sintaxe dos scripts, contrato de
  frontend, IDs únicos, JSONs e `git diff --check`;
- inspeção estática das regras desktop/mobile e preservação das labels responsivas;
- validação visual real desta iteração permanece pendente.

Checklist manual:
- desktop 1366×768, 1440×900 e 1920×1080: hierarquia da barra, Voltar, busca e linha de
  cabeçalho do Clássico;
- mobile 360×800, 390×844, 412×915 e 480×900: seta isolada, alvo de toque, labels das
  tentativas, autocomplete e ausência de overflow;
- Home: conferir títulos, novos subtítulos, status dos quatro modos e ausência dos quatro
  SVGs decorativos, preservando streak e contraste;
- teclado: Tab, Shift+Tab, Enter e foco visível nos quatro controles Voltar.

Próximo passo:
- executar a segunda iteração visual dos cabeçalhos antes de qualquer trabalho da Fase B.


## 22/08/2026 — v3.0 Fase A.2: segunda iteração visual dos cabeçalhos

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO MANUAL**

Motivação:
- a validação visual da Fase A.1 não foi aprovada porque o cabeçalho do Foto comprimia
  Voltar, título, dificuldade e tentativas na mesma linha, com aparência de toolbar;
- a busca e o controle de contraste também não davam à fotografia o protagonismo esperado.

Implementado:
- o cabeçalho do Foto passou a separar navegação, identidade do modo e progresso em áreas
  próprias; `MODO FOTO` usa a tipografia de personalidade e a dificuldade fica abaixo;
- o progresso foi simplificado para `X / 6 TENTATIVAS`, preservando o contador para o
  próximo desafio após a conclusão;
- o Voltar ganhou fundo e borda muito sutis, raio moderado e dourado apenas em hover/foco,
  sem retornar à cápsula anterior e mantendo alvo 44×44;
- a base dos cabeçalhos ganhou superfície escura discreta e títulos mais reconhecíveis,
  aplicando aos quatro modos os mesmos princípios sem igualar seus conteúdos;
- a busca do Foto passou a ter 44 px, largura alinhada à imagem, borda neutra e dourado
  somente no foco; autocomplete e comportamento foram preservados;
- o espaço entre cabeçalho, busca e fotografia foi reorganizado sem alterar a dimensão da
  imagem ou criar divisor dourado decorativo;
- o controle de contraste passou de círculo fraco para controle quadrado arredondado de
  alto contraste, com ícone maior, hover/foco/estado ativo e `aria-label` mais explícito.

Proteção permanente:
- o contrato estrutural valida agrupamento do cabeçalho, ordem semântica, progresso,
  busca de 44 px, controle de contraste e nome acessível;
- tentativas, dificuldade, blur, autocomplete, resultado, seeds, saves e JSONs permanecem
  inalterados.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs,
  CSS balanceado, JSONs e `git diff --check`;
- validação visual real desta segunda iteração permanece pendente.

Checklist manual:
- Foto inicial e após tentativas: conferir hierarquia entre Voltar, `MODO FOTO`, badge e
  progresso, além da troca para o contador diário ao concluir;
- desktop 1366×768, 1440×900 e 1920×1080: busca alinhada à foto, fotografia protagonista
  e controle de contraste claramente acionável;
- mobile 360×800, 390×844, 412×915 e 480×900: cabeçalho sem compressão, seta isolada,
  título/badge legíveis, progresso sem quebra estranha e ausência de overflow;
- teclado: Voltar, busca, autocomplete e contraste com Tab, Enter, Escape e foco visível;
- abrir Clássico, Mais ou Menos e Onze Inicial para confirmar a hierarquia compartilhada
  sem regressão de conteúdo ou navegação.

Próximo passo:
- validar a Fase A.2 em navegador real; não iniciar a Fase B antes da aprovação.


## 22/08/2026 — v3.0 Fase A.3: centralização e cabeçalho do Clássico

**Status: CONCLUÍDA — VALIDAÇÃO VISUAL FINAL APROVADA**

Implementado:
- os cabeçalhos dos quatro modos passaram a usar três colunas, com laterais simétricas no
  desktop, garantindo que o nome do modo fique geometricamente centralizado sem depender
  das larguras do Voltar ou da informação contextual;
- em até 480 px, a grade prioriza 44 px para a seta, espaço fluido para o título e largura
  natural para o progresso, evitando forçar a centralização quando ela causaria colisão;
- o cabeçalho das oito colunas do Clássico perdeu a borda superior e qualquer superfície
  própria, ficando transparente e integrado ao fundo com apenas uma linha inferior neutra;
- labels ganharam contraste secundário mais claro, peso, espaçamento entre letras e
  alinhamento vertical mais legíveis, sem dourado permanente;
- `ASSISTÊNCIAS` foi abreviado visualmente para `ASSIST.` somente no cabeçalho desktop;
  a label completa dentro das tentativas mobile permanece preservada;
- a busca do Clássico aprovada na A.2 e as células coloridas das tentativas não foram
  alteradas.

Proteção permanente:
- o teste estrutural confirma a grade simétrica desktop, alinhamento esquerda/centro/
  direita, adaptação mobile, transparência do cabeçalho e abreviação exclusivamente visual;
- IDs, listeners, autocomplete, navegação, mecânicas, seeds, saves e JSONs permanecem
  preservados.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, 151 IDs,
  CSS balanceado, JSONs e `git diff --check`;
- validação visual real nos viewports solicitados permanece pendente.

Checklist manual:
- desktop 1366×768, 1440×900 e 1920×1080: confirmar centro geométrico dos títulos nos
  quatro modos, independentemente do conteúdo à esquerda e à direita;
- Clássico desktop: verificar cabeçalho integrado ao fundo, linha neutra, labels legíveis,
  alinhamento das oito colunas e busca visualmente idêntica à A.2;
- mobile 360×800, 390×844, 412×915 e 480×900: conferir ausência de colisões/overflow,
  seta de 44 px e labels completas dentro das tentativas, sem duplicação;
- navegar com teclado pelos quatro Voltar e pelo autocomplete do Clássico.

Próximo passo:
- validar a Fase A.3 em navegador real; manter a Fase B bloqueada até a aprovação.


## 22/08/2026 — v3.0 Fase A.4: remoção definitiva da superfície do cabeçalho do Clássico

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL MANUAL**

Causa confirmada:
- a faixa não era produzida pelo `.board-header`, já transparente desde a A.3;
- o ancestral compartilhado `.game-sticky-top` aplicava `background-color: var(--bg)` em
  toda a largura, cobrindo a textura sutil do canvas principal com um retângulo preto sólido;
- não havia pseudo-elemento, sombra ou segunda borda responsável pelo efeito.

Implementado:
- `#gameView .game-sticky-top` neutraliza somente no Clássico o fundo sólido herdado da
  base compartilhada, permitindo que o fundo principal apareça diretamente atrás das labels;
- o `.board-header` continua sem superfície própria e mantém apenas a linha inferior neutra
  de 1 px, o alinhamento das oito colunas e a tipografia aprovada na A.3;
- busca, autocomplete, tentativas desktop/mobile e os outros três modos não foram alterados.

Proteção permanente:
- o contrato estrutural verifica tanto a regra compartilhada que originou o problema quanto
  o override específico transparente, evitando que a faixa ancestral reapareça;
- IDs, listeners, grid desktop, labels mobile, mecânicas, seeds, saves e JSONs permanecem
  preservados.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs, CSS,
  JSONs e `git diff --check`;
- validação visual real permanece pendente.

Checklist manual:
- desktop 1366×768, 1440×900 e 1920×1080: confirmar que não existe retângulo perceptível
  atrás das labels e que a única separação é a linha inferior neutra;
- conferir busca inalterada, alinhamento das oito colunas e espaçamento antes das tentativas;
- rolar uma partida com várias tentativas e verificar a leitura do cabeçalho sticky;
- mobile 360×800, 390×844, 412×915 e 480×900: confirmar cabeçalho desktop oculto, labels
  internas preservadas, ausência de duplicação e overflow.

Próximo passo:
- validar a Fase A.4 em navegador real; não iniciar a Fase B antes da aprovação.


## 22/08/2026 — v3.0 Fase A.4.1: proporção tipográfica das labels do Clássico

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL MANUAL**

Implementado:
- labels do cabeçalho desktop passaram de 10 px para 11 px e de peso 650 para 700;
- letter-spacing foi neutralizado, line-height ajustado para 1.15 e padding horizontal
  reduzido para 1 px, melhorando a distribuição sem aumentar significativamente a linha;
- `min-width: 0` e `white-space: nowrap` protegem alinhamento e evitam quebra, especialmente
  em `NACIONALIDADE`, `TÍTULOS` e `ASSIST.`;
- a grade de oito colunas permanece exatamente a mesma das tentativas e o alinhamento
  central foi preservado;
- fundo transparente, divisor neutro, busca, autocomplete, células e mobile não mudaram.

Proteção permanente:
- teste estrutural fixa tamanho, peso, spacing, ausência de quebra, centralização e a grade
  compartilhada original, sem permitir recriação da superfície removida na A.4.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs, CSS,
  JSONs e `git diff --check`;
- validação visual real em desktop permanece pendente.

Checklist manual:
- 1366×768, 1440×900 e 1920×1080: conferir legibilidade, proporção e alinhamento de todas
  as labels, com atenção a `NACIONALIDADE`, `TÍTULOS` e `ASSIST.`;
- confirmar ausência de quebra, overflow, sobreposição ou retorno da faixa preta;
- confirmar busca, divisor, tentativas e comportamento mobile visualmente inalterados.

Próximo passo:
- executar a validação manual final da Fase A; manter a Fase B bloqueada até aprovação.


## 22/08/2026 — v3.0 Fase A.5: remoção das superfícies dos cabeçalhos dos modos

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL MANUAL**

Causa confirmada:
- `.daily-status-bar` criava o card externo com gradiente escuro, borda completa, raio de
  10 px e padding lateral;
- o ancestral `.game-sticky-top` ainda aplicava `background-color: var(--bg)` nos modos,
  formando uma segunda superfície preta sólida sobre o canvas texturizado da página;
- não havia `box-shadow` ou pseudo-elemento adicional nos cabeçalhos superiores;
- o override anterior do Clássico neutralizava apenas o ancestral naquele modo e não
  removia o card desenhado por `.daily-status-bar`.

Implementado:
- `.daily-status-bar` agora é transparente, sem borda externa e sem raio; preserva somente
  um divisor inferior neutro de 1 px e espaçamento vertical;
- `.game-sticky-top` passou a ser transparente na base compartilhada dos quatro modos;
- o override exclusivo do Clássico tornou-se redundante e foi removido;
- botão Voltar, título central, timer/progresso/rodada, badge do Foto e adaptação mobile
  permanecem com a hierarquia das fases A.2/A.3;
- buscas, autocompletes e o conteúdo interno dos quatro modos não foram alterados.

Comportamento responsivo:
- desktop preserva três colunas com laterais simétricas e título geometricamente central;
- até 480 px, a grade continua priorizando 44 px para a seta, centro fluido e informação
  contextual à direita, sem recriar um container visual;
- não foram adicionados breakpoints, backgrounds, gradientes, sombras ou dourado decorativo.

Proteção permanente:
- teste estrutural confirma transparência das duas camadas ancestrais, ausência de gradiente,
  sombra e raio, além do único divisor neutro permitido;
- IDs, listeners, navegação, mecânicas, seeds, saves, histórico e JSONs permanecem intactos.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs, CSS,
  JSONs e `git diff --check`;
- validação visual real nos viewports solicitados permanece pendente.

Checklist manual:
- desktop 1366×768, 1440×900 e 1920×1080: conferir os quatro cabeçalhos integrados ao
  fundo, títulos centralizados e ausência de qualquer retângulo externo;
- mobile 360×800, 390×844, 412×915, 430×932 e 480×900: verificar duas linhas quando
  necessário, touch target, ausência de colisão e overflow;
- Foto: preservar badge, progresso, busca e contraste; Clássico: busca e oito labels;
- Mais ou Menos e Onze Inicial: confirmar que somente a superfície superior desapareceu;
- testar Voltar, foco, teclado e rolagem em todos os modos.

Próximo passo:
- validar visualmente a Fase A.5; não iniciar a Fase B antes da aprovação final da Fase A.


## 22/08/2026 — v3.0 Fase A.6: proporções desktop do Clássico

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL MANUAL**

Implementado:
- a grade desktop compartilhada pelo cabeçalho e por todas as tentativas passou de
  `1.3 / 1 / 1 / 0.7 / 1.15 / 1.6 / 0.7 / 0.75` para
  `1.3 / 1.05 / 1.25 / 0.85 / 1 / 1.6 / 0.7 / 0.8`;
- o gap horizontal passou de 6 px para 7 px, criando separação mais clara sem produzir
  grandes vazios ou scroll horizontal;
- Nacionalidade recebeu aproximadamente 25% mais peso e Estreia aproximadamente 21% mais,
  resolvendo a proximidade observada; Jogador e Títulos continuam as maiores colunas;
- Posição e Pé mantêm largura intermediária, enquanto Gols e Assist. permanecem compactas;
- a largura máxima útil continua obedecendo ao shell global de 760 px: em desktop com
  gutters de 16 px, o Clássico usa aproximadamente 728 px internos;
- nenhum breakpoint foi adicionado e a grade mobile de duas colunas permanece intacta.

Proteção permanente:
- o contrato estrutural exige a mesma definição de colunas e gap no cabeçalho/tentativas,
  além de confirmar a regra mobile original em até 480 px;
- cores, setas, conteúdo, altura, bordas, fallback, busca e autocomplete não mudaram.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs, CSS,
  JSONs e `git diff --check`;
- validação visual real em desktop e confirmação rápida em 412×915 permanecem pendentes.

Checklist manual:
- 1366×768, 1440×900 e 1920×1080: conferir separação Nacionalidade/Estreia, alinhamento
  cabeçalho/células, espaço de Títulos, Gols/Assist. e ausência de overflow;
- testar nomes longos como Marcelo Mattos e Carlos Alberto, confirmando quebra natural;
- 412×915: confirmar grade mobile de duas colunas, Jogador/Títulos em largura completa e
  labels internas sem qualquer alteração.

Próximo passo:
- validar visualmente a Fase A.6; não iniciar a Fase B antes da aprovação final da Fase A.


## 22/08/2026 — v3.0 Fase A.7: superfície funcional dos cabeçalhos sticky no mobile

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL MANUAL**

Problema confirmado:
- `.game-sticky-top` é a região sticky compartilhada dos quatro modos, com `top: 0` e
  `z-index: 20`; no Clássico e Foto ela também envolve busca/autocomplete;
- após a transparência desktop da A.5, cards e tentativas rolavam visivelmente por trás da
  região no mobile, prejudicando contraste e leitura.

Implementado:
- somente em até 480 px, `.game-sticky-top` recebe `rgba(11, 11, 10, 0.97)`, fundo quase
  sólido coerente com o canvas, sem radius, sombra, blur ou aparência de card;
- uma borda inferior neutra de 1 px separa discretamente a região sticky do conteúdo;
- a superfície cobre conjuntamente cabeçalho e busca no Clássico/Foto, evitando lacuna
  transparente, e somente o cabeçalho no Mais ou Menos/Onze Inicial;
- desktop permanece completamente transparente conforme aprovado na A.5.

Stacking auditado:
- sticky permanece em `z-index: 20`, suficiente para ficar acima do conteúdo dos modos;
- autocomplete continua em 99 dentro da região; infraestrutura de modal permanece em 100;
- nenhum z-index novo ou arbitrariamente alto foi criado.

Proteção permanente:
- teste estrutural diferencia fundo desktop transparente e superfície mobile em até 480 px,
  fixa o divisor neutro e protege os níveis sticky/autocomplete;
- títulos, Voltar, grids, buscas, mecânicas, dados, seeds e saves não foram alterados.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs, CSS,
  JSONs e `git diff --check`;
- validação visual real durante scroll permanece pendente.

Checklist manual:
- 360×800, 390×844, 412×915, 430×932, 480×900 e especialmente 412×600: rolar conteúdo
  suficiente nos quatro modos e confirmar que nada fica legível através do sticky;
- Clássico com 1 e várias tentativas; Foto com várias tentativas; MM em rodada intermediária
  e resultado; Onze Inicial com placar, campo e feedback;
- conferir ausência de lacuna entre cabeçalho e busca, autocomplete acima do conteúdo,
  modais/overlays sem bloqueio e nenhum overflow;
- desktop: confirmar rapidamente que os quatro cabeçalhos continuam transparentes.

Próximo passo:
- validar visualmente a Fase A.7; não iniciar a Fase B antes da aprovação final da Fase A.


## 22/08/2026 — v3.0 Fase A.8: polimento final do sticky mobile

**Status: IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL FINAL DA FASE A**

Implementado:
- no mobile, o gap compartilhado do sticky passou de 8 px para 5 px e o padding inferior
  de 10 px para 6 px; o Foto, que sobrescrevia o gap para 12 px, também passou a 5 px;
- a barra interna passou de `6px 0 8px` para `2px 0 5px` e perdeu seu divisor próprio no
  mobile, deixando somente a separação final da região sticky;
- a composição recupera aproximadamente 14 px verticais no Clássico/Foto sem reduzir o
  Voltar ou a busca abaixo de 44 px;
- o Voltar mobile mantém 44×44, mas usa fundo de 2% e borda de 10% de branco, com dourado
  apenas durante foco/active;
- no contador mobile do Clássico, `Próximo em` passou a 10 px/peso 500 e cor secundária,
  enquanto o horário permanece em 12 px/peso 800; Foto e MM não tiveram o progresso alterado;
- fundo opaco, arquitetura sticky e níveis de z-index da A.7 foram preservados integralmente.

Relação cabeçalho/busca:
- Clássico e Foto usam gap único de 5 px e background contínuo, sem linha intermediária;
- autocomplete continua ligado ao campo e acima do conteúdo; a foto sobe discretamente
  pela redução de espaço, sem mudar dimensão, blur, contraste, dots ou tentativas;
- MM e Onze Inicial recebem apenas compactação coerente do cabeçalho, sem estrutura extra.

Proteção permanente:
- teste estrutural fixa gaps, paddings, único divisor, alvo 44 px, superfície sutil do
  Voltar e hierarquia tipográfica do contador;
- desktop, grids, células, buscas, mecânicas, dados, saves e seeds permanecem intactos.

Testado:
- suíte permanente, storage, histórico, sintaxe dos scripts, frontend contract, IDs, CSS,
  JSONs e `git diff --check`;
- validação visual final da Fase A permanece pendente.

Checklist manual:
- 412×600: conferir ganho de área útil, continuidade entre cabeçalho/busca, conteúdo oculto
  sob o sticky e ausência de compressão do título/progresso;
- 360×800, 390×844, 412×915, 430×932 e 480×900: testar os quatro modos, Voltar 44×44,
  contador, badge, rodada, autocomplete e ausência de overflow;
- Foto: confirmar que a imagem subiu discretamente; MM/Onze: confirmar ausência de espaço
  ou estrutura indevida; desktop: confirmar ausência total de regressão.

Próximo passo:
- executar a validação visual final da Fase A; não iniciar a Fase B antes da aprovação.


## 22/08/2026 — Encerramento da v3.0 Fase A

**Status: CONCLUÍDA — FASE B É A PRÓXIMA ETAPA**

Concluído:
- linguagem visual compartilhada e redução de emojis coloridos na interface permanente;
- símbolos tipográficos e SVGs monocromáticos `currentColor` onde agregam função;
- botão Voltar acessível, cabeçalhos dos quatro modos e centralização dos títulos;
- buscas do Clássico e Foto preservadas/compactadas, sem regressão nos autocompletes;
- cabeçalho desktop e proporções das oito colunas do Clássico;
- superfície funcional do sticky mobile e compactação da região em viewport baixo;
- contraste, foco visível, nomes acessíveis e touch targets mínimos preservados.

Validação:
- a validação visual da A.8 foi considerada suficiente para permitir o avanço da v3.0;
- a suíte permanente e os contratos estruturais das entregas A.1–A.8 permaneceram verdes;
- a conclusão da Fase A não inicia nem implementa qualquer item da Home/Fase B.

Pendências visuais não bloqueantes para a Fase F:
- o sticky mobile ainda pode receber pequeno refinamento estético;
- a sensação visual do cabeçalho em viewport baixo pode ser revisitada;
- microespaçamentos e contraste fino ainda podem ser ajustados;
- nenhuma dessas pendências afeta uso, mecânica ou acessibilidade e não será aberta como A.9.

Próximo passo:
- iniciar a Fase B — Home em tarefa própria, preservando a Fase C de resultados finais e
  continuidade do dia como etapa planejada posterior.


## 22/08/2026 — v3.0 Fase B: nova hierarquia da Home

**Status: CONCLUÍDA — VALIDAÇÃO VISUAL FINAL APROVADA**

Estrutura anterior:
- timer e jogador anterior, progresso diário com streak interno, Estatísticas/Histórico e
  somente depois os quatro modos;
- todos os blocos principais limitados a 400 px e os modos sempre em uma coluna;
- progresso, jornada histórica e ações secundárias competiam no mesmo fluxo.

Implementado:
- a leitura passa a seguir `Timãodle do dia → quatro modos → contexto diário → Seu Timãodle`;
- o painel diário usa uma superfície aberta com divisores e mantém 0/4–4/4, mensagens,
  resumo de conclusão, celebração e Compartilhar Dia;
- os modos preservam a ordem Clássico, Foto, Mais ou Menos e Onze Inicial, com título,
  subtítulo, status, detalhe e chamada `Entrar no modo`;
- a Home passou de 400 px para largura útil máxima de 920 px; os modos formam grade 2×2
  no desktop e uma coluna até 640 px;
- streak atual e recorde foram movidos para `Seu Timãodle`, junto de Estatísticas e
  Histórico, em uma composição compacta sem subcards;
- timer e jogador anterior aparecem somente depois dos modos, com cor e superfície
  secundárias;
- dourado foi reservado ao progresso, conclusão e interação; o widget e o footer não
  precisaram de alterações para esta etapa;
- IDs, listeners, ordem de Tab, modais, compartilhamento, saves, seeds, mecânicas, sticky
  mobile e JSONs foram preservados.

Proteção permanente:
- o contrato da Home exige os quatro cards, sua ordem, progresso diário, área pessoal,
  streak, Estatísticas, Histórico e compartilhamento;
- o contrato responsivo protege a grade 2×2 e a mudança para uma coluna até 640 px sem
  transformar o layout inteiro em snapshot rígido;
- o checklist visual cobre estados 0/4, parcial, 4/4, streak zero/positivo e ações.

Testado:
- `node tests/run-tests.js` — suíte completa aprovada, incluindo 153 IDs únicos, CSS
  balanceado e contrato estrutural;
- `node tests/storage.test.js` — cenários A–X aprovados;
- `node tests/history-calendar.test.js` — 118 cenários aprovados;
- `node --check script.js` e `node --check storage-normalizers.js` — sintaxe aprovada;
- `git diff --check` — aprovado, somente avisos de normalização LF/CRLF;
- JSONs permaneceram fora do diff;
- `node tests/viewport-smoke.js` foi iniciado, mas o teste foi ignorado porque o navegador
  headless não conseguiu iniciar o processo GPU no ambiente atual.

Checklist manual pendente:
- estados 0/4, 1/4–3/4 e 4/4; streak zero e positivo; Compartilhar Dia disponível;
- 360×800, 390×844, 412×915, 430×932, 480×900, 768×1024, 1366×768,
  1440×900, 1920×1080 e 412×600;
- conferir modos no início do fluxo, grade 2×2/uma coluna, ausência de overflow, foco e
  Tab, modais de Estatísticas/Histórico, footer e widget de links úteis.

Pendências:
- validação visual e interativa em navegador real nos estados e viewports listados;
- Fase C não iniciada.

Próximo passo:
- validar manualmente a Fase B em navegador real; após aprovação, abrir a Fase C em tarefa
  separada, sem revisitar o sticky mobile nesta etapa.


## 22/08/2026 — v3.0 Fase B: ajuste final do estado 4/4

**Status: CONCLUÍDA — VALIDAÇÃO VISUAL FINAL APROVADA**

Implementado:
- a seção `Jogue Hoje` recebeu uma referência própria e agora é ocultada somente quando
  `obterProgressoDiario().complete` retorna `true` na renderização normal da Home;
- em 0/4–3/4, os quatro cards permanecem visíveis e funcionais, inclusive os já concluídos;
- em 4/4, a grade inteira desaparece sem deixar espaço residual, enquanto resumo,
  Compartilhar Dia, contexto diário e `Seu Timãodle` permanecem no fluxo aprovado;
- a cada renderização, inclusive após F5, retorno de um modo ou mudança de dia, a mesma
  fonte de verdade atualiza a visibilidade; um novo dia incompleto restaura a seção;
- cards concluídos preservam fundo e status distintos, mas voltam a usar borda neutra;
  somente `✓ CONCLUÍDO` permanece dourado;
- desktop preserva largura, alinhamentos e grade 2×2 nos estados parciais; mobile preserva
  a coluna única e ganha uma Home consideravelmente mais curta em 4/4;
- compartilhamento, Estatísticas, Histórico, navegação, celebração, sticky, footer, widget,
  mecânicas, storage, saves, seeds e JSONs não foram alterados.

Proteção permanente:
- o contrato inclui o ID da seção `homeModes` e verifica que sua visibilidade acompanha
  diretamente `progresso.complete`;
- resumo, ação de compartilhar e disponibilidade do botão continuam protegidos pela
  condição complementar existente;
- o contrato CSS exige borda neutra no card concluído e status concluído dourado;
- o checklist visual cobre 4/4 sem espaço residual e restauração no novo dia.

Testado:
- `node tests/run-tests.js` — suíte completa aprovada, com 39 cenários estruturais e
  154 IDs verificados;
- `node tests/storage.test.js` — cenários A–X aprovados;
- `node tests/history-calendar.test.js` — 118 cenários aprovados;
- `node --check script.js` e `node --check storage-normalizers.js` — aprovados;
- `git diff --check` — aprovado, somente avisos de normalização LF/CRLF;
- JSONs, seeds e arquivos de storage permaneceram fora das alterações deste ajuste.

Validação visual final aprovada:
- a estrutura geral da Home foi aprovada em desktop e mobile;
- 0/4 e 1/4–3/4 preservam `Jogue Hoje` e os quatro cards;
- 4/4 preserva resumo, Compartilhar Dia, contexto e `Seu Timãodle`, sem a grade redundante
  nem espaço residual;
- a restauração no novo dia, a redução do dourado, o footer e o widget foram aprovados;
- a Fase B está oficialmente concluída.

Pendências:
- nenhuma pendência da Fase B;
- Fase C não iniciada.

Próximo passo:
- iniciar a Fase C somente em tarefa própria, partindo do checkpoint de encerramento da
  Fase B.


## 22/08/2026 — v3.0 Fase C: auditoria e especificação dos resultados finais

**Status: ESPECIFICAÇÃO APROVADA — IMPLEMENTAÇÃO REGISTRADA NA ETAPA SEGUINTE**

### Comportamento atual auditado

Clássico:
- conclui somente ao acertar o jogador; possui vitória, mas não derrota nem limite de
  tentativas;
- depois do flip final, salva `status: won`, sincroniza o histórico/progresso, atualiza a
  estatística legada e, 400 ms depois, exibe mensagem integrada com a resposta e confete;
- mostra quantidade de tentativas apenas no texto compartilhado, não como métrica visual;
- possui Compartilhar próprio (`compartilharResultado`) com Web Share, clipboard e `alert`
  como último recurso;
- tabuleiro e tentativas permanecem visíveis; busca fica inativa; timer do cabeçalho continua;
- não há modal/overlay; o retorno à Home usa o Voltar do cabeçalho;
- ao reabrir ou recarregar, restaura tentativas e reapresenta mensagem/botão sem confete.

Foto:
- conclui ao acertar (`won`) ou consumir a sexta tentativa (`lost`);
- salva o estado e sincroniza histórico antes de revelar a foto e a mensagem integrada com
  a resposta; confete ocorre somente na vitória imediata;
- cabeçalho mostra tentativas durante o jogo e passa a mostrar `Próximo em` após conclusão;
- foto, dots e lista de tentativas permanecem visíveis; busca fica desabilitada;
- não possui botão, função nem formato de compartilhamento individual atualmente;
- não há modal/overlay; o retorno à Home usa o Voltar do cabeçalho;
- ao reabrir ou recarregar, restaura vitória/derrota, foto revelada, tentativas e mensagem,
  sem confete.

Mais ou Menos:
- conclui obrigatoriamente após 10 rodadas; vence com pelo menos 7 acertos e perde abaixo
  dessa meta;
- na rodada 10, revela comparação e feedback temporário, salva `won`/`lost` e sincroniza o
  histórico imediatamente; após `ATRASO_AVANCO_MM` (1,5 s), substitui o jogo pelo resultado;
- resultado atual é um card integrado com vitória/derrota, `X/10`, meta atingida/faltante e
  aviso de novo desafio à meia-noite; o card da rodada é ocultado;
- não possui botão, função nem formato de compartilhamento individual atualmente;
- não há countdown numérico nem modal; o retorno à Home usa o Voltar do cabeçalho;
- ao sair, o timer transitório é cancelado; ao reabrir ou recarregar concluído, o card final
  aparece imediatamente, sem repetir feedback de 1,5 s ou confete.

Onze Inicial:
- conclui quando os 3 jogadores ocultos são descobertos; não possui derrota global;
- salva `etapa: concluido`, `concluido: true`, nomes e erros antes de renderizar o card final
  e disparar confete;
- resultado integrado mostra placar real, palpite e seu status, `3/3`, erros, nomes errados,
  countdown para o próximo desafio e Compartilhar;
- possui Compartilhar próprio (`compartilharResultadoEscalacao`) com Web Share, clipboard e
  fallback via `execCommand`;
- partida, resultado do placar, campo completo e dica permanecem visíveis; busca desabilitada;
- não há modal/overlay; o retorno à Home usa o Voltar do cabeçalho;
- ao reabrir ou recarregar, restaura todo o estado e o card final, sem confete.

### Inconsistências confirmadas

- os quatro finais usam estruturas, títulos, métricas e densidades diferentes;
- somente Clássico e Onze Inicial oferecem compartilhamento individual;
- somente Onze Inicial inclui countdown no resultado; Clássico mantém timer no cabeçalho,
  Foto converte o contador de tentativas, e Mais ou Menos usa apenas texto estático;
- nenhum final oferece continuidade direta para modos pendentes ou Voltar à Home dentro do
  próprio resultado;
- Clássico e Foto acrescentam mensagem ao conteúdo; Mais ou Menos substitui seu card; Onze
  Inicial acrescenta um resumo muito mais detalhado;
- as respostas secretas do modo concluído são reveladas corretamente, mas a camada comum
  futura não deve replicá-las nem consultar conteúdo de outros desafios.

### Arquitetura recomendada

Escolha: **overlay modal sobre a tela do modo**, compartilhado pelos quatro resultados.

- modal central clássico: claro e acessível, mas isolado demais e propenso a aparência
  genérica se tratado como infraestrutura utilitária comum;
- overlay sobre o modo: mantém o contexto reconhecível atrás, dá hierarquia forte e permite
  uma composição responsiva única com risco técnico moderado;
- resultado integrado: menor risco inicial, porém mantém inconsistências, exige rolagem até
  o final em alguns modos e não resolve foco/continuidade de forma uniforme.

O overlay recomendado deve reutilizar `abrirModalAcessivel`, `fecharModalAcessivel`,
`prenderFocoNoModal` e o bloqueio `modal-open`, ampliando a lista de modais reconhecidos em
vez de criar uma segunda infraestrutura. A camada é somente apresentação: recebe o modo
concluído e deriva todo o restante dos saves/histórico existentes.

Estrutura visual proposta:
- kicker com o nome do modo;
- resultado dominante: `GANHOU`, `PERDEU` ou `CONCLUÍDO`;
- uma métrica principal;
- no máximo uma informação secundária segura;
- Compartilhar quando houver ação individual definida;
- `AINDA FALTA CONCLUIR` com ações compactas de modos pendentes;
- `VOLTAR À HOME` como ação persistente;
- botão Fechar monocromático; preto/superfície escura, branco para conteúdo, dourado para
  conquista/ação/4/4 e verde/vermelho apenas como acento de resultado.

### Contrato de resultado por modo

- Clássico: `GANHOU`; métrica `X tentativa(s)`; nenhuma derrota inventada.
- Foto: `GANHOU` ou `PERDEU`; métrica `X / 6` com label `TENTATIVAS`.
- Mais ou Menos: `GANHOU` ou `PERDEU`; métrica `X / 10 ACERTOS`; meta de 7 apenas como
  informação secundária quando útil.
- Onze Inicial: `CONCLUÍDO`; métrica `3 / 3 JOGADORES`; `X erro(s)` secundário; `PLACAR
  EXATO` somente quando verdadeiro. O overlay não deve listar nomes errados nem repetir o
  placar completo como métrica dominante.

### Continuidade e estado 4/4

- fonte única: `obterProgressoDiario()` após o save final já ter chamado
  `sincronizarProgressoDiario()`;
- excluir o modo recém-concluído e qualquer modo já concluído;
- incluir somente modos `started: false` (`NÃO INICIADO`) ou iniciados e incompletos
  (`EM ANDAMENTO`), mostrando apenas nome e estado, sem spoilers;
- ações devem acionar os mesmos botões/listeners atuais (`btnPlayDiario`, `btnPlayFoto`,
  `btnPlayMaisMenos`, `btnPlayEscalacao`) depois de fechar o overlay e ocultar a view de
  origem; não duplicar inicialização de modo;
- em 4/4, substituir toda a continuidade por `TIMÃODLE DO DIA COMPLETO` e `4 / 4`, mantendo
  Compartilhar individual disponível quando existir e Voltar à Home;
- a Home continua sendo atualizada por `renderizarProgressoHome()` e preserva a regra da
  Fase B que oculta `Jogue Hoje` em 4/4.

### Compartilhamento

- reutilizar sem alteração `compartilharResultado` no Clássico e
  `compartilharResultadoEscalacao` no Onze Inicial;
- Foto e Mais ou Menos não possuem compartilhamento individual para reutilizar. Antes da
  implementação, decidir explicitamente se a Fase C autoriza criar formatos próprios e
  seus testes; até essa decisão, o overlay desses modos não deve exibir uma ação falsa ou
  reutilizar o compartilhamento diário 4/4 como substituto;
- não alterar os textos existentes de Clássico, Onze Inicial ou Compartilhar Dia.

### Fechamento, F5 e persistência

- adotar Fechar e Escape. O overlay não é obrigatório: fechar devolve ao resultado estático
  já existente do modo, preservando contexto e acesso ao Voltar do cabeçalho;
- clique no backdrop pode fechar se mantiver o padrão dos modais atuais; não deve concluir,
  desfazer ou alterar qualquer estado;
- foco inicial recomendado: título/contêiner do resultado (`tabindex="-1"`), para anunciar
  o resultado antes das ações; alternativa aceitável é Compartilhar somente após o título
  estar associado corretamente;
- ao fechar, devolver foco ao elemento seguro definido pela abertura; se o disparador era
  um campo agora desabilitado, usar o Voltar do modo como fallback;
- estratégia recomendada para reabertura: **B — mostrar automaticamente somente na
  conclusão imediata**. Ao entrar novamente em modo concluído ou após F5, manter o resultado
  estático atual sem reabrir o overlay; isso evita interrupção repetitiva e não exige salvar
  um novo flag de apresentação;
- o overlay nunca é persistido nem autoridade do resultado. Save e histórico precisam estar
  concluídos antes de sua abertura, como já ocorre nos quatro fluxos atuais;
- F5 durante o overlay equivale a reabrir o modo concluído: restaura o resultado estático,
  não o overlay.

### Ordem de interações específicas

- Clássico: terminar flip → salvar vitória/sincronizar → atualizar estatística → renderizar
  resultado estático → abrir overlay/confete uma única vez na conclusão imediata;
- Foto: salvar tentativa → salvar `won`/`lost` e sincronizar → revelar foto/renderizar
  mensagem → abrir overlay; confete somente na vitória, preservando a regra atual;
- Mais ou Menos: salvar rodada 10 e sincronizar → manter feedback visual de 1,5 s →
  renderizar resultado estático → abrir overlay. Nunca sobrepor o novo resultado ao feedback
  temporário nem criar segundo timer; duplo clique continua bloqueado por
  `transicaoMMAtiva` e botões desabilitados;
- Onze Inicial: salvar conclusão/sincronizar → completar campo e card estático → abrir
  overlay/confete. O countdown permanece no resultado estático por compatibilidade, mas não
  deve ocupar a métrica dominante do overlay; pode ser omitido da nova camada.

### Acessibilidade e responsividade especificadas

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apontando para título único e
  descrição/métrica associada quando útil;
- foco inicial anunciado, focus trap, Escape, botão Fechar de 44×44, retorno de foco seguro,
  ordem de Tab: Fechar → Compartilhar → modos pendentes → Voltar à Home;
- não usar `aria-live` no overlay inteiro em conjunto com movimento de foco; manter live
  regions atuais somente para feedback transitório e evitar anúncio duplicado;
- desktop: largura intermediária aproximada de 560–680 px, sem tela cheia, backdrop que
  preserve a leitura do modo e até três ações pendentes em grade compacta;
- mobile: uma coluna, gutters mínimos de 16 px, ações com pelo menos 44 px e resultado/
  Compartilhar no primeiro bloco visual;
- em 412×600, limitar altura ao viewport dinâmico e permitir scroll interno somente no corpo
  de continuidade; cabeçalho do resultado e ações principais devem permanecer acessíveis;
- validar 360×800, 390×844, 412×915, 430×932, 480×900, 412×600, 1366×768,
  1440×900 e 1920×1080 sem overflow horizontal.

### Riscos e decisões pendentes

- alto: abrir o overlay antes do save/histórico produzir continuidade ou 4/4 obsoleto;
- alto: criar compartilhamentos de Foto/MM sem aprovação de formato e alterar contrato de
  texto fora do escopo;
- médio: transição do MM competir com o overlay se o timer de 1,5 s não for respeitado;
- médio: foco retornar a busca desabilitada ou a uma view ocultada ao trocar de modo/Home;
- médio: listeners de navegação atuais esperam partir da Home; a implementação deve fechar
  overlay, normalizar views e então reutilizar os listeners sem duplicar inicialização;
- médio: resultados estáticos e overlay anunciarem conteúdo duas vezes para leitor de tela;
- baixo: countdown do Onze Inicial competir visualmente com a nova métrica;
- baixo: modal longo em 412×600 exigir scroll interno bem delimitado;
- decisão necessária antes da implementação: formato e autorização de compartilhamento para
  Foto e Mais ou Menos.

Arquivos alterados nesta etapa:
- somente `ROADMAP_TIMAODLE.md`;
- HTML, CSS, JavaScript, JSONs, testes, saves, seeds, storage e mecânicas permaneceram
  inalterados.

Próximo passo:
- aprovar esta especificação e decidir o compartilhamento de Foto/MM; somente depois dividir
  a implementação da Fase C em entregas pequenas e testáveis.


## 22/08/2026 — v3.0 Fase C: resultados finais e continuidade do dia

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL FINAL APROVADA**

Arquitetura implementada:
- um único overlay modal acessível atende Clássico, Foto, Mais ou Menos e Onze Inicial;
- o overlay é somente uma camada de UX: saves, histórico, progresso e resultados estáticos
  continuam sendo as fontes de verdade;
- abre somente na conclusão imediata e não é persistido nem reaberto por F5/restauração;
- reutiliza a infraestrutura existente de abertura/fechamento, focus trap, Escape, bloqueio
  de scroll e retorno de foco.

Resultados:
- Clássico: `GANHOU` e `X TENTATIVA(S)`;
- Foto: `GANHOU` ou `PERDEU` e `X / 6 TENTATIVAS`;
- Mais ou Menos: `GANHOU` ou `PERDEU` e `X / 10 ACERTOS`;
- Onze Inicial: `CONCLUÍDO`, `3 / 3 JOGADORES`, erros pluralizados e `PLACAR EXATO`
  somente quando confirmado pelo estado atual;
- resultados estáticos anteriores permanecem intactos sob o overlay.

Continuidade e 4/4:
- `obterProgressoDiario()` filtra o modo atual e todos os modos concluídos;
- ações pendentes mostram somente nome e `NÃO INICIADO`/`EM ANDAMENTO`, sem respostas;
- a navegação fecha o overlay e reutiliza os botões/listeners existentes dos quatro modos;
- `VOLTAR À HOME` atualiza a Home e direciona foco para um alvo válido;
- em 4/4, a lista pendente é substituída por `TIMÃODLE DO DIA COMPLETO` e `4 / 4`, sem
  disparar uma segunda celebração diária.

Compartilhamento:
- Clássico preserva `compartilharResultado()` e seu formato atual;
- Onze Inicial preserva `compartilharResultadoEscalacao()` e seu formato atual;
- Foto ganhou texto compacto com número do desafio, vitória/derrota, `X/6`, grade sem nomes
  e URL oficial;
- Mais ou Menos ganhou texto compacto com número do desafio, vitória/derrota, `X/10`, grade
  apenas de acerto/erro e URL oficial;
- os dois novos formatos usam Web Share e fallback de clipboard/alert compartilhado;
- testes impedem inclusão de jogador secreto, nomes tentados, sequência, jogadores ou
  direções do Mais ou Menos.

Ordem preservada:
- Clássico salva/sincroniza, renderiza o resultado estático e só então abre o overlay;
- Foto salva o resultado final, revela foto/mensagem e só então abre o overlay;
- Mais ou Menos mantém integralmente o feedback de aproximadamente 1,5 s da rodada 10,
  renderiza o card final e depois abre o overlay;
- Onze Inicial salva/sincroniza, completa campo/card estático e depois abre o overlay; o
  countdown permanece somente no resultado estático.

Acessibilidade e responsividade:
- `role="dialog"`, `aria-modal`, título associado, foco inicial no resultado, focus trap,
  Escape, X e backdrop fecham sem alterar estado;
- alvos interativos têm no mínimo 44 px e o retorno de foco usa Voltar, modo da Home ou
  Compartilhar Dia como alvos seguros;
- largura responsiva máxima de 640 px em desktop; mobile usa uma coluna e scroll interno
  limitado por `100dvh`, incluindo o viewport baixo de 412×600;
- não foi aplicado `aria-live` ao overlay inteiro, evitando anúncio duplicado.

Testes adicionados:
- novo `tests/final-result.test.js` cobre continuidade, estados não iniciado/em andamento,
  4/4, formatos Foto/MM, anti-spoiler, abertura imediata e controles compartilhados;
- contrato estrutural cobre IDs únicos, modal único, semântica, foco, 44×44, largura,
  scroll interno e integração dos quatro modos;
- checklist visual cobre overlay, continuidade, 4/4 e restauração após F5.

Regressão executada:
- `node tests/run-tests.js` — aprovado: storage A–X, 39 regras de jogo, 118 cenários de
  histórico, 7 cenários de resultado e 40 cenários estruturais com 167 IDs;
- `node tests/storage.test.js` e `node tests/history-calendar.test.js` — aprovados;
- `node --check script.js` e `node --check storage-normalizers.js` — aprovados;
- `git diff --check` — aprovado, somente avisos LF/CRLF;
- JSONs permaneceram fora do diff; seeds, formatos de save, normalizadores, histórico e
  Home da Fase B não foram alterados;
- `node tests/viewport-smoke.js` foi executado, mas ignorado porque o navegador headless
  não iniciou o processo GPU neste ambiente.

Checklist manual pendente:
- concluir cada modo em vitória/derrota aplicável e validar overlay, Compartilhar, Fechar,
  Escape, backdrop, Home e cada destino pendente;
- validar estados mistos e 4/4, inclusive ausência de spoilers e de celebração duplicada;
- concluir, atualizar por F5 e reabrir para confirmar somente o resultado estático;
- mobile 360×800, 390×844, 412×915, 430×932, 480×900 e 412×600;
- desktop 1366×768, 1440×900 e 1920×1080;
- teclado, foco inicial/retorno, focus trap, scroll interno e ausência de overflow.

Arquivos alterados:
- `index.html`, `style.css`, `script.js`, `ROADMAP_TIMAODLE.md`;
- `tests/final-result.test.js`, `tests/run-tests.js`, `tests/frontend-contract.js`,
  `tests/frontend-structure.test.js` e `tests/visual-checklist.md`.

Pendências:
- nenhuma pendência da Fase C;
- Fase D não iniciada.

Próximo passo:
- validar manualmente a Fase C; somente após aprovação criar checkpoint e planejar a Fase D
  em tarefa separada.


## 22/08/2026 — v3.0 Fase C: proporcionalidade desktop da continuidade

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL FINAL APROVADA**

Validação recebida:
- arquitetura, hierarquia, cores, comportamento, desktop e mobile da implementação inicial
  foram aprovados;
- o único refinamento solicitado foi a proporcionalidade horizontal das ações pendentes em
  desktop e um ganho moderado de largura útil.

Implementado:
- o overlay desktop passou de 640 px para largura máxima externa de 700 px, oferecendo
  aproximadamente 620–640 px úteis sem alterar altura, backdrop ou comportamento;
- a grade desktop usa `repeat(auto-fit, minmax(150px, 1fr))`: duas ações dividem a linha e
  três ações ocupam três colunas equilibradas;
- uma ação isolada é limitada a 280 px para não se esticar de forma desproporcional;
- até 640 px, as ações voltam obrigatoriamente para uma coluna e a ação isolada usa 100%,
  preservando o mobile aprovado e evitando compressão em larguras intermediárias;
- nomes, estados, clique, navegação, foco, overlay, resultados, compartilhamentos, F5,
  saves, histórico, 4/4 e resultados estáticos não mudaram;
- nenhum HTML ou JavaScript foi alterado neste refinamento.

Proteção estrutural:
- o contrato verifica largura máxima de 700 px, grade `auto-fit/minmax` e retorno a uma
  coluna no breakpoint de 640 px, sem snapshot visual rígido.

Validação manual final aprovada:
- estados `GANHOU`, `PERDEU` e `CONCLUÍDO`;
- continuidade com 1, 2 e 3 modos pendentes;
- estado diário 4/4;
- viewport mobile 412×600;
- restauração após F5 sem reabrir o overlay;
- fechamento por Escape, botão X e backdrop;
- retorno de foco seguro;
- compartilhamentos individuais dos quatro modos.

Pendências:
- nenhuma pendência da Fase C;
- Fase D não iniciada.

Próximo passo:
- criar o checkpoint de encerramento da Fase C; iniciar a Fase D somente em tarefa própria.


## 22/08/2026 — v3.0 Fase D: auditoria do jogo interno dos quatro modos

**Status: AUDITORIA / ESPECIFICAÇÃO EM ANDAMENTO — NENHUMA IMPLEMENTAÇÃO INICIADA**

### Diagnóstico geral

- os cabeçalhos da Fase A estão consistentes, compactos e funcionalmente diferentes apenas
  onde a mecânica exige; não há justificativa para reabrir o sticky mobile;
- os quatro modos possuem foco principal reconhecível, mas Clássico mobile, Mais ou Menos e
  Onze Inicial ainda exibem mais informação simultânea que o necessário;
- larguras desktop diferentes são majoritariamente justificadas: Clássico precisa da grade
  de oito atributos, Foto da imagem quadrada, MM da comparação e Onze do campo vertical;
- não foi encontrado P0 confirmado na inspeção estática;
- foram encontrados quatro pontos P1: scroll de tentativas do Clássico mobile, viés visual
  entre Mais/Menos, indisponibilidade persistente de Compartilhar Foto/MM após F5/fechamento
  e confete JavaScript sem respeito a `prefers-reduced-motion`;
- resultados estáticos continuam necessários e não devem ser removidos; Foto/MM precisam
  apenas recuperar acesso persistente ao compartilhamento já aprovado na Fase C.

### Cabeçalho compartilhado

Classificação: **CONSISTENTE**.

- Voltar possui alvo de 44 px, nome acessível, foco visível e posição equivalente;
- título central e informação contextual direita preservam a grade compartilhada;
- Clássico usa timer, Foto dificuldade + tentativas, MM rodada e Onze não inventa métrica
  de cabeçalho: diferenças justificadas;
- sticky mobile opaco, divisor único e busca conjunta no Clássico/Foto resolvem o scroll;
- não foi observado problema concreto que autorize mudança na Fase A;
- pendência apenas de validação integrada em 412×600 com conteúdo longo, sem proposta de
  alteração estrutural.

### Clássico

Estado geral: funcional, claro e tecnicamente protegido.

Desktop:
- grade de 760 px utiliza oito proporções específicas; Nacionalidade/Estreia e cabeçalho/
  células estão alinhados, e Títulos recebe a maior coluna depois de Jogador;
- 11,5 px em Títulos é uma redução controlada; Gols/Assist. permanecem compactos;
- gap de 7 px e células de 12×8 px equilibram densidade e leitura em 1366–1920;
- aumentar muito a largura prejudicaria a comparação horizontal; largura atual é adequada;
- melhoria potencial P3: revisar somente após navegador real nomes/títulos extremos, sem
  nova alteração preventiva.

Mobile:
- a ordem semântica das oito propriedades é preservada; Jogador e Títulos usam largura
  total, demais atributos duas colunas;
- cada tentativa ocupa aproximadamente cinco fileiras, com células mínimas de 66 px, labels
  repetidas e gaps; clareza é alta, mas duas tentativas já exigem scroll considerável;
- comparação entre tentativas distantes fica difícil porque as labels e o card inteiro se
  repetem; não se deve remover propriedades nem converter em tabela horizontal;
- recomendação P1: testar compactação conservadora de min-height/padding/gaps e hierarquia
  das labels, mantendo Jogador/Títulos completos e as oito propriedades;
- setas textuais são claras e não dependem apenas de cor; textos longos têm quebra natural;
- resultado estático: **SIMPLIFICAR** no futuro (mensagem + compartilhar), preservando
  resposta, tentativas e acesso após F5; o texto `Volte amanhã` compete com timer existente.

### Foto

Estado geral: a fotografia é protagonista e a largura quadrada de 320 px é apropriada.

- busca dentro do sticky ocupa espaço antes da foto, mas é a ação principal e a prioridade é
  justificada; não há evidência para movê-la;
- dificuldade no cabeçalho é contextual e compacta; cores fácil/médio/difícil comunicam
  dificuldade, não resultado, diferença justificada;
- contraste tem alvo 44 px, `aria-pressed`, ícone monocromático e estado ativo claro;
- cabeçalho numérico, seis dots e lista repetem parcialmente tentativas: o número explica
  limite, dots mostram distribuição e lista mostra nomes, mas os dots têm menor valor após
  várias tentativas;
- recomendação P2: reduzir peso visual dos dots ou avaliar sua remoção somente após teste A/B
  manual; manter sempre o contador explícito e a lista;
- transição de filtro de 0,6 s é funcional e limitada à imagem de 320 px; custo aceitável;
- resultado estático: **REORGANIZAR** apenas para manter resposta/foto e disponibilizar o
  Compartilhar Foto após fechar overlay/F5. Hoje essa ação existe somente no overlay imediato
  e fica inacessível na reentrada, inconsistência funcional P1;
- espaço vertical e primeira dobra são adequados em 390–480; 412×600 deve validar imagem
  parcialmente visível sem reduzir o alvo de busca/contraste.

### Mais ou Menos

Estado geral: comparação é compreensível e números recebem prioridade correta.

- kickers `REFERÊNCIA ATUAL`/`PRÓXIMO JOGADOR`, borda do candidato e `?` deixam papéis claros;
- fotos, nome, Nacionalidade · Posição e número formam hierarquia legível; metadados são
  úteis para identidade, mas secundários corretamente;
- cabeçalho `Rodada X/10`, label `PROGRESSO`, dez segmentos, acertos, objetivo e caption de
  rodada repetem parte do estado;
- recomendação P1/P2: manter cabeçalho, segmentos, acertos e meta; remover ou reduzir
  `PROGRESSO` e a caption repetitiva, sem alterar rodadas ou feedback;
- problema P1: `Mais` usa borda/fundo dourados antes da resposta enquanto `Menos` é neutro;
  escolhas equivalentes recebem pesos diferentes e podem induzir seleção. Recomenda-se base
  neutra simétrica, reservando ouro/verde/vermelho para hover, foco e resposta;
- feedback de 1,5 s é funcional, cobre o card, revela comparação, possui anúncio oculto e
  bloqueia duplo clique; duração e ordem devem permanecer;
- animações de entrada/pop são curtas e já cobertas parcialmente por movimento reduzido;
- resultado estático: **REORGANIZAR** minimamente e adicionar acesso persistente ao mesmo
  Compartilhar MM da Fase C; hoje compartilhar desaparece após fechar/F5 (P1);
- desktop de 520 px é adequado; no mobile, 72/64 px para fotos e botões de 56–58 px mantêm
  decisão clara sem overflow aparente.

### Onze Inicial

Estado geral: maior densidade informacional, mas fluxo em duas etapas é compreensível.

Antes do placar:
- competição, confronto, local/data/estádio e pergunta contextualizam a partida; confronto e
  placar devem dominar, enquanto competição e meta podem perder peso;
- `local_tag` e data/estádio têm valor contextual, mas não precisam competir com adversário;
- placar com inputs e Confirmar é claro e possui dimensões adequadas.

Durante a escalação:
- resultado real permanece no card da partida, necessário para a etapa já revelada;
- `0/3`, três dots e pills `FALTAM` repetem progresso; recomenda-se P1/P2 manter número e
  `FALTAM`, reduzindo ou removendo dots após validação;
- busca acima do campo é a ação correta; autocomplete com avatar e 50 px é acessível;
- campo vertical é protagonista, mas labels chegam a 8,25–9 px em 360 px e linhas densas;
  esta é uma limitação real de legibilidade P1 que precisa teste com formações/nome extremos,
  sem mover coordenadas nem aumentar campo além da viewport;
- lista `Fora` confirma erros acumulados, mas pode crescer e empurrar conteúdo; P2: manter
  contagem/feedback imediato e tornar lista nominal secundária, sem apagar histórico;
- competição, data, placar e formação não precisam do mesmo peso: confronto/placar primeiro,
  campo/progresso na etapa 2, metadados por último;
- desktop de 430 px parece estreito em tela ampla, mas é justificado pelo campo 2:3; aumento
  moderado só deve ocorrer se melhorar labels sem alongar excessivamente a página.

Resultado estático:
- classificação **SIMPLIFICAR**: preservar placar real/palpite, 3/3, erros, countdown e
  Compartilhar, mas reduzir subtítulo, caixas aninhadas e detalhe nominal de erros;
- não é candidato a remoção: é a consulta completa após F5/fechar overlay.

### Feedbacks e cores

| Modo | Correto | Incorreto | Progresso | Avaliação |
|---|---|---|---|---|
| Clássico | célula verde + flip | célula vermelha + shake | tentativas empilhadas | consistente com a mecânica |
| Foto | item/dot verde no acerto | item/dot vermelho | contador + dots | consistente, parcialmente redundante |
| MM | verde + overlay 1,5 s | vermelho + resposta correta | rodada, barras, acertos, meta | claro, excesso de indicadores |
| Onze | chip revelado/dourado + campo | texto, lista Fora e contador | 0/3 + dots + Faltam | claro, parcialmente redundante |

- verde e vermelho representam resultado de tentativa de modo consistente;
- dourado representa ação/conquista, exceto no botão `Mais`, onde antecipa prioridade e deve
  ser neutralizado;
- Clássico usa vermelho em muitas células por natureza; tons profundos evitam aparência de
  alerta, mas contraste deve ser validado em navegador real;
- feedback textual acompanha cor nos pontos críticos, evitando dependência exclusiva de cor.

### Tipografia e espaçamento

- títulos de modo e métricas usam a família display de forma consistente;
- labels de 8–10 px aparecem sobretudo em Clássico mobile, dots/status e campo do Onze;
- P1: labels de jogadores do Onze em 8,25–9 px são o principal risco de legibilidade;
- P2: `PROGRESSO`, caption MM e dots adicionam caixa alta sem nova informação;
- Clássico desktop, Foto e MM possuem espaçamento adequado;
- Clássico mobile é excessivo por tentativa; Onze é excessivo no fluxo total, não em um
  único gap; compactar hierarquia antes de reduzir touch targets;
- nenhuma recomendação exige novo card ou superfície.

### Mobile por modo

- Clássico: sticky + busca aparecem antes do scroll; primeira tentativa ocupa cerca de
  350–390 px. Maior custo de scroll, sem overflow estrutural conhecido;
- Foto: sticky + busca e parte relevante da foto aparecem primeiro; resultado depende da
  altura, com bom comportamento em 412×600 desde a Fase A;
- MM: cabeçalho, progresso e jogadores competem pela primeira dobra; ações ainda permanecem
  grandes e claras, mas 412×600 provavelmente exige pequeno scroll antes dos botões;
- Onze: cabeçalho + contexto/placar dominam etapa 1; etapa 2 exige scroll natural até campo e
  busca. Não tentar mostrar tudo na primeira dobra;
- footer pertence ao fluxo/scroll principal e não há regra indicativa de sobreposição;
- touch targets principais ficam em 44 px ou mais; chips de campo não são controles.

### Desktop por modo

- Clássico aproveita aproximadamente 760 px e é o modo mais horizontal: correto;
- Foto permanece estreito por causa da imagem quadrada: diferença justificada;
- MM usa 520 px e poderia ganhar poucos pixels, mas não há benefício confirmado;
- Onze usa 430 px; formato vertical justifica centralização, porém teste futuro pode avaliar
  460–480 px para legibilidade do campo sem transformar em fullscreen;
- não há evidência de interface mobile simplesmente ampliada no Clássico; MM/Onze são
  deliberadamente focados e não devem ocupar largura só porque ela existe.

### Acessibilidade

- buscas usam combobox/listbox, `aria-expanded`, opção ativa e teclado; Escape fecha listas;
- Voltar, contraste e ações principais têm foco visível e nomes acessíveis;
- MM desabilita ações durante transição e fornece anúncio textual oculto no feedback;
- overlay final e modais possuem trap/Escape já validados na Fase C;
- P1: `dispararConfetes()` ignora `prefers-reduced-motion`; os CSS principais respeitam a
  preferência, mas confete ainda é executado nos quatro modos aplicáveis;
- P2: transição de filtro da Foto e alguns transforms/hover não estão neutralizados no bloco
  reduced-motion; revisar sem remover feedback funcional;
- não foram encontrados ARIA redundantes que exijam correção imediata.

### Animações e performance

- Clássico flip/shake: funcionais, curtos e cobertos por movimento reduzido;
- Foto filter 0,6 s: funcional; blur em imagem 320×320 tem custo limitado e aceitável;
- MM reveal/pop/feedback/timer: funcionais; bloco reduced-motion desativa animação visual,
  mas mantém corretamente o atraso lógico de 1,5 s;
- Onze chip correto: funcional e coberto por movimento reduzido;
- confete: decorativo e não condicionado à preferência de movimento (P1);
- sticky usa fundo opaco no mobile sem blur; custo baixo;
- backdrop blur pertence a header/modais compartilhados já validados, sem problema concreto;
- não há justificativa para otimização prematura de sombras/filtros.

### Matriz de consistência

| Critério | Clássico | Foto | Mais ou Menos | Onze Inicial |
|---|---|---|---|---|
| Cabeçalho | CONSISTENTE | DIFERENÇA JUSTIFICADA | DIFERENÇA JUSTIFICADA | CONSISTENTE |
| Progresso | tentativas implícitas, JUSTIFICADO | consistente, redundância leve | INCONSISTÊNCIA A CORRIGIR | INCONSISTÊNCIA A CORRIGIR |
| Busca | CONSISTENTE | CONSISTENTE | não se aplica | CONSISTENTE |
| Ação principal | palpite, CONSISTENTE | palpite, CONSISTENTE | INCONSISTÊNCIA A CORRIGIR no peso Mais/Menos | placar/palpite, JUSTIFICADO |
| Feedback | CONSISTENTE | CONSISTENTE | DIFERENÇA FUNCIONAL JUSTIFICADA | CONSISTENTE |
| Resultado estático | SIMPLIFICAR | REORGANIZAR/Compartilhar | REORGANIZAR/Compartilhar | SIMPLIFICAR |
| Cores | CONSISTENTE | dificuldade justificada | viés dourado A CORRIGIR | campo/dourado justificados |
| Tipografia | adequada | adequada | secundários excessivos | labels do campo A CORRIGIR |
| Espaçamento | desktop correto/mobile excessivo | correto | correto, informação excessiva | fluxo total excessivo |
| Mobile | scroll alto | adequado | adequado com scroll curto | denso, mas mecânica justifica |
| Acessibilidade | boa; confete pendente | boa; movimento pendente | boa; confete pendente | boa; labels/confete pendentes |

### Prioridades consolidadas

P0:
- nenhum problema funcional ou de acessibilidade bloqueante confirmado.

P1:
- compactar conservadoramente tentativas do Clássico mobile sem remover atributos;
- neutralizar peso inicial desigual dos botões Mais/Menos;
- disponibilizar Compartilhar individual de Foto/MM também no resultado estático/reentrada;
- respeitar `prefers-reduced-motion` no confete JavaScript;
- reduzir redundância de progresso no MM e Onze sem mudar mecânica;
- melhorar legibilidade dos labels do campo em 360–412 px sem alterar coordenadas.

P2:
- reduzir peso/necessidade dos dots do Foto;
- tornar metadados da partida e lista `Fora` mais secundários;
- simplificar resultados estáticos, especialmente Onze;
- revisar transição de filtro/hover sob movimento reduzido;
- reduzir labels auxiliares e caixa alta redundante.

P3:
- microajustes de gaps em desktop após validação real;
- avaliar aumento moderado do Onze em desktop;
- revisar casos extremos de títulos/nacionalidades do Clássico.

### Plano recomendado da Fase D

- **D.1 — CONCLUÍDA — acessibilidade compartilhada:** condicionar confete a movimento reduzido e revisar
  somente transições não essenciais; entrega pequena e transversal;
- **D.2 — CONCLUÍDA — Clássico:** compactação mobile conservadora e validação de textos extremos;
- **D.3 — CONCLUÍDA — Foto:** hierarquia do progresso/dots e ação persistente de Compartilhar no
  resultado estático;
- **D.4 — CONCLUÍDA — Mais ou Menos:** neutralidade dos botões, redução de indicadores redundantes e
  Compartilhar persistente, preservando integralmente o feedback de 1,5 s;
- **D.5 — CONCLUÍDA — Onze Inicial:** hierarquia de contexto/progresso, legibilidade do campo, lista Fora
  e simplificação do resultado estático;
- **D.6 — CONCLUÍDA — validação integrada:** 360–480, 412×600, desktop, teclado, movimento reduzido,
  F5, saves, histórico e regressão completa.

Cada etapa deve possuir aprovação própria; não alterar os quatro modos simultaneamente.

### Riscos e decisões pendentes

- compactar Clássico pode prejudicar títulos/nacionalidades e comparação se for agressivo;
- aumentar labels do Onze pode colidir em linhas densas ou alterar percepção das coordenadas;
- remover indicadores de progresso sem teste pode reduzir entendimento de iniciantes;
- adicionar Compartilhar estático deve reutilizar exatamente os formatos da Fase C;
- neutralizar Mais/Menos não pode enfraquecer foco visível nem feedback correto/incorreto;
- movimento reduzido deve impedir decoração, não eliminar feedback ou o atraso lógico do MM;
- decidir em cada D.x se alteração de resultado estático pertence ao modo ou deve aguardar
  uma correção pontual da Fase C; não reabrir o overlay compartilhado.

Arquivos alterados nesta etapa:
- somente `ROADMAP_TIMAODLE.md`;
- HTML, CSS, JavaScript, JSONs, testes, seeds, saves, storage, histórico, Home e overlay final
  permaneceram inalterados.

Próximo passo:
- aprovar a auditoria e iniciar D.1 em tarefa própria; não implementar D.2–D.5 em paralelo.

## 22/08/2026 — v3.0 Fase D.1: acessibilidade compartilhada e movimento reduzido

**Status: CONCLUÍDA**

Implementado:
- criado o helper compartilhado `prefereMovimentoReduzido()` para consultar
  `prefers-reduced-motion: reduce` sem duplicar a detecção;
- `dispararConfetes()` agora retorna antes de gerar o efeito decorativo quando movimento
  reduzido está ativo, sem interferir em conclusão, save, histórico, streak, 4/4, resultado
  final ou compartilhamento;
- a celebração visual 4/4 da Home reutiliza o mesmo helper, preservando seu comportamento;
- no Foto, transições do filtro/blur, do controle de contraste e dos dots passam a ser
  instantâneas sob movimento reduzido; o blur, seus níveis e o `scale(1.15)` que protege as
  bordas da imagem permanecem funcionais;
- o hover decorativo do controle de contraste deixa de aplicar escala sob movimento reduzido;
- Clássico, Mais ou Menos e Onze Inicial foram conferidos no bloco consolidado já existente;
  suas animações relevantes continuam neutralizadas sem remoção de feedback textual;
- o atraso funcional `ATRASO_AVANCO_MM` de 1,5 segundo foi preservado integralmente.

Testado:
- movimento reduzido ativo impede a chamada do confete;
- movimento reduzido inativo mantém quantidade, dispersão e origem existentes do confete;
- conclusão 4/4 continua calculada independentemente do efeito decorativo;
- Mais ou Menos mantém o atraso lógico de 1,5 segundo;
- o único bloco CSS de movimento reduzido cobre as transições decorativas relevantes do Foto
  sem remover seu filtro ou escala funcional;
- suíte geral, testes de storage e histórico, sintaxe JavaScript, integridade estrutural e
  whitespace validados pelos comandos obrigatórios da etapa.

Pendências:
- nenhuma; validação manual aprovada.

Próximo passo:
- implementar e validar a D.2 isoladamente; não iniciar D.3 em paralelo.

## 22/08/2026 — v3.0 Fase D.2: polimento do Clássico mobile

**Status: CONCLUÍDA**

Implementado:
- compactação confinada ao breakpoint mobile de 480 px do Clássico;
- gap entre tentativas reduzido de 12 px para 8 px;
- gap da grade interna reduzido de 7 px para 5 px e padding do bloco de 8 px para 6 px;
- células reduzidas de 66 px para 56 px de altura mínima, com padding de `9px 8px` para
  `6px 7px` e distância entre label e valor de 5 px para 3 px;
- line-height dos valores ajustado de 1,4 para 1,3 e o de Títulos de 1,45 para 1,35;
- letter-spacing das labels reduzido discretamente de 0,65 px para 0,4 px;
- altura base estimada de uma tentativa reduzida de aproximadamente 376 px para 314 px,
  sem impor altura máxima; textos longos continuam expandindo a célula naturalmente.

Preservado deliberadamente:
- as oito propriedades, sua ordem semântica e suas labels completas no mobile;
- Jogador e Títulos em largura integral, com o nome mantendo 14 px/peso 700;
- valores gerais em 13 px, Títulos em 12 px e labels em 8 px;
- quebra natural de títulos e nacionalidades, sem ellipsis, clamp ou ocultação;
- setas funcionais, estados correto/parcial/incorreto, cores e lógica de comparação;
- busca, autocomplete, sticky, touch targets, HTML, JavaScript, desktop e demais modos.

Testado:
- proteção estrutural mantém duas colunas intermediárias, Jogador/Títulos full width, oito
  labels completas e Títulos sem truncamento;
- grade desktop de oito colunas permanece com as mesmas proporções e gap;
- suíte geral, storage, histórico, sintaxe JavaScript, CSS balanceado, IDs únicos e
  whitespace validados pelos comandos obrigatórios da etapa.

Pendências:
- nenhuma; validação manual aprovada.

Próximo passo:
- D.3 é a próxima etapa, mas permanece não iniciada até tarefa própria.

## 22/08/2026 — v3.0 Fase D.3: polimento do Modo Foto

**Status: CONCLUÍDA**

Implementado:
- resultado estático de vitória ou derrota agora oferece o botão real `COMPARTILHAR` após
  fechar o overlay, atualizar a página ou reentrar no modo concluído;
- a visibilidade é derivada exclusivamente do status `won`/`lost` do save já existente, sem
  nova persistência ou estado de apresentação;
- overlay e resultado estático chamam a mesma `compartilharResultadoFoto()`, que continua
  usando o mesmo builder anti-spoiler e a infraestrutura compartilhada de Web Share,
  clipboard e fallback; somente o botão que recebe feedback visual é parametrizado;
- dots preservados como indicador secundário, reduzidos de 10 px para 8 px, com gap de 8 px
  para 5 px e estado vazio mais neutro; estados usados continuam perceptíveis e inalterados;
- lista de tentativas preservada, com gap de 6 px para 5 px e padding de `9px 14px` para
  `8px 12px`, sem esconder nomes ou criar novo container;
- contador permanece a fonte principal de progresso e a lista continua informando as
  tentativas concretas.

Preservado deliberadamente:
- fotografia de 320×320, proporção, crop, blur, níveis de revelação, escala funcional,
  dificuldade, manifesto e jogador diário;
- busca, sticky, controle de contraste, `aria-label`, `aria-pressed` e alvo de 44 px;
- proteção de movimento reduzido da D.1, inclusive transições dos dots;
- overlay da Fase C, Home, Clássico/D.2, Mais ou Menos, Onze Inicial, saves, histórico,
  streak e formato textual aprovado do compartilhamento.

Testado:
- vitória e derrota exibem Compartilhar no resultado estático; estado em andamento o oculta;
- restauração/F5 usa o status salvo para disponibilizar a ação sem reabrir o overlay;
- ação estática reutiliza exatamente o builder e a infraestrutura do overlay;
- anti-spoiler continua sem incluir tentativas ou resposta secreta;
- botão é semântico, nomeado, acessível por teclado e mantém alvo mínimo compartilhado;
- seis dots e seus estados estruturais permanecem renderizados.

Pendências:
- validação manual mobile em 360×800, 390×844, 412×915, 430×932, 480×900 e 412×600;
- validação desktop em 1366×768, 1440×900 e 1920×1080;
- validar vitória 1/6, vitória 6/6, derrota 6/6, fechamento do overlay, F5 e reentrada;
- D.4 não iniciada.

Próximo passo:
- validar manualmente a D.3; iniciar D.4 somente após aprovação em tarefa própria.

## 22/08/2026 — v3.0 Fase D.4: polimento do Mais ou Menos

**Status: CONCLUÍDA**

Implementado:
- `MAIS` e `MENOS` agora recebem exatamente a mesma borda, fundo, cor, sombra, tipografia,
  hover, active e foco pela classe compartilhada; removidas as duas regras que davam dourado
  inicial ao `MAIS` e tratamento neutro separado ao `MENOS`;
- feedback posterior preserva classes verde/vermelha, indicação textual, bloqueio dos dois
  botões e revelação da resposta correta;
- removida a label redundante `PROGRESSO`; rodada no cabeçalho, dez segmentos, acertos e meta
  continuam presentes com funções distintas;
- meta simplificada de `Objetivo: 7 acertos em 10 rodadas` para `Meta: 7 acertos`, pois a
  quantidade de rodadas já está no cabeçalho e nos segmentos;
- legenda permanente simplificada para apenas a regra essencial de empate e secundarizada
  por cor, tamanho e peso, sem alterar que qualquer resposta conta;
- resultado estático de vitória ou derrota agora mantém `COMPARTILHAR` após fechar o overlay,
  F5 ou reentrada, derivado exclusivamente do status salvo;
- overlay e resultado estático reutilizam `compartilharResultadoMM()`, o mesmo builder
  anti-spoiler e a mesma infraestrutura de Web Share, clipboard e fallback, parametrizando
  somente o botão de feedback.

Preservado deliberadamente:
- algoritmo v2, seed, plano 3/4/3, variedade, snapshots, saves, histórico, dez rodadas, meta
  real de sete acertos e regra de empate;
- atraso funcional `ATRASO_AVANCO_MM = 1500`, salvamento antes do feedback, bloqueio de nova
  escolha e abertura do overlay somente depois do resultado estático;
- dez segmentos com estados de acerto/erro, fotos, nomes, metadados, números de jogos,
  fallbacks, duas linhas e escala responsiva 88→80→72→64;
- largura aproximada de 520 px, overlay da Fase C, Home e demais modos.

Testado:
- neutralidade estrutural inicial de `MAIS`/`MENOS` e permanência dos estados de feedback;
- atraso de 1,5 segundo e fluxo final após feedback;
- Compartilhar estático em vitória e derrota, inclusive restauração sem reabrir overlay;
- limites 6/10 derrota, 7/10 vitória e 10/10 vitória;
- reutilização do builder e anti-spoiler sem jogadores, valores ou direções;
- permanência de dez segmentos, acertos e meta.

Pendências:
- validação manual mobile em 360×800, 390×844, 412×915, 430×932, 480×900 e 412×600;
- validação desktop em 1366×768, 1440×900 e 1920×1080;
- validar neutralidade inicial, feedback correto/incorreto/empate, 6/10, 7/10, 10/10,
  fechamento do overlay, F5, reentrada, teclado, foco e ausência de overflow;
- D.5 não iniciada.

Próximo passo:
- validar manualmente a D.4; iniciar D.5 somente após aprovação em tarefa própria.

## 22/08/2026 — v3.0 Fase D.5: polimento do Onze Inicial

**Status: CONCLUÍDA**

Implementado:
- confronto e placar permanecem como contexto primário; competição, data, estádio e tag de
  local foram secundarizados por menor contraste, peso, tamanho e espaçamento, removendo a
  aparência dourada de pill do local sem retirar conteúdo histórico;
- progresso principal passa a dizer explicitamente `X/3 JOGADORES`;
- os três dots foram mantidos por cautela, reduzidos para 5 px e menor contraste/opacidade,
  como apoio visual estritamente secundário;
- `FALTAM` foi preservado porque suas pills informam as posições dos slots ocultos, dado que
  não existe no contador; sua superfície foi removida e labels/pills ficaram discretas;
- largura desktop do modo e painéis aumentada moderadamente de 440/430 px para 480/470 px,
  com campo de até 410 px, melhorando labels sem alterar proporção ou coordenadas;
- labels normais do campo passaram de 88/9,5 px para 92/10 px no desktop; linhas densas de
  78/9 px para 82/9,5 px;
- no mobile até 480 px, labels normais usam 80 px/9,5 px e densas 70 px/9,25 px; em 360 px,
  usam 72 px/9,25 px e 64 px/9 px, eliminando o pior caso anterior de 8,25 px sem ampliar
  a largura das linhas de quatro atletas;
- padding lateral do card em 360 px foi reduzido de 11 px para 9 px para recuperar largura
  útil sem diminuir ou distorcer o campo;
- lista `Fora` e detalhe de erros ganharam fundo neutro, borda suave, padding/gap menores e
  tipografia secundária, preservando todos os nomes e a contagem de erros;
- resultado estático perdeu o subtítulo redundante e quatro caixas internas; placar real,
  palpite, status, 3/3, erros, detalhe, countdown e Compartilhar continuam disponíveis em
  uma única superfície resumida.

Preservado deliberadamente:
- nove partidas, onze titulares por partida, nomes, posições, `top`, `left`, formação,
  partida/slots diários, seed, exatamente três ocultos e alvo 3/3;
- placar real, palpite, saves, migrações, histórico, countdown e compartilhamento existente;
- busca, autocomplete, teclado, foco, feedback textual e visual, revelação e movimento
  reduzido da D.1;
- overlay da Fase C, Home, Clássico, Foto e Mais ou Menos.

Testado:
- constante de três ocultos, onze titulares em cada partida e coordenadas numéricas dentro
  do campo;
- seleção copia diretamente `top`/`left` do JSON, sem transformação;
- nomes longos reais `Ángel Romero`, `Jorge Henrique` e `Leandro Castán` permanecem na base;
- busca/autocomplete, dots, FALTAM, compartilhamento e restauração do resultado continuam
  estruturalmente disponíveis;
- `X/3 JOGADORES` permanece como progresso principal e o subtítulo redundante não retorna.

Pendências:
- validação manual mobile em 360×800, 390×844, 412×915, 430×932, 480×900 e 412×600;
- validação desktop em 1366×768, 1440×900 e 1920×1080;
- conferir todas as nove partidas, linhas densas, nomes longos, três slots ocultos, lista
  Fora extensa, zero/múltiplos erros, conclusão, F5, reentrada, countdown e Compartilhar;
- D.6 não iniciada.

Próximo passo:
- validar manualmente a D.5; iniciar D.6 somente após aprovação em tarefa própria.

## 22/08/2026 — v3.0 Fase D.6: validação integrada dos quatro modos

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL FINAL APROVADA**

Estado validado:
- D.1, D.2, D.3, D.4 e D.5 concluídas e aprovadas manualmente;
- Fase D permanece em andamento até a validação manual final da D.6;
- Fase E não iniciada.

Matriz integrada:
- Clássico: desktop de oito colunas preservado; mobile compacto mantém oito propriedades,
  labels completas, setas, quebras naturais, estados semânticos, sticky, resultado e
  Compartilhar;
- Foto: fotografia, dificuldade, contador, seis dots secundários, lista, contraste, vitória,
  derrota e compartilhamento persistente/restaurável permanecem protegidos;
- Mais ou Menos: ações inicialmente equivalentes, feedback correto/incorreto/empate, dez
  segmentos, acertos, meta, regra de empate, limites 6/7/10 e atraso de 1,5 s preservados;
- Onze Inicial: nove partidas, onze titulares, três ocultos, coordenadas, confronto, placar,
  metadados, progresso, dots, FALTAM, campo, busca, Fora, erros, resultado, countdown,
  compartilhamento e restauração preservados.

Regressão compartilhada:
- Home/Fase B permanece estruturalmente protegida para estados 0/4–4/4, modos, Seu Timãodle,
  Estatísticas, Histórico e Compartilhar Dia;
- overlay/Fase C permanece único, acessível e protegido para resultado, continuidade, 4/4,
  Home, Escape, fechar, backdrop, focus trap, compartilhamento e anti-spoiler;
- movimento reduzido impede confete e transições decorativas do Foto sem retirar feedback;
  timing funcional de 1,5 s do MM permanece independente de animação;
- comboboxes/listboxes, teclado, foco, dialogs, retorno de foco e touch targets permanecem
  cobertos pelos contratos estruturais existentes.

Auditoria do diff:
- nenhum dos três JSONs foi alterado;
- seeds, sorteios, regras, saves, snapshots, migrações e histórico não receberam mudanças;
- CSS balanceado e 168 IDs únicos confirmados;
- removidos durante a auditoria somente resíduos sem uso introduzidos pelas simplificações:
  classes individuais `mm-btn-mais`/`mm-btn-menos` e seletor do subtítulo removido do Onze;
- nenhum builder de compartilhamento foi duplicado; Foto e MM reutilizam cada builder entre
  overlay e resultado estático;
- nenhum seletor ou ID órfão novo foi identificado após a limpeza;
- frontend-contract atualizado e aprovado.

Problemas encontrados:
- P0: nenhum;
- P1: nenhum;
- P2: nenhum;
- P3: nenhum pendente;
- smoke responsivo automatizado não executado porque Chrome/Edge headless ficou indisponível
  neste ambiente pelo processo GPU; isso não foi contabilizado como validação visual.

Testado:
- suíte completa: storage A–X, 39 cenários de regras/180 datas MM, 118 cenários de histórico,
  13 cenários de resultado, cinco de movimento reduzido e 40 estruturais/168 IDs;
- storage e histórico executados também isoladamente;
- sintaxe de `script.js` e `storage-normalizers.js` aprovada;
- `git diff --check` aprovado, apenas com avisos de normalização LF/CRLF;
- tentativa adicional de `node tests/viewport-smoke.js` registrada como SKIP pelo ambiente.

Checklist manual final:
- prioridade: 412×600, 412×915 e 1440×900; complementar com 360×800, 390×844, 430×932,
  480×900, 768×1024, 1366×768 e 1920×1080;
- percorrer Clássico, Foto, Mais ou Menos e Onze Inicial em andamento e concluídos;
- validar F5/reentrada, resultados estáticos, compartilhamentos e overlay em 1–3 modos
  pendentes e 4/4;
- validar Tab, Shift+Tab, Enter, Escape, foco visível, autocompletes, dialogs, retorno de foco
  e touch targets;
- ativar movimento reduzido e confirmar ausência de confete/transições decorativas, feedback
  textual intacto e atraso funcional do MM.

Pendências:
- nenhuma; não restaram problemas P0, P1, P2 ou P3 conhecidos da Fase D;
- Fase E não iniciada.

Próximo passo:
- iniciar em tarefa própria a v3.0 — Fase E: Histórico e Estatísticas.

## 22/08/2026 — v3.0 Fase D: encerramento oficial

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL FINAL APROVADA**

Validado manualmente:
- viewports prioritários 412×600, 412×915 e 1440×900;
- integração dos quatro modos, resultados estáticos, F5/reentrada e compartilhamentos;
- Home da Fase B e overlay final da Fase C;
- teclado, foco, dialogs, retorno de foco e movimento reduzido;
- nenhuma regressão P0, P1, P2 ou P3 conhecida permaneceu após a validação final.

Estado final:
- D.1, D.2, D.3, D.4, D.5 e D.6 concluídas;
- Fase D concluída;
- Fase E não iniciada.

Próximo passo:
- v3.0 — Fase E: Histórico e Estatísticas, somente em tarefa própria.

## 22/08/2026 — v3.0 Fase E: auditoria e especificação de Histórico e Estatísticas

**Status: AUDITORIA / ESPECIFICAÇÃO EM ANDAMENTO — IMPLEMENTAÇÃO NÃO INICIADA**

### Propósito das duas áreas

- **Suas Estatísticas — “Como estou indo?”:** deve priorizar desempenho acumulado,
  evolução e comparação pessoal; não deve reproduzir o relato cronológico de cada dia.
- **Histórico — “O que fiz nos dias anteriores?”:** deve priorizar localização temporal,
  estado de cada dia e consulta do detalhe; não deve competir com Estatísticas como painel
  agregado.
- A separação conceitual existe no código e nos pontos de entrada da Home, mas a densidade e
  o peso visual atuais aproximam as duas experiências de painéis de dados extensos.

### Estrutura real auditada — Suas Estatísticas

- modal acessível `integratedStatsModal`, com título associado, botão fechar de 44 px,
  Escape, backdrop, focus trap, retorno ao acionador e conteúdo com scroll interno;
- largura aproximada de 680 px, ampliada para 820 px a partir de 700 px; no desktop há
  quatro métricas gerais por linha e grade 2×2 de modos; no mobile há duas métricas gerais
  por linha e um modo por linha;
- estado vazio único quando `playedDays === 0`, com mensagem correta e sem números sem
  contexto;
- oito métricas gerais exibidas com o mesmo peso: sequência atual, recorde, dias 4/4,
  dias jogados, dias registrados, modos concluídos, vitórias e percentual de dias completos;
- Clássico: seis métricas — iniciadas, concluídas, vitórias, tentativas acumuladas,
  média por vitória e melhor resultado — mais distribuição em quatro faixas (`1`, `2`,
  `3`, `4+`);
- Foto: oito métricas — iniciadas, concluídas, vitórias, derrotas, taxa de vitória,
  média geral, média por vitória e melhor vitória — mais distribuição de `1` a `6`;
- Mais ou Menos: dez métricas — iniciadas, concluídas, vitórias, derrotas, taxa de vitória,
  média de acertos, melhor, pior, resultados 10/10 e resultados 7+ — mais distribuição de
  `0` a `10`;
- Onze Inicial: oito métricas — iniciadas, concluídas, erros totais, média de erros,
  menor número de erros, conclusões com zero erros, placares exatos e taxa de placar;
- as três distribuições somam 21 chips, todos com peso semelhante e labels de 8 px; os
  demais rótulos usam majoritariamente 9 px.

### Classificação proposta das métricas

- **Principais gerais:** sequência atual, recorde, dias 4/4 e taxa de dias completos;
- **Secundárias gerais:** dias jogados, modos concluídos e vitórias;
- **Detalhada geral:** dias registrados, útil para explicar a base histórica, mas pouco
  representativa de desempenho isoladamente;
- **Principais por modo:** concluídas e a métrica específica de desempenho — média de
  tentativas no Clássico, taxa de vitória na Foto, média de acertos no Mais ou Menos e
  média de erros no Onze Inicial;
- **Secundárias por modo:** vitórias/derrotas, melhor resultado, resultados 10/10 ou 7+,
  zero erros e placares exatos;
- **Detalhadas:** iniciadas, tentativas/erros acumulados, pior resultado, médias auxiliares
  e as distribuições completas;
- **Redundâncias contextuais:** no Clássico, concluídas e vitórias são equivalentes pela
  mecânica atual; iniciadas/concluídas aparecem em todos os modos; `Dias jogados`, `Dias
  registrados`, `Modos concluídos` e `Vitórias` são números legítimos, mas simultaneamente
  expostos exigem interpretação e não devem compartilhar prioridade;
- nenhuma métrica deve ser removida na Fase E; o direcionamento é preservar os cálculos e
  aplicar divulgação progressiva, títulos explicativos e prioridade visual.

### Streak e cálculos

- sequência atual e recorde derivam apenas de dias completos 4/4, respeitando
  `trackingStartedAt`, datas civis e a data de referência;
- `lastCompleteDate` também é calculado pela fonte integrada, mas não é renderizado no modal;
  deve ser avaliado como contexto detalhado, sem receber automaticamente o mesmo peso do
  streak atual e do recorde;
- a sequência atual permanece ativa quando o dia corrente ainda não está completo, desde
  que o dia anterior pertença à sequência; a regra está consolidada e não deve mudar;
- taxa de dias completos usa dias jogados como denominador, evitando penalizar registros
  vazios; taxas por modo usam conclusões ou avaliações válidas conforme a mecânica;
- médias e melhores resultados ignoram valores inválidos e preservam zero como estado sem
  amostra; na apresentação futura, zero sem amostra deve ser diferenciado de resultado
  real igual a zero, sobretudo em Mais ou Menos e Onze Inicial;
- `Dias registrados` conta entradas válidas no histórico, mesmo sem modo iniciado, enquanto
  `Dias jogados` exige ao menos um modo iniciado; essa diferença precisa de explicação ou
  menor destaque para não parecer inconsistência.

### Estrutura real auditada — Histórico

- modal acessível `historyModal`, com título associado, fechar de 44 px, Escape, backdrop,
  focus trap, retorno ao acionador e scroll interno;
- calendário mensal de sete colunas, cabeçalho de dias da semana, mês anunciado via região
  viva e navegação anterior/próximo limitada entre `trackingStartedAt` e o mês atual;
- largura aproximada de 500 px, ampliada para 720 px a partir de 700 px; calendário limitado
  a cerca de 620 px no desktop e composição compacta no mobile;
- estados calculados: futuro, anterior ao início do rastreamento, sem registro, registrado
  sem progresso, iniciado, parcial e completo 4/4; hoje e selecionado são marcadores
  independentes;
- indicadores textuais no dia: `0/4`, `• 0/4`, `X/4` e `✓ 4/4`; o dia atual recebe `HOJE`
  e seleção recebe borda/sombra próprias;
- dias futuros e anteriores ao rastreamento são desabilitados; dias navegáveis usam roving
  tabindex, setas, Home/End, Page Up/Page Down, Enter e Espaço;
- cada botão recebe rótulo acessível com data, hoje, indisponibilidade ou progresso; a grade
  usa papéis `grid`/`gridcell`, `aria-selected`, `aria-pressed` e `aria-current`;
- o detalhe do dia apresenta data, quatro linhas fixas de modo, status e métricas próprias,
  progresso geral `X/4 DESAFIOS`, pill de placar exato e streak histórico quando o dia
  completo pertence a uma sequência;
- o streak histórico informa a sequência acumulada até a data selecionada, não o tamanho
  posterior total da mesma sequência; a semântica do texto está coerente.

### Linguagem visual, responsividade e acessibilidade

- preto, branco e dourado estão preservados; verde/vermelho aparecem discretamente nos
  resultados por modo; o fogo do streak já é SVG monocromático com `currentColor`;
- há excesso moderado de superfícies, bordas, pequenas caixas e pills nos dois modais,
  especialmente nas métricas por modo e no resumo diário;
- Estatísticas tem hierarquia insuficiente porque números gerais, métricas por modo e chips
  recebem tratamento muito próximo; a leitura inicial não responde rapidamente “como
  estou indo?”;
- Histórico não possui legenda visual explícita para os estados do calendário; texto nos
  próprios dias e rótulos acessíveis reduzem o risco, mas a distinção entre registrado,
  iniciado e parcial exige descoberta;
- a seleção do dia é clara, porém calendário, detalhe de quatro modos, progresso e streak
  permanecem simultaneamente no mesmo fluxo, aumentando altura e carga cognitiva;
- os botões de mês e fechar atendem 44 px; os dias usam mínimo de 40 px e merecem revisão
  mobile para conforto de toque sem comprometer a grade de sete colunas;
- labels de 8–9 px nas Estatísticas são o principal risco de legibilidade; larguras
  intermediárias também precisam evitar cards ou chips comprimidos;
- não foram encontrados, na inspeção estática, problemas de IDs duplicados, foco sem retorno,
  fechamento inacessível ou navegação exclusivamente dependente de cor.

### Integração com Home, persistência e estado 4/4

- Estatísticas e Histórico permanecem ações secundárias da jornada pessoal na Home, sem
  competir com os quatro modos após a Fase B;
- ambos derivam de `timaodle_history_v1`; os saves normalizados dos quatro modos continuam
  sendo a autoridade para sincronizar o dia corrente;
- histórico passado usa resumos seguros e não depende de reabrir o save detalhado antigo;
- conclusão geral, streak e dia completo dependem dos quatro modos concluídos; a lógica 4/4
  é compartilhada e não deve ser reinterpretada visualmente na Fase E;
- o volume atual é linear no número de dias registrados para estatísticas e nos dias do mês
  para calendário; não há risco imediato de performance, mas a implementação não deve
  adicionar recomputações ou listeners por expansão sem necessidade.

### Problemas e prioridades

- **P0:** nenhum problema conhecido;
- **P1:** hierarquia insuficiente em Estatísticas, com oito métricas gerais e até dez por
  modo apresentadas quase no mesmo nível;
- **P1:** ausência de divulgação progressiva para 21 chips e métricas detalhadas, gerando
  modal longo e baixa capacidade de leitura rápida;
- **P1:** Histórico combina calendário e detalhe extenso sem uma camada intermediária clara,
  sobretudo no mobile;
- **P2:** terminologia `dias jogados` versus `dias registrados`, além de iniciadas,
  concluídas e vitórias, pode parecer redundante sem contexto;
- **P2:** estados `registrado`, `iniciado` e `parcial` do calendário não possuem legenda
  visível e dependem de indicadores compactos;
- **P2:** labels de 8–9 px e dias de 40 px merecem correção responsiva e de toque;
- **P2:** zero real e ausência de amostra compartilham a mesma representação numérica em
  algumas métricas;
- **P3:** excesso de bordas, caixas e pills reduz a hierarquia e aproxima a interface de um
  dashboard genérico;
- **P3:** microespaçamentos e densidade das distribuições podem ser refinados depois que a
  arquitetura de informação estiver validada.

### Decisões e riscos para a implementação

- preservar integralmente `timaodle_history_v1`, normalizadores, saves individuais,
  `trackingStartedAt`, datas civis, streak, cálculos, seeds e lógica 4/4;
- preservar todas as métricas atuais; ocultar inicialmente não significa excluir dados;
- não criar gráfico complexo, biblioteca, dependência ou dashboard paralelo;
- não misturar Estatísticas e Histórico em um único modal;
- manter a arquitetura compartilhada de dialog, Escape, backdrop, focus trap e retorno;
- qualquer disclosure deve ser botão real, possuir estado anunciado, funcionar por teclado
  e não provocar perda de foco ou scroll inesperado;
- distinguir ausência de amostra na camada de apresentação sem alterar valores persistidos
  ou resultados históricos;
- validar dados escassos, somente um modo jogado, histórico longo, meses sem registros,
  4/4, hoje incompleto, mobile 360–480 px, tablet e desktop amplo;
- não iniciar a Fase F nem aproveitar esta fase para refatorar `script.js`.

### Decomposição proposta da Fase E

- **E.1 — Estatísticas gerais e estado vazio:** definir hierarquia principal/secundária,
  esclarecer termos, tratar ausência de amostra e validar streak/4/4 sem alterar cálculos;
- **E.2 — Estatísticas por modo e divulgação progressiva:** resumir cada modo inicialmente,
  preservar todas as métricas e distribuições em detalhe acessível sob demanda;
- **E.3 — Calendário do Histórico:** esclarecer estados e legenda, ajustar hierarquia,
  seleção, touch targets e comportamento responsivo preservando toda a navegação;
- **E.4 — Detalhe do dia:** reduzir peso simultâneo das quatro linhas, progresso e streak,
  mantendo todo status, placar exato e informação histórica disponível;
- **E.5 — Validação integrada e encerramento:** revisar Home, ambos os modais, teclado,
  foco, Escape, backdrop, retorno de foco, F5, saves, histórico longo, 4/4, mobile/tablet/
  desktop, contraste, overflow e regressão completa antes do checkpoint.

### Estado desta tarefa

- somente esta especificação no roadmap foi alterada;
- nenhuma implementação visual ou funcional da Fase E foi iniciada;
- HTML, CSS, JavaScript, JSONs, testes, saves, storage, seeds, histórico e mecânicas
  permaneceram intactos;
- nenhum teste foi executado, pois esta tarefa foi exclusivamente de auditoria estática e
  documentação;
- nenhum commit e nenhum push foram realizados.

Próximo passo:
- revisar e aprovar esta especificação; depois iniciar apenas a E.1 em tarefa própria.

## 22/08/2026 — v3.0 Fase E.1: Estatísticas gerais

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL APROVADA**

Implementado:
- as oito caixas gerais de mesmo peso foram substituídas por três níveis sem cards internos:
  resumo principal, linha secundária e contexto histórico detalhado;
- sequência atual tornou-se a primeira leitura e explicita que representa dias 4/4
  consecutivos; recorde permanece ao lado, menor, permitindo comparação direta;
- dias 4/4 e taxa 4/4 formam um único grupo conceitual, com a taxa descrita como percentual
  dos dias jogados e dourado reservado aos números de conquista;
- dias jogados, modos concluídos e vitórias permanecem disponíveis em uma linha secundária
  neutra, abaixo do resumo principal;
- dias registrados foi rebaixado para contexto textual e recebeu a explicação de que inclui
  dias armazenados mesmo sem desafio iniciado;
- `lastCompleteDate` continua calculado e não foi exibido, pois não acrescenta valor
  suficiente à primeira leitura;
- o estado vazio existente continua sendo usado quando nenhum dia foi jogado, evitando uma
  parede de zeros;
- em amostra pequena, os zeros das métricas gerais permanecem porque representam resultados
  reais — por exemplo, nenhum 4/4 ou streak zero — e não ausência de média;
- nenhuma conversão baseada em valor truthy foi introduzida; zero real continua protegido;
- superfícies individuais, oito backgrounds e oito bordas do resumo foram removidos;
  separadores leves preservam apenas os agrupamentos conceituais necessários;
- labels principais passaram a 10–11 px, com número, label e contexto em níveis distintos;
- desktop preserva modal de aproximadamente 820 px e duas colunas apenas no resumo principal;
- mobile empilha os dois grupos principais, mantém três métricas secundárias compactas e
  permite quebra natural da explicação de dias registrados;
- ordem semântica do DOM acompanha a leitura visual: sequência, recorde, 4/4, taxa,
  secundárias e contexto detalhado.

Preservado deliberadamente:
- cálculos, `timaodle_history_v1`, normalizadores, saves, storage, histórico, streak,
  recorde, 4/4, percentuais, médias, seeds e migrações;
- cards, conteúdo, métricas e 21 chips das estatísticas por modo, reservados para a E.2;
- header, largura, scroll interno, dialog, foco inicial, focus trap, Escape, backdrop,
  retorno de foco e acionador da Home;
- Histórico, Home, overlay final e todos os quatro modos.

Testado:
- suíte completa aprovada: storage A–X, 39 cenários de regras e 180 datas MM, 118 cenários
  de calendário, 13 de resultado final, cinco de movimento reduzido e 41 estruturais com
  168 IDs únicos;
- testes permanentes ampliados para histórico vazio, dias jogados, streak, recorde, 4/4,
  taxa, modos concluídos, vitórias e preservação de zero real;
- storage e histórico aprovados também isoladamente;
- sintaxe de `script.js` e `storage-normalizers.js` aprovada;
- `git diff --check` aprovado, apenas com avisos de normalização LF/CRLF;
- três JSONs fora do diff, CSS balanceado, IDs únicos, cálculos/storage inalterados e
  Histórico sem alterações.

Checklist manual pendente:
- validar 412×600 e 412×915 como prioridades; complementar com 360×800, 390×844, 430×932
  e 480×900;
- validar 1366×768, 1440×900 e 1920×1080;
- conferir histórico vazio, um dia/um modo, nenhum 4/4, streak zero e dados acumulados;
- conferir leitura, scroll, ausência de overflow, fechamento, backdrop, Escape, Tab,
  Shift+Tab e retorno de foco.

Pendências:
- nenhuma pendência conhecida da E.1 após a aprovação manual;
- E.2 é a próxima etapa e permanece não iniciada.

Próximo passo:
- iniciar E.2 somente em tarefa própria.

## 22/08/2026 — v3.0 Fase E.2: Estatísticas por modo e distribuições

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL APROVADA**

Implementado:
- cada modo agora apresenta nome, duas ou três métricas principais, uma linha secundária e
  detalhes nativos fechados por padrão;
- Clássico prioriza conclusões e média de tentativas; iniciados e melhor resultado ficam
  secundários; vitórias, tentativas acumuladas e distribuição ficam nos detalhes;
- Foto prioriza vitórias, taxa de vitória e média por vitória; conclusões, derrotas e melhor
  vitória ficam secundárias; iniciados, média geral e distribuição ficam nos detalhes;
- Mais ou Menos prioriza vitórias, taxa de vitória e média de acertos; conclusões, melhor e
  resultados 7+ ficam secundários; iniciados, derrotas, pior, 10/10 e distribuição ficam
  nos detalhes;
- Onze Inicial prioriza conclusões e média de erros; menor número de erros e placares exatos
  ficam secundários; iniciados, erros acumulados, conclusões sem erros e taxa de placar exato
  ficam nos detalhes;
- `<details>`/`<summary>` foi adotado por oferecer expansão nativa, teclado e estado sem
  JavaScript ou persistência; os quatro detalhes são reconstruídos fechados ao reabrir;
- as distribuições continuam dentro do respectivo modo e preservam exatamente quatro faixas
  do Clássico, seis da Foto e onze do Mais ou Menos, totalizando os mesmos 21 valores;
- chips deixaram de parecer botões: perderam background, borda completa e raio, passando a
  pares compactos categoria/valor separados por linha;
- modos nunca iniciados exibem um estado vazio compacto em vez de coleção de zeros;
- ausência de amostra usa `—` apenas em médias, melhores resultados e taxas que exigem
  conclusão/avaliação; zeros reais de vitórias, derrotas, acertos e erros são preservados;
- labels essenciais passaram a pelo menos 10 px e os resumos possuem alvo de 44 px, foco
  visível e indicador tipográfico monocromático `+`/`−`;
- o focus trap compartilhado passou a reconhecer `summary` como elemento focável, mantendo
  a navegação completa dentro do dialog sem ARIA redundante;
- desktop mantém grade 2×2 e modal de aproximadamente 820 px; mobile mantém um modo por
  linha, agora escaneável sem abrir dezenas de métricas;
- nenhuma animação de accordion, scroll interno por modo, gráfico, ícone ou dependência foi
  adicionada.

Preservado deliberadamente:
- todos os cálculos, categorias, contagens, ordem, médias, taxas, acumulados, regras de
  vitória, storage, normalizadores, saves, histórico e streak;
- ordem Clássico, Foto, Mais ou Menos e Onze Inicial;
- estrutura geral aprovada da E.1, incluindo sequência, recorde, 4/4, taxa, secundárias,
  dias registrados e estado vazio;
- Histórico, Home, overlay final, modos, dialog, header, Escape, backdrop, scroll interno e
  retorno de foco;
- três JSONs, seeds e migrações.

Testado:
- suíte completa aprovada: storage A–X, 39 cenários de regras/180 datas MM, 118 cenários de
  calendário, 13 de resultado final, cinco de movimento reduzido e 42 estruturais com 168
  IDs únicos;
- contratos permanentes cobrem quatro modos e sua ordem, quatro detalhes fechados, estado
  vazio por modo, foco, métricas centrais, 21 categorias e zero real;
- storage e histórico aprovados também isoladamente;
- sintaxe de `script.js` e `storage-normalizers.js` aprovada;
- `git diff --check` aprovado, somente com avisos LF/CRLF;
- CSS balanceado, JSONs fora do diff, cálculos/storage intactos e Histórico sem alterações.

Checklist manual pendente:
- validar detalhes fechados e abertos, alternância por clique, Enter e Espaço, foco visível,
  Tab/Shift+Tab, Escape e retorno de foco;
- validar modo sem dados, 0 vitórias com partidas, média ausente e zero real no Mais ou Menos
  e Onze Inicial;
- validar 412×600 e 412×915 como prioridades; complementar com 360×800, 390×844, 430×932 e
  480×900;
- validar 1366×768, 1440×900 e 1920×1080, inclusive distribuições abertas e ausência de
  overflow horizontal.

Pendências:
- validação manual da E.2;
- E.3 não iniciada.

Próximo passo:
- validar manualmente a E.2; iniciar E.3 somente após aprovação em tarefa própria.

## 22/08/2026 — v3.0 Fase E.3: Histórico e calendário

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL APROVADA**

Implementado:
- legenda visual compacta adicionada logo abaixo da grade, sem card ou superfície própria;
- a legenda representa somente cinco estados relevantes: sem registro, registro real 0/4,
  iniciado 0/4, parcial e completo 4/4;
- futuro e período anterior ao início do histórico foram deliberadamente excluídos da
  legenda porque permanecem desabilitados, esmaecidos e indisponíveis;
- marcadores da legenda reutilizam a linguagem das células e são decorativos para tecnologia
  assistiva; os rótulos completos das células continuam sendo a fonte acessível do estado;
- sem registro usa fundo transparente e borda tracejada; registro 0/4 mantém superfície
  neutra e indicador `0/4`; iniciado acrescenta marca lateral dourada e `• 0/4`;
- parcial usa indicador `1/4`–`3/4` dourado e borda dourada moderada; completo preserva
  `✓ 4/4`, fundo dourado suave e borda dourada;
- hoje passou a usar marcador e texto dourados; selecionado mantém borda dupla branca,
  permitindo distinguir hoje não selecionado, hoje selecionado e outro dia selecionado;
- navegação mensal perdeu superfície circular permanente nas setas; mês/ano ganhou prioridade
  enquanto as setas neutras mantêm 44×44, hover/foco dourado e disabled real;
- weekdays usam 10 px fixos, sem backgrounds individuais;
- células interativas passaram a mínimo de 44 px, mantendo número e progresso em pelo menos
  9–10 px e sete colunas sem scroll horizontal;
- em até 380 px, o padding lateral interno cai para 10 px e o gap para 2 px; em 360 px isso
  fornece aproximadamente 44 px por coluna dentro da largura útil, sem pseudo-elementos
  sobrepostos ou compressão de texto;
- legenda possui quebra natural em múltiplas linhas e permanece dentro dos mesmos 620 px do
  calendário no desktop;
- espaço entre calendário/legenda e detalhe foi reduzido apenas de 16 para 14 px;
- nenhuma nova cor, badge, emoji, animação, seletor de mês ou superfície externa foi criada.

Preservado deliberadamente:
- `trackingStartedAt`, datas civis, segunda-feira, sete estados internos, limites, seleção,
  troca de mês, foco, roving tabindex e todas as teclas existentes;
- futuro e before-tracking desabilitados, dias sem registro selecionáveis, hoje e seleção
  independentes, atualização imediata do resumo e renderização mensal atual;
- conteúdo e estrutura do detalhe diário, quatro modos, ausência de registro, progresso,
  streak histórico e anti-spoiler, reservados para a E.4;
- Estatísticas E.1/E.2, Home, Fases B/C/D, storage, normalizadores, saves, histórico, JSONs,
  seeds e mecânicas;
- dialog, aria-modal, título associado, grid rotulada, aria-current, aria-selected,
  aria-pressed, focus trap, Escape, backdrop e retorno de foco;
- largura aproximada de 720 px no desktop e scroll interno em viewport baixo.

Testado:
- suíte completa aprovada: storage A–X, 39 cenários de regras/180 datas MM, 118 cenários de
  calendário, 13 de resultado final, cinco de movimento reduzido e 43 estruturais com 168
  IDs únicos;
- contratos permanentes cobrem sete colunas, semana iniciada na segunda, sete estados,
  legenda de cinco estados, futuro/before-tracking fora da legenda, 44 px, weekdays, hoje e
  selecionado independentes;
- suíte histórica existente preserva limites, viradas de mês/ano, 0/4 versus sem registro,
  disabled, seleção, roving tabindex, setas, Home/End, PageUp/PageDown, Enter e Espaço;
- detalhe diário e anti-spoiler permanecem cobertos pelos contratos anteriores.

Checklist manual pendente:
- validar sem registro, registro 0/4, iniciado, 1/4–3/4 e 4/4, inclusive hoje/selecionado em
  combinações diferentes;
- validar setas habilitadas/desabilitadas, troca de mês, foco e seleção;
- validar ArrowLeft/Right/Up/Down, Home/End, PageUp/PageDown, Enter, Espaço, Tab, Shift+Tab,
  Escape, backdrop e retorno de foco;
- validar prioritariamente 360×800, 412×600 e 412×915; complementar com 390×844, 430×932 e
  480×900;
- validar 1366×768, 1440×900 e 1920×1080, legenda, scroll e ausência de overflow.

Pendências:
- validação manual da E.2 e da E.3;
- E.4 não iniciada.

Próximo passo:
- validar manualmente a E.3; iniciar E.4 somente após aprovação em tarefa própria.

## 22/08/2026 — v3.0 Fase E.4: detalhe diário do Histórico

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL APROVADA**

Implementado:
- data selecionada passou a incluir dia, mês e ano e permanece como heading do resumo;
- progresso geral foi movido para imediatamente abaixo da data e antes dos quatro modos,
  tornando `0/4`–`4/4 DESAFIOS` a principal métrica do dia;
- 4/4 mantém dourado de conquista; 0/4–3/4 permanecem brancos, sem sugerir conclusão;
- ordem Clássico, Foto, Mais ou Menos e Onze Inicial foi preservada em quatro linhas
  compactas com nome, estado textual e métrica específica já existente;
- cada linha perdeu background, borda completa e raio; um divisor inferior discreto separa
  os modos sem criar quatro cards dentro do detalhe;
- nomes dos modos usam 10 px e estados/métricas usam 11–13 px, mantendo hierarquia e
  legibilidade sem recorrer a labels essenciais minúsculas;
- andamento recebe marca lateral e texto dourados; vitória/derrota continuam reforçadas por
  verde/vermelho discretos, sempre acompanhados por texto; conclusão neutra recebe somente
  fundo dourado de 4%;
- `PLACAR EXATO` continua visível exclusivamente quando `exactScore === true`, agora como
  contexto textual dourado sem pill ou borda;
- sequência histórica foi reduzida de pill com fundo/borda para linha contextual neutra com
  o mesmo SVG monocromático e texto; progresso do dia permanece visualmente dominante;
- o resumo deixou de ser um card interno: fundo, borda completa, borda lateral dourada e
  raio foram removidos; uma linha superior conecta visualmente detalhe e calendário;
- sem registro preserva exatamente `SEM REGISTRO DISPONÍVEL` e sua explicação segura;
- registro real 0/4 continua exibindo progresso e as quatro linhas, distinguindo-se da
  ausência de registro;
- layout vertical, largura do modal, scroll interno e atualização imediata por seleção foram
  mantidos no desktop e mobile.

Preservado deliberadamente:
- `obterResumoHistoricoDia()`, `obterSequenciaHistoricaDoDia()`, allowlist, anti-spoiler,
  estados, resultados, métricas, exactScore, streak e sequência truncada até o dia escolhido;
- Clássico com tentativas, Foto com resultado e X/6, Mais ou Menos com resultado/acertos e
  Onze Inicial com 3/3 e erros;
- dias parciais, 0/4 ou sem registro sem streak histórico;
- aria-live somente no resumo selecionado; deslocamento de foco sem seleção não altera nem
  anuncia o detalhe;
- calendário E.3 completo — legenda, células, estados, hoje, seleção, navegação, 44 px,
  teclado, limites e renderização mensal;
- Estatísticas E.1/E.2, Home, Fases B/C/D, dialog, focus trap, Escape, backdrop e retorno;
- storage, normalizadores, saves, histórico, trackingStartedAt, JSONs, seeds e mecânicas.

Testado:
- suíte completa aprovada: storage A–X, 39 cenários de regras/180 datas MM, 118 cenários de
  calendário, 13 de resultado final, cinco de movimento reduzido e 44 estruturais com 168
  IDs únicos;
- estrutura permanente confirma data/progresso antes dos modos, ordem dos quatro modos,
  linhas sem cards, exactScore condicional e streak secundário;
- suíte histórica preserva sem registro, 0/4 real, andamento, vitória, derrota, conclusão,
  métricas por modo, exactScore, streak somente em 4/4 e sequência intermediária truncada;
- allowlist anti-spoiler continua bloqueando jogadores, resposta da Foto, sequência MM,
  valores de jogos, ocultos, confronto, placar e palpite.

Checklist manual pendente:
- selecionar sem registro, registro 0/4, andamento, 1/4–3/4 e 4/4;
- validar vitória/derrota/conclusão, singular/plural de tentativas, acertos, 3/3, zero e
  múltiplos erros, placar exato presente/ausente e streak em sequência intermediária;
- confirmar clique, Enter, Espaço, navegação apenas por foco sem anúncio indevido, Tab,
  Shift+Tab, Escape, backdrop e retorno de foco;
- validar 412×600 e 412×915 como prioridades; complementar com 360×800, 390×844, 430×932 e
  480×900;
- validar 1366×768, 1440×900 e 1920×1080, densidade, scroll e ausência de overflow.

Pendências:
- validação manual das E.2, E.3 e E.4;
- E.5 não iniciada.

Próximo passo:
- validar manualmente a E.4; iniciar E.5 somente após aprovação em tarefa própria.

## 22/08/2026 — v3.0 Fase E.5: validação integrada e preparação para fechamento

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL FINAL APROVADA**

Estado consolidado:
- E.1, E.2, E.3 e E.4 concluídas e aprovadas manualmente;
- E.5 executada em validação automatizada e auditoria estática do diff;
- Fase E permanece em andamento até a validação manual final;
- Fase F não iniciada.

Validação integrada:
- Estatísticas gerais preservam sequência, recorde, 4/4 e taxa como primárias; dias jogados,
  modos concluídos e vitórias como secundárias; dias registrados como contexto; estado vazio
  evita parede de zeros e zeros reais permanecem distintos de ausência de amostra;
- Estatísticas por modo preservam ordem, métricas específicas, estado compacto sem dados e
  quatro `<details>` nativos fechados por padrão, sem persistência ou listeners adicionais;
- distribuições mantêm quatro categorias do Clássico, seis da Foto e onze do Mais ou Menos,
  totalizando 21 valores associados aos respectivos modos e disponíveis somente nos detalhes;
- calendário preserva sete colunas, segunda-feira inicial, sete estados internos, legenda de
  cinco estados relevantes, hoje/seleção independentes, limites, 44 px e solução sem overflow
  em 360 px por redução de padding/gap;
- detalhe diário preserva data completa, progresso 0/4–4/4, quatro modos em ordem, estados,
  métricas, exactScore condicional, sem registro seguro, 0/4 real e streak truncado até a
  data selecionada;
- terminologia permanece coerente com cada mecânica: sequência, recorde, concluído, vitória,
  derrota, tentativas, acertos e erros; dias registrados possui explicação explícita em
  contraste com dias jogados;
- preto, branco, cinzas e dourado controlado permanecem dominantes; verde/vermelho aparecem
  somente como reforço semântico textual; nenhum emoji, gráfico, pill decorativa ou card
  interno excessivo foi reintroduzido;
- larguras de aproximadamente 820 px para Estatísticas e 720 px para Histórico foram
  preservadas, com 2×2 por modo no desktop e uma coluna no mobile;
- dialogs, títulos associados, Tab/Shift+Tab, Enter, Espaço, Escape, focus-visible, focus
  trap, retorno de foco, summary nativo, roving tabindex, aria-current, aria-selected e
  aria-live seletivo permanecem cobertos;
- teclado do calendário preserva setas, Home/End, PageUp/PageDown, Enter, Espaço, foco
  separado de seleção, limites e cruzamentos de mês/ano;
- Home continua com os acionadores Estatísticas e Histórico; contratos das Fases B, C e D,
  overlay final e quatro modos permanecem aprovados pela suíte estrutural e funcional;
- Estatísticas continua percorrendo apenas entradas históricas válidas; calendário renderiza
  somente o mês exibido; details não cria listeners nem estado; nenhum risco concreto de
  performance foi encontrado.

Auditoria de dados e diff:
- `storage-normalizers.js`, jogadores, partidas e manifesto de fotos permanecem fora do diff;
- `obterEstatisticasIntegradas()`, regras de streak, `obterResumoHistoricoDia()`,
  `obterSequenciaHistoricaDoDia()`, `obterEstadoDiaHistorico()`, geração/navegação do
  calendário, `trackingStartedAt`, saves, seeds e migrações não foram alterados;
- as únicas mudanças JavaScript de apresentação são o renderer das Estatísticas, helper para
  ausência de amostra, inclusão de `summary` no focus trap e ano na data selecionada;
- nenhum ID novo foi necessário; os 168 IDs continuam únicos;
- classes e seletores introduzidos pela Fase E possuem uso em markup dinâmico, HTML ou testes;
  nenhum resíduo órfão, branch morto ou markup redundante foi removido nesta E.5;
- anti-spoiler continua bloqueando jogadores secretos, resposta da Foto, sequência MM,
  valores de jogos, ocultos, confronto, placar e palpite.

Problemas conhecidos:
- P0: nenhum;
- P1: nenhum;
- P2: nenhum;
- P3: nenhum pendente;
- smoke responsivo automatizado: SKIP porque Chrome/Edge headless permanece indisponível
  neste ambiente pelo processo GPU; não contabilizado como falha da Fase E.

Testado:
- suíte completa aprovada: storage A–X, 39 cenários de regras/180 datas MM, 118 cenários de
  histórico, 13 de resultado final, cinco de movimento reduzido e 44 estruturais com 168 IDs;
- storage e histórico executados também isoladamente;
- sintaxe de `script.js` e `storage-normalizers.js` aprovada;
- `git diff --check` aprovado, somente com avisos de normalização LF/CRLF;
- CSS balanceado, três JSONs fora do diff, storage/seeds intactos e histórico compatível.

Checklist manual final:
- prioridade: 412×600, 412×915 e 1440×900; complementar com 360×800, 390×844, 430×932,
  480×900, 1366×768 e 1920×1080;
- Estatísticas: estado vazio, dados acumulados, quatro modos, details fechados/abertos,
  distribuições, zero real, teclado, scroll e overflow;
- Histórico: sem registro, registro 0/4, iniciado, parcial, 4/4, hoje/seleção, legenda,
  detalhe, exactScore, streak e teclado completo;
- Geral: fechar, backdrop, Escape, focus trap, retorno de foco e ausência de overflow.

Pendências:
- validação manual final da Fase E;
- Fase F não iniciada.

Próximo passo:
- executar a validação manual final da Fase E; somente após aprovação, encerrá-la em tarefa
  própria antes de iniciar a Fase F.

## 22/08/2026 — v3.0 Fase E: encerramento oficial

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL FINAL APROVADA**

Estado final:
- E.1, E.2, E.3, E.4 e E.5 concluídas;
- Estatísticas gerais, Estatísticas por modo e distribuições, calendário e detalhe diário
  aprovados manualmente em validação integrada;
- Fase E concluída sem problemas P0, P1, P2 ou P3 conhecidos;
- Fase F não iniciada.

Preservado:
- cálculos, storage, saves, seeds, histórico, normalizadores, JSONs, Home, overlays, modos e
  mecânicas;
- regras de streak, 4/4, datas civis, calendário, anti-spoiler e compatibilidade histórica.

Próximo passo:
- v3.0 — Fase F: validação final, somente em tarefa própria.

## 22/08/2026 — v3.0 Fase F: primeira auditoria final e hardening

**Status: AUDITORIA FINAL EM ANDAMENTO — NENHUMA CORREÇÃO IMPLEMENTADA**

Diagnóstico geral:
- checkpoint inicial `be9b9b8` confirmado em `main`, com working tree limpo e cinco commits
  locais à frente de `origin/main`;
- integração completa da Home, quatro modos, overlay final, compartilhamentos, Estatísticas,
  Histórico, persistência, acessibilidade e movimento reduzido passou na suíte permanente;
- nenhum problema funcional, regressão importante ou falha crítica de acessibilidade foi
  identificado na auditoria automatizada e estática;
- nenhuma alteração de produção foi realizada nesta primeira rodada da Fase F.

Áreas revalidadas:
- Home preserva estados 0/4–4/4, `JOGUE HOJE`, grade responsiva, resumo diário, Compartilhar
  Dia e seção Seu Timãodle com streak, recorde, Estatísticas e Histórico;
- Clássico preserva sorteio determinístico, autocomplete, oito atributos, setas, zero/null,
  vitória, resultado, compartilhamento, persistência, desktop de oito colunas e mobile sticky;
- Foto preserva dificuldade, progressão/contraste, seis tentativas, vitória/derrota, dots,
  lista, resultado estático/overlay, compartilhamento, F5, anti-spoiler e movimento reduzido;
- Mais ou Menos preserva snapshot, dez rodadas, plano 3/4/3, neutralidade inicial,
  feedback/empate, atraso funcional de 1500 ms, meta sete, resultados e reentrada;
- Onze Inicial preserva nove partidas com IDs únicos, onze titulares, três ocultos,
  coordenadas, busca, erros, 3/3, placar exato, countdown, compartilhamento, save e migração;
- Palmeiras 2011 preserva Paulo André como ZAG, Liedson como ATA, Wallace como VOL e Willian
  como ATA; Wallace continua Zagueiro no banco, como identidade geral distinta da função na
  partida;
- overlay final preserva GANHOU/PERDEU/CONCLUÍDO, continuidade com um a três modos, estados
  em andamento/não iniciado, 4/4, compartilhar, Home, fechar, Escape, backdrop, focus trap,
  retorno de foco e regra de não reabrir após F5;
- builders de compartilhamento e fallbacks permanecem cobertos para os quatro modos e o dia,
  com pluralização, feedback e anti-spoiler;
- Estatísticas preserva hierarquia global, zero real, estados sem amostra, quatro modos,
  details fechados, 21 categorias e scroll;
- Histórico preserva tracking, limites, semana iniciada na segunda, sete estados, legenda,
  hoje/seleção, detalhe, exactScore, streak histórico e allowlist segura;
- teclado do calendário preserva setas, Home/End, PageUp/PageDown, Enter, Espaço, foco
  separado da seleção e cruzamento de mês/ano;
- persistência preserva saves legados/atuais, F5, histórico integrado, trackingStartedAt,
  completionCelebrated, snapshot MM, lineup, progresso e streak;
- simulações de datas e contratos existentes preservam novo dia, escolha diária, histórico
  anterior, sequência, snapshots e ausência de overlays persistidos.

Dados e conteúdo:
- três JSONs válidos e inalterados;
- 157 jogadores, 157 nomes únicos, jogos numéricos/finitos e somente três assistências `null`
  historicamente justificadas: Lucca, Marinho e Uendel;
- 157 nomes no manifesto e 157 JPEGs físicos, cobertura 100%, sem entrada duplicada, slug em
  colisão, arquivo ausente/órfão ou conteúdo fotográfico duplicado;
- nove partidas com nove IDs únicos, onze titulares por partida e coordenadas numéricas;
- Paulo André, Willian, William e Wallace possuem registros e slugs únicos; `willian.jpg` e
  `william.jpg` permanecem distintos e coerentes com Willian Bigode e William Machado.

Acessibilidade, responsividade e robustez:
- contratos preservam dialogs, foco visível, touch targets, focus trap, retorno de foco,
  combobox/listbox, aria-current, aria-selected, aria-pressed, headings e feedback textual
  independente de cor;
- bloco único de `prefers-reduced-motion` continua impedindo confete/transições decorativas
  sem retirar feedback, mantendo o atraso funcional MM de 1500 ms;
- CSS balanceado, 168 IDs únicos e classes dinâmicas protegidas; nenhum seletor órfão ou
  override contraditório com impacto concreto foi encontrado;
- JavaScript sem erro sintático, referência literal a ID inexistente, controle DEV,
  `localStorage.clear()` ou resposta secreta em console; listeners/builders/timeouts revisados
  sem duplicação ou vazamento concreto identificado;
- conteúdo variável de interação usa leitura normalizada e/ou `textContent`; usos de
  `innerHTML` restantes são templates controlados ou dados locais confiáveis já cobertos;
- Estatísticas percorre apenas o histórico necessário, calendário renderiza somente um mês,
  details não cria listeners e nenhum problema concreto de performance foi observado.

Testado:
- `node tests/run-tests.js`: storage A–X, 39 cenários de regras e 180 datas MM, 118 cenários
  históricos, 13 de resultado final, cinco de movimento reduzido e 44 estruturais aprovados;
- `node tests/storage.test.js` e `node tests/history-calendar.test.js` aprovados isoladamente;
- `node --check script.js`, `node --check storage-normalizers.js` e `git diff --check`
  aprovados;
- smoke responsivo: **SKIP — ambiente incompatível**, pois Chrome/Edge headless continua
  indisponível pelo processo GPU;
- inspeção estática dos viewports e contratos concluída; navegação visual real nos viewports
  prioritários continua reservada à validação manual final.

Achados por prioridade:
- **P0:** nenhum;
- **P1:** nenhum;
- **P2:** nenhum;
- **P3:** documentação técnica histórica em `tests/frontend-contract.md` contém descrições
  anteriores à v3.0 — por exemplo, quatro colunas gerais nas Estatísticas e limites antigos
  do Onze Inicial; não afeta execução ou testes, deve ser sincronizada em uma tarefa curta
  antes do fechamento documental definitivo ou registrada para manutenção futura.

Pendências históricas não bloqueantes:
- smoke headless continua indisponível pelo processo GPU do ambiente;
- validação com leitor de tela real permanece recomendada, embora contratos de teclado/ARIA
  estejam aprovados;
- assistências de Lucca, Marinho e Uendel permanecem `null` pelas justificativas históricas
  já documentadas, sem relação com a v3.0;
- semântica histórica residual de `local_tag` permanece fora do escopo enquanto não houver
  definição formal;
- microdetalhes visuais antigos não foram promovidos a problema sem regressão observável.

Decisão provisória de release:
- **A — v3.0 PRONTA PARA FECHAMENTO**, condicionada somente à validação manual final nos
  viewports e fluxos prioritários; nenhum P0, P1 ou P2 exige correção;
- o P3 documental não bloqueia release e não autoriza mudança nesta auditoria.

Próximo passo:
- executar validação manual integrada em 412×600, 412×915 e 1440×900, percorrendo o fluxo
  Home → quatro modos → overlays → 4/4 → compartilhar → Estatísticas → Histórico;
- decidir em tarefa posterior se o P3 documental será corrigido antes do checkpoint final;
- não marcar a v3.0 como concluída nem iniciar v3.1 nesta etapa.

## 22/08/2026 — v3.0 Fase F.1: preparação da validação manual integrada final

**Status: CONCLUÍDA — VALIDAÇÃO MANUAL INTEGRADA FINAL APROVADA**

Estado aprovado:
- auditoria técnica da Fase F aprovada;
- decisão provisória mantida em **A — v3.0 PRONTA PARA FECHAMENTO**;
- nenhum P0, P1 ou P2 conhecido;
- P3 de descrições antigas em `tests/frontend-contract.md` aceito como backlog futuro não
  bloqueante e deliberadamente não corrigido nesta etapa;
- Fase F permanece em auditoria final e a v3.0 ainda não foi marcada como concluída.

Matriz manual prioritária:
- viewports obrigatórios: 412×600, 412×915 e 1440×900;
- verificação complementar rápida: 360×800, 480×900 e 1920×1080;
- fluxo principal: Home → concluir quatro modos usando a continuidade dos overlays → 4/4 →
  Home → Compartilhar Dia → Estatísticas → Histórico → reentrada nos modos concluídos;
- Home: 0/4, parcial, 4/4, visibilidade de `JOGUE HOJE`, grade, contexto diário, Seu Timãodle
  e Compartilhar Dia;
- Clássico: oito propriedades, setas, textos longos, sticky em 412×600, resultado, overlay,
  compartilhar, F5 e reentrada;
- Foto: fotografia dominante, dificuldade, blur/contraste, busca, progresso, dots, lista,
  vitória/derrota, ambos os compartilhamentos, F5 e reentrada;
- Mais ou Menos: ações neutras antes da escolha, feedback/empate, dez segmentos, meta,
  resultado, overlay, compartilhar, F5 e reentrada;
- Onze Inicial: contexto, placar, X/3, FALTAM, campo, linhas de quatro, nomes longos, busca,
  Fora/erros, 3/3, countdown, overlay, compartilhar, F5 e ausência de sobreposição;
- overlay: GANHOU, PERDEU, CONCLUÍDO, três/dois/um pendentes, 4/4, compartilhar, Home, fechar,
  Escape, backdrop, foco e scroll;
- Estatísticas: hierarquia geral, quatro modos, details fechados/abertos, distribuições,
  estado vazio, teclado e scroll mobile;
- Histórico: estados do calendário, legenda, hoje/seleção, detalhe, streak, navegação mensal,
  teclado e scroll mobile;
- teclado geral: Tab, Shift+Tab, Enter, Espaço e Escape; calendário também com setas,
  Home/End, PageUp/PageDown e seleção explícita;
- movimento reduzido: ausência de confete/transições decorativas, Foto funcional, feedback
  íntegro e atraso MM de 1500 ms;
- persistência: F5 durante jogo e após conclusão, reentrada, Home/Estatísticas/Histórico após
  recarga, resultado estático e compartilhamento disponíveis, overlay sem reabertura.

Critério de aprovação:
- nenhum P0 ou P1 novo;
- nenhum overflow ou sobreposição funcional;
- jornada 0/4–4/4, persistência, overlays, Estatísticas, Histórico e teclado básico funcionais;
- qualquer P2 deve ser avaliado individualmente; P3 não bloqueia.

Limitações aceitas:
- smoke headless indisponível pelo processo GPU;
- leitor de tela real não executado neste ambiente;
- P3 documental, três assistências historicamente desconhecidas e semântica residual de
  `local_tag` permanecem backlog não bloqueante;
- nenhum viewport foi declarado visualmente validado por automação ou inspeção estática.

Nesta preparação:
- nenhum arquivo de produção, teste, JSON ou contrato foi alterado;
- somente o roadmap recebeu o roteiro de validação;
- nenhum commit e nenhum push foram realizados.

Próximo passo:
- executar a matriz em navegador real e registrar aprovação ou, se houver problema, viewport,
  tela, reprodução, comportamento atual/esperado e prioridade antes de qualquer correção;
- encerrar Fase F e v3.0 somente após aprovação manual explícita.

## 22/08/2026 — Encerramento oficial da v3.0

**Status: v3.0 CONCLUÍDA — AUDITORIA TÉCNICA E VALIDAÇÃO MANUAL FINAL APROVADAS**

Fases concluídas:
- Fase A — fundação visual;
- Fase B — Home;
- Fase C — resultados finais e continuidade;
- Fase D — polimento dos quatro modos;
- Fase E — Estatísticas e Histórico;
- Fase F — validação final e hardening.

Estado final do produto:
- Home redesenhada e linguagem visual preto/branco/dourado consolidada;
- Clássico, Foto, Mais ou Menos e Onze Inicial refinados e responsivos;
- resultados finais, continuidade do dia, compartilhamento individual e Compartilhar Dia;
- persistência, F5/reentrada, saves compatíveis, histórico e estatísticas integradas;
- acessibilidade por teclado, dialogs, foco, retornos, autocompletes e movimento reduzido;
- suíte automatizada, auditoria técnica e validação manual integrada final aprovadas.

Qualidade final:
- P0: nenhum encontrado;
- P1: nenhum encontrado;
- P2: nenhum bloqueante permanece;
- P3 documental em `tests/frontend-contract.md` permanece backlog não bloqueante;
- smoke headless permanece SKIP por incompatibilidade do processo GPU no ambiente;
- validação futura com leitor de tela real permanece recomendação não bloqueante.

Backlog não bloqueante preservado:
- sincronizar descrições históricas residuais de `tests/frontend-contract.md`;
- reavaliar smoke headless quando houver ambiente compatível;
- executar validação futura com leitor de tela real;
- manter documentados os três dados históricos de assistências ainda desconhecidos;
- formalizar a semântica residual de `local_tag`, se necessário;
- avaliar microajustes cosméticos somente em versão futura com escopo próprio.

Decisão de release:
- **A — v3.0 PRONTA E OFICIALMENTE CONCLUÍDA**;
- nenhum item do backlog bloqueia a versão;
- não iniciar Fase G, v3.1 ou nova rodada de redesign neste encerramento.

## 02/09/2026 — Extração do runtime do modo Mais ou Menos

**Status: CONCLUÍDA**

Implementado:
- runtime, estado da sessão, renderização, respostas, transição de rodadas, resultado e
  compartilhamento do Mais ou Menos extraídos de `script.js` para `more-less-mode.js`;
- `script.js` mantido como orquestrador dos adapters de dados, storage, navegação, foto,
  progresso diário, confete e overlay final;
- carregamento do novo módulo incluído em `index.html` depois de `more-less-core.js` e antes
  de `script.js`;
- preservados algoritmo determinístico v1/v2, snapshots, migração de saves legados, dez
  rodadas, meta de sete acertos, empate, atraso funcional de 1,5 s, F5/reentrada e regra de
  abrir o overlay apenas na conclusão imediata;
- adicionada suíte unitária do runtime com 17 cenários;
- contratos de resultado final, movimento reduzido e estrutura atualizados para a nova
  fronteira modular;
- sincronização do histórico ao abrir o modo mantida por callback explícito, evitando
  reentrada recursiva no adapter de leitura identificada durante a validação em navegador.

Testado:
- `node --check script.js` e `node --check more-less-mode.js` aprovados;
- `node tests/run-tests.js` aprovado integralmente, incluindo storage A–X, testes dos módulos,
  39 cenários de regras com 180 datas MM, 118 cenários históricos, 13 de resultado final,
  cinco de movimento reduzido e 48 estruturais com 168 IDs;
- `git diff --check` aprovado, somente com avisos de normalização LF/CRLF;
- checklist em Chrome real aprovado para novo jogo, acerto, erro, bloqueio temporário,
  avanço único após aproximadamente 1,5 s, F5/reentrada, sequência e acertos preservados,
  dez rodadas, resultado estático, overlay, fechamento, recarga sem reabertura, compartilhar
  e regressão rápida de Foto, Clássico e Onze Inicial;
- viewport móvel 390×844 inspecionado com cards, botões e feedback visíveis, sem overflow
  horizontal no documento ou no `body`; nenhuma diferença visual intencional observada.

Pendências:
- nenhuma pendência automatizada conhecida desta extração;
- validação futura em outros navegadores permanece recomendada, mas não bloqueia o checkpoint.

Próximo passo:
- em tarefa própria, auditar e planejar a extração incremental do Onze Inicial, preservando
  seleção determinística, exatamente três ocultos, placar, campo, autocomplete e persistência.

## 02/09/2026 — Checkpoint 6G: core determinístico do Onze Inicial

**Status: CONCLUÍDO — SEM COMMIT**

Implementado:
- seleção determinística da partida diária e dos três slots ocultos extraída para
  `lineup-core.js`, com namespace browser `TimaodleLineupCore` e export CommonJS;
- preservadas byte a byte as seeds `${data}-onze` e
  `${data}-onze-slots-${partida.id}`;
- preservados `TimaodleCore.hashString`, o shuffle determinístico existente, a ordem original
  das partidas e dos titulares, IDs reais de partida, IDs `slot-${indice}`, oito jogadores
  visíveis, três ocultos e fallback `null` para coleção vazia;
- `script.js` mantém apenas factory/adapter do core e todo o runtime do Onze Inicial: fetch,
  placar, DOM, campo, coordenadas, autocomplete, palpites, save, migração, resultado,
  compartilhamento, overlay, countdown e listeners;
- `lineup-core.js` carregado após `more-less-mode.js` e antes de `script.js`;
- adicionado `tests/lineup-core.test.js` com 17 cenários diretos;
- teste diário deixou de compilar a seleção a partir do texto de `script.js` e passou a usar
  o módulo real, sem atualizar fixtures.

Auditoria do algoritmo real:
- partida: `hashString(dataStr + "-onze") % partidas.length`;
- slots: shuffle de `[0..titulares.length - 1]` com
  `hashString(dataStr + "-onze-slots-" + partida.id)`, seguido dos três primeiros índices;
- não existem retries ou fallback adicional; um `Set` decide ocultação, enquanto a projeção
  percorre os titulares na ordem original;
- o core não conhece storage; compatibilidade de saves e migração de `partidaId: null`
  permanecem inalteradas em `script.js` e `storage-normalizers.js`.

Testado:
- 17 cenários do novo core aprovados, incluindo seeds, cinco datas congeladas, três slots
  únicos/válidos, ordem, IDs, coordenadas, independência entre chamadas e não mutação;
- determinismo preservado com as mesmas 65 assertions em cinco datas;
- MM v2 preservado em 180 datas; estrutura preservada com 48 cenários e 168 IDs;
- fingerprint Git de `partidas.json` idêntico ao `HEAD` (`e36f92cdc5b9dca64a072c954a40d64b8fb06546`);
- checklist em Chrome real aprovado: partida diária, placar, 11 chips, três ocultos, oito
  visíveis, autocomplete, um acerto, um erro/Fora, F5/restauração e bootstrap dos outros modos;
- nenhuma mudança visual intencional; CSS, JSONs, fotos e módulos estabilizados fora do diff.

Pendências:
- nenhuma pendência automatizada ou manual conhecida deste checkpoint;
- extração do runtime do Onze Inicial permanece para checkpoint futuro separado.

Próximo passo:
- após aprovação final do 6G, planejar em tarefa própria o runtime do Onze Inicial sem ampliar
  o escopo deste checkpoint.

## 03/09/2026 — Checkpoint 6H: runtime do Onze Inicial

**Status: IMPLEMENTADO — AGUARDANDO COMMIT**

Implementado:
- runtime específico do Onze Inicial extraído de `script.js` para `lineup-mode.js`, com
  namespace browser `TimaodleLineupMode` e export CommonJS;
- estado, placar, campo, autocomplete específico, palpites, Fora, progresso, restauração,
  conclusão, resultado estático, sharing e listeners internos encapsulados no novo módulo;
- `script.js` preservado como orquestrador de fetch, normalização/storage, navegação, progresso
  diário, infraestrutura compartilhada de autocomplete/sharing, confete e overlay;
- `lineup-core.js` mantido como fonte única da partida diária e dos três slots ocultos;
- preservados save shape, chave `timaodle_escalacao_daily_state`, migração de `partidaId: null`,
  placar obrigatório, `exactScore`, 11/8/3, IDs de slots, F5/reentrada e Fora deduplicado;
- atraso funcional de 500 ms e ordem save → render/resultado → confete → callback externo do
  overlay preservados; reentrada concluída mantém resultado estático sem reabrir o overlay;
- countdown e intervalo global de um segundo permaneceram em `script.js`;
- caracterização migrada para o módulo real com 28 cenários e 85 assertions.

Testado:
- suíte automatizada completa aprovada, incluindo 17 cenários do Lineup Core, determinismo com
  65 assertions em cinco datas, MM em 180 datas, Storage A–X, Histórico 118, Resultado Final 13,
  Reduced Motion 5 e estrutura 48 cenários/168 IDs;
- verificações de sintaxe do novo módulo e do `script.js` aprovadas;
- nenhum CSS, JSON, foto, fixture, seed ou módulo estabilizado alterado.

Pendências:
- concluir checklist final no Chrome real antes do commit do checkpoint.

Próximo passo:
- validar o Checkpoint 6H no Chrome e, se aprovado, criar commit isolado em tarefa própria;
- não iniciar cleanup pós-modos antes dessa aprovação.

## 03/09/2026 — Checkpoint 6I: extração da History UI

**Status: IMPLEMENTADO — AGUARDANDO VALIDAÇÃO MANUAL E COMMIT**

Implementado:
- estado visual, calendário, limites, seleção, resumo diário, navegação mensal, roving tabindex,
  teclado e listeners específicos do Histórico extraídos de `script.js` para `history-ui.js`;
- novo módulo disponível como `globalThis.TimaodleHistoryUI` no navegador e `module.exports` no
  Node, carregado depois de `lineup-mode.js` e antes de `script.js`;
- `estadoHistoricoUI` encapsulado na factory `createHistoryUI`, com API pública pequena para
  inicialização, abertura, fechamento, renderização e leitura de estado;
- `script.js` preservado como composition root e owner da chave/versão do histórico, leitura,
  escrita, normalização, sincronização dos quatro saves, Home, Stats, resultado final e dialogs;
- APIs existentes de `core.js` e `history-stats.js` reutilizadas sem alteração ou duplicação;
- os 13 helpers substanciais de calendário deixaram de ser compilados do texto de `script.js` e
  passaram a ser testados diretamente pela API `calendar` do módulo real;
- `carregarHistorico` permanece como a única função relacionada ao Histórico extraída pelo
  `script-harness.js`, por pertencer ao storage transversal mantido no orquestrador;
- adicionado `tests/history-ui.test.js` com 10 cenários diretos para contratos Node/browser,
  factory, init idempotente, mês atual, grade, ARIA, roving tabindex, navegação, teclado, resumo,
  streak e adapters de dialog;
- `script.js` reduzido de 1.900 para 1.438 linhas; 495 linhas foram removidas e 33 linhas de
  integração foram adicionadas; `history-ui.js` possui 501 linhas.

Testado:
- `node tests/history-ui.test.js`: 10 cenários aprovados;
- `node tests/history-calendar.test.js`: 118 cenários aprovados usando o módulo real;
- suíte automatizada completa aprovada, incluindo Lineup Mode 28 cenários/85 assertions, Lineup
  Core 17, MM v2 em 180 datas, determinismo diário 65 assertions em cinco datas, Storage A–X,
  Resultado Final 13, Reduced Motion 5 e estrutura 48 cenários/168 IDs;
- todos os testes obrigatórios do checkpoint foram executados também isoladamente e aprovados;
- `node --check history-ui.js`, `script.js`, `history-stats.js`, `core.js` e
  `tests/history-ui.test.js` aprovados;
- `git diff --check` aprovado, somente com avisos de normalização LF/CRLF;
- `style.css`, HTML estrutural, JSONs, Core, HistoryStats, sharing, UI e módulos dos quatro modos
  permanecem fora do diff.

Pendências:
- executar checklist manual no Chrome real para Histórico, Home, Stats, smoke dos quatro modos,
  resultado e viewport móvel 390×844;
- criar commit isolado somente após aprovação manual explícita;
- nenhum push realizado.

Próximo passo:
- validar o Checkpoint 6I no Chrome e, se aprovado, criar commit isolado em tarefa própria;
- depois deste checkpoint, parar a modularização: não iniciar Stats UI, Final Result, Home,
  router ou cleanup geral.
