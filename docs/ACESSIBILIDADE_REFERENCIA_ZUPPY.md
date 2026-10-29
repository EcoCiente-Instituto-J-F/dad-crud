# Painel de acessibilidade - referencia Zuppy

O novo painel segue o layout do ZIP enviado, adaptado para a paleta EcoCiente. Ele mantém os 17 cartões distribuídos por Libras, Controle de fonte, Navegação e leitura e Controle de cor.

Os dois botões laterais são empilhados e se expandem lateralmente no hover/foco. A janela tem cabeçalho verde, cards em duas colunas, rolagem e arraste pelo cabeçalho.

## Imagens substituíveis

- `public/acessibilidade/icones/*.svg`: todos os 17 cards e os dois atalhos retráteis. Substituir por SVG/PNG mantendo o mesmo nome e extensão, ou ajustar a extensão no componente.
- `public/acessibilidade/eko/eko-animado.gif`: mascote no estado normal.
- `public/acessibilidade/eko/eko-hover.png`: mascote estático no hover.
- `public/acessibilidade/eko/balao.svg`: imagem do balão de fala; o texto fica sobreposto para variar as frases.

Os arquivos de GIF e PNG do Eko são entregues separadamente no pacote de assets ZIP. Enquanto eles não forem adicionados ao repositório, o componente usa `/eko-mascote.svg` como reserva para ambos os estados. Esse fallback é apenas provisório.

## Recursos

1. Tradutor VLibras
2. Tamanho da fonte
3. Estilo de texto
4. Letras destacadas
5. Espaço entre linhas
6. Espaço entre letras
7. Leitor de sites
8. Máscara de leitura
9. Guia de leitura
10. Destacar links
11. Lupa de conteúdo
12. Destacar cabeçalhos
13. Esconder imagens decorativas
14. Pausar animações
15. Contraste de cor
16. Saturação
17. Modo daltônico (simulação visual)

O modo daltônico é apenas simulação, e não comprova acessibilidade WCAG. A leitura por voz depende do navegador; VLibras depende de conexão com serviço externo.

## Testes

- Executar `npm ci && npm run build && npm run lint && npm run dev`.
- Inspecionar os botões sobrepostos à borda direita.
- Testar hover/foco dos dois atalhos, abertura/fechamento, rolagem e arraste do painel.
- Testar as 17 ações (ciclagem de três níveis quando cabível), atualizar a página e verificar persistência.
- Verificar Eko com GIF parado, transição no hover, desaparecimento do balão ao sair o mouse, arraste e teclado.
- Validar contrastes, reflow e leitores de tela antes do merge.

Nenhuma alteração feita na API, banco ou módulos CRUD.