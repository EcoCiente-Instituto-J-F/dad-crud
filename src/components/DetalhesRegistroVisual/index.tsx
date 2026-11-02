import { Link } from "react-router-dom";
import type { CampoEditor } from "../../types/editorModulo";
import type { DetalhesVisuaisProps } from "../../types/visualAdmin";
import { chaveItemEditor } from "../../utils/itensEditor";
import SecaoRegistroModal from "../SecaoRegistroModal";

function objeto(valor: unknown): Record<string, unknown> { return typeof valor === "object" && valor !== null && !Array.isArray(valor) ? valor as Record<string, unknown> : {}; }
function mostrar(campo: CampoEditor, valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") return "Não informado";
  if (campo.tipo === "checkbox") return valor ? "Sim" : "Não";
  if (campo.tipo === "select") return campo.opcoes?.find((opcao) => opcao.id === valor)?.nome ?? `#${String(valor)}`;
  if (campo.tipo === "multiselect" && Array.isArray(valor)) return valor.map((id) => campo.opcoes?.find((opcao) => opcao.id === id)?.nome ?? `#${String(id)}`).join(", ") || "Nenhuma";
  if (campo.tipo === "datetime") { const data = new Date(String(valor)); return Number.isNaN(data.getTime()) ? "Não informado" : data.toLocaleString("pt-BR"); }
  if (campo.chave === "origemSolicitacao") return valor === "CONDOMINIO" ? "Condomínio" : "Cooperativa";
  return String(valor);
}

export default function DetalhesRegistroVisual({ campos, dados, modulo, id, onRecarregar }: DetalhesVisuaisProps) {
  const simples = campos.filter((campo) => campo.tipo !== "array" && campo.tipo !== "object");
  const colecoes = campos.filter((campo) => campo.tipo === "array");
  return <div className="visual-detalhes">
    <div className="visual-detalhes-grade">
      <section className="painel visual-painel"><h2>Informações gerais</h2>
        <dl className="visual-definicoes">{simples.map((campo) => <div key={campo.chave}><dt>{campo.titulo}</dt><dd>{mostrar(campo, dados[campo.chave])}
          {campo.chave === "sindicoId" && modulo === "condominios" && <div className="visual-acao-campo"><SecaoRegistroModal modulo={modulo} id={id} campo={campo} dados={dados} onRecarregar={onRecarregar} /></div>}
        </dd></div>)}</dl>
      </section>
      {campos.filter((campo) => campo.tipo === "object").map((campo) => <section className="painel visual-painel" key={campo.chave}><h2>{campo.titulo}</h2>
        <dl className="visual-definicoes">{campo.campos?.map((filho) => <div key={filho.chave}><dt>{filho.titulo}</dt><dd>{mostrar(filho, objeto(dados[campo.chave])[filho.chave])}</dd></div>)}</dl>
      </section>)}
    </div>
    {colecoes.map((campo) => {
      const itens = Array.isArray(dados[campo.chave]) ? (dados[campo.chave] as unknown[]).map(objeto) : [];
      const colunas = (campo.campos ?? []).filter((filho) => filho.tipo !== "array" && filho.tipo !== "object");
      const gerenciavel = (modulo === "condominios" && campo.chave === "torres") || (modulo === "cooperativas" && campo.chave === "pontos");
      return <section className="painel visual-painel visual-colecao" key={campo.chave}>
        <div className="visual-secao-titulo"><h2>{campo.titulo} <span className="visual-contagem">{itens.length}</span></h2>
          {gerenciavel && <SecaoRegistroModal modulo={modulo} id={id} campo={campo} dados={dados} onRecarregar={onRecarregar} />}
          {modulo === "cursos" && campo.chave === "aulas" && <Link className="botao" to={`/cursos/${id}/aulas/cadastrar`}>Cadastrar aula</Link>}
        </div>
        {itens.length === 0 ? <p className="pagina-descricao">Nenhum registro.</p> : <div className="tabela-container"><table className="tabela-usuarios"><thead><tr><th scope="col">#</th>{colunas.map((coluna) => <th scope="col" key={coluna.chave}>{coluna.titulo}</th>)}{modulo === "cursos" && <th scope="col">Ações</th>}</tr></thead>
          <tbody>{itens.map((item, indice) => <tr key={chaveItemEditor(item)}><td>{indice + 1}</td>{colunas.map((coluna) => <td key={coluna.chave}>{mostrar(coluna, item[coluna.chave])}</td>)}
            {modulo === "cursos" && <td><Link className="botao" to={`/cursos/${id}/aulas/${String(item.id)}/editar`}>Editar aula</Link></td>}
          </tr>)}</tbody></table></div>}
      </section>;
    })}
  </div>;
}
