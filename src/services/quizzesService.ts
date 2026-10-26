import { criarRepositorio } from "./repositorioLocal";
import { buscarCurso, listarCursos } from "./cursosService";
import { quizSchema, validarQuiz } from "../utils/validarQuiz";

import type { CadastroQuiz, DadosQuizzes, Quiz } from "../types/quiz";

const repositorio = criarRepositorio<Quiz>(
  "ecociente:quizzes",
  quizSchema,
);

export const listarQuizzes = repositorio.listar;
export const buscarQuiz = repositorio.buscar;
export const excluirQuiz = repositorio.remover;

export async function carregarQuizzes(
  signal: AbortSignal,
): Promise<DadosQuizzes> {
  try {
    const [quizzes, cursos] = await Promise.all([
      listarQuizzes(signal),
      listarCursos(signal),
    ]);

    return { quizzes, cursos };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw new Error("Não foi possível carregar os quizzes.");
  }
}

export async function salvarQuiz(
  id: string | undefined,
  formulario: CadastroQuiz,
  signal: AbortSignal,
): Promise<Quiz> {
  try {
    const resultado = validarQuiz(formulario);

    if (!resultado.valido) {
      throw new Error("Revise as configurações e perguntas.");
    }

    const [curso, quizzes] = await Promise.all([
      buscarCurso(resultado.dados.cursoId, signal),
      listarQuizzes(signal),
    ]);

    if (!curso?.aulas.some((aula) => aula.id === resultado.dados.aulaId)) {
      throw new Error("A aula selecionada não pertence ao curso.");
    }

    if (id && !quizzes.some((quiz) => quiz.id === id)) {
      throw new Error("Quiz não encontrado.");
    }

    if (
      quizzes.some(
        (quiz) =>
          quiz.id !== id &&
          quiz.cursoId === resultado.dados.cursoId &&
          quiz.aulaId === resultado.dados.aulaId,
      )
    ) {
      throw new Error("Esta aula já possui um quiz.");
    }

    return await repositorio.salvar(
      { ...resultado.dados, id: id ?? crypto.randomUUID() },
      signal,
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível salvar o quiz.",
    );
  }
}