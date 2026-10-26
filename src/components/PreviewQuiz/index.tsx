import { useState } from "react";

import type { PreviewQuizProps } from "../../types/quiz";

export default function PreviewQuiz({ quiz }: PreviewQuizProps) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<number | null>(null);

  return (
    <section className="painel formulario preview-quiz">
      <h2>Prévia: {quiz.titulo || "Quiz sem título"}</h2>

      <form
        onSubmit={(evento) => {
          evento.preventDefault();

          const acertos = quiz.perguntas.filter(
            (pergunta) => respostas[pergunta.id] === pergunta.corretaId,
          ).length;

          setResultado(
            quiz.perguntas.length === 0
              ? 0
              : Math.round((acertos / quiz.perguntas.length) * 100),
          );
        }}
      >
        {quiz.perguntas.map((pergunta) => (
          <fieldset className="preview-pergunta" key={pergunta.id}>
            <legend>{pergunta.enunciado}</legend>

            {pergunta.alternativas.map((alternativa) => (
              <label className="preview-alternativa" key={alternativa.id}>
                <input
                  type="radio"
                  required
                  name={`preview-${pergunta.id}`}
                  value={alternativa.id}
                  checked={respostas[pergunta.id] === alternativa.id}
                  onChange={() => {
                    setRespostas((anterior) => ({
                      ...anterior,
                      [pergunta.id]: alternativa.id,
                    }));
                    setResultado(null);
                  }}
                />
                {alternativa.texto}
              </label>
            ))}
          </fieldset>
        ))}

        <button
          className="botao botao--primario"
          type="submit"
          disabled={quiz.perguntas.length === 0}
        >
          Conferir respostas
        </button>
      </form>

      {resultado !== null && (
        <p role="status">
          Nota: {resultado}/100.{" "}
          {resultado >= quiz.notaMinima ? "Aprovado." : "Não aprovado."}
        </p>
      )}
    </section>
  );
}