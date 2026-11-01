import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useCursoApi } from "../../hooks/useModulosApi";
import { useSalvarAula } from "../../hooks/useSalvarAula";
import type { CursoApi } from "../../types/modulosApi";
function Formulario({ curso, aulaId }: { curso: CursoApi; aulaId: number | null }) {
  const aula = curso.aulas.find((v) => v.id === aulaId); const [titulo, setTitulo] = useState(aula?.titulo ?? ""); const [conteudo, setConteudo] = useState(aula?.conteudo ?? ""); const acao = useSalvarAula(curso.id, aulaId);
  if (aulaId !== null && !aula) return <EstadoRequisicao estado="erro" mensagem="Aula não encontrada." />;
  return <section><header className="pagina-cabecalho"><div><h1 className="pagina-titulo">{aulaId === null ? "Cadastrar aula" : "Editar aula"}</h1><p className="pagina-descricao">{curso.titulo}</p></div><Link className="botao" to={`/cursos/${curso.id}`}>Voltar</Link></header><form className="painel formulario visual-painel" onSubmit={(evento) => { evento.preventDefault(); void acao.salvar(titulo, conteudo); }}><fieldset className="visual-fieldset" disabled={acao.salvando}><legend>Informações da aula</legend><div className="visual-campos"><div className="campo visual-campo visual-campo--largo"><label htmlFor="aula-titulo">Título</label><input id="aula-titulo" required maxLength={255} value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div><div className="campo visual-campo visual-campo--largo"><label htmlFor="aula-conteudo">Conteúdo</label><textarea id="aula-conteudo" rows={10} required value={conteudo} onChange={(e) => setConteudo(e.target.value)} /></div></div><p className="visual-aviso">A ordem das aulas será preservada. Novas aulas são adicionadas ao final do curso.</p>{acao.mensagem && <p className="mensagem-erro" role="alert">{acao.mensagem}</p>}<div className="formulario-acoes"><Link className="botao" to={`/cursos/${curso.id}`}>Cancelar</Link><button type="submit" className="botao botao--primario">{acao.salvando ? "Salvando..." : "Salvar aula"}</button></div></fieldset></form></section>;
}
export default function AulaFormulario() {
  const { id, aulaId } = useParams(); const consulta = useCursoApi(id); const identificador = aulaId === undefined ? null : Number(aulaId);
  if (identificador !== null && (!Number.isSafeInteger(identificador) || identificador <= 0)) return <EstadoRequisicao estado="erro" mensagem="Identificação inválida." />;
  if (consulta.requisicao.status === "carregando") return <EstadoRequisicao estado="carregando" />;
  if (consulta.requisicao.status === "erro") return <EstadoRequisicao estado="erro" mensagem={consulta.requisicao.mensagem} onTentarNovamente={consulta.recarregar} />;
  return <Formulario key={`${id}-${aulaId ?? "nova"}`} curso={consulta.requisicao.dados} aulaId={identificador} />;
}