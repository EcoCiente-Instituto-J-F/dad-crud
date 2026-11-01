import type { CampoEditor } from "./editorModulo";

export interface ConfiguracoesCondominioProps {
  campos: CampoEditor[];
  dados: Record<string, unknown>;
  onChange: (dados: Record<string, unknown>) => void;
}