# Contribuindo com o dad-crud

Ao participar, você concorda em seguir o [Código de Conduta](CODE_OF_CONDUCT.md). Para reportar um problema de segurança, **não** abra uma issue — siga o [SECURITY.md](SECURITY.md).

## Idioma

Documentação, mensagens de interface, issues e Pull Requests em português do Brasil. O código segue o padrão existente (nomes de componentes, hooks, funções e tipos em português).

## Configurando o ambiente

1. Instale Node.js 22.12+ ou 24.
2. Faça fork ou clone o repositório:
   ```bash
   git clone https://github.com/EcoCiente-Instituto-J-F/dad-crud.git
   cd dad-crud
   npm install
   ```
3. Copie `.env.example` para `.env.local` (ignorado pelo Git) se precisar de variáveis.
4. Inicie com `npm run dev`.

## Testando sua mudança

O projeto ainda não tem suíte de testes nem CI de validação. Antes de abrir a PR, rode:

```bash
npm run lint
npm run build
```

Teste manualmente no navegador o fluxo alterado (teclado incluído). Se você adicionar um framework de testes, discuta antes em uma issue. Testes e exemplos não devem depender de rede, APIs pagas ou dados de produção.

## Regras do projeto

- Nenhum segredo (chaves, tokens, senhas) no repositório. Variáveis `VITE_*` são públicas.
- Nenhum dado pessoal real em exemplos ou dados simulados (`src/data/`).
- Nenhuma dependência nova sem discussão prévia.
- Código em `src/` apenas em `.ts`/`.tsx`; o CSS fica em `styles/`.
- Cada componente em sua pasta com `index.tsx`; tipos em `src/types/`.
- Páginas e componentes não importam services diretamente: use hooks.
- Sem `any`; use `AbortController` em requisições assíncronas.
- Páginas são carregadas com `React.lazy` em `src/App.tsx`.

## Pull requests

1. Crie uma branch a partir da `main` (ex.: `feat/nome-da-mudanca`).
2. Faça commits focados com prefixos `feat:`, `fix:`, `chore:`, `docs:`, `test:` ou `refactor:`.
3. Abra a PR para a `main`. O bot do projeto preenche a descrição automaticamente (PRs de forks não recebem esse recurso).
4. Aguarde a revisão de um mantenedor.

## Reportando bugs e propondo funcionalidades

Abra uma issue descrevendo o comportamento esperado, o observado, os passos para reproduzir e o navegador. Use dados fictícios. Para vulnerabilidades, siga o [SECURITY.md](SECURITY.md).
