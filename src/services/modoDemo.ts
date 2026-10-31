export {};

type Registro = Record<string, unknown>;

const ambiente = import.meta.env;
const demo = ambiente.DEV && ambiente["VITE_MODO_DEMO"] === "true";
const chaveSessao = "ecociente:sessao-admin";

if (!demo) {
  try {
    const texto = localStorage.getItem(chaveSessao);
    const sessao: unknown = texto ? JSON.parse(texto) : null;

    if (
      typeof sessao === "object" &&
      sessao !== null &&
      "token" in sessao &&
      sessao.token === "ecociente-demo-local"
    ) {
      localStorage.removeItem(chaveSessao);
    }
  } catch {
    // Não impede a inicialização.
  }
}

if (demo) {
  const agora = new Date().toISOString();
  let sequencia = 100;

  const endereco = {
    cep: "01001000",
    uf: "SP",
    cidade: "São Paulo",
    logradouro: "Praça da Sé",
    numero: "10",
    complemento: null,
  };

  const tiposUsuarios = [
    { id: 1, nome: "ADMIN" },
    { id: 2, nome: "Síndico" },
    { id: 3, nome: "Usuário" },
    { id: 4, nome: "Cooperativa" },
  ];

  const statusAgendamentos = [
    { id: 1, nome: "Pendente" },
    { id: 2, nome: "Confirmado" },
    { id: 3, nome: "Concluído" },
    { id: 4, nome: "Cancelado" },
  ];

  const catalogos = {
    tiposUsuarios,
    tiposCondominios: [
      { id: 1, nome: "Residencial" },
      { id: 2, nome: "Comercial" },
    ],
    categoriasResiduos: [
      {
        id: 1, nome: "Papel", permiteReciclagem: true,
        cor: "#4c8eff", pontosBase: 10, limitePontosDiario: 100,
      },
      {
        id: 2, nome: "Plástico", permiteReciclagem: true,
        cor: "#d64573", pontosBase: 10, limitePontosDiario: 100,
      },
      {
        id: 3, nome: "Vidro", permiteReciclagem: true,
        cor: "#087858", pontosBase: 15, limitePontosDiario: 100,
      },
    ],
    diasSemana: [
      "Domingo", "Segunda-feira", "Terça-feira",
      "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado",
    ].map((nome, numero) => ({ id: numero + 1, nome, numero })),
    statusAgendamentos,
    sindicos: [{ id: 1, usuarioId: 2, nome: "Ana Oliveira" }],
  };

  const pessoas = [
    { nome: "Emanuelly Mendes", email: "admin@ecociente.com", tipoUsuarioId: 1 },
    { nome: "Ana Oliveira", email: "ana@example.com", tipoUsuarioId: 2 },
    { nome: "Lucas Santos", email: "lucas@example.com", tipoUsuarioId: 3 },
    { nome: "Mariana Costa", email: "mariana@example.com", tipoUsuarioId: 3 },
    { nome: "Cooperativa Verde", email: "verde@example.com", tipoUsuarioId: 4 },
    { nome: "Pedro Almeida", email: "pedro@example.com", tipoUsuarioId: 3 },
    { nome: "Juliana Souza", email: "juliana@example.com", tipoUsuarioId: 3 },
    { nome: "Rafael Lima", email: "rafael@example.com", tipoUsuarioId: 3 },
    { nome: "Camila Rocha", email: "camila@example.com", tipoUsuarioId: 3 },
    { nome: "Bruno Alves", email: "bruno@example.com", tipoUsuarioId: 3 },
    { nome: "Beatriz Martins", email: "beatriz@example.com", tipoUsuarioId: 3 },
    { nome: "Gabriel Silva", email: "gabriel@example.com", tipoUsuarioId: 3 },
  ];

  const usuarios: Registro[] = pessoas.map((pessoa, indice) => ({
    ...pessoa,
    id: indice + 1,
    tipoUsuario: tiposUsuarios.find(
      (tipo) => tipo.id === pessoa.tipoUsuarioId,
    )?.nome ?? "Usuário",
    ativo: indice !== 8,
    dataNascimento: "2000-01-15",
    cpfMascarado: "***.***.***-00",
    avatar: null,
    registroEm: agora,
    endereco: { ...endereco },
    condominioId: pessoa.tipoUsuarioId === 3 ? 1 : null,
  }));

  const banco: Record<string, Registro[]> = {
    usuarios,
    condominios: [
      {
        id: 1, nome: "Residencial Jardim Verde",
        cnpj: null, codigoAcesso: "ECO123", urlFoto: null,
        ativo: true, tipoId: 1, sindicoId: 1,
        endereco: { ...endereco },
        torres: [
          { id: 1, nome: "Torre A" },
          { id: 2, nome: "Torre B" },
        ],
      },
      {
        id: 2, nome: "Residencial das Flores",
        cnpj: null, codigoAcesso: "ECO456", urlFoto: null,
        ativo: true, tipoId: 1, sindicoId: null,
        endereco: { ...endereco, numero: "20" },
        torres: [{ id: 3, nome: "Torre única" }],
      },
    ],
    cooperativas: [
      {
        id: 1, nome: "Cooperativa Verde",
        cnpj: "11222333000181", email: "verde@example.com",
        telefone: "11999999999", usuarioId: 5,
        criadoEm: agora, endereco: { ...endereco },
        categoriaIds: [1, 2, 3],
        pontos: [
          {
            id: 1, nome: "Ponto Central",
            abertura: "08:00", fechamento: "18:00",
            ativo: true, endereco: { ...endereco },
            categoriaIds: [1, 2, 3],
          },
        ],
      },
    ],
    cursos: [
      {
        id: 1, titulo: "Primeiros passos na reciclagem",
        descricao: "Aprenda a separar os resíduos do dia a dia.",
        ativo: true,
        aulas: [
          {
            id: 1, cursoId: 1, titulo: "Separação de resíduos",
            conteudo: "Separe papel, plástico e vidro dos resíduos orgânicos.",
            ordem: 1,
          },
          {
            id: 2, cursoId: 1, titulo: "Coleta seletiva",
            conteudo: "Conheça os pontos de coleta da sua região.",
            ordem: 2,
          },
        ],
      },
    ],
    quizzes: [
      {
        id: 1, cursoId: 1, aulaId: 1,
        titulo: "Vamos praticar?", notaMinima: 70,
        pontos: 10, ativo: true, criadoEm: agora,
        perguntas: [
          {
            id: 1, quizId: 1, ordem: 1,
            enunciado: "Qual material pode ser reciclado?",
            alternativas: [
              {
                id: 1, perguntaId: 1,
                texto: "Garrafa de vidro", correta: true,
              },
              {
                id: 2, perguntaId: 1,
                texto: "Papel higiênico usado", correta: false,
              },
            ],
          },
        ],
      },
    ],
    coletas: [
      {
        id: 1, condominioId: 1, cooperativaId: 1,
        statusId: 1, status: "Pendente",
        dataInicio: agora, dataFim: null,
        recorrente: true, diasSemanaIds: [2, 4], visitas: [],
        origemSolicitacao: "CONDOMINIO",
        solicitadoPorUsuarioId: 1,
        respondidoPorUsuarioId: null,
        respondidoEm: null,
      },
      {
        id: 2, condominioId: 2, cooperativaId: 1,
        statusId: 3, status: "Concluído",
        dataInicio: agora, dataFim: null,
        recorrente: false, diasSemanaIds: [],
        origemSolicitacao: "COOPERATIVA",
        solicitadoPorUsuarioId: 5,
        respondidoPorUsuarioId: 1,
        respondidoEm: agora,
        visitas: [
          {
            id: 1, data: agora, realizada: true,
            confirmada: true, confirmadoEm: agora,
            observacao: "Coleta realizada. Registro de demonstração.",
          },
        ],
      },
    ],
  };

  function responder(dados: unknown, status = 200): Response {
    return new Response(JSON.stringify(dados), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  function comoRegistro(valor: unknown): Registro {
    if (typeof valor === "object" && valor !== null && !Array.isArray(valor)) {
      return valor as Registro;
    }

    return {};
  }

  function completar(modulo: string, dados: Registro, id: number): Registro {
    const resultado: Registro = { ...dados, id };

    for (const chave of ["torres", "pontos", "aulas", "perguntas", "alternativas"]) {
      const lista = resultado[chave];

      if (!Array.isArray(lista)) continue;

      resultado[chave] = lista.map((item: unknown, indice: number) => {
        const filho = comoRegistro(item);
        const filhoId = typeof filho.id === "number" ? filho.id : ++sequencia;
        const novo = completar(chave, filho, filhoId);

        if (chave === "aulas") {
          novo.cursoId = id;
          novo.ordem = indice + 1;
        }

        if (chave === "perguntas") {
          novo.quizId = id;
          novo.ordem = indice + 1;
        }

        if (chave === "alternativas") novo.perguntaId = id;

        return novo;
      });
    }

    if (modulo === "usuarios") {
      resultado.tipoUsuario = tiposUsuarios.find(
        (tipo) => tipo.id === resultado.tipoUsuarioId,
      )?.nome ?? "Usuário";

      resultado.cpfMascarado ??= "***.***.***-00";
      resultado.avatar ??= null;
      resultado.dataNascimento ??= null;
      resultado.registroEm ??= agora;
      resultado.condominioId ??= null;
      resultado.ativo ??= true;

      delete resultado.senha;
      delete resultado.cpf;
    }

    if (modulo === "cooperativas" || modulo === "quizzes") {
      resultado.criadoEm ??= agora;
    }

    if (modulo === "coletas") {
      resultado.visitas ??= [];
      resultado.status = statusAgendamentos.find(
        (status) => status.id === resultado.statusId,
      )?.nome ?? "Pendente";
    }

    return resultado;
  }

  const fetchOriginal = window.fetch.bind(window);

  window.fetch = async (entrada, opcoes) => {
    const requisicao = entrada instanceof Request ? entrada : null;
    const url = new URL(
      requisicao ? requisicao.url : String(entrada),
      window.location.origin,
    );

    const bases = [
      ambiente["VITE_DAD_API_URL"],
      ambiente["VITE_AUTH_API_URL"],
      ambiente["VITE_CADASTRO_API_URL"],
      ambiente["VITE_SENHA_API_URL"],
    ].filter((base): base is string =>
      typeof base === "string" && base.length > 0,
    );

    const caminhoConhecido =
      /^\/(dad-api|auth-api|cadastro-api|senha-api)(\/|$)/.test(url.pathname) ||
      url.pathname.startsWith("/api/admin/v1/") ||
      url.pathname.startsWith("/auth/") ||
      url.pathname.startsWith("/senhas/") ||
      url.pathname.startsWith("/api/cadastro/") ||
      url.pathname.startsWith("/api/usuarios/me");

    const pertenceApi = bases.some((base) => {
      const baseUrl = new URL(base, window.location.origin);
      const prefixo = baseUrl.pathname.replace(/\/+$/, "");

      return url.origin === baseUrl.origin &&
        (url.pathname === prefixo || url.pathname.startsWith(`${prefixo}/`));
    });

    if (!pertenceApi && !caminhoConhecido) {
      return fetchOriginal(entrada, opcoes);
    }

    const signal = opcoes?.signal ?? requisicao?.signal;
    signal?.throwIfAborted();

    const metodo = (opcoes?.method ?? requisicao?.method ?? "GET").toUpperCase();

    const corpo = opcoes?.body ??
      (requisicao && metodo !== "GET" ? await requisicao.clone().text() : null);

    let dados: Registro = {};

    if (typeof corpo === "string" && corpo) {
      try {
        const valor: unknown = JSON.parse(corpo);
        dados = comoRegistro(valor);
      } catch {
        return responder({ mensagem: "JSON inválido." }, 400);
      }
    }

    if (url.pathname.endsWith("/auth/login")) {
      if (
        dados.email !== "admin@ecociente.com" ||
        dados.senha !== "EcoCiente@2026"
      ) {
        return responder({
          mensagem: "Use as credenciais de demonstração.",
        }, 401);
      }

      return responder({
        token: "ecociente-demo-local",
        tipoToken: "Bearer",
        expiraEmSegundos: 28800,
        usuarioId: 1,
        nome: "Emanuelly Mendes",
        email: "admin@ecociente.com",
        perfil: "ADMIN",
      });
    }

    if (url.pathname.endsWith("/catalogos")) {
      return responder(catalogos);
    }

    if (url.pathname.endsWith("/dashboard")) {
      const meses = Math.min(
        12,
        Math.max(1, Number(url.searchParams.get("meses")) || 6),
      );

      return responder({
        geradoEm: new Date().toISOString(),
        usuarios: usuarios.length,
        usuariosAtivos: usuarios.filter((usuario) => usuario.ativo).length,
        condominios: banco.condominios.length,
        condominiosAtivos: banco.condominios.filter((item) => item.ativo).length,
        cooperativas: banco.cooperativas.length,
        cursos: banco.cursos.length,
        quizzes: banco.quizzes.length,
        agendamentos: banco.coletas.length,
        usuariosCadastradosHoje: usuarios.length,
        postagensHoje: 18,
        evolucao: Array.from({ length: meses }, (_, indice) => {
          const data = new Date();
          data.setDate(1);
          data.setMonth(data.getMonth() - meses + 1 + indice);

          return {
            mes: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`,
            usuariosNovos: [12, 19, 15, 28, 24, 35][indice % 6],
            cooperativasNovas: [2, 4, 3, 6, 5, 8][indice % 6],
            postagens: [20, 30, 25, 42, 38, 52][indice % 6],
          };
        }),
        usuariosRecentes: usuarios.slice(-5).reverse().map((usuario) => ({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipoUsuario,
          ativo: usuario.ativo,
          registroEm: usuario.registroEm,
        })),
      });
    }

    const rota = url.pathname.match(
      /\/api\/admin\/v1\/(usuarios|condominios|cooperativas|cursos|quizzes|coletas)(?:\/(\d+))?(?:\/([^/]+))?\/?$/,
    );

    if (rota) {
      const modulo = rota[1];
      const id = rota[2] ? Number(rota[2]) : null;
      const acao = rota[3];
      const lista = banco[modulo];

      if (id === null && metodo === "GET") {
        let itens = [...lista];
        const busca = url.searchParams.get("busca")?.toLocaleLowerCase();

        if (busca) {
          itens = itens.filter((item) =>
            [item.nome, item.titulo, item.email, item.id].some((valor) =>
              String(valor ?? "").toLocaleLowerCase().includes(busca),
            ),
          );
        }

        for (const campo of ["tipoUsuarioId", "statusId"]) {
          const valor = url.searchParams.get(campo);

          if (valor) {
            itens = itens.filter((item) => item[campo] === Number(valor));
          }
        }

        const situacao = url.searchParams.get("ativo");

        if (situacao !== null) {
          itens = itens.filter((item) => item.ativo === (situacao === "true"));
        }

        const inicio = url.searchParams.get("inicio");
        const fim = url.searchParams.get("fim");

        if (inicio) {
          itens = itens.filter((item) =>
            new Date(String(item.dataInicio)).getTime() >=
            new Date(inicio).getTime(),
          );
        }

        if (fim) {
          itens = itens.filter((item) =>
            new Date(String(item.dataInicio)).getTime() <=
            new Date(fim).getTime(),
          );
        }

        const pagina = Math.max(
          0, Number(url.searchParams.get("pagina")) || 0,
        );
        const tamanho = Math.max(
          1, Number(url.searchParams.get("tamanho")) || 10,
        );

        return responder({
          itens: itens.slice(pagina * tamanho, (pagina + 1) * tamanho),
          pagina,
          tamanho,
          totalItens: itens.length,
          totalPaginas: Math.ceil(itens.length / tamanho),
        });
      }

      if (id === null && metodo === "POST") {
        const novo = completar(modulo, dados, ++sequencia);
        lista.push(novo);
        return responder(novo, 201);
      }

      const indice = lista.findIndex((item) => item.id === id);

      if (indice < 0) {
        return responder({ mensagem: "Registro não encontrado." }, 404);
      }

      const item = lista[indice];

      if (metodo === "GET" && !acao) {
        return responder(item);
      }

      if (acao === "cancelamento" && metodo === "POST") {
        item.statusId = 4;
        item.status = "Cancelado";
        return responder(item);
      }

      if (acao === "visitas" && metodo === "POST") {
        if (!dados.realizada && !String(dados.observacao ?? "").trim()) {
          return responder({
            mensagem: "Informe a observação da visita.",
          }, 400);
        }

        const visitas: unknown[] = Array.isArray(item.visitas)
          ? item.visitas
          : [];

        visitas.push({
          ...dados,
          id: ++sequencia,
          confirmadoEm: dados.confirmada ? new Date().toISOString() : null,
        });

        item.visitas = visitas;
        return responder(item);
      }

      if (metodo === "PATCH" || metodo === "PUT") {
        lista[indice] = completar(
          modulo,
          { ...item, ...dados },
          Number(id),
        );

        return responder(lista[indice]);
      }

      if (metodo === "DELETE") {
        lista.splice(indice, 1);
        return new Response(null, { status: 204 });
      }
    }

    if (url.pathname.endsWith("/api/usuarios/me") && metodo === "PATCH") {
      Object.assign(usuarios[0], {
        nome: dados.nome ?? usuarios[0].nome,
        email: dados.email ?? usuarios[0].email,
        avatar: dados.urlAvatar ?? usuarios[0].avatar,
      });

      return responder(usuarios[0]);
    }

    if (url.pathname.includes("/api/cadastro/") && metodo === "POST") {
      if (dados.codigoCondominio && dados.codigoCondominio !== "ECO123") {
        return responder({
          mensagem: "Na demonstração, use o código ECO123.",
        }, 400);
      }

      const novo = completar("usuarios", {
        nome: dados.nomeUsuario ?? dados.nome,
        email: dados.email,
        tipoUsuarioId: 3,
        endereco: { ...endereco },
        condominioId: dados.codigoCondominio ? 1 : null,
        dataNascimento: dados.dataNascimento ?? null,
      }, ++sequencia);

      usuarios.push(novo);

      return responder({
        ...novo,
        usuarioId: novo.id,
        mensagem: "Cadastro de demonstração criado.",
      }, 201);
    }

    return responder({
      mensagem: "Esta operação não está disponível no modo demonstração.",
    }, 501);
  };

  function mostrarAviso(): void {
    if (document.getElementById("ecociente-aviso-demo")) return;

    const aviso = document.createElement("div");
    aviso.id = "ecociente-aviso-demo";
    aviso.textContent =
      "Modo demonstracao | Dados ficticios | Alteracoes temporarias";

    aviso.style.cssText = [
      "position:fixed",
      "bottom:12px",
      "left:50%",
      "transform:translateX(-50%)",
      "z-index:9999",
      "background:#064e3b",
      "color:white",
      "padding:8px 16px",
      "border-radius:10px",
      "font:12px system-ui",
      "text-align:center",
      "max-width:90vw",
      "pointer-events:none",
      "box-shadow:0 2px 10px #0002",
    ].join(";");

    document.body.appendChild(aviso);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mostrarAviso, { once: true });
  } else {
    mostrarAviso();
  }
}