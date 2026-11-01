import { useEffect, useRef, useState } from "react";
import { lerCsvUsuarios } from "../utils/csvUsuarios";
import { importarUsuarios } from "../services/importacaoUsuariosService";
import type { LinhaImportacao } from "../types/importacaoUsuarios";
import type { CriarUsuarioApi } from "../types/usuarioApi";

export function useImportacaoUsuarios() {
  const [linhas, setLinhas] = useState<LinhaImportacao[]>([]); const [mensagem, setMensagem] = useState(""); const [salvando, setSalvando] = useState(false); const [lendo, setLendo] = useState(false); const [sucesso, setSucesso] = useState<number | null>(null);
  const controle = useRef<AbortController | null>(null); const leitura = useRef(0);
  useEffect(() => () => { controle.current?.abort(); leitura.current += 1; }, []);
  async function selecionar(arquivo: File): Promise<void> {
    const versao = ++leitura.current; setMensagem(""); setLinhas([]); setSucesso(null); setLendo(true);
    try {
      if (arquivo.size > 1024 * 1024) throw new Error("O CSV deve ter no máximo 1 MB.");
      if (!/\.csv$/i.test(arquivo.name)) throw new Error("Selecione um arquivo CSV.");
      const texto = await arquivo.text();
      if (leitura.current === versao) setLinhas(lerCsvUsuarios(texto));
    } catch (erro: unknown) { if (leitura.current === versao) setMensagem(erro instanceof Error ? erro.message : "Não foi possível ler o arquivo."); }
    finally { if (leitura.current === versao) setLendo(false); }
  }
  async function enviar(concluido: () => void): Promise<void> {
    if (controle.current || linhas.length === 0 || linhas.some((linha) => !linha.dados)) return;
    const controller = new AbortController(); controle.current = controller; setSalvando(true); setMensagem("");
    try {
      const dados = linhas.map((linha) => linha.dados).filter((item): item is CriarUsuarioApi => item !== null);
      const quantidade = await importarUsuarios(dados, controller.signal);
      if (!controller.signal.aborted) { setSucesso(quantidade); setLinhas([]); concluido(); }
    } catch (erro: unknown) { if (!controller.signal.aborted) setMensagem(erro instanceof Error ? erro.message : "Falha ao importar."); }
    finally { if (controle.current === controller) controle.current = null; if (!controller.signal.aborted) setSalvando(false); }
  }
  return { linhas, mensagem, salvando, lendo, sucesso, selecionar, enviar };
}