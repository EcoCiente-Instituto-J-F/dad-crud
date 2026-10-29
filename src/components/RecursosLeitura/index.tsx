import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { useAcessibilidade } from "../../hooks/useAcessibilidade";

const ALVOS_TEXTO = "h1, h2, h3, h4, p, a, label, td, th, button, li, span";

export default function RecursosLeitura() {
  const { preferencias } = useAcessibilidade();
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });
  const [textoLupa, setTextoLupa] = useState("");

  useEffect(() => {
    if (!preferencias.guiaLeitura && !preferencias.mascaraLeitura && !preferencias.lupaTexto) {
      return;
    }

    const acompanhar = (evento: PointerEvent) => {
      setPosicao({ x: evento.clientX, y: evento.clientY });
      if (!preferencias.lupaTexto) return;

      const alvo = evento.target instanceof HTMLElement
        ? evento.target.closest<HTMLElement>(ALVOS_TEXTO)
        : null;

      const texto = alvo?.textContent?.trim().slice(0, 170) ?? "";
      setTextoLupa(texto);
    };

    window.addEventListener("pointermove", acompanhar, { passive: true });
    return () => window.removeEventListener("pointermove", acompanhar);
  }, [preferencias.guiaLeitura, preferencias.mascaraLeitura, preferencias.lupaTexto]);

  const variaveis = { "--eco-leitura-y": posicao.y + "px" } as CSSProperties;

  return (
    <>
      {preferencias.mascaraLeitura && (
        <div className="eco-mascara-leitura" style={variaveis} aria-hidden="true" />
      )}
      {preferencias.guiaLeitura && (
        <div className="eco-guia-leitura" style={variaveis} aria-hidden="true" />
      )}
      {preferencias.lupaTexto && textoLupa && (
        <div
          className="eco-lupa-leitura"
          aria-hidden="true"
          style={{
            left: Math.max(12, Math.min(window.innerWidth - 300, posicao.x + 16)),
            top: Math.max(12, Math.min(window.innerHeight - 150, posicao.y + 18)),
          }}
        >
          {textoLupa}
        </div>
      )}
    </>
  );
}
