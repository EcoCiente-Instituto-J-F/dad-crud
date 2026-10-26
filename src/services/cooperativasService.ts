import {
  cooperativasSimuladas,
  materiaisDisponiveis,
} from "../data/cooperativa";
import { lerColecao, salvarColecao } from "../utils/armazenamento";
import { simularRequisicao } from "../utils/simularRequisicao";
import { validarCooperativa } from "../utils/validarCooperativa";
import { listarUsuarios } from "./usuariosService";

import type {
  CadastroCooperativa,
  Cooperativa,
  DadosCooperativas,
  EnderecoCooperativa,
  Material,
  PontoColeta,
} from "../types/cooperativa";

const CHAVE = "ecociente:cooperativas";
const VERSAO = 1;

function ehRegistro(
  valor: unknown,
): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function ehMaterial(valor: unknown): valor is Material {
  return materiaisDisponiveis.some((material) => material === valor);
}

function ehEndereco(valor: unknown): valor is EnderecoCooperativa {
  return (
    ehRegistro(valor) &&
    typeof valor.cep === "string" &&
    typeof valor.uf === "string" &&
    typeof valor.cidade === "string" &&
    typeof valor.bairro === "string" &&
    typeof valor.logradouro === "string" &&
    typeof valor.numero === "string" &&
    typeof valor.complemento === "string"
  );
}

function ehPonto(valor: unknown): valor is PontoColeta {
  return (
    ehRegistro(valor) &&
    typeof valor.id === "string" &&
    typeof valor.nome === "string" &&
    typeof valor.abertura === "string" &&
    typeof valor.fechamento === "string" &&
    (valor.status === "ATIVO" || valor.status === "INATIVO") &&
    ehEndereco(valor.endereco) &&
    Array.isArray(valor.materiais) &&
    valor.materiais.every(ehMaterial)
  );
}

function ehCooperativa(valor: unknown): valor is Cooperativa {
  return (
    ehRegistro(valor) &&
    typeof valor.id === "string" &&
    typeof valor.nome === "string" &&
    typeof valor.cnpj === "string" &&
    typeof valor.email === "string" &&
    typeof valor.telefone === "string" &&
    typeof valor.usuarioId === "string" &&
    typeof valor.criadoEm === "string" &&
    !Number.isNaN(Date.parse(valor.criadoEm)) &&
    (valor.status === "ATIVO" || valor.status === "INATIVO") &&
    ehEndereco(valor.endereco) &&
    Array.isArray(valor.materiais) &&
    valor.materiais.every(ehMaterial) &&
    Array.isArray(valor.pontos) &&
    valor.pontos.every(ehPonto)
  );
}

function ler(): Cooperativa[] {
  return lerColecao(
    CHAVE,
    VERSAO,
    ehCooperativa,
    cooperativasSimuladas,
  );
}

export async function listarCooperativas(
  signal: AbortSignal,
): Promise<Cooperativa[]> {
  try {
    await simularRequisicao(signal);
    signal.throwIfAborted();
    return ler();
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw new Error("Não foi possível carregar as cooperativas.");
  }
}

export async function carregarDadosCooperativas(
  signal: AbortSignal,
): Promise<DadosCooperativas> {
  try {
    const [cooperativas, usuarios] = await Promise.all([
      listarCooperativas(signal),
      listarUsuarios(signal),
    ]);

    return { cooperativas, usuarios };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw new Error("Não foi possível carregar os dados das cooperativas.");
  }
}

export async function salvarCooperativa(
  id: string | undefined,
  formulario: CadastroCooperativa,
  signal: AbortSignal,
): Promise<Cooperativa> {
  try {
    const resultado = validarCooperativa(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os campos da cooperativa.");
    }

    const usuarios = await listarUsuarios(signal);
    signal.throwIfAborted();

    const registros = ler();
    const existente = registros.find((item) => item.id === id);
    const dados = resultado.dados;

    if (id && !existente) {
      throw new Error("Cooperativa não encontrada.");
    }

    if (
      registros.some(
        (item) => item.id !== id && item.cnpj === dados.cnpj,
      )
    ) {
      throw new Error("Já existe uma cooperativa com este CNPJ.");
    }

    if (
      dados.usuarioId &&
      !usuarios.some(
        (usuario) =>
          usuario.id === dados.usuarioId &&
          usuario.tipo === "COOPERATIVA" &&
          usuario.status === "ATIVO",
      ) &&
      dados.usuarioId !== existente?.usuarioId
    ) {
      throw new Error("Selecione um usuário ativo do tipo cooperativa.");
    }

    if (
      dados.usuarioId &&
      registros.some(
        (item) =>
          item.id !== id && item.usuarioId === dados.usuarioId,
      )
    ) {
      throw new Error("Este usuário já está vinculado a outra cooperativa.");
    }

    const salvo: Cooperativa = {
      ...dados,
      id: existente?.id ?? crypto.randomUUID(),
      criadoEm: existente?.criadoEm ?? new Date().toISOString(),
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

    throw new Error(
      erro instanceof Error
        ? erro.message
        : "Não foi possível salvar a cooperativa.",
    );
  }
}