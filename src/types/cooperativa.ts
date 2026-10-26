import type { Usuario } from "./usuario";

export type Material =
  | "PAPEL"
  | "PLASTICO"
  | "METAL"
  | "VIDRO"
  | "ELETRONICOS"
  | "ORGANICOS";

export type StatusCooperativa = "ATIVO" | "INATIVO";

export interface EnderecoCooperativa {
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
}

export interface PontoColeta {
  id: string;
  nome: string;
  abertura: string;
  fechamento: string;
  endereco: EnderecoCooperativa;
  materiais: Material[];
  status: StatusCooperativa;
}

export interface CadastroCooperativa {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  usuarioId: string;
  endereco: EnderecoCooperativa;
  materiais: Material[];
  pontos: PontoColeta[];
  status: StatusCooperativa;
}

export interface Cooperativa extends CadastroCooperativa {
  id: string;
  criadoEm: string;
}

export type ErrosCooperativa = Record<string, string>;

export type ResultadoValidacaoCooperativa =
  | { valido: true; dados: CadastroCooperativa }
  | { valido: false; erros: ErrosCooperativa };

export interface DadosCooperativas {
  cooperativas: Cooperativa[];
  usuarios: Usuario[];
}

export interface SeletorMateriaisProps {
  id: string;
  selecionados: Material[];
  onChange: (materiais: Material[]) => void;
}

export interface CamposEnderecoProps {
  prefixo: string;
  endereco: EnderecoCooperativa;
  erros: ErrosCooperativa;
  onChange: (endereco: EnderecoCooperativa) => void;
}

export interface PontosColetaProps {
  pontos: PontoColeta[];
  erros: ErrosCooperativa;
  onChange: (pontos: PontoColeta[]) => void;
}

export interface EditorCooperativaProps {
  inicial: CadastroCooperativa;
  id?: string;
  usuarios: Usuario[];
}

export interface CooperativaFormularioPaginaProps {
  modo: "cadastro" | "edicao";
}