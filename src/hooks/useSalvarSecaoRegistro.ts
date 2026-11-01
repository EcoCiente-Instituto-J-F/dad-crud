import { useEffect, useRef, useState } from "react";
import { salvarSecaoRegistro } from "../services/secaoRegistroService";
import type { NomeModulo } from "../types/editorModulo";

export function useSalvarSecaoRegistro(modulo: NomeModulo, id: number) {
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const controle = useRef<AbortController | null>(null);
  useEffect(() => () => controle.current?.abort(), []);
  async function salvar(dados: Record<string, unknown>, concluido: () => void): Promise<void> {
    if (controle.current) return;
    const controller = new AbortController(); controle.current = controller;
    setSalvando(true); setMensagem("");
    try {
      await salvarSecaoRegistro(modulo, id, dados, controller.signal);
      controller.signal.throwIfAborted(); concluido();
    } catch (erro: unknown) {
      if (!controller.signal.aborted) setMensagem(erro instanceof Error ? erro.message : "Falha ao salvar.");
    } finally {
      if (controle.current === controller) controle.current = null;
      if (!controller.signal.aborted) setSalvando(false);
    }
  }
  return { salvar, salvando, mensagem, limpar: () => setMensagem("") };
}