import { z } from "zod";
import type { CadastroPessoaValidado,FormularioCadastroPessoa } from "../types/cadastroPessoa";
import type { ResultadoFormulario } from "../types/formulario";
import { emailContaSchema,senhaForteSchema } from "./validarContaApi";
import { validarSchema } from "./validarSchema";
const primeiraEtapa = z.object({
  nomeUsuario: z.string().trim().min(1, "Informe o nome completo.").max(100, "Use até 100 caracteres."),
  email: emailContaSchema, senha: senhaForteSchema,
  cpf: z.string().transform((v) => v.replace(/\D/g, "")).pipe(z.string().regex(/^\d{11}$/, "Informe CPF com 11 números.")),
  dataNascimento: z.string().date("Informe uma data válida.").refine((valor) => {
    const data = new Date(`${valor}T12:00:00`); const hoje = new Date();
    let idade = hoje.getFullYear() - data.getFullYear();
    if (hoje.getMonth() < data.getMonth() || (hoje.getMonth() === data.getMonth() && hoje.getDate() < data.getDate())) idade--;
    return idade >= 10 && data < hoje;
  }, "A idade mínima é de 10 anos."),
  possuiVinculo: z.boolean(), codigoCondominio: z.string().trim().toUpperCase().max(20),
  cep: z.string().transform((v) => v.replace(/\D/g, "")), numero: z.string().trim().max(20), complemento: z.string().trim().max(255),
}).superRefine((dados, ctx) => {
  if (dados.possuiVinculo && !dados.codigoCondominio) ctx.addIssue({ code: "custom", path: ["codigoCondominio"], message: "Informe o código do condomínio." });
});
export function validarEtapaPessoa(formulario: FormularioCadastroPessoa): ResultadoFormulario<FormularioCadastroPessoa> {
  return validarSchema(primeiraEtapa, formulario);
}
export function validarCadastroPessoa(formulario: FormularioCadastroPessoa): ResultadoFormulario<CadastroPessoaValidado> {
  const validacao = validarEtapaPessoa(formulario);
  if (!validacao.valido) return validacao;
  const f = validacao.dados;
  const erros: Record<string, string> = {};
  if (!f.possuiVinculo) {
    if (!/^\d{8}$/.test(f.cep)) erros.cep = "Informe o CEP com oito números.";
    if (!f.numero) erros.numero = "Informe o número.";
  }
  if (Object.keys(erros).length) return { valido: false, erros };
  const dados = { nomeUsuario: f.nomeUsuario, email: f.email, senha: f.senha, cpf: f.cpf, dataNascimento: f.dataNascimento };
  return { valido: true, dados: { formulario: f, cadastro: f.possuiVinculo
    ? { possuiVinculo: true, dados: { ...dados, codigoCondominio: f.codigoCondominio } }
    : { possuiVinculo: false, dados: { ...dados, cep: f.cep, numero: f.numero, complemento: f.complemento || null } } } };
}
