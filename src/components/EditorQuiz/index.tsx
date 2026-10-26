import { useState } from "react";
import { Link } from "react-router-dom";

import Campo from "../Campo";
import Selecao from "../Selecao";
import EditorPerguntas from "../EditorPerguntas";
import PreviewQuiz from "../PreviewQuiz";
import { useQuizEditor } from "../../hooks/useQuizEditor";

import type { EditorQuizProps } from "../../types/quiz";

export default function EditorQuiz({
  inicial,
  id,
  cursos,
}: EditorQuizProps) {
  const { formulario, erros, estado, alterar, salvar } =
    useQuizEditor(inicial, id);

  const [preview, setPreview] = useState(false);
  const curso = cursos.find((item) => item.id === formulario.cursoId);

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Quiz salvo</h1>
        <p role="status">Configurações e perguntas salvas com sucesso.</p>
        <Link className="botao" to="/quizzes">Voltar para quizzes</Link>
      </section>
    );
  }

  return (
    <>
      <form
        className="painel formulario"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          void salvar();
        }}
      >
        <fieldset disabled={estado.status === "salvando"}>
          <legend>Configurações do quiz</legend>

          <div className="formulario-grade">
            <Campo
              id="quiz-titulo"
              titulo="Título"
              valor={formulario.titulo}
              maximo={120}
              erro={erros.titulo}
              onChange={(valor) => alterar("titulo", valor)}
            />

            <Selecao
              id="quiz-curso"
              titulo="Curso"
              valor={formulario.cursoId}
              erro={erros.cursoId}
              onChange={(valor) => {
                alterar("cursoId", valor);
                alterar("aulaId", "");
              }}
            >
              <option value="">Selecione</option>
              {cursos.map((item) => (
                <option value={item.id} key={item.id}>{item.titulo}</option>
              ))}
            </Selecao>

            <Selecao
              id="quiz-aula"
              titulo="Aula"
              valor={formulario.aulaId}
              erro={erros.aulaId}
              onChange={(valor) => alterar("aulaId", valor)}
            >
              <option value="">Selecione</option>
              {curso?.aulas.map((aula) => (
                <option value={aula.id} key={aula.id}>{aula.titulo}</option>
              ))}
            </Selecao>

            <Campo
              id="quiz-nota"
              titulo="Nota mínima: 0 a 100"
              tipo="number"
              min={0}
              max={100}
              valor={formulario.notaMinima}
              erro={erros.notaMinima}
              onChange={(valor) => alterar("notaMinima", Number(valor))}
            />

            <Campo
              id="quiz-pontos"
              titulo="Pontos de recompensa"
              tipo="number"
              min={0}
              max={10000}
              step={1}
              valor={formulario.pontos}
              erro={erros.pontos}
              onChange={(valor) => alterar("pontos", Number(valor))}
            />
          </div>

          <label className="material-opcao">
            <input
              type="checkbox"
              checked={formulario.ativo}
              onChange={(evento) => alterar("ativo", evento.target.checked)}
            />
            Quiz ativo
          </label>

          <EditorPerguntas
            perguntas={formulario.perguntas}
            erros={erros}
            onChange={(perguntas) => alterar("perguntas", perguntas)}
          />
        </fieldset>

        {estado.status === "erro" && (
          <p className="erro-campo" role="alert">{estado.mensagem}</p>
        )}

        {estado.status === "salvando" && <p role="status">Salvando quiz...</p>}

        <div className="formulario-acoes">
          <Link className="botao" to="/quizzes">Voltar</Link>

          <button
            className="botao"
            type="button"
            onClick={() => setPreview((anterior) => !anterior)}
          >
            {preview ? "Fechar prévia" : "Visualizar"}
          </button>

          <button
            className="botao botao--primario"
            type="submit"
            disabled={estado.status === "salvando"}
          >
            Salvar quiz
          </button>
        </div>
      </form>

      {preview && <PreviewQuiz quiz={formulario} />}
    </>
  );
}