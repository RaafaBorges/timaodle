# AGENTS.md --- Timãodle

## 1. Objetivo

Este arquivo contém instruções permanentes para qualquer agente de IA
que trabalhe no projeto **Timãodle**.

Antes de alterar qualquer arquivo, leia:

1.  `AGENTS.md`
2.  `ROADMAP_TIMAODLE.md`
3.  Os arquivos envolvidos na tarefa atual

O código atual é sempre a fonte de verdade. Se houver divergência entre
o roadmap e o código, analise o código, confirme o comportamento real e
atualize o roadmap.

------------------------------------------------------------------------

## 2. Sobre o projeto

O **Timãodle** é um jogo de desafios sobre o Corinthians inspirado em
jogos diários como Wordle.

Tecnologias atuais:

-   HTML
-   CSS
-   JavaScript puro
-   JSON
-   Imagens locais
-   `localStorage` para persistência

Não introduza frameworks, backend, banco de dados, bibliotecas ou
dependências externas sem uma decisão explícita do responsável pelo
projeto.

------------------------------------------------------------------------

## 3. Modos atuais

O projeto possui quatro modos principais:

-   **Diário**
-   **Foto**
-   **Mais ou Menos**
-   **Onze Inicial**

Ao modificar um modo, preserve o funcionamento dos outros.

Sempre verifique o `ROADMAP_TIMAODLE.md` para conhecer o estado mais
recente de cada modo.

------------------------------------------------------------------------

## 4. Regra de trabalho

Trabalhe de forma incremental.

Antes de implementar:

1.  Leia o roadmap.
2.  Localize a implementação atual.
3.  Entenda como a funcionalidade funciona.
4.  Identifique dependências com outros modos.
5.  Faça a menor alteração necessária para atingir o objetivo.

Não reescreva grandes partes do projeto apenas por preferência
arquitetural.

Não faça refatorações não solicitadas durante uma tarefa funcional.

------------------------------------------------------------------------

## 5. Preservação do projeto

### Não fazer

-   Não reescrever o projeto do zero.
-   Não remover funcionalidades existentes sem autorização.
-   Não alterar mecânicas que não fazem parte da tarefa.
-   Não trocar tecnologias sem autorização.
-   Não adicionar dependências externas desnecessárias.
-   Não alterar dados históricos sem validação.
-   Não apagar progresso salvo sem necessidade.
-   Não quebrar compatibilidade com `localStorage` existente sem
    documentar uma migração.
-   Não alterar IDs/classes usados pelo JavaScript sem verificar todas
    as referências.
-   Não modificar outros modos apenas para "limpar" código.
-   Não deixar código de teste ou debug na versão final.

### Fazer

-   Preservar funcionalidades existentes.
-   Fazer alterações pequenas e verificáveis.
-   Reutilizar padrões já existentes no projeto quando forem adequados.
-   Validar dados antes de utilizá-los.
-   Manter o projeto simples.
-   Priorizar experiência do usuário.
-   Considerar desktop e mobile.
-   Atualizar o roadmap após implementações relevantes.

------------------------------------------------------------------------

## 6. Identidade visual

A identidade principal do Timãodle é:

-   **Preto**
-   **Branco**
-   **Dourado**

O visual deve transmitir uma identidade forte relacionada ao Corinthians
sem sacrificar legibilidade.

### Dourado

Utilizar principalmente para:

-   ações importantes;
-   progresso;
-   números importantes;
-   destaques;
-   estados ativos;
-   bordas especiais;
-   pequenos detalhes visuais.

Evitar transformar grandes áreas da interface em dourado.

### Branco

Utilizar principalmente para:

-   textos principais;
-   nomes;
-   informações de alta prioridade;
-   elementos que precisam de forte contraste.

### Preto / tons escuros

Utilizar para:

-   fundo;
-   cards;
-   painéis;
-   campos;
-   áreas secundárias.

------------------------------------------------------------------------

## 7. Tipografia e legibilidade

Legibilidade é prioridade.

Evitar:

-   textos excessivamente pequenos;
-   cinza com pouco contraste;
-   fontes finas em informações importantes;
-   grandes blocos de texto em caixa alta;
-   informações essenciais escondidas visualmente.

Preferir:

-   títulos grandes;
-   nomes de jogadores bem legíveis;
-   placares grandes;
-   números importantes em destaque;
-   `font-weight` bold ou semibold em informações importantes;
-   espaçamento adequado;
-   hierarquia visual clara.

Sempre revisar o resultado em telas menores.

------------------------------------------------------------------------

## 8. Scrollbars

As scrollbars devem respeitar a identidade visual.

Preferência:

-   trilho preto/escuro;
-   indicador dourado;
-   hover ligeiramente mais destacado;
-   aparência discreta;
-   compatibilidade com navegadores modernos quando possível.

