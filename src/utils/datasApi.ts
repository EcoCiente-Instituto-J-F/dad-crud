export function converterDataLocal(valor: string): string {
  const data = new Date(valor);

  if (!valor || Number.isNaN(data.getTime())) {
    throw new Error("Informe uma data e um horário válidos.");
  }

  return data.toISOString();
}

export function preencherDataLocal(
  valor: string | null,
): string {
  if (!valor) return "";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "";

  const local = new Date(
    data.getTime() - data.getTimezoneOffset() * 60_000,
  );

  return local.toISOString().slice(0, 16);
}

export function formatarDataHora(
  valor: string | null,
): string {
  if (!valor) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}