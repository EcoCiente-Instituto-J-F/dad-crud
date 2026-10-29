export interface AtualizarPerfilApi {
  nome: string;
  email: string;
  urlAvatar: string;
  telefone?: string;
  telefoneId?: number;
}

export interface AlterarSenhaApi {
  senhaAtual: string;
  novaSenha: string;
  confirmacaoSenha: string;
}

export interface RedefinirSenhaApi {
  email: string;
  token: string;
  novaSenha: string;
  confirmacaoSenha: string;
}