import { Link, useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { nomesMateriais } from "../../data/cooperativa";
import { useDadosCooperativas } from "../../hooks/useDadosCooperativas";

export default function CooperativaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useDadosCooperativas();

  if (!id) {
    return (
      <section className="estado-vazio">
        <h1>Identificador ausente</h1>
        <Link className="botao" to="/cooperativas">Voltar</Link>
      </section>
    );
  }

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

  const cooperativa = requisicao.dados.cooperativas.find(
    (item) => item.id === id,
  );

  if (!cooperativa) {
    return (
      <section className="painel estado-vazio">
        <h1>Cooperativa não encontrada</h1>
        <Link className="botao" to="/cooperativas">Voltar</Link>
      </section>
    );
  }

  const usuario = requisicao.dados.usuarios.find(
    (item) => item.id === cooperativa.usuarioId,
  );

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{cooperativa.nome}</h1>
          <p className="pagina-descricao">
            Cadastrada em{" "}
            {new Date(cooperativa.criadoEm).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="acoes-pagina">
          <Link className="botao" to="/cooperativas">Voltar</Link>

          <Link
            className="botao botao--primario"
            to={`/cooperativas/${cooperativa.id}/editar`}
          >
            Editar e gerenciar pontos
          </Link>
        </div>
      </div>

      <div className="indicadores">
        <div className="painel indicador">
          <strong>{cooperativa.pontos.length}</strong>
          <span>Pontos de coleta</span>
        </div>

        <div className="painel indicador">
          <strong>{cooperativa.materiais.length}</strong>
          <span>Materiais aceitos</span>
        </div>

        <div className="painel indicador">
          <strong>
            {cooperativa.status === "ATIVO" ? "Ativa" : "Inativa"}
          </strong>
          <span>Status</span>
        </div>
      </div>

      <div className="painel formulario">
        <h2>Contato e endereço</h2>

        <dl className="detalhes-grade">
          <div>
            <dt>CNPJ</dt>
            <dd>{cooperativa.cnpj}</dd>
          </div>

          <div>
            <dt>Usuário vinculado</dt>
            <dd>
              {usuario?.nome ?? (
                cooperativa.usuarioId
                  ? "Usuário indisponível"
                  : "Sem vínculo"
              )}
            </dd>
          </div>

          <div>
            <dt>E-mail</dt>
            <dd>{cooperativa.email}</dd>
          </div>

          <div>
            <dt>Telefone</dt>
            <dd>{cooperativa.telefone}</dd>
          </div>

          <div>
            <dt>Endereço</dt>
            <dd>
              {cooperativa.endereco.logradouro},{" "}
              {cooperativa.endereco.numero}
              {cooperativa.endereco.complemento
                ? ` — ${cooperativa.endereco.complemento}`
                : ""}
            </dd>
          </div>

          <div>
            <dt>Localidade</dt>
            <dd>
              {cooperativa.endereco.bairro} —{" "}
              {cooperativa.endereco.cidade}/{cooperativa.endereco.uf}
              {" · CEP "}{cooperativa.endereco.cep}
            </dd>
          </div>
        </dl>

        <section className="secao-formulario">
          <h2>Materiais aceitos</h2>
          <div className="materiais-opcoes">
            {cooperativa.materiais.map((material) => (
              <span className="material-etiqueta" key={material}>
                {nomesMateriais[material]}
              </span>
            ))}
          </div>
        </section>

        <section className="secao-formulario">
          <h2>Pontos de coleta</h2>

          {cooperativa.pontos.length === 0 ? (
            <p>Nenhum ponto cadastrado.</p>
          ) : (
            <div className="tabela-container">
              <table className="tabela-usuarios">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Horário</th>
                    <th>Endereço</th>
                    <th>Materiais</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {cooperativa.pontos.map((ponto) => (
                    <tr key={ponto.id}>
                      <td>{ponto.nome}</td>
                      <td>{ponto.abertura}–{ponto.fechamento}</td>
                      <td>
                        {ponto.endereco.logradouro},{" "}
                        {ponto.endereco.numero} —{" "}
                        {ponto.endereco.cidade}/{ponto.endereco.uf}
                      </td>
                      <td>
                        {ponto.materiais
                          .map((material) => nomesMateriais[material])
                          .join(", ")}
                      </td>
                      <td>
                        {ponto.status === "ATIVO" ? "Ativo" : "Inativo"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}