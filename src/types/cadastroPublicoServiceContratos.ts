
export interface DadosCadastroPublico {
  nomeUsuario: string;
  email: string;
  senha: string;
  dataNascimento: string;
  cpf: string;
}

export type CadastroPublico =
  | {
      possuiVinculo: true;
      dados: DadosCadastroPublico & {
        codigoCondominio: string;
      };
    }
  | {
      possuiVinculo: false;
      dados: DadosCadastroPublico & {
        cep: string;
        numero: string;
        complemento: string | null;
      };
    };
