import { materiaisDisponiveis } from "../data/cooperativa";
import { cnpjValido } from "./validarCondominio";

import type {
  CadastroCooperativa,
  EnderecoCooperativa,
  ErrosCooperativa,
  ResultadoValidacaoCooperativa,
} from "../types/cooperativa";

const UFS: readonly string[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF",
  "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
  "RO", "RR", "SC", "SP", "SE", "TO",
];

function limpar(valor: string): string {
  return valor
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function limparEndereco(
  endereco: EnderecoCooperativa,
): EnderecoCooperativa {
  return {
    cep: endereco.cep.replace(/[-\s]/g, ""),
    uf: endereco.uf.trim().toUpperCase(),
    cidade: limpar(endereco.cidade),
    bairro: limpar(endereco.bairro),
    logradouro: limpar(endereco.logradouro),
    numero: limpar(endereco.numero),
    complemento: limpar(endereco.complemento),
  };
}

function validarEndereco(
  endereco: EnderecoCooperativa,
  prefixo: string,
  erros: ErrosCooperativa,
): void {
  if (!/^\d{8}$/.test(endereco.cep)) {
    erros[`${prefixo}.cep`] = "Informe um CEP com 8 números.";
  }

  if (!UFS.includes(endereco.uf)) {
    erros[`${prefixo}.uf`] = "Informe uma UF válida.";
  }

  if (endereco.cidade.length < 2 || endereco.cidade.length > 80) {
    erros[`${prefixo}.cidade`] = "Use de 2 a 80 caracteres na cidade.";
  }

  if (endereco.bairro.length < 2 || endereco.bairro.length > 80) {
    erros[`${prefixo}.bairro`] = "Use de 2 a 80 caracteres no bairro.";
  }

  if (
    endereco.logradouro.length < 3 ||
    endereco.logradouro.length > 120
  ) {
    erros[`${prefixo}.logradouro`] =
      "Use de 3 a 120 caracteres no logradouro.";
  }

  if (!endereco.numero || endereco.numero.length > 20) {
    erros[`${prefixo}.numero`] = "Informe o número ou S/N.";
  }

  if (endereco.complemento.length > 100) {
    erros[`${prefixo}.complemento`] = "Use até 100 caracteres.";
  }
}

export function validarCooperativa(
  formulario: CadastroCooperativa,
): ResultadoValidacaoCooperativa {
  const dados: CadastroCooperativa = {
    ...formulario,
    nome: limpar(formulario.nome),
    cnpj: formulario.cnpj.replace(/[.\-\/\s]/g, ""),
    email: formulario.email.trim().toLowerCase(),
    telefone: formulario.telefone.replace(/[()\s-]/g, ""),
    usuarioId: formulario.usuarioId.trim(),
    endereco: limparEndereco(formulario.endereco),
    materiais: [...new Set(formulario.materiais)],
    pontos: formulario.pontos.map((ponto) => ({
      ...ponto,
      nome: limpar(ponto.nome),
      endereco: limparEndereco(ponto.endereco),
      materiais: [...new Set(ponto.materiais)],
    })),
  };

  const erros: ErrosCooperativa = {};

  if (dados.nome.length < 3 || dados.nome.length > 120) {
    erros.nome = "Informe um nome entre 3 e 120 caracteres.";
  }

  if (!cnpjValido(dados.cnpj)) {
    erros.cnpj = "Informe um CNPJ numérico válido.";
  }

  if (
    dados.email.length > 160 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)
  ) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!/^\d{10,11}$/.test(dados.telefone)) {
    erros.telefone = "Informe telefone com DDD e 10 ou 11 números.";
  }

  if (!["ATIVO", "INATIVO"].includes(dados.status)) {
    erros.status = "Selecione um status válido.";
  }

  if (
    dados.materiais.length === 0 ||
    dados.materiais.some(
      (material) => !materiaisDisponiveis.includes(material),
    )
  ) {
    erros.materiais = "Selecione pelo menos um material válido.";
  }

  validarEndereco(dados.endereco, "endereco", erros);

  const nomes = new Set<string>();
  const ids = new Set<string>();

  for (const ponto of dados.pontos) {
    const prefixo = `pontos.${ponto.id}`;
    const nomeNormalizado = ponto.nome.toLocaleLowerCase("pt-BR");

    if (
      ponto.nome.length < 3 ||
      ponto.nome.length > 100 ||
      nomes.has(nomeNormalizado)
    ) {
      erros[`${prefixo}.nome`] =
        "Use um nome único entre 3 e 100 caracteres.";
    }

    nomes.add(nomeNormalizado);

    if (!ponto.id || ids.has(ponto.id)) {
      erros.pontos = "Existem identificadores de pontos inválidos.";
    }

    ids.add(ponto.id);

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(ponto.abertura)) {
      erros[`${prefixo}.abertura`] = "Informe um horário válido.";
    }

    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(ponto.fechamento) ||
      ponto.fechamento <= ponto.abertura
    ) {
      erros[`${prefixo}.fechamento`] =
        "O fechamento deve ser depois da abertura.";
    }

    if (
      ponto.materiais.length === 0 ||
      ponto.materiais.some(
        (material) => !dados.materiais.includes(material),
      )
    ) {
      erros[`${prefixo}.materiais`] =
        "Selecione materiais também aceitos pela cooperativa.";
    }

    if (!["ATIVO", "INATIVO"].includes(ponto.status)) {
      erros[`${prefixo}.status`] = "Selecione um status válido.";
    }

    validarEndereco(ponto.endereco, `${prefixo}.endereco`, erros);
  }

  return Object.keys(erros).length > 0
    ? { valido: false, erros }
    : { valido: true, dados };
}