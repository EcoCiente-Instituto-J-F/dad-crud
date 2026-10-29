import { apiConfig } from "./apiConfig";
import { lerSessao, removerSessao } from "./sessaoService";

export class ErroHttp extends Error {
  readonly status: number;
  readonly campos: Record<string, string>;

  constructor(
    status: number,
    mensagem: string,
    campos: Record<string, string> = {},
  ) {
    super(mensagem);
    this.name = "ErroHttp";
    this.status = status;
    this.campos = campos;
  }
}

function objeto(
  valor: unknown,
): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function extrairCampos(valor: unknown): Record<string, string> {
  if (!objeto(valor)) return {};

  const campos: Record<string, string> = {};

  for (const [chave, mensagem] of Object.entries(valor)) {
    if (typeof mensagem === "string") {
      campos[chave] = mensagem;
    }
  }

  return campos;
}

function exigirLogin(): never {
  try {
    removerSessao();
  } finally {
    window.location.replace("/login");
  }

  throw new ErroHttp(401, "Sua sessão expirou. Entre novamente.");
}

function mensagemPadrao(status: number): string {
  switch (status) {
    case 400:
      return "Revise os campos informados.";
    case 403:
      return "Você não tem permissão para esta operação.";
    case 404:
      return "Registro não encontrado.";
    case 409:
      return "A operação não pode ser concluída por uma regra de negócio.";
    default:
      return "Não foi possível concluir a operação.";
  }
}

export async function requisitarDad(
  caminho: string,
  opcoes: RequestInit = {},
): Promise<unknown> {
  const sessao = lerSessao();

  if (!sessao) {
    return exigirLogin();
  }

  const headers = new Headers(opcoes.headers);

  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${sessao.token}`);

  if (typeof opcoes.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${apiConfig.dad}${caminho}`, {
      ...opcoes,
      headers,
    });
  } catch (erro: unknown) {
    if (opcoes.signal?.aborted) throw erro;

    throw new Error(
      "Não foi possível conectar à API. Confira sua conexão e tente novamente.",
    );
  }

  if (resposta.status === 401) {
    return exigirLogin();
  }

  const texto = await resposta.text();
  let conteudo: unknown = null;

  if (texto) {
    try {
      conteudo = JSON.parse(texto);
    } catch {
      if (resposta.ok) {
        throw new Error("A API retornou uma resposta inválida.");
      }
    }
  }

  if (!resposta.ok) {
    const mensagem =
      objeto(conteudo) && typeof conteudo.mensagem === "string"
        ? conteudo.mensagem
        : mensagemPadrao(resposta.status);

    throw new ErroHttp(
      resposta.status,
      mensagem,
      objeto(conteudo) ? extrairCampos(conteudo.campos) : {},
    );
  }

  return conteudo;
}