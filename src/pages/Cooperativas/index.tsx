import { useState } from "react";
import { Link } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useDadosCooperativas } from "../../hooks/useDadosCooperativas";
import { normalizarPesquisa } from "../../utils/usuarios";

export default function Cooperativas() {
  const { requisicao, recarregar } = useDadosCooperativas();

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "TODOS",
  });

  const registros = requisicao.status === "sucesso"
    ? requisicao.dados.cooperativas.filter((cooperativa) => {
      const texto = normalizarPesquisa(
        `${cooperativa.nome} ${cooperativa.cnpj} ${cooperativa.endereco.cidade}`,
      );

      return (
        texto.includes(normalizarPesquisa(filtros.busca)) &&
        (
          filtros.status === "TODOS" ||
          cooperativa.status === filtros.status
        )
      );
    })
    : [];

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Cooperativas</h1>
          <p className="pagina-descricao">
            Gerencie parceiros, materiais e pontos de coleta
          </p>
        </div>

        <div className="acoes-pagina">
          <button
            type="button"
            className="botao"
            onClick={recarregar}
            disabled={requisicao.status === "carregando"}
          >
            Atualizar
          </button>

          <Link
            className="botao botao--primario"
            to="/cooperativas/cadastrar"
          >
            Cadastrar
          </Link>
        </div>
      </div>

      <div className="filtros-condominios">
        <div className="campo">
          <label htmlFor="busca-cooperativa">Pesquisar</label>
          <input
            id="busca-cooperativa"
            className="entrada"
            type="search"
            maxLength={120}
            placeholder="Nome, CNPJ ou cidade"
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
          <label htmlFor="filtro-cooperativa-status">Status</label>
          <select
            id="filtro-cooperativa-status"
            value={filtros.status}
            onChange={(evento) =>
              setFiltros((anterior) => ({
                ...anterior,
                status: evento.target.value,
              }))
            }
          >
            <option value="TODOS">Todas</option>
            <option value="ATIVO">Ativas</option>
            <option value="INATIVO">Inativas</option>
          </select>
        </div>
      </div>

      <div className="painel">
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

        {requisicao.status === "sucesso" && (
          <>
            <p className="resultado-carregamento" role="status">
              {registros.length} cooperativa(s) encontrada(s).
            </p>

            {registros.length === 0 ? (
              <div className="estado-vazio">
                <h2>Nenhuma cooperativa encontrada</h2>
                <p>Altere os filtros ou cadastre uma cooperativa.</p>
              </div>
            ) : (
              <div className="tabela-container">
                <table className="tabela-usuarios">
                  <thead>
                    <tr>
                      <th>Cooperativa</th>
                      <th>CNPJ</th>
                      <th>Localidade</th>
                      <th>Telefone</th>
                      <th>Pontos</th>
                      <th>Materiais</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registros.map((cooperativa) => (
                      <tr key={cooperativa.id}>
                        <td>
                          <Link
                            className="usuario-nome usuario-link"
                            to={`/cooperativas/${cooperativa.id}`}
                          >
                            {cooperativa.nome}
                          </Link>
                        </td>

                        <td>{cooperativa.cnpj}</td>
                        <td>
                          {cooperativa.endereco.cidade}, {cooperativa.endereco.uf}
                        </td>
                        <td>{cooperativa.telefone}</td>
                        <td>{cooperativa.pontos.length}</td>
                        <td>{cooperativa.materiais.length}</td>
                        <td>
                          <span
                            className={
                              cooperativa.status === "ATIVO"
                                ? "status-usuario status-usuario--ativo"
                                : "status-usuario status-usuario--inativo"
                            }
                          >
                            {cooperativa.status === "ATIVO" ? "Ativa" : "Inativa"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}