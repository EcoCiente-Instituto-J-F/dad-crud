import { useEffect, useRef, useState } from "react";
import { alterarStatusUsuarioApi } from "../services/usuariosApiService";
export function useStatusUsuarioVisual() {
  const [salvando, setSalvando] = useState(false); const [mensagem, setMensagem] = useState(""); const controle = useRef<AbortController | null>(null);
  useEffect(() => () => controle.current?.abort(), []);
  async function alterar(id: number, ativo: boolean, concluido: () => void): Promise<void> {
    if (controle.current) return; const controller = new AbortController(); controle.current = controller; setSalvando(true); setMensagem("");
    try { await alterarStatusUsuarioApi(id, ativo, controller.signal); if (!controller.signal.aborted) concluido(); }
    catch (erro: unknown) { if (!controller.signal.aborted) setMensagem(erro instanceof Error ? erro.message : "Falha ao alterar situação."); }
    finally { if (controle.current === controller) controle.current = null; if (!controller.signal.aborted) setSalvando(false); }
  }
  return { alterar, salvando, mensagem, limpar: () => setMensagem("") };
}