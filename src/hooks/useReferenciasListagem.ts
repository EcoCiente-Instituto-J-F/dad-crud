import { useCallback } from "react";
import { useConsulta } from "./useConsulta";
import { carregarReferenciasAdmin } from "../services/referenciasAdminService";
import type { ReferenciasAdmin } from "../types/visualAdmin";
export function useReferenciasListagem(titulo: string) {
  const consultar = useCallback((signal: AbortSignal): Promise<ReferenciasAdmin> => {
    if (titulo === "Coletas") return carregarReferenciasAdmin("coletas", signal);
    if (titulo === "Quizzes") return carregarReferenciasAdmin("quizzes", signal);
    return Promise.resolve({ condominios: [], cooperativas: [], cursos: [], usuarios: [] });
  }, [titulo]);
  return useConsulta(consultar);
}