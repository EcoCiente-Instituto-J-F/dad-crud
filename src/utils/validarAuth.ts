import { z } from "zod";

import { validarSchema } from "./validarSchema";

import type {
  Credenciais,
  DadosPerfil,
  DadosSenha,
} from "../types/auth";
import type { ResultadoFormulario } from "../types/formulario";

export const perfilAdminSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(160),
  cpf: z.string().max(14),
  telefone: z.string().max(20),
  avatar: z.string().max(900000).refine(
    (valor) =>
      valor === "" ||
      /^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(valor),
    "Imagem inválida.",
  ),
});

export const sessaoAdminSchema = z.object({
  _versao: z.literal(2),
  token: z.string().min(1),
  tipoToken: z.literal("Bearer"),
  expiraEm: z.number().finite().positive(),
  papel: z.literal("ADMIN"),
  perfil: perfilAdminSchema,
});

const credenciaisSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .max(160),
  senha: z.string()
    .min(1, "Informe sua senha.")
    .max(128, "Use até 128 caracteres."),
});

const dadosPerfilSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, "Informe pelo menos 3 caracteres.")
    .max(100),
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .max(160),
  telefone: z.string()
    .trim()
    .transform((valor) => valor.replace(/[()\s-]/g, ""))
    .refine(
      (valor) => /^\d{10,11}$/.test(valor),
      "Informe telefone com DDD e 10 ou 11 números.",
    ),
});

const dadosSenhaSchema = z.object({
  senhaAtual: z.string()
    .min(1, "Informe a senha atual.")
    .max(128),
  novaSenha: z.string()
    .min(8, "Use pelo menos 8 caracteres.")
    .max(128)
    .regex(/[a-zA-Z]/, "Inclua pelo menos uma letra.")
    .regex(/\d/, "Inclua pelo menos um número."),
  confirmarSenha: z.string().max(128),
}).superRefine((dados, contexto) => {
  if (dados.novaSenha !== dados.confirmarSenha) {
    contexto.addIssue({
      code: "custom",
      path: ["confirmarSenha"],
      message: "A confirmação não corresponde à nova senha.",
    });
  }

  if (dados.novaSenha === dados.senhaAtual) {
    contexto.addIssue({
      code: "custom",
      path: ["novaSenha"],
      message: "Escolha uma senha diferente da atual.",
    });
  }
});

export function validarCredenciais(
  dados: Credenciais,
): ResultadoFormulario<Credenciais> {
  return validarSchema(credenciaisSchema, dados);
}

export function validarPerfil(
  dados: DadosPerfil,
): ResultadoFormulario<DadosPerfil> {
  return validarSchema(dadosPerfilSchema, dados);
}

export function validarSenha(
  dados: DadosSenha,
): ResultadoFormulario<DadosSenha> {
  return validarSchema(dadosSenhaSchema, dados);
}