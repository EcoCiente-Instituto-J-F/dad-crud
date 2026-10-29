import { useCallback } from "react";

import { useConsulta } from "./useConsulta";
import { buscarUsuarioApi } from "../services/usuariosApiService";

export function useUsuarioApi(idRota: string | undefined) {
  const consultar = useCallback(
    async (signal: AbortSignal) => {
      const id = Number(idRota);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Identificação de usuário inválida.");
      }

      return buscarUsuarioApi(id, signal);
    },
    [idRota],
  );

  return useConsulta(consultar);
}