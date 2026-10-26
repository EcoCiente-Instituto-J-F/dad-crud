import type { ZodType } from "zod";

import type { ResultadoFormulario } from "../types/formulario";

export function validarSchema<T>(
  schema: ZodType<T>,
  dados: unknown,
): ResultadoFormulario<T> {
  const resultado = schema.safeParse(dados);

  if (resultado.success) {
    return { valido: true, dados: resultado.data };
  }

  const erros: Record<string, string> = {};

  for (const problema of resultado.error.issues) {
    const chave = problema.path.join(".") || "formulario";

    if (!erros[chave]) {
      erros[chave] = problema.message;
    }
  }

  return { valido: false, erros };
}