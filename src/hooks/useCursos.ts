import { listarCursos } from "../services/cursosService";
import { useConsulta } from "./useConsulta";

export function useCursos() {
  return useConsulta(listarCursos);
}