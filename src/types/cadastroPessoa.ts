import type { CadastroPublico } from "./cadastroPublicoServiceContratos";
export interface FormularioCadastroPessoa {
  nomeUsuario: string; email: string; senha: string; cpf: string; dataNascimento: string;
  possuiVinculo: boolean; codigoCondominio: string; cep: string; numero: string; complemento: string;
}
export interface CadastroPessoaValidado { formulario: FormularioCadastroPessoa; cadastro: CadastroPublico }
