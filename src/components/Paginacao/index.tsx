import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PaginacaoProps } from "../../types/usuario";

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  totalItens,
  porPagina,
  onPaginaChange,
}: PaginacaoProps) {
  const primeiroItem =
    totalItens === 0 ? 0 : (paginaAtual - 1) * porPagina + 1;

  const ultimoItem = Math.min(
    paginaAtual * porPagina,
    totalItens,
  );

  return (
    <div className="paginacao">
      <span className="paginacao__resumo">
        {primeiroItem}–{ultimoItem} de {totalItens} usuários
      </span>

      <nav className="paginacao__controles" aria-label="Paginação">
        <button
          type="button"
          className="paginacao__botao"
          disabled={paginaAtual === 1}
          onClick={() => onPaginaChange(paginaAtual - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="paginacao__atual">
          {paginaAtual}
        </span>

        <span className="paginacao__total">
          de {totalPaginas}
        </span>

        <button
          type="button"
          className="paginacao__botao"
          disabled={paginaAtual >= totalPaginas}
          onClick={() => onPaginaChange(paginaAtual + 1)}
          aria-label="Próxima página"
        >
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
}