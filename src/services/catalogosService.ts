import { requisitarDad } from "./httpService";

import { catalogosSchema } from "../types/catalogos";
import type { Catalogos } from "../types/catalogos";

export async function carregarCatalogos(
  signal: AbortSignal,
): Promise<Catalogos> {
  try {
    const resposta = await requisitarDad(
      "/api/admin/v1/catalogos",
      { signal },
    );

    const resultado = catalogosSchema.safeParse(resposta);

    if (!resultado.success) {
      throw new Error(
        "Os catálogos retornados pela API estão em formato inválido.",
      );
    }

    return resultado.data;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível carregar os catálogos.");
  }
}