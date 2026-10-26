import Campo from "../Campo";

import type { EditorAulasProps } from "../../types/educacao";

export default function EditorAulas({
  aulas,
  erros,
  onChange,
}: EditorAulasProps) {
  function mover(id: string, direcao: -1 | 1): void {
    const origem = aulas.findIndex((aula) => aula.id === id);
    const destino = origem + direcao;

    if (origem < 0 || destino < 0 || destino >= aulas.length) return;

    const copia = [...aulas];
    const atual = copia[origem];
    const outra = copia[destino];

    if (!atual || !outra) return;

    copia[origem] = outra;
    copia[destino] = atual;
    onChange(copia);
  }

  return (
    <section className="secao-formulario">
      <div className="pagina-cabecalho">
        <h2>Aulas</h2>

        <button
          className="botao"
          type="button"
          onClick={() =>
            onChange([
              ...aulas,
              { id: crypto.randomUUID(), titulo: "", conteudo: "" },
            ])
          }
        >
          Adicionar aula
        </button>
      </div>

      {aulas.length === 0 && <p>Este curso ainda não possui aulas.</p>}

      {aulas.map((aula, posicao) => (
        <section className="ponto-editor" key={aula.id}>
          <div className="pagina-cabecalho">
            <h3>Aula {posicao + 1}</h3>

            <div className="acoes-pagina">
              <button
                type="button"
                className="botao"
                disabled={posicao === 0}
                onClick={() => mover(aula.id, -1)}
              >
                Subir
              </button>

              <button
                type="button"
                className="botao"
                disabled={posicao === aulas.length - 1}
                onClick={() => mover(aula.id, 1)}
              >
                Descer
              </button>

              <button
                type="button"
                className="botao botao--perigo"
                onClick={() =>
                  onChange(aulas.filter((item) => item.id !== aula.id))
                }
              >
                Remover
              </button>
            </div>
          </div>

          <Campo
            id={`aula-${aula.id}-titulo`}
            titulo="Título da aula"
            valor={aula.titulo}
            maximo={120}
            erro={erros[`aulas.${posicao}.titulo`]}
            onChange={(titulo) =>
              onChange(
                aulas.map((item) =>
                  item.id === aula.id ? { ...item, titulo } : item,
                ),
              )
            }
          />

          <Campo
            id={`aula-${aula.id}-conteudo`}
            titulo="Conteúdo da aula"
            valor={aula.conteudo}
            maximo={20000}
            multiline
            erro={erros[`aulas.${posicao}.conteudo`]}
            onChange={(conteudo) =>
              onChange(
                aulas.map((item) =>
                  item.id === aula.id ? { ...item, conteudo } : item,
                ),
              )
            }
          />
        </section>
      ))}

      {erros.aulas && (
        <p className="erro-campo" role="alert">{erros.aulas}</p>
      )}
    </section>
  );
}