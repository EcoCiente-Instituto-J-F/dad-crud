import { useEffect, useReducer } from "react";

import { autenticar } from "../services/loginService";

import {
  lerSessao,
  removerSessao,
  salvarSessao,
} from "../services/sessaoService";

import type {
  AcaoAuth,
  AuthContextValue,
  Credenciais,
  DadosPerfil,
  DadosSenha,
  EstadoAuth,
} from "../types/auth";

function reducer(
  estado: EstadoAuth,
  acao: AcaoAuth,
): EstadoAuth {
  switch (acao.tipo) {
    case "ENTRAR":
    case "ATUALIZAR":
      return {
        status: "autenticado",
        sessao: acao.sessao,
      };

    case "SAIR":
      return { status: "visitante" };

    default:
      return estado;
  }
}

function estadoInicial(): EstadoAuth {
  const sessao = lerSessao();

  return sessao
    ? { status: "autenticado", sessao }
    : { status: "visitante" };
}

function limparSessao(): void {
  try {
    removerSessao();
  } catch {
    // O acesso em memória é encerrado mesmo se o armazenamento falhar.
  }
}

export function useControleSessao(): AuthContextValue {
  const [estado, dispatch] = useReducer(
    reducer,
    { status: "visitante" },
    estadoInicial,
  );

  function sair(): void {
    limparSessao();
    dispatch({ tipo: "SAIR" });
  }

  useEffect(() => {
    if (estado.status !== "autenticado") return;

    const restante = estado.sessao.expiraEm - Date.now();

    const temporizador = window.setTimeout(() => {
      limparSessao();
      dispatch({ tipo: "SAIR" });
    }, Math.max(0, restante));

    return () => window.clearTimeout(temporizador);
  }, [estado]);

  async function entrar(
    credenciais: Credenciais,
    signal: AbortSignal,
  ): Promise<void> {
    const sessao = await autenticar(credenciais, signal);

    signal.throwIfAborted();

    if (sessao.expiraEm <= Date.now()) {
      throw new Error("A sessão recebida já expirou. Entre novamente.");
    }

    salvarSessao(sessao);
    dispatch({ tipo: "ENTRAR", sessao });
  }

  async function atualizarPerfil(
    _dados: DadosPerfil,
    _signal: AbortSignal,
  ): Promise<void> {
    throw new Error(
      "A edição de perfil ainda não foi integrada à API.",
    );
  }

  async function atualizarAvatar(
    _arquivo: File,
    _signal: AbortSignal,
  ): Promise<void> {
    throw new Error(
      "A alteração de avatar ainda não foi integrada à API.",
    );
  }

  async function alterarSenha(
    _dados: DadosSenha,
    _signal: AbortSignal,
  ): Promise<void> {
    throw new Error(
      "A alteração de senha ainda não foi integrada à API.",
    );
  }

  return {
    estado,
    entrar,
    sair,
    atualizarPerfil,
    atualizarAvatar,
    alterarSenha,
  };
}