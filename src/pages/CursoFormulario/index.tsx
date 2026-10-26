import { Link, useParams } from "react-router-dom";

import EditorCurso from "../../components/EditorCurso";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useCursos } from "../../hooks/useCursos";

import type { PaginaFormularioProps } from "../../types/formulario";

export default function CursoFormulario({ modo }: PaginaFormularioProps) {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useCursos();

  if (modo === "edicao" && !id) {
    return <p role="alert">Identificador do curso ausente.</p>;
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

  const curso = modo === "edicao"
    ? requisicao.dados.find((item) => item.id === id)
    : undefined;

  if (modo === "edicao" && !curso) {
    return (
      <section className="estado-vazio">
        <h1>Curso não encontrado</h1>
        <Link className="botao" to="/cursos">Voltar</Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="pagina-titulo">
        {modo === "edicao" ? "Editar curso" : "Cadastrar curso"}
      </h1>

      <EditorCurso
        key={curso?.id ?? "novo"}
        id={curso?.id}
        inicial={curso ?? {
          titulo: "",
          descricao: "",
          ativo: true,
          aulas: [],
        }}
      />
    </section>
  );
}