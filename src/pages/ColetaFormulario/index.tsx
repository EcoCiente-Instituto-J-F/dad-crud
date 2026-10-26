import { Link, useParams } from "react-router-dom";

import EditorColeta from "../../components/EditorColeta";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useColetas } from "../../hooks/useColetas";
import { dataLocal } from "../../utils/calendarioColetas";

import type { PaginaFormularioProps } from "../../types/formulario";

export default function ColetaFormulario({ modo }: PaginaFormularioProps) {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useColetas();

  if (modo === "edicao" && !id) {
    return <p role="alert">Identificador ausente.</p>;
  }

  if (requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={requisicao.mensagem}
        onTentarNovamente={recarregar}
      />
    );
  }

  const coleta = modo === "edicao"
    ? requisicao.dados.coletas.find((item) => item.id === id)
    : undefined;

  if (modo === "edicao" && (!coleta || coleta.status === "CANCELADA")) {
    return (
      <section className="estado-vazio">
        <h1>Coleta indisponível para edição</h1>
        <Link className="botao" to="/coletas">Voltar</Link>
      </section>
    );
  }

  const hoje = dataLocal(new Date());

  return (
    <section>
      <h1 className="pagina-titulo">
        {modo === "edicao" ? "Editar coleta" : "Cadastrar coleta"}
      </h1>

      <EditorColeta
        key={coleta?.id ?? "nova"}
        id={coleta?.id}
        dados={requisicao.dados}
        inicial={coleta ?? {
          condominioId: "",
          cooperativaId: "",
          dataInicio: hoje,
          dataFim: hoje,
          horaInicio: "09:00",
          horaFim: "10:00",
          recorrente: false,
          diasSemana: [],
        }}
      />
    </section>
  );
}