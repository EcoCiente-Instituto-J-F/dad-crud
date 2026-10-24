# Política de Segurança

O dad-crud é um frontend administrativo (React + Vite) que exibe dados de usuários (nome, e-mail, cidade, UF, pontuação). Atualmente os dados são simulados e não há autenticação nem integração com API implementadas neste repositório.

## Versões suportadas

| Versão | Suporte |
| --- | --- |
| `main` (mais recente) | Sim |
| Demais branches | Não |

## Reportando uma vulnerabilidade

**Não abra issue, Pull Request ou discussão pública** para relatar vulnerabilidades.

Use o relato privado do GitHub: <https://github.com/EcoCiente-Instituto-J-F/dad-crud/security/advisories/new> (Security → Advisories → Report a vulnerability).

> Mantenedores: ative *Private vulnerability reporting* em Settings → Code security.

Inclua no relato:

- o impacto da falha;
- os passos para reproduzir, usando **dados fictícios**;
- o commit testado e a configuração (navegador, Node.js);
- se possível, uma ideia de correção.

Depois do relato: confirmaremos o recebimento, corrigiremos de forma privada e publicaremos um advisory com crédito a quem reportou, se desejado. Pedimos um prazo razoável para a correção antes de qualquer divulgação pública.

## Escopo

**Dentro do escopo**

- XSS e injeção de HTML/script na interface
- Vazamento de dados pessoais ou segredos (bundle, logs, repositório)
- Segredos commitados ou expostos em variáveis `VITE_*`
- Falhas na rota/pipeline do bot de PR (`.github/workflows/pr-bot.yml`, `scripts/pr-bot/`) que exponham segredos como `GEMINI_API_KEY` ou `GITHUB_TOKEN`
- Vulnerabilidades em dependências com impacto real no projeto

**Fora do escopo**

- Bugs sem impacto de segurança
- Falhas em serviços de terceiros (Vercel, GitHub, Gemini)
- Negação de serviço no próprio deploy
- Dados fictícios de `src/data/usuarios.ts`

## Como o sistema protege os dados

| Camada | Onde | O que faz |
| --- | --- | --- |
| Renderização | `src/components/` | Conteúdo dinâmico via JSX, sem injeção de HTML externo |
| Segredos | `.gitignore` | Ignora `.env` e `.env.*`, exceto `.env.example` |
| Bot de PR | `.github/workflows/pr-bot.yml` | Só roda para branches do próprio repositório, com permissões mínimas (`contents: read`, `pull-requests: write`) e checkout do código da branch base |

A autenticação, a autorização e a validação de dados devem ser feitas pelo backend; o frontend não substitui esses controles.

## Checklist de deploy

- Nenhum segredo em variáveis `VITE_*`, na imagem ou no repositório.
- `GEMINI_API_KEY` apenas em *Secrets* do GitHub.
- Ao integrar uma API real, usar HTTPS e configurar CORS/credenciais corretamente.
- Não expor endpoints internos do backend ao público.
