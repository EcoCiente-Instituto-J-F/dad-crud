import { useEffect, useRef, useState } from "react";

import {
  redefinirSenhaApi,
  solicitarRecuperacaoApi,
} from "../services/contaApiService";

export function useRecuperacaoSenha() {
  const operacao = useRef<AbortController | null>(null);

  const [etapa, setEtapa] = useState<"email" | "codigo" | "sucesso">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function enviar(): Promise<void> {
    if (operacao.current || etapa === "sucesso") return;

    const controller = new AbortController();
    operacao.current = controller;

    setCarregando(true);
    setMensagem("");

    try {
      if (etapa === "email") {
        await solicitarRecuperacaoApi(
          email.trim().toLowerCase(),
          controller.signal,
        );

        if (!controller.signal.aborted) setEtapa("codigo");
      } else {
        if (novaSenha !== confirmacaoSenha) {
          throw new Error("As senhas não correspondem.");
        }

        await redefinirSenhaApi(
          {
            email: email.trim().toLowerCase(),
            token,
            novaSenha,
            confirmacaoSenha,
          },
          controller.signal,
        );

        if (!controller.signal.aborted) setEtapa("sucesso");
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setMensagem(
          erro instanceof Error ? erro.message : "Falha na recuperação.",
        );
      }
    } finally {
      operacao.current = null;
      if (!controller.signal.aborted) setCarregando(false);
    }
  }

  return {
    etapa,
    email,
    setEmail,
    token,
    setToken,
    novaSenha,
    setNovaSenha,
    confirmacaoSenha,
    setConfirmacaoSenha,
    carregando,
    mensagem,
    enviar,
    voltar: () => {
      setEtapa("email");
      setToken("");
      setMensagem("");
    },
  };
}