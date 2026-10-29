import type { ReactNode } from "react";

export interface Credenciais {
  email: string;
  senha: string;
}

export interface PerfilAdmin {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  avatar: string;
}

export interface SessaoAdmin {
  _versao: 2;
  token: string;
  tipoToken: "Bearer";
  expiraEm: number;
  papel: "ADMIN";
  perfil: PerfilAdmin;
}

export interface DadosPerfil {
  nome: string;
  email: string;
  telefone: string;
}

export interface DadosSenha {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export type EstadoAuth =
  | { status: "visitante" }
  | { status: "autenticado"; sessao: SessaoAdmin };

export type AcaoAuth =
  | { tipo: "ENTRAR"; sessao: SessaoAdmin }
  | { tipo: "ATUALIZAR"; sessao: SessaoAdmin }
  | { tipo: "SAIR" };

export interface AuthContextValue {
  estado: EstadoAuth;
  entrar: (
    credenciais: Credenciais,
    signal: AbortSignal,
  ) => Promise<void>;
  sair: () => void;
  atualizarPerfil: (
    dados: DadosPerfil,
    signal: AbortSignal,
  ) => Promise<void>;
  atualizarAvatar: (
    arquivo: File,
    signal: AbortSignal,
  ) => Promise<void>;
  alterarSenha: (
    dados: DadosSenha,
    signal: AbortSignal,
  ) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}