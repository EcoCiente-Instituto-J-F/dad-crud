interface Envelope<T> {
  _versao: number;
  dados: T[];
}

function ehRegistro(
  valor: unknown,
): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

export function lerColecao<T>(
  chave: string,
  versao: number,
  validar: (valor: unknown) => valor is T,
  dadosIniciais: readonly T[],
): T[] {
  const inicial = (): T[] => structuredClone([...dadosIniciais]);
  const texto = localStorage.getItem(chave);

  if (texto === null) {
    return inicial();
  }

  let valor: unknown;

  try {
    valor = JSON.parse(texto);
  } catch {
    localStorage.removeItem(chave);
    return inicial();
  }

  if (
    !ehRegistro(valor) ||
    valor._versao !== versao ||
    !Array.isArray(valor.dados)
  ) {
    localStorage.removeItem(chave);
    return inicial();
  }

  const dados: unknown[] = valor.dados;

  if (!dados.every(validar)) {
    localStorage.removeItem(chave);
    return inicial();
  }

  return dados;
}

export function salvarColecao<T>(
  chave: string,
  versao: number,
  dados: T[],
): void {
  const envelope: Envelope<T> = {
    _versao: versao,
    dados,
  };

  localStorage.setItem(chave, JSON.stringify(envelope));
}