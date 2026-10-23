# EcoCiente — login e cadastro

Primeira etapa do frontend acadêmico, criada com `create-vite --template react-ts`. Layout inspirado nas duas referências fornecidas; o fundo usa gradientes e a marca é tipográfica, não é uma reprodução exata da arte original.

## Executar no Windows / PowerShell

Instale uma versão LTS recente do Node.js compatível com Vite 8 (22.12+ ou 24).
Extraia o ZIP, abra a pasta `ecociente-front` no VS Code e execute:

```powershell
npm install
npm run dev
```

Abra o endereço informado no terminal. Verificações:

```powershell
npm run build
npm run lint
```

## O que está pronto

- Login e cadastro com nome, e-mail, senha e confirmação.
- Componentes visuais em pasta própria com index.tsx; interfaces de props em types/componentes.ts.
- Tipos do domínio em types/autenticacao.ts, sem `any` no código fonte.
- Oito componentes, páginas separadas, hooks para orquestrar validação e chamadas.
- Serviços com Promise tipada e try/catch. Páginas e componentes não importam services.
- useState com dados relacionados agrupados, atualizações imutáveis.
- Cancelamento via AbortController ao desmontar o formulário e bloqueio de envios duplicados.
- Dependências explícitas de useEffect; useTitulo reage à mudança do título recebido.
- Rotas /login, /cadastro, /recuperar-senha e curinga. Recuperação é apenas uma página informativa nesta etapa.
- React.lazy e Suspense por página.
- Labels, mensagens no DOM, role=alert, foco visível, link para pular conteúdo e foco no primeiro campo inválido.
- Conteúdo dinâmico via JSX, sem HTML externo injetado. Senhas não são modificadas pela sanitização nem persistidas.
- CSS em styles/, fora de src/, para respeitar literalmente a regra de apenas .ts/.tsx dentro de src/.

## Integração com sua API: pendente do contrato real

O formulário funciona e valida localmente. Não há autenticação simulada, banco local ou sessão implementada. Sem configuração, enviar dados válidos mostra uma mensagem clara de API não configurada.

Copie `.env.example` para `.env.local` e preencha URL e caminhos reais. Os nomes são:

```
VITE_API_URL=
VITE_LOGIN_PATH=
VITE_CADASTRO_PATH=
```

Contrato PROVISÓRIO em src/services/autenticacao.ts:

- Login POST: `{ "email": "...", "senha": "..." }`.
- Cadastro POST: `{ "nome": "...", "email": "...", "senha": "..." }`.
- Confirmação de senha não vai ao servidor.
- Atualmente, HTTP 2xx é interpretado como operação aceita. O corpo da resposta não é consumido.

Antes de usar com o backend, ajustar DTOs, endpoints, respostas e política de senha conforme Swagger/controllers. Integrar token ou cookie, renovação/expiração, logout e destino pós-login conforme o contrato. Se usar cookies entre origens, configurar credentials e CORS corretamente. Não enviar dados reais antes desse alinhamento. O backend deve validar, autorizar e armazenar senhas de forma segura independentemente do frontend.

Variáveis VITE_* são públicas no bundle: NÃO colocar senhas, chaves privadas ou outros segredos nelas. .env.local é ignorado pelo Git. URLs e segredos privados de verdade devem permanecer no backend.

## Pendências da avaliação completa

| Critério | Situação |
|---|---|
| Publicação Vercel/GitHub Pages e link | Pendente. vercel.json já contempla rotas SPA. |
| 20 commits em 4 semanas | Devem ser feitos durante o desenvolvimento real; nenhum histórico foi fabricado. |
| Listas dinâmicas e keys por ID | Aplicar quando a tela de listagem for criada. |
| useParams com tratamento de undefined | Aplicar em uma futura rota de detalhe; não há parâmetro nessas telas. |
| Context, Provider, hook e PrivateRoute | Próxima etapa, após definir o contrato de sessão. |
| useReducer | Só implementar quando houver complexidade real para justificar. |
| localStorage versionado | Não usado nesta etapa. Não armazenar senha. |
| useMemo/useCallback com Profiler | Não adicionados artificialmente; demonstrar benefício real em telas futuras. |
| Acessibilidade AA integral | Precisa de auditoria, testes com teclado, zoom e leitor de tela. Não certificada. |
| Recuperação de senha | Página informativa; formulário e serviço ainda não implementados. |

Para publicar: importar seu repositório na Vercel, escolher Vite, comando `npm run build` e pasta `dist`; cadastrar variáveis públicas reais e inserir a URL resultante neste README. A publicação não foi feita nesta entrega.

Sugestões de commits conforme você desenvolver: `feat: cria telas de login e cadastro`, `feat: integra autenticacao com API`, `fix: corrige foco nos erros do formulario`, `docs: documenta execucao e publicacao`. Não alterar datas ou dividir artificialmente esta entrega para simular quatro semanas.

## Conferência manual

1. Abrir /login e navegar até cadastro usando teclado.
2. Enviar vazio; conferir mensagens e foco no primeiro campo inválido.
3. Testar e-mail inválido, nome curto, senha curta e confirmação diferente.
4. Mostrar e ocultar as duas senhas independentemente.
5. Enviar dados válidos sem .env: conferir erro de configuração.
6. Com backend integrado: conferir carregamento, 2xx, 401, 409, 422 e falha de rede.
7. Trocar de rota durante requisição lenta; verificar cancelamento.
8. Acessar URL inexistente e voltar ao login.
9. Conferir celular, zoom 200%, contraste e leitor de tela.
10. Abrir Network: verificar chunks separados das páginas.

Build TypeScript/Vite e lint executados nesta entrega. A verificação automatizada em navegador não pôde ser concluída porque o executável do Chromium não está instalado no ambiente. A integração ponta a ponta depende do backend real.
