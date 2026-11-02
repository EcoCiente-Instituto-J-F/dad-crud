import { z } from "zod";
import type { AlterarSenhaApi,AtualizarPerfilApi,RedefinirSenhaApi } from "../types/perfilApi";
import { validarSchema } from "./validarSchema";

export const emailContaSchema = z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(255, "Use até 255 caracteres.");
export const senhaForteSchema = z.string().min(8, "Use pelo menos 8 caracteres.").max(100, "Use até 100 caracteres.")
  .regex(/[A-Z]/, "Inclua uma letra maiúscula.").regex(/[a-z]/, "Inclua uma letra minúscula.")
  .regex(/\d/, "Inclua um número.").regex(/[^A-Za-z0-9\s]/, "Inclua um caractere especial.")
  .regex(/^\S+$/, "A senha não pode conter espaços.");
export const avatarUrlSchema = z.string().trim().max(500, "Use até 500 caracteres na URL.").refine(
  (valor) => valor === "" || /^https?:\/\/[^\s]+$/i.test(valor), "Informe uma URL HTTP ou HTTPS.",
);
const perfilSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(100, "Use até 100 caracteres."),
  email: emailContaSchema,
  urlAvatar: avatarUrlSchema,
  telefone: z.string().regex(/^\d{10,11}$/, "Informe telefone com DDD e 10 ou 11 números.").optional(),
  telefoneId: z.number().int().positive("Informe um identificador de telefone válido.").optional(),
});
const senhaSchema = z.object({
  senhaAtual: z.string().min(1, "Informe a senha atual."),
  novaSenha: senhaForteSchema,
  confirmacaoSenha: z.string().min(1, "Confirme a nova senha."),
}).superRefine((dados, ctx) => {
  if (dados.novaSenha !== dados.confirmacaoSenha) ctx.addIssue({ code: "custom", path: ["confirmacaoSenha"], message: "As senhas não correspondem." });
  if (dados.novaSenha === dados.senhaAtual) ctx.addIssue({ code: "custom", path: ["novaSenha"], message: "Escolha uma senha diferente da atual." });
});
const redefinicaoSchema = z.object({
  email: emailContaSchema,
  token: z.string().regex(/^\d{4}$/, "Informe o código de quatro números."),
  novaSenha: senhaForteSchema,
  confirmacaoSenha: z.string().min(1, "Confirme a nova senha."),
}).refine((dados) => dados.novaSenha === dados.confirmacaoSenha, { path: ["confirmacaoSenha"], message: "As senhas não correspondem." });

export function validarPerfilApi(dados: AtualizarPerfilApi) { return validarSchema(perfilSchema, dados); }
export function validarSenhaApi(dados: AlterarSenhaApi) { return validarSchema(senhaSchema, dados); }
export function validarRedefinicaoApi(dados: RedefinirSenhaApi) { return validarSchema(redefinicaoSchema, dados); }
export const esquemasConta = { perfil: perfilSchema, senha: senhaSchema, redefinicao: redefinicaoSchema };
