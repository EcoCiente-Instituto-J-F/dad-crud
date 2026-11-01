import { coletasApi } from "./modulosApiService";
import { buscarColetasCalendario, calendarioOcorrenciasAtivo } from "./calendarioColetasService";
export async function contarColetasHoje(signal: AbortSignal): Promise<number> {
  try {
    const agora = new Date(); const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()); const fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1); fim.setMilliseconds(-1);
    if (calendarioOcorrenciasAtivo) return (await buscarColetasCalendario(inicio.toISOString(), fim.toISOString(), undefined, signal)).length;
    return (await coletasApi.listar({ inicio: inicio.toISOString(), fim: fim.toISOString(), pagina: 0, tamanho: 1 }, signal)).totalItens;
  } catch (erro: unknown) { if (signal.aborted) throw erro; throw erro instanceof Error ? erro : new Error("Não foi possível contar as coletas."); }
}