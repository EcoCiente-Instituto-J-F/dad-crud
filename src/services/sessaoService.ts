import { sessaoAdminSchema } from "../utils/validarAuth";

import type { SessaoAdmin } from "../types/auth";

export const EVENTO_SESSAO = "ecociente:sessao-alterada";

const CHAVE = "ecociente:sessao-admin";

export function lerSessao(): SessaoAdmin | null {
  try {
    const texto = localStorage.getItem(CHAVE);

    if (!texto) return null;

    const valor: unknown = JSON.parse(texto);
    const resultado = sessaoAdminSchema.safeParse(valor);

    if (
      !resultado.success ||
      resultado.data.expiraEm <= Date.now()
    ) {
      localStorage.removeItem(CHAVE);
      return null;
    }

    return resultado.data;
  } catch {
    try { localStorage.removeItem(CHAVE); } catch { /* Armazenamento indisponível. */ }
    return null;
  }
}

export function salvarSessao(sessao: SessaoAdmin): void {
  const resultado = sessaoAdminSchema.safeParse(sessao);

  if (!resultado.success) {
    throw new Error("A sessão recebida é inválida.");
  }

  try {
    localStorage.setItem(CHAVE, JSON.stringify(resultado.data));
    window.dispatchEvent(new Event(EVENTO_SESSAO));
  } catch {
    throw new Error(
      "Não foi possível salvar a sessão. Verifique o armazenamento do navegador.",
    );
  }
}

export function removerSessao(): void {
  try {
    localStorage.removeItem(CHAVE);
  } finally {
    window.dispatchEvent(new Event(EVENTO_SESSAO));
  }
}

/** Uma resposta antiga não pode encerrar um login mais recente. */
export function encerrarSessao(token?: string): void {
  if (token !== undefined && lerSessao()?.token !== token) return;
  removerSessao();
}
