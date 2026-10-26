import { useEffect, useRef, useState } from "react";

import { excluirQuiz } from "../services/quizzesService";

type Estado =
  | { status: "inicial" }
  | { status: "confirmando"; id: string }
  | { status: "excluindo"; id: string }
  | { status: "sucesso" }
  | { status: "erro"; id: string; mensagem: string };

export function useExcluirQuiz(onExcluido: () => void) {
  const [estado, setEstado] = useState<Estado>({ status: "inicial" });
  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function confirmar(): Promise<void> {
    if (
      operacao.current ||
      (estado.status !== "confirmando" && estado.status !== "erro")
    ) {
      return;
    }

    const id = estado.id;
    const controller = new AbortController();
    operacao.current = controller;

    setEstado({ status: "excluindo", id });

    try {
      await excluirQuiz(id, controller.signal);

      if (!controller.signal.aborted) {
        setEstado({ status: "sucesso" });
        onExcluido();
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          id,
          mensagem: erro instanceof Error ? erro.message : "Falha ao excluir.",
        });
      }
    } finally {
      if (operacao.current === controller) operacao.current = null;
    }
  }

  return {
    estado,
    confirmar,
    solicitar: (id: string) => setEstado({ status: "confirmando", id }),
    cancelar: () => setEstado({ status: "inicial" }),
  };
}