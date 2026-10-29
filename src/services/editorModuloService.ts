import { z } from "zod";

import {
  coletasApi,
  condominiosApi,
  cooperativasApi,
  cursosApi,
  quizzesApi,
} from "./modulosApiService";

import type { NomeModulo } from "../types/editorModulo";

const id = z.number().int().positive();
const texto = z.string().trim().min(1, "Preencha este campo.");

const endereco = z.object({
  cep: z.string().regex(/^\d{8}$/, "Use 8 números no CEP."),
  uf: z.string().regex(/^[A-Z]{2}$/, "Use duas letras maiúsculas."),
  cidade: texto,
  logradouro: texto,
  numero: texto,
  complemento: z.string().nullable(),
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

const coleta = z.object({
  condominioId: id,
  cooperativaId: id,
  statusId: id,
  dataInicio: texto,
  dataFim: z.string().nullable(),
  recorrente: z.boolean(),
  diasSemanaIds: z.array(id).max(7),
});

export async function buscarModulo(
  modulo: NomeModulo,
  registroId: number,
  signal: AbortSignal,
): Promise<Record<string, unknown>> {
  switch (modulo) {
    case "condominios":
      return { ...await condominiosApi.buscar(registroId, signal) };
    case "cooperativas":
      return { ...await cooperativasApi.buscar(registroId, signal) };
    case "cursos":
      return { ...await cursosApi.buscar(registroId, signal) };
    case "quizzes":
      return { ...await quizzesApi.buscar(registroId, signal) };
    case "coletas":
      return { ...await coletasApi.buscar(registroId, signal) };
  }
}

export async function salvarModulo(
  modulo: NomeModulo,
  registroId: number | null,
  formulario: Record<string, unknown>,
  signal: AbortSignal,
): Promise<void> {
  switch (modulo) {
    case "condominios": {
      const dados = condominio.parse(formulario);

      if (registroId === null) {
        await condominiosApi.criar(dados, signal);
      } else {
        await condominiosApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "cooperativas": {
      const dados = cooperativa.parse(formulario);

      if (registroId === null) {
        await cooperativasApi.criar(dados, signal);
      } else {
        await cooperativasApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "cursos": {
      const dados = curso.parse(formulario);

      if (registroId === null) {
        await cursosApi.criar(dados, signal);
      } else {
        await cursosApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "quizzes": {
      const dados = quiz.parse(formulario);

      if (registroId === null) {
        await quizzesApi.criar(dados, signal);
      } else {
        await quizzesApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "coletas": {
      const dados = coleta.parse({
        ...formulario,
        diasSemanaIds: formulario.recorrente
          ? formulario.diasSemanaIds
          : [],
      });

      if (registroId === null) {
        await coletasApi.criar(dados, signal);
      } else {
        await coletasApi.editar(registroId, dados, signal);
      }
    }
  }
}