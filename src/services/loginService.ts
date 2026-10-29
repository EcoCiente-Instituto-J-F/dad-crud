import { z } from "zod";

import { apiConfig } from "./apiConfig";
import { validarCredenciais } from "../utils/validarAuth";

import type { Credenciais, SessaoAdmin } from "../types/auth";

const respostaLoginSchema = z.object({
  token: z.string().min(1),
  tipoToken: z.string().min(1),
  expiraEmSegundos: z.number().int().positive(),
  usuarioId: z.number().int().positive(),
  nome: z.string().trim().min(1),
  email: z.string().email(),
  perfil: z.string(),
});

export async function autenticar(
  credenciais: Credenciais,
  signal: AbortSignal,
): Promise<SessaoAdmin> {
  try {
    const validacao = validarCredenciais(credenciais);

    if (!validacao.valido) {
      throw new Error("Revise o e-mail e a senha.");
    }

    const resposta = await fetch(
      `${apiConfig.autenticacao}/auth/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validacao.dados),
        signal,
      },
    );

    if (!resposta.ok) {
      switch (resposta.status) {
        case 400:
          throw new Error("Revise os dados informados.");

        case 401:
          throw new Error("E-mail ou senha incorretos.");

        case 403:
          throw new Error("Seu acesso não foi autorizado.");

        default:
          throw new Error(
            "Não foi possível entrar. Tente novamente.",
          );
      }
    }

    const conteudo: unknown = await resposta.json();
    const resultado = respostaLoginSchema.safeParse(conteudo);

    if (!resultado.success) {
      throw new Error(
        "A autenticação retornou uma resposta inválida.",
      );
    }

    const dados = resultado.data;

    if (dados.perfil !== "ADMIN") {
      throw new Error(
        "Este painel é exclusivo para administradores.",
      );
    }

    if (dados.tipoToken.toLowerCase() !== "bearer") {
      throw new Error("Tipo de autenticação não suportado.");
    }

    signal.throwIfAborted();

    return {
      _versao: 2,
      token: dados.token,
      tipoToken: "Bearer",
      papel: "ADMIN",
      expiraEm: Date.now() + dados.expiraEmSegundos * 1000,
      perfil: {
        id: dados.usuarioId,
        nome: dados.nome,
        email: dados.email,
        cpf: "",
        telefone: "",
        avatar: "",
      },
    };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    if (erro instanceof TypeError) {
      throw new Error(
        "Não foi possível conectar à autenticação. Confira se a API está rodando.",
      );
    }

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível entrar.");
  }
}