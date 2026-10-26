import type {
  CadastroUsuario,
  ErrosCadastroUsuario,
  ResultadoValidacaoUsuario,
} from "../types/usuario";

const UFS: readonly string[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF",
  "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
  "RO", "RR", "SC", "SP", "SE", "TO",
];

function limparTexto(valor: string): string {
  return valor
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function validarUsuario(
  formulario: CadastroUsuario,
): ResultadoValidacaoUsuario {
  const dados: CadastroUsuario = {
    nome: limparTexto(formulario.nome),
    email: formulario.email.trim().toLowerCase(),
    cidade: limparTexto(formulario.cidade),
    uf: formulario.uf.trim().toUpperCase(),
    tipo: formulario.tipo,
  };

  const erros: ErrosCadastroUsuario = {};

  if (dados.nome.length < 3 || dados.nome.length > 100) {
    erros.nome = "Informe um nome entre 3 e 100 caracteres.";
  }

  if (
    dados.email.length > 160 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)
  ) {
    erros.email = "Informe um e-mail válido com até 160 caracteres.";
  }

  if (dados.cidade.length < 2 || dados.cidade.length > 80) {
    erros.cidade = "Informe uma cidade entre 2 e 80 caracteres.";
  }

  if (!UFS.includes(dados.uf)) {
    erros.uf = "Informe uma UF válida, como SP.";
  }

  if (
    !["MORADOR", "USUARIO_COMUM", "SINDICO", "COOPERATIVA"].includes(
      dados.tipo,
    )
  ) {
    erros.tipo = "Selecione um tipo de usuário válido.";
  }

  if (Object.keys(erros).length > 0) {
    return { valido: false, erros };
  }

  return { valido: true, dados };
}