import { useEffect, useState } from "react";

import type { EstadoRequisicao } from "../types/requisicao";

interface UseConsultaRetorno<T> {
  requisicao: EstadoRequisicao<T>;
  recarregar: () => void;
}

export function useConsulta<T>(
  consultar: (signal: AbortSignal) => Promise<T>,
): UseConsultaRetorno<T> {
  const [requisicao, setRequisicao] = useState<EstadoRequisicao<T>>({
    status: "carregando",
  });

  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar(): Promise<void> {
      setRequisicao({ status: "carregando" });

      try {
        const dados = await consultar(controller.signal);

        if (!controller.signal.aborted) {
          setRequisicao({ status: "sucesso", dados });
        }
      } catch (erro: unknown) {
        if (!controller.signal.aborted) {
          setRequisicao({
            status: "erro",
            mensagem:
              erro instanceof Error
                ? erro.message
                : "Não foi possível carregar os dados.",
          });
        }
      }
    }

    void carregar();

    return () => controller.abort();
  }, [consultar, tentativa]);

  return {
    requisicao,
    recarregar: () => setTentativa((anterior) => anterior + 1),
  };
}