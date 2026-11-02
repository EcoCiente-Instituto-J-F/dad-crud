import { useEffect,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Estado } from "../types/useLoginContratos";

import { validarCredenciais } from "../utils/validarAuth";
import { useAuth } from "./useAuth";

import type { Credenciais } from "../types/auth";



export function useLogin() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState<Credenciais>({
    email: "",
    senha: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<Estado>({ status: "pronto" });

  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  function alterar(campo: keyof Credenciais, valor: string): void {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => ({ ...anterior, [campo]: "" }));
    setEstado({ status: "pronto" });
  }

  async function enviar(retorno: string): Promise<void> {
    if (operacao.current) return;

    const resultado = validarCredenciais(formulario);

    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;

    setErros({});
    setEstado({ status: "carregando" });

    try {
      await entrar(resultado.dados, controller.signal);

      if (!controller.signal.aborted) {
        setEstado({ status: "sucesso" });
        navigate(retorno, { replace: true });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          mensagem:
            erro instanceof Error ? erro.message : "Não foi possível entrar.",
        });
      }
    } finally {
      if (operacao.current === controller) operacao.current = null;
    }
  }

  return { formulario, erros, estado, alterar, enviar };
}
