import Campo from "../Campo";

import type {
  EditorPerguntasProps,
  Pergunta,
} from "../../types/quiz";

export default function EditorPerguntas({
  perguntas,
  erros,
  onChange,
}: EditorPerguntasProps) {
  function atualizar(pergunta: Pergunta): void {
    onChange(
      perguntas.map((item) => item.id === pergunta.id ? pergunta : item),
    );
  }

  return (
    <section className="secao-formulario">
      <div className="pagina-cabecalho">
        <h2>Perguntas</h2>

        <button
          type="button"
          className="botao"
          onClick={() =>
            onChange([
              ...perguntas,
              {
                id: crypto.randomUUID(),
                enunciado: "",
                corretaId: "",
                alternativas: [
                  { id: crypto.randomUUID(), texto: "" },
                  { id: crypto.randomUUID(), texto: "" },
                ],
              },
            ])
          }
        >
          Adicionar pergunta
        </button>
      </div>

      {perguntas.map((pergunta, posicao) => (
        <section className="ponto-editor" key={pergunta.id}>
          <div className="pagina-cabecalho">
            <h3>Pergunta {posicao + 1}</h3>

            <button
              className="botao botao--perigo"
              type="button"
              onClick={() =>
                onChange(perguntas.filter((item) => item.id !== pergunta.id))
              }
            >
              Remover pergunta
            </button>
          </div>

          <Campo
            id={`pergunta-${pergunta.id}`}
            titulo="Enunciado"
            valor={pergunta.enunciado}
            maximo={2000}
            multiline
            erro={erros[`perguntas.${posicao}.enunciado`]}
            onChange={(enunciado) => atualizar({ ...pergunta, enunciado })}
          />

          {pergunta.alternativas.map((alternativa, numero) => (
            <div className="alternativa-editor" key={alternativa.id}>
              <label className="alternativa-correta">
                <input
                  type="radio"
                  name={`correta-${pergunta.id}`}
                  checked={pergunta.corretaId === alternativa.id}
                  onChange={() =>
                    atualizar({ ...pergunta, corretaId: alternativa.id })
                  }
                />
                Correta
              </label>

              <Campo
                id={`alternativa-${alternativa.id}`}
                titulo={`Alternativa ${numero + 1}`}
                valor={alternativa.texto}
                maximo={500}
                erro={
                  erros[`perguntas.${posicao}.alternativas.${numero}.texto`]
                }
                onChange={(texto) =>
                  atualizar({
                    ...pergunta,
                    alternativas: pergunta.alternativas.map((item) =>
                      item.id === alternativa.id ? { ...item, texto } : item,
                    ),
                  })
                }
              />

              <button
                className="botao"
                type="button"
                disabled={pergunta.alternativas.length <= 2}
                onClick={() =>
                  atualizar({
                    ...pergunta,
                    corretaId:
                      pergunta.corretaId === alternativa.id
                        ? ""
                        : pergunta.corretaId,
                    alternativas: pergunta.alternativas.filter(
                      (item) => item.id !== alternativa.id,
                    ),
                  })
                }
              >
                Remover
              </button>
            </div>
          ))}

          <button
            className="botao"
            type="button"
            disabled={pergunta.alternativas.length >= 6}
            onClick={() =>
              atualizar({
                ...pergunta,
                alternativas: [
                  ...pergunta.alternativas,
                  { id: crypto.randomUUID(), texto: "" },
                ],
              })
            }
          >
            Adicionar alternativa
          </button>

          {erros[`perguntas.${posicao}.corretaId`] && (
            <p className="erro-campo" role="alert">
              {erros[`perguntas.${posicao}.corretaId`]}
            </p>
          )}

          {erros[`perguntas.${posicao}.alternativas`] && (
            <p className="erro-campo" role="alert">
              {erros[`perguntas.${posicao}.alternativas`]}
            </p>
          )}
        </section>
      ))}

      {erros.perguntas && (
        <p className="erro-campo" role="alert">{erros.perguntas}</p>
      )}
    </section>
  );
}