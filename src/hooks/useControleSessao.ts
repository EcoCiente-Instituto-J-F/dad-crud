import { useEffect,useReducer } from "react";
import { EVENTO_SESSAO } from "../services/sessaoService";

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
EstadoAuth
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

  useEffect(() => {
    function sincronizar(): void {
      const sessao = lerSessao();
      dispatch(sessao ? { tipo: "ATUALIZAR", sessao } : { tipo: "SAIR" });
    }
    window.addEventListener(EVENTO_SESSAO, sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      window.removeEventListener(EVENTO_SESSAO, sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

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

  return {
    estado,
    entrar,
    sair,
  };
}
