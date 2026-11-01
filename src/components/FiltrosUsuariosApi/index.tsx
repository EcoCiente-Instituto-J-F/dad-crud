import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import Modal from "../Modal";
import type { FiltrosUsuariosModalProps } from "../../types/filtrosUsuariosModal";

export default function FiltrosUsuariosApi({
  busca,
  ativo,
  tipoUsuarioId,
  tipos,
  onBuscaChange,
  onAtivoChange,
  onTipoChange,
}: FiltrosUsuariosModalProps) {
  const [aberto, setAberto] = useState(false);
  const [situacaoRascunho, setSituacaoRascunho] = useState("");
  const [tipoRascunho, setTipoRascunho] = useState("");

  const quantidadeFiltros =
    Number(ativo !== undefined) + Number(tipoUsuarioId !== undefined);

  const nomeTipo = tipos.find((tipo) => tipo.id === tipoUsuarioId)?.nome;

  function abrir(): void {
    setSituacaoRascunho(ativo === undefined ? "" : String(ativo));
    setTipoRascunho(tipoUsuarioId === undefined ? "" : String(tipoUsuarioId));
    setAberto(true);
  }

  function aplicar(): void {
    onAtivoChange(
      situacaoRascunho === "" ? undefined : situacaoRascunho === "true",
    );
    onTipoChange(tipoRascunho === "" ? undefined : Number(tipoRascunho));
    setAberto(false);
  }

  function limparTodos(): void {
    onBuscaChange("");
    onAtivoChange(undefined);
    onTipoChange(undefined);
  }

  return (
    <>
      <div className="usuarios-barra-filtros">
        <div className="campo usuarios-busca-modal">
          <label htmlFor="usuarios-busca">Pesquisar usuários</label>

          <div className="usuarios-busca-campo">
            <Search size={19} aria-hidden="true" />
            <input
              id="usuarios-busca"
              type="search"
              placeholder="Buscar por nome ou e-mail"
              maxLength={100}
              value={busca}
              onChange={(evento) => onBuscaChange(evento.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          className="botao"
          onClick={abrir}
          aria-haspopup="dialog"
        >
          <SlidersHorizontal size={17} aria-hidden="true" />
          Filtrar
          {quantidadeFiltros > 0 && (
            <span className="usuarios-filtros-contador">
              {quantidadeFiltros}
            </span>
          )}
        </button>

        {(quantidadeFiltros > 0 || busca.trim()) && (
          <button type="button" className="botao" onClick={limparTodos}>
            Limpar
          </button>
        )}
      </div>

      {quantidadeFiltros > 0 && (
        <div className="usuarios-filtros-aplicados" aria-label="Filtros aplicados">
          {ativo !== undefined && (
            <button
              type="button"
              className="usuarios-filtro-tag"
              onClick={() => onAtivoChange(undefined)}
              aria-label="Remover filtro de situação"
            >
              {ativo ? "Ativos" : "Inativos"}
              <X size={14} aria-hidden="true" />
            </button>
          )}

          {tipoUsuarioId !== undefined && (
            <button
              type="button"
              className="usuarios-filtro-tag"
              onClick={() => onTipoChange(undefined)}
              aria-label="Remover filtro de tipo de usuário"
            >
              {nomeTipo ?? `Tipo #${tipoUsuarioId}`}
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      <Modal
        aberto={aberto}
        titulo="Filtrar usuários"
        onFechar={() => setAberto(false)}
      >
        <div className="usuarios-modal-filtros">
          <p>Selecione os filtros e clique em Aplicar.</p>

          <div className="campo">
            <label htmlFor="usuarios-status-modal">Situação</label>
            <select
              id="usuarios-status-modal"
              className="entrada"
              value={situacaoRascunho}
              onChange={(evento) => setSituacaoRascunho(evento.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="usuarios-tipo-modal">Tipo de usuário</label>
            <select
              id="usuarios-tipo-modal"
              className="entrada"
              value={tipoRascunho}
              onChange={(evento) => setTipoRascunho(evento.target.value)}
            >
              <option value="">Todos</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
              ))}
            </select>
          </div>

          <div className="formulario-acoes">
            <button
              type="button"
              className="botao"
              onClick={() => {
                setSituacaoRascunho("");
                setTipoRascunho("");
              }}
            >
              Limpar seleção
            </button>

            <button
              type="button"
              className="botao"
              onClick={() => setAberto(false)}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="botao botao--primario"
              onClick={aplicar}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}