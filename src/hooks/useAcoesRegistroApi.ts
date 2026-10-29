import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { coletasApi, quizzesApi } from "../services/modulosApiService";

import type { VisitaRequestApi } from "../types/modulosApi";

export function useAcoesRegistroApi(
  modulo: "coletas" | "quizzes",
  id: number,
) {
  const navigate = useNavigate();
  const operacao = useRef<AbortController | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function executar(
    acao: "cancelar" | "excluir" | "visita",
    visita?: VisitaRequestApi,
  ): Promise<void> {
    if (operacao.current) return;

    if (!Number.isSafeInteger(id) || id <= 0) {
      setMensagem("Identificação inválida.");
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;
    setSalvando(true);
    setMensagem("");

    try {
      if (modulo === "quizzes" && acao === "excluir") {
        await quizzesApi.excluir(id, controller.signal);
      } else if (modulo === "coletas" && acao === "cancelar") {
        await coletasApi.cancelar(id, controller.signal);
      } else if (modulo === "coletas" && acao === "visita" && visita) {
        await coletasApi.registrarVisita(id, visita, controller.signal);
      } else {
        throw new Error("Operação inválida.");
      }

      if (!controller.signal.aborted) {
        navigate(`/${modulo}`, { replace: true });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setMensagem(erro instanceof Error ? erro.message : "Falha na operação.");
      }
    } finally {
      operacao.current = null;
      if (!controller.signal.aborted) setSalvando(false);
    }
  }

  return { executar, salvando, mensagem };
}