import type { Usuario } from "./usuario";

export type TipoCondominio = "RESIDENCIAL" | "COMERCIAL" | "MISTO";
export type StatusCondominio = "ATIVO" | "INATIVO";

export interface Torre {
  id: string;
  nome: string;
  moradores: number;
}

export interface CadastroCondominio {
  nome: string;
  cnpj: string;
  tipo: TipoCondominio;
  codigoAcesso: string;
  sindicoId: string;
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  torres: Torre[];
}

export interface Condominio extends CadastroCondominio {
  id: string;
  status: StatusCondominio;
  moradores: number;
}

export type ErrosCondominio = Partial<
  Record<keyof CadastroCondominio, string>
>;

export type ResultadoValidacaoCondominio =
  | { valido: true; dados: CadastroCondominio }
  | { valido: false; erros: ErrosCondominio };

export interface FormularioCondominioProps {
  formulario: CadastroCondominio;
  erros: ErrosCondominio;
  sindicos: Usuario[];
  salvando: boolean;
  mensagemErro?: string;
  caminhoVoltar: string;
  onAlterar: <K extends keyof CadastroCondominio>(
    campo: K,
    valor: CadastroCondominio[K],
  ) => void;
  onSalvar: () => Promise<void>;
}

export interface GerenciarTorresProps {
  torres: Torre[];
  onChange: (torres: Torre[]) => void;
}

export interface CondominioFormularioPaginaProps {
  modo: "cadastro" | "edicao";
}