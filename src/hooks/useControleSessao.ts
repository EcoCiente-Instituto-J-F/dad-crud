import { useEffect, useReducer, useRef } from "react";

import {
  autenticar,
  editarPerfilAdmin,
  prepararAvatar,
  trocarSenhaAdmin,
} from "../services/authService";

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
  SessaoAdmin,
} from "../types/auth";

function reducer(
  estado: EstadoAuth,
  acao: AcaoAuth,
): EstadoAuth {
  switch (acao.tipo) {
    case "ENTRAR":
    case "ATUALIZAR":
      return { status: "autenticado", sessao: acao.sessao };

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

export function useControleSessao(): AuthContextValue {
  const [estado, dispatch] = useReducer(
    reducer,
    { status: "visitante" },
    estadoInicial,
  );

  const atual = useRef<EstadoAuth>(estado);

  useEffect(() => {
    atual.current = estado;
  }, [estado]);

  function aplicarSessao(sessao: SessaoAdmin): void {
    salvarSessao(sessao);
    atual.current = { status: "autenticado", sessao };
    dispatch({ tipo: "ATUALIZAR", sessao });
  }

  function sair(): void {
    atual.current = { status: "visitante" };
    dispatch({ tipo: "SAIR" });

    try {
      removerSessao();
    } catch {
      // O estado em memória é encerrado mesmo se o armazenamento falhar.
    }
  }

  useEffect(() => {
    if (estado.status !== "autenticado") return;

    const restante = estado.sessao.expiraEm - Date.now();

    const temporizador = window.setTimeout(() => {
      atual.current = { status: "visitante" };
      dispatch({ tipo: "SAIR" });

      try {
        removerSessao();
      } catch {
        // A sessão já foi encerrada em memória.
      }
    }, Math.max(0, restante));

    return () => window.clearTimeout(temporizador);
  }, [estado]);

  async function entrar(
    credenciais: Credenciais,
    signal: AbortSignal,
  ): Promise<void> {
    const sessao = await autenticar(credenciais, signal);
    signal.throwIfAborted();

    salvarSessao(sessao);
    atual.current = { status: "autenticado", sessao };
    dispatch({ tipo: "ENTRAR", sessao });
  }

  async function atualizarPerfil(
    dados: DadosPerfil,
    signal: AbortSignal,
  ): Promise<void> {
    const inicio = atual.current;

    if (inicio.status !== "autenticado") {
      throw new Error("Sua sessão expirou.");
    }

    const perfil = await editarPerfilAdmin(
      inicio.sessao.perfil,
      dados,
      signal,
    );

    signal.throwIfAborted();

    const vigente = atual.current;

    if (
      vigente.status !== "autenticado" ||
      vigente.sessao.expiraEm !== inicio.sessao.expiraEm ||
      vigente.sessao.expiraEm <= Date.now()
    ) {
      throw new Error("Sua sessão expirou.");
    }

    aplicarSessao({
      ...vigente.sessao,
      perfil: {
        ...vigente.sessao.perfil,
        nome: perfil.nome,
        email: perfil.email,
        telefone: perfil.telefone,
      },
    });
  }

  async function atualizarAvatar(
    arquivo: File,
    signal: AbortSignal,
  ): Promise<void> {
    const inicio = atual.current;

    if (inicio.status !== "autenticado") {
      throw new Error("Sua sessão expirou.");
    }

    const avatar = await prepararAvatar(arquivo, signal);
    signal.throwIfAborted();

    const vigente = atual.current;

    if (
      vigente.status !== "autenticado" ||
      vigente.sessao.expiraEm !== inicio.sessao.expiraEm ||
      vigente.sessao.expiraEm <= Date.now()
    ) {
      throw new Error("Sua sessão expirou.");
    }

    aplicarSessao({
      ...vigente.sessao,
      perfil: { ...vigente.sessao.perfil, avatar },
    });
  }

  async function alterarSenha(
    dados: DadosSenha,
    signal: AbortSignal,
  ): Promise<void> {
    if (
      atual.current.status !== "autenticado" ||
      atual.current.sessao.expiraEm <= Date.now()
    ) {
      throw new Error("Sua sessão expirou.");
    }

    await trocarSenhaAdmin(dados, signal);
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