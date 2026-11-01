import { z } from "zod";
import { requisitarDad } from "./httpService";
import type { CriarUsuarioApi } from "../types/usuarioApi";

export const importacaoAtiva = import.meta.env["VITE_IMPORTACAO_USUARIOS_ATIVA"] === "true" && !(import.meta.env.DEV && import.meta.env["VITE_MODO_DEMO"] === "true");

export async function importarUsuarios(dados: CriarUsuarioApi[], signal: AbortSignal): Promise<number> {
  try {
    if (!importacaoAtiva) throw new Error("O envio da importação ainda não foi habilitado.");
    const resposta = await requisitarDad("/api/admin/v1/usuarios/importacao", { method: "POST", body: JSON.stringify({ usuarios: dados }), signal });
    const resultado = z.object({ importados: z.number().int().nonnegative() }).parse(resposta);
    if (resultado.importados !== dados.length) throw new Error("A API retornou uma quantidade diferente da enviada. Confira os registros antes de tentar novamente.");
    return resultado.importados;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw erro instanceof Error ? erro : new Error("Falha na importação.");
  }
}