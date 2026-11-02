import { esquemasModulo } from "../utils/validarModuloApi";

import {
coletasApi,
condominiosApi,
cooperativasApi,
cursosApi,
quizzesApi,
} from "./modulosApiService";

import type { NomeModulo } from "../types/editorModulo";

export async function buscarModulo(
  modulo: NomeModulo,
  registroId: number,
  signal: AbortSignal,
): Promise<Record<string, unknown>> {
  try {
  switch (modulo) {
    case "condominios":
      return { ...await condominiosApi.buscar(registroId, signal) };
    case "cooperativas":
      return { ...await cooperativasApi.buscar(registroId, signal) };
    case "cursos":
      return { ...await cursosApi.buscar(registroId, signal) };
    case "quizzes":
      return { ...await quizzesApi.buscar(registroId, signal) };
    case "coletas":
      return { ...await coletasApi.buscar(registroId, signal) };
  }

  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw erro instanceof Error ? erro : new Error("Não foi possível concluir a operação.");
  }
}

export async function salvarModulo(
  modulo: NomeModulo,
  registroId: number | null,
  formulario: Record<string, unknown>,
  signal: AbortSignal,
): Promise<void> {
  try {
  switch (modulo) {
    case "condominios": {
      const dados = esquemasModulo.condominio.parse(formulario);

      if (registroId === null) {
        await condominiosApi.criar(dados, signal);
      } else {
        await condominiosApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "cooperativas": {
      const dados = esquemasModulo.cooperativa.parse(formulario);

      if (registroId === null) {
        await cooperativasApi.criar(dados, signal);
      } else {
        await cooperativasApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "cursos": {
      const dados = esquemasModulo.curso.parse(formulario);

      if (registroId === null) {
        await cursosApi.criar(dados, signal);
      } else {
        await cursosApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "quizzes": {
      const dados = esquemasModulo.quiz.parse(formulario);

      if (registroId === null) {
        await quizzesApi.criar(dados, signal);
      } else {
        await quizzesApi.editar(registroId, dados, signal);
      }
      return;
    }

    case "coletas": {
      const dados = esquemasModulo.coleta.parse({
        ...formulario,
        diasSemanaIds: formulario.recorrente
          ? formulario.diasSemanaIds
          : [],
      });

      if (registroId === null) {
        await coletasApi.criar(dados, signal);
      } else {
        await coletasApi.editar(registroId, dados, signal);
      }
    }
  }

  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw erro instanceof Error ? erro : new Error("Não foi possível concluir a operação.");
  }
}
