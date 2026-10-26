import { z } from "zod";

import { validarSchema } from "./validarSchema";

import type { CadastroColeta, RegistroVisita } from "../types/coleta";
import type { ResultadoFormulario } from "../types/formulario";

function dataValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;

  const data = new Date(`${valor}T12:00:00Z`);

  return (
    !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === valor
  );
}

export const dataSchema = z.string().refine(dataValida, {
  message: "Informe uma data válida.",
});

const horaSchema = z.string().regex(
  /^([01]\d|2[0-3]):[0-5]\d$/,
  "Informe um horário válido.",
);

export const cadastroColetaSchema = z.object({
  condominioId: z.string().min(1, "Selecione um condomínio."),
  cooperativaId: z.string().min(1, "Selecione uma cooperativa."),
  dataInicio: dataSchema,
  dataFim: dataSchema,
  horaInicio: horaSchema,
  horaFim: horaSchema,
  recorrente: z.boolean(),
  diasSemana: z.array(z.number().int().min(0).max(6)),
}).superRefine((coleta, contexto) => {
  if (coleta.dataFim < coleta.dataInicio) {
    contexto.addIssue({
      code: "custom",
      path: ["dataFim"],
      message: "O fim não pode ser anterior ao início.",
    });
  }

  if (coleta.horaFim <= coleta.horaInicio) {
    contexto.addIssue({
      code: "custom",
      path: ["horaFim"],
      message: "O horário final deve ser depois do inicial.",
    });
  }

  if (!coleta.recorrente && coleta.dataInicio !== coleta.dataFim) {
    contexto.addIssue({
      code: "custom",
      path: ["dataFim"],
      message: "Para coleta única, início e fim devem ter a mesma data.",
    });
  }

  if (coleta.recorrente && coleta.diasSemana.length === 0) {
    contexto.addIssue({
      code: "custom",
      path: ["diasSemana"],
      message: "Selecione pelo menos um dia da semana.",
    });
  }

  if (
    coleta.recorrente &&
    dataValida(coleta.dataInicio) &&
    dataValida(coleta.dataFim) &&
    coleta.dataFim >= coleta.dataInicio
  ) {
    const inicio = new Date(`${coleta.dataInicio}T12:00:00Z`);
    const fim = new Date(`${coleta.dataFim}T12:00:00Z`);
    const dias = Math.round((fim.getTime() - inicio.getTime()) / 86400000);
    let possuiOcorrencia = false;

    for (let deslocamento = 0; deslocamento <= Math.min(dias, 6); deslocamento++) {
      const dia = (inicio.getUTCDay() + deslocamento) % 7;

      if (coleta.diasSemana.includes(dia)) {
        possuiOcorrencia = true;
      }
    }

    if (!possuiOcorrencia) {
      contexto.addIssue({
        code: "custom",
        path: ["diasSemana"],
        message: "Os dias selecionados não ocorrem no período informado.",
      });
    }
  }
});

export const registroVisitaSchema = z.object({
  data: dataSchema,
  realizada: z.boolean(),
  confirmada: z.boolean(),
  observacao: z.string().trim().max(1000, "Use até 1000 caracteres."),
}).refine((visita) => !visita.confirmada || visita.realizada, {
  path: ["confirmada"],
  message: "Uma visita não realizada não pode ser confirmada.",
});

export const visitaSchema = registroVisitaSchema.and(z.object({
  id: z.string().min(1),
  registradoEm: z.string().min(1),
}));

export const coletaSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["AGENDADA", "CANCELADA"]),
  motivoCancelamento: z.string().max(500),
  visitas: z.array(visitaSchema),
}).and(cadastroColetaSchema);

export function validarColeta(
  dados: CadastroColeta,
): ResultadoFormulario<CadastroColeta> {
  return validarSchema(cadastroColetaSchema, dados);
}

export function validarVisita(
  dados: RegistroVisita,
): ResultadoFormulario<RegistroVisita> {
  return validarSchema(registroVisitaSchema, dados);
}