import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Moldura = { left: number; top: number; width: number; height: number };

const ELEMENTOS_FOCAVEIS =
  'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]';

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(valor, maximo));
}

export default function IndicadorFocoTeclado() {
  const [moldura, setMoldura] = useState<Moldura | null>(null);
  const alvo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let porTeclado = false;
    let quadro = 0;

    function atualizarPosicao() {
      const elemento = alvo.current;

      if (
        !porTeclado ||
        !elemento ||
        !document.contains(elemento) ||
        !elemento.matches(ELEMENTOS_FOCAVEIS) ||
        elemento.closest("[inert], [hidden]") ||
        elemento.getClientRects().length === 0
      ) {
        setMoldura(null);
        return;
      }

      const css = window.getComputedStyle(elemento);
      if (css.visibility === "hidden" || css.display === "none") {
        setMoldura(null);
        return;
      }

      const retangulo = elemento.getBoundingClientRect();
      const larguraTela = window.innerWidth;
      const alturaTela = window.innerHeight;

      if (
        retangulo.width <= 0 ||
        retangulo.height <= 0 ||
        retangulo.bottom < 0 ||
        retangulo.top > alturaTela ||
        retangulo.right < 0 ||
        retangulo.left > larguraTela
      ) {
        setMoldura(null);
        return;
      }

      const margem = 7;
      const left = limitar(retangulo.left - margem, 4, Math.max(4, larguraTela - 22));
      const top = limitar(retangulo.top - margem, 4, Math.max(4, alturaTela - 22));

      setMoldura({
        left,
        top,
        width: Math.max(14, Math.min(larguraTela - left - 4, retangulo.width + margem * 2)),
        height: Math.max(14, Math.min(alturaTela - top - 4, retangulo.height + margem * 2)),
      });
    }

    function agendarAtualizacao() {
      if (quadro) window.cancelAnimationFrame(quadro);
      quadro = window.requestAnimationFrame(atualizarPosicao);
    }

    function registrarTeclado(evento: KeyboardEvent) {
      const tecla = evento.key;
      const navegacao =
        tecla === "Tab" ||
        tecla === "ArrowUp" ||
        tecla === "ArrowDown" ||
        tecla === "ArrowLeft" ||
        tecla === "ArrowRight" ||
        tecla === "Home" ||
        tecla === "End" ||
        tecla === "Enter" ||
        tecla === " " ||
        (evento.ctrlKey && ["a", "l", "p"].includes(tecla.toLowerCase())) ||
        (evento.shiftKey && ["a", "l", "p"].includes(tecla.toLowerCase()));

      if (!navegacao) return;
      porTeclado = true;
      if (document.activeElement instanceof HTMLElement) alvo.current = document.activeElement;
      agendarAtualizacao();
    }

    function mudouFoco(evento: FocusEvent) {
      if (!porTeclado) return;
      alvo.current = evento.target instanceof HTMLElement ? evento.target : null;
      agendarAtualizacao();
    }

    function mudouParaPonteiro() {
      porTeclado = false;
      alvo.current = null;
      setMoldura(null);
    }

    function atualizacaoVisual() {
      if (porTeclado) agendarAtualizacao();
    }

    document.addEventListener("keydown", registrarTeclado, true);
    document.addEventListener("focusin", mudouFoco, true);
    document.addEventListener("pointerdown", mudouParaPonteiro, true);
    window.addEventListener("scroll", atualizacaoVisual, true);
    window.addEventListener("resize", atualizacaoVisual);

    return () => {
      document.removeEventListener("keydown", registrarTeclado, true);
      document.removeEventListener("focusin", mudouFoco, true);
      document.removeEventListener("pointerdown", mudouParaPonteiro, true);
      window.removeEventListener("scroll", atualizacaoVisual, true);
      window.removeEventListener("resize", atualizacaoVisual);
      if (quadro) window.cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div
      className="eco-indicador-foco"
      aria-hidden="true"
      hidden={!moldura}
      style={moldura ? moldura as CSSProperties : undefined}
    >
      <img
        src="/acessibilidade/imagens/eko_marcador.png"
        alt=""
        onError={(evento) => {
          evento.currentTarget.onerror = null;
          evento.currentTarget.src = "/eko-mascote.svg";
        }}
      />
    </div>
  );
}
