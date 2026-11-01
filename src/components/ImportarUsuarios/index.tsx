import { useState } from "react";
import { Upload } from "lucide-react";
import Modal from "../Modal";
import { useImportacaoUsuarios } from "../../hooks/useImportacaoUsuarios";
import { importacaoAtiva } from "../../services/importacaoUsuariosService";
import { colunasImportacao } from "../../types/importacaoUsuarios";

function ConteudoImportacao({ onConcluido, onFechar }: { onConcluido: () => void; onFechar: () => void }) {
  const estado = useImportacaoUsuarios();
  const validas = estado.linhas.filter((linha) => linha.dados !== null).length;
  function baixarModelo(): void {
    const blob = new Blob(["\uFEFF" + colunasImportacao.join(";") + "\r\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "modelo-usuarios.csv"; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="visual-importacao">
    <p className="visual-aviso">CSV de até 1 MB e 100 usuários. Use os IDs dos catálogos. Senhas não aparecem na prévia e não são salvas no navegador.</p>
    <button type="button" className="botao" onClick={baixarModelo}>Baixar modelo CSV</button>
    <label className="visual-upload">Selecionar arquivo CSV<input type="file" accept=".csv,text/csv" disabled={estado.salvando || estado.lendo} onChange={(evento) => { const arquivo = evento.target.files?.[0]; if (arquivo) void estado.selecionar(arquivo); evento.target.value = ""; }} /></label>
    {estado.lendo && <p role="status">Validando arquivo...</p>}
    {estado.mensagem && <p className="mensagem-erro" role="alert">{estado.mensagem}</p>}
    {estado.sucesso !== null && <p className="visual-aviso" role="status">{estado.sucesso} usuário(s) importado(s).</p>}
    {estado.linhas.length > 0 && <><p role="status">{validas} linha(s) válida(s) de {estado.linhas.length}.</p><div className="tabela-container visual-importacao-tabela"><table className="tabela-usuarios"><thead><tr><th>Linha</th><th>Nome</th><th>E-mail</th><th>Validação</th></tr></thead><tbody>{estado.linhas.map((linha) => <tr key={linha.linha}><td>{linha.linha}</td><td>{linha.nome}</td><td>{linha.email}</td><td>{linha.erros.length ? linha.erros.join(" • ") : "Válida"}</td></tr>)}</tbody></table></div></>}
    {!importacaoAtiva && <p className="visual-aviso visual-aviso--atencao">Envio indisponível no momento. Você pode validar o arquivo e conferir a prévia.</p>}
    <div className="formulario-acoes"><button type="button" className="botao" disabled={estado.salvando} onClick={onFechar}>Fechar</button><button type="button" className="botao botao--primario" disabled={!importacaoAtiva || estado.lendo || estado.salvando || validas === 0 || validas !== estado.linhas.length} onClick={() => void estado.enviar(onConcluido)}>{estado.salvando ? "Importando..." : "Importar usuários"}</button></div>
  </div>;
}

export default function ImportarUsuarios({ onConcluido }: { onConcluido: () => void }) {
  const [aberto, setAberto] = useState(false);
  return <><button type="button" className="botao" onClick={() => setAberto(true)}><Upload size={16} aria-hidden="true" />Importar</button><Modal aberto={aberto} titulo="Importar usuários" onFechar={() => setAberto(false)}>{aberto && <ConteudoImportacao onConcluido={onConcluido} onFechar={() => setAberto(false)} />}</Modal></>;
}