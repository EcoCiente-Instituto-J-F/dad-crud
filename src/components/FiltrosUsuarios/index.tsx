import { Search } from "lucide-react";

import type { FiltrosUsuariosProps } from "../../types/usuario";

export default function FiltrosUsuarios({
  filtros,
  onBuscaChange,
  onStatusChange,
  onOrdenacaoChange,
}: FiltrosUsuariosProps) {
  return (
    <div className="filtros-usuarios">
      <div className="campo campo--busca">
        <label htmlFor="busca-usuarios">Pesquisar usuários</label>

        <div className="campo-pesquisa">
          <Search size={19} aria-hidden="true" />

          <input
            id="busca-usuarios"
            type="search"
            placeholder="Nome, e-mail ou localidade"
            maxLength={120}
            value={filtros.busca}
            onChange={(evento) => onBuscaChange(evento.target.value)}
          />
        </div>
      </div>

      <div className="campo">
        <label htmlFor="status-usuarios">Status</label>

        <select
          id="status-usuarios"
          value={filtros.status}
          onChange={(evento) => {
            const valor = evento.target.value;

            if (
              valor === "TODOS" ||
              valor === "ATIVO" ||
              valor === "INATIVO"
            ) {
              onStatusChange(valor);
            }
          }}
        >
          <option value="TODOS">Todos</option>
          <option value="ATIVO">Ativos</option>
          <option value="INATIVO">Inativos</option>
        </select>
      </div>

      <div className="campo">
        <label htmlFor="ordenacao-usuarios">Ordenar por</label>

        <select
          id="ordenacao-usuarios"
          value={filtros.ordenacao}
          onChange={(evento) => {
            const valor = evento.target.value;

            if (valor === "NOME_ASC" || valor === "NOME_DESC") {
              onOrdenacaoChange(valor);
            }
          }}
        >
          <option value="NOME_ASC">Nome: A–Z</option>
          <option value="NOME_DESC">Nome: Z–A</option>
        </select>
      </div>
    </div>
  );
}