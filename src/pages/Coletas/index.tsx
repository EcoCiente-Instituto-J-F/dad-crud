import { useState } from "react";
import { Link } from "react-router-dom";

import CalendarioColetas from "../../components/CalendarioColetas";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useColetas } from "../../hooks/useColetas";
import { formatarData } from "../../utils/calendarioColetas";
import { normalizarPesquisa } from "../../utils/usuarios";

export default function Coletas() {
  const { requisicao, recarregar } = useColetas();

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "TODOS",
    visualizacao: "lista",
  });

  const dados = requisicao.status === "sucesso" ? requisicao.dados : null;

  const coletas = dados?.coletas.filter((coleta) => {
    const condominio = dados.condominios.find(
      (item) => item.id === coleta.condominioId,
    );
    const cooperativa = dados.cooperativas.find(
      (item) => item.id === coleta.cooperativaId,
    );

    return (
      normalizarPesquisa(`${condominio?.nome ?? ""} ${cooperativa?.nome ?? ""}`)
        .includes(normalizarPesquisa(filtros.busca)) &&
      (filtros.status === "TODOS" || filtros.status === coleta.status)
    );
  }) ?? [];

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Coletas</h1>
          <p className="pagina-descricao">Agendamentos, calendário e visitas</p>
        </div>

        <Link className="botao botao--primario" to="/coletas/cadastrar">
          Cadastrar coleta
        </Link>
      </div>

      <div className="filtros-condominios">
        <div className="campo">
          <label htmlFor="coletas-busca">Pesquisar participantes</label>
          <input
            id="coletas-busca"
            className="entrada"
            type="search"
            maxLength={120}
            value={filtros.busca}
            onChange={(evento) =>
              setFiltros((anterior) => ({
                ...anterior,
                busca: evento.target.value,
              }))
            }
          />
        </div>

        <div className="campo">
          <label htmlFor="coletas-status">Status</label>
          <select
            id="coletas-status"
            value={filtros.status}
            onChange={(evento) =>
              setFiltros((anterior) => ({
                ...anterior,
                status: evento.target.value,
              }))
            }
          >
            <option value="TODOS">Todos</option>
            <option value="AGENDADA">Agendadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="acoes-pagina">
        <button
          className="botao"
          type="button"
          onClick={() =>
            setFiltros((anterior) => ({
              ...anterior,
              visualizacao: anterior.visualizacao === "lista" ? "calendario" : "lista",
            }))
          }
        >
          {filtros.visualizacao === "lista" ? "Ver calendário" : "Ver lista"}
        </button>
      </div>

      {requisicao.status === "carregando" && (
        <EstadoRequisicao estado="carregando" />
      )}

      {requisicao.status === "erro" && (
        <EstadoRequisicao
          estado="erro"
          mensagem={requisicao.mensagem}
          onTentarNovamente={recarregar}
        />
      )}

      {dados && (
        <>
          <p role="status">{coletas.length} agendamento(s) encontrado(s).</p>

          {filtros.visualizacao === "calendario" ? (
            <CalendarioColetas
              coletas={coletas}
              condominios={dados.condominios}
            />
          ) : (
            <div className="painel tabela-container espaco-superior">
              <table className="tabela-usuarios">
                <thead>
                  <tr>
                    <th>Condomínio</th>
                    <th>Cooperativa</th>
                    <th>Período</th>
                    <th>Recorrência</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {coletas.map((coleta) => (
                    <tr key={coleta.id}>
                      <td>
                        {dados.condominios.find(
                          (item) => item.id === coleta.condominioId,
                        )?.nome ?? "Indisponível"}
                      </td>
                      <td>
                        {dados.cooperativas.find(
                          (item) => item.id === coleta.cooperativaId,
                        )?.nome ?? "Indisponível"}
                      </td>
                      <td>
                        {formatarData(coleta.dataInicio)} até{" "}
                        {formatarData(coleta.dataFim)}
                        <br />
                        {coleta.horaInicio}–{coleta.horaFim}
                      </td>
                      <td>{coleta.recorrente ? "Semanal" : "Única"}</td>
                      <td>
                        {coleta.status === "AGENDADA" ? "Agendada" : "Cancelada"}
                      </td>
                      <td>
                        <Link className="botao" to={`/coletas/${coleta.id}`}>
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {coletas.length === 0 && (
                <div className="estado-vazio">Nenhuma coleta encontrada.</div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}