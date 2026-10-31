import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

const frases = [
  "Oi! Que bom te ver por aqui! 🌱",
  "Cada coleta é um carinho com o planeta!",
  "Vamos cultivar boas ideias hoje? 💚",
  "Você faz a diferença, sabia?",
  "Um planeta melhor começa com a gente!",
  "A natureza agradece seu cuidado! 🌿",
  "Seu trabalho transforma o futuro!",
  "Juntos, fazemos o EcoCiente crescer!",
  "Pequenas atitudes geram grandes mudanças!",
  "Continue espalhando sustentabilidade!",
];

const gif = "/acessibilidade/eko/eko-animado.gif";
const imagem = "/acessibilidade/eko/eko-hover.png";
const reserva = "/eko-mascote.svg";

type Posicao = { x: number; y: number };
type Arraste = {
  id: number;
  inicialX: number;
  inicialY: number;
  x: number;
  y: number;
  moveu: boolean;
};

function limitar(numero: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(numero, maximo));
}

function posicaoInicial(): Posicao {
  return {
    x: Math.max(12, window.innerWidth - 180),
    y: Math.max(12, window.innerHeight - 204),
  };
}

export default function MascoteEko() {
  const [posicao, setPosicao] = useState<Posicao>(posicaoInicial);
  const [frase, setFrase] = useState(frases[0]);
  const [visivel, setVisivel] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const arraste = useRef<Arraste | null>(null);
  const evitarClique = useRef(false);

  useEffect(() => {
    const ajustar = () => setPosicao((atual) => ({
      x: limitar(atual.x, 12, Math.max(12, window.innerWidth - 150)),
      y: limitar(atual.y, 12, Math.max(12, window.innerHeight - 175)),
    }));
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, []);

  function sortear() {
    const opcoes = frases.filter((texto) => texto !== frase);
    setFrase(opcoes[Math.floor(Math.random() * opcoes.length)]);
  }

  function apontar() {
    if (arrastando) return;
    sortear();
    setVisivel(true);
  }

  function iniciar(evento: PointerEvent<HTMLButtonElement>) {
    if (evento.button !== 0) return;
    arraste.current = {
      id: evento.pointerId,
      inicialX: evento.clientX,
      inicialY: evento.clientY,
      x: posicao.x,
      y: posicao.y,
      moveu: false,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function mover(evento: PointerEvent<HTMLButtonElement>) {
    const dados = arraste.current;
    if (!dados || dados.id !== evento.pointerId) return;

    const deslocamentoX = evento.clientX - dados.inicialX;
    const deslocamentoY = evento.clientY - dados.inicialY;

    if (Math.abs(deslocamentoX) + Math.abs(deslocamentoY) > 7) {
      dados.moveu = true;
      setArrastando(true);
      setVisivel(false);
    }

    if (dados.moveu) {
      setPosicao({
        x: limitar(dados.x + deslocamentoX, 12, Math.max(12, window.innerWidth - 150)),
        y: limitar(dados.y + deslocamentoY, 12, Math.max(12, window.innerHeight - 175)),
      });
    }
  }

  function terminar(evento: PointerEvent<HTMLButtonElement>) {
    if (arraste.current?.id !== evento.pointerId) return;
    evitarClique.current = arraste.current.moveu;
    arraste.current = null;
    setArrastando(false);

    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  function moverTeclado(evento: KeyboardEvent<HTMLButtonElement>) {
    const movimentos: Record<string, Posicao> = {
      ArrowUp: { x: 0, y: -20 },
      ArrowDown: { x: 0, y: 20 },
      ArrowLeft: { x: -20, y: 0 },
      ArrowRight: { x: 20, y: 0 },
    };

    if (evento.key === "Home") {
      evento.preventDefault();
      setPosicao(posicaoInicial());
      return;
    }

    const deslocamento = movimentos[evento.key];
    if (!deslocamento) return;
    evento.preventDefault();
    setPosicao((atual) => ({
      x: limitar(atual.x + deslocamento.x, 12, Math.max(12, window.innerWidth - 150)),
      y: limitar(atual.y + deslocamento.y, 12, Math.max(12, window.innerHeight - 175)),
    }));
  }

  return (
    <div
      className={"eko-flutuante" + (arrastando ? " eko-flutuante--arrastando" : "")}
      style={{ left: posicao.x, top: posicao.y }}
      onMouseEnter={apontar}
      onMouseLeave={() => setVisivel(false)}
    >
      <div
        id="eko-balao"
        className={"eko-flutuante__balao" + (visivel && !arrastando ? " eko-flutuante__balao--ativo" : "")}
        role="tooltip"
        aria-hidden={!visivel}
      >
        <img src="/acessibilidade/eko/balao.svg" alt="" aria-hidden="true" />
        <span>{frase}</span>
      </div>
      <button
        type="button"
        className="eko-flutuante__botao"
        aria-label="Eko, mascote EcoCiente. Pressione Enter para ver uma frase. Use as setas para mover e Home para voltar ao canto."
        aria-describedby={visivel ? "eko-balao" : undefined}
        onPointerDown={iniciar}
        onPointerMove={mover}
        onPointerUp={terminar}
        onPointerCancel={terminar}
        onFocus={apontar}
        onBlur={() => setVisivel(false)}
        onKeyDown={moverTeclado}
        onClick={() => {
          if (evitarClique.current) {
            evitarClique.current = false;
            return;
          }
          sortear();
          setVisivel(true);
        }}
      >
        <img
          className="eko-flutuante__gif eko-mascote-imagem"
          src={gif}
          alt=""
          draggable={false}
          onError={(evento) => {
            if (!evento.currentTarget.src.endsWith(reserva)) evento.currentTarget.src = reserva;
          }}
        />
        <img
          className="eko-flutuante__imagem eko-mascote-imagem"
          src={imagem}
          alt=""
          draggable={false}
          onError={(evento) => {
            if (!evento.currentTarget.src.endsWith(reserva)) evento.currentTarget.src = reserva;
          }}
        />
      </button>
    </div>
  );
}
