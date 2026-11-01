import { z } from "zod";
import type { CriarUsuarioApi } from "./usuarioApi";

export interface LinhaImportacao { linha: number; nome: string; email: string; dados: CriarUsuarioApi | null; erros: string[] }
const nullable = z.string().nullable();
export const usuarioImportacaoSchema = z.object({
  nome: z.string().trim().min(2).max(160),
  email: z.email().max(160),
  senha: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])\S+$/, "Use maiúscula, minúscula, número e símbolo, sem espaços."),
  tipoUsuarioId: z.number().int().positive(),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 números.").nullable(),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use AAAA-MM-DD.").refine((valor) => {
    const data = new Date(`${valor}T12:00:00Z`);
    if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor) return false;
    const hoje = new Date(); let idade = hoje.getUTCFullYear() - data.getUTCFullYear();
    if (hoje.getUTCMonth() < data.getUTCMonth() || (hoje.getUTCMonth() === data.getUTCMonth() && hoje.getUTCDate() < data.getUTCDate())) idade -= 1;
    return idade >= 10;
  }, "Informe uma data válida; idade mínima de 10 anos.").nullable(),
  avatar: z.url().max(500).refine((valor) => /^https?:\/\//i.test(valor), "Use URL HTTP ou HTTPS.").nullable(),
  condominioId: z.number().int().positive().nullable(),
  endereco: z.object({ cep: z.string().regex(/^\d{8}$/), uf: z.string().regex(/^[A-Z]{2}$/), cidade: z.string().trim().min(1), logradouro: z.string().trim().min(1), numero: z.string().trim().min(1), complemento: nullable }),
});

export const colunasImportacao = ["nome", "email", "senha", "tipoUsuarioId", "cpf", "dataNascimento", "avatar", "cep", "uf", "cidade", "logradouro", "numero", "complemento", "condominioId"];