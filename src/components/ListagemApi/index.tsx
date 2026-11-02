import { useId } from "react";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import EstadoRequisicao from "../EstadoRequisicao";
import Paginacao from "../Paginacao";
import { useReferenciasListagem } from "../../hooks/useReferenciasListagem";
import type { ListagemApiProps } from "../../types/listagemApi";

export default function ListagemApi<T extends { id: number }>({ titulo, descricao, caminhoCadastro, busca, onBuscaChange, filtrosExtras, acoesExtras, requisicao, colunas, onRecarregar, onPaginaChange }: ListagemApiProps<T>) {
  const buscaId = useId(); const carregando = requisicao.status === "carregando";
  const referencias = useReferenciasListagem(titulo);
  const nomes = referencias.requisicao.status === "sucesso" ? referencias.requisicao.dados : null;
  function nomeVinculo(item: T, coluna: string): string | undefined {
    if (!nomes) return undefined;
    const dados = item as unknown as Record<string, unknown>;
    if (coluna === "condominio") return nomes.condominios.find((v) => v.id === dados.condominioId)?.nome;
    if (coluna === "cooperativa") return nomes.cooperativas.find((v) => v.id === dados.cooperativaId)?.nome;
    if (coluna === "curso") return nomes.cursos.find((v) => v.id === dados.cursoId)?.titulo;
    if (coluna === "aula") return nomes.cursos.find((v) => v.id === dados.cursoId)?.aulas.find((v) => v.id === dados.aulaId)?.titulo;
    return undefined;
  }
  return <section><header className="pagina-cabecalho"><div><h1 className="pagina-titulo">{titulo}</h1><p className="pagina-descricao">{descricao}</p></div><div className="acoes-pagina">{acoesExtras}<button type="button" className="botao" disabled={carregando} onClick={() => { onRecarregar(); referencias.recarregar(); }}><RefreshCw size={17} />Atualizar</button>{caminhoCadastro && <Link className="botao botao--primario" to={caminhoCadastro}>Cadastrar</Link>}</div></header>
    <div className="filtros-listagem-api"><div className="campo"><label htmlFor={buscaId}>Pesquisar</label><input id={buscaId} className="entrada" type="search" placeholder="Pesquisar registros" maxLength={100} value={busca} onChange={(e) => onBuscaChange(e.target.value)} /></div>{filtrosExtras}</div>
    {referencias.requisicao.status === "erro" && (titulo === "Coletas" || titulo === "Quizzes") && <p className="pagina-descricao">Nomes dos vínculos indisponíveis. Os registros serão identificados pelos códigos. <button type="button" className="link-botao" onClick={referencias.recarregar}>Tentar novamente</button></p>}
    <div className="painel" aria-busy={carregando}>
      {requisicao.status === "carregando" && <EstadoRequisicao estado="carregando" mensagem="Carregando registros..." />}
      {requisicao.status === "erro" && <EstadoRequisicao estado="erro" mensagem={requisicao.mensagem} onTentarNovamente={onRecarregar} />}
      {requisicao.status === "sucesso" && <><p className="resultado-carregamento" role="status">{requisicao.dados.totalItens} registro(s) encontrado(s).</p>
        {requisicao.dados.itens.length === 0 ? <div className="estado-vazio"><h2>Nenhum registro encontrado</h2><p>Altere os filtros para tentar novamente.</p></div> : <div className="tabela-container"><table className="tabela-usuarios"><thead><tr>{colunas.map((coluna) => <th key={coluna.id} scope="col">{coluna.titulo}</th>)}</tr></thead><tbody>{requisicao.dados.itens.map((item) => <tr key={item.id}>{colunas.map((coluna) => <td key={coluna.id}>{nomeVinculo(item, coluna.id) ?? coluna.renderizar(item)}</td>)}</tr>)}</tbody></table></div>}
        <Paginacao paginaAtual={requisicao.dados.pagina + 1} totalPaginas={Math.max(1, requisicao.dados.totalPaginas)} totalItens={requisicao.dados.totalItens} porPagina={requisicao.dados.tamanho} onPaginaChange={(pagina) => onPaginaChange(pagina - 1)} />
      </>}
    </div>
  </section>;
}