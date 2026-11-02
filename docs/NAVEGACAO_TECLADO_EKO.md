# Navegacao por teclado e marcador Eko

Implementacao na PR #8 de acessibilidade. Nao altera regras de negocio ou APIs.

## Atalhos
- Ctrl+A: tenta alternar o painel de acessibilidade.
- Ctrl+L: tenta abrir o VLibras.
- Ctrl+P: tenta focar a pesquisa se presente na tela.
- Shift+A, Shift+L, Shift+P: alternativas recomendadas.

Observacao: Ctrl+A, Ctrl+L e Ctrl+P sao atalhos nativos de muitos navegadores. Mesmo com keydown implementado, o navegador pode interceptar antes do site; use Shift+A/L/P ou os botoes do painel como caminho acessivel. Em campos de formulario os atalhos nao sao interceptados.

## Marcador
Arquivo: public/acessibilidade/imagens/eko_marcador.png

Use PNG transparente, quadrado, recomendado 128x128px. O marcador e apenas decorativo, acompanha o elemento focado ao navegar por Tab, Shift+Tab e setas, com borda #D0D2AD; desaparece ao usar ponteiro. Quando a imagem estiver ausente, ha fallback de imagem Eko SVG.

## Limitacoes
- Navegacao por teclado depende de componentes semanticamente focaveis.
- O marcador acompanha foco de botoes, links, inputs, selects, textarea e elementos focaveis. Nao implementa selecao de palavras individuais como leitor de texto; a figura do exemplo foi adaptada para destacar controles.
- Filtros de cor, VLibras e TTS precisam de validacao manual em navegador. Nao afirmar conformidade WCAG sem auditoria.