Não criar uma scrollbar visualmente desconectada da paleta.

Quando possível, a scrollbar principal deve permanecer na extremidade da
janela e não parecer presa ao container central da aplicação.

------------------------------------------------------------------------

## 9. Responsividade

Toda mudança visual deve considerar:

### Desktop

-   alinhamento;
-   largura máxima;
-   espaços;
-   legibilidade;
-   proporções.

### Mobile

-   textos não podem ficar pequenos demais;
-   botões devem ser confortáveis para toque;
-   nomes longos não podem destruir o layout;
-   autocomplete deve permanecer utilizável;
-   cards não devem ultrapassar a tela;
-   campos esportivos devem continuar compreensíveis;
-   resultados devem permanecer legíveis.

Não considerar uma tarefa visual concluída sem revisar comportamento
responsivo.

------------------------------------------------------------------------

## 10. Persistência

O projeto utiliza `localStorage`.

Modos diários devem, quando aplicável:

-   sobreviver ao F5;
-   sobreviver ao fechamento e reabertura do navegador;
-   restaurar progresso;
-   restaurar estado visual;
-   reconhecer desafios já concluídos;
-   impedir reinício acidental;
-   manter estatísticas corretamente.

Antes de alterar chaves existentes de `localStorage`, procure todas as
referências.

Evite renomear chaves sem necessidade.

------------------------------------------------------------------------

## 11. Dados

Arquivos principais:

-   `jogadores.json`
-   `partidas.json`
-   `fotos-manifest.json`

### jogadores.json

Pode conter dados como:

-   nome;
-   posição;
-   nacionalidade;
-   estreia;
-   jogos;
-   pé;
-   títulos;
-   gols;
-   assistências.

Não assumir que todos os jogadores possuem foto.

### partidas.json

Utilizado principalmente pelo Onze Inicial.

Validar:

-   times;
-   competição;
-   placar;
-   formação;
-   titulares;
-   posições/coordenadas.

### fotos-manifest.json

É a fonte de controle das fotos disponíveis.

Não substituir o manifesto por uma lista gigante dentro do JavaScript.

------------------------------------------------------------------------

## 12. Modo Onze Inicial

O Onze Inicial é um desafio baseado em partidas históricas.

Fluxo desejado:

1.  Exibir partida.
2.  Usuário palpita o placar.
3.  Resultado real é revelado.
4.  Escalação é exibida.
5.  Parte dos titulares funciona como pista.
6.  **3 jogadores ficam ocultos.**
7.  Usuário tenta descobrir os 3.
8.  Acertos revelam jogadores no campo.
9.  O progresso deve ser salvo.
10. Ao concluir, mostrar resumo/resultado.
11. Permitir compartilhar.

### Regra atual importante

Por enquanto, devem existir apenas:

**3 jogadores ocultos.**

Não aumentar para 5 ou 11 sem decisão explícita.

O objetivo atual é manter o desafio acessível e saudável.

------------------------------------------------------------------------

## 13. Modo Mais ou Menos

O modo compara jogadores principalmente pelo número de jogos pelo
Corinthians.

Campo atual:

`jogos`

Estrutura geral:

-   jogador de referência;
-   próximo jogador;
-   usuário escolhe MAIS ou MENOS;
-   sequência de rodadas;
-   resultado final.

O modo depende de fotos para a apresentação atual.

Não assumir que todos os jogadores do JSON estão disponíveis para esse
modo.

------------------------------------------------------------------------

## 14. Modo Foto

O modo utiliza jogadores com imagens disponíveis.

Preservar:

-   progressão da imagem;
-   tentativas;
-   autocomplete;
-   persistência;
-   resultado;
-   escolha diária determinística.

Não incluir automaticamente jogadores sem foto.

------------------------------------------------------------------------

## 15. Modo Diário

É um dos modos mais maduros do projeto.

Evitar alterações desnecessárias nele ao trabalhar em outros modos.

Preservar:

-   escolha diária determinística;
-   comparação de atributos;
-   tentativas;
-   feedback visual;
-   persistência;
-   estatísticas;
-   compartilhamento;
-   contador;
-   jogador anterior.

------------------------------------------------------------------------

## 16. JavaScript

O projeto atualmente concentra grande parte da lógica em `script.js`.

Isso é conhecido.

**Não realizar uma grande refatoração agora.**

A separação futura poderá usar algo semelhante a:

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

Essa refatoração só deve acontecer quando estiver prevista no roadmap ou
for explicitamente solicitada.

### Após alterar JavaScript

Executar, quando o ambiente permitir:

``` bash
node --check script.js
```

Além disso:

-   procurar referências quebradas;
-   revisar console;
-   verificar funções chamadas;
-   verificar IDs/classes utilizados;
-   verificar restauração do `localStorage`.

