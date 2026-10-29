import type { ReactNode } from "react";

import type { EstadoRequisicao } from "./requisicao";
import type { PaginaApi } from "./usuarioApi";

export interface ColunaListagemApi<T> {
  id: string;
  titulo: string;
  renderizar: (item: T) => ReactNode;
}

export interface ListagemApiProps<T extends { id: number }> {
  titulo: string;
  descricao: string;
  caminhoCadastro: string;
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtrosExtras?: ReactNode;
  requisicao: EstadoRequisicao<PaginaApi<T>>;
  colunas: readonly ColunaListagemApi<T>[];
  onRecarregar: () => void;
  onPaginaChange: (pagina: number) => void;
}