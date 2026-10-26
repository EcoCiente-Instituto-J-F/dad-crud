import { useEffect, useRef, useState } from "react";

import { desativarUsuario } from "../services/usuariosService";

type EstadoDesativacao =
  | { status: "inicial" }
  | { status: "confirmando" }
  | { status: "salvando" }
  | { status: "sucesso" }
  | { status: "erro"; mensagem: string };

interface UseDesativarUsuarioRetorno {
  estado: EstadoDesativacao;
  abrirConfirmacao: () => void;
  cancelar: () => void;
  confirmar: () => Promise<void>;
}

export function useDesativarUsuario(
  usuarioId: string,
  onDesativado: () => void,
): UseDesativarUsuarioRetorno {
  const [estado, setEstado] = useState<EstadoDesativacao>({
    status: "inicial",
  });

  const requisicao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => requisicao.current?.abort();
  }, []);

  function abrirConfirmacao(): void {
    setEstado({ status: "confirmando" });
  }

  function cancelar(): void {
    setEstado({ status: "inicial" });
  }

  async function confirmar(): Promise<void> {
    if (
      requisicao.current !== null ||
      (estado.status !== "confirmando" && estado.status !== "erro")
    ) {
      return;
    }

    const controller = new AbortController();
    requisicao.current = controller;
    setEstado({ status: "salvando" });

    try {
      await desativarUsuario(usuarioId, controller.signal);

      if (!controller.signal.aborted) {
        setEstado({ status: "sucesso" });
        onDesativado();
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível desativar o usuário.",
        });
      }
    } finally {
      if (requisicao.current === controller) {
        requisicao.current = null;
      }
    }
  }

  return { estado, abrirConfirmacao, cancelar, confirmar };
}