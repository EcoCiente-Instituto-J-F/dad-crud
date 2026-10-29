import type { SelecaoProps } from "../../types/formulario";

export default function Selecao({
  id,
  titulo,
  valor,
  onChange,
  children,
  erro,
}: SelecaoProps) {
  return (
    <div className="campo">
      <label htmlFor={id}>{titulo}</label>

      <select
        id={id}
        value={valor}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? id + "-erro" : undefined}
        onChange={(evento) => onChange(evento.target.value)}
      >
        {children}
      </select>

      {erro && (
        <span id={id + "-erro"} className="erro-campo" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}