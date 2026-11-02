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
      <svg aria-hidden="true" focusable="false" className="eco-filtros-daltonismo" width="0" height="0">
        <defs>
          <filter id="eco-filtro-protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0" /></filter>
          <filter id="eco-filtro-deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.700 0.300 0 0 0 0 0.300 0.700 0 0 0 0 0 1 0" /></filter>
          <filter id="eco-filtro-tritanopia"><feColorMatrix type="matrix" values="0.950 0.050 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0" /></filter>
        </defs>
      </svg>
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
