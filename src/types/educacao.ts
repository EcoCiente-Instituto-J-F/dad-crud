import type { z } from "zod";

import type {
  aulaSchema,
  cadastroCursoSchema,
  cursoSchema,
} from "../utils/validarCurso";

export interface Aula extends z.infer<typeof aulaSchema> {}

export interface CadastroCurso
  extends z.infer<typeof cadastroCursoSchema> {}

export interface Curso extends z.infer<typeof cursoSchema> {}

export interface EditorCursoProps {
  inicial: CadastroCurso;
  id?: string;
}

export interface EditorAulasProps {
  aulas: Aula[];
  erros: Record<string, string>;
  onChange: (aulas: Aula[]) => void;
}