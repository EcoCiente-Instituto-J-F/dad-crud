import { salvarColeta } from "../services/coletasService";
import { validarColeta } from "../utils/validarColeta";
import { useEditor } from "./useEditor";

import type { CadastroColeta } from "../types/coleta";

export function useColetaEditor(
  inicial: CadastroColeta,
  id: string | undefined,
) {
  return useEditor(
    inicial,
    validarColeta,
    (dados, signal) => salvarColeta(id, dados, signal),
  );
}