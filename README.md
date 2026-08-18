# 🖤🤍 Timãodle

Jogo diário de adivinhar jogadores do Corinthians, no estilo Wordle. Um desafio novo por dia, igual pra todo mundo — chute um jogador e veja o que bate (posição, nacionalidade, ano de estreia, pé, títulos, gols e assistências) com o jogador secreto do dia.

> ⚠️ Projeto de fã, feito por um torcedor. Sem vínculo oficial com o Sport Club Corinthians Paulista.

**🔗 Jogar agora:** [raafaborges.github.io/timaodle](https://raafaborges.github.io/timaodle/)

---

## Sobre o projeto

O Timãodle é um jogo 100% estático — sem servidor, sem banco de dados, sem coleta de dados pessoais. Tudo roda direto no navegador.

**Como jogar:** a cada tentativa, cada atributo do jogador chutado é comparado com o jogador secreto do dia:
- 🟩 **Verde** — atributo correto
- 🟨 **Amarelo** — correspondência parcial (ex: mesmo título em comum)
- 🟥 **Vermelho** — incorreto (com setas ↑/↓ indicando se o número certo é maior ou menor, quando aplicável)

O jogador do dia é sorteado automaticamente a partir da data (usada como semente), então é sempre o mesmo desafio pra todo mundo, no mesmo dia — sem precisar de servidor pra sincronizar isso.

## Funcionalidades

- 🗓️ **Modo Diário** — um desafio por dia, sincronizado pela data local
- 💾 **Progresso salvo localmente** — feche o navegador e volte depois, sua partida do dia continua de onde parou (`localStorage`)
- 📤 **Compartilhar resultado** — gera um resuminho com emojis (🟩🟨🟥) pra postar sem spoiler, tipo Wordle
- 👋 **Boas-vindas personalizadas** — pede seu nome/apelido na primeira visita
- 📖 **Links úteis** — indica o [Meu Timão](https://www.meutimao.com.br/) pra quem quer se aprofundar na história do clube
- 📄 Páginas de Contato, Política de Privacidade, Cookies e Termos de Uso

## Tecnologias

- HTML5, CSS3 e JavaScript puro (vanilla) — sem frameworks, sem build step
- [canvas-confetti](https://github.com/catdad/canvas-confetti) para a animação de vitória
- Dados dos jogadores em `jogadores.json`, catalogados manualmente a partir de fontes públicas (Transfermarkt e outras)

## Rodando localmente

Como o jogo carrega os dados via `fetch('jogadores.json')`, **não dá pra abrir o `index.html` direto com duplo clique** (bloqueio de CORS do navegador para arquivos locais). É preciso servir os arquivos por um servidor local simples:

```bash
# Com Python instalado, na pasta do projeto:
python3 -m http.server 8000
```

Depois é só acessar `http://localhost:8000` no navegador.

Alternativamente, use a extensão **Live Server** do VSCode, ou qualquer servidor estático de sua preferência.

## Estrutura do projeto

```
├── index.html          # página principal do jogo
├── style.css            # estilos (tema preto/branco/dourado)
├── script.js             # lógica do jogo, modo diário, persistência
├── jogadores.json       # base de dados dos jogadores
├── assets/               # escudo, favicons, imagem de compartilhamento
├── contato.html          # formulário de contato
├── privacidade.html      # política de privacidade
├── cookies.html          # política de cookies
└── termos.html           # termos de uso
```

## Roadmap

- [ ] Modo Infinito (sem depender da data)
- [ ] Modo Duelo
- [ ] Filtro por época (anos 90, 2000s, etc.)
- [ ] Mais jogadores no banco de dados (cobrindo todos os títulos desde 1960)

## Licença

Sem licença definida — todos os direitos reservados. O código está aberto pra visualização, mas não está liberado para reuso/redistribuição sem autorização.

## Contato

Sugestões, correções ou bugs? Use o [formulário de contato](https://raafaborges.github.io/timaodle/contato.html) do site.
