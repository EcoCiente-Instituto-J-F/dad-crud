import { simularRequisicao } from "../utils/simularRequisicao";

import {
  validarCredenciais,
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
  try {
    const resultado = validarCredenciais(credenciais);

    if (!resultado.valido) {
      throw new Error("Revise o e-mail e a senha.");
    }

    await simularRequisicao(signal);
    signal.throwIfAborted();

    if (
      resultado.dados.email !== "admin@ecociente.com" ||
      resultado.dados.senha !== senhaDemonstracao
    ) {
      throw new Error("E-mail ou senha incorretos.");
    }

    return {
      _versao: 1,
      expiraEm: Date.now() + 60 * 60 * 1000,
      perfil: {
        id: "admin-demo",
        nome: "Ana Oliveira",
        email: "admin@ecociente.com",
        cpf: "",
        telefone: "11999999999",
        avatar: "",
      },
    };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível entrar.",
    );
  }
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