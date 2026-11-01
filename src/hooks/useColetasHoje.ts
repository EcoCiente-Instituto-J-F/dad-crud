import { useConsulta } from "./useConsulta";
import { contarColetasHoje } from "../services/coletasHojeService";

export function useColetasHoje() {
  return useConsulta(contarColetasHoje);
}