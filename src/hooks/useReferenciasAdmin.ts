import { useCallback } from "react";
import { useConsulta } from "./useConsulta";
import { carregarReferenciasAdmin } from "../services/referenciasAdminService";
import type { NomeModulo } from "../types/editorModulo";

export function useReferenciasAdmin(modulo: NomeModulo) {
  const consultar = useCallback((signal: AbortSignal) => carregarReferenciasAdmin(modulo, signal), [modulo]);
  return useConsulta(consultar);
}