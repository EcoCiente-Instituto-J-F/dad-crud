import { useCallback } from "react";

import { useConsulta } from "./useConsulta";
import type { EstadoRequisicao } from "../types/requisicao";

interface Retorno<T> {
  requisicao: EstadoRequisicao<T | null>;
  recarregar: () => void;
}

export function useRegistro<T>(
  id: string | undefined,
  buscar: (id: string, signal: AbortSignal) => Promise<T | null>,
): Retorno<T> {
  const consultar = useCallback(
    async (signal: AbortSignal): Promise<T | null> => {
      if (!id) {
        throw new Error("Identificador não informado.");
      }

      return buscar(id, signal);
    },
    [id, buscar],
  );

  return useConsulta(consultar);
}