# Checklist visual rápido — v2.7

Abra o projeto pelo Live Server e repita nos viewports: **360, 390, 412, 430,
480, 768 e desktop amplo**. Faça também uma passagem em **412 × 600**.

Em cada largura:

- [ ] `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] Header centralizado; logo e ajuda acessíveis.
- [ ] Footer não sobrepõe conteúdo; scroll permanece utilizável.
- [ ] Home 0/4, parcial e 4/4: modos aparecem cedo; grade 2×2 no desktop e uma coluna no mobile.
- [ ] Home com streak 0 e positivo: "Seu Timãodle" não compete com o progresso diário.
- [ ] Estatísticas, Histórico e Compartilhar Dia: posições, foco, abertura e estados corretos.
- [ ] Home 4/4: `Jogue Hoje` ausente sem espaço residual; resumo, compartilhar, contexto e `Seu Timãodle` preservados.
- [ ] Novo dia incompleto após 4/4: `Jogue Hoje` volta a aparecer com os quatro modos.
- [ ] Overlay final nos quatro modos: resultado, métrica, Compartilhar, Home, Fechar e foco visíveis.
- [ ] Continuidade: somente modos pendentes, estados corretos e navegação direta sem spoilers.
- [ ] Overlay em 4/4: `Timãodle do dia completo`, 4/4 e nenhuma lista pendente.
- [ ] F5 após conclusão: resultado estático restaurado e overlay não reaberto.
- [ ] Clássico: busca/autocomplete; uma e várias tentativas; textos e títulos legíveis.
- [ ] Foto: imagem, tutorial, autocomplete e lista de tentativas.
- [ ] Mais ou Menos: rodada, botões, overlay e resultado final.
- [ ] Onze Inicial: placar, campo, linha densa, busca e conclusão.
- [ ] Modais Como Jogar, Estatísticas e Foto: fechar, Escape, Tab e scroll interno.
- [ ] Nomes longos não escapam nem ficam cortados de forma incompreensível.
- [ ] Viewport baixo: teclado/scroll não escondem ação ou botão de fechar.
- [ ] Foco visível nos controles principais.

Registre navegador, viewport, tela/estado e screenshot de qualquer divergência.
