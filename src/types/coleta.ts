import type { z } from "zod";

import type {
  cadastroColetaSchema,
  coletaSchema,
  registroVisitaSchema,
  visitaSchema,
} from "../utils/validarColeta";
import type { Condominio } from "./condominio";
import type { Cooperativa } from "./cooperativa";

export interface CadastroColeta extends z.infer<typeof cadastroColetaSchema> {}
export interface Coleta extends z.infer<typeof coletaSchema> {}
export interface RegistroVisita extends z.infer<typeof registroVisitaSchema> {}
export interface Visita extends z.infer<typeof visitaSchema> {}

export interface DadosColetas {
  coletas: Coleta[];
  condominios: Condominio[];
  cooperativas: Cooperativa[];
}

export interface EditorColetaProps {
  inicial: CadastroColeta;
  id?: string;
  dados: DadosColetas;
}

export interface AcoesColetaProps {
  coleta: Coleta;
  onAtualizado: () => void;
}

export interface CalendarioColetasProps {
  coletas: Coleta[];
  condominios: Condominio[];
}