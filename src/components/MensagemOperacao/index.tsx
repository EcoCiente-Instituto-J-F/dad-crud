import { useLocation } from "react-router-dom";
export default function MensagemOperacao() {
  const { state } = useLocation();
  const valor: unknown = state;
  const mensagem = typeof valor === "object" && valor !== null && "mensagemSucesso" in valor && typeof valor.mensagemSucesso === "string" ? valor.mensagemSucesso : null;
  return mensagem ? <p className="visual-aviso" role="status">{mensagem}</p> : null;
}
