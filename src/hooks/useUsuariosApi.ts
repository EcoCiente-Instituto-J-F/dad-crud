import { useCallback, useState } from "react";

import { useConsulta } from "./useConsulta";
import { listarUsuariosApi } from "../services/usuariosApiService";

import type { FiltrosUsuariosApi } from "../types/usuarioApi";

export function useUsuariosApi() {
  const [filtros, setFiltros] = useState<FiltrosUsuariosApi>({
    busca: "",
    pagina: 0,
    tamanho: 10,
  });

  const consultar = useCallback(
    (signal: AbortSignal) => listarUsuariosApi(filtros, signal),
    [filtros],
  );

  const { requisicao, recarregar } = useConsulta(consultar);

  function alterarBusca(busca: string): void {
    setFiltros((anterior) => ({
      ...anterior,
      busca,
      pagina: 0,
    }));
  }

  function alterarAtivo(ativo: boolean | undefined): void {
    setFiltros((anterior) => ({
      ...anterior,
      ativo,
      pagina: 0,
    }));
  }

  function alterarTipo(tipoUsuarioId: number | undefined): void {
    setFiltros((anterior) => ({
      ...anterior,
      tipoUsuarioId,
      pagina: 0,
    }));
  }

  function alterarPagina(pagina: number): void {
    if (!Number.isInteger(pagina) || pagina < 0) return;

    setFiltros((anterior) => ({
      ...anterior,
      pagina,
    }));
  }

  return {
    requisicao,
    filtros,
    recarregar,
    alterarBusca,
    alterarAtivo,
    alterarTipo,
    alterarPagina,
  };
}