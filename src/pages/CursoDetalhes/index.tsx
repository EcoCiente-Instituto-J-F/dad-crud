import { Link, useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useCurso } from "../../hooks/useCurso";

export default function CursoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useCurso(id);

  if (!id) return <p role="alert">Identificador ausente.</p>;

  if (requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={requisicao.mensagem}
        onTentarNovamente={recarregar}
      />
    );
  }

  const curso = requisicao.dados;

  if (!curso) {
    return (
      <section className="estado-vazio">
        <h1>Curso não encontrado</h1>
        <Link className="botao" to="/cursos">Voltar</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{curso.titulo}</h1>
          <p>{curso.ativo ? "Curso ativo" : "Curso inativo"}</p>
        </div>

        <div className="acoes-pagina">
          <Link className="botao" to="/cursos">Voltar</Link>
          <Link className="botao" to="/quizzes/cadastrar">Cadastrar quiz</Link>
          <Link
            className="botao botao--primario"
            to={`/cursos/${curso.id}/editar`}
          >
            Editar curso e aulas
          </Link>
        </div>
      </div>

      <div className="painel formulario">
        <p className="texto-preservado">{curso.descricao}</p>
        <h2>Aulas</h2>

        {curso.aulas.length === 0 && <p>Nenhuma aula cadastrada.</p>}

        {curso.aulas.map((aula, posicao) => (
          <details className="aula-detalhe" key={aula.id}>
            <summary>{posicao + 1}. {aula.titulo}</summary>
            <p className="texto-preservado">{aula.conteudo}</p>
          </details>
        ))}
      </div>
    </section>
  );
}