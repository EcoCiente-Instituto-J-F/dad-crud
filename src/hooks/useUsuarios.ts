import { useEffect, useState } from "react";

import { listarUsuarios } from "../services/usuariosService";
import { filtrarEOrdenarUsuarios } from "../utils/usuarios";

import type { EstadoRequisicao } from "../types/requisicao";
import type {
  FiltrosUsuarios,
  FiltroStatusUsuario,
  OrdenacaoUsuario,
  Usuario,
} from "../types/usuario";

interface UseUsuariosRetorno {
  requisicao: EstadoRequisicao<Usuario[]>;
  filtros: FiltrosUsuarios;
  usuariosPagina: Usuario[];
  totalItens: number;
  totalPaginas: number;
  porPagina: number;
  alterarBusca: (busca: string) => void;
  alterarStatus: (status: FiltroStatusUsuario) => void;
  alterarOrdenacao: (ordenacao: OrdenacaoUsuario) => void;
  alterarPagina: (pagina: number) => void;
  recarregar: () => void;
}

const POR_PAGINA = 6;

export function useUsuarios(): UseUsuariosRetorno {
  const [requisicao, setRequisicao] = useState<
    EstadoRequisicao<Usuario[]>
  >({
    status: "carregando",
  });

  const [filtros, setFiltros] = useState<FiltrosUsuarios>({
    busca: "",
    status: "TODOS",
    ordenacao: "NOME_ASC",
    pagina: 1,
  });

  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar(): Promise<void> {
      setRequisicao({ status: "carregando" });

      try {
        const usuarios = await listarUsuarios(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setRequisicao({
          status: "sucesso",
          dados: usuarios,
        });
      } catch (erro: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        setRequisicao({
          status: "erro",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Ocorreu um erro ao carregar os usuários.",
        });
      }
    }

    void carregar();

    return () => {
      controller.abort();
    };
  }, [tentativa]);

  const usuarios =
    requisicao.status === "sucesso" ? requisicao.dados : [];

  const usuariosFiltrados = filtrarEOrdenarUsuarios(
    usuarios,
    filtros,
  );

  const totalItens = usuariosFiltrados.length;

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalItens / POR_PAGINA),
  );

  const paginaAtual = Math.min(filtros.pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * POR_PAGINA;

  const usuariosPagina = usuariosFiltrados.slice(
    inicio,
    inicio + POR_PAGINA,
  );

  function alterarBusca(busca: string): void {
    setFiltros((anterior) => ({
      ...anterior,
      busca,
      pagina: 1,
    }));
  }

  function alterarStatus(status: FiltroStatusUsuario): void {
    setFiltros((anterior) => ({
      ...anterior,
      status,
      pagina: 1,
    }));
  }

  function alterarOrdenacao(ordenacao: OrdenacaoUsuario): void {
    setFiltros((anterior) => ({
      ...anterior,
      ordenacao,
      pagina: 1,
    }));
  }

  function alterarPagina(pagina: number): void {
    setFiltros((anterior) => ({
      ...anterior,
      pagina: Math.max(1, Math.min(pagina, totalPaginas)),
    }));
  }

  function recarregar(): void {
    setTentativa((anterior) => anterior + 1);
  }

  return {
    requisicao,
    filtros: {
      ...filtros,
      pagina: paginaAtual,
    },
    usuariosPagina,
    totalItens,
    totalPaginas,
    porPagina: POR_PAGINA,
    alterarBusca,
    alterarStatus,
    alterarOrdenacao,
    alterarPagina,
    recarregar,
  };
}