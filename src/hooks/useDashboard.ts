import { carregarDashboard } from "../services/dashboardService";
import { useConsulta } from "./useConsulta";

export function useDashboard() {
  return useConsulta(carregarDashboard);
}