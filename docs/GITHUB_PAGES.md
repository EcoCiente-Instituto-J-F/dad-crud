# Publicação DAD no GitHub Pages

O site deve ser publicado por **GitHub Actions**, nunca pela pasta raiz da branch `main`.

## Ativar
1. Abra **Settings > Pages > Build and deployment**.
2. Escolha **Source: GitHub Actions**.
3. Abra **Settings > Secrets and variables > Actions > Variables**.
4. Crie as variáveis públicas abaixo com URLs **HTTPS** reais, acessíveis pelo navegador:
   - `VITE_DAD_API_URL`: origem e eventual prefixo real da API administrativa
   - `VITE_AUTH_API_URL`: origem da autenticação, sem duplicar `/auth` (o frontend acrescenta `/auth/login`)
   - `VITE_CADASTRO_API_URL`: origem e prefixo esperado pela integração de cadastro
   - `VITE_SENHA_API_URL`: origem e prefixo esperado pela API de recuperação de senha
5. Acesse **Actions > Deploy GitHub Pages > Run workflow** na branch `main`, depois que esta PR tiver sido aprovada e mesclada.

URL esperada: https://ecociente-instituto-j-f.github.io/dad-crud/

As variáveis `VITE_*` são públicas no JavaScript e **não podem conter tokens, senhas, segredos JWT ou conexões PostgreSQL**. O arquivo `.env.local` é apenas local e não acompanha o GitHub Actions.

## O que foi corrigido
- Build Vite executado no workflow de publicação, com `--mode pages`, que usa `base: "/dad-crud/"`.
- `HashRouter` apenas no modo Pages: a navegação será `/#/login`, `/#/home`, etc., sem depender de rewrites de servidor.
- Assets públicos referenciados pelo prefixo correto.
- Configurações de APIs resolvidas quando usadas, evitando que a ausência de variáveis interrompa a inicialização da tela inteira.

## Limites
- O GitHub Pages hospeda só o frontend; `DAD_PROXY_TARGET`, `AUTH_PROXY_TARGET` e demais proxies do `vite.config.ts` funcionam apenas no desenvolvimento.
- APIs precisam estar online em HTTPS e permitir CORS da origem `https://ecociente-instituto-j-f.github.io`. O preflight deve aceitar `Authorization`, `Content-Type` e os métodos HTTP realmente usados.
- O painel exige usuário com `perfil: ADMIN` e JWT válido.
- O modo demo não está disponível em produção.
- O Pages não executa APIs Java, bancos, Redis nem scripts Node em runtime.

## Testes
No PowerShell, com dependências corretamente instaladas:
```powershell
npm ci
npm run check
npm run build -- --mode pages
npm run preview -- --base /dad-crud/
```

Depois do deploy, no navegador, abra a URL do Pages, pressione F12, inspecione **Console** e **Network**, verifique ausência de 404 em arquivos JS/CSS, navegue para `/#/login`, execute login real e teste listagem e alteração de dados com uma conta ADMIN.

## Observação
Se alguma URL HTTPS da API ainda não estiver configurada, a interface poderá carregar, mas os recursos que dependem dessa API não funcionarão até a variável ser definida e o Pages ser republicado.
