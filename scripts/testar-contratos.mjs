import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Executa os módulos TypeScript reais; fetch é substituído somente neste processo.
const temporario = fs.mkdtempSync(path.resolve('.ecociente-testes-'));
const ambiente = { DEV: false, MODE: 'test', VITE_DAD_API_URL: '/dad-api', VITE_AUTH_API_URL: '/auth-api', VITE_CADASTRO_API_URL: '/cadastro-api', VITE_SENHA_API_URL: '/senha-api' };
function compilar(pasta) {
  for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
    const arquivo = path.join(pasta, item.name);
    if (item.isDirectory()) { compilar(arquivo); continue; }
    if (!arquivo.endsWith('.ts') || arquivo.endsWith('.d.ts')) continue;
    let codigo = ts.transpileModule(fs.readFileSync(arquivo, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
    codigo = codigo.replace(/import\.meta\.env/g, JSON.stringify(ambiente));
    codigo = codigo.replace(/(from\s+["'])(\.[^"']+)(["'])/g, (_, inicio, nome, fim) => `${inicio}${nome}.mjs${fim}`);
    const destino = path.join(temporario, arquivo.replace(/\.ts$/, '.mjs'));
    fs.mkdirSync(path.dirname(destino), { recursive: true }); fs.writeFileSync(destino, codigo);
  }
}
let total = 0;
async function verificar(nome, executar) { await executar(); total++; console.log(`OK ${nome}`); }
const dadosSessao = (token = 'token-admin') => ({ _versao: 2, token, tipoToken: 'Bearer', papel: 'ADMIN', expiraEm: Date.now() + 60000, perfil: { id: 1, nome: 'Admin EcoCiente', email: 'admin@example.com', cpf: '', telefone: '', avatar: '' } });
const armazenamento = new Map();
globalThis.localStorage = { getItem: (chave) => armazenamento.get(chave) ?? null, setItem: (chave, valor) => armazenamento.set(chave, String(valor)), removeItem: (chave) => armazenamento.delete(chave) };
globalThis.window = new EventTarget();
try {
  compilar('src');
  const carregar = (nome) => import(pathToFileURL(path.join(temporario, `src/${nome}.mjs`)));
  const sessao = await carregar('services/sessaoService');
  const { requisitarDad, ErroHttp } = await carregar('services/httpService');
  const { esquemasModulo } = await carregar('utils/validarModuloApi');
  const { validarPerfilApi, validarSenhaApi } = await carregar('utils/validarContaApi');
  const { prepararItensEditor, chaveItemEditor } = await carregar('utils/itensEditor');
  const { condominiosApi, cursosApi, quizzesApi, coletasApi } = await carregar('services/modulosApiService');
  const { autenticar } = await carregar('services/loginService');
  const { atualizarMeuPerfilApi } = await carregar('services/contaApiService');
  const { editarUsuarioApi } = await carregar('services/usuariosApiService');
  const signal = new AbortController().signal;
  const resposta = (dados, status = 200) => new Response(JSON.stringify(dados), { status, headers: { 'Content-Type': 'application/json' } });
  await verificar('Sessão aceita avatar HTTP e mantém versão 2', () => {
    sessao.salvarSessao({ ...dadosSessao(), perfil: { ...dadosSessao().perfil, avatar: 'https://example.com/avatar.png' } });
    assert.equal(sessao.lerSessao().perfil.avatar, 'https://example.com/avatar.png');
  });
  await verificar('Versão incompatível é descartada', () => {
    localStorage.setItem('ecociente:sessao-admin', JSON.stringify({ ...dadosSessao(), _versao: 1 })); assert.equal(sessao.lerSessao(), null);
    assert.equal(localStorage.getItem('ecociente:sessao-admin'), null);
    localStorage.setItem('ecociente:sessao-admin', '{json inválido'); assert.equal(sessao.lerSessao(), null); assert.equal(localStorage.getItem('ecociente:sessao-admin'), null);
  });
  await verificar('Bearer e corpo JSON enviados à DAD', async () => {
    sessao.salvarSessao(dadosSessao());
    globalThis.fetch = async (url, opcoes) => { assert.equal(url, '/dad-api/teste'); assert.equal(opcoes.headers.get('Authorization'), 'Bearer token-admin'); assert.equal(opcoes.headers.get('Content-Type'), 'application/json'); return resposta({ ok: true }); };
    assert.deepEqual(await requisitarDad('/teste', { method: 'POST', body: '{}' }), { ok: true });
  });
  await verificar('Erro 400 preserva erros de campos', async () => {
    globalThis.fetch = async () => resposta({ mensagem: 'Revise os campos.', campos: { nome: 'Obrigatório.' } }, 400);
    await assert.rejects(requisitarDad('/teste'), (erro) => erro instanceof ErroHttp && erro.status === 400 && erro.campos.nome === 'Obrigatório.');
  });
  await verificar('Erros 403, 404 e 409 preservam o status', async () => {
    for (const status of [403, 404, 409]) { globalThis.fetch = async () => resposta({}, status); await assert.rejects(requisitarDad('/teste'), (e) => e.status === status); }
  });
  await verificar('401 antigo não apaga uma sessão nova', async () => {
    let liberar; globalThis.fetch = () => new Promise((resolve) => { liberar = resolve; });
    const pendente = requisitarDad('/teste'); sessao.salvarSessao(dadosSessao('token-novo')); liberar(resposta({}, 401));
    await assert.rejects(pendente, (erro) => erro.status === 401); assert.equal(sessao.lerSessao().token, 'token-novo');
  });
  await verificar('401 atual encerra a sessão e notifica o Context', async () => {
    let eventos = 0; const observar = () => eventos++; window.addEventListener(sessao.EVENTO_SESSAO, observar);
    globalThis.fetch = async () => resposta({}, 401); await assert.rejects(requisitarDad('/teste'), (erro) => erro.status === 401);
    assert.equal(sessao.lerSessao(), null); assert.equal(eventos, 1); window.removeEventListener(sessao.EVENTO_SESSAO, observar);
  });
  await verificar('Login rejeita perfil sem ADMIN', async () => {
    globalThis.fetch = async () => resposta({ token: 't', tipoToken: 'Bearer', expiraEmSegundos: 60, usuarioId: 1, nome: 'Pessoa', email: 'p@example.com', perfil: 'USUARIO' });
    await assert.rejects(autenticar({ email: 'p@example.com', senha: 'Senha123!' }, signal), /administradores/);
  });
  await verificar('Login usa contrato real e retorna ID numérico', async () => {
    globalThis.fetch = async (url, opcoes) => { assert.equal(url, '/auth-api/auth/login'); assert.equal(JSON.parse(opcoes.body).email, 'admin@example.com'); return resposta({ token: 't', tipoToken: 'Bearer', expiraEmSegundos: 60, usuarioId: 2, nome: 'Admin', email: 'admin@example.com', perfil: 'ADMIN' }); };
    assert.equal((await autenticar({ email: 'admin@example.com', senha: 'Senha123!' }, signal)).perfil.id, 2);
  });
  await verificar('Perfil valida URL e senha forte sem espaços', () => {
    assert.equal(validarPerfilApi({ nome: 'Admin', email: 'a@example.com', urlAvatar: 'javascript:alert(1)' }).valido, false);
    assert.equal(validarSenhaApi({ senhaAtual: 'Anterior@1', novaSenha: 'Senha fraca1!', confirmacaoSenha: 'Senha fraca1!' }).valido, false);
    assert.equal(validarSenhaApi({ senhaAtual: 'Anterior@1', novaSenha: 'NovaSenha@2', confirmacaoSenha: 'NovaSenha@2' }).valido, true);
  });
  await verificar('Coleta recorrente exige dias e intervalo válido', () => {
    const coleta = { condominioId: 1, cooperativaId: 2, statusId: 1, dataInicio: '2026-11-01T09:00:00-03:00', dataFim: null, recorrente: true, diasSemanaIds: [] };
    assert.equal(esquemasModulo.coleta.safeParse(coleta).success, false);
    assert.equal(esquemasModulo.coleta.safeParse({ ...coleta, diasSemanaIds: [1], dataFim: '2026-10-01T09:00:00-03:00' }).success, false);
    assert.equal(esquemasModulo.coleta.safeParse({ ...coleta, diasSemanaIds: [1, 2] }).success, true);
  });
  await verificar('Quiz exige duas alternativas e exatamente uma correta', () => {
    const quiz = { cursoId: 1, aulaId: 2, titulo: 'Quiz', notaMinima: 70, pontos: 10, ativo: true, perguntas: [{ enunciado: 'Pergunta?', alternativas: [{ texto: 'A', correta: true }, { texto: 'B', correta: true }] }] };
    assert.equal(esquemasModulo.quiz.safeParse(quiz).success, false);
    assert.equal(esquemasModulo.quiz.safeParse({ ...quiz, perguntas: [{ ...quiz.perguntas[0], alternativas: [{ texto: 'A', correta: true }, { texto: 'B', correta: false }] }] }).success, true);
  });
  await verificar('Reordenar itens mantém as chaves; HTTP exclui chaves internas', () => {
    const dados = prepararItensEditor({ titulo: 'Curso', descricao: 'Descrição', ativo: true, aulas: [{ id: null, titulo: 'A', conteudo: 'Aula A' }, { id: null, titulo: 'B', conteudo: 'Aula B' }] });
    const chaves = dados.aulas.map(chaveItemEditor); const invertidos = [...dados.aulas].reverse(); assert.equal(chaveItemEditor(invertidos[1]), chaves[0]);
    assert.equal(chaves[0] === chaves[1], false); const enviado = esquemasModulo.curso.parse(dados); assert.equal('_chaveEditor' in enviado.aulas[0], false); assert.equal(enviado.aulas[0].id, null);
  });
  await verificar('Paginação e filtro ativo ficam na URL', async () => {
    sessao.salvarSessao(dadosSessao()); globalThis.fetch = async (url) => { assert.equal(url, '/dad-api/api/admin/v1/condominios?pagina=2&tamanho=10&busca=Eco&ativo=false'); return resposta({ itens: [], pagina: 2, tamanho: 10, totalItens: 0, totalPaginas: 0 }); };
    await condominiosApi.listar({ pagina: 2, tamanho: 10, busca: ' Eco ', ativo: false }, signal);
  });
  await verificar('Curso inválido é bloqueado antes de chamar fetch', async () => {
    let chamadas = 0; globalThis.fetch = async () => { chamadas++; return resposta({}); };
    assert.throws(() => cursosApi.criar({ titulo: '', descricao: '', ativo: true, aulas: [] }, signal)); assert.equal(chamadas, 0);
  });
  await verificar('Edição administrativa rejeita endereço incompleto', async () => {
    let chamadas = 0; globalThis.fetch = async () => { chamadas++; return resposta({}); };
    await assert.rejects(editarUsuarioApi(1, { nome: 'Pessoa', email: 'p@example.com', dataNascimento: null, avatar: null, endereco: { cep: '', uf: '', cidade: '', logradouro: '', numero: '', complemento: null } }, signal)); assert.equal(chamadas, 0);
  });
  await verificar('Perfil usa PATCH do cadastro e não envia campos extras', async () => {
    globalThis.fetch = async (url, opcoes) => { assert.equal(url, '/cadastro-api/api/usuarios/me'); assert.equal(opcoes.method, 'PATCH'); assert.equal(opcoes.headers.get('Authorization'), 'Bearer token-admin'); assert.equal('cpf' in JSON.parse(opcoes.body), false); return new Response(null, { status: 204 }); };
    await atualizarMeuPerfilApi({ nome: 'Admin', email: 'a@example.com', urlAvatar: '', cpf: 'não enviar' }, signal);
  });
  await verificar('Cancelamento é POST sem corpo', async () => {
    globalThis.fetch = async (url, opcoes) => { assert.equal(url, '/dad-api/api/admin/v1/coletas/1/cancelamento'); assert.equal(opcoes.method, 'POST'); assert.equal(opcoes.body, undefined); return resposta({}); };
    // A resposta vazia viola o contrato de retorno, mas permite verificar o request.
    await assert.rejects(coletasApi.cancelar(1, signal), /Resposta da API/);
  });
  await verificar('Quiz edita com PUT', async () => {
    globalThis.fetch = async (url, opcoes) => { assert.equal(url, '/dad-api/api/admin/v1/quizzes/1'); assert.equal(opcoes.method, 'PUT'); return resposta({}); };
    await assert.rejects(quizzesApi.editar(1, { cursoId: 1, aulaId: 1, titulo: 'Quiz', notaMinima: 70, pontos: 1, ativo: true, perguntas: [{ enunciado: 'Pergunta?', alternativas: [{ texto: 'A', correta: true }, { texto: 'B', correta: false }] }] }, signal), /Resposta da API/);
  });
  console.log(`${total} verificações de contratos concluídas. Não substituem testes com as APIs reais.`);
} finally { fs.rmSync(temporario, { recursive: true, force: true }); }
