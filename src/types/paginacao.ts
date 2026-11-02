export interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  porPagina: number;
  onPaginaChange: (pagina: number) => void;
}
