# Acessibilidade do CRUD EcoCiente

## Objetivo e escopo

Implementação inicial de acessibilidade no frontend React/TypeScript, sem chatbot e sem endpoints novos. O backend ds-dad-api não precisa de mudanças para as preferências locais.

Este trabalho combina a base obrigatória do DAD com recursos assistivos inspirados no projeto de referência de acessibilidade e no kit visual do EcoCiente. O painel é complementar: as telas precisam permanecer navegáveis por teclado e leitor de tela com ele fechado.

## Entregue nesta etapa

- Atalho para pular diretamente para o conteúdo principal, acessível pelo teclado.
- Painel assistivo compacto ou ampliado, com abas Texto, Leitura, Cores e Libras.
- Controles de escala do texto (100% / 112,5% / 125% / 137,5%), fonte Arial/Verdana/Georgia, espaçamento entre linhas e letras, texto e cabeçalhos destacados.
- Guia e máscara de leitura, lupa de texto por apontamento, links destacados e opção de ocultar imagens meramente decorativas.
- Leitura em voz alta usando SpeechSynthesis do navegador, com botão para interromper.
- Alto contraste claro/escuro, escala de cinza e pausa de animações, respeitando também prefers-reduced-motion.
- Integração opcional com VLibras, carregada apenas após acionamento do usuário. Depende da disponibilidade do serviço externo.
- Preferências com campo _versao=1, validação ao carregar e armazenamento local versionado.
- Campos reutilizáveis com aria-invalid, aria-describedby e mensagens de erro ligadas ao input/select.
- Eko flutuante sem IA: frases sortidas ao passar o mouse/focar; arraste por pointer e movimentação por setas do teclado; Home reposiciona.

## Como executar

1. npm ci
2. npm run build
3. npm run lint
4. npm run dev

Abra o painel após autenticar. A preferência fica neste navegador, em localStorage, na chave ecociente-acessibilidade-v1. Se a estrutura não tiver _versao=1 ou contiver valores inválidos, as opções incompatíveis retornam aos padrões seguros.

## Testes manuais previstos

| Cenário | Resultado esperado |
|---|---|
| Tab desde o início da tela | Aparece o link “Pular para o conteúdo principal”; Enter vai ao main |
| Tab até o botão assistivo | Foco claramente visível, Enter abre painel |
| Abrir painel com teclado | Foco vai ao botão Fechar, Escape fecha e devolve foco |
| Abas do painel | Setas esquerda/direita e Home/End mudam de aba e foco |
| Cards do painel | Espaço/Enter acionam controles; aria-pressed informa o estado |
| Fonte/contraste | Aparência altera e persiste após F5 e mudança de rota |
| Máscara/guia/lupa | Acompanham o apontador sem bloquear cliques |
| Leitura por voz | Lê o main e interrompe sob comando; falha anunciada se sem voz |
| VLibras | Serviço só carrega após clique, mostra estado de carregamento e erro |
| Formulário inválido | Erro visível, role=alert, aria-invalid e aria-describedby no campo |
| Eko | Hover/foco mostra frases; mouse arrasta; setas e Home reposicionam |
| Navegação e zoom | Validar em 200% de zoom, sem perda de conteúdo e sem scroll horizontal crítico |
| Leitor de tela | Testar com NVDA ou VoiceOver menu, formulários, modal e painel |
| Foco em modais | Não deixar o foco escapar; devolver foco ao botão que abriu |
| Rotas e estados | Validar telas de usuários, condomínio, coleta, curso, quiz e erro |

## Limitações e próximos passos

- O painel não é certificação WCAG: confirmar contraste 4,5:1 para texto comum, 3:1 para texto grande, estados hover/foco, tamanho e reflow em todas as páginas, com medição automatizada e teste manual.
- Fontes fixas em px nas páginas existentes podem precisar de ajustes por componente para atender 200% de aumento sem corte.
- O alto contraste usa substituições CSS para os componentes principais. Conferir gráficos, calendários, tabelas, placeholders e badges em todas as rotas.
- O componente de texto falado usa voz sintetizada do navegador e **não** substitui navegação de um leitor de tela.
- O VLibras requer rede e autorização do usuário para carregar um serviço externo. Em caso de indisponibilidade, o painel informa erro em vez de indicar sucesso.
- Filtros de simulação de daltonismo e saturação do projeto Zuppy foram estudados, mas não entram nesta primeira implementação: não garantem acessibilidade e exigem validação visual específica.
- O desenho do mascote é uma adaptação SVG do Eko enviado, apropriada à interface. Pode ser substituído por uma versão transparente do modelo 3D aprovado, sem alterar a lógica de interação.
- A recuperação de foco e padrões ARIA precisam ser validados nas demais telas/menus customizados antes de considerar o extra de DAD concluído.
- Nenhuma funcionalidade de chatbot, áudio para chatbot ou consulta de dados foi incluída.

## Relação com a rubrica de DAD

PDF “Requisitos por disciplina — Interdisciplinar — Maio/2026”, 2º ano, páginas 6–8:
- Acessibilidade mínima WCAG 2.1 AA: botões semânticos, labels, alt, contraste, feedback de erros e navegação por teclado.
- Extra: componentes interativos com ARIA, gerenciamento de foco, landmarks e demonstração com leitor de tela.
- Extra: localStorage com objeto versionado.
- Organização React TypeScript mantida: componentes em src/components e hook/contexto em src/hooks e src/contexts.
