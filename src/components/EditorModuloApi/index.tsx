import { Link, useParams } from "react-router-dom";
import CamposEditorApi from "../CamposEditorApi";
import CampoColecaoModal from "../CampoColecaoModal";
import DetalhesRegistroVisual from "../DetalhesRegistroVisual";
import EstadoRequisicao from "../EstadoRequisicao";
import PreviaQuiz from "../PreviaQuiz";
import { useCatalogos } from "../../hooks/useCatalogos";
import { useEditorModulo } from "../../hooks/useEditorModulo";
import { useReferenciasAdmin } from "../../hooks/useReferenciasAdmin";
import { configurarEditor } from "../../utils/configurarEditor";
import { adaptarCamposVisuais } from "../../utils/camposVisuais";
import type { NomeModulo } from "../../types/editorModulo";
import type { ConteudoVisualProps } from "../../types/visualAdmin";

function Conteudo({ modulo, id, leitura, configuracao }: ConteudoVisualProps) {
  const editor = useEditorModulo(modulo, id, configuracao.inicial);
  const referencias = useReferenciasAdmin(modulo);
  if (editor.carregando) return <EstadoRequisicao estado="carregando" />;
  if (editor.falhaCarga) return <EstadoRequisicao estado="erro" mensagem={editor.falhaCarga} onTentarNovamente={editor.recarregar} />;
  if (referencias.requisicao.status === "carregando") return <EstadoRequisicao estado="carregando" mensagem="Carregando vínculos..." />;
  if (referencias.requisicao.status === "erro") return <EstadoRequisicao estado="erro" mensagem={referencias.requisicao.mensagem} onTentarNovamente={referencias.recarregar} />;
  const campos = adaptarCamposVisuais(modulo, configuracao.campos, editor.dados, referencias.requisicao.dados);
  const possuiVisitas = modulo === "coletas" && Array.isArray(editor.dados.visitas) && editor.dados.visitas.length > 0;
  const possuiTentativas = modulo === "quizzes" && (editor.dados.possuiTentativas === true || (typeof editor.dados.totalTentativas === "number" && editor.dados.totalTentativas > 0));
  const editaveis = campos.filter((campo) => campo.chave !== "visitas")
    .filter((campo) => !possuiVisitas || campo.chave === "statusId")
    .filter((campo) => !possuiTentativas || campo.chave === "titulo" || campo.chave === "ativo");
  const emModal = editaveis.filter((campo) => (modulo === "condominios" && ["sindicoId", "torres"].includes(campo.chave)) || (modulo === "cooperativas" && campo.chave === "pontos"));
  const normais = editaveis.filter((campo) => !emModal.includes(campo));
  const principais = normais.filter((campo) => !["object", "array", "multiselect"].includes(campo.tipo));
  const secoes = normais.filter((campo) => ["object", "array", "multiselect"].includes(campo.tipo));
  const nome = typeof editor.dados.nome === "string" ? editor.dados.nome : typeof editor.dados.titulo === "string" ? editor.dados.titulo : "";
  return <section className="visual-modulo">
    <header className="pagina-cabecalho"><div><h1 className="pagina-titulo">{leitura ? `Detalhes ${configuracao.titulo === "Cooperativa" ? "da cooperativa" : `— ${configuracao.titulo}`}` : `${id === null ? "Cadastrar" : "Editar"} — ${configuracao.titulo}`}</h1><p className="pagina-descricao">{leitura ? nome : "Preencha as informações e salve as alterações."}</p></div>
      <div className="acoes-pagina">{modulo === "quizzes" && <PreviaQuiz dados={editor.dados} />}<Link className="botao" to={`/${modulo}`}>Voltar</Link>{leitura && id !== null && <Link className="botao botao--primario" to={`/${modulo}/${id}/editar`}>Editar</Link>}</div>
    </header>
    {leitura && id !== null ? <DetalhesRegistroVisual modulo={modulo} id={id} campos={campos} dados={editor.dados} onChange={editor.setDados} onRecarregar={editor.recarregar} />
    : <form className={`visual-formulario visual-formulario--${modulo}`} onSubmit={(evento) => { evento.preventDefault(); void editor.salvar(); }}>
      <fieldset disabled={editor.salvando} className="visual-fieldset">
        {possuiVisitas && <p className="visual-aviso">Este agendamento possui visitas. Apenas a situação pode ser alterada.</p>}
        {modulo === "quizzes" && id !== null && <p className="visual-aviso">Quizzes com tentativas permitem alterar somente título e situação.</p>}
        <section className="painel formulario visual-painel"><h2>{modulo === "quizzes" ? "Configuração do quiz" : modulo === "coletas" ? "Agendamento" : "Informações gerais"}</h2><CamposEditorApi campos={principais} dados={editor.dados} onChange={editor.setDados} /></section>
        {emModal.length > 0 && <div className="visual-configuracoes">{emModal.map((campo) => <CampoColecaoModal key={campo.chave} campo={campo} dados={editor.dados} onChange={editor.setDados} />)}</div>}
        {secoes.map((campo) => <section className="painel formulario visual-painel" key={campo.chave}><CamposEditorApi campos={[campo]} dados={editor.dados} onChange={editor.setDados} /></section>)}
        {editor.mensagem && <p className="mensagem-erro visual-mensagem" role="alert">{editor.mensagem}</p>}
        <div className="formulario-acoes"><Link className="botao" to={`/${modulo}`}>Cancelar</Link><button type="submit" className="botao botao--primario">{editor.salvando ? "Salvando..." : "Salvar"}</button></div>
      </fieldset>
      {(modulo === "quizzes" || modulo === "coletas") && <aside className="painel visual-resumo-editor">
        <h2>Resumo</h2>
        {modulo === "quizzes" ? <dl>
          <div><dt>Curso</dt><dd>{referencias.requisicao.dados.cursos.find((curso) => curso.id === editor.dados.cursoId)?.titulo ?? "Selecione o curso"}</dd></div>
          <div><dt>Aula</dt><dd>{referencias.requisicao.dados.cursos.find((curso) => curso.id === editor.dados.cursoId)?.aulas.find((aula) => aula.id === editor.dados.aulaId)?.titulo ?? "Selecione a aula"}</dd></div>
          <div><dt>Perguntas</dt><dd>{Array.isArray(editor.dados.perguntas) ? editor.dados.perguntas.length : 0}</dd></div>
          <div><dt>Nota mínima</dt><dd>{String(editor.dados.notaMinima ?? 0)}%</dd></div>
          <div><dt>Recompensa</dt><dd>{String(editor.dados.pontos ?? 0)} pontos</dd></div>
        </dl> : <dl>
          <div><dt>Condomínio</dt><dd>{referencias.requisicao.dados.condominios.find((item) => item.id === editor.dados.condominioId)?.nome ?? "Selecione o condomínio"}</dd></div>
          <div><dt>Cooperativa</dt><dd>{referencias.requisicao.dados.cooperativas.find((item) => item.id === editor.dados.cooperativaId)?.nome ?? "Selecione a cooperativa"}</dd></div>
          <div><dt>Situação</dt><dd>{campos.find((campo) => campo.chave === "statusId")?.opcoes?.find((item) => item.id === editor.dados.statusId)?.nome ?? "Selecione a situação"}</dd></div>
          <div><dt>Recorrência</dt><dd>{editor.dados.recorrente ? "Sim" : "Não"}</dd></div>
          <div><dt>Dias selecionados</dt><dd>{Array.isArray(editor.dados.diasSemanaIds) && editor.dados.diasSemanaIds.length > 0 ? campos.find((campo) => campo.chave === "diasSemanaIds")?.opcoes?.filter((dia) => (editor.dados.diasSemanaIds as unknown[]).includes(dia.id)).map((dia) => dia.nome).join(", ") : "Nenhum"}</dd></div>
        </dl>}
      </aside>}
    </form>}
  </section>;
}

export default function EditorModuloApi({ modulo, modo = "cadastro", leitura = false }: { modulo: NomeModulo; modo?: "cadastro" | "edicao"; leitura?: boolean }) {
  const parametros = useParams(); const catalogos = useCatalogos();
  const usaId = leitura || modo === "edicao"; const id = usaId ? Number(parametros.id) : null;
  if (usaId && (id === null || !Number.isSafeInteger(id) || id <= 0)) return <EstadoRequisicao estado="erro" mensagem="Identificação inválida." />;
  if (catalogos.requisicao.status === "carregando") return <EstadoRequisicao estado="carregando" />;
  if (catalogos.requisicao.status === "erro") return <EstadoRequisicao estado="erro" mensagem={catalogos.requisicao.mensagem} onTentarNovamente={catalogos.recarregar} />;
  return <Conteudo key={`${modulo}-${id ?? "novo"}`} modulo={modulo} id={id} leitura={leitura} catalogos={catalogos.requisicao.dados} configuracao={configurarEditor(modulo, catalogos.requisicao.dados)} />;
}