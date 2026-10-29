import { z } from "zod";

import type { EnderecoApi } from "./usuarioApi";

const idSchema = z.number().int().positive();

const enderecoRespostaSchema = z.object({
  cep: z.string().nullable(),
  uf: z.string().nullable(),
  cidade: z.string().nullable(),
  logradouro: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
});

const torreSchema = z.object({
  id: idSchema,
  nome: z.string(),
});

export const condominioSchema = z.object({
  id: idSchema,
  nome: z.string(),
  cnpj: z.string().nullable(),
  codigoAcesso: z.string().nullable(),
  ativo: z.boolean(),
  tipoId: idSchema,
  sindicoId: idSchema.nullable(),
  endereco: enderecoRespostaSchema.nullable(),
  torres: z.array(torreSchema),
});

const pontoSchema = z.object({
  id: idSchema,
  nome: z.string(),
  abertura: z.string().nullable(),
  fechamento: z.string().nullable(),
  ativo: z.boolean(),
  endereco: enderecoRespostaSchema.nullable(),
  categoriaIds: z.array(idSchema),
});

export const cooperativaSchema = z.object({
  id: idSchema,
  nome: z.string(),
  cnpj: z.string(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  usuarioId: idSchema.nullable(),
  criadoEm: z.string().nullable(),
  endereco: enderecoRespostaSchema.nullable(),
  categoriaIds: z.array(idSchema),
  pontos: z.array(pontoSchema),
});

const aulaSchema = z.object({
  id: idSchema,
  cursoId: idSchema,
  titulo: z.string(),
  conteudo: z.string(),
  ordem: z.number().int(),
});

export const cursoSchema = z.object({
  id: idSchema,
  titulo: z.string(),
  descricao: z.string(),
  ativo: z.boolean(),
  aulas: z.array(aulaSchema),
});

const alternativaSchema = z.object({
  id: idSchema,
  perguntaId: idSchema,
  texto: z.string(),
  correta: z.boolean(),
});

const perguntaSchema = z.object({
  id: idSchema,
  quizId: idSchema,
  enunciado: z.string(),
  ordem: z.number().int(),
  alternativas: z.array(alternativaSchema),
});

export const quizSchema = z.object({
  id: idSchema,
  cursoId: idSchema,
  aulaId: idSchema,
  titulo: z.string(),
  notaMinima: z.number(),
  pontos: z.number().int().positive(),
  ativo: z.boolean(),
  criadoEm: z.string().nullable(),
  perguntas: z.array(perguntaSchema),
});

const visitaSchema = z.object({
  id: idSchema,
  data: z.string(),
  realizada: z.boolean(),
  confirmada: z.boolean(),
  confirmadoEm: z.string().nullable(),
  observacao: z.string().nullable(),
});

export const coletaSchema = z.object({
  id: idSchema,
  condominioId: idSchema,
  cooperativaId: idSchema,
  statusId: idSchema,
  status: z.string(),
  dataInicio: z.string(),
  dataFim: z.string().nullable(),
  recorrente: z.boolean(),
  diasSemanaIds: z.array(idSchema),
  visitas: z.array(visitaSchema),
});

export const dashboardSchema = z.object({
  geradoEm: z.string(),
  usuarios: z.number(),
  usuariosAtivos: z.number(),
  condominios: z.number(),
  condominiosAtivos: z.number(),
  cooperativas: z.number(),
  cursos: z.number(),
  quizzes: z.number(),
  agendamentos: z.number(),
  usuariosCadastradosHoje: z.number(),
  postagensHoje: z.number(),

  evolucao: z.array(
    z.object({
      mes: z.string(),
      usuariosNovos: z.number(),
      cooperativasNovas: z.number(),
      postagens: z.number(),
    }),
  ),

  usuariosRecentes: z.array(
    z.object({
      id: idSchema,
      nome: z.string(),
      email: z.string(),
      tipo: z.string(),
      ativo: z.boolean(),
      registroEm: z.string().nullable(),
    }),
  ),
});

export type CondominioApi = z.infer<typeof condominioSchema>;
export type CooperativaApi = z.infer<typeof cooperativaSchema>;
export type CursoApi = z.infer<typeof cursoSchema>;
export type QuizApi = z.infer<typeof quizSchema>;
export type ColetaApi = z.infer<typeof coletaSchema>;
export type DashboardApi = z.infer<typeof dashboardSchema>;

export interface FiltrosPaginaApi {
  busca?: string;
  pagina: number;
  tamanho: number;
}

export interface FiltrosCondominiosApi extends FiltrosPaginaApi {
  ativo?: boolean;
}

export interface FiltrosColetasApi extends FiltrosPaginaApi {
  statusId?: number;
  inicio?: string;
  fim?: string;
}

export interface CondominioRequestApi {
  nome: string;
  cnpj: string | null;
  codigoAcesso: string | null;
  ativo: boolean;
  tipoId: number;
  sindicoId: number | null;
  endereco: EnderecoApi | null;
  torres: {
    id: number | null;
    nome: string;
  }[];
}

export interface CooperativaRequestApi {
  nome: string;
  cnpj: string;
  email: string | null;
  telefone: string | null;
  usuarioId: number | null;
  endereco: EnderecoApi | null;
  categoriaIds: number[];

  pontos: {
    id: number | null;
    nome: string;
    abertura: string | null;
    fechamento: string | null;
    ativo: boolean;
    endereco: EnderecoApi | null;
    categoriaIds: number[];
  }[];
}

export interface CursoRequestApi {
  titulo: string;
  descricao: string;
  ativo: boolean;

  aulas: {
    id: number | null;
    titulo: string;
    conteudo: string;
  }[];
}

export interface QuizRequestApi {
  cursoId: number;
  aulaId: number;
  titulo: string;
  notaMinima: number;
  pontos: number;
  ativo: boolean;

  perguntas: {
    enunciado: string;

    alternativas: {
      texto: string;
      correta: boolean;
    }[];
  }[];
}

export interface ColetaRequestApi {
  condominioId: number;
  cooperativaId: number;
  statusId: number;
  dataInicio: string;
  dataFim: string | null;
  recorrente: boolean;
  diasSemanaIds: number[];
}

export interface VisitaRequestApi {
  data: string;
  realizada: boolean;
  confirmada: boolean;
  observacao: string | null;
}