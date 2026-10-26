import { carregarQuizzes } from "../services/quizzesService";
import { useConsulta } from "./useConsulta";

export function useQuizzes() {
  return useConsulta(carregarQuizzes);
}