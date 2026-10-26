import { useEffect, useRef, useState } from "react";

import { cadastrarUsuario } from "../services/usuariosService";
import { validarUsuario } from "../utils/validarUsuario";

import type {
  CadastroUsuario,
  ErrosCadastroUsuario,
  Usuario,
} from "../types/usuario";

type EstadoCadastro =
  | { status: "inicial" }
  | { status: "salvando" }
  | { status: "sucesso"; usuario: Usuario }
  | { status: "erro"; mensagem: string };

interface UseCadastroUsuarioRetorno {
  formulario: CadastroUsuario;
  erros: ErrosCadastroUsuario;
  estado: EstadoCadastro;
  alterarCampo: <K extends keyof CadastroUsuario>(
    campo: K,
    valor: CadastroUsuario[K],
  ) => void;
  salvar: () => Promise<void>;
}

export function useCadastroUsuario(): UseCadastroUsuarioRetorno {
  const [formulario, setFormulario] = useState<CadastroUsuario>({
    nome: "",
    email: "",
    cidade: "",
    uf: "",
    tipo: "USUARIO_COMUM",
  });

  const [erros, setErros] = useState<ErrosCadastroUsuario>({});
  const [estado, setEstado] = useState<EstadoCadastro>({
    status: "inicial",
  });

  const requisicao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requisicao.current?.abort();
    };
  }, []);

  function alterarCampo<K extends keyof CadastroUsuario>(
    campo: K,
    valor: CadastroUsuario[K],
  ): void {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros((anterior) => ({
      ...anterior,
      [campo]: undefined,
    }));

    setEstado({ status: "inicial" });
  }

  async function salvar(): Promise<void> {
    if (requisicao.current !== null) {
      return;
    }

    const resultado = validarUsuario(formulario);

    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    setErros({});
    setEstado({ status: "salvando" });

    const controller = new AbortController();
    requisicao.current = controller;

    try {
      const usuario = await cadastrarUsuario(
        resultado.dados,
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setEstado({ status: "sucesso", usuario });
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
      if (requisicao.current === controller) {
        requisicao.current = null;
      }
    }
  }

  return {
    formulario,
    erros,
    estado,
    alterarCampo,
    salvar,
  };
}