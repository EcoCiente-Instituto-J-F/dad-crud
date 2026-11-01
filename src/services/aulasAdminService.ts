import { cursosApi } from "./modulosApiService";
import type { CursoRequestApi } from "../types/modulosApi";
export async function salvarAulaAdmin(cursoId: number, aulaId: number | null, titulo: string, conteudo: string, signal: AbortSignal): Promise<void> {
  try {
    if (!titulo.trim() || !conteudo.trim()) throw new Error("Preencha título e conteúdo.");
    const curso = await cursosApi.buscar(cursoId, signal);
    const aulas: CursoRequestApi["aulas"] = curso.aulas.map((aula) => ({ id: aula.id, titulo: aula.titulo, conteudo: aula.conteudo }));
    if (aulaId === null) aulas.push({ id: null, titulo: titulo.trim(), conteudo: conteudo.trim() });
    else { const indice = aulas.findIndex((aula) => aula.id === aulaId); if (indice < 0) throw new Error("Aula não encontrada."); aulas[indice] = { id: aulaId, titulo: titulo.trim(), conteudo: conteudo.trim() }; }
    await cursosApi.editar(cursoId, { titulo: curso.titulo, descricao: curso.descricao, ativo: curso.ativo, aulas }, signal);
  } catch (erro: unknown) { if (signal.aborted) throw erro; throw erro instanceof Error ? erro : new Error("Falha ao salvar aula."); }
}