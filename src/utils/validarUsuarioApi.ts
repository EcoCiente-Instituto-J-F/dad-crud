import { z } from "zod";

export const usuarioImportacaoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(100, "Use até 100 caracteres."),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(255),
  senha: z.string().min(8).max(72, "Use até 72 caracteres.").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])\S+$/, "Use maiúscula, minúscula, número e símbolo, sem espaços."),
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
  endereco: z.object({ cep: z.string().regex(/^\d{8}$/), uf: z.string().regex(/^[A-Z]{2}$/), cidade: z.string().trim().min(1).max(100), logradouro: z.string().trim().min(1).max(150), numero: z.string().trim().min(1).max(20), complemento: z.string().max(100).nullable() }),
});


export const editarUsuarioSchema = usuarioImportacaoSchema.omit({ senha: true, tipoUsuarioId: true, cpf: true, condominioId: true });
