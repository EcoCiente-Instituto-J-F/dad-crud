import { Link } from "react-router-dom";

import Campo from "../Campo";
import Selecao from "../Selecao";
import { useColetaEditor } from "../../hooks/useColetaEditor";
import { diasSemana } from "../../utils/calendarioColetas";

import type { EditorColetaProps } from "../../types/coleta";

export default function EditorColeta({
  inicial,
  id,
  dados,
}: EditorColetaProps) {
  const { formulario, erros, estado, alterar, salvar } =
    useColetaEditor(inicial, id);

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Coleta salva</h1>
        <p role="status">Agendamento salvo com sucesso.</p>
        <Link className="botao" to={`/coletas/${estado.id}`}>
          Ver detalhes
        </Link>
      </section>
    );
  }

  return (
    <form
      className="painel formulario"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void salvar();
      }}
    >
      <fieldset disabled={estado.status === "salvando"}>
        <legend>Agendamento</legend>

        <div className="formulario-grade">
          <Selecao
            id="coleta-condominio"
            titulo="Condomínio"
            valor={formulario.condominioId}
            erro={erros.condominioId}
            onChange={(valor) => alterar("condominioId", valor)}
          >
            <option value="">Selecione</option>

            {dados.condominios
              .filter((item) =>
                item.status === "ATIVO" || item.id === formulario.condominioId,
              )
              .map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
          </Selecao>

          <Selecao
            id="coleta-cooperativa"
            titulo="Cooperativa"
            valor={formulario.cooperativaId}
            erro={erros.cooperativaId}
            onChange={(valor) => alterar("cooperativaId", valor)}
          >
            <option value="">Selecione</option>

            {dados.cooperativas
              .filter((item) =>
                item.status === "ATIVO" || item.id === formulario.cooperativaId,
              )
              .map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
          </Selecao>

          <Campo
            id="coleta-inicio"
            titulo="Data inicial"
            tipo="date"
            valor={formulario.dataInicio}
            erro={erros.dataInicio}
            onChange={(valor) => alterar("dataInicio", valor)}
          />

          <Campo
            id="coleta-fim"
            titulo="Data final"
            tipo="date"
            valor={formulario.dataFim}
            erro={erros.dataFim}
            onChange={(valor) => alterar("dataFim", valor)}
          />

          <Campo
            id="coleta-hora-inicio"
            titulo="Horário inicial"
            tipo="time"
            valor={formulario.horaInicio}
            erro={erros.horaInicio}
            onChange={(valor) => alterar("horaInicio", valor)}
          />

          <Campo
            id="coleta-hora-fim"
            titulo="Horário final"
            tipo="time"
            valor={formulario.horaFim}
            erro={erros.horaFim}
            onChange={(valor) => alterar("horaFim", valor)}
          />
        </div>

        <section className="secao-formulario">
          <label className="material-opcao">
            <input
              type="checkbox"
              checked={formulario.recorrente}
              onChange={(evento) => alterar("recorrente", evento.target.checked)}
            />
            Coleta recorrente
          </label>

          {formulario.recorrente && (
            <div className="materiais-opcoes espaco-superior">
              {diasSemana.map((dia) => (
                <label className="material-opcao" key={dia.id}>
                  <input
                    type="checkbox"
                    checked={formulario.diasSemana.includes(dia.id)}
                    onChange={(evento) =>
                      alterar(
                        "diasSemana",
                        evento.target.checked
                          ? [...formulario.diasSemana, dia.id]
                          : formulario.diasSemana.filter((item) => item !== dia.id),
                      )
                    }
                  />
                  {dia.nome}
                </label>
              ))}
            </div>
          )}

          {erros.diasSemana && (
            <p className="erro-campo" role="alert">{erros.diasSemana}</p>
          )}
        </section>
      </fieldset>

      {estado.status === "erro" && (
        <p className="erro-campo" role="alert">{estado.mensagem}</p>
      )}

      {estado.status === "salvando" && <p role="status">Salvando coleta...</p>}

      <div className="formulario-acoes">
        <Link className="botao" to="/coletas">Voltar</Link>
        <button
          type="submit"
          className="botao botao--primario"
          disabled={estado.status === "salvando"}
        >
          Salvar coleta
        </button>
      </div>
    </form>
  );
}