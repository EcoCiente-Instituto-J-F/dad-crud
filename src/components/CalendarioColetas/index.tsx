import { useState } from "react";
import { Link } from "react-router-dom";

import {
  dataLocal,
  diasSemana,
  ocorreNaData,
} from "../../utils/calendarioColetas";

import type { CalendarioColetasProps } from "../../types/coleta";

export default function CalendarioColetas({
  coletas,
  condominios,
}: CalendarioColetasProps) {
  const [mes, setMes] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  const inicio = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const primeiro = new Date(inicio);
  primeiro.setDate(1 - inicio.getDay());

  const dias = Array.from({ length: 42 }, (_, deslocamento) => {
    const data = new Date(primeiro);
    data.setDate(primeiro.getDate() + deslocamento);
    return data;
  });

  function mudarMes(deslocamento: number): void {
    setMes((anterior) =>
      new Date(anterior.getFullYear(), anterior.getMonth() + deslocamento, 1),
    );
  }

  return (
    <section className="painel formulario espaco-superior">
      <div className="pagina-cabecalho">
        <h2>
          {mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </h2>

        <div className="acoes-pagina">
          <button type="button" className="botao" onClick={() => mudarMes(-1)}>
            Anterior
          </button>
          <button type="button" className="botao" onClick={() => mudarMes(1)}>
            Próximo
          </button>
        </div>
      </div>

      <div className="calendario-rolagem">
        <div className="calendario">
          {diasSemana.map((dia) => (
            <div className="calendario-cabecalho" key={dia.id}>{dia.nome}</div>
          ))}

          {dias.map((dia) => {
            const chave = dataLocal(dia);
            const eventos = coletas.filter(
              (coleta) =>
                coleta.status !== "CANCELADA" &&
                ocorreNaData(coleta, chave),
            );

            return (
              <div
                key={chave}
                className={
                  dia.getMonth() === mes.getMonth()
                    ? "calendario-dia"
                    : "calendario-dia calendario-dia--outro"
                }
              >
                <time dateTime={chave}>{dia.getDate()}</time>

                {eventos.map((coleta) => (
                  <Link
                    className="calendario-evento"
                    key={coleta.id}
                    to={`/coletas/${coleta.id}`}
                  >
                    {coleta.horaInicio} ·{" "}
                    {condominios.find(
                      (condominio) => condominio.id === coleta.condominioId,
                    )?.nome ?? "Condomínio"}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}