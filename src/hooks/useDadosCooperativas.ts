import { carregarDadosCooperativas } from "../services/cooperativasService";
import { useConsulta } from "./useConsulta";

import type { DadosCooperativas } from "../types/cooperativa";
import type { EstadoRequisicao } from "../types/requisicao";

interface Retorno {
  requisicao: EstadoRequisicao<DadosCooperativas>;
  recarregar: () => void;
}

export function useDadosCooperativas(): Retorno {
  return useConsulta(carregarDadosCooperativas);
}