import { criarRepositorio } from "./repositorioLocal";
import { listarCondominios } from "./condominiosService";
import { listarCooperativas } from "./cooperativasService";

import {
  coletaSchema,
  validarColeta,
  validarVisita,
} from "../utils/validarColeta";
import { dataLocal, ocorreNaData } from "../utils/calendarioColetas";

import type {
  CadastroColeta,
  Coleta,
  DadosColetas,
  RegistroVisita,
} from "../types/coleta";

const repositorio = criarRepositorio<Coleta>(
  "ecociente:coletas",
  coletaSchema,
);

export const listarColetas = repositorio.listar;
export const buscarColeta = repositorio.buscar;

export async function carregarColetas(
  signal: AbortSignal,
): Promise<DadosColetas> {
  try {
    const [coletas, condominios, cooperativas] = await Promise.all([
      listarColetas(signal),
      listarCondominios(signal),
      listarCooperativas(signal),
    ]);

    return { coletas, condominios, cooperativas };
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;
    throw new Error("Não foi possível carregar os agendamentos.");
  }
}

export async function salvarColeta(
  id: string | undefined,
  formulario: CadastroColeta,
  signal: AbortSignal,
): Promise<Coleta> {
  try {
    const resultado = validarColeta(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os dados do agendamento.");
    }

    const dados = await carregarColetas(signal);
    const existente = dados.coletas.find((coleta) => coleta.id === id);

    if (id && !existente) throw new Error("Coleta não encontrada.");

    if (existente?.status === "CANCELADA") {
      throw new Error("Uma coleta cancelada não pode ser editada.");
    }

    const condominio = dados.condominios.find(
      (item) => item.id === resultado.dados.condominioId,
    );

    const cooperativa = dados.cooperativas.find(
      (item) => item.id === resultado.dados.cooperativaId,
    );

    if (
      !condominio ||
      (condominio.status !== "ATIVO" &&
        condominio.id !== existente?.condominioId)
    ) {
      throw new Error("Selecione um condomínio ativo.");
    }

    if (
      !cooperativa ||
      (cooperativa.status !== "ATIVO" &&
        cooperativa.id !== existente?.cooperativaId)
    ) {
      throw new Error("Selecione uma cooperativa ativa.");
    }

    if (
      existente?.visitas.some(
        (visita) => !ocorreNaData(resultado.dados, visita.data),
      )
    ) {
      throw new Error("O novo período excluiria uma visita já registrada.");
    }

    if (
      existente &&
      existente.visitas.length > 0 &&
      (
        existente.condominioId !== resultado.dados.condominioId ||
        existente.cooperativaId !== resultado.dados.cooperativaId
      )
    ) {
      throw new Error("Não altere os participantes de uma coleta com visitas.");
    }

    return await repositorio.salvar(
      {
        ...resultado.dados,
        id: existente?.id ?? crypto.randomUUID(),
        status: existente?.status ?? "AGENDADA",
        motivoCancelamento: existente?.motivoCancelamento ?? "",
        visitas: existente?.visitas ?? [],
      },
      signal,
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível salvar.",
    );
  }
}

export async function cancelarColeta(
  id: string,
  motivo: string,
  signal: AbortSignal,
): Promise<Coleta> {
  try {
    const coleta = await buscarColeta(id, signal);
    const texto = motivo.trim();

    if (!coleta) throw new Error("Coleta não encontrada.");

    if (coleta.status === "CANCELADA") {
      throw new Error("Esta coleta já foi cancelada.");
    }

    if (texto.length < 5 || texto.length > 500) {
      throw new Error("Informe um motivo entre 5 e 500 caracteres.");
    }

    return await repositorio.salvar(
      { ...coleta, status: "CANCELADA", motivoCancelamento: texto },
      signal,
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível cancelar.",
    );
  }
}

export async function registrarVisita(
  id: string,
  formulario: RegistroVisita,
  signal: AbortSignal,
): Promise<Coleta> {
  try {
    const resultado = validarVisita(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os dados da visita.");
    }

    const coleta = await buscarColeta(id, signal);

    if (!coleta) throw new Error("Coleta não encontrada.");

    if (coleta.status === "CANCELADA") {
      throw new Error("Não é possível registrar visitas em coleta cancelada.");
    }

    if (!ocorreNaData(coleta, resultado.dados.data)) {
      throw new Error("Esta data não faz parte do agendamento.");
    }

    if (resultado.dados.data > dataLocal(new Date())) {
      throw new Error("Não registre resultado de uma visita futura.");
    }

    if (coleta.visitas.some((visita) => visita.data === resultado.dados.data)) {
      throw new Error("Esta data já possui uma visita registrada.");
    }

    return await repositorio.salvar(
      {
        ...coleta,
        visitas: [
          ...coleta.visitas,
          {
            ...resultado.dados,
            id: crypto.randomUUID(),
            registradoEm: new Date().toISOString(),
          },
        ],
      },
      signal,
    );
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    throw new Error(
      erro instanceof Error ? erro.message : "Não foi possível registrar a visita.",
    );
  }
}