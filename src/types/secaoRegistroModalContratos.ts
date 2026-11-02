import type { CampoEditor,NomeModulo } from "./editorModulo";

export interface SecaoRegistroModalProps {
  modulo: NomeModulo; id: number; campo: CampoEditor; dados: Record<string, unknown>; onRecarregar: () => void;
}
