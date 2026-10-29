import { useCallback, useState } from "react";

import { useConsulta } from "./useConsulta";

import {
  carregarDashboardApi,
  coletasApi,
  condominiosApi,
  cooperativasApi,
  cursosApi,
  quizzesApi,
} from "../services/modulosApiService";

import type {
  FiltrosColetasApi,
  FiltrosCondominiosApi,
  FiltrosPaginaApi,
} from "../types/modulosApi";

function useListaApi<T, F extends FiltrosPaginaApi>(
  listar: (filtros: F, signal: AbortSignal) => Promise<T>,
  inicial: F,
) {
  const [filtros, setFiltros] = useState<F>(inicial);

  const consultar = useCallback(
    (signal: AbortSignal) => listar(filtros, signal),
    [listar, filtros],
  );

  const consulta = useConsulta(consultar);

  function alterarFiltros(valores: Partial<F>): void {
    setFiltros((anterior) => ({
      ...anterior,
      ...valores,
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
    ...consulta,
    filtros,
    alterarFiltros,
    alterarPagina,
  };
}

const filtrosCondominios: FiltrosCondominiosApi = {
  busca: "",
  pagina: 0,
  tamanho: 10,
};

const filtrosSimples: FiltrosPaginaApi = {
  busca: "",
  pagina: 0,
  tamanho: 10,
};

const filtrosColetas: FiltrosColetasApi = {
  busca: "",
  pagina: 0,
  tamanho: 10,
};

export function useCondominiosApi() {
  return useListaApi(condominiosApi.listar, filtrosCondominios);
}

export function useCooperativasApi() {
  return useListaApi(cooperativasApi.listar, filtrosSimples);
}

export function useCursosApi() {
  return useListaApi(cursosApi.listar, filtrosSimples);
}

export function useQuizzesApi() {
  return useListaApi(quizzesApi.listar, filtrosSimples);
}

export function useColetasApi() {
  return useListaApi(coletasApi.listar, filtrosColetas);
}

function useDetalheApi<T>(
  buscar: (id: number, signal: AbortSignal) => Promise<T>,
  idRota: string | undefined,
) {
  const consultar = useCallback(
    (signal: AbortSignal) => {
      const id = Number(idRota);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Identificação inválida.");
      }

      return buscar(id, signal);
    },
    [buscar, idRota],
  );

  return useConsulta(consultar);
}

export function useCondominioApi(id: string | undefined) {
  return useDetalheApi(condominiosApi.buscar, id);
}

export function useCooperativaApi(id: string | undefined) {
  return useDetalheApi(cooperativasApi.buscar, id);
}

export function useCursoApi(id: string | undefined) {
  return useDetalheApi(cursosApi.buscar, id);
}

export function useQuizApi(id: string | undefined) {
  return useDetalheApi(quizzesApi.buscar, id);
}

export function useColetaApi(id: string | undefined) {
  return useDetalheApi(coletasApi.buscar, id);
}

export function useDashboardApi(meses: number) {
  const consultar = useCallback(
    (signal: AbortSignal) => carregarDashboardApi(meses, signal),
    [meses],
  );

  return useConsulta(consultar);
}