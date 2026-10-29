import { z } from "zod";

import { requisitarDad } from "./httpService";

import type {
  CriarUsuarioApi,
  EditarUsuarioApi,
  FiltrosUsuariosApi,
  PaginaApi,
  UsuarioApi,
} from "../types/usuarioApi";

const enderecoSchema = z.object({
  cep: z.string().nullable(),
  uf: z.string().nullable(),
  cidade: z.string().nullable(),
  logradouro: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
});

const usuarioSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  email: z.string(),
  tipoUsuarioId: z.number().int().positive(),
  tipoUsuario: z.string(),
  ativo: z.boolean(),
  dataNascimento: z.string().nullable(),
  cpfMascarado: z.string().nullable(),
  avatar: z.string().nullable(),
  registroEm: z.string().nullable(),
  endereco: enderecoSchema.nullable(),
  condominioId: z.number().int().positive().nullable(),
});

const paginaUsuariosSchema = z.object({
  itens: z.array(usuarioSchema),
  pagina: z.number().int().nonnegative(),
  tamanho: z.number().int().positive(),
  totalItens: z.number().int().nonnegative(),
  totalPaginas: z.number().int().nonnegative(),
});

const BASE = "/api/admin/v1/usuarios";

function validarId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Identificação de usuário inválida.");
  }
}

function interpretarUsuario(resposta: unknown): UsuarioApi {
  const resultado = usuarioSchema.safeParse(resposta);

  if (!resultado.success) {
    throw new Error(
      "A API retornou um usuário em formato inválido.",
    );
  }

  return resultado.data;
}

function propagarErro(erro: unknown): never {
  if (erro instanceof Error) throw erro;

  throw new Error("Não foi possível concluir a operação.");
}

export async function listarUsuariosApi(
  filtros: FiltrosUsuariosApi,
  signal: AbortSignal,
): Promise<PaginaApi<UsuarioApi>> {
  try {
    const parametros = new URLSearchParams({
      pagina: String(filtros.pagina),
      tamanho: String(filtros.tamanho),
    });

    if (filtros.busca?.trim()) {
      parametros.set("busca", filtros.busca.trim());
    }

    if (filtros.ativo !== undefined) {
      parametros.set("ativo", String(filtros.ativo));
    }

    if (filtros.tipoUsuarioId !== undefined) {
      parametros.set(
        "tipoUsuarioId",
        String(filtros.tipoUsuarioId),
      );
    }

    const resposta = await requisitarDad(
      `${BASE}?${parametros.toString()}`,
      { signal },
    );

    const resultado = paginaUsuariosSchema.safeParse(resposta);

    if (!resultado.success) {
      const detalhes = resultado.error.issues
        .map((erro) => {
          const campo = erro.path.join(".") || "resposta";

          return `${campo}: ${erro.message}`;
        })
        .join("; ");

      throw new Error(`Resposta de usuários incompatível: ${detalhes}`);
    }

    return resultado.data;
  } catch (erro: unknown) {
    return propagarErro(erro);
  }
}

export async function buscarUsuarioApi(
  id: number,
  signal: AbortSignal,
): Promise<UsuarioApi> {
  try {
    validarId(id);

    const resposta = await requisitarDad(`${BASE}/${id}`, {
      signal,
    });

    return interpretarUsuario(resposta);
  } catch (erro: unknown) {
    return propagarErro(erro);
  }
}

export async function criarUsuarioApi(
  dados: CriarUsuarioApi,
  signal: AbortSignal,
): Promise<UsuarioApi> {
  try {
    const resposta = await requisitarDad(BASE, {
      method: "POST",
      body: JSON.stringify(dados),
      signal,
    });

    return interpretarUsuario(resposta);
  } catch (erro: unknown) {
    return propagarErro(erro);
  }
}

export async function editarUsuarioApi(
  id: number,
  dados: EditarUsuarioApi,
  signal: AbortSignal,
): Promise<UsuarioApi> {
  try {
    validarId(id);

    const resposta = await requisitarDad(`${BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dados),
      signal,
    });

    return interpretarUsuario(resposta);
  } catch (erro: unknown) {
    return propagarErro(erro);
  }
}

export async function alterarStatusUsuarioApi(
  id: number,
  ativo: boolean,
  signal: AbortSignal,
): Promise<UsuarioApi> {
  try {
    validarId(id);

    const resposta = await requisitarDad(
      `${BASE}/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ ativo }),
        signal,
      },
    );

    return interpretarUsuario(resposta);
  } catch (erro: unknown) {
    return propagarErro(erro);
  }
}