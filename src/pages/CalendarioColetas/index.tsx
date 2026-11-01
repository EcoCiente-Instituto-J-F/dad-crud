import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useCalendarioColetas } from "../../hooks/useCalendarioColetas";
import { useCatalogos } from "../../hooks/useCatalogos";
import { useReferenciasAdmin } from "../../hooks/useReferenciasAdmin";
import { calendarioOcorrenciasAtivo } from "../../services/calendarioColetasService";
function chaveDia(data: Date): string { return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`; }
export default function CalendarioColetas() {
  const estado = useCalendarioColetas(); const catalogos = useCatalogos(); const referencias = useReferenciasAdmin("coletas");
  const opcoes = referencias.requisicao.status === "sucesso" ? referencias.requisicao.dados : { condominios: [], cooperativas: [] };
  const status = catalogos.requisicao.status === "sucesso" ? catalogos.requisicao.dados.statusAgendamentos : [];
  const primeiro = new Date(estado.mes.getFullYear(), estado.mes.getMonth(), 1); primeiro.setDate(primeiro.getDate() - primeiro.getDay());
  const dias = Array.from({ length: 42 }, (_, i) => { const data = new Date(primeiro); data.setDate(data.getDate() + i); return data; });
  const hoje = chaveDia(new Date()); const coletas = estado.requisicao.status === "sucesso" ? estado.requisicao.dados : [];
  return <section><header className="pagina-cabecalho"><div><h1 className="pagina-titulo">Calendário de coletas</h1><p className="pagina-descricao">{calendarioOcorrenciasAtivo ? "Ocorrências do período" : "Agendamentos por data de início"}</p></div><div className="acoes-pagina"><Link className="botao" to="/coletas">Ver listagem</Link><Link className="botao botao--primario" to="/coletas/cadastrar"><Plus size={17} />Cadastrar coleta</Link></div></header>
    <section className="painel calendario-painel"><div className="calendario-barra"><div className="calendario-navegacao"><button type="button" className="calendario-seta" aria-label="Mês anterior" onClick={() => estado.mudarMes(-1)}><ChevronLeft size={20} /></button><h2 aria-live="polite">{estado.mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h2><button type="button" className="calendario-seta" aria-label="Próximo mês" onClick={() => estado.mudarMes(1)}><ChevronRight size={20} /></button><button type="button" className="botao" onClick={estado.irParaHoje}>Hoje</button></div><button type="button" className="botao" onClick={estado.recarregar}>Atualizar</button></div>
      <div className="visual-calendario-filtros">
        <div className="campo"><label htmlFor="cal-condominio">Condomínio</label><select className="entrada" id="cal-condominio" value={estado.condominioId ?? ""} disabled={referencias.requisicao.status !== "sucesso"} onChange={(e) => estado.setCondominioId(e.target.value ? Number(e.target.value) : undefined)}><option value="">Todos os condomínios</option>{opcoes.condominios.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
        <div className="campo"><label htmlFor="cal-cooperativa">Cooperativa</label><select className="entrada" id="cal-cooperativa" value={estado.cooperativaId ?? ""} disabled={referencias.requisicao.status !== "sucesso"} onChange={(e) => estado.setCooperativaId(e.target.value ? Number(e.target.value) : undefined)}><option value="">Todas as cooperativas</option>{opcoes.cooperativas.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
        <div className="campo"><label htmlFor="cal-status">Situação</label><select className="entrada" id="cal-status" value={estado.statusId ?? ""} disabled={catalogos.requisicao.status !== "sucesso"} onChange={(e) => estado.setStatusId(e.target.value ? Number(e.target.value) : undefined)}><option value="">Todas</option>{status.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
      </div>
      {(estado.condominioId || estado.cooperativaId || estado.statusId) && <button type="button" className="botao" onClick={() => { estado.setCondominioId(undefined); estado.setCooperativaId(undefined); estado.setStatusId(undefined); }}>Limpar filtros</button>}
      {referencias.requisicao.status === "erro" && <p className="mensagem-erro" role="alert">{referencias.requisicao.mensagem} <button type="button" className="botao" onClick={referencias.recarregar}>Recarregar vínculos</button></p>}
      {catalogos.requisicao.status === "erro" && <p className="mensagem-erro" role="alert">{catalogos.requisicao.mensagem} <button type="button" className="botao" onClick={catalogos.recarregar}>Recarregar situações</button></p>}
      {estado.requisicao.status === "carregando" && <EstadoRequisicao estado="carregando" mensagem="Carregando calendário..." />}
      {estado.requisicao.status === "erro" && <EstadoRequisicao estado="erro" mensagem={estado.requisicao.mensagem} onTentarNovamente={estado.recarregar} />}
      {estado.requisicao.status === "sucesso" && <><p className="calendario-resumo" role="status">{coletas.length} {calendarioOcorrenciasAtivo ? "ocorrência(s)" : "agendamento(s)"} no período selecionado.</p><div className="calendario-rolagem"><div className="calendario-grade">{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((v) => <div key={v} className="calendario-semana">{v}</div>)}{dias.map((dia) => {
        const chave = chaveDia(dia); const pertence = dia.getMonth() === estado.mes.getMonth();
        const eventos = pertence ? coletas.filter((c) => chaveDia(new Date(c.dataInicio)) === chave).sort((a, b) => Date.parse(a.dataInicio) - Date.parse(b.dataInicio)) : [];
        return <div key={chave} className={`calendario-dia ${pertence ? "" : "calendario-dia--fora"}`}><time dateTime={chave} className={`calendario-numero ${chave === hoje ? "calendario-numero--hoje" : ""}`}>{dia.getDate()}</time>{eventos.map((c) => <Link key={`${c.id}-${c.dataInicio}`} className={`calendario-evento ${/cancel/i.test(c.status) ? "calendario-evento--cancelado" : ""}`} to={`/coletas/${c.id}`}><strong>{new Date(c.dataInicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · #{c.id}</strong><span>{opcoes.condominios.find((v) => v.id === c.condominioId)?.nome ?? `Condomínio #${c.condominioId}`}</span><span>{opcoes.cooperativas.find((v) => v.id === c.cooperativaId)?.nome ?? `Cooperativa #${c.cooperativaId}`}</span><span>{c.status}{c.recorrente ? " · Recorrente" : ""}</span></Link>)}</div>;
      })}</div></div></>}
    </section>
  </section>;
}