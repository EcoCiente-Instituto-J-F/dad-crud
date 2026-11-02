import { CalendarCheck,CircleAlert } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { AcoesRegistroApiProps } from "../../types/acoesRegistroApiContratos";

import { useAcoesRegistroApi } from "../../hooks/useAcoesRegistroApi";
import { converterDataLocal } from "../../utils/datasApi";
import Modal from "../Modal";

export default function AcoesRegistroApi({
  modulo,
}: AcoesRegistroApiProps) {
  const { id } = useParams();
  const { executar, salvando, mensagem } =
    useAcoesRegistroApi(modulo, Number(id));

  const [modal, setModal] = useState<"confirmacao" | "visita" | null>(null);
  const [data, setData] = useState("");
  const [realizada, setRealizada] = useState(true);
  const [confirmada, setConfirmada] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");

  const quiz = modulo === "quizzes";

  function fechar(): void {
    if (!salvando) setModal(null);
  }

  function abrirVisita(): void {
    setData("");
    setRealizada(true);
    setConfirmada(false);
    setObservacao("");
    setErroFormulario("");
    setModal("visita");
  }

  async function registrarVisita(): Promise<void> {
    setErroFormulario("");

    if (!realizada && !observacao.trim()) {
      setErroFormulario("Explique por que a visita não aconteceu.");
      return;
    }

    try {
      const timestamp = converterDataLocal(data);

      await executar("visita", {
        data: timestamp,
        realizada,
        confirmada: realizada && confirmada,
        observacao: observacao.trim() || null,
      });
    } catch (erro: unknown) {
      setErroFormulario(
        erro instanceof Error ? erro.message : "Não foi possível registrar.",
      );
    }
  }

  return (
    <>
      <section className="painel registro-acoes">
        <div>
          <h2>{quiz ? "Exclusão do quiz" : "Ações do agendamento"}</h2>
          <p>
            {quiz
              ? "A exclusão pode ser bloqueada se houver tentativas registradas."
              : "Registre uma visita ou solicite o cancelamento deste agendamento."}
          </p>
        </div>

        <div className="acoes-pagina">
          {!quiz && (
            <button
              type="button"
              className="botao botao--primario"
              disabled={salvando}
              onClick={abrirVisita}
            >
              <CalendarCheck size={17} aria-hidden="true" />
              Registrar visita
            </button>
          )}

          <button
            type="button"
            className="botao botao--perigo"
            disabled={salvando}
            onClick={() => setModal("confirmacao")}
          >
            {quiz ? "Excluir quiz" : "Cancelar agendamento"}
          </button>
        </div>

        {mensagem && modal === null && (
          <p className="mensagem-erro" role="alert">{mensagem}</p>
        )}
      </section>

      <Modal
        aberto={modal === "confirmacao"}
        titulo={quiz ? "Excluir quiz" : "Cancelar agendamento"}
        onFechar={fechar}
      >
        <div className="registro-modal">
          <div className="registro-modal-alerta">
            <CircleAlert size={25} aria-hidden="true" />
            <p>
              {quiz
                ? "Deseja excluir este quiz? Essa ação não poderá ser desfeita."
                : "Deseja cancelar este agendamento de coleta?"}
            </p>
          </div>

          <p className="registro-modal-descricao">
            {quiz
              ? "Se houver tentativas registradas, a API poderá impedir a exclusão."
              : "O cancelamento altera a situação do agendamento e preserva seu histórico."}
          </p>

          {mensagem && (
            <p className="mensagem-erro" role="alert">{mensagem}</p>
          )}

          <div className="formulario-acoes">
            <button
              type="button"
              className="botao"
              disabled={salvando}
              onClick={fechar}
            >
              Voltar
            </button>

            <button
              type="button"
              className="botao botao--perigo registro-confirmar"
              disabled={salvando}
              onClick={() => void executar(quiz ? "excluir" : "cancelar")}
            >
              {salvando
                ? "Processando..."
                : quiz
                  ? "Confirmar exclusão"
                  : "Confirmar cancelamento"}
            </button>
          </div>
        </div>
      </Modal>

      {!quiz && (
        <Modal
          aberto={modal === "visita"}
          titulo="Registrar resultado da visita"
          onFechar={fechar}
        >
          <form
            className="registro-modal registro-visita"
            onSubmit={(evento) => {
              evento.preventDefault();
              void registrarVisita();
            }}
          >
            <fieldset disabled={salvando}>
              <div className="campo">
                <label htmlFor="visita-data">Data e horário</label>
                <input
                  id="visita-data"
                  className="entrada"
                  type="datetime-local"
                  required
                  value={data}
                  onChange={(evento) => setData(evento.target.value)}
                />
              </div>

              <div className="registro-visita-opcoes">
                <label className="material-opcao">
                  <input
                    type="checkbox"
                    checked={realizada}
                    onChange={(evento) => {
                      const aconteceu = evento.target.checked;
                      setRealizada(aconteceu);
                      if (!aconteceu) setConfirmada(false);
                    }}
                  />
                  Visita realizada
                </label>

                <label className="material-opcao">
                  <input
                    type="checkbox"
                    checked={confirmada}
                    disabled={!realizada}
                    onChange={(evento) => setConfirmada(evento.target.checked)}
                  />
                  Visita confirmada
                </label>
              </div>

              <div className="campo">
                <label htmlFor="visita-observacao">
                  Observação{!realizada ? " — obrigatória" : ""}
                </label>
                <textarea
                  id="visita-observacao"
                  className="entrada"
                  rows={4}
                  required={!realizada}
                  value={observacao}
                  onChange={(evento) => setObservacao(evento.target.value)}
                />
              </div>

              <p className="registro-visita-aviso">
                Registrar a visita não altera automaticamente a situação do agendamento.
              </p>

              {(erroFormulario || mensagem) && (
                <p className="mensagem-erro" role="alert">
                  {erroFormulario || mensagem}
                </p>
              )}

              <div className="formulario-acoes">
                <button type="button" className="botao" onClick={fechar}>
                  Cancelar
                </button>
                <button type="submit" className="botao botao--primario">
                  {salvando ? "Salvando..." : "Registrar visita"}
                </button>
              </div>
            </fieldset>
          </form>
        </Modal>
      )}
    </>
  );
}
