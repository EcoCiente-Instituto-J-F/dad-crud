import { useEffect, useState } from "react";

import { buscarUsuario } from "../services/usuariosService";

import type { EstadoRequisicao } from "../types/requisicao";
import type { Usuario } from "../types/usuario";

interface UseUsuarioRetorno {
  requisicao: EstadoRequisicao<Usuario | null>;
  recarregar: () => void;
}

export function useUsuario(
  id: string | undefined,
): UseUsuarioRetorno {
  const [requisicao, setRequisicao] = useState<
    EstadoRequisicao<Usuario | null>
  >({
    status: "carregando",
  });

  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    if (!id) {
      setRequisicao({
        status: "erro",
        mensagem: "O identificador do usuário não foi informado.",
      });

      return () => controller.abort();
    }

    const usuarioId = id;

    async function carregar(): Promise<void> {
      setRequisicao({ status: "carregando" });

      try {
        const usuario = await buscarUsuario(
          usuarioId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setRequisicao({
            status: "sucesso",
            dados: usuario,
          });
        }
      } catch (erro: unknown) {
        if (!controller.signal.aborted) {
          setRequisicao({
            status: "erro",
            mensagem:
              erro instanceof Error
                ? erro.message
                : "Não foi possível carregar o usuário.",
          });
        }
      }
    }

    void carregar();

    return () => controller.abort();
  }, [id, tentativa]);

  function recarregar(): void {
    setTentativa((anterior) => anterior + 1);
  }

  return {
    requisicao,
    recarregar,
  };
}