import { Link } from "react-router-dom";

import ListagemApi from "../../components/ListagemApi";
import { useQuizzesApi } from "../../hooks/useModulosApi";

import type { ColunaListagemApi } from "../../types/listagemApi";
import type { QuizApi } from "../../types/modulosApi";

const colunas: ColunaListagemApi<QuizApi>[] = [
  {
    id: "id",
    titulo: "ID",
    renderizar: (item) => item.id,
  },
  {
    id: "titulo",
    titulo: "Título",
    renderizar: (item) => item.titulo,
  },
  {
    id: "curso",
    titulo: "Curso",
    renderizar: (item) => `#${item.cursoId}`,
  },
  {
    id: "aula",
    titulo: "Aula",
    renderizar: (item) => `#${item.aulaId}`,
  },
  {
    id: "nota",
    titulo: "Nota mínima",
    renderizar: (item) => `${item.notaMinima}%`,
  },
  {
    id: "pontos",
    titulo: "Pontos",
    renderizar: (item) => item.pontos,
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
      <Link className="botao" to={`/quizzes/${item.id}/editar`}>
        Editar
      </Link>
    ),
  },
];

export default function Quizzes() {
  const {
    requisicao,
    filtros,
    alterarFiltros,
    alterarPagina,
    recarregar,
  } = useQuizzesApi();

  return (
    <ListagemApi
      titulo="Quizzes"
      descricao="Gerencie os quizzes vinculados às aulas."
      caminhoCadastro="/quizzes/cadastrar"
      busca={filtros.busca ?? ""}
      onBuscaChange={(busca) => alterarFiltros({ busca })}
      requisicao={requisicao}
      colunas={colunas}
      onRecarregar={recarregar}
      onPaginaChange={alterarPagina}
    />
  );
}