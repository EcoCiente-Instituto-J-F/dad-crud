import type { Catalogos } from "../../types/catalogos";

interface FiltrosUsuariosApiProps {
  busca: string;
  ativo: boolean | undefined;
  tipoUsuarioId: number | undefined;
  tipos: Catalogos["tiposUsuarios"];
  onBuscaChange: (valor: string) => void;
  onAtivoChange: (valor: boolean | undefined) => void;
  onTipoChange: (valor: number | undefined) => void;
}

export default function FiltrosUsuariosApi({
  busca,
  ativo,
  tipoUsuarioId,
  tipos,
  onBuscaChange,
  onAtivoChange,
  onTipoChange,
}: FiltrosUsuariosApiProps) {
  return (
    <div className="filtros-usuarios">
      <div className="campo campo--busca">
        <label htmlFor="usuarios-busca">Pesquisar</label>

        <input
          id="usuarios-busca"
          className="entrada"
          type="search"
          placeholder="Buscar usuários"
          maxLength={100}
          value={busca}
          onChange={(evento) => onBuscaChange(evento.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="usuarios-status">Situação</label>

        <select
          id="usuarios-status"
          value={ativo === undefined ? "" : String(ativo)}
          onChange={(evento) => {
            const valor = evento.target.value;

            onAtivoChange(valor === "" ? undefined : valor === "true");
          }}
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <div className="campo">
        <label htmlFor="usuarios-tipo">Tipo de usuário</label>

        <select
          id="usuarios-tipo"
          value={tipoUsuarioId ?? ""}
          onChange={(evento) => {
            const valor = evento.target.value;

            onTipoChange(valor === "" ? undefined : Number(valor));
          }}
        >
          <option value="">Todos</option>

          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}