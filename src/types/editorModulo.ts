export type NomeModulo =
  | "condominios"
  | "cooperativas"
  | "cursos"
  | "quizzes"
  | "coletas";

export interface CampoEditor {
  chave: string;
  titulo: string;
  tipo:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "checkbox"
    | "time"
    | "datetime"
    | "select"
    | "multiselect"
    | "object"
    | "array";
  obrigatorio?: boolean;
  opcoes?: { id: number; nome: string }[];
  campos?: CampoEditor[];
  novo?: Record<string, unknown>;
}

export interface ConfiguracaoEditor {
  titulo: string;
  inicial: Record<string, unknown>;
  campos: CampoEditor[];
}