import { Link, useParams } from "react-router-dom";

import AcoesColeta from "../../components/AcoesColeta";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useColetas } from "../../hooks/useColetas";
import { diasSemana, formatarData } from "../../utils/calendarioColetas";

export default function ColetaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useColetas();

  if (!id) return <p role="alert">Identificador ausente.</p>;

  if (requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={requisicao.mensagem}
        onTentarNovamente={recarregar}
      />
    );
  }

  const coleta = requisicao.dados.coletas.find((item) => item.id === id);

  if (!coleta) {
    return (
      <section className="estado-vazio">
        <h1>Coleta não encontrada</h1>
        <Link className="botao" to="/coletas">Voltar</Link>
      </section>
    );
  }

  const condominio = requisicao.dados.condominios.find(
    (item) => item.id === coleta.condominioId,
  );
  const cooperativa = requisicao.dados.cooperativas.find(
    (item) => item.id === coleta.cooperativaId,
  );

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Detalhes da coleta</h1>
          <p className="pagina-descricao">
            {condominio?.nome ?? "Condomínio indisponível"} ×{" "}
            {cooperativa?.nome ?? "Cooperativa indisponível"}
          </p>
        </div>

        <div className="acoes-pagina">
          <Link className="botao" to="/coletas">Voltar</Link>

          {coleta.status === "AGENDADA" && (
            <Link className="botao" to={`/coletas/${coleta.id}/editar`}>
              Editar
            </Link>
          )}
        </div>
      </div>

      <div className="painel formulario">
        <h2>Agendamento</h2>

        <dl className="detalhes-grade">
          <div>
            <dt>Status</dt>
            <dd>{coleta.status === "AGENDADA" ? "Agendada" : "Cancelada"}</dd>
          </div>
          <div>
            <dt>Período</dt>
            <dd>{formatarData(coleta.dataInicio)} a {formatarData(coleta.dataFim)}</dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>{coleta.horaInicio}–{coleta.horaFim}</dd>
          </div>
          <div>
            <dt>Recorrência</dt>
            <dd>
              {coleta.recorrente
                ? diasSemana
                    .filter((dia) => coleta.diasSemana.includes(dia.id))
                    .map((dia) => dia.nome)
                    .join(", ")
                : "Coleta única"}
            </dd>
          </div>
        </dl>

        {coleta.status === "CANCELADA" && (
          <p className="espaco-superior">
            Motivo: {coleta.motivoCancelamento}
          </p>
        )}

        <section className="secao-formulario">
          <h2>Visitas registradas</h2>

          {coleta.visitas.length === 0 ? (
            <p>Nenhuma visita registrada.</p>
          ) : (
            <div className="tabela-container">
              <table className="tabela-usuarios">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Realizada</th>
                    <th>Confirmada</th>
                    <th>Observação</th>
                  </tr>
                </thead>

                <tbody>
                  {[...coleta.visitas]
                    .sort((a, b) => a.data.localeCompare(b.data))
                    .map((visita) => (
                      <tr key={visita.id}>
                        <td>{formatarData(visita.data)}</td>
                        <td>{visita.realizada ? "Sim" : "Não"}</td>
                        <td>{visita.confirmada ? "Sim" : "Não"}</td>
                        <td>{visita.observacao || "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {coleta.status === "AGENDADA" && (
        <AcoesColeta
          key={coleta.id}
          coleta={coleta}
          onAtualizado={recarregar}
        />
      )}
    </section>
  );
}