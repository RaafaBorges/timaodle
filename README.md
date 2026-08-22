# Timãodle

Um jogo diário para quem conhece o Corinthians dentro e fora de campo.

O Timãodle reúne quatro desafios sobre jogadores e partidas do clube, inspirados no ritmo dos jogos diários como Wordle, mas com identidade, progressão e mecânicas próprias. A cada dia, todos recebem os mesmos desafios e podem avançar de `0/4` até completar o Timãodle do dia.

**Versão atual:** v3.0

**Status:** estável, funcional e validada

**Jogar agora:** [raafaborges.github.io/timaodle](https://raafaborges.github.io/timaodle/)

> O Timãodle é um projeto independente feito por torcedores e não possui vínculo oficial com o Sport Club Corinthians Paulista.

## Visão geral

O dia é formado por quatro modos:

- **Clássico** — descubra um jogador comparando atributos;
- **Foto** — reconheça o jogador por uma imagem revelada progressivamente;
- **Mais ou Menos** — compare o número de jogos de dois jogadores pelo Corinthians;
- **Onze Inicial** — complete escalações de partidas históricas.

Os modos compartilham uma experiência integrada:

- desafio diário determinístico;
- progresso geral de `0/4` a `4/4`;
- persistência local;
- resultados e compartilhamentos anti-spoiler;
- Histórico, Estatísticas, sequência atual e recorde;
- linguagem visual em preto, branco e dourado.

## Modos de jogo

### Clássico

O objetivo é descobrir o jogador secreto do dia. Cada palpite compara:

- jogador;
- posição;
- nacionalidade;
- estreia;
- jogos;
- pé;
- títulos;
- gols;
- assistências.

As cores indicam acertos, correspondências parciais e diferenças. Nos valores comparáveis, setas mostram se a resposta correta é maior ou menor. O modo inclui autocomplete, persistência das tentativas e compartilhamento sem revelar o jogador.

### Foto

Uma fotografia começa mais difícil de identificar e se torna progressivamente mais clara a cada tentativa. O jogador tem até seis palpites, com indicação de dificuldade, controle de contraste/preto e branco, autocomplete e histórico das tentativas.

O modo possui estados próprios de vitória e derrota, restauração do progresso e compartilhamento anti-spoiler.

### Mais ou Menos

Em dez rodadas, o jogador compara dois atletas e decide se o próximo disputou **mais** ou **menos** jogos pelo Corinthians que a referência atual.

Cada escolha recebe feedback imediato. O objetivo é alcançar pelo menos sete acertos, e eventuais empates são tratados sem prejudicar injustamente a rodada. A sequência do dia é determinística, persistida localmente e compartilhável sem expor respostas.

### Onze Inicial

O desafio parte de uma partida histórica selecionada. Depois do palpite de placar, os onze titulares aparecem posicionados no campo, mas três jogadores ficam ocultos.

É preciso encontrar os três por busca e autocomplete. O modo registra acertos, palpites incorretos e placar exato, preserva o progresso e oferece resultado e compartilhamento próprios. A base atual contém uma seleção de nove partidas históricas.

## Experiência diária

A Home acompanha o estado de cada modo como **não iniciado**, **em andamento** ou **concluído**. Ao terminar um desafio, o resultado oferece acesso direto aos modos ainda pendentes; não é necessário voltar à Home para procurar o próximo.

Quando os quatro modos são concluídos:

- o progresso chega a `4/4`;
- o dia recebe um estado de conclusão próprio;
- a Home libera **Compartilhar Dia**;
- sequência, Histórico e Estatísticas passam a refletir o resultado consolidado.

Os overlays distinguem **GANHOU**, **PERDEU** e **CONCLUÍDO** conforme a mecânica de cada modo.

## Resultados e compartilhamento

Cada modo possui resultado e compartilhamento individual. Ao completar `4/4`, também é possível compartilhar um resumo do dia inteiro.

O compartilhamento usa a Web Share API quando disponível e recorre ao clipboard como fallback. Os textos são construídos para não incluir jogadores secretos, placares, sequências de respostas ou outros spoilers.

## Persistência

O Timãodle usa `localStorage` como arquitetura de persistência atual. Ficam salvos no próprio navegador:

- progresso e tentativas dos modos;
- resultados e conclusão diária;
- snapshots necessários dos desafios;
- Histórico;
- sequência e recorde;
- Estatísticas.

Não existe conta de usuário nem backend. Os dados pertencem ao navegador e dispositivo em que o jogo foi utilizado.

## Histórico

O Histórico organiza a jornada em um calendário mensal com navegação entre meses. Ele diferencia:

- dias sem registro;
- registros `0/4`;
- desafios iniciados;
- dias parciais de `1/4` a `3/4`;
- dias completos `4/4`;
- hoje e dia selecionado.

Ao selecionar uma data, o detalhe mostra o desempenho dos quatro modos e, quando aplicável, a sequência acumulada até aquele dia. Os resumos históricos usam uma lista segura de dados e não armazenam respostas secretas.

## Estatísticas

O resumo geral apresenta:

- sequência atual;
- recorde;
- dias `4/4` e taxa de conclusão;
- dias jogados;
- modos concluídos;
- vitórias.

Cada modo possui métricas coerentes com sua mecânica, como médias de tentativas, taxa de vitória, acertos e erros. Informações mais detalhadas e distribuições ficam em seções expansíveis, evitando uma parede de números na leitura inicial.

## Identidade visual

A interface usa preto, branco e dourado, com o dourado reservado a ações, progresso e conquistas. Bebas Neue aparece nos elementos de destaque e Inter no corpo e na interface.

O visual se inspira na identidade ligada ao Corinthians sem tentar reproduzir uma interface oficial. Desktop e mobile são tratados como experiências igualmente importantes.

## Responsividade

A v3.0 foi refinada e validada em diferentes tamanhos de desktop, tablet e mobile. O projeto inclui:

- Home em grade no desktop e coluna única no mobile;
- cabeçalhos sticky nos modos em que ajudam a navegação;
- modais adaptáveis e com scroll interno;
- calendário mensal utilizável em telas pequenas;
- campo, grids, autocompletes e resultados responsivos;
- proteções contra overflow horizontal.

## Acessibilidade

O projeto incorpora recursos de acessibilidade sem declarar certificação formal:

- navegação por teclado e foco visível;
- dialogs com título associado, focus trap, Escape e retorno de foco;
- comboboxes e listboxes nos autocompletes;
- estados como `aria-current`, `aria-selected` e `aria-pressed` quando aplicáveis;
- calendário navegável por setas, Home/End e PageUp/PageDown;
- áreas de toque dimensionadas para uso mobile;
- suporte a `prefers-reduced-motion`;
- textos e símbolos para que feedback importante não dependa somente de cor.

## Tecnologias

A aplicação é executada diretamente no navegador:

- HTML5;
- CSS3;
- JavaScript Vanilla;
- JSON;
- `localStorage`.

O projeto também usa fontes do Google Fonts, assets locais e a biblioteca client-side [`canvas-confetti`](https://github.com/catdad/canvas-confetti) para celebrações. Não há framework, backend, banco de dados ou build system na v3.0.

O uso de JavaScript Vanilla é intencional. A arquitetura poderá evoluir se a complexidade justificar, mas a versão atual não depende dessa mudança.

## Arquitetura

```text
timaodle/
├── index.html                  # aplicação e estrutura dos modos
├── style.css                   # identidade visual e responsividade
├── script.js                  # regras, interface e integração
├── storage-normalizers.js     # normalização defensiva dos saves
├── jogadores.json             # base de jogadores
├── partidas.json              # partidas do Onze Inicial
├── fotos-manifest.json        # controle das fotos disponíveis
├── fotos/                     # fotografias dos jogadores
├── assets/                    # escudo, favicons e imagem social
├── tests/                     # suíte automatizada e contratos
├── ROADMAP_TIMAODLE.md        # evolução e contexto do projeto
└── AGENTS.md                  # regras para agentes e contribuidores
```

A maior parte da lógica permanece centralizada em `script.js`. Essa estrutura simples é deliberada e não exige instalação de dependências para executar a aplicação.

## Base de dados

O estado atual inclui:

- **157 jogadores**;
- **157 fotografias**;
- **157 entradas** em `fotos-manifest.json`;
- **100% de cobertura fotográfica**;
- **9 partidas históricas** no Onze Inicial.

Os jogadores podem conter posição, nacionalidade, estreia, jogos, pé, títulos, gols e assistências. Os dados históricos são revisados e validados progressivamente; campos sem confirmação confiável podem permanecer explicitamente sem valor em vez de receber uma estimativa.

## Executando localmente

Não há etapa de build ou `npm install`. Como os JSONs são carregados com `fetch`, sirva a pasta por HTTP em vez de abrir `index.html` diretamente com `file://`.

Com Python instalado:

```bash
python -m http.server 8000
```

Depois, acesse [http://localhost:8000](http://localhost:8000).

Também é possível usar a extensão **Live Server** do VS Code ou outro servidor HTTP estático.

## Testes

Node.js é usado apenas para desenvolvimento e execução da suíte:

```bash
node tests/run-tests.js
node tests/storage.test.js
node tests/history-calendar.test.js
node --check script.js
node --check storage-normalizers.js
```

A cobertura atual inclui:

- storage e compatibilidade de saves;
- regras, progresso diário e geração determinística;
- Mais ou Menos simulado em 180 datas;
- Histórico, calendário, datas civis e teclado;
- resultados finais e anti-spoiler;
- movimento reduzido;
- contratos estruturais, acessibilidade e IDs.

Na validação final da v3.0, passaram 39 cenários de regras, 118 cenários históricos, 13 cenários de resultado, 5 de movimento reduzido e 44 cenários estruturais, com 168 IDs únicos.

O smoke responsivo opcional pode ser tentado com:

```bash
node tests/viewport-smoke.js
```

Ele depende de um Chrome ou Edge headless compatível com o ambiente.

## Desenvolvimento e contribuição

Antes de uma mudança relevante, leia:

- [`AGENTS.md`](AGENTS.md), com as regras permanentes de preservação e validação;
- [`ROADMAP_TIMAODLE.md`](ROADMAP_TIMAODLE.md), com o contexto e o histórico de evolução.

O código atual é a fonte de verdade. Mudanças devem ser pequenas, verificáveis e preservar os quatro modos, os dados históricos e a compatibilidade com saves existentes.

## Estado atual

A **v3.0 está concluída**, com:

- linguagem visual consolidada;
- Home integrada à jornada diária;
- quatro modos refinados;
- resultados finais e continuidade entre modos;
- compartilhamentos individuais e Compartilhar Dia;
- persistência, Histórico e Estatísticas;
- acessibilidade e movimento reduzido;
- responsividade em mobile e desktop;
- suíte automatizada e validação manual final.

Prioridades futuras podem incluir expansão editorial da base, novas partidas, manutenção, hardening e melhorias incrementais de experiência. Não há promessa de prazo ou funcionalidade específica.

## Cuidados anti-spoiler

O projeto evita incluir respostas nos compartilhamentos, não registra respostas secretas em logs de produção, mantém o Histórico em resumos seguros e trata dados persistidos defensivamente. Isso descreve cuidados do jogo, não uma certificação ampla de segurança.

## Links

- [Jogar Timãodle](https://raafaborges.github.io/timaodle/)
- [Contato](https://raafaborges.github.io/timaodle/contato.html)

## Licença

O repositório não possui atualmente um arquivo `LICENSE` nem declara uma licença open source. Consulte o responsável antes de reutilizar ou redistribuir o código.

## Aviso legal

Timãodle é um projeto independente feito por torcedores. Não é um produto oficial do Sport Club Corinthians Paulista.

Marcas, nomes, escudos e demais elementos relacionados pertencem aos seus respectivos titulares.
