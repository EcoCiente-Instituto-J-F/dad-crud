import type { z } from "zod";

import type {
  alternativaSchema,
  cadastroQuizSchema,
  perguntaSchema,
  quizSchema,
} from "../utils/validarQuiz";
import type { Curso } from "./educacao";

export interface Alternativa extends z.infer<typeof alternativaSchema> {}
export interface Pergunta extends z.infer<typeof perguntaSchema> {}
export interface CadastroQuiz extends z.infer<typeof cadastroQuizSchema> {}
export interface Quiz extends z.infer<typeof quizSchema> {}

export interface EditorPerguntasProps {
  perguntas: Pergunta[];
  erros: Record<string, string>;
  onChange: (perguntas: Pergunta[]) => void;
}

export interface EditorQuizProps {
  inicial: CadastroQuiz;
  id?: string;
  cursos: Curso[];
}

export interface DadosQuizzes {
  quizzes: Quiz[];
  cursos: Curso[];
}

export interface PreviewQuizProps {
  quiz: CadastroQuiz;
}