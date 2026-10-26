import { listarUsuarios } from "./usuariosService";
import { listarCondominios } from "./condominiosService";
import { listarCooperativas } from "./cooperativasService";
import { listarCursos } from "./cursosService";
import { listarQuizzes } from "./quizzesService";
import { listarColetas } from "./coletasService";

import type { DadosDashboard } from "../types/dashboard";

export async function carregarDashboard(
  signal: AbortSignal,
): Promise<DadosDashboard> {
  try {
    const [
      usuarios,
      condominios,
      cooperativas,
      cursos,
      quizzes,
      coletas,
    ] = await Promise.all([
      listarUsuarios(signal),
      listarCondominios(signal),
      listarCooperativas(signal),
      listarCursos(signal),
      listarQuizzes(signal),
      listarColetas(signal),
    ]);

    return {
      usuarios,
      condominios: condominios.length,
      cooperativas: cooperativas.length,
      cursos: cursos.length,
      quizzes: quizzes.length,
      coletasAgendadas: coletas.filter(
        (coleta) => coleta.status === "AGENDADA",
      ).length,
    };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw new Error("Não foi possível carregar o painel.");
  }
}