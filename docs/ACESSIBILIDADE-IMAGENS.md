# Acessibilidade EcoCiente (base atual da main)

Esta implementação é isolada: não modifica os módulos administrativos nem os endpoints. A proposta parte da main em 02/11/2026, não da PR antiga #4.

## Imagens que você pode substituir

Pasta: `public/acessibilidade/imagens/`

**Botões laterais**:
- `botao-acessibilidade.png`
- `botao-libras.png`

**Eko e balão**:
- `eko-animado.gif` (estado padrão)
- `eko-hover.png` (hover)
- `eko-balao.png` (imagem de fundo do balão)

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

Para Eko, use GIF e PNG com dimensões equivalentes e fundo transparente; recomendamos PNG/GIF com canvas 256 × 296 px. O balão pode ser PNG 620 × 316 px, transparente; texto permanece como HTML para manter legibilidade/idioma e frases variáveis. O GIF animado e imagem estática não são implementados por CSS: CSS faz somente a transição entre duas imagens.

## Como rodar

```powershell
cd C:\Users\juliomenezes-ieg\dad-crud
git fetch origin
git switch feat/acessibilidade-dad-atualizada
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
