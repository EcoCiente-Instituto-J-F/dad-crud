import { z } from "zod";

import { validarSchema } from "./validarSchema";

import type { CadastroQuiz } from "../types/quiz";
import type { ResultadoFormulario } from "../types/formulario";

export const alternativaSchema = z.object({
  id: z.string().min(1),
  texto: z.string().trim().min(1, "Preencha a alternativa.").max(500),
});

export const perguntaSchema = z.object({
  id: z.string().min(1),
  enunciado: z.string().trim().min(5, "Use pelo menos 5 caracteres.").max(2000),
  alternativas: z.array(alternativaSchema).min(2, "Cadastre pelo menos duas alternativas.").max(6),
  corretaId: z.string().min(1, "Marque a alternativa correta."),
}).superRefine((pergunta, contexto) => {
  if (!pergunta.alternativas.some((item) => item.id === pergunta.corretaId)) {
    contexto.addIssue({
      code: "custom",
      path: ["corretaId"],
      message: "Selecione uma alternativa correta existente.",
    });
  }

  const ids = pergunta.alternativas.map((item) => item.id);

  if (new Set(ids).size !== ids.length) {
    contexto.addIssue({
      code: "custom",
      path: ["alternativas"],
      message: "As alternativas precisam ter identificadores únicos.",
    });
  }
});

export const cadastroQuizSchema = z.object({
  titulo: z.string().trim().min(3, "Informe um título.").max(120),
  cursoId: z.string().min(1, "Selecione um curso."),
  aulaId: z.string().min(1, "Selecione uma aula."),
  notaMinima: z.number().min(0).max(100),
  pontos: z.number().int().min(0).max(10000),
  ativo: z.boolean(),
  perguntas: z.array(perguntaSchema).min(1, "Cadastre pelo menos uma pergunta.").max(50),
}).superRefine((quiz, contexto) => {
  const ids = quiz.perguntas.map((pergunta) => pergunta.id);

  if (new Set(ids).size !== ids.length) {
    contexto.addIssue({
      code: "custom",
      path: ["perguntas"],
      message: "As perguntas precisam ter identificadores únicos.",
    });
  }
});

export const quizSchema = z.object({
  id: z.string().min(1),
}).and(cadastroQuizSchema);

export function validarQuiz(
  dados: CadastroQuiz,
): ResultadoFormulario<CadastroQuiz> {
  return validarSchema(cadastroQuizSchema, dados);
}