import { useState } from "react";
import Modal from "../Modal";
import CamposEditorApi from "../CamposEditorApi";
import { useSalvarSecaoRegistro } from "../../hooks/useSalvarSecaoRegistro";
import type { CampoEditor, NomeModulo } from "../../types/editorModulo";

export default function SecaoRegistroModal({ modulo, id, campo, dados, onRecarregar }: {
  modulo: NomeModulo; id: number; campo: CampoEditor; dados: Record<string, unknown>; onRecarregar: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<Record<string, unknown>>({});
  const acao = useSalvarSecaoRegistro(modulo, id);
  return <>
    <button type="button" className="botao" onClick={() => {
      acao.limpar(); setRascunho({ [campo.chave]: structuredClone(dados[campo.chave] ?? (campo.tipo === "array" ? [] : null)) }); setAberto(true);
    }}>{campo.chave === "sindicoId" ? "Vincular síndico" : `Gerenciar ${campo.titulo.toLocaleLowerCase()}`}</button>
    <Modal aberto={aberto} titulo={campo.titulo} onFechar={() => { if (!acao.salvando) setAberto(false); }}>
      <form onSubmit={(evento) => { evento.preventDefault(); void acao.salvar(rascunho, () => { setAberto(false); onRecarregar(); }); }}>
        <fieldset disabled={acao.salvando} className="visual-fieldset">
          <p className="visual-aviso">A lista completa será preservada no envio. Remover um item solicita sua exclusão, sujeita às regras de histórico.</p>
          <CamposEditorApi campos={[campo]} dados={rascunho} onChange={setRascunho} />
          {acao.mensagem && <p className="mensagem-erro" role="alert">{acao.mensagem}</p>}
          <div className="formulario-acoes"><button type="button" className="botao" onClick={() => setAberto(false)}>Cancelar</button><button type="submit" className="botao botao--primario">{acao.salvando ? "Salvando..." : "Salvar alterações"}</button></div>
        </fieldset>
      </form>
    </Modal>
  </>;
}