import { salvarQuiz } from "../services/quizzesService";
import { validarQuiz } from "../utils/validarQuiz";
import { useEditor } from "./useEditor";

import type { CadastroQuiz } from "../types/quiz";

export function useQuizEditor(
  inicial: CadastroQuiz,
  id: string | undefined,
) {
  return useEditor(
    inicial,
    validarQuiz,
    (dados, signal) => salvarQuiz(id, dados, signal),
  );
}