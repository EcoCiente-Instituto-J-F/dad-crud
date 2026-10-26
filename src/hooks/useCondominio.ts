import { useEffect, useRef, useState } from "react";

import {
  alterarStatusCondominio,
  buscarCondominio,
  listarSindicos,
} from "../services/condominiosService";

import type { Condominio } from "../types/condominio";
import type { EstadoRequisicao } from "../types/requisicao";
import type { Usuario } from "../types/usuario";

interface DadosDetalhe {
  condominio: Condominio | null;
  sindicos: Usuario[];
}

type EstadoAcao =
  | { status: "inicial" }
  | { status: "confirmando" }
  | { status: "salvando" }
  | { status: "sucesso"; mensagem: string }
  | { status: "erro"; mensagem: string };

interface Retorno {
  requisicao: EstadoRequisicao<DadosDetalhe>;
  acao: EstadoAcao;
  abrirConfirmacao: () => void;
  cancelar: () => void;
  confirmar: () => Promise<void>;
  recarregar: () => void;
}

export function useCondominio(id: string | undefined): Retorno {
  const [requisicao, setRequisicao] =
    useState<EstadoRequisicao<DadosDetalhe>>({
      status: "carregando",
    });

  const [acao, setAcao] = useState<EstadoAcao>({
    status: "inicial",
  });

  const [tentativa, setTentativa] = useState(0);
  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar(): Promise<void> {
      setRequisicao({ status: "carregando" });
      setAcao({ status: "inicial" });

      try {
        if (!id) {
          throw new Error("Identificador do condomínio ausente.");
        }

        const [condominio, sindicos] = await Promise.all([
          buscarCondominio(id, controller.signal),
          listarSindicos(controller.signal),
        ]);

        if (!controller.signal.aborted) {
          setRequisicao({
            status: "sucesso",
            dados: { condominio, sindicos },
          });
        }
      } catch (erro: unknown) {
        if (!controller.signal.aborted) {
          setRequisicao({
            status: "erro",
            mensagem:
              erro instanceof Error
                ? erro.message
                : "Não foi possível carregar o condomínio.",
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
  }, [id, tentativa]);

  async function confirmar(): Promise<void> {
    if (
      operacao.current ||
      requisicao.status !== "sucesso" ||
      !requisicao.dados.condominio ||
      (acao.status !== "confirmando" && acao.status !== "erro")
    ) {
      return;
    }

    const condominio = requisicao.dados.condominio;
    const controller = new AbortController();
    operacao.current = controller;

    setAcao({ status: "salvando" });

    try {
      const atualizado = await alterarStatusCondominio(
        condominio.id,
        condominio.status === "ATIVO" ? "INATIVO" : "ATIVO",
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setRequisicao({
          status: "sucesso",
          dados: {
            ...requisicao.dados,
            condominio: atualizado,
          },
        });

        setAcao({
          status: "sucesso",
          mensagem: "Status atualizado com sucesso.",
        });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setAcao({
          status: "erro",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível alterar o status.",
        });
      }
    } finally {
      if (operacao.current === controller) {
        operacao.current = null;
      }
    }
  }

  return {
    requisicao,
    acao,
    abrirConfirmacao: () => setAcao({ status: "confirmando" }),
    cancelar: () => setAcao({ status: "inicial" }),
    confirmar,
    recarregar: () => setTentativa((anterior) => anterior + 1),
  };
}