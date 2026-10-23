export type EstadoRequisicao<T> =
  | {
    status: "carregando";
  }
  | {
    status: "sucesso";
    dados: T;
  }
  | {
    status: "erro";
    mensagem: string;
  };

export interface EstadoRequisicaoProps {
  estado: "carregando" | "erro";
  mensagem?: string;
  onTentarNovamente?: () => void;
}