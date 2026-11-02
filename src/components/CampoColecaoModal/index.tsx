import { useState } from "react";
import type { CampoColecaoModalProps } from "../../types/campoColecaoModalContratos";
import CamposEditorApi from "../CamposEditorApi";
import Modal from "../Modal";

export default function CampoColecaoModal({ campo, dados, onChange }: CampoColecaoModalProps) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<Record<string, unknown>>({});
  const valor = dados[campo.chave];
  const resumo = Array.isArray(valor) ? `${valor.length} registro(s)` : campo.opcoes?.find((opcao) => opcao.id === valor)?.nome ?? "Não vinculado";
  return <section className="visual-colecao-resumo"><div><h3>{campo.titulo}</h3><p>{resumo}</p></div>
    <button type="button" className="botao" onClick={() => { setRascunho({ [campo.chave]: structuredClone(valor ?? (campo.tipo === "array" ? [] : null)) }); setAberto(true); }}>{campo.chave === "sindicoId" ? "Vincular síndico" : "Gerenciar"}</button>
    <Modal aberto={aberto} titulo={campo.titulo} onFechar={() => setAberto(false)}>
      <form onSubmit={(evento) => { evento.preventDefault(); onChange({ ...dados, ...rascunho }); setAberto(false); }}>
        <p className="visual-aviso">Aplique ao formulário e depois clique em Salvar. Para desativar um ponto, mantenha-o na lista com “Ponto ativo” desmarcado.</p>
        <CamposEditorApi campos={[campo]} dados={rascunho} onChange={setRascunho} />
        <div className="formulario-acoes"><button type="button" className="botao" onClick={() => setAberto(false)}>Cancelar</button><button type="submit" className="botao botao--primario">Aplicar ao formulário</button></div>
      </form>
    </Modal>
  </section>;
}
