import { lerUsuarios, salvarUsuarios } from "./usuariosStorage";
import { validarUsuario } from "../utils/validarUsuario";

import type {
  CadastroUsuario,
  Usuario,
} from "../types/usuario";

function aguardar(
  tempo: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Operação cancelada.", "AbortError"));
      return;
    }

    const cancelar = (): void => {
      window.clearTimeout(temporizador);
      signal.removeEventListener("abort", cancelar);
      reject(new DOMException("Operação cancelada.", "AbortError"));
    };

    const temporizador = window.setTimeout(() => {
      signal.removeEventListener("abort", cancelar);
      resolve();
    }, tempo);

    signal.addEventListener("abort", cancelar, { once: true });
  });
}

export async function listarUsuarios(
  signal: AbortSignal,
): Promise<Usuario[]> {
  try {
    await aguardar(600, signal);
    signal.throwIfAborted();

    return lerUsuarios();
  } catch (erro: unknown) {
    if (signal.aborted) {
      throw erro;
    }

    throw new Error("Não foi possível carregar os usuários.");
  }
}

export async function buscarUsuario(
  id: string,
  signal: AbortSignal,
): Promise<Usuario | null> {
  try {
    await aguardar(400, signal);
    signal.throwIfAborted();

    return lerUsuarios().find((usuario) => usuario.id === id) ?? null;
  } catch (erro: unknown) {
    if (signal.aborted) {
      throw erro;
    }

    throw new Error("Não foi possível carregar este usuário.");
  }
}

export async function cadastrarUsuario(
  formulario: CadastroUsuario,
  signal: AbortSignal,
): Promise<Usuario> {
  try {
    const resultado = validarUsuario(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os campos do formulário.");
    }

    await aguardar(500, signal);
    signal.throwIfAborted();

    const usuarios = lerUsuarios();

    const emailExiste = usuarios.some(
      (usuario) =>
        usuario.email.toLowerCase() === resultado.dados.email,
    );

    if (emailExiste) {
      throw new Error("Já existe um usuário com este e-mail.");
    }

    const usuario: Usuario = {
      id: crypto.randomUUID(),
      ...resultado.dados,
      pontuacao:
        resultado.dados.tipo === "COOPERATIVA" ? null : 0,
      status: "ATIVO",
    };

    salvarUsuarios([...usuarios, usuario]);

    return usuario;
  } catch (erro: unknown) {
    if (signal.aborted) {
      throw erro;
    }

    throw new Error(
      erro instanceof Error
        ? erro.message
        : "Não foi possível cadastrar o usuário.",
    );
  }
}

export async function atualizarUsuario(
  id: string,
  formulario: CadastroUsuario,
  signal: AbortSignal,
): Promise<Usuario> {
  try {
    const resultado = validarUsuario(formulario);

    if (!resultado.valido) {
      throw new Error("Revise os campos do formulário.");
    }

    await aguardar(500, signal);
    signal.throwIfAborted();

    const usuarios = lerUsuarios();
    const existente = usuarios.find((usuario) => usuario.id === id);

    if (!existente) {
      throw new Error("Usuário não encontrado.");
    }

    const emailExiste = usuarios.some(
      (usuario) =>
        usuario.id !== id &&
        usuario.email.toLowerCase() === resultado.dados.email,
    );

    if (emailExiste) {
      throw new Error("Já existe outro usuário com este e-mail.");
    }

    const atualizado: Usuario = {
      ...existente,
      ...resultado.dados,
      pontuacao:
        resultado.dados.tipo === "COOPERATIVA"
          ? null
          : existente.pontuacao ?? 0,
    };

    salvarUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id ? atualizado : usuario,
      ),
    );

    return atualizado;
  } catch (erro: unknown) {
    if (signal.aborted) {
      throw erro;
    }

    throw new Error(
      erro instanceof Error
        ? erro.message
        : "Não foi possível atualizar o usuário.",
    );
  }
}

export async function desativarUsuario(
  id: string,
  signal: AbortSignal,
): Promise<Usuario> {
  try {
    await aguardar(500, signal);
    signal.throwIfAborted();

    const usuarios = lerUsuarios();
    const existente = usuarios.find((usuario) => usuario.id === id);

    if (!existente) {
      throw new Error("Usuário não encontrado.");
    }

    const atualizado: Usuario = {
      ...existente,
      status: "INATIVO",
    };

    salvarUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id ? atualizado : usuario,
      ),
    );

    return atualizado;
  } catch (erro: unknown) {
    if (signal.aborted) {
      throw erro;
    }

    throw new Error(
      erro instanceof Error
        ? erro.message
        : "Não foi possível desativar o usuário.",
    );
  }
}