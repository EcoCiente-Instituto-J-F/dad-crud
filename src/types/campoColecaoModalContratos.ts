import type { CampoEditor } from "./editorModulo";

export interface CampoColecaoModalProps { campo: CampoEditor; dados: Record<string, unknown>; onChange: (dados: Record<string, unknown>) => void }
