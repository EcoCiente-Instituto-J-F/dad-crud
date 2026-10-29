import { useId } from "react";

import {
  converterDataLocal,
  preencherDataLocal,
} from "../../utils/datasApi";

import type { CampoEditor } from "../../types/editorModulo";

interface Props {
  campos: CampoEditor[];
  dados: Record<string, unknown>;
  onChange: (dados: Record<string, unknown>) => void;
  leitura?: boolean;
}

function objeto(valor: unknown): Record<string, unknown> {
  return typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
    ? valor as Record<string, unknown>
    : {};
}

export default function CamposEditorApi({
  campos,
  dados,
  onChange,
  leitura = false,
}: Props) {
  const prefixo = useId();

  function alterar(chave: string, valor: unknown): void {
    onChange({ ...dados, [chave]: valor });
  }

  return (
    <div className="editor-api-campos">
      {campos.map((campo) => {
        const valor = dados[campo.chave];
        const identificador = `${prefixo}-${campo.chave}`;

        if (campo.tipo === "object") {
          return (
            <section className="secao-formulario" key={campo.chave}>
              <h2>{campo.titulo}</h2>

              {valor === null ? (
                leitura ? (
                  <p>Não informado.</p>
                ) : (
                  <button
                    type="button"
                    className="botao"
                    onClick={() =>
                      alterar(campo.chave, structuredClone(campo.novo ?? {}))
                    }
                  >
                    Preencher endereço
                  </button>
                )
              ) : (
                <CamposEditorApi
                  campos={campo.campos ?? []}
                  dados={objeto(valor)}
                  leitura={leitura}
                  onChange={(novo) => alterar(campo.chave, novo)}
                />
              )}
            </section>
          );
        }

        if (campo.tipo === "array") {
          const itens = Array.isArray(valor)
            ? valor.map(objeto)
            : [];

          function atualizarItem(
            indice: number,
            novo: Record<string, unknown>,
          ): void {
            alterar(
              campo.chave,
              itens.map((item, posicao) =>
                posicao === indice ? novo : item,
              ),
            );
          }

          function mover(indice: number, direcao: number): void {
            const destino = indice + direcao;

            if (destino < 0 || destino >= itens.length) return;

            const novos = [...itens];
            [novos[indice], novos[destino]] = [
              novos[destino],
              novos[indice],
            ];

            alterar(campo.chave, novos);
          }

          return (
            <section className="secao-formulario" key={campo.chave}>
              <h2>{campo.titulo}</h2>

              {itens.length === 0 && <p>Nenhum item.</p>}

              {itens.map((item, indice) => (
                <section className="ponto-editor" key={indice}>
                  <h3>Item {indice + 1}</h3>

                  <CamposEditorApi
                    campos={campo.campos ?? []}
                    dados={item}
                    leitura={leitura}
                    onChange={(novo) => atualizarItem(indice, novo)}
                  />

                  {!leitura && (
                    <div className="formulario-acoes">
                      <button
                        type="button"
                        className="botao"
                        disabled={indice === 0}
                        onClick={() => mover(indice, -1)}
                      >
                        Subir
                      </button>

                      <button
                        type="button"
                        className="botao"
                        disabled={indice === itens.length - 1}
                        onClick={() => mover(indice, 1)}
                      >
                        Descer
                      </button>

                      <button
                        type="button"
                        className="botao botao--perigo"
                        onClick={() => {
                          if (window.confirm(
                            "Remover este item? Na edição, ele será excluído ao salvar se não houver bloqueios.",
                          )) {
                            alterar(
                              campo.chave,
                              itens.filter((_, posicao) => posicao !== indice),
                            );
                          }
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </section>
              ))}

              {!leitura && (
                <button
                  type="button"
                  className="botao"
                  onClick={() =>
                    alterar(campo.chave, [
                      ...itens,
                      structuredClone(campo.novo ?? {}),
                    ])
                  }
                >
                  Adicionar
                </button>
              )}
            </section>
          );
        }

        if (campo.tipo === "multiselect") {
          const selecionados = Array.isArray(valor)
            ? valor.filter((item): item is number => typeof item === "number")
            : [];

          return (
            <fieldset className="secao-formulario" key={campo.chave}>
              <legend>{campo.titulo}</legend>

              <div className="materiais-opcoes">
                {campo.opcoes?.map((opcao) => (
                  <label className="material-opcao" key={opcao.id}>
                    <input
                      type="checkbox"
                      checked={selecionados.includes(opcao.id)}
                      disabled={leitura}
                      onChange={(evento) =>
                        alterar(
                          campo.chave,
                          evento.target.checked
                            ? [...selecionados, opcao.id]
                            : selecionados.filter((id) => id !== opcao.id),
                        )
                      }
                    />
                    {opcao.nome}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }

        if (campo.tipo === "checkbox") {
          return (
            <label className="material-opcao" key={campo.chave}>
              <input
                type="checkbox"
                checked={Boolean(valor)}
                disabled={leitura}
                onChange={(evento) =>
                  alterar(campo.chave, evento.target.checked)
                }
              />
              {campo.titulo}
            </label>
          );
        }

        const texto = valor == null ? "" : String(valor);

        return (
          <div className="campo" key={campo.chave}>
            <label htmlFor={identificador}>{campo.titulo}</label>

            {campo.tipo === "select" ? (
              <select
                id={identificador}
                value={texto}
                required={campo.obrigatorio}
                disabled={leitura}
                onChange={(evento) =>
                  alterar(
                    campo.chave,
                    evento.target.value === ""
                      ? null
                      : Number(evento.target.value),
                  )
                }
              >
                <option value="">Selecione</option>

                {campo.opcoes?.map((opcao) => (
                  <option key={opcao.id} value={opcao.id}>
                    {opcao.nome}
                  </option>
                ))}
              </select>
            ) : campo.tipo === "textarea" ? (
              <textarea
                id={identificador}
                value={texto}
                required={campo.obrigatorio}
                readOnly={leitura}
                onChange={(evento) =>
                  alterar(campo.chave, evento.target.value)
                }
              />
            ) : (
              <input
                id={identificador}
                type={
                  campo.tipo === "datetime"
                    ? "datetime-local"
                    : campo.tipo
                }
                step={campo.tipo === "number" ? "any" : undefined}
                value={
                  campo.tipo === "datetime"
                    ? preencherDataLocal(texto || null)
                    : texto
                }
                required={campo.obrigatorio}
                readOnly={leitura}
                onChange={(evento) => {
                  const novo = evento.target.value;

                  alterar(
                    campo.chave,
                    campo.tipo === "number"
                      ? novo === "" ? null : Number(novo)
                      : campo.tipo === "datetime"
                        ? novo ? converterDataLocal(novo) : null
                        : novo || (campo.obrigatorio ? "" : null),
                  );
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}