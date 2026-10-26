import Campo from "../Campo";
import { useAcoesColeta } from "../../hooks/useAcoesColeta";

import type { AcoesColetaProps } from "../../types/coleta";

export default function AcoesColeta({
  coleta,
  onAtualizado,
}: AcoesColetaProps) {
  const {
    estado,
    erros,
    motivo,
    setMotivo,
    confirmando,
    setConfirmando,
    visita,
    alterarVisita,
    executar,
  } = useAcoesColeta(coleta.id, onAtualizado);

  return (
    <>
      <section className="painel formulario espaco-superior">
        <h2>Registrar resultado da visita</h2>

        <form
          noValidate
          onSubmit={(evento) => {
            evento.preventDefault();
            void executar("visita");
          }}
        >
          <fieldset disabled={estado.status === "salvando"}>
            <Campo
              id="visita-data"
              titulo="Data da visita"
              tipo="date"
              valor={visita.data}
              erro={erros.data}
              onChange={(valor) => alterarVisita("data", valor)}
            />

            <div className="materiais-opcoes espaco-superior">
              <label className="material-opcao">
                <input
                  type="checkbox"
                  checked={visita.realizada}
                  onChange={(evento) => {
                    alterarVisita("realizada", evento.target.checked);

                    if (!evento.target.checked) {
                      alterarVisita("confirmada", false);
                    }
                  }}
                />
                Foi realizada
              </label>

              <label className="material-opcao">
                <input
                  type="checkbox"
                  checked={visita.confirmada}
                  disabled={!visita.realizada}
                  onChange={(evento) =>
                    alterarVisita("confirmada", evento.target.checked)
                  }
                />
                Houve confirmação
              </label>
            </div>

            {erros.confirmada && (
              <p className="erro-campo" role="alert">{erros.confirmada}</p>
            )}

            <Campo
              id="visita-observacao"
              titulo="Observação"
              multiline
              obrigatorio={false}
              maximo={1000}
              valor={visita.observacao}
              erro={erros.observacao}
              onChange={(valor) => alterarVisita("observacao", valor)}
            />

            <button className="botao botao--primario" type="submit">
              Salvar resultado
            </button>
          </fieldset>
        </form>
      </section>

      <section className="confirmacao-desativacao espaco-superior">
        {!confirmando ? (
          <button
            className="botao botao--perigo"
            type="button"
            disabled={estado.status === "salvando"}
            onClick={() => setConfirmando(true)}
          >
            Cancelar coleta
          </button>
        ) : (
          <form
            noValidate
            onSubmit={(evento) => {
              evento.preventDefault();
              void executar("cancelar");
            }}
          >
            <fieldset disabled={estado.status === "salvando"}>
              <legend>Confirmar cancelamento</legend>

              <Campo
                id="coleta-motivo"
                titulo="Motivo do cancelamento"
                valor={motivo}
                maximo={500}
                multiline
                erro={erros.motivo}
                onChange={setMotivo}
              />

              <div className="acoes-pagina">
                <button
                  className="botao"
                  type="button"
                  onClick={() => setConfirmando(false)}
                >
                  Voltar
                </button>

                <button className="botao botao--perigo" type="submit">
                  Confirmar cancelamento
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </section>

      {estado.status === "salvando" && <p role="status">Salvando...</p>}
      {estado.status === "sucesso" && <p role="status">{estado.mensagem}</p>}
      {estado.status === "erro" && (
        <p className="erro-campo" role="alert">{estado.mensagem}</p>
      )}
    </>
  );
}