import type { Catalogos } from "./catalogos";

export interface FiltrosUsuariosModalProps {
  busca: string;
  ativo: boolean | undefined;
  tipoUsuarioId: number | undefined;
  tipos: Catalogos["tiposUsuarios"];
  onBuscaChange: (valor: string) => void;
  onAtivoChange: (valor: boolean | undefined) => void;
  onTipoChange: (valor: number | undefined) => void;
}