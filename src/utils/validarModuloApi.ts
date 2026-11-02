import { z } from "zod";

const id = z.number().int().positive();
const texto = z.string().trim().min(1, "Preencha este campo.");

const endereco = z.object({
  cep: z.string().regex(/^\d{8}$/, "Use 8 números no CEP."),
  uf: z.string().regex(/^[A-Z]{2}$/, "Use duas letras maiúsculas."),
  cidade: texto.max(100),
  logradouro: texto.max(150),
  numero: texto.max(20),
  complemento: z.string().max(100).nullable(),
});

const condominio = z.object({
  nome: texto.max(255),
  cnpj: z.string().nullable(),
  codigoAcesso: z.string().max(20).nullable(),
  ativo: z.boolean(),
  tipoId: id,
  sindicoId: id.nullable(),
  endereco: endereco.nullable(),
  torres: z.array(
    z.object({
      id: id.nullable(),
      nome: texto.max(100),
    }),
  ),
});

const cooperativa = z.object({
  nome: texto.max(255),
  cnpj: texto.max(18),
  email: z.string().email().nullable(),
  telefone: z.string().max(20).nullable(),
  usuarioId: id.nullable(),
  endereco: endereco.nullable(),
  categoriaIds: z.array(id),
  pontos: z.array(
    z.object({
      id: id.nullable(),
      nome: texto.max(255),
      abertura: z.string().nullable(),
      fechamento: z.string().nullable(),
      ativo: z.boolean(),
      endereco: endereco.nullable(),
      categoriaIds: z.array(id),
    }),
  ),
});

const curso = z.object({
  titulo: texto.max(255),
  descricao: texto,
  ativo: z.boolean(),
  aulas: z.array(
    z.object({
      id: id.nullable(),
      titulo: texto.max(255),
      conteudo: texto,
    }),
  ),
});

const pergunta = z.object({
  enunciado: texto,
  alternativas: z.array(
    z.object({
      texto: texto.max(500),
      correta: z.boolean(),
    }),
  ).min(2, "Adicione pelo menos duas alternativas."),
}).refine(
  (dados) => dados.alternativas.filter((item) => item.correta).length === 1,
  {
    message: "Marque exatamente uma alternativa correta.",
    path: ["alternativas"],
  },
);

const quiz = z.object({
  cursoId: id,
  aulaId: id,
  titulo: texto.max(255),
  notaMinima: z.number().min(0).max(100),
  pontos: z.number().int().positive(),
  ativo: z.boolean(),
  perguntas: z.array(pergunta).min(1, "Adicione uma pergunta."),
});

const dataComFuso = z.string().datetime({ offset: true, message: "Informe data e horário válidos com fuso." });

const coleta = z.object({
  condominioId: id,
  cooperativaId: id,
  statusId: id,
  dataInicio: dataComFuso,
  dataFim: dataComFuso.nullable(),
  recorrente: z.boolean(),
  diasSemanaIds: z.array(id).max(7),
}).superRefine((dados, contexto) => {
  if (dados.recorrente && dados.diasSemanaIds.length === 0) {
    contexto.addIssue({ code: "custom", path: ["diasSemanaIds"], message: "Selecione pelo menos um dia para a recorrência." });
  }
  if (new Set(dados.diasSemanaIds).size !== dados.diasSemanaIds.length) {
    contexto.addIssue({ code: "custom", path: ["diasSemanaIds"], message: "Não repita dias da semana." });
  }
  if (dados.dataFim && Date.parse(dados.dataFim) < Date.parse(dados.dataInicio)) {
    contexto.addIssue({ code: "custom", path: ["dataFim"], message: "O fim não pode ser anterior ao início." });
  }
});

export const esquemasModulo = { condominio, cooperativa, curso, quiz, coleta };
