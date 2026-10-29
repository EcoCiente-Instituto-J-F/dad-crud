import { z } from "zod";

import { requisitarDad } from "./httpService";

import {
  coletaSchema,
  condominioSchema,
  cooperativaSchema,
  cursoSchema,
  dashboardSchema,
  quizSchema,
} from "../types/modulosApi";

import type {
  ColetaRequestApi,
  CondominioRequestApi,
  CooperativaRequestApi,
  CursoRequestApi,
  FiltrosColetasApi,
  FiltrosCondominiosApi,
  FiltrosPaginaApi,
  QuizRequestApi,
  VisitaRequestApi,
} from "../types/modulosApi";

const BASE = "/api/admin/v1";

function validarId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Identificação inválida.");
  }
}

function interpretar<T>(
  schema: z.ZodType<T>,
  resposta: unknown,
): T {
  const resultado = schema.safeParse(resposta);

  if (!resultado.success) {
    const detalhes = resultado.error.issues
      .map(
        (erro) =>
          `${erro.path.join(".") || "resposta"}: ${erro.message}`,
      )
      .join("; ");

    throw new Error(`Resposta da API incompatível: ${detalhes}`);
  }

  return resultado.data;
}

async function consultar<T>(
  caminho: string,
  schema: z.ZodType<T>,
  signal: AbortSignal,
  method = "GET",
  dados?: unknown,
): Promise<T> {
  try {
    const resposta = await requisitarDad(`${BASE}${caminho}`, {
      method,
      signal,
      ...(dados === undefined
        ? {}
        : { body: JSON.stringify(dados) }),
    });

    return interpretar(schema, resposta);
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível concluir a operação.");
  }
}

function montarParametros(
  filtros: FiltrosPaginaApi,
  extras: Record<string, string | number | boolean | undefined> = {},
): string {
  const parametros = new URLSearchParams({
    pagina: String(filtros.pagina),
    tamanho: String(filtros.tamanho),
  });

  if (filtros.busca?.trim()) {
    parametros.set("busca", filtros.busca.trim());
  }

  for (const [chave, valor] of Object.entries(extras)) {
    if (valor !== undefined && valor !== "") {
      parametros.set(chave, String(valor));
    }
  }

  return parametros.toString();
}

function paginaSchema<T>(schema: z.ZodType<T>) {
  return z.object({
    itens: z.array(schema),
    pagina: z.number().int().nonnegative(),
    tamanho: z.number().int().positive(),
    totalItens: z.number().int().nonnegative(),
    totalPaginas: z.number().int().nonnegative(),
  });
}

function criarModulo<T, D>(
  caminho: string,
  schema: z.ZodType<T>,
  metodoEdicao: "PATCH" | "PUT" = "PATCH",
) {
  return {
    listar(filtros: FiltrosPaginaApi, signal: AbortSignal) {
      return consultar(
        `${caminho}?${montarParametros(filtros)}`,
        paginaSchema(schema),
        signal,
      );
    },

    buscar(id: number, signal: AbortSignal) {
      validarId(id);

      return consultar(`${caminho}/${id}`, schema, signal);
    },

    criar(dados: D, signal: AbortSignal) {
      return consultar(caminho, schema, signal, "POST", dados);
    },

    editar(id: number, dados: D, signal: AbortSignal) {
      validarId(id);

      return consultar(
        `${caminho}/${id}`,
        schema,
        signal,
        metodoEdicao,
        dados,
      );
    },
  };
}

const condominiosBase = criarModulo<
  z.infer<typeof condominioSchema>,
  CondominioRequestApi
>("/condominios", condominioSchema);

export const condominiosApi = {
  ...condominiosBase,

  listar(filtros: FiltrosCondominiosApi, signal: AbortSignal) {
    return consultar(
      `/condominios?${montarParametros(filtros, {
        ativo: filtros.ativo,
      })}`,
      paginaSchema(condominioSchema),
      signal,
    );
  },

  alterarStatus(id: number, ativo: boolean, signal: AbortSignal) {
    validarId(id);

    return consultar(
      `/condominios/${id}/status`,
      condominioSchema,
      signal,
      "PATCH",
      { ativo },
    );
  },
};

export const cooperativasApi = criarModulo<
  z.infer<typeof cooperativaSchema>,
  CooperativaRequestApi
>("/cooperativas", cooperativaSchema);

export const cursosApi = criarModulo<
  z.infer<typeof cursoSchema>,
  CursoRequestApi
>("/cursos", cursoSchema);

const quizzesBase = criarModulo<
  z.infer<typeof quizSchema>,
  QuizRequestApi
>("/quizzes", quizSchema, "PUT");

export const quizzesApi = {
  ...quizzesBase,

  async excluir(id: number, signal: AbortSignal): Promise<void> {
    validarId(id);

    try {
      await requisitarDad(`${BASE}/quizzes/${id}`, {
        method: "DELETE",
        signal,
      });
    } catch (erro: unknown) {
      if (signal.aborted) throw erro;

      throw erro instanceof Error
        ? erro
        : new Error("Não foi possível excluir o quiz.");
    }
  },
};

const coletasBase = criarModulo<
  z.infer<typeof coletaSchema>,
  ColetaRequestApi
>("/coletas", coletaSchema);

export const coletasApi = {
  ...coletasBase,

  listar(filtros: FiltrosColetasApi, signal: AbortSignal) {
    return consultar(
      `/coletas?${montarParametros(filtros, {
        statusId: filtros.statusId,
        inicio: filtros.inicio,
        fim: filtros.fim,
      })}`,
      paginaSchema(coletaSchema),
      signal,
    );
  },

  cancelar(id: number, signal: AbortSignal) {
    validarId(id);

    return consultar(
      `/coletas/${id}/cancelamento`,
      coletaSchema,
      signal,
      "POST",
    );
  },

  registrarVisita(
    id: number,
    dados: VisitaRequestApi,
    signal: AbortSignal,
  ) {
    validarId(id);

    if (!dados.realizada && !dados.observacao?.trim()) {
      throw new Error(
        "Informe uma observação quando a visita não aconteceu.",
      );
    }

    return consultar(
      `/coletas/${id}/visitas`,
      coletaSchema,
      signal,
      "POST",
      dados,
    );
  },
};

export function carregarDashboardApi(
  meses: number,
  signal: AbortSignal,
) {
  if (!Number.isInteger(meses) || meses < 1) {
    throw new Error("Período inválido.");
  }

  return consultar(
    `/dashboard?meses=${meses}`,
    dashboardSchema,
    signal,
  );
}