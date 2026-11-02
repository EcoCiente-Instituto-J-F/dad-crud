import { useCallback,useState } from "react";
import { buscarColetasCalendario,calendarioOcorrenciasAtivo } from "../services/calendarioColetasService";
import { useConsulta } from "./useConsulta";
export function useCalendarioColetas() {
  const [mes, setMes] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [statusId, setStatusId] = useState<number | undefined>();
  const [condominioId, setCondominioId] = useState<number | undefined>();
  const [cooperativaId, setCooperativaId] = useState<number | undefined>();
  const ano = mes.getFullYear(); const numeroMes = mes.getMonth();
  const consultar = useCallback((signal: AbortSignal) => {
    const inicio = new Date(ano, numeroMes, 1); const fim = new Date(ano, numeroMes + 1, 1); fim.setMilliseconds(-1);
    return buscarColetasCalendario(inicio.toISOString(), fim.toISOString(), statusId, signal, condominioId, cooperativaId);
  }, [ano, numeroMes, statusId, condominioId, cooperativaId]);
  const consulta = useConsulta(consultar);
  return { ...consulta, ocorrenciasAtivas: calendarioOcorrenciasAtivo, mes, statusId, setStatusId, condominioId, setCondominioId, cooperativaId, setCooperativaId,
    mudarMes: (valor: number) => setMes((anterior) => new Date(anterior.getFullYear(), anterior.getMonth() + valor, 1)),
    irParaHoje: () => setMes(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  };
}
