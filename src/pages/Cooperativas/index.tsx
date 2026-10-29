import { Link } from "react-router-dom";

import ListagemApi from "../../components/ListagemApi";
import { useCooperativasApi } from "../../hooks/useModulosApi";

import type { ColunaListagemApi } from "../../types/listagemApi";
import type { CooperativaApi } from "../../types/modulosApi";

const colunas: ColunaListagemApi<CooperativaApi>[] = [
  {
    id: "id",
    titulo: "ID",
    renderizar: (item) => item.id,
  },
  {
    id: "nome",
    titulo: "Nome",
    renderizar: (item) => (
      <Link className="usuario-link" to={`/cooperativas/${item.id}`}>
        {item.nome}
      </Link>
    ),
  },
  {
    id: "cnpj",
    titulo: "CNPJ",
    renderizar: (item) => item.cnpj,
  },
  {
    id: "email",
    titulo: "E-mail",
    renderizar: (item) => item.email || "—",
  },
  {
    id: "telefone",
    titulo: "Telefone",
    renderizar: (item) => item.telefone || "—",
  },
  {
    id: "pontos",
    titulo: "Pontos de coleta",
    renderizar: (item) => item.pontos.length,
  },
  {
    id: "acoes",
    titulo: "Ações",
    renderizar: (item) => (
      <Link className="botao" to={`/cooperativas/${item.id}/editar`}>
        Editar
      </Link>
    ),
  },
];

export default function Cooperativas() {
  const {
    requisicao,
    filtros,
    alterarFiltros,
    alterarPagina,
    recarregar,
  } = useCooperativasApi();

  return (
    <ListagemApi
      titulo="Cooperativas"
      descricao="Gerencie cooperativas e pontos de coleta."
      caminhoCadastro="/cooperativas/cadastrar"
      busca={filtros.busca ?? ""}
      onBuscaChange={(busca) => alterarFiltros({ busca })}
      requisicao={requisicao}
      colunas={colunas}
      onRecarregar={recarregar}
      onPaginaChange={alterarPagina}
    />
  );
}