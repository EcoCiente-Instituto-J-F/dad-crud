export type TipoUsuario =
  | "MORADOR"
  | "USUARIO_COMUM"
  | "SINDICO"
  | "COOPERATIVA";

export type StatusUsuario = "ATIVO" | "INATIVO";

export type FiltroStatusUsuario = StatusUsuario | "TODOS";

export type OrdenacaoUsuario = "NOME_ASC" | "NOME_DESC";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cidade: string;
  uf: string;
  pontuacao: number | null;
  tipo: TipoUsuario;
  status: StatusUsuario;
}

export interface FiltrosUsuarios {
  busca: string;
  status: FiltroStatusUsuario;
  ordenacao: OrdenacaoUsuario;
  pagina: number;
}

export interface FiltrosUsuariosProps {
  filtros: FiltrosUsuarios;
  onBuscaChange: (busca: string) => void;
  onStatusChange: (status: FiltroStatusUsuario) => void;
  onOrdenacaoChange: (ordenacao: OrdenacaoUsuario) => void;
}

export interface TabelaUsuariosProps {
  usuarios: readonly Usuario[];
}

export interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  porPagina: number;
  onPaginaChange: (pagina: number) => void;
}