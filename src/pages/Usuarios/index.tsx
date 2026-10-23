import { RefreshCw } from "lucide-react";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import FiltrosUsuarios from "../../components/FiltrosUsuarios";
import Paginacao from "../../components/Paginacao";
import TabelaUsuarios from "../../components/TabelaUsuarios";

import { useUsuarios } from "../../hooks/useUsuarios";

export default function Usuarios() {
  const {
    requisicao,
    filtros,
    usuariosPagina,
    totalItens,
    totalPaginas,
    porPagina,
    alterarBusca,
    alterarStatus,
    alterarOrdenacao,
    alterarPagina,
    recarregar,
  } = useUsuarios();

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Usuários</h1>

          <p className="pagina-descricao">
            Visualize e gerencie todos os usuários
          </p>
        </div>

        <button
          type="button"
          className="botao"
          onClick={recarregar}
          disabled={requisicao.status === "carregando"}
        >
          <RefreshCw size={17} aria-hidden="true" />
          Atualizar
        </button>
      </div>

      <FiltrosUsuarios
        filtros={filtros}
        onBuscaChange={alterarBusca}
        onStatusChange={alterarStatus}
        onOrdenacaoChange={alterarOrdenacao}
      />

      <div
        className="painel"
        aria-busy={requisicao.status === "carregando"}
      >
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
              Lista carregada. {totalItens} usuário(s) encontrado(s).
            </p>

            <TabelaUsuarios usuarios={usuariosPagina} />

            <Paginacao
              paginaAtual={filtros.pagina}
              totalPaginas={totalPaginas}
              totalItens={totalItens}
              porPagina={porPagina}
              onPaginaChange={alterarPagina}
            />
          </>
        )}
      </div>
    </section>
  );
}