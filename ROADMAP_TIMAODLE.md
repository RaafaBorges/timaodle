# TIMÃODLE --- ROADMAP E CONTEXTO DO PROJETO

**Versão do documento:** 1.1\
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

## Estado: 🟢 FUNCIONAL / POLIMENTO PENDENTE

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
-   [ ] Polimento visual seguindo a identidade do Timãodle
-   [ ] Melhorar feedback de acerto/erro
-   [ ] Revisar seleção dos jogadores
-   [ ] Completar fotos necessárias
-   [ ] Revisar balanceamento das comparações

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
-   [ ] Contador para próximo desafio
-   [x] Melhorar feedback do palpite
-   [x] Melhorar campo
-   [ ] Melhorar posições dos jogadores
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
-   [ ] Garantir titulares completos
-   [ ] Garantir posições
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
  Onze Inicial    ❌ / incompleta

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
[ ] Persistência
[ ] Estado da partida
[ ] Palpite do placar
[ ] Descoberta de jogadores
[ ] Recuperação após F5
[ ] Finalização
[ ] Resultado
[ ] Compartilhamento
[ ] Contador diário
```

------------------------------------------------------------------------

## FASE 2 --- POLIMENTO DO MAIS OU MENOS

``` text
[ ] Visual
[ ] Feedback
[ ] Animações
[ ] Balanceamento
[ ] Seleção de jogadores
[ ] Fotos
[ ] Resultado final
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
-   [ ] Persistência completa do Onze Inicial
-   [ ] Expansão de partidas
-   [ ] Completar fotos

### 🔴 Ainda não iniciado

-   [ ] Novos modos
-   [ ] Refatoração completa
-   [ ] Sistema avançado de estatísticas
-   [ ] Recursos online/backend

------------------------------------------------------------------------

# 17. PRÓXIMA TAREFA OFICIAL

## 🎯 FINALIZAR A PERSISTÊNCIA DO ONZE INICIAL

Antes de adicionar novas mecânicas, garantir que:

1.  A partida diária seja determinada corretamente.
2.  O palpite do placar seja salvo.
3.  O progresso dos jogadores seja salvo.
4.  F5 não reinicie o jogo.
5.  Fechar e abrir o navegador preserve o progresso.
6.  O resultado seja salvo.
7.  O jogo reconheça quando já foi concluído.
8.  O estado visual seja reconstruído corretamente.

Após isso:

**→ polir visualmente o Onze Inicial**

Depois:

**→ polir o Mais ou Menos**

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
- [ ] Adicionar contador para o próximo desafio ao resultado do Onze Inicial.
- [ ] Revisar posições dos jogadores no campo nas 9 partidas atuais.
- [ ] Depois, voltar ao polimento do Mais ou Menos.
