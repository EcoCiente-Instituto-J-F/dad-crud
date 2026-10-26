import { condominiosSimulados } from "../data/condominio";
import { lerColecao, salvarColecao } from "../utils/armazenamento";
import { simularRequisicao } from "../utils/simularRequisicao";
import { validarCondominio } from "../utils/validarCondominio";
import { listarUsuarios } from "./usuariosService";

import type {
  CadastroCondominio,
  Condominio,
  StatusCondominio,
  Torre,
} from "../types/condominio";
import type { Usuario } from "../types/usuario";

const CHAVE = "ecociente:condominios";
const VERSAO = 1;

function ehRegistro(
  valor: unknown,
): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function ehTorre(valor: unknown): valor is Torre {
  return (
    ehRegistro(valor) &&
    typeof valor.id === "string" &&
    typeof valor.nome === "string" &&
    typeof valor.moradores === "number" &&
    Number.isInteger(valor.moradores) &&
    valor.moradores >= 0
  );
}

function ehCondominio(valor: unknown): valor is Condominio {
  if (!ehRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.id === "string" &&
    typeof valor.nome === "string" &&
    typeof valor.cnpj === "string" &&
    typeof valor.codigoAcesso === "string" &&
    typeof valor.sindicoId === "string" &&
    typeof valor.cep === "string" &&
    typeof valor.uf === "string" &&
    typeof valor.cidade === "string" &&
    typeof valor.bairro === "string" &&
    typeof valor.logradouro === "string" &&
    typeof valor.numero === "string" &&
    typeof valor.complemento === "string" &&
    (
      valor.tipo === "RESIDENCIAL" ||
      valor.tipo === "COMERCIAL" ||
      valor.tipo === "MISTO"
    ) &&
    (valor.status === "ATIVO" || valor.status === "INATIVO") &&
    typeof valor.moradores === "number" &&
    Number.isInteger(valor.moradores) &&
    valor.moradores >= 0 &&
    Array.isArray(valor.torres) &&
    valor.torres.every(ehTorre)
  );
}

function ler(): Condominio[] {
  return lerColecao(
    CHAVE,
    VERSAO,
    ehCondominio,
    condominiosSimulados,
  );
}

function mensagem(erro: unknown, padrao: string): Error {
  return new Error(erro instanceof Error ? erro.message : padrao);
}

export async function listarCondominios(
  signal: AbortSignal,
): Promise<Condominio[]> {
  try {
    await simularRequisicao(signal);
    signal.throwIfAborted();
    return ler();
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw mensagem(erro, "Não foi possível carregar os condomínios.");
  }
}

export async function buscarCondominio(
  id: string,
  signal: AbortSignal,
): Promise<Condominio | null> {
  try {
    const registros = await listarCondominios(signal);
    return registros.find((item) => item.id === id) ?? null;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw mensagem(erro, "Não foi possível carregar o condomínio.");
  }
}

export async function listarSindicos(
  signal: AbortSignal,
): Promise<Usuario[]> {
  try {
    const usuarios = await listarUsuarios(signal);

    return usuarios.filter(
      (usuario) =>
        usuario.tipo === "SINDICO" &&
        usuario.status === "ATIVO",
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw mensagem(erro, "Não foi possível carregar os síndicos.");
  }
}

export async function salvarCondominio(
  id: string | undefined,
  formulario: CadastroCondominio,
  signal: AbortSignal,
): Promise<Condominio> {
  try {
    const resultado = validarCondominio(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os campos do condomínio.");
    }

    const sindicos = await listarSindicos(signal);
    signal.throwIfAborted();

    const registros = ler();
    const existente = registros.find((item) => item.id === id);

    if (id && !existente) {
      throw new Error("Condomínio não encontrado.");
    }

    const dados = resultado.dados;

    if (
      dados.sindicoId &&
      !sindicos.some((sindico) => sindico.id === dados.sindicoId) &&
      dados.sindicoId !== existente?.sindicoId
    ) {
      throw new Error("Selecione um síndico ativo.");
    }

    if (
      registros.some(
        (item) => item.id !== id && item.cnpj === dados.cnpj,
      )
    ) {
      throw new Error("Já existe um condomínio com este CNPJ.");
    }

    if (
      registros.some(
        (item) =>
          item.id !== id &&
          item.codigoAcesso === dados.codigoAcesso,
      )
    ) {
      throw new Error("Este código de acesso já está em uso.");
    }

    const idsTorres = new Set(dados.torres.map((torre) => torre.id));

    if (idsTorres.size !== dados.torres.length) {
      throw new Error("Existem identificadores de torres repetidos.");
    }

    if (
      existente?.torres.some(
        (torre) => torre.moradores > 0 && !idsTorres.has(torre.id),
      )
    ) {
      throw new Error("Uma torre com moradores não pode ser removida.");
    }

    const salvo: Condominio = {
      ...dados,
      id: existente?.id ?? crypto.randomUUID(),
      status: existente?.status ?? "ATIVO",
      moradores: existente?.moradores ?? 0,
      torres: dados.torres.map((torre) => ({
        ...torre,
        moradores:
          existente?.torres.find((item) => item.id === torre.id)
            ?.moradores ?? 0,
      })),
    };

    salvarColecao(
      CHAVE,
      VERSAO,
      existente
        ? registros.map((item) => item.id === id ? salvo : item)
        : [...registros, salvo],
    );

    return salvo;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw mensagem(erro, "Não foi possível salvar o condomínio.");
  }
}

export async function alterarStatusCondominio(
  id: string,
  status: StatusCondominio,
  signal: AbortSignal,
): Promise<Condominio> {
  try {
    await simularRequisicao(signal);
    signal.throwIfAborted();

    const registros = ler();
    const existente = registros.find((item) => item.id === id);

    if (!existente) {
      throw new Error("Condomínio não encontrado.");
    }

    const atualizado: Condominio = { ...existente, status };

    salvarColecao(
      CHAVE,
      VERSAO,
      registros.map((item) => item.id === id ? atualizado : item),
    );

    return atualizado;
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw mensagem(erro, "Não foi possível alterar o status.");
  }
}