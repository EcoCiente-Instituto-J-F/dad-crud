import type { CampoEditor } from "./editorModulo";

export interface GerenciarPontosProps {
  campos: CampoEditor[];
  dados: Record<string, unknown>;
  onChange: (dados: Record<string, unknown>) => void;
}