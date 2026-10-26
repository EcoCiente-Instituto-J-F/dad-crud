import { criarRepositorio } from "./repositorioLocal";
import { cursoSchema, validarCurso } from "../utils/validarCurso";

import type { CadastroCurso, Curso } from "../types/educacao";

const repositorio = criarRepositorio<Curso>(
  "ecociente:cursos",
  cursoSchema,
);

export const listarCursos = repositorio.listar;
export const buscarCurso = repositorio.buscar;

export async function salvarCurso(
  id: string | undefined,
  formulario: CadastroCurso,
  signal: AbortSignal,
): Promise<Curso> {
  try {
    const resultado = validarCurso(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os dados do curso e das aulas.");
    }

    if (id && !(await buscarCurso(id, signal))) {
      throw new Error("Curso não encontrado.");
    }

    return await repositorio.salvar(
      {
        ...resultado.dados,
        id: id ?? crypto.randomUUID(),
      },
      signal,
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível salvar o curso.",
    );
  }
}