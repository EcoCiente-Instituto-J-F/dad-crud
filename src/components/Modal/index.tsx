import { useEffect, useId, useRef } from "react";

import type { ModalProps } from "../../types/modal";

export default function Modal({
  aberto,
  titulo,
  children,
  onFechar,
}: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tituloId = useId();

  useEffect(() => {
    const elemento = dialog.current;
    if (!elemento) return;

    const origem =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (aberto && !elemento.open) {
      elemento.showModal();
    }

    if (!aberto && elemento.open) {
      elemento.close();
    }

    return () => {
      if (elemento.open) elemento.close();
      origem?.focus();
    };
  }, [aberto]);

  return (
    <dialog
      ref={dialog}
      className="modal-ecociente"
      aria-labelledby={tituloId}
      onCancel={(evento) => {
        evento.preventDefault();
        onFechar();
      }}
    >
      <div className="modal-cabecalho">
        <h2 id={tituloId}>{titulo}</h2>

        <button
          type="button"
          className="botao-fechar"
          aria-label="Fechar"
          onClick={onFechar}
        >
          ×
        </button>
      </div>

      {children}
    </dialog>
  );
}