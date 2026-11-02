import type { LinhaImportacao } from "../types/importacaoUsuarios";
import { colunasImportacao } from "../types/importacaoUsuarios";
import { usuarioImportacaoSchema } from "./validarUsuarioApi";

export function lerCsvUsuarios(texto: string): LinhaImportacao[] {
  const fonte = texto.replace(/^\uFEFF/, "");
  const delimitador = fonte.split(/\r?\n/, 1)[0].includes(";") ? ";" : ",";
  const linhas: { valores: string[]; numero: number }[] = [];
  let valores: string[] = []; let campo = ""; let aspas = false; let numero = 1; let inicio = 1;
  for (let i = 0; i < fonte.length; i += 1) {
    const caractere = fonte[i];
    if (caractere === '"') {
      if (aspas && fonte[i + 1] === '"') { campo += '"'; i += 1; } else aspas = !aspas;
    } else if (caractere === delimitador && !aspas) { valores.push(campo); campo = ""; }
    else if ((caractere === "\n" || caractere === "\r") && !aspas) {
      valores.push(campo); if (valores.some((valor) => valor.trim())) linhas.push({ valores, numero: inicio });
      valores = []; campo = ""; if (caractere === "\r" && fonte[i + 1] === "\n") i += 1;
      numero += 1; inicio = numero;
    } else { campo += caractere; if (caractere === "\n") numero += 1; }
  }
  if (aspas) throw new Error("CSV possui aspas sem fechamento.");
  valores.push(campo); if (valores.some((valor) => valor.trim())) linhas.push({ valores, numero: inicio });
  if (linhas.length < 2) throw new Error("O CSV deve conter cabeçalho e pelo menos um usuário.");
  if (linhas.length > 101) throw new Error("Importe no máximo 100 usuários por arquivo.");
  const cabecalho = linhas[0].valores.map((valor) => valor.trim());
  if (new Set(cabecalho).size !== cabecalho.length || cabecalho.length !== colunasImportacao.length || !colunasImportacao.every((coluna) => cabecalho.includes(coluna))) throw new Error(`Use exatamente as colunas do modelo: ${colunasImportacao.join("; ")}`);
  const emails = new Set<string>();
  return linhas.slice(1).map((linha) => {
    const dados = Object.fromEntries(cabecalho.map((coluna, indice) => [coluna, linha.valores[indice]?.trim() ?? ""]));
    const resultado = usuarioImportacaoSchema.safeParse({
      nome: dados.nome, email: dados.email, senha: dados.senha, tipoUsuarioId: Number(dados.tipoUsuarioId),
      cpf: dados.cpf ? dados.cpf.replace(/\D/g, "") : null, dataNascimento: dados.dataNascimento || null, avatar: dados.avatar || null, condominioId: dados.condominioId ? Number(dados.condominioId) : null,
      endereco: { cep: dados.cep.replace(/\D/g, ""), uf: dados.uf.toUpperCase(), cidade: dados.cidade, logradouro: dados.logradouro, numero: dados.numero, complemento: dados.complemento || null },
    });
    const erros = resultado.success ? [] : resultado.error.issues.map((erro) => `${erro.path.join(".")}: ${erro.message}`);
    if (linha.valores.length !== cabecalho.length) erros.push("Quantidade de colunas diferente do modelo.");
    const email = dados.email.toLowerCase();
    if (emails.has(email)) erros.push("E-mail repetido neste arquivo.");
    emails.add(email);
    return { linha: linha.numero, nome: dados.nome, email: dados.email, dados: resultado.success && erros.length === 0 ? resultado.data : null, erros };
  });
}
