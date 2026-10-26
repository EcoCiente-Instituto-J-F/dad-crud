import { useEffect, useRef, useState } from "react";

import { cancelarColeta, registrarVisita } from "../services/coletasService";
import { validarVisita } from "../utils/validarColeta";
import { dataLocal } from "../utils/calendarioColetas";

import type { RegistroVisita } from "../types/coleta";

type Estado =
  | { status: "pronto" }
  | { status: "salvando" }
  | { status: "sucesso"; mensagem: string }
  | { status: "erro"; mensagem: string };

export function useAcoesColeta(id: string, onAtualizado: () => void) {
  const [estado, setEstado] = useState<Estado>({ status: "pronto" });
  const [motivo, setMotivo] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  const [visita, setVisita] = useState<RegistroVisita>({
    data: dataLocal(new Date()),
    realizada: true,
    confirmada: false,
    observacao: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function executar(tipo: "cancelar" | "visita"): Promise<void> {
    if (operacao.current) return;

    if (tipo === "cancelar" && !confirmando) return;

    if (tipo === "visita") {
      const resultado = validarVisita(visita);

      if (!resultado.valido) {
        setErros(resultado.erros);
        return;
      }
    } else if (motivo.trim().length < 5 || motivo.trim().length > 500) {
      setErros({ motivo: "Informe um motivo entre 5 e 500 caracteres." });
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;

    setErros({});
    setEstado({ status: "salvando" });

    try {
      if (tipo === "cancelar") {
        await cancelarColeta(id, motivo, controller.signal);
      } else {
        await registrarVisita(id, visita, controller.signal);
      }

      if (!controller.signal.aborted) {
        setEstado({
          status: "sucesso",
          mensagem: tipo === "cancelar"
            ? "Coleta cancelada."
            : "Visita registrada.",
        });
        onAtualizado();
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          mensagem: erro instanceof Error ? erro.message : "Falha na operação.",
        });
      }
    } finally {
      if (operacao.current === controller) operacao.current = null;
    }
  }

  return {
    estado,
    erros,
    motivo,
    setMotivo,
    confirmando,
    setConfirmando,
    visita,
    alterarVisita: <K extends keyof RegistroVisita>(
      campo: K,
      valor: RegistroVisita[K],
    ): void => {
      setVisita((anterior) => ({ ...anterior, [campo]: valor }));
      setErros({});
    },
    executar,
  };
}