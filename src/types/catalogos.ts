import { z } from "zod";

const opcaoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
});

const categoriaSchema = opcaoSchema.extend({
  permiteReciclagem: z.boolean(),
  cor: z.string().nullable(),
  pontosBase: z.number().int().nullable(),
  limitePontosDiario: z.number().int().nullable(),
});

const diaSemanaSchema = opcaoSchema.extend({
  numero: z.number().int(),
});

const sindicoSchema = opcaoSchema.extend({
  usuarioId: z.number().int().positive(),
});

export const catalogosSchema = z.object({
  tiposUsuarios: z.array(opcaoSchema),
  tiposCondominios: z.array(opcaoSchema),
  categoriasResiduos: z.array(categoriaSchema),
  diasSemana: z.array(diaSemanaSchema),
  statusAgendamentos: z.array(opcaoSchema),
  sindicos: z.array(sindicoSchema),
});

export type OpcaoCatalogo = z.infer<typeof opcaoSchema>;
export type CategoriaResiduo = z.infer<typeof categoriaSchema>;
export type DiaSemana = z.infer<typeof diaSemanaSchema>;
export type SindicoCatalogo = z.infer<typeof sindicoSchema>;
export type Catalogos = z.infer<typeof catalogosSchema>;