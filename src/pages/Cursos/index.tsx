import { Link } from "react-router-dom";

import ListagemApi from "../../components/ListagemApi";
import { useCursosApi } from "../../hooks/useModulosApi";

import type { ColunaListagemApi } from "../../types/listagemApi";
import type { CursoApi } from "../../types/modulosApi";

const colunas: ColunaListagemApi<CursoApi>[] = [
  {
    id: "id",
    titulo: "ID",
    renderizar: (item) => item.id,
  },
  {
    id: "titulo",
    titulo: "Título",
    renderizar: (item) => (
      <Link className="usuario-link" to={`/cursos/${item.id}`}>
        {item.titulo}
      </Link>
    ),
  },
  {
    id: "aulas",
    titulo: "Aulas",
    renderizar: (item) => item.aulas.length,
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
      <Link className="botao" to={`/cursos/${item.id}/editar`}>
        Editar
      </Link>
    ),
  },
];

export default function Cursos() {
  const {
    requisicao,
    filtros,
    alterarFiltros,
    alterarPagina,
    recarregar,
  } = useCursosApi();

  return (
    <ListagemApi
      titulo="Cursos"
      descricao="Gerencie os cursos e suas aulas."
      caminhoCadastro="/cursos/cadastrar"
      busca={filtros.busca ?? ""}
      onBuscaChange={(busca) => alterarFiltros({ busca })}
      requisicao={requisicao}
      colunas={colunas}
      onRecarregar={recarregar}
      onPaginaChange={alterarPagina}
    />
  );
}