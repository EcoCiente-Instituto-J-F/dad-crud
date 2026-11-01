import { condominiosApi, cooperativasApi, cursosApi } from "./modulosApiService";
import { listarUsuariosApi } from "./usuariosApiService";
import { carregarCatalogos } from "./catalogosService";
import type { NomeModulo } from "../types/editorModulo";
import type { FiltrosPaginaApi } from "../types/modulosApi";
import type { PaginaApi } from "../types/usuarioApi";
import type { ReferenciasAdmin } from "../types/visualAdmin";

async function todas<T>(listar: (f: FiltrosPaginaApi, s: AbortSignal) => Promise<PaginaApi<T>>, signal: AbortSignal): Promise<T[]> {
  const itens: T[] = [];
  let pagina = 0;
  let total = 1;
  do {
    signal.throwIfAborted();
    const resultado = await listar({ pagina, tamanho: 50 }, signal);
    if (resultado.pagina !== pagina) throw new Error("A API retornou uma página inesperada.");
    itens.push(...resultado.itens);
    total = resultado.totalPaginas;
    pagina += 1;
  } while (pagina < total);
  return itens;
}

export async function carregarReferenciasAdmin(modulo: NomeModulo, signal: AbortSignal): Promise<ReferenciasAdmin> {
  try {
    const resultado: ReferenciasAdmin = { condominios: [], cooperativas: [], cursos: [], usuarios: [] };
    if (modulo === "quizzes") resultado.cursos = await todas(cursosApi.listar, signal);
    if (modulo === "coletas") {
      const [condominios, cooperativas] = await Promise.all([
        todas(condominiosApi.listar, signal), todas(cooperativasApi.listar, signal),
      ]);
      resultado.condominios = condominios.map(({ id, nome }) => ({ id, nome }));
      resultado.cooperativas = cooperativas.map(({ id, nome }) => ({ id, nome }));
    }
    if (modulo === "cooperativas") {
      const catalogos = await carregarCatalogos(signal);
      const tipo = catalogos.tiposUsuarios.find((item) => /cooperativa/i.test(item.nome));
      if (tipo) {
        const usuarios = await todas((f, s) => listarUsuariosApi({ ...f, ativo: true, tipoUsuarioId: tipo.id }, s), signal);
        resultado.usuarios = usuarios.map(({ id, nome }) => ({ id, nome }));
      }
    }
    signal.throwIfAborted();
    return resultado;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw erro instanceof Error ? erro : new Error("Não foi possível carregar os vínculos.");
  }
}