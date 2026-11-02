import { ChevronDown,ChevronUp,Plus,Trash2 } from "lucide-react";
import { useId,useState } from "react";
import type { CamposVisuaisProps } from "../../types/visualAdmin";
import { nomeItem } from "../../utils/camposVisuais";
import { converterDataLocal,preencherDataLocal } from "../../utils/datasApi";
import { chaveItemEditor,prepararItensEditor } from "../../utils/itensEditor";
import Modal from "../Modal";

function objeto(valor: unknown): Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor) ? valor as Record<string, unknown> : {};
}

export default function CamposEditorApi({ campos, dados, onChange, leitura = false }: CamposVisuaisProps) {
  const prefixo = useId();
  const [remocao, setRemocao] = useState<{ chave: string; indice: number } | null>(null);
  function alterar(chave: string, valor: unknown): void {
    const novos = { ...dados, [chave]: valor };
    if (chave === "cursoId" && valor !== dados.cursoId) novos.aulaId = null;
    if (chave === "recorrente" && !valor) novos.diasSemanaIds = [];
    onChange(novos);
  }
  return <div className="editor-api-campos visual-campos">
    {campos.map((campo) => {
      const valor = dados[campo.chave];
      const identificador = `${prefixo}-${campo.chave}`;
      if (campo.chave === "diasSemanaIds" && dados.recorrente === false && !leitura) return null;
      if (campo.tipo === "object") return <section className="secao-formulario visual-secao" key={campo.chave}>
        <h2>{campo.titulo}</h2>
        {valor === null ? leitura ? <p>Não informado.</p> : <button type="button" className="botao" onClick={() => alterar(campo.chave, structuredClone(campo.novo ?? {}))}>Preencher endereço</button>
          : <CamposEditorApi campos={campo.campos ?? []} dados={objeto(valor)} leitura={leitura} onChange={(novo) => alterar(campo.chave, novo)} />}
      </section>;
      if (campo.tipo === "array") {
        const itens = Array.isArray(valor) ? valor.map(objeto) : [];
        function atualizar(indice: number, novo: Record<string, unknown>): void {
          alterar(campo.chave, itens.map((item, posicao) => posicao === indice ? novo
            : campo.chave === "alternativas" && novo.correta === true ? { ...item, correta: false } : item));
        }
        function mover(indice: number, direcao: number): void {
          const destino = indice + direcao;
          if (destino < 0 || destino >= itens.length) return;
          const novos = [...itens];
          [novos[indice], novos[destino]] = [novos[destino], novos[indice]];
          alterar(campo.chave, novos);
        }
        return <section className="secao-formulario visual-secao" key={campo.chave}>
          <div className="visual-secao-titulo"><h2>{campo.titulo}</h2><span>{itens.length}</span></div>
          {itens.length === 0 && <p className="pagina-descricao">Nenhum item adicionado.</p>}
          {itens.map((item, indice) => <section className="ponto-editor visual-item" key={chaveItemEditor(item)}>
            <div className="visual-item-topo"><h3>{nomeItem(campo.chave)} {indice + 1}</h3>
              {!leitura && <div className="visual-item-acoes">
                <button type="button" className="botao" aria-label={`Subir ${nomeItem(campo.chave)}`} disabled={indice === 0} onClick={() => mover(indice, -1)}><ChevronUp size={17} /></button>
                <button type="button" className="botao" aria-label={`Descer ${nomeItem(campo.chave)}`} disabled={indice === itens.length - 1} onClick={() => mover(indice, 1)}><ChevronDown size={17} /></button>
                <button type="button" className="botao botao--perigo" onClick={() => setRemocao({ chave: campo.chave, indice })}><Trash2 size={15} />Remover</button>
              </div>}
            </div>
            <CamposEditorApi campos={campo.campos ?? []} dados={item} leitura={leitura} onChange={(novo) => atualizar(indice, novo)} />
          </section>)}
          {!leitura && <button type="button" className="botao" onClick={() => alterar(campo.chave, [...itens, ...((prepararItensEditor({ itens: [structuredClone(campo.novo ?? {})] }).itens) as Record<string, unknown>[])])}><Plus size={16} />Adicionar {nomeItem(campo.chave).toLocaleLowerCase()}</button>}
        </section>;
      }
      if (campo.tipo === "multiselect") {
        const selecionados = Array.isArray(valor) ? valor.filter((v): v is number => typeof v === "number") : [];
        return <fieldset className="secao-formulario visual-secao" key={campo.chave}><legend>{campo.titulo}</legend>
          <div className="materiais-opcoes">{campo.opcoes?.map((opcao) => <label className="material-opcao" key={opcao.id}>
            <input type="checkbox" disabled={leitura} checked={selecionados.includes(opcao.id)} onChange={(evento) => alterar(campo.chave, evento.target.checked ? [...selecionados, opcao.id] : selecionados.filter((id) => id !== opcao.id))} />{opcao.nome}
          </label>)}</div>
        </fieldset>;
      }
      if (campo.tipo === "checkbox") return <label className="material-opcao visual-checkbox" key={campo.chave}>
        <input type="checkbox" checked={Boolean(valor)} disabled={leitura} onChange={(evento) => alterar(campo.chave, evento.target.checked)} />{campo.titulo}
      </label>;
      const texto = valor == null ? "" : String(valor);
      const titulo = campo.chave === "origemSolicitacao" ? "Origem da solicitação" : campo.titulo;
      return <div className={`campo visual-campo ${campo.tipo === "textarea" || campo.chave === "nome" || campo.chave === "titulo" ? "visual-campo--largo" : ""}`} key={campo.chave}>
        <label htmlFor={identificador}>{titulo}{campo.obrigatorio && <span aria-hidden="true"> *</span>}</label>
        {campo.chave === "origemSolicitacao" ? <select id={identificador} disabled={leitura} value={texto} onChange={(evento) => alterar(campo.chave, evento.target.value)}><option value="CONDOMINIO">Condomínio</option><option value="COOPERATIVA">Cooperativa</option></select>
        : campo.tipo === "select" ? <select id={identificador} value={texto} required={campo.obrigatorio} disabled={leitura} onChange={(evento) => alterar(campo.chave, evento.target.value ? Number(evento.target.value) : null)}>
          <option value="">{campo.obrigatorio ? "Selecione" : "Não vinculado"}</option>
          {texto && !campo.opcoes?.some((opcao) => String(opcao.id) === texto) && <option value={texto}>Vínculo atual #{texto}</option>}
          {campo.opcoes?.map((opcao) => <option key={opcao.id} value={opcao.id}>{opcao.nome}</option>)}
        </select>
        : campo.tipo === "textarea" ? <textarea id={identificador} value={texto} required={campo.obrigatorio} readOnly={leitura} rows={4} onChange={(evento) => alterar(campo.chave, evento.target.value)} />
        : <input id={identificador} type={campo.tipo === "datetime" ? "datetime-local" : campo.tipo}
            step={campo.tipo === "number" ? "1" : undefined}
            min={campo.chave === "notaMinima" ? 0 : campo.chave === "pontos" ? 1 : undefined}
            max={campo.chave === "notaMinima" ? 100 : undefined}
            maxLength={campo.chave === "cep" ? 8 : campo.chave === "uf" ? 2 : campo.chave === "urlFoto" ? 500 : undefined}
            value={campo.tipo === "datetime" ? preencherDataLocal(texto || null) : texto} required={campo.obrigatorio} readOnly={leitura}
            onChange={(evento) => {
              let novo = evento.target.value;
              if (campo.chave === "cep") novo = novo.replace(/\D/g, "");
              if (campo.chave === "uf") novo = novo.replace(/[^a-z]/gi, "").toUpperCase();
              alterar(campo.chave, campo.tipo === "number" ? novo === "" ? null : Number(novo)
                : campo.tipo === "datetime" ? novo ? converterDataLocal(novo) : null : novo || (campo.obrigatorio ? "" : null));
            }} />}
      </div>;
    })}
    <Modal aberto={remocao !== null} titulo="Remover item" onFechar={() => setRemocao(null)}>
      <p>Remover este item do formulário? A alteração só será enviada ao salvar.</p>
      <p className="pagina-descricao">Itens com histórico podem ter a exclusão bloqueada pela API.</p>
      <div className="formulario-acoes"><button type="button" className="botao" onClick={() => setRemocao(null)}>Cancelar</button><button type="button" className="botao botao--perigo" onClick={() => {
        if (remocao) { const lista = dados[remocao.chave]; if (Array.isArray(lista)) alterar(remocao.chave, lista.filter((_, indice) => indice !== remocao.indice)); }
        setRemocao(null);
      }}>Remover</button></div>
    </Modal>
  </div>;
}
