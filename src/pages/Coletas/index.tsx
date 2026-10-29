import { Link } from "react-router-dom";

import ListagemApi from "../../components/ListagemApi";

import { useCatalogos } from "../../hooks/useCatalogos";
import { useColetasApi } from "../../hooks/useModulosApi";

import {
  converterDataLocal,
  formatarDataHora,
  preencherDataLocal,
} from "../../utils/datasApi";

import type { ColunaListagemApi } from "../../types/listagemApi";
import type { ColetaApi } from "../../types/modulosApi";

const colunas: ColunaListagemApi<ColetaApi>[] = [
  {
    id: "id",
    titulo: "ID",
    renderizar: (item) => (
      <Link className="usuario-link" to={`/coletas/${item.id}`}>
        #{item.id}
      </Link>
    ),
  },
  {
    id: "condominio",
    titulo: "Condomínio",
    renderizar: (item) => `#${item.condominioId}`,
  },
  {
    id: "cooperativa",
    titulo: "Cooperativa",
    renderizar: (item) => `#${item.cooperativaId}`,
  },
  {
    id: "inicio",
    titulo: "Início",
    renderizar: (item) => formatarDataHora(item.dataInicio),
  },
  {
    id: "status",
    titulo: "Situação",
    renderizar: (item) => item.status,
  },
  {
    id: "recorrencia",
    titulo: "Recorrente",
    renderizar: (item) => (item.recorrente ? "Sim" : "Não"),
  },
  {
    id: "visitas",
    titulo: "Visitas",
    renderizar: (item) => item.visitas.length,
  },
  {
    id: "acoes",
    titulo: "Ações",
    renderizar: (item) => (
      <Link className="botao" to={`/coletas/${item.id}/editar`}>
        Editar
      </Link>
    ),
  },
];

export default function Coletas() {
  const {
    requisicao,
    filtros,
    alterarFiltros,
    alterarPagina,
    recarregar,
  } = useColetasApi();

  const catalogos = useCatalogos();

  const status =
    catalogos.requisicao.status === "sucesso"
      ? catalogos.requisicao.dados.statusAgendamentos
      : [];

  return (
    <>
      {catalogos.requisicao.status === "erro" && (
        <div className="mensagem-erro" role="alert">
          <p>{catalogos.requisicao.mensagem}</p>

          <button
            type="button"
            className="botao"
            onClick={catalogos.recarregar}
          >
            Recarregar opções de situação
          </button>
        </div>
      )}

      <ListagemApi
        titulo="Coletas"
        descricao="Gerencie agendamentos e acompanhe as visitas."
        caminhoCadastro="/coletas/cadastrar"
        busca={filtros.busca ?? ""}
        onBuscaChange={(busca) => alterarFiltros({ busca })}
        requisicao={requisicao}
        colunas={colunas}
        onRecarregar={recarregar}
        onPaginaChange={alterarPagina}
        filtrosExtras={
          <>
            <div className="campo">
              <label htmlFor="coletas-status">Situação</label>

              <select
                id="coletas-status"
                value={filtros.statusId ?? ""}
                disabled={
                  catalogos.requisicao.status !== "sucesso"
                }
                onChange={(evento) =>
                  alterarFiltros({
                    statusId: evento.target.value
                      ? Number(evento.target.value)
                      : undefined,
                  })
                }
              >
                <option value="">Todas</option>

                {status.map((opcao) => (
                  <option key={opcao.id} value={opcao.id}>
                    {opcao.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="coletas-inicio">A partir de</label>

              <input
                id="coletas-inicio"
                className="entrada"
                type="datetime-local"
                value={preencherDataLocal(filtros.inicio ?? null)}
                onChange={(evento) =>
                  alterarFiltros({
                    inicio: evento.target.value
                      ? converterDataLocal(evento.target.value)
                      : undefined,
                  })
                }
              />
            </div>

            <div className="campo">
              <label htmlFor="coletas-fim">Até</label>

              <input
                id="coletas-fim"
                className="entrada"
                type="datetime-local"
                value={preencherDataLocal(filtros.fim ?? null)}
                onChange={(evento) =>
                  alterarFiltros({
                    fim: evento.target.value
                      ? converterDataLocal(evento.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </>
        }
      />
    </>
  );
}