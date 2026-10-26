import type { HTMLInputTypeAttribute, ReactNode } from "react";

export type ErrosFormulario = Record<string, string>;

export type ResultadoFormulario<T> =
  | { valido: true; dados: T }
  | { valido: false; erros: ErrosFormulario };

export interface CampoProps {
  id: string;
  titulo: string;
  valor: string | number;
  onChange: (valor: string) => void;
  erro?: string;
  tipo?: HTMLInputTypeAttribute;
  maximo?: number;
  multiline?: boolean;
  obrigatorio?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface SelecaoProps {
  id: string;
  titulo: string;
  valor: string;
  onChange: (valor: string) => void;
  children: ReactNode;
  erro?: string;
}

export interface PaginaFormularioProps {
  modo: "cadastro" | "edicao";
}