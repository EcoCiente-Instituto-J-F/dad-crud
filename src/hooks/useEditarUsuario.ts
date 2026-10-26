import { useEffect, useRef, useState } from "react";

import {
  atualizarUsuario,
  buscarUsuario,
} from "../services/usuariosService";
import { validarUsuario } from "../utils/validarUsuario";

import type {
  CadastroUsuario,
  ErrosCadastroUsuario,
} from "../types/usuario";

type EstadoEdicao =
  | { status: "carregando" }
  | { status: "pronto" }
  | { status: "salvando" }
  | { status: "sucesso" }
  | { status: "indisponivel"; mensagem: string }
  | { status: "erro"; mensagem: string };

interface UseEditarUsuarioRetorno {
  estado: EstadoEdicao;
  formulario: CadastroUsuario;
  erros: ErrosCadastroUsuario;
  alterarCampo: <K extends keyof CadastroUsuario>(
    campo: K,
    valor: CadastroUsuario[K],
  ) => void;
  salvar: () => Promise<void>;
}

export function useEditarUsuario(
  id: string | undefined,
): UseEditarUsuarioRetorno {
  const [estado, setEstado] = useState<EstadoEdicao>({
    status: "carregando",
  });

  const [formulario, setFormulario] = useState<CadastroUsuario>({
    nome: "",
    email: "",
    cidade: "",
    uf: "",
    tipo: "USUARIO_COMUM",
  });

  const [erros, setErros] = useState<ErrosCadastroUsuario>({});
  const salvamento = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setErros({});

    if (!id) {
      setEstado({
        status: "indisponivel",
        mensagem: "Identificador do usuário não informado.",
      });

      return () => controller.abort();
    }

    const usuarioId = id;

    async function carregar(): Promise<void> {
      setEstado({ status: "carregando" });

      try {
        const usuario = await buscarUsuario(
          usuarioId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        if (!usuario) {
          setEstado({
            status: "indisponivel",
            mensagem: "Usuário não encontrado.",
          });
          return;
        }

        setFormulario({
          nome: usuario.nome,
          email: usuario.email,
          cidade: usuario.cidade,
          uf: usuario.uf,
          tipo: usuario.tipo,
        });

        setEstado({ status: "pronto" });
      } catch (erro: unknown) {
        if (!controller.signal.aborted) {
          setEstado({
            status: "indisponivel",
            mensagem:
              erro instanceof Error
                ? erro.message
                : "Não foi possível carregar o usuário.",
          });
        }
      }
    }

    void carregar();

    return () => {
      controller.abort();
      salvamento.current?.abort();
      salvamento.current = null;
    };
  }, [id]);

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

    setEstado({ status: "pronto" });
  }

  async function salvar(): Promise<void> {
    if (
      !id ||
      salvamento.current !== null ||
      (estado.status !== "pronto" && estado.status !== "erro")
    ) {
      return;
    }

    const resultado = validarUsuario(formulario);

    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    const controller = new AbortController();
    salvamento.current = controller;

    setErros({});
    setEstado({ status: "salvando" });

    try {
      await atualizarUsuario(id, resultado.dados, controller.signal);

      if (!controller.signal.aborted) {
        setEstado({ status: "sucesso" });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível salvar as alterações.",
        });
      }
    } finally {
      if (salvamento.current === controller) {
        salvamento.current = null;
      }
    }
  }

  return { estado, formulario, erros, alterarCampo, salvar };
}