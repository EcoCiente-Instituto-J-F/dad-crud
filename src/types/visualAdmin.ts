import type { CampoEditor, ConfiguracaoEditor, NomeModulo } from "./editorModulo";
import type { Catalogos } from "./catalogos";
import type { CursoApi } from "./modulosApi";

export interface OpcaoVisual { id: number; nome: string }
export interface ReferenciasAdmin {
  condominios: OpcaoVisual[];
  cooperativas: OpcaoVisual[];
  cursos: CursoApi[];
  usuarios: OpcaoVisual[];
}
export interface CamposVisuaisProps {
  campos: CampoEditor[];
  dados: Record<string, unknown>;
  onChange: (dados: Record<string, unknown>) => void;
  leitura?: boolean;
}
export interface ConteudoVisualProps {
  modulo: NomeModulo;
  id: number | null;
  leitura: boolean;
  configuracao: ConfiguracaoEditor;
  catalogos: Catalogos;
}
export interface DetalhesVisuaisProps extends CamposVisuaisProps {
  modulo: NomeModulo;
  id: number;
  onRecarregar: () => void;
}