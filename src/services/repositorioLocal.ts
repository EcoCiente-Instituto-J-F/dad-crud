import type { ZodType } from "zod";

import { lerColecao, salvarColecao } from "../utils/armazenamento";
import { simularRequisicao } from "../utils/simularRequisicao";

interface Repositorio<T> {
  listar: (signal: AbortSignal) => Promise<T[]>;
  buscar: (id: string, signal: AbortSignal) => Promise<T | null>;
  salvar: (registro: T, signal: AbortSignal) => Promise<T>;
  remover: (id: string, signal: AbortSignal) => Promise<void>;
}

export function criarRepositorio<T extends { id: string }>(
  chave: string,
  schema: ZodType<T>,
): Repositorio<T> {
  function ehRegistro(valor: unknown): valor is T {
    return schema.safeParse(valor).success;
  }

  function ler(): T[] {
    return lerColecao<T>(chave, 1, ehRegistro, []);
  }

  async function listar(signal: AbortSignal): Promise<T[]> {
    try {
      await simularRequisicao(signal);
      signal.throwIfAborted();
      return ler();
    } catch (erro: unknown) {
      if (signal.aborted) throw erro;
      throw new Error("Não foi possível carregar os registros.");
    }
  }

  async function buscar(
    id: string,
    signal: AbortSignal,
  ): Promise<T | null> {
    try {
      const registros = await listar(signal);
      return registros.find((registro) => registro.id === id) ?? null;
    } catch (erro: unknown) {
      if (signal.aborted) throw erro;
      throw new Error("Não foi possível carregar o registro.");
    }
  }

  async function salvar(
    registro: T,
    signal: AbortSignal,
  ): Promise<T> {
    try {
      const resultado = schema.safeParse(registro);

      if (!resultado.success) {
        throw new Error("Os dados do registro são inválidos.");
      }

      await simularRequisicao(signal);
      signal.throwIfAborted();

      const registros = ler();
      const existe = registros.some((item) => item.id === registro.id);

      salvarColecao(
        chave,
        1,
        existe
          ? registros.map((item) =>
              item.id === registro.id ? resultado.data : item,
            )
          : [...registros, resultado.data],
      );

      return resultado.data;
    } catch (erro: unknown) {
      if (signal.aborted) throw erro;

      throw new Error(
        erro instanceof Error ? erro.message : "Não foi possível salvar.",
      );
    }
  }

  async function remover(
    id: string,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      await simularRequisicao(signal);
      signal.throwIfAborted();

      salvarColecao(
        chave,
        1,
        ler().filter((registro) => registro.id !== id),
      );
    } catch (erro: unknown) {
      if (signal.aborted) throw erro;
      throw new Error("Não foi possível excluir o registro.");
    }
  }

  return { listar, buscar, salvar, remover };
}