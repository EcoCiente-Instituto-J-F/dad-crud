import { sessaoAdminSchema } from "../utils/validarAuth";

import type { SessaoAdmin } from "../types/auth";

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
  } catch {
    throw new Error(
      "Não foi possível salvar a sessão. Verifique o armazenamento do navegador.",
    );
  }
}

export function removerSessao(): void {
  localStorage.removeItem(CHAVE);
}