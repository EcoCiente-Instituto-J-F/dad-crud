import { useEffect, useRef, useState } from "react";

import { salvarCooperativa } from "../services/cooperativasService";
import { validarCooperativa } from "../utils/validarCooperativa";

import type {
  CadastroCooperativa,
  ErrosCooperativa,
} from "../types/cooperativa";

type Estado =
  | { status: "pronto" }
  | { status: "salvando" }
  | { status: "sucesso"; id: string }
  | { status: "erro"; mensagem: string };

interface Retorno {
  formulario: CadastroCooperativa;
  erros: ErrosCooperativa;
  estado: Estado;
  alterar: <K extends keyof CadastroCooperativa>(
    campo: K,
    valor: CadastroCooperativa[K],
  ) => void;
  salvar: () => Promise<void>;
}

export function useSalvarCooperativa(
  inicial: CadastroCooperativa,
  id: string | undefined,
): Retorno {
  const [formulario, setFormulario] =
    useState<CadastroCooperativa>(() => structuredClone(inicial));

  const [erros, setErros] = useState<ErrosCooperativa>({});
  const [estado, setEstado] = useState<Estado>({ status: "pronto" });
  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  function alterar<K extends keyof CadastroCooperativa>(
    campo: K,
    valor: CadastroCooperativa[K],
  ): void {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErros({});
    setEstado({ status: "pronto" });
  }

  async function salvar(): Promise<void> {
    if (operacao.current) return;

    const resultado = validarCooperativa(formulario);

    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;

    setErros({});
    setEstado({ status: "salvando" });

    try {
      const salvo = await salvarCooperativa(
        id,
        resultado.dados,
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setEstado({ status: "sucesso", id: salvo.id });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível salvar.",
        });
      }
    } finally {
      if (operacao.current === controller) {
        operacao.current = null;
      }
    }
  }

  return { formulario, erros, estado, alterar, salvar };
}