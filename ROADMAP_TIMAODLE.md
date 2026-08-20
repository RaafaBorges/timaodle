# TIMÃODLE --- ROADMAP E CONTEXTO DO PROJETO

**Versão do documento:** 1.6\
**Data:** 19/08/2026\
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
-   Jogadores com foto: aproximadamente 120.
-   Aproximadamente 36 jogadores ainda não possuem foto.

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
-   [ ] Completar fotos necessárias
-   [x] Revisar balanceamento das comparações

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
-   [ ] Validar fotos quebradas
-   [ ] Padronizar nomes de arquivos

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
[ ] Estatísticas gerais
[ ] Sequência de vitórias
[ ] Melhor sequência
[ ] Taxa de acerto
[ ] Histórico
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

## 🎯 VALIDAR O MAIS OU MENOS V2 EM NAVEGADORES REAIS

Próximos itens:

1.  Testar manualmente as 10 rodadas, F5 e conclusão em navegadores desktop e mobile reais.
2.  Conferir a cobertura e a qualidade das fotos usadas pelo modo.
3.  Avaliar compartilhamento para o resultado final em uma etapa futura.
4.  Monitorar a dificuldade percebida antes de alterar a meta de 7 acertos.
5.  Manter pendente a validação histórica das quatro partidas `4-2-3-1` do Onze Inicial.

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
