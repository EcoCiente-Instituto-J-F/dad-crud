export function simularRequisicao(
  signal: AbortSignal,
  tempo = 400,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Operação cancelada.", "AbortError"));
      return;
    }

    const cancelar = (): void => {
      window.clearTimeout(temporizador);
      signal.removeEventListener("abort", cancelar);
      reject(new DOMException("Operação cancelada.", "AbortError"));
    };

    const temporizador = window.setTimeout(() => {
      signal.removeEventListener("abort", cancelar);
      resolve();
    }, tempo);

    signal.addEventListener("abort", cancelar, { once: true });
  });
}