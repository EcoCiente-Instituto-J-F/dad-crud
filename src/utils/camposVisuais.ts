import type { CampoEditor, NomeModulo } from "../types/editorModulo";
import type { ReferenciasAdmin } from "../types/visualAdmin";

export function adaptarCamposVisuais(modulo: NomeModulo, campos: CampoEditor[], dados: Record<string, unknown>, referencias: ReferenciasAdmin): CampoEditor[] {
  return campos.map((campo) => {
    if (modulo === "coletas" && campo.chave === "condominioId") return { ...campo, titulo: "Condomínio", tipo: "select", opcoes: referencias.condominios };
    if (modulo === "coletas" && campo.chave === "cooperativaId") return { ...campo, titulo: "Cooperativa", tipo: "select", opcoes: referencias.cooperativas };
    if (modulo === "cooperativas" && campo.chave === "usuarioId") return { ...campo, titulo: "Conta da cooperativa (opcional)", tipo: "select", opcoes: referencias.usuarios };
    if (modulo === "quizzes" && campo.chave === "cursoId") return { ...campo, titulo: "Curso", tipo: "select", opcoes: referencias.cursos.map((curso) => ({ id: curso.id, nome: curso.titulo })) };
    if (modulo === "quizzes" && campo.chave === "aulaId") return { ...campo, titulo: "Aula", tipo: "select", opcoes: referencias.cursos.find((curso) => curso.id === dados.cursoId)?.aulas.map((aula) => ({ id: aula.id, nome: aula.titulo })) ?? [] };
    return campo;
  });
}

export function nomeItem(chave: string): string {
  return ({ torres: "Torre", pontos: "Ponto de coleta", aulas: "Aula", perguntas: "Pergunta", alternativas: "Alternativa", visitas: "Visita" } as Record<string, string>)[chave] ?? "Item";
}