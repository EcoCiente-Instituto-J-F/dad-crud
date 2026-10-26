import { useEffect, useRef, useState } from "react";

import type {
  ErrosFormulario,
  ResultadoFormulario,
} from "../types/formulario";

type EstadoEditor =
  | { status: "pronto" }
  | { status: "salvando" }
  | { status: "sucesso"; id: string }
  | { status: "erro"; mensagem: string };

interface Retorno<T> {
  formulario: T;
  erros: ErrosFormulario;
  estado: EstadoEditor;
  alterar: <K extends keyof T>(campo: K, valor: T[K]) => void;
  salvar: () => Promise<void>;
}

export function useEditor<T, R extends { id: string }>(
  inicial: T,
  validar: (dados: T) => ResultadoFormulario<T>,
  enviar: (dados: T, signal: AbortSignal) => Promise<R>,
): Retorno<T> {
  const [formulario, setFormulario] = useState<T>(
    () => structuredClone(inicial),
  );

  const [erros, setErros] = useState<ErrosFormulario>({});
  const [estado, setEstado] = useState<EstadoEditor>({
    status: "pronto",
  });

  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  function alterar<K extends keyof T>(campo: K, valor: T[K]): void {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErros({});
    setEstado({ status: "pronto" });
  }

  async function salvar(): Promise<void> {
    if (operacao.current || estado.status === "sucesso") return;

    const resultado = validar(formulario);

    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;

    setErros({});
    setEstado({ status: "salvando" });

    try {
      const salvo = await enviar(resultado.dados, controller.signal);

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