import { condominiosApi, cooperativasApi } from "./modulosApiService";
import type { FiltrosPaginaApi } from "../types/modulosApi";
import type { PaginaApi } from "../types/usuarioApi";

async function carregarTodos<T extends { id: number; nome: string }>(
  listar: (filtros: FiltrosPaginaApi, signal: AbortSignal) => Promise<PaginaApi<T>>,
  signal: AbortSignal,
): Promise<{ id: number; nome: string }[]> {
  const itens = new Map<number, { id: number; nome: string }>();
  let pagina = 0;
  let totalPaginas = 1;

  do {
    signal.throwIfAborted();

    const resposta = await listar({ pagina, tamanho: 50 }, signal);

    if (resposta.pagina !== pagina) {
      throw new Error("A API retornou uma página inesperada de opções.");
    }

    for (const item of resposta.itens) {
      itens.set(item.id, { id: item.id, nome: item.nome });
    }

    totalPaginas = resposta.totalPaginas;
    pagina += 1;
  } while (pagina < totalPaginas);

  return [...itens.values()].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );
}

export async function carregarOpcoesCalendario(signal: AbortSignal) {
  try {
    const [condominios, cooperativas] = await Promise.all([
      carregarTodos(condominiosApi.listar, signal),
      carregarTodos(cooperativasApi.listar, signal),
    ]);

    signal.throwIfAborted();

    return { condominios, cooperativas };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível carregar as opções do calendário.");
  }
}