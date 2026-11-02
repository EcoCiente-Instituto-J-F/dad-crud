import type { CadastroPublico } from "../types/cadastroPublicoServiceContratos";
import { validarCadastroPessoa } from "../utils/validarCadastroPessoa";
import { apiConfig } from "./apiConfig";





function obterMensagem(valor: unknown): string | null {
  if (
    typeof valor !== "object" ||
    valor === null
  ) {
    return null;
  }

  for (const chave of ["mensagem", "message", "detail"]) {
    if (
      chave in valor &&
      typeof valor[chave as keyof typeof valor] === "string"
    ) {
      return String(valor[chave as keyof typeof valor]);
    }
  }

  return null;
}

export async function cadastrarPessoa(
  cadastro: CadastroPublico,
  signal: AbortSignal,
): Promise<void> {
  try {
    const validacao = validarCadastroPessoa({ ...cadastro.dados, possuiVinculo: cadastro.possuiVinculo,
      codigoCondominio: "codigoCondominio" in cadastro.dados ? cadastro.dados.codigoCondominio : "",
      cep: "cep" in cadastro.dados ? cadastro.dados.cep : "",
      numero: "numero" in cadastro.dados ? cadastro.dados.numero : "",
      complemento: "complemento" in cadastro.dados ? cadastro.dados.complemento ?? "" : "",
    });
    if (!validacao.valido) throw new Error(Object.entries(validacao.erros).map(([campo, texto]) => `${campo}: ${texto}`).join(" • "));
    const rota = cadastro.possuiVinculo ? "morador" : "comum";

    const resposta = await fetch(
      `${apiConfig.cadastro}/api/cadastro/${rota}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validacao.dados.cadastro.dados),
        signal,
      },
    );

    if (resposta.ok) return;

    let conteudo: unknown = null;

    try {
      conteudo = await resposta.json();
    } catch {
      // A resposta de erro pode não conter JSON.
    }

    const mensagem = obterMensagem(conteudo);

    if (mensagem) {
      throw new Error(mensagem);
    }

    switch (resposta.status) {
      case 400:
        throw new Error(
          "Revise os dados. Confira também CPF, nascimento e senha.",
        );
      case 404:
        throw new Error(
          "Não foi possível localizar o condomínio ou o recurso solicitado.",
        );
      case 409:
        throw new Error(
          "O cadastro possui dados já utilizados ou um conflito.",
        );
      default:
        throw new Error(
          "Não foi possível cadastrar. Tente novamente.",
        );
    }
  } catch (erro: unknown) {
    if (signal.aborted) throw erro;

    if (erro instanceof TypeError) {
      throw new Error(
        "Não foi possível conectar à API de cadastro.",
      );
    }

    throw erro instanceof Error
      ? erro
      : new Error("Não foi possível cadastrar.");
  }
}
