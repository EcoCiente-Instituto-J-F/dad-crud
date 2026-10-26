import { buscarCurso } from "../services/cursosService";
import { useRegistro } from "./useRegistro";

export function useCurso(id: string | undefined) {
  return useRegistro(id, buscarCurso);
}