import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { salvarAulaAdmin } from "../services/aulasAdminService";
export function useSalvarAula(cursoId: number, aulaId: number | null) {
  const [salvando, setSalvando] = useState(false); const [mensagem, setMensagem] = useState(""); const controle = useRef<AbortController | null>(null); const navigate = useNavigate();
  useEffect(() => () => controle.current?.abort(), []);
  async function salvar(titulo: string, conteudo: string): Promise<void> {
    if (controle.current) return; const controller = new AbortController(); controle.current = controller; setSalvando(true); setMensagem("");
    try { await salvarAulaAdmin(cursoId, aulaId, titulo, conteudo, controller.signal); controller.signal.throwIfAborted(); navigate(`/cursos/${cursoId}`); }
    catch (erro: unknown) { if (!controller.signal.aborted) setMensagem(erro instanceof Error ? erro.message : "Falha ao salvar."); }
    finally { if (controle.current === controller) controle.current = null; if (!controller.signal.aborted) setSalvando(false); }
  }
  return { salvar, salvando, mensagem };
}