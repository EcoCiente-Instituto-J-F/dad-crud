import type { Catalogos } from "../types/catalogos";
import type {
  CampoEditor,
  ConfiguracaoEditor,
  NomeModulo,
} from "../types/editorModulo";

export const enderecoInicial = {
  cep: "",
  uf: "",
  cidade: "",
  logradouro: "",
  numero: "",
  complemento: null,
};

const camposEndereco: CampoEditor[] = [
  { chave: "cep", titulo: "CEP — 8 números", tipo: "text", obrigatorio: true },
  { chave: "uf", titulo: "UF — duas letras maiúsculas", tipo: "text", obrigatorio: true },
  { chave: "cidade", titulo: "Cidade", tipo: "text", obrigatorio: true },
  { chave: "logradouro", titulo: "Logradouro", tipo: "text", obrigatorio: true },
  { chave: "numero", titulo: "Número", tipo: "text", obrigatorio: true },
  { chave: "complemento", titulo: "Complemento", tipo: "text" },
];

function campoEndereco(): CampoEditor {
  return {
    chave: "endereco",
    titulo: "Endereço",
    tipo: "object",
    campos: camposEndereco,
    novo: { ...enderecoInicial },
  };
}

export function configurarEditor(
  modulo: NomeModulo,
  catalogos: Catalogos,
): ConfiguracaoEditor {
  switch (modulo) {
    case "condominios":
      return {
        titulo: "Condomínio",
        inicial: {
          nome: "",
          cnpj: null,
          codigoAcesso: null,
          ativo: true,
          tipoId: null,
          sindicoId: null,
          endereco: { ...enderecoInicial },
          torres: [],
        },
        campos: [
          { chave: "nome", titulo: "Nome", tipo: "text", obrigatorio: true },
          { chave: "cnpj", titulo: "CNPJ", tipo: "text" },
          { chave: "codigoAcesso", titulo: "Código de acesso", tipo: "text" },
          {
            chave: "tipoId",
            titulo: "Tipo",
            tipo: "select",
            obrigatorio: true,
            opcoes: catalogos.tiposCondominios,
          },
          {
            chave: "sindicoId",
            titulo: "Síndico",
            tipo: "select",
            opcoes: catalogos.sindicos,
          },
          { chave: "ativo", titulo: "Ativo", tipo: "checkbox" },
          campoEndereco(),
          {
            chave: "torres",
            titulo: "Torres",
            tipo: "array",
            novo: { id: null, nome: "" },
            campos: [
              { chave: "nome", titulo: "Nome da torre", tipo: "text", obrigatorio: true },
            ],
          },
        ],
      };

    case "cooperativas":
      return {
        titulo: "Cooperativa",
        inicial: {
          nome: "",
          cnpj: "",
          email: null,
          telefone: null,
          usuarioId: null,
          endereco: { ...enderecoInicial },
          categoriaIds: [],
          pontos: [],
        },
        campos: [
          { chave: "nome", titulo: "Nome", tipo: "text", obrigatorio: true },
          { chave: "cnpj", titulo: "CNPJ", tipo: "text", obrigatorio: true },
          { chave: "email", titulo: "E-mail", tipo: "email" },
          { chave: "telefone", titulo: "Telefone", tipo: "text" },
          {
            chave: "usuarioId",
            titulo: "ID do usuário Cooperativa — opcional",
            tipo: "number",
          },
          campoEndereco(),
          {
            chave: "categoriaIds",
            titulo: "Categorias",
            tipo: "multiselect",
            opcoes: catalogos.categoriasResiduos,
          },
          {
            chave: "pontos",
            titulo: "Pontos de coleta",
            tipo: "array",
            novo: {
              id: null,
              nome: "",
              abertura: null,
              fechamento: null,
              ativo: true,
              endereco: { ...enderecoInicial },
              categoriaIds: [],
            },
            campos: [
              { chave: "nome", titulo: "Nome do ponto", tipo: "text", obrigatorio: true },
              { chave: "abertura", titulo: "Abertura", tipo: "time" },
              { chave: "fechamento", titulo: "Fechamento", tipo: "time" },
              { chave: "ativo", titulo: "Ponto ativo", tipo: "checkbox" },
              campoEndereco(),
              {
                chave: "categoriaIds",
                titulo: "Categorias do ponto",
                tipo: "multiselect",
                opcoes: catalogos.categoriasResiduos,
              },
            ],
          },
        ],
      };

    case "cursos":
      return {
        titulo: "Curso",
        inicial: {
          titulo: "",
          descricao: "",
          ativo: true,
          aulas: [],
        },
        campos: [
          { chave: "titulo", titulo: "Título", tipo: "text", obrigatorio: true },
          { chave: "descricao", titulo: "Descrição", tipo: "textarea", obrigatorio: true },
          { chave: "ativo", titulo: "Ativo", tipo: "checkbox" },
          {
            chave: "aulas",
            titulo: "Aulas",
            tipo: "array",
            novo: { id: null, titulo: "", conteudo: "" },
            campos: [
              { chave: "titulo", titulo: "Título da aula", tipo: "text", obrigatorio: true },
              { chave: "conteudo", titulo: "Conteúdo", tipo: "textarea", obrigatorio: true },
            ],
          },
        ],
      };

    case "quizzes":
      return {
        titulo: "Quiz",
        inicial: {
          titulo: "",
          cursoId: null,
          aulaId: null,
          notaMinima: 70,
          pontos: 10,
          ativo: true,
          perguntas: [],
        },
        campos: [
          { chave: "titulo", titulo: "Título", tipo: "text", obrigatorio: true },
          { chave: "cursoId", titulo: "ID do curso", tipo: "number", obrigatorio: true },
          { chave: "aulaId", titulo: "ID da aula", tipo: "number", obrigatorio: true },
          { chave: "notaMinima", titulo: "Nota mínima — 0 a 100", tipo: "number", obrigatorio: true },
          { chave: "pontos", titulo: "Pontos", tipo: "number", obrigatorio: true },
          { chave: "ativo", titulo: "Ativo", tipo: "checkbox" },
          {
            chave: "perguntas",
            titulo: "Perguntas",
            tipo: "array",
            novo: {
              enunciado: "",
              alternativas: [
                { texto: "", correta: true },
                { texto: "", correta: false },
              ],
            },
            campos: [
              { chave: "enunciado", titulo: "Enunciado", tipo: "textarea", obrigatorio: true },
              {
                chave: "alternativas",
                titulo: "Alternativas",
                tipo: "array",
                novo: { texto: "", correta: false },
                campos: [
                  { chave: "texto", titulo: "Texto", tipo: "text", obrigatorio: true },
                  { chave: "correta", titulo: "Correta", tipo: "checkbox" },
                ],
              },
            ],
          },
        ],
      };

    case "coletas":
      return {
        titulo: "Agendamento de coleta",
        inicial: {
          condominioId: null,
          cooperativaId: null,
          statusId: null,
          dataInicio: "",
          dataFim: null,
          recorrente: false,
          diasSemanaIds: [],
        },
        campos: [
          {
            chave: "condominioId",
            titulo: "ID do condomínio",
            tipo: "number",
            obrigatorio: true,
          },
          {
            chave: "cooperativaId",
            titulo: "ID da cooperativa",
            tipo: "number",
            obrigatorio: true,
          },
          {
            chave: "statusId",
            titulo: "Situação",
            tipo: "select",
            obrigatorio: true,
            opcoes: catalogos.statusAgendamentos,
          },
          {
            chave: "dataInicio",
            titulo: "Início",
            tipo: "datetime",
            obrigatorio: true,
          },
          {
            chave: "dataFim",
            titulo: "Fim",
            tipo: "datetime",
          },
          {
            chave: "recorrente",
            titulo: "Recorrente",
            tipo: "checkbox",
          },
          {
            chave: "diasSemanaIds",
            titulo: "Dias da semana — apenas para recorrência",
            tipo: "multiselect",
            opcoes: catalogos.diasSemana,
          },
          {
            chave: "visitas",
            titulo: "Visitas registradas",
            tipo: "array",
            campos: [
              {
                chave: "data",
                titulo: "Data",
                tipo: "datetime",
              },
              {
                chave: "realizada",
                titulo: "Realizada",
                tipo: "checkbox",
              },
              {
                chave: "confirmada",
                titulo: "Confirmada",
                tipo: "checkbox",
              },
              {
                chave: "observacao",
                titulo: "Observação",
                tipo: "textarea",
              },
            ],
          },
        ],
      };
  }
}