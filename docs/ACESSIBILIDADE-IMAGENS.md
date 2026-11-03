# Acessibilidade EcoCiente (base atual da main)

Esta implementação é isolada: não modifica os módulos administrativos nem os endpoints. A proposta parte da main em 02/11/2026, não da PR antiga #4.

## Imagens que você pode substituir

Pasta: `public/acessibilidade/imagens/`

**Botões laterais**:
- `botao-acessibilidade.png`
- `botao-libras.png`

**Eko e balão**:
- `eko-animado.gif` (estado padrão)
- `eko-hover.png` (Eko parado, acenando ao passar o mouse)
- Balão de fala do Eko: construído em React/CSS, sem arquivo de imagem

**17 cards** (PNG transparente):
- `card-tradutor-libras.png`
- `card-tamanho-fonte.png`
- `card-estilo-texto.png`
- `card-letras-destacadas.png`
- `card-espaco-linhas.png`
- `card-espaco-letras.png`
- `card-leitor-sites.png`
- `card-mascara-leitura.png`
- `card-guia-leitura.png`
- `card-destacar-links.png`
- `card-lupa-conteudo.png`
- `card-destacar-cabecalhos.png`
- `card-esconder-imagens.png`
- `card-pausar-animacoes.png`
- `card-contraste.png`
- `card-saturacao.png`
- `card-modo-daltonico.png`

Cada componente usa `<img>` e, se a imagem PNG do card/botão não estiver presente, exibe o ícone SVG de reserva. Os SVGs são temporários, não a arte final.

Para Eko, use GIF e PNG com dimensões equivalentes e fundo transparente; recomendamos PNG/GIF com canvas 256 × 296 px. O balão motivacional é renderizado diretamente em HTML/CSS, com frases variáveis e uma seta visual. Não é necessário nem utilizado arquivo `eko-balao.png`. O GIF contém a animação original e o CSS faz a troca para a imagem parada ao passar o mouse ou focalizar o mascote.

**Marcador de teclado**: salve `eko_marcador.png` na mesma pasta `public/acessibilidade/imagens/`; o componente usa `import.meta.env.BASE_URL`, compatível com GitHub Pages.

**ZIP de artes do Eko**: os nomes originais `animacao_parado.gif`, `eko_acenando.png` e `eko_marcador.png` devem ser enviados ao repositório com os nomes finais `eko-animado.gif`, `eko-hover.png` e `eko_marcador.png`. Os 17 cards e dois botões de acessibilidade não são alterados por essa entrega.

## Como rodar

```powershell
cd C:\Users\juliomenezes-ieg\dad-crud
git fetch origin
git switch main
npm ci
npm run dev
```

Rodar `npm run build` e `npm run lint`. Checar o painel de acessibilidade em todas as rotas, contrastes, scroll, zoom e navegação por teclado. Não concluir conformidade WCAG só pelo plugin: executar testes manuais e com leitor de tela.

## Notas técnicas

- Preferências versionadas em localStorage.
- Componentes de Campo e Selecao recebem aria-invalid e aria-describedby para feedback de erro.
- VLibras é externo e opcional; exige conexão.
- Leitor de sites utiliza as vozes existentes no navegador.
- Filtros daltonismo são simulações, não correção clínica nem garantia WCAG.
- A PR #4 anterior continua sem merge; não juntá-la à nova branch.
