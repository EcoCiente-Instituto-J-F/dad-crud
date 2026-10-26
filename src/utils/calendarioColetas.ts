import type { CadastroColeta } from "../types/coleta";

export function dataLocal(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function ocorreNaData(
  coleta: CadastroColeta,
  data: string,
): boolean {
  if (data < coleta.dataInicio || data > coleta.dataFim) return false;

  if (!coleta.recorrente) {
    return data === coleta.dataInicio;
  }

  const dia = new Date(`${data}T12:00:00Z`).getUTCDay();
  return coleta.diasSemana.includes(dia);
}

export function formatarData(data: string): string {
  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");
}

export const diasSemana = [
  { id: 0, nome: "Dom" },
  { id: 1, nome: "Seg" },
  { id: 2, nome: "Ter" },
  { id: 3, nome: "Qua" },
  { id: 4, nome: "Qui" },
  { id: 5, nome: "Sex" },
  { id: 6, nome: "Sáb" },
] as const;