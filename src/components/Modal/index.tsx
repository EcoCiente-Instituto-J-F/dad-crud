import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { ModalProps } from "../../types/modal";

export default function Modal({ aberto, titulo, children, onFechar }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tituloId = useId();
  useEffect(() => {
    if (!aberto || !dialog.current) return;
    const elemento = dialog.current;
    const origem = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!elemento.open) elemento.showModal();
    return () => { if (elemento.open) elemento.close(); origem?.focus(); };
  }, [aberto]);
  if (!aberto) return null;
  return createPortal(
    <dialog ref={dialog} className="modal-ecociente visual-modal" aria-labelledby={tituloId}
      onSubmit={(evento) => evento.stopPropagation()}
      onCancel={(evento) => { evento.preventDefault(); onFechar(); }}>
      <div className="modal-cabecalho"><h2 id={tituloId}>{titulo}</h2>
        <button type="button" className="botao-fechar" aria-label="Fechar" onClick={onFechar}>×</button>
      </div>
      <div className="visual-modal-corpo">{children}</div>
    </dialog>, document.body,
  );
}