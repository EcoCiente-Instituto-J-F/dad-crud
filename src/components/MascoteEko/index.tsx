import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

const frases = [
  "Oi! Que bom ter você por aqui! 🌱",
  "Pequenas atitudes fazem um mundo melhor!",
  "Vamos cultivar boas ideias hoje?",
  "Você faz a diferença, sabia? 💚",
  "Um planeta melhor começa com a gente!",
  "Seu trabalho ajuda a transformar o futuro.",
  "Cada coleta é um passo por um mundo mais verde!",
  "Continue espalhando sustentabilidade!",
  "Hoje é um ótimo dia para fazer o bem!",
  "A natureza agradece seu cuidado! 🌿",
  "Juntos, fazemos o EcoCiente crescer!",
  "Reciclar é um carinho com o planeta!",
];

type Posicao = { x: number; y: number };
type Arraste = {
  id: number;
  x: number;
  y: number;
  inicioX: number;
  inicioY: number;
  moveu: boolean;
};

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(valor, maximo));
}

function posicaoInicial(): Posicao {
  return {
    x: Math.max(12, window.innerWidth - 165),
    y: Math.max(12, window.innerHeight - 190),
  };
}

export default function MascoteEko() {
  const [posicao, setPosicao] = useState<Posicao>(posicaoInicial);
  const [frase, setFrase] = useState(frases[0]);
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const arraste = useRef<Arraste | null>(null);
  const ignorarClique = useRef(false);

  useEffect(() => {
    const ajustar = () => {
      setPosicao((anterior) => ({
        x: limitar(anterior.x, 12, Math.max(12, window.innerWidth - 140)),
        y: limitar(anterior.y, 12, Math.max(12, window.innerHeight - 155)),
      }));
    };
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, []);

  function sortearFrase() {
    const possibilidades = frases.filter((item) => item !== frase);
    setFrase(possibilidades[Math.floor(Math.random() * possibilidades.length)]);
  }

  function iniciarArraste(evento: PointerEvent<HTMLButtonElement>) {
    if (evento.button !== 0) return;

    arraste.current = {
      id: evento.pointerId,
      x: posicao.x,
      y: posicao.y,
      inicioX: evento.clientX,
      inicioY: evento.clientY,
      moveu: false,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function mover(evento: PointerEvent<HTMLButtonElement>) {
    const dados = arraste.current;
    if (!dados || dados.id !== evento.pointerId) return;

    const diferencaX = evento.clientX - dados.inicioX;
    const diferencaY = evento.clientY - dados.inicioY;

    if (Math.abs(diferencaX) + Math.abs(diferencaY) > 7) {
      dados.moveu = true;
      setMostrarMensagem(false);
    }

    if (!dados.moveu) return;

    setPosicao({
      x: limitar(dados.x + diferencaX, 12, Math.max(12, window.innerWidth - 140)),
      y: limitar(dados.y + diferencaY, 12, Math.max(12, window.innerHeight - 155)),
    });
  }

  function finalizar(evento: PointerEvent<HTMLButtonElement>) {
    if (!arraste.current || arraste.current.id !== evento.pointerId) return;
    ignorarClique.current = arraste.current.moveu;
    arraste.current = null;
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  function moverPorTeclado(evento: KeyboardEvent<HTMLButtonElement>) {
    const deslocamentos: Record<string, Posicao> = {
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
    const deslocamento = deslocamentos[evento.key];
    if (!deslocamento) return;

    evento.preventDefault();
    setPosicao((atual) => ({
      x: limitar(atual.x + deslocamento.x, 12, Math.max(12, window.innerWidth - 140)),
      y: limitar(atual.y + deslocamento.y, 12, Math.max(12, window.innerHeight - 155)),
    }));
  }

  return (
    <div
      className="eko-flutuante"
      style={{ left: posicao.x, top: posicao.y }}
      onMouseEnter={sortearFrase}
      onMouseLeave={() => setMostrarMensagem(false)}
    >
      <span
        id="eko-mensagem"
        role="tooltip"
        className={"eko-flutuante__balao" + (mostrarMensagem ? " eko-flutuante__balao--ativo" : "")}
      >
        {frase}
      </span>
      <button
        type="button"
        className="eko-flutuante__botao"
        aria-label="Eko, mascote do EcoCiente. Pressione Enter para ver uma frase. Use as setas para mover e Home para reposicionar."
        aria-describedby="eko-mensagem"
        onPointerDown={iniciarArraste}
        onPointerMove={mover}
        onPointerUp={finalizar}
        onPointerCancel={finalizar}
        onKeyDown={moverPorTeclado}
        onFocus={sortearFrase}
        onClick={() => {
          if (ignorarClique.current) {
            ignorarClique.current = false;
            return;
          }
          sortearFrase();
          setMostrarMensagem((anterior) => !anterior);
        }}
      >
        <img className="eko-mascote-imagem" src="/eko-mascote.svg" alt="" draggable={false} />
      </button>
    </div>
  );
}
