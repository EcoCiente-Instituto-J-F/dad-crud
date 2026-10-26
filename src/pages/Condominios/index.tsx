import { useState } from "react";
import { Link } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useConsulta } from "../../hooks/useConsulta";
import {
  listarCondominios,
  listarSindicos,
} from "../../services/condominiosService";
import { normalizarPesquisa } from "../../utils/usuarios";

import type { Condominio } from "../../types/condominio";
import type { Usuario } from "../../types/usuario";

interface DadosLista {
  condominios: Condominio[];
  sindicos: Usuario[];
}

async function consultarLista(
  signal: AbortSignal,
): Promise<DadosLista> {
  const [condominios, sindicos] = await Promise.all([
    listarCondominios(signal),
    listarSindicos(signal),
  ]);

  return { condominios, sindicos };
}

export default function Condominios() {
  const { requisicao, recarregar } = useConsulta(consultarLista);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "TODOS",
  });

  const dados =
    requisicao.status === "sucesso" ? requisicao.dados : null;

  const registros = dados?.condominios.filter((condominio) => {
    const texto = normalizarPesquisa(
      `${condominio.nome} ${condominio.cnpj} ${condominio.cidade}`,
    );

    return (
      texto.includes(normalizarPesquisa(filtros.busca)) &&
      (
        filtros.status === "TODOS" ||
        condominio.status === filtros.status
      )
    );
  }) ?? [];

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Condomínios</h1>
          <p className="pagina-descricao">
            Gerencie condomínios, torres, síndicos e moradores
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
            to="/condominios/cadastrar"
          >
            Cadastrar
          </Link>
        </div>
      </div>

      <div className="filtros-condominios">
        <div className="campo">
          <label htmlFor="buscar-condominio">Pesquisar</label>
          <input
            id="buscar-condominio"
            type="search"
            className="entrada"
            placeholder="Nome, CNPJ ou cidade"
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
          <label htmlFor="status-condominio">Status</label>
          <select
            id="status-condominio"
            value={filtros.status}
            onChange={(evento) =>
              setFiltros((anterior) => ({
                ...anterior,
                status: evento.target.value,
              }))
            }
          >
            <option value="TODOS">Todos</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
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
              {registros.length} condomínio(s) encontrado(s).
            </p>

            {registros.length === 0 ? (
              <div className="estado-vazio">
                <h2>Nenhum condomínio encontrado</h2>
                <p>Altere os filtros ou cadastre um condomínio.</p>
              </div>
            ) : (
              <div className="tabela-container">
                <table className="tabela-usuarios">
                  <thead>
                    <tr>
                      <th>Condomínio</th>
                      <th>Tipo</th>
                      <th>CNPJ</th>
                      <th>Síndico</th>
                      <th>Moradores</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registros.map((condominio) => (
                      <tr key={condominio.id}>
                        <td>
                          <Link
                            className="usuario-nome usuario-link"
                            to={`/condominios/${condominio.id}`}
                          >
                            {condominio.nome}
                          </Link>
                        </td>

                        <td>{condominio.tipo}</td>
                        <td>{condominio.cnpj}</td>
                        <td>
                          {dados?.sindicos.find(
                            (sindico) =>
                              sindico.id === condominio.sindicoId,
                          )?.nome ?? (
                              condominio.sindicoId
                                ? "Síndico indisponível"
                                : "Sem vínculo"
                            )}
                        </td>
                        <td>{condominio.moradores}</td>
                        <td>
                          <span
                            className={
                              condominio.status === "ATIVO"
                                ? "status-usuario status-usuario--ativo"
                                : "status-usuario status-usuario--inativo"
                            }
                          >
                            {condominio.status === "ATIVO"
                              ? "Ativo"
                              : "Inativo"}
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