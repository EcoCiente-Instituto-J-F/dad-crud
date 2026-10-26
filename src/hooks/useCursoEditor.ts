import { useEditor } from "./useEditor";
import { salvarCurso } from "../services/cursosService";
import { validarCurso } from "../utils/validarCurso";

import type { CadastroCurso } from "../types/educacao";

export function useCursoEditor(
  inicial: CadastroCurso,
  id: string | undefined,
) {
  return useEditor(
    inicial,
    validarCurso,
    (dados, signal) => salvarCurso(id, dados, signal),
  );
}