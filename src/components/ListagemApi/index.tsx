import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useId } from "react";

import EstadoRequisicao from "../EstadoRequisicao";
import Paginacao from "../Paginacao";

import type { ListagemApiProps } from "../../types/listagemApi";

export default function ListagemApi<T extends { id: number }>({
  titulo,
  descricao,
  caminhoCadastro,
  busca,
  onBuscaChange,
  filtrosExtras,
  requisicao,
  colunas,
  onRecarregar,
  onPaginaChange,
}: ListagemApiProps<T>) {
  const buscaId = useId();
  const carregando = requisicao.status === "carregando";

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{titulo}</h1>
          <p className="pagina-descricao">{descricao}</p>
        </div>

        <div className="acoes-pagina">
          <button
            type="button"
            className="botao"
            disabled={carregando}
            onClick={onRecarregar}
          >
            <RefreshCw size={17} aria-hidden="true" />
            Atualizar
          </button>

          <Link
            className="botao botao--primario"
            to={caminhoCadastro}
          >
            Cadastrar
          </Link>
        </div>
      </div>

      <div className="filtros-listagem-api">
        <div className="campo">
          <label htmlFor={buscaId}>Pesquisar</label>

          <input
            id={buscaId}
            className="entrada"
            type="search"
            placeholder="Pesquisar registros"
            maxLength={100}
            value={busca}
            onChange={(evento) =>
              onBuscaChange(evento.target.value)
            }
          />
        </div>

        {filtrosExtras}
      </div>

      <div className="painel" aria-busy={carregando}>
        {requisicao.status === "carregando" && (
          <EstadoRequisicao
            estado="carregando"
            mensagem="Carregando registros..."
          />
        )}

        {requisicao.status === "erro" && (
          <EstadoRequisicao
            estado="erro"
            mensagem={requisicao.mensagem}
            onTentarNovamente={onRecarregar}
          />
        )}

        {requisicao.status === "sucesso" && (
          <>
            <p className="resultado-carregamento" role="status">
              {requisicao.dados.totalItens} registro(s) encontrado(s).
            </p>

            {requisicao.dados.itens.length === 0 ? (
              <div className="estado-vazio">
                <h2>Nenhum registro encontrado</h2>
                <p>Altere os filtros ou cadastre um novo registro.</p>
              </div>
            ) : (
              <div className="tabela-container">
                <table className="tabela-usuarios">
                  <thead>
                    <tr>
                      {colunas.map((coluna) => (
                        <th key={coluna.id} scope="col">
                          {coluna.titulo}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {requisicao.dados.itens.map((item) => (
                      <tr key={item.id}>
                        {colunas.map((coluna) => (
                          <td key={coluna.id}>
                            {coluna.renderizar(item)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Paginacao
              paginaAtual={requisicao.dados.pagina + 1}
              totalPaginas={Math.max(
                1,
                requisicao.dados.totalPaginas,
              )}
              totalItens={requisicao.dados.totalItens}
              porPagina={requisicao.dados.tamanho}
              onPaginaChange={(pagina) =>
                onPaginaChange(pagina - 1)
              }
            />
          </>
        )}
      </div>
    </section>
  );
}