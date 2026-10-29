import { carregarCatalogos } from "../services/catalogosService";
import { useConsulta } from "./useConsulta";

export function useCatalogos() {
  return useConsulta(carregarCatalogos);
}