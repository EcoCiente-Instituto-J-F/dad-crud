import { usuariosSimulados } from "../data/usuarios";

import type { Usuario } from "../types/usuario";

function aguardar(
  tempo: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Operação cancelada.", "AbortError"));
      return;
    }

    const cancelar = (): void => {
      window.clearTimeout(temporizador);
      signal.removeEventListener("abort", cancelar);

      reject(new DOMException("Operação cancelada.", "AbortError"));
    };

    const temporizador = window.setTimeout(() => {
      signal.removeEventListener("abort", cancelar);
      resolve();
    }, tempo);

    signal.addEventListener("abort", cancelar, { once: true });
  });
}

export async function listarUsuarios(
  signal: AbortSignal,
): Promise<Usuario[]> {
  try {
    await aguardar(600, signal);
    signal.throwIfAborted();

    return usuariosSimulados.map((usuario) => ({ ...usuario }));
  } catch (erro: unknown) {
    if (signal.aborted) {
      throw erro;
    }

    throw new Error(
      "Não foi possível carregar os usuários. Tente novamente.",
    );
  }
}