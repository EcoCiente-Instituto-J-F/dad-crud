
export type Estado =
  | { status: "pronto" }
  | { status: "carregando" }
  | { status: "sucesso" }
  | { status: "erro"; mensagem: string };
