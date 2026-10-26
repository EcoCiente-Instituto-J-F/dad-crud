import { Link, useParams } from "react-router-dom";

import EditorCooperativa from "../../components/EditorCooperativa";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { cooperativaVazia } from "../../data/cooperativa";
import { useDadosCooperativas } from "../../hooks/useDadosCooperativas";

import type { CooperativaFormularioPaginaProps } from "../../types/cooperativa";

export default function CooperativaFormulario({
  modo,
}: CooperativaFormularioPaginaProps) {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useDadosCooperativas();

  if (modo === "edicao" && !id) {
    return (
      <section className="estado-vazio">
        <h1>Identificador ausente</h1>
        <Link className="botao" to="/cooperativas">Voltar</Link>
      </section>
    );
  }

  if (requisicao.status === "carregando") {
    return (
      <EstadoRequisicao
        estado="carregando"
        mensagem="Carregando formulário..."
      />
    );
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

  const existente = modo === "edicao"
    ? requisicao.dados.cooperativas.find((item) => item.id === id)
    : undefined;

  if (modo === "edicao" && !existente) {
    return (
      <section className="painel estado-vazio">
        <h1>Cooperativa não encontrada</h1>
        <Link className="botao" to="/cooperativas">Voltar</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">
            {modo === "edicao" ? "Editar cooperativa" : "Cadastrar cooperativa"}
          </h1>

          <p className="pagina-descricao">
            Gerencie dados, materiais e pontos de coleta
          </p>
        </div>
      </div>

      <EditorCooperativa
        key={existente?.id ?? "nova-cooperativa"}
        id={existente?.id}
        inicial={existente ?? cooperativaVazia()}
        usuarios={requisicao.dados.usuarios}
      />
    </section>
  );
}