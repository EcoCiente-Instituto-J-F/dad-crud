import type { CampoProps } from "../../types/formulario";

export default function Campo({
  id,
  titulo,
  valor,
  onChange,
  erro,
  tipo = "text",
  maximo = 200,
  multiline = false,
  obrigatorio = true,
  min,
  max,
  step,
}: CampoProps) {
  return (
    <div className="campo">
      <label htmlFor={id}>{titulo}</label>

      {multiline ? (
        <textarea
          id={id}
          value={valor}
          maxLength={maximo}
          required={obrigatorio}
          onChange={(evento) => onChange(evento.target.value)}
        />
      ) : (
        <input
          id={id}
          type={tipo}
          value={valor}
          maxLength={maximo}
          required={obrigatorio}
          min={min}
          max={max}
          step={step}
          onChange={(evento) => onChange(evento.target.value)}
        />
      )}

      {erro && (
        <span className="erro-campo" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}