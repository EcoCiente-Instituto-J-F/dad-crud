import { z } from "zod";
import { coletasApi } from "./modulosApiService";
import { requisitarDad } from "./httpService";
import { coletaSchema } from "../types/modulosApi";
import type { ColetaApi } from "../types/modulosApi";

export const calendarioOcorrenciasAtivo = import.meta.env["VITE_CALENDARIO_OCORRENCIAS_ATIVO"] === "true" && !(import.meta.env.DEV && import.meta.env["VITE_MODO_DEMO"] === "true");
const ocorrenciasSchema = z.object({ itens: z.array(coletaSchema.extend({ ocorrenciaEm: z.string().refine((valor) => !Number.isNaN(Date.parse(valor)), "Data da ocorrência inválida.") })), pagina: z.number().int().nonnegative(), tamanho: z.number().int().positive(), totalItens: z.number().int().nonnegative(), totalPaginas: z.number().int().nonnegative() });

export async function buscarColetasCalendario(inicio: string, fim: string, statusId: number | undefined, signal: AbortSignal, condominioId?: number, cooperativaId?: number): Promise<ColetaApi[]> {
  try {
    const itens: ColetaApi[] = []; let pagina = 0; let total = 1;
    do {
      signal.throwIfAborted();
      if (calendarioOcorrenciasAtivo) {
        const parametros = new URLSearchParams({ inicio, fim, pagina: String(pagina), tamanho: "50" });
        for (const [chave, valor] of Object.entries({ statusId, condominioId, cooperativaId })) if (valor !== undefined) parametros.set(chave, String(valor));
        const resposta = ocorrenciasSchema.parse(await requisitarDad(`/api/admin/v1/coletas/calendario?${parametros}`, { signal }));
        if (resposta.pagina !== pagina) throw new Error("Página inesperada no calendário.");
        itens.push(...resposta.itens.map((item) => ({ ...item, dataInicio: item.ocorrenciaEm })));
        total = resposta.totalPaginas;
      } else {
        const resposta = await coletasApi.listar({ inicio, fim, statusId, pagina, tamanho: 50 }, signal);
        if (resposta.pagina !== pagina) throw new Error("Página inesperada no calendário.");
        itens.push(...resposta.itens); total = resposta.totalPaginas;
      }
      pagina += 1;
    } while (pagina < total);
    return itens.filter((item) => (!condominioId || item.condominioId === condominioId) && (!cooperativaId || item.cooperativaId === cooperativaId));
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw erro instanceof Error ? erro : new Error("Não foi possível carregar o calendário.");
  }
}