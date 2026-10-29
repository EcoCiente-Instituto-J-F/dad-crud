export interface EnderecoApi {
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
}

export interface UsuarioApi {
  id: number;
  nome: string;
  email: string;
  tipoUsuarioId: number;
  tipoUsuario: string;
  ativo: boolean;
  dataNascimento: string | null;
  cpfMascarado: string | null;
  avatar: string | null;
  registroEm: string | null;
  endereco: EnderecoRespostaApi | null;
  condominioId: number | null;
}

export interface PaginaApi<T> {
  itens: T[];
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
}

export interface FiltrosUsuariosApi {
  busca?: string;
  ativo?: boolean;
  tipoUsuarioId?: number;
  pagina: number;
  tamanho: number;
}

export interface CriarUsuarioApi {
  nome: string;
  email: string;
  senha: string;
  tipoUsuarioId: number;
  dataNascimento: string | null;
  cpf: string | null;
  avatar: string | null;
  endereco: EnderecoApi;
  condominioId: number | null;
}

export interface EditarUsuarioApi {
  nome: string;
  email: string;
  dataNascimento: string | null;
  avatar: string | null;
  endereco: EnderecoApi;
}

export interface EnderecoRespostaApi {
  cep: string | null;
  uf: string | null;
  cidade: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
}