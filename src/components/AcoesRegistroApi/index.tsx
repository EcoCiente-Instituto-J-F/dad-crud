import { useState } from "react";
import { useParams } from "react-router-dom";

import { useAcoesRegistroApi } from "../../hooks/useAcoesRegistroApi";
import { converterDataLocal } from "../../utils/datasApi";

export default function AcoesRegistroApi({
  modulo,
}: {
  modulo: "coletas" | "quizzes";
}) {
  const { id } = useParams();
  const { executar, salvando, mensagem } =
    useAcoesRegistroApi(modulo, Number(id));

  const [data, setData] = useState("");
  const [realizada, setRealizada] = useState(true);
  const [confirmada, setConfirmada] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [erroData, setErroData] = useState("");

  return (
    <section className="painel formulario espaco-superior">
      <h2>{modulo === "quizzes" ? "Excluir quiz" : "Ações da coleta"}</h2>

      {mensagem && (
        <p className="mensagem-erro" role="alert">{mensagem}</p>
      )}

      <button
        type="button"
        className="botao botao--perigo"
        disabled={salvando}
        onClick={() => {
          const acao = modulo === "quizzes" ? "excluir" : "cancelar";

          if (window.confirm(`Deseja realmente ${acao} este registro?`)) {
            void executar(acao);
          }
        }}
      >
        {modulo === "quizzes" ? "Excluir quiz" : "Cancelar agendamento"}
      </button>

      {modulo === "coletas" && (
        <form
          className="secao-formulario"
          onSubmit={(evento) => {
            evento.preventDefault();
            setErroData("");

            try {
              const timestamp = converterDataLocal(data);

              void executar("visita", {
                data: timestamp,
                realizada,
                confirmada,
                observacao: observacao.trim() || null,
              });
            } catch (erro: unknown) {
              setErroData(
                erro instanceof Error ? erro.message : "Data inválida.",
              );
            }
          }}
        >
          <fieldset disabled={salvando}>
            <legend>Registrar visita</legend>

            <div className="campo">
              <label htmlFor="visita-data">Data e horário</label>
              <input
                id="visita-data"
                type="datetime-local"
                required
                value={data}
                onChange={(evento) => setData(evento.target.value)}
              />
            </div>

            <label className="material-opcao">
              <input
                type="checkbox"
                checked={realizada}
                onChange={(evento) => setRealizada(evento.target.checked)}
              />
              Visita realizada
            </label>

            <label className="material-opcao">
              <input
                type="checkbox"
                checked={confirmada}
                onChange={(evento) => setConfirmada(evento.target.checked)}
              />
              Visita confirmada
            </label>

            <div className="campo espaco-superior">
              <label htmlFor="visita-observacao">Observação</label>
              <textarea
                id="visita-observacao"
                required={!realizada}
                value={observacao}
                onChange={(evento) => setObservacao(evento.target.value)}
              />
            </div>

            {erroData && <p role="alert">{erroData}</p>}

            <p className="pagina-descricao">
              Registrar a visita não altera a situação do agendamento.
            </p>

            <div className="formulario-acoes">
              <button
                type="submit"
                className="botao botao--primario"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Registrar visita"}
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </section>
  );
}