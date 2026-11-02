import { z } from "zod";
export const previaQuizSchema = z.object({ titulo: z.string().trim().min(1), notaMinima: z.number().min(0).max(100), perguntas: z.array(z.object({ id: z.number().optional(), _chaveEditor: z.string().optional(), enunciado: z.string().trim().min(1), alternativas: z.array(z.object({ id: z.number().optional(), _chaveEditor: z.string().optional(), texto: z.string().trim().min(1), correta: z.boolean() })).min(2).refine((a) => a.filter((v) => v.correta).length === 1, "Marque exatamente uma alternativa correta.") })).min(1) });

