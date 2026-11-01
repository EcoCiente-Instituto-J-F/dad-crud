import { useState } from "react";
import { useParams } from "react-router-dom";
import EditorModuloApi from "../../components/EditorModuloApi";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import Modal from "../../components/Modal";
import { useCondominioApi } from "../../hooks/useModulosApi";
import { useSituacaoCondominio } from "../../hooks/useSituacaoCondominio";

export default function CondominioDetalhes() {
  const { id } = useParams(); const consulta = useCondominioApi(id); const situacao = useSituacaoCondominio();
  const [confirmando, setConfirmando] = useState(false); const [versao, setVersao] = useState(0);
  if (consulta.requisicao.status === "carregando") return <EstadoRequisicao estado="carregando" />;
  if (consulta.requisicao.status === "erro") return <EstadoRequisicao estado="erro" mensagem={consulta.requisicao.mensagem} onTentarNovamente={consulta.recarregar} />;
  const item = consulta.requisicao.dados;
  return <><EditorModuloApi key={versao} modulo="condominios" leitura />
    <section className="painel visual-painel visual-status"><div><h2>Situação do condomínio</h2><p>{item.ativo ? "Ativo" : "Inativo"}</p></div><button type="button" className={`botao ${item.ativo ? "botao--perigo" : "botao--primario"}`} onClick={() => setConfirmando(true)}>{item.ativo ? "Desativar" : "Ativar"}</button></section>
    <Modal aberto={confirmando} titulo={item.ativo ? "Desativar condomínio" : "Ativar condomínio"} onFechar={() => { if (!situacao.salvando) setConfirmando(false); }}>
      <p>Deseja {item.ativo ? "desativar" : "ativar"} <strong>{item.nome}</strong>?</p>
      {situacao.mensagem && <p className="mensagem-erro" role="alert">{situacao.mensagem}</p>}
      <div className="formulario-acoes"><button type="button" className="botao" disabled={situacao.salvando} onClick={() => setConfirmando(false)}>Cancelar</button><button type="button" className="botao botao--primario" disabled={situacao.salvando} onClick={() => void situacao.alterar(item.id, !item.ativo, () => { setConfirmando(false); consulta.recarregar(); setVersao((v) => v + 1); })}>{situacao.salvando ? "Salvando..." : "Confirmar"}</button></div>
    </Modal>
  </>;
}