import { carregarColetas } from "../services/coletasService";
import { useConsulta } from "./useConsulta";

export function useColetas() {
  return useConsulta(carregarColetas);
}