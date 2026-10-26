import type { ReactNode } from "react";

export interface ModalProps {
  aberto: boolean;
  titulo: string;
  children: ReactNode;
  onFechar: () => void;
}