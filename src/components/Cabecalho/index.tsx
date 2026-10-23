import { Link } from "react-router-dom";

import type { CabecalhoProps } from "../../types/layout";

export default function Cabecalho({
  nomeAdministrador,
}: CabecalhoProps) {
  const iniciais = nomeAdministrador
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((nome) => nome.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="cabecalho">
      <Link className="marca" to="/usuarios">
        EcoCiente
      </Link>

      <div className="perfil">
        <span className="perfil__avatar">{iniciais}</span>
        <span>{nomeAdministrador}</span>
      </div>
    </header>
  );
}