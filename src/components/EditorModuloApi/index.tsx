import { Link, useParams } from "react-router-dom";

import CamposEditorApi from "../CamposEditorApi";
import EstadoRequisicao from "../EstadoRequisicao";

import { useCatalogos } from "../../hooks/useCatalogos";
import { useEditorModulo } from "../../hooks/useEditorModulo";
import { configurarEditor } from "../../utils/configurarEditor";

import type {
  ConfiguracaoEditor,
  NomeModulo,
} from "../../types/editorModulo";

interface Props {
  modulo: NomeModulo;
  modo?: "cadastro" | "edicao";
  leitura?: boolean;
}

interface ConteudoProps {
  modulo: NomeModulo;
  id: number | null;
  leitura: boolean;
  configuracao: ConfiguracaoEditor;
}

function Conteudo({
  modulo,
  id,
  leitura,
  configuracao,
}: ConteudoProps) {
  const editor = useEditorModulo(modulo, id, configuracao.inicial);

  if (editor.carregando) {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (editor.falhaCarga) {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={editor.falhaCarga}
        onTentarNovamente={editor.recarregar}
      />
    );
  }

  const possuiVisitas =
    modulo === "coletas" &&
    Array.isArray(editor.dados.visitas) &&
    editor.dados.visitas.length > 0;

  const campos = possuiVisitas && !leitura
    ? configuracao.campos.filter(
      (campo) => campo.chave === "statusId",
    )
    : configuracao.campos.filter(
      (campo) => leitura || campo.chave !== "visitas",
    );

  return (
    <section>
      <div className="pagina-cabecalho">
        <h1 className="pagina-titulo">
          {leitura ? "Detalhes" : id === null ? "Cadastrar" : "Editar"}
          {" — "}{configuracao.titulo}
        </h1>

        <div className="acoes-pagina">
          <Link className="botao" to={`/${modulo}`}>Voltar</Link>

          {leitura && id !== null && (
            <Link
              className="botao botao--primario"
              to={`/${modulo}/${id}/editar`}
            >
              Editar
            </Link>
          )}
        </div>
      </div>

      <form
        className="painel formulario"
        onSubmit={(evento) => {
          evento.preventDefault();
          if (!leitura) void editor.salvar();
        }}
      >
        <fieldset disabled={editor.salvando}>
          {possuiVisitas && !leitura && (
            <p>Este agendamento possui visitas. Apenas a situação pode ser alterada.</p>
          )}

          {modulo === "quizzes" && !leitura && id !== null && (
            <p>
              Se houver tentativas, preserve perguntas, alternativas,
              nota mínima, pontos, curso e aula. A API permite alterar
              somente título e situação nesses casos.
            </p>
          )}

          <CamposEditorApi
            campos={campos}
            dados={editor.dados}
            leitura={leitura}
            onChange={editor.setDados}
          />

          {editor.mensagem && (
            <p className="mensagem-erro" role="alert">{editor.mensagem}</p>
          )}

          {!leitura && (
            <div className="formulario-acoes">
              <button
                type="submit"
                className="botao botao--primario"
                disabled={editor.salvando}
              >
                {editor.salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
        </fieldset>
      </form>
    </section>
  );
}

export default function EditorModuloApi({
  modulo,
  modo = "cadastro",
  leitura = false,
}: Props) {
  const parametros = useParams();
  const catalogos = useCatalogos();

  const usaId = leitura || modo === "edicao";
  const id = usaId ? Number(parametros.id) : null;

  if (
    usaId &&
    (id === null || !Number.isSafeInteger(id) || id <= 0)
  ) {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem="Identificação inválida."
      />
    );
  }

  if (catalogos.requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (catalogos.requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={catalogos.requisicao.mensagem}
        onTentarNovamente={catalogos.recarregar}
      />
    );
  }

  return (
    <Conteudo
      key={`${modulo}-${id ?? "novo"}`}
      modulo={modulo}
      id={id}
      leitura={leitura}
      configuracao={configurarEditor(
        modulo,
        catalogos.requisicao.dados,
      )}
    />
  );
}