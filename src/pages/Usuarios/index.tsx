import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import FiltrosUsuariosApi from "../../components/FiltrosUsuariosApi";
import TabelaUsuariosApi from "../../components/TabelaUsuariosApi";
import Paginacao from "../../components/Paginacao";

import { useCatalogos } from "../../hooks/useCatalogos";
import { useUsuariosApi } from "../../hooks/useUsuariosApi";

export default function Usuarios() {
  const {
    requisicao,
    filtros,
    recarregar,
    alterarBusca,
    alterarAtivo,
    alterarTipo,
    alterarPagina,
  } = useUsuariosApi();

  const catalogos = useCatalogos();

  const carregando = requisicao.status === "carregando";

  const pagina =
    requisicao.status === "sucesso" ? requisicao.dados : null;

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Usuários</h1>

          <p className="pagina-descricao">
            Visualize e gerencie os usuários cadastrados.
          </p>
        </div>

        <div className="acoes-pagina">
          <button
            type="button"
            className="botao"
            disabled={carregando}
            onClick={recarregar}
          >
            <RefreshCw size={17} aria-hidden="true" />
            Atualizar
          </button>

          <Link
            className="botao botao--primario"
            to="/usuarios/cadastrar"
          >
            Cadastrar
          </Link>
        </div>
      </div>

      {catalogos.requisicao.status === "carregando" && (
        <p role="status">Carregando opções dos filtros...</p>
      )}

      {catalogos.requisicao.status === "erro" && (
        <div className="mensagem-erro" role="alert">
          <p>{catalogos.requisicao.mensagem}</p>

          <button
            type="button"
            className="botao"
            onClick={catalogos.recarregar}
          >
            Recarregar filtros
          </button>
        </div>
      )}

      <FiltrosUsuariosApi
        busca={filtros.busca ?? ""}
        ativo={filtros.ativo}
        tipoUsuarioId={filtros.tipoUsuarioId}
        tipos={
          catalogos.requisicao.status === "sucesso"
            ? catalogos.requisicao.dados.tiposUsuarios
            : []
        }
        onBuscaChange={alterarBusca}
        onAtivoChange={alterarAtivo}
        onTipoChange={alterarTipo}
      />

      <div className="painel" aria-busy={carregando}>
        {requisicao.status === "carregando" && (
          <EstadoRequisicao
            estado="carregando"
            mensagem="Carregando usuários..."
          />
        )}

        {requisicao.status === "erro" && (
          <EstadoRequisicao
            estado="erro"
            mensagem={requisicao.mensagem}
            onTentarNovamente={recarregar}
          />
        )}

        {pagina && (
          <>
            <p className="resultado-carregamento" role="status">
              {pagina.totalItens} usuário(s) encontrado(s).
            </p>

            <TabelaUsuariosApi usuarios={pagina.itens} />

            <Paginacao
              paginaAtual={pagina.pagina + 1}
              totalPaginas={Math.max(1, pagina.totalPaginas)}
              totalItens={pagina.totalItens}
              porPagina={pagina.tamanho}
              onPaginaChange={(numero) => alterarPagina(numero - 1)}
            />
          </>
        )}
      </div>
    </section>
  );
}