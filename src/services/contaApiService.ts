import { apiConfig } from "./apiConfig";
import { ErroHttp } from "./httpService";
import { lerSessao, removerSessao } from "./sessaoService";

import type {
  AlterarSenhaApi,
  AtualizarPerfilApi,
  RedefinirSenhaApi,
} from "../types/perfilApi";

function extrairErro(valor: unknown): {
  mensagem: string | null;
  campos: Record<string, string>;
} {
  if (typeof valor !== "object" || valor === null) {
    return { mensagem: null, campos: {} };
  }

  const dados = valor as Record<string, unknown>;

  const mensagem = [
    dados.mensagem,
    dados.message,
    dados.detail,
  ].find((item): item is string => typeof item === "string");

  const campos: Record<string, string> = {};

  if (
    typeof dados.campos === "object" &&
    dados.campos !== null
  ) {
    for (const [campo, texto] of Object.entries(dados.campos)) {
      if (typeof texto === "string") campos[campo] = texto;
    }
  }

  return { mensagem: mensagem ?? null, campos };
}

async function enviar(
  url: string,
  metodo: "POST" | "PATCH",
  dados: unknown,
  signal: AbortSignal,
  autenticado: boolean,
): Promise<void> {
  try {
    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    const sessao = autenticado ? lerSessao() : null;

    if (autenticado) {
      if (!sessao) {
        window.location.replace("/login");
        throw new ErroHttp(401, "Entre novamente.");
      }

      headers.set("Authorization", `Bearer ${sessao.token}`);
    }

    const resposta = await fetch(url, {
      method: metodo,
      headers,
      body: JSON.stringify(dados),
      signal,
    });

    if (resposta.ok) return;

    if (resposta.status === 401 && autenticado) {
      // Evita apagar uma sessão nova por causa de uma requisição antiga.
      const atual = lerSessao();

      if (atual?.token === sessao?.token) {
        removerSessao();
        window.location.replace("/login");
      }

      throw new ErroHttp(401, "Sua sessão expirou.");
    }

    let conteudo: unknown = null;

    try {
      conteudo = await resposta.json();
    } catch {
      // A resposta pode não conter JSON.
    }

    const erro = extrairErro(conteudo);

    throw new ErroHttp(
      resposta.status,
      erro.mensagem ?? (
        resposta.status === 403
          ? "Você não tem permissão para esta operação."
          : "Não foi possível concluir a operação."
      ),
      erro.campos,
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    if (erro instanceof TypeError) {
      throw new Error(
        "Não foi possível conectar ao serviço. Confira se a API está rodando.",
      );
    }

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível concluir a operação.");
  }
}

export function atualizarMeuPerfilApi(
  dados: AtualizarPerfilApi,
  signal: AbortSignal,
): Promise<void> {
  return enviar(
    `${apiConfig.cadastro}/api/usuarios/me`,
    "PATCH",
    dados,
    signal,
    true,
  );
}

export function alterarMinhaSenhaApi(
  dados: AlterarSenhaApi,
  signal: AbortSignal,
): Promise<void> {
  return enviar(
    `${apiConfig.senha}/senhas/alterar`,
    "POST",
    dados,
    signal,
    true,
  );
}

export function solicitarRecuperacaoApi(
  email: string,
  signal: AbortSignal,
): Promise<void> {
  return enviar(
    `${apiConfig.senha}/senhas/esqueceu`,
    "POST",
    { email },
    signal,
    false,
  );
}

export function redefinirSenhaApi(
  dados: RedefinirSenhaApi,
  signal: AbortSignal,
): Promise<void> {
  return enviar(
    `${apiConfig.senha}/senhas/redefinir`,
    "POST",
    dados,
    signal,
    false,
  );
}