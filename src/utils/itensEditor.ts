/** Identificador interno, exclusivo para a reconciliação do React. */
export function prepararItensEditor(dados: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(dados).map(([chave, valor]) => [
    chave,
    Array.isArray(valor)
      ? valor.map((item: unknown) => {
          if (typeof item !== "object" || item === null || Array.isArray(item)) return item;
          const registro = item as Record<string, unknown>;
          return { ...prepararItensEditor(registro), _chaveEditor: registro._chaveEditor ?? crypto.randomUUID() };
        })
      : typeof valor === "object" && valor !== null
        ? prepararItensEditor(valor as Record<string, unknown>)
        : valor,
  ]));
}

export function chaveItemEditor(item: Record<string, unknown>): string | number {
  if (typeof item.id === "number") return item.id;
  if (typeof item._chaveEditor === "string") return item._chaveEditor;
  throw new Error("Item do editor sem identificador interno.");
}
