import type { Usuario } from "./usuario";

export interface DadosDashboard {
  usuarios: Usuario[];
  condominios: number;
  cooperativas: number;
  cursos: number;
  quizzes: number;
  coletasAgendadas: number;
}