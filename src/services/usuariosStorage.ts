import { usuariosSimulados } from "../data/usuarios";

import type { Usuario } from "../types/usuario";

const CHAVE = "ecociente:usuarios";
const VERSAO = 1;

interface UsuariosArmazenados {
  _versao: number;
  usuarios: Usuario[];
}

function ehRegistro(
  valor: unknown,
): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function ehUsuario(valor: unknown): valor is Usuario {
  if (!ehRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.id === "string" &&
    valor.id.length > 0 &&
    typeof valor.nome === "string" &&
    typeof valor.email === "string" &&
    typeof valor.cidade === "string" &&
    typeof valor.uf === "string" &&
    (
      valor.pontuacao === null ||
      (
        typeof valor.pontuacao === "number" &&
        Number.isFinite(valor.pontuacao) &&
        valor.pontuacao >= 0
      )
    ) &&
    (
      valor.tipo === "MORADOR" ||
      valor.tipo === "USUARIO_COMUM" ||
      valor.tipo === "SINDICO" ||
      valor.tipo === "COOPERATIVA"
    ) &&
    (valor.status === "ATIVO" || valor.status === "INATIVO")
  );
}

function novosDadosIniciais(): Usuario[] {
  return usuariosSimulados.map((usuario) => ({ ...usuario }));
}

export function lerUsuarios(): Usuario[] {
  const conteudo = localStorage.getItem(CHAVE);

  if (conteudo === null) {
    return novosDadosIniciais();
  }

  let valor: unknown;

  try {
    valor = JSON.parse(conteudo);
  } catch {
    localStorage.removeItem(CHAVE);
    return novosDadosIniciais();
  }

  if (
    !ehRegistro(valor) ||
    valor._versao !== VERSAO ||
    !Array.isArray(valor.usuarios)
  ) {
    localStorage.removeItem(CHAVE);
    return novosDadosIniciais();
  }

  const registros: unknown[] = valor.usuarios;

  if (!registros.every(ehUsuario)) {
    localStorage.removeItem(CHAVE);
    return novosDadosIniciais();
  }

  const ids = new Set(registros.map((usuario) => usuario.id));

  if (ids.size !== registros.length) {
    localStorage.removeItem(CHAVE);
    return novosDadosIniciais();
  }

  return registros;
}

export function salvarUsuarios(usuarios: Usuario[]): void {
  const dados: UsuariosArmazenados = {
    _versao: VERSAO,
    usuarios,
  };

  localStorage.setItem(CHAVE, JSON.stringify(dados));
}