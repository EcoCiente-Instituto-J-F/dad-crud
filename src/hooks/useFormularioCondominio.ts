import { useEffect, useRef, useState } from "react";

import {
  buscarCondominio,
  listarSindicos,
  salvarCondominio,
} from "../services/condominiosService";
import { validarCondominio } from "../utils/validarCondominio";

import type {
  CadastroCondominio,
  ErrosCondominio,
} from "../types/condominio";
import type { Usuario } from "../types/usuario";

type Estado =
  | { status: "carregando" }
  | { status: "pronto" }
  | { status: "salvando" }
  | { status: "sucesso"; id: string }
  | { status: "erro"; mensagem: string }
  | { status: "indisponivel"; mensagem: string };

interface Retorno {
  estado: Estado;
  formulario: CadastroCondominio;
  erros: ErrosCondominio;
  sindicos: Usuario[];
  alterar: <K extends keyof CadastroCondominio>(
    campo: K,
    valor: CadastroCondominio[K],
  ) => void;
  salvar: () => Promise<void>;
}

function formularioVazio(): CadastroCondominio {
  return {
    nome: "",
    cnpj: "",
    tipo: "RESIDENCIAL",
    codigoAcesso: "",
    sindicoId: "",
    cep: "",
    uf: "SP",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    torres: [],
  };
}

export function useFormularioCondominio(
  id: string | undefined,
  modo: "cadastro" | "edicao",
): Retorno {
  const [estado, setEstado] = useState<Estado>({
    status: "carregando",
  });

  const [formulario, setFormulario] =
    useState<CadastroCondominio>(formularioVazio);

  const [erros, setErros] = useState<ErrosCondominio>({});
  const [sindicos, setSindicos] = useState<Usuario[]>([]);
  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar(): Promise<void> {
      setEstado({ status: "carregando" });
      setErros({});

      try {
        if (modo === "edicao" && !id) {
          throw new Error("Identificador do condomínio ausente.");
        }

        const [usuarios, condominio] = await Promise.all([
          listarSindicos(controller.signal),
          modo === "edicao" && id
            ? buscarCondominio(id, controller.signal)
            : Promise.resolve(null),
        ]);

        if (controller.signal.aborted) return;

        if (modo === "edicao" && !condominio) {
          throw new Error("Condomínio não encontrado.");
        }

        setSindicos(usuarios);
        setFormulario(condominio ?? formularioVazio());
        setEstado({ status: "pronto" });
      } catch (erro: unknown) {
        if (!controller.signal.aborted) {
          setEstado({
            status: "indisponivel",
            mensagem:
              erro instanceof Error
                ? erro.message
                : "Não foi possível carregar o formulário.",
          });
        }
      }
    }

    void carregar();

    return () => {
      controller.abort();
      operacao.current?.abort();
      operacao.current = null;
    };
  }, [id, modo]);

  function alterar<K extends keyof CadastroCondominio>(
    campo: K,
    valor: CadastroCondominio[K],
  ): void {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => ({ ...anterior, [campo]: undefined }));
    setEstado({ status: "pronto" });
  }

  async function salvar(): Promise<void> {
    if (
      operacao.current ||
      (estado.status !== "pronto" && estado.status !== "erro") ||
      (modo === "edicao" && !id)
    ) {
      return;
    }

    const resultado = validarCondominio(formulario);

    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    const controller = new AbortController();
    operacao.current = controller;

    setErros({});
    setEstado({ status: "salvando" });

    try {
      const salvo = await salvarCondominio(
        modo === "edicao" ? id : undefined,
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

  return { estado, formulario, erros, sindicos, alterar, salvar };
}