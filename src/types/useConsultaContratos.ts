
import type { EstadoRequisicao } from "./requisicao";

export interface UseConsultaRetorno<T> {
  requisicao: EstadoRequisicao<T>;
  recarregar: () => void;
}
