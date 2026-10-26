import { z } from "zod";

import { validarSchema } from "./validarSchema";

import type { CadastroCurso } from "../types/educacao";
import type { ResultadoFormulario } from "../types/formulario";

export const aulaSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().trim().min(3, "Use pelo menos 3 caracteres.").max(120),
  conteudo: z.string().trim().min(10, "Use pelo menos 10 caracteres.").max(20000),
});

export const cadastroCursoSchema = z.object({
  titulo: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres.").max(120),
  descricao: z.string().trim().min(10, "Use pelo menos 10 caracteres na descrição.").max(3000),
  ativo: z.boolean(),
  aulas: z.array(aulaSchema),
}).superRefine((curso, contexto) => {
  const ids = curso.aulas.map((aula) => aula.id);

  if (new Set(ids).size !== ids.length) {
    contexto.addIssue({
      code: "custom",
      path: ["aulas"],
      message: "As aulas precisam ter identificadores diferentes.",
    });
  }
});

export const cursoSchema = z.object({
  id: z.string().min(1),
}).and(cadastroCursoSchema);

export function validarCurso(
  dados: CadastroCurso,
): ResultadoFormulario<CadastroCurso> {
  return validarSchema(cadastroCursoSchema, dados);
}