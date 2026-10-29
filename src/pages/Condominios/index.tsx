import { Link } from "react-router-dom";

import ListagemApi from "../../components/ListagemApi";
import { useCondominiosApi } from "../../hooks/useModulosApi";

import type { ColunaListagemApi } from "../../types/listagemApi";
import type { CondominioApi } from "../../types/modulosApi";

const colunas: ColunaListagemApi<CondominioApi>[] = [
  {
    id: "id",
    titulo: "ID",
    renderizar: (item) => item.id,
  },
  {
    id: "nome",
    titulo: "Nome",
    renderizar: (item) => (
      <Link className="usuario-link" to={`/condominios/${item.id}`}>
        {item.nome}
      </Link>
    ),
  },
  {
    id: "cnpj",
    titulo: "CNPJ",
    renderizar: (item) => item.cnpj || "—",
  },
  {
    id: "cidade",
    titulo: "Cidade / UF",
    renderizar: (item) =>
      [item.endereco?.cidade, item.endereco?.uf]
        .filter(Boolean)
        .join(" / ") || "—",
  },
  {
    id: "torres",
    titulo: "Torres",
    renderizar: (item) => item.torres.length,
  },
  {
    id: "situacao",
    titulo: "Situação",
    renderizar: (item) => (item.ativo ? "Ativo" : "Inativo"),
  },
  {
    id: "acoes",
    titulo: "Ações",
    renderizar: (item) => (
      <Link className="botao" to={`/condominios/${item.id}/editar`}>
        Editar
      </Link>
    ),
  },
];

export default function Condominios() {
  const {
    requisicao,
    filtros,
    alterarFiltros,
    alterarPagina,
    recarregar,
  } = useCondominiosApi();

  return (
    <ListagemApi
      titulo="Condomínios"
      descricao="Gerencie os condomínios cadastrados."
      caminhoCadastro="/condominios/cadastrar"
      busca={filtros.busca ?? ""}
      onBuscaChange={(busca) => alterarFiltros({ busca })}
      requisicao={requisicao}
      colunas={colunas}
      onRecarregar={recarregar}
      onPaginaChange={alterarPagina}
      filtrosExtras={
        <div className="campo">
          <label htmlFor="condominios-situacao">Situação</label>

          <select
            id="condominios-situacao"
            value={
              filtros.ativo === undefined
                ? ""
                : String(filtros.ativo)
            }
            onChange={(evento) =>
              alterarFiltros({
                ativo:
                  evento.target.value === ""
                    ? undefined
                    : evento.target.value === "true",
              })
            }
          >
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      }
    />
  );
}