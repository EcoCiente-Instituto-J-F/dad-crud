import type { LucideIcon } from "lucide-react";

export interface ItemMenu {
  id: string;
  titulo: string;
  caminho: string;
  icone: LucideIcon;
}

export interface CabecalhoProps {
  nomeAdministrador: string;
}

export interface MenuLateralProps {
  itens: readonly ItemMenu[];
}

export interface ModuloProps {
  titulo: string;
  descricao: string;
}