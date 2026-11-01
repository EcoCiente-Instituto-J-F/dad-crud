# EcoCiente: frontend e contratos pendentes

Este pacote altera somente o frontend. Não cria tabelas, colunas ou migrations.

## Operações que continuam usando APIs existentes

- Usuários: listagem, edição e situação.
- Condomínios: formulário completo, síndico e torres enviados no PATCH existente. `sindicoId` é o ID do catálogo de síndicos.
- Cooperativas: formulário completo e pontos enviados no PATCH existente. Não há ativação da cooperativa; há ativação dos pontos.
- Cursos: cadastro/edição de aulas salva a lista completa de aulas junto do curso, preservando IDs e ordem.
- Quizzes: curso/aula por seleção; perguntas completas, exatamente uma alternativa correta; PUT existente.
- Coletas: cadastro/edição, cancelamento sem corpo e visitas, com observação se não realizada.
- Todos os seletores enviam IDs numéricos. Não se gera UUID para registros.

## Importação administrativa: endpoint proposto, ainda não implementado pelo pacote

`POST /api/admin/v1/usuarios/importacao`, com ADMIN e Bearer.

Request: `{ "usuarios": [ ...UsuarioCriarRequest ] }`.
Cada item usa os mesmos campos do POST administrativo existente: nome, email, senha, tipoUsuarioId, cpf, dataNascimento, avatar, endereco completo, condominioId.
Máximo de 100 itens. A API deve validar TODOS antes de gravar e persistir em uma transação: sucesso total ou nenhuma alteração.
Response de sucesso: `{ "importados": 10 }`.
400 para campos; 409 para e-mail/CPF/conflito; 401/403 conforme autenticação.
Erros devem identificar o índice do usuário. Nunca retornar ou registrar senhas em logs.
Vínculo de morador deve obedecer à aprovação já existente no banco.

O CSV usa o cabeçalho baixado no modal. Nascimento em AAAA-MM-DD; CEP com oito números; UF com duas letras; IDs dos catálogos. O CPF recebe somente validação de formato no frontend.

Depois de implementar e testar o endpoint, habilitar `VITE_IMPORTACAO_USUARIOS_ATIVA=true` e reiniciar Vite.
Enquanto desabilitado ou em modo demo, apenas leitura/validação/prévia ficam disponíveis. Não há sucesso simulado.

## Calendário com recorrências: endpoint proposto

`GET /api/admin/v1/coletas/calendario?inicio=<timestamp>&fim=<timestamp>&pagina=0&tamanho=50&statusId=...&condominioId=...&cooperativaId=...`.

Response paginada padrão: `{ itens: [], pagina, tamanho, totalItens, totalPaginas }`.
Cada item contém os campos da ColetaResponse existente mais `ocorrenciaEm` (timestamp com fuso). Um agendamento recorrente pode aparecer várias vezes, uma por ocorrência. `id` continua sendo o ID do agendamento, sem persistir novos registros.
O frontend usa `ocorrenciaEm` apenas para posicionar no calendário; editar/cancelar abre o agendamento original.
`totalItens` deve contar ocorrências, não agendamentos. Aplicar filtros antes de paginar.
O backend deve definir e documentar: se dataFim limita a recorrência ou encerra uma coleta; inclusão do primeiro dia; fuso oficial; tratamento de cancelamento e recorrência sem término.
Dias selecionados são IDs do catálogo, não os números de domingo a sábado. Use `catalogos.diasSemana[].numero` para obter o dia.

Habilitar `VITE_CALENDARIO_OCORRENCIAS_ATIVO=true` somente depois de implementar e testar.
Antes disso, mantém a API existente, filtra condomínio/cooperativa após carregar todas as páginas do mês e mostra datas de início. Não expande recorrências por suposição.

## Quizzes com tentativas

Acrescentar à resposta do quiz `possuiTentativas: boolean` ou `totalTentativas: number`, calculado das tentativas existentes. Não precisa de coluna nova.
O schema Zod de resposta deve preservar esse campo. Quando presente, o editor bloqueia campos estruturais e mantém apenas título e ativo.
O backend continua sendo responsável pelo bloqueio de alterações proibidas e exclusão com histórico.

## Dados do desenho que ainda não existem nos contratos

O desenho contém pontuação de usuário, médias de aproveitamento, conclusões, percentuais de crescimento, totais de moradores e rankings.
Não derivar esses valores de campos com outro significado. Expor projeções/consultas das tabelas já existentes quando houver dados suficientes. Caso contrário, omitir a métrica.
Não tratar `usuariosAtivos` como usuários que acessaram hoje; não tratar `postagensHoje` como fotos sem definição da API.
Não duplicar ADMIN/Administrador no frontend com IDs inventados: unificar o catálogo e referências no backend/dados existentes.

## Verificação

- Build TypeScript/Vite.
- Abrir cadastros e detalhes de cada módulo.
- Modais fechados não devem bloquear o formulário principal.
- Curso selecionado limita a lista de aulas; mudar curso limpa a aula anterior.
- IDs existentes de torres/pontos/aulas são preservados; novos permanecem null até o backend responder.
- Remover item apenas prepara exclusão até salvar; cancelamento de modal descarta o rascunho.
- Modo demo permanece separado; novo envio de importação não é simulado.
- Testar 400/401/403/404/409 nas APIs reais antes de considerar a integração concluída.

Sem acesso ao frontend local do usuário, o teste deste pacote usa a versão do GitHub disponível e os arquivos aqui gerados. O script faz novo build na instalação local e restaura arquivos se falhar. Compilação não certifica igualdade visual pixel a pixel nem integração real.