import { useEffect, useRef, useState } from "react";

import { condominiosApi } from "../services/modulosApiService";

export function useSituacaoCondominio() {
  const operacao = useRef<AbortController | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function alterar(
    id: number,
    ativo: boolean,
    concluido: () => void,
  ): Promise<void> {
    if (operacao.current) return;

    const controller = new AbortController();
    operacao.current = controller;

    setSalvando(true);
    setMensagem("");

    try {
      await condominiosApi.alterarStatus(id, ativo, controller.signal);

      if (!controller.signal.aborted) concluido();
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setMensagem(
          erro instanceof Error ? erro.message : "Falha ao alterar situação.",
        );
      }
    } finally {
      operacao.current = null;
      if (!controller.signal.aborted) setSalvando(false);
    }
  }

  return { alterar, salvando, mensagem };
}