import type {
  CadastroCondominio,
  ErrosCondominio,
  ResultadoValidacaoCondominio,
} from "../types/condominio";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF",
  "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
  "RO", "RR", "SC", "SP", "SE", "TO",
];

function texto(valor: string): string {
  return valor
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function cnpjValido(documento: string): boolean {
  if (!/^\d{14}$/.test(documento) || /^(\d)\1+$/.test(documento)) {
    return false;
  }

  function digito(base: string): number {
    let peso = base.length - 7;
    let soma = 0;

    for (const caractere of base) {
      soma += Number(caractere) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  const base = documento.slice(0, 12);
  const primeiro = digito(base);
  const segundo = digito(`${base}${primeiro}`);

  return documento === `${base}${primeiro}${segundo}`;
}

export function validarCondominio(
  formulario: CadastroCondominio,
): ResultadoValidacaoCondominio {
  const dados: CadastroCondominio = {
    ...formulario,
    nome: texto(formulario.nome),
    cnpj: formulario.cnpj.replace(/[.\-\/\s]/g, ""),
    codigoAcesso: texto(formulario.codigoAcesso).toUpperCase(),
    sindicoId: formulario.sindicoId.trim(),
    cep: formulario.cep.replace(/[-\s]/g, ""),
    uf: formulario.uf.trim().toUpperCase(),
    cidade: texto(formulario.cidade),
    bairro: texto(formulario.bairro),
    logradouro: texto(formulario.logradouro),
    numero: texto(formulario.numero),
    complemento: texto(formulario.complemento),
    torres: formulario.torres.map((torre) => ({
      ...torre,
      nome: texto(torre.nome),
    })),
  };

  const erros: ErrosCondominio = {};

  if (dados.nome.length < 3 || dados.nome.length > 120) {
    erros.nome = "Informe um nome entre 3 e 120 caracteres.";
  }

  if (!cnpjValido(dados.cnpj)) {
    erros.cnpj = "Informe um CNPJ numérico válido.";
  }

  if (!["RESIDENCIAL", "COMERCIAL", "MISTO"].includes(dados.tipo)) {
    erros.tipo = "Selecione um tipo válido.";
  }

  if (!/^[A-Z0-9-]{4,20}$/.test(dados.codigoAcesso)) {
    erros.codigoAcesso =
      "Use de 4 a 20 letras, números ou hífens.";
  }

  if (!/^\d{8}$/.test(dados.cep)) {
    erros.cep = "Informe um CEP com 8 números.";
  }

  if (!UFS.includes(dados.uf)) {
    erros.uf = "Informe uma UF válida.";
  }

  if (dados.cidade.length < 2 || dados.cidade.length > 80) {
    erros.cidade = "Informe uma cidade entre 2 e 80 caracteres.";
  }

  if (dados.bairro.length < 2 || dados.bairro.length > 80) {
    erros.bairro = "Informe um bairro entre 2 e 80 caracteres.";
  }

  if (dados.logradouro.length < 3 || dados.logradouro.length > 120) {
    erros.logradouro =
      "Informe um logradouro entre 3 e 120 caracteres.";
  }

  if (!dados.numero || dados.numero.length > 20) {
    erros.numero = "Informe o número ou S/N, com até 20 caracteres.";
  }

  if (dados.complemento.length > 100) {
    erros.complemento = "Use até 100 caracteres no complemento.";
  }

  const nomesTorres = dados.torres.map((torre) =>
    torre.nome.toLocaleLowerCase("pt-BR"),
  );

  if (
    dados.torres.some(
      (torre) => torre.nome.length < 2 || torre.nome.length > 60,
    ) ||
    new Set(nomesTorres).size !== nomesTorres.length
  ) {
    erros.torres =
      "As torres precisam ter nomes diferentes, entre 2 e 60 caracteres.";
  }

  if (Object.keys(erros).length > 0) {
    return { valido: false, erros };
  }

  return { valido: true, dados };
}