import { cursosApi } from "./modulosApiService";
import type { CursoApi } from "../types/modulosApi";

export async function listarOpcoesCursos(
  signal: AbortSignal,
): Promise<CursoApi[]> {
  try {
    const cursos = new Map<number, CursoApi>();
    let pagina = 0;
    let totalPaginas = 1;

    do {
      signal.throwIfAborted();

      const resposta = await cursosApi.listar({
        pagina,
        tamanho: 50,
      }, signal);

      if (resposta.pagina !== pagina) {
        throw new Error("A API retornou uma página inesperada de cursos.");
      }

      for (const curso of resposta.itens) {
        cursos.set(curso.id, curso);
      }

      totalPaginas = resposta.totalPaginas;
      pagina += 1;
    } while (pagina < totalPaginas);

    return [...cursos.values()].sort((a, b) =>
      a.titulo.localeCompare(b.titulo, "pt-BR"),
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível carregar os cursos.");
  }
}