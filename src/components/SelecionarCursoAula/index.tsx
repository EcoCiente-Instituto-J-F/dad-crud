import { useConsulta } from "../../hooks/useConsulta";
import { listarOpcoesCursos } from "../../services/opcoesCursosService";
import type { SelecionarCursoAulaProps } from "../../types/selecionarCursoAula";

export default function SelecionarCursoAula({
  dados,
  onChange,
}: SelecionarCursoAulaProps) {
  const { requisicao, recarregar } = useConsulta(listarOpcoesCursos);

  const cursos = requisicao.status === "sucesso" ? requisicao.dados : [];
  const cursoId = typeof dados.cursoId === "number" ? dados.cursoId : null;
  const aulaId = typeof dados.aulaId === "number" ? dados.aulaId : null;

  const curso = cursos.find((item) => item.id === cursoId);
  const aulas = curso?.aulas ?? [];
  const carregando = requisicao.status === "carregando";
  const cursoNaoEncontrado =
    requisicao.status === "sucesso" && cursoId !== null && !curso;
  const aulaNaoEncontrada =
    requisicao.status === "sucesso" &&
    aulaId !== null &&
    !aulas.some((aula) => aula.id === aulaId);

  return (
    <section className="quiz-selecao-vinculo">
      <h2>Curso e aula</h2>

      {carregando && (
        <p className="pagina-descricao" role="status">Carregando cursos...</p>
      )}

      {requisicao.status === "erro" && (
        <div className="mensagem-erro" role="alert">
          <p>{requisicao.mensagem}</p>
          <button type="button" className="botao" onClick={recarregar}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="quiz-selecao-grade">
        <div className="campo">
          <label htmlFor="quiz-curso-selecao">Curso</label>
          <select
            id="quiz-curso-selecao"
            className="entrada"
            required
            disabled={requisicao.status !== "sucesso"}
            value={cursoId ?? ""}
            onChange={(evento) => {
              const novoCursoId = evento.target.value
                ? Number(evento.target.value)
                : null;

              if (novoCursoId !== cursoId) {
                onChange({
                  ...dados,
                  cursoId: novoCursoId,
                  aulaId: null,
                });
              }
            }}
          >
            <option value="">Selecione o curso</option>

            {cursoId !== null && !curso && (
              <option value={cursoId}>Curso #{cursoId}</option>
            )}

            {cursos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.titulo}{item.ativo ? "" : " — inativo"}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="quiz-aula-selecao">Aula</label>
          <select
            id="quiz-aula-selecao"
            className="entrada"
            required
            disabled={requisicao.status !== "sucesso" || !curso}
            value={aulaId ?? ""}
            onChange={(evento) =>
              onChange({
                ...dados,
                aulaId: evento.target.value
                  ? Number(evento.target.value)
                  : null,
              })
            }
          >
            <option value="">
              {curso ? "Selecione a aula" : "Selecione primeiro o curso"}
            </option>

            {aulaId !== null && !aulas.some((aula) => aula.id === aulaId) && (
              <option value={aulaId}>Aula #{aulaId}</option>
            )}

            {aulas.map((aula, indice) => (
              <option key={aula.id} value={aula.id}>
                {indice + 1}. {aula.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {requisicao.status === "sucesso" && cursos.length === 0 && (
        <p className="quiz-selecao-aviso">
          Cadastre um curso e suas aulas antes de criar o quiz.
        </p>
      )}

      {curso && aulas.length === 0 && (
        <p className="quiz-selecao-aviso">
          Este curso ainda não possui aulas.
        </p>
      )}

      {(cursoNaoEncontrado || aulaNaoEncontrada) && (
        <p className="quiz-selecao-aviso" role="alert">
          O vínculo atual não foi encontrado nas opções carregadas.
          Confira o curso e a aula antes de salvar.
        </p>
      )}

      <p className="quiz-selecao-nota">
        Cada aula pode ter apenas um quiz.
        Se este quiz já possui tentativas, preserve o curso e a aula.
      </p>
    </section>
  );
}