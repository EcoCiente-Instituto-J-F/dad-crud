# EcoCiente — Painel administrativo

Aplicação Vite, React e TypeScript para administrar usuários, condomínios, cooperativas, cursos, quizzes e coletas.

## Executar localmente

Requer Node.js 22.12+ e npm. Na raiz do projeto:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Se `.env.local` já existe, preserve os seus destinos das APIs e confira as variáveis do exemplo. Mantenha `VITE_MODO_DEMO=false` para integrar as APIs.

As quatro APIs precisam estar executando. O proxy do Vite funciona somente em desenvolvimento:

| Serviço | Prefixo no frontend | Destino local padrão |
| --- | --- | --- |
| DAD | `/dad-api` | `http://127.0.0.1:8080` |
| Autenticação | `/auth-api` | `http://127.0.0.1:9801` |
| Cadastro | `/cadastro-api` | `http://127.0.0.1:9090` |
| Senha | `/senha-api` | `http://127.0.0.1:9809` |

Ajuste os quatro `*_PROXY_TARGET` conforme a porta real de cada serviço. Credenciais de banco e segredo JWT pertencem exclusivamente ao backend. Tudo que começa com `VITE_` pode aparecer no JavaScript entregue ao navegador.

## Autenticação

O login chama `POST /auth/login` e exige perfil `ADMIN`. Use um administrador real cadastrado no banco das APIs. As chamadas da DAD recebem `Authorization: Bearer <token>`.

A sessão usa `_versao: 2`, verificação de validade e descarte de formato incompatível. Expiração, logout e alterações de sessão atualizam o Context. Uma resposta 401 de uma requisição antiga não apaga uma sessão mais recente.

Em desenvolvimento, `VITE_MODO_DEMO=true` permite explorar dados fictícios sem APIs. Credenciais exclusivas dessa demonstração: `admin@ecociente.com` / `EcoCiente@2026`. Esse modo não é habilitado no build de produção.

## Estrutura

- `src/components`: componentes em pasta própria com `index.tsx`.
- `src/pages`: páginas em pasta própria, carregadas por `React.lazy` e `Suspense`.
- `src/hooks`: estado, coordenação das operações e cancelamento com `AbortController`.
- `src/services`: HTTP por recurso, com retornos tipados e propagação de erros.
- `src/types`: entidades, contratos de props e retornos.
- `src/utils`: validação, normalização e transformação de dados.
- `styles`: estilos. A revisão de acessibilidade está sendo realizada separadamente.

As listas usam a paginação retornada pelo backend. Aulas, torres, perguntas e alternativas têm chaves estáveis durante edição e reordenação. As chaves internas do editor são removidas antes do HTTP; os IDs persistidos continuam numéricos.

## Verificações

```powershell
npm run check
```

Executa verificação estrutural, lint sem avisos, 19 verificações de contratos e build de produção. Os testes de contratos substituem o transporte HTTP dentro do processo de teste; não comprovam conexão a um banco ou disponibilidade das APIs.

## Funcionalidades que dependem de evolução do backend

- `VITE_CALENDARIO_OCORRENCIAS_ATIVO=true`: requer `GET /api/admin/v1/coletas/calendario`. Enquanto desativado, o calendário mostra agendamentos pela data de início, sem expandir recorrências.
- `VITE_IMPORTACAO_USUARIOS_ATIVA=true`: requer `POST /api/admin/v1/usuarios/importacao`. Enquanto desativado, o CSV pode ser validado e visualizado, mas não enviado.
- Bloqueio antecipado do editor de quizzes com tentativas requer `possuiTentativas` ou `totalTentativas` na resposta. A regra de negócio do backend continua sendo obrigatória.

Não habilite essas opções antes de implementar e testar as respectivas rotas.

## Publicação

O `vercel.json` configura o retorno ao `index.html` nas rotas da SPA. Na Vercel, configure as quatro `VITE_*_API_URL` com URLs HTTPS reais e permita a origem do frontend no CORS das APIs. O proxy de desenvolvimento não acompanha `dist`.

**Link público: ainda precisa ser confirmado e adicionado aqui após a publicação.**

Consulte [a revisão e as pendências](docs/VALIDACAO.md) antes da apresentação.
