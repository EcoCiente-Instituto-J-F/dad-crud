import { Link } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useQuizzes } from "../../hooks/useQuizzes";
import { useExcluirQuiz } from "../../hooks/useExcluirQuiz";

export default function Quizzes() {
  const { requisicao, recarregar } = useQuizzes();
  const { estado, solicitar, cancelar, confirmar } =
    useExcluirQuiz(recarregar);

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Quizzes</h1>
          <p className="pagina-descricao">Perguntas, aprovação e recompensas</p>
        </div>

        <Link className="botao botao--primario" to="/quizzes/cadastrar">
          Cadastrar quiz
        </Link>
      </div>

      {estado.status === "sucesso" && (
        <p role="status">Quiz excluído com sucesso.</p>
      )}

      {(estado.status === "confirmando" ||
        estado.status === "erro" ||
        estado.status === "excluindo") && (
        <section className="confirmacao-desativacao">
          <h2>Excluir o quiz?</h2>
          <p>As perguntas deste quiz também serão removidas.</p>

          {estado.status === "erro" && (
            <p className="erro-campo" role="alert">{estado.mensagem}</p>
          )}

          {estado.status === "excluindo" && <p role="status">Excluindo...</p>}

          <div className="acoes-pagina">
            <button
              className="botao"
              type="button"
              disabled={estado.status === "excluindo"}
              onClick={cancelar}
            >
              Cancelar
            </button>

            <button
              className="botao botao--perigo"
              type="button"
              disabled={estado.status === "excluindo"}
              onClick={() => void confirmar()}
            >
              Confirmar exclusão
            </button>
          </div>
        </section>
      )}

      {requisicao.status === "carregando" && (
        <EstadoRequisicao estado="carregando" />
      )}

      {requisicao.status === "erro" && (
        <EstadoRequisicao
          estado="erro"
          mensagem={requisicao.mensagem}
          onTentarNovamente={recarregar}
        />
      )}

      {requisicao.status === "sucesso" && (
        <div className="painel tabela-container">
          <p className="resultado-carregamento" role="status">
            {requisicao.dados.quizzes.length} quiz(zes) encontrado(s).
          </p>

          <table className="tabela-usuarios">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Curso / aula</th>
                <th>Perguntas</th>
                <th>Nota mínima</th>
                <th>Pontos</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {requisicao.dados.quizzes.map((quiz) => {
                const curso = requisicao.dados.cursos.find(
                  (item) => item.id === quiz.cursoId,
                );

                const aula = curso?.aulas.find(
                  (item) => item.id === quiz.aulaId,
                );

                return (
                  <tr key={quiz.id}>
                    <td>{quiz.titulo} · {quiz.ativo ? "Ativo" : "Inativo"}</td>
                    <td>
                      {curso?.titulo ?? "Curso indisponível"}
                      <br />
                      {aula?.titulo ?? "Aula indisponível"}
                    </td>
                    <td>{quiz.perguntas.length}</td>
                    <td>{quiz.notaMinima}/100</td>
                    <td>{quiz.pontos}</td>
                    <td>
                      <div className="acoes-pagina">
                        <Link className="botao" to={`/quizzes/${quiz.id}/editar`}>
                          Editar / visualizar
                        </Link>
                        <button
                          className="botao botao--perigo"
                          type="button"
                          onClick={() => solicitar(quiz.id)}
                          disabled={estado.status === "excluindo"}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {requisicao.dados.quizzes.length === 0 && (
            <div className="estado-vazio">Nenhum quiz cadastrado.</div>
          )}
        </div>
      )}
    </section>
  );
}