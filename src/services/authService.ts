import { simularRequisicao } from "../utils/simularRequisicao";

import {
  validarPerfil,
  validarSenha,
} from "../utils/validarAuth";

import type {
  Credenciais,
  DadosPerfil,
  DadosSenha,
  PerfilAdmin,
  SessaoAdmin,
} from "../types/auth";

let senhaDemonstracao = "EcoCiente@2026";

export async function autenticar(
  credenciais: Credenciais,
  signal: AbortSignal,
): Promise<SessaoAdmin> {
  const { autenticar: autenticarApi } = await import("./loginService");

  return autenticarApi(credenciais, signal);
}
export async function editarPerfilAdmin(
  perfil: PerfilAdmin,
  dados: DadosPerfil,
  signal: AbortSignal,
): Promise<PerfilAdmin> {
  try {
    const resultado = validarPerfil(dados);

    if (!resultado.valido) {
      throw new Error("Revise os dados do perfil.");
    }

    await simularRequisicao(signal);
    signal.throwIfAborted();

    return {
      ...perfil,
      ...resultado.dados,
    };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível atualizar o perfil.",
    );
  }
}

export async function trocarSenhaAdmin(
  dados: DadosSenha,
  signal: AbortSignal,
): Promise<void> {
  try {
    const resultado = validarSenha(dados);

    if (!resultado.valido) {
      throw new Error("Revise os campos da senha.");
    }

    await simularRequisicao(signal);
    signal.throwIfAborted();

    if (resultado.dados.senhaAtual !== senhaDemonstracao) {
      throw new Error("A senha atual está incorreta.");
    }

    senhaDemonstracao = resultado.dados.novaSenha;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível alterar a senha.",
    );
  }
}

export async function prepararAvatar(
  arquivo: File,
  signal: AbortSignal,
): Promise<string> {
  try {
    if (!["image/png", "image/jpeg", "image/webp"].includes(arquivo.type)) {
      throw new Error("Selecione uma imagem PNG, JPEG ou WebP.");
    }

    if (arquivo.size > 500 * 1024) {
      throw new Error("A imagem deve ter no máximo 500 KB.");
    }

    signal.throwIfAborted();

    return await new Promise<string>((resolve, reject) => {
      const leitor = new FileReader();

      function limpar(): void {
        signal.removeEventListener("abort", cancelar);
      }

      function cancelar(): void {
        leitor.abort();
        limpar();
        reject(new DOMException("Operação cancelada.", "AbortError"));
      }

      leitor.onload = () => {
        limpar();

        if (typeof leitor.result !== "string") {
          reject(new Error("Não foi possível ler a imagem."));
          return;
        }

        resolve(leitor.result);
      };

      leitor.onerror = () => {
        limpar();
        reject(new Error("Não foi possível ler a imagem."));
      };

      signal.addEventListener("abort", cancelar, { once: true });
      leitor.readAsDataURL(arquivo);
    });
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível carregar a imagem.",
    );
  }
}