------------------------------------------------------------------------

## 17. CSS

Ao alterar CSS:

-   prefira reutilizar variáveis/padrões existentes;
-   preserve a paleta;
-   evite regras globais agressivas;
-   verifique especificidade;
-   evite `!important` sem necessidade;
-   verifique desktop;
-   verifique mobile;
-   mantenha contraste adequado.

Não resolver um problema local quebrando estilos de outros modos.

------------------------------------------------------------------------

## 18. HTML

Ao alterar HTML:

-   preserve IDs usados pelo JavaScript;
-   preserve acessibilidade básica;
-   use elementos semânticos quando possível;
-   mantenha botões identificáveis;
-   não duplicar IDs;
-   não remover elementos sem verificar referências no JS/CSS.

------------------------------------------------------------------------

## 19. Testes mínimos obrigatórios

Depois de uma implementação, verificar o que for aplicável:

-   [ ] Projeto abre normalmente
-   [ ] Console sem novos erros
-   [ ] JavaScript passa em verificação de sintaxe
-   [ ] Modo alterado funciona
-   [ ] Outros modos continuam acessíveis
-   [ ] F5 não quebra o estado
-   [ ] `localStorage` continua funcionando
-   [ ] Desktop considerado
-   [ ] Mobile considerado
-   [ ] Nomes longos considerados
-   [ ] Autocomplete considerado
-   [ ] Resultado/conclusão considerado
-   [ ] ROADMAP atualizado

Se algum teste não puder ser executado no ambiente atual, registrar isso
claramente no roadmap ou no relatório final. Não afirmar que algo foi
testado se não foi.

------------------------------------------------------------------------

## 20. ROADMAP_TIMAODLE.md

O roadmap é obrigatório.

Depois de cada etapa relevante:

1.  Marcar checkboxes concluídos.
2.  Atualizar o estado do modo.
3.  Registrar mudanças no histórico.
4.  Registrar bugs encontrados.
5.  Registrar pendências.
6.  Atualizar a próxima tarefa recomendada.

Não apagar histórico antigo sem motivo.

------------------------------------------------------------------------

## 21. Histórico

Cada implementação relevante deve receber uma entrada semelhante a:

``` text
## DD/MM/AAAA — Nome da implementação

Implementado:
- item;
- item;
- item.

Testado:
- item;
- item.

Pendências:
- item.

Próximo passo:
- tarefa recomendada.
```

------------------------------------------------------------------------

## 22. Checklist de encerramento para o agente

Antes de informar que terminou:

### Implementação

-   [ ] A solicitação foi realmente implementada
-   [ ] Não foram feitas alterações desnecessárias
-   [ ] Funcionalidades anteriores foram preservadas

### Código

-   [ ] JavaScript validado
-   [ ] IDs/classes conferidos
-   [ ] Console revisado quando possível

### Interface

-   [ ] Paleta preto/branco/dourado preservada
-   [ ] Legibilidade revisada
-   [ ] Desktop considerado
-   [ ] Mobile considerado

### Estado

-   [ ] Persistência revisada quando relevante
-   [ ] F5 considerado
-   [ ] Resultado final considerado

### Documentação

-   [ ] `ROADMAP_TIMAODLE.md` atualizado
-   [ ] Histórico atualizado
-   [ ] Próximo passo registrado

------------------------------------------------------------------------

## 23. Formato da resposta ao terminar uma tarefa

Ao concluir uma implementação, responder de forma objetiva:

### Implementado

-   mudanças realizadas.

### Testado

-   testes realmente executados.

### Pendências

-   problemas ou itens que ainda faltam.

### Roadmap

-   confirmar que `ROADMAP_TIMAODLE.md` foi atualizado.

### Próximo passo

-   recomendar a próxima tarefa lógica.

Nunca afirmar que um teste foi realizado se ele não foi executado.

------------------------------------------------------------------------

## 24. Prioridade geral

A filosofia do projeto é:

> **Primeiro deixar os modos existentes excelentes. Depois adicionar
> novos modos.**

Priorizar:

1.  estabilidade;
2.  experiência do usuário;
3.  legibilidade;
4.  consistência;
5.  responsividade;
6.  conteúdo;
7.  novas funcionalidades;
8.  refatorações maiores.

------------------------------------------------------------------------

## 25. Instrução final para qualquer nova IA

Ao receber este projeto pela primeira vez:

1.  Leia este `AGENTS.md`.
2.  Leia `ROADMAP_TIMAODLE.md`.
3.  Analise o código real.
4.  Identifique a próxima tarefa.
5.  Se a solicitação estiver clara, implemente sem recomeçar o projeto.
6.  Teste tudo que o ambiente permitir.
7.  Atualize o roadmap.
8.  Informe exatamente o que mudou.

**O código real tem prioridade sobre documentação desatualizada.**
