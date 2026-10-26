import { Link, useParams } from "react-router-dom";

import EditorQuiz from "../../components/EditorQuiz";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useQuizzes } from "../../hooks/useQuizzes";

import type { PaginaFormularioProps } from "../../types/formulario";

export default function QuizFormulario({ modo }: PaginaFormularioProps) {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useQuizzes();

  if (modo === "edicao" && !id) {
    return <p role="alert">Identificador ausente.</p>;
  }

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

  const quiz = modo === "edicao"
    ? requisicao.dados.quizzes.find((item) => item.id === id)
    : undefined;

  if (modo === "edicao" && !quiz) {
    return (
      <section className="estado-vazio">
        <h1>Quiz não encontrado</h1>
        <Link className="botao" to="/quizzes">Voltar</Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="pagina-titulo">
        {modo === "edicao" ? "Editar quiz" : "Cadastrar quiz"}
      </h1>

      <EditorQuiz
        key={quiz?.id ?? "novo"}
        id={quiz?.id}
        cursos={requisicao.dados.cursos}
        inicial={quiz ?? {
          titulo: "",
          cursoId: "",
          aulaId: "",
          notaMinima: 70,
          pontos: 20,
          ativo: true,
          perguntas: [],
        }}
      />
    </section>
  );
}