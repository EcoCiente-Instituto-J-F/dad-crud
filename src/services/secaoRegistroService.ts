import { buscarModulo, salvarModulo } from "./editorModuloService";
import type { NomeModulo } from "../types/editorModulo";

export async function salvarSecaoRegistro(modulo: NomeModulo, id: number, alteracoes: Record<string, unknown>, signal: AbortSignal): Promise<void> {
  try {
    const atual = await buscarModulo(modulo, id, signal);
    await salvarModulo(modulo, id, { ...atual, ...alteracoes }, signal);
    signal.throwIfAborted();
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw erro instanceof Error ? erro : new Error("Não foi possível salvar as alterações.");
  }
}