import { Link } from "react-router-dom";

import Campo from "../Campo";
import EditorAulas from "../EditorAulas";
import { useCursoEditor } from "../../hooks/useCursoEditor";

import type { EditorCursoProps } from "../../types/educacao";

export default function EditorCurso({ inicial, id }: EditorCursoProps) {
  const { formulario, erros, estado, alterar, salvar } =
    useCursoEditor(inicial, id);

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Curso salvo</h1>
        <p role="status">Curso e aulas salvos com sucesso.</p>
        <Link className="botao" to={`/cursos/${estado.id}`}>
          Ver curso
        </Link>
      </section>
    );
  }

  return (
    <form
      className="painel formulario"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void salvar();
      }}
    >
      <fieldset disabled={estado.status === "salvando"}>
        <legend>Dados do curso</legend>

        <Campo
          id="curso-titulo"
          titulo="Título"
          valor={formulario.titulo}
          maximo={120}
          erro={erros.titulo}
          onChange={(valor) => alterar("titulo", valor)}
        />

        <Campo
          id="curso-descricao"
          titulo="Descrição"
          valor={formulario.descricao}
          maximo={3000}
          multiline
          erro={erros.descricao}
          onChange={(valor) => alterar("descricao", valor)}
        />

        <label className="material-opcao">
          <input
            type="checkbox"
            checked={formulario.ativo}
            onChange={(evento) => alterar("ativo", evento.target.checked)}
          />
          Curso ativo
        </label>

        <EditorAulas
          aulas={formulario.aulas}
          erros={erros}
          onChange={(aulas) => alterar("aulas", aulas)}
        />
      </fieldset>

      {estado.status === "erro" && (
        <p className="erro-campo" role="alert">{estado.mensagem}</p>
      )}

      {estado.status === "salvando" && <p role="status">Salvando...</p>}

      <div className="formulario-acoes">
        <Link className="botao" to="/cursos">Voltar</Link>
        <button
          type="submit"
          className="botao botao--primario"
          disabled={estado.status === "salvando"}
        >
          Salvar curso e aulas
        </button>
      </div>
    </form>
  );
}