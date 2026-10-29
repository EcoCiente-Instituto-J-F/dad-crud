import { useCallback, useEffect, useRef, useState } from "react";

import { useConsulta } from "./useConsulta";
import { buscarUsuarioApi } from "../services/usuariosApiService";

import {
  alterarMinhaSenhaApi,
  atualizarMeuPerfilApi,
} from "../services/contaApiService";

import {
  lerSessao,
  removerSessao,
  salvarSessao,
} from "../services/sessaoService";

import { ErroHttp } from "../services/httpService";

import type {
  AlterarSenhaApi,
  AtualizarPerfilApi,
} from "../types/perfilApi";

export function useMinhaContaApi() {
  const operacao = useRef<AbortController | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const consultar = useCallback(async (signal: AbortSignal) => {
    const sessao = lerSessao();

    if (!sessao) {
      throw new Error("Sua sessão expirou. Entre novamente.");
    }

    return buscarUsuarioApi(sessao.perfil.id, signal);
  }, []);

  const consulta = useConsulta(consultar);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function executar(
    tipo: "perfil" | "senha",
    dados: AtualizarPerfilApi | AlterarSenhaApi,
  ): Promise<void> {
    if (operacao.current) return;

    const sessao = lerSessao();

    if (!sessao) {
      window.location.replace("/login");
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;
    setSalvando(true);
    setMensagem("");

    try {
      if (tipo === "perfil" && "nome" in dados) {
        await atualizarMeuPerfilApi(dados, controller.signal);
        controller.signal.throwIfAborted();

        const vigente = lerSessao();

        if (vigente?.token !== sessao.token) return;

        if (
          dados.email.trim().toLowerCase() !==
          sessao.perfil.email.toLowerCase()
        ) {
          removerSessao();
          window.location.replace("/login");
          return;
        }

        salvarSessao({
          ...vigente,
          perfil: {
            ...vigente.perfil,
            nome: dados.nome.trim(),
            email: dados.email.trim().toLowerCase(),
            avatar: dados.urlAvatar.trim(),
            telefone: dados.telefone ?? vigente.perfil.telefone,
          },
        });

        // Recarrega também o contexto e o avatar do cabeçalho.
        window.location.replace("/perfil");
      } else if (tipo === "senha" && "senhaAtual" in dados) {
        if (dados.novaSenha !== dados.confirmacaoSenha) {
          throw new Error("A confirmação da senha não corresponde.");
        }

        await alterarMinhaSenhaApi(dados, controller.signal);
        controller.signal.throwIfAborted();

        if (lerSessao()?.token === sessao.token) {
          removerSessao();
          window.location.replace("/login");
        }
      }
    } catch (erro: unknown) {
      if (controller.signal.aborted) return;

      setMensagem(
        erro instanceof ErroHttp
          ? [
            erro.message,
            ...Object.values(erro.campos),
          ].join(" • ")
          : erro instanceof Error
            ? erro.message
            : "Não foi possível salvar.",
      );
    } finally {
      operacao.current = null;

      if (!controller.signal.aborted) {
        setSalvando(false);
      }
    }
  }

  return {
    ...consulta,
    salvando,
    mensagem,
    salvarPerfil: (dados: AtualizarPerfilApi) =>
      executar("perfil", dados),
    salvarSenha: (dados: AlterarSenhaApi) =>
      executar("senha", dados),
  };
}