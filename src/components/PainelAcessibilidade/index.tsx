import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useLocation } from "react-router-dom";
import { Maximize2, Minimize2, X } from "lucide-react";
import { useAcessibilidade } from "../../hooks/useAcessibilidade";
import { useVLibras } from "../../hooks/useVLibras";
import type {
  ContrasteAcessivel,
  EscalaFonte,
  FonteAcessivel,
  NivelEspacamento,
} from "../../contexts/AcessibilidadeContext";

type CartaoProps = {
  codigo: string;
  titulo: string;
  estado: string;
  ativo: boolean;
  nivel?: number;
  onClick: () => void;
};

type Arraste = {
  id: number;
  inicioX: number;
  inicioY: number;
  esquerda: number;
  topo: number;
};

const escalas: readonly EscalaFonte[] = [1, 1.125, 1.25, 1.375];
const fontes: readonly FonteAcessivel[] = ["padrao", "arial", "verdana", "georgia"];
const nomesFonte = ["Original", "112%", "125%", "138%"];
const nomesTexto = ["Original", "Arial", "Verdana", "Georgia"];
const nomesEspacamento = ["Original", "Médio", "Grande", "Muito grande"];
const nomesSaturacao = ["Original", "Baixa", "Alta", "Escala de cinza"];
const nomesDaltonismo = ["Desativado", "Protanopia", "Deuteranopia", "Tritanopia"];
const icones = "/acessibilidade/icones/";

function CartaoRecurso({ codigo, titulo, estado, ativo, nivel, onClick }: CartaoProps) {
  return (
    <button
      type="button"
      className="eco-a11y-card"
      aria-pressed={ativo}
      aria-label={titulo + ". " + estado + (nivel !== undefined ? ". Clique para mudar de nível." : ". Clique para alternar.")}
      onClick={onClick}
    >
      <span className="eco-a11y-card__imagem" aria-hidden="true">
        <img src={icones + codigo + ".svg"} alt="" />
      </span>
      <strong>{titulo}</strong>
      <span className="eco-a11y-card__estado">{estado}</span>
      {nivel !== undefined && (
        <span className="eco-a11y-card__niveis" aria-hidden="true">
          {[1, 2, 3].map((numero) => (
            <i key={numero} className={numero <= nivel ? "ativo" : ""} />
          ))}
        </span>
      )}
    </button>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="eco-a11y-secao">
      <h3>{titulo}</h3>
      <div className="eco-a11y-grade">{children}</div>
    </section>
  );
}

export default function PainelAcessibilidade() {
  const { preferencias: p, atualizar, restaurar } = useAcessibilidade();
  const { estado: librasEstado, ativar: ativarLibras } = useVLibras();
  const [aberto, setAberto] = useState(false);
  const [ampliado, setAmpliado] = useState(false);
  const [guia, setGuia] = useState(false);
  const [lendo, setLendo] = useState(false);
  const [aviso, setAviso] = useState("");
  const [posicao, setPosicao] = useState<{ x: number; y: number } | null>(null);
  const arraste = useRef<Arraste | null>(null);
  const painelRef = useRef<HTMLElement>(null);
  const botaoAbrir = useRef<HTMLButtonElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const id = useId();
  const rota = useLocation();

  const fechar = useCallback(() => setAberto(false), []);
  const abrir = useCallback(() => setAberto(true), []);
  const anunciar = useCallback((mensagem: string) => setAviso(mensagem), []);

  useEffect(() => {
    if (!aberto) return;

    const focoAnterior = document.activeElement instanceof HTMLElement
      ? document.activeElement : botaoAbrir.current;
    botaoFechar.current?.focus();

    const fecharComTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        fechar();
      }
    };
    document.addEventListener("keydown", fecharComTecla);
    return () => {
      document.removeEventListener("keydown", fecharComTecla);
      if (focoAnterior?.isConnected) focoAnterior.focus();
    };
  }, [aberto, fechar]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setLendo(false);
  }, [rota.pathname]);

  useEffect(() => {
    const atalho = (evento: KeyboardEvent) => {
      if (!evento.shiftKey || evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const alvo = evento.target;
      if (
        alvo instanceof HTMLInputElement ||
        alvo instanceof HTMLTextAreaElement ||
        alvo instanceof HTMLSelectElement ||
        (alvo instanceof HTMLElement && alvo.isContentEditable)
      ) return;

      const tecla = evento.key.toLowerCase();
      if (tecla === "a") {
        evento.preventDefault();
        setAberto((anterior) => !anterior);
      } else if (tecla === "l") {
        evento.preventDefault();
        ativarLibras();
      } else if (tecla === "p") {
        const campo = document.querySelector<HTMLInputElement>('input[type="search"]');
        if (campo) {
          evento.preventDefault();
          campo.focus();
          campo.select();
        }
      }
    };
    document.addEventListener("keydown", atalho);
    return () => document.removeEventListener("keydown", atalho);
  }, [ativarLibras]);

  function ciclarFonte() {
    const proximo = (escalas.indexOf(p.escalaFonte) + 1) % escalas.length;
    atualizar("escalaFonte", escalas[proximo]);
    anunciar("Tamanho da fonte: " + nomesFonte[proximo] + ".");
  }

  function ciclarEstilo() {
    const proximo = (fontes.indexOf(p.fonte) + 1) % fontes.length;
    atualizar("fonte", fontes[proximo]);
    anunciar("Estilo de texto: " + nomesTexto[proximo] + ".");
  }

  function ciclarNivel(
    campo: "linhas" | "letras" | "nivelSaturacao" | "modoDaltonico",
    rotulos: readonly string[],
    nome: string,
  ) {
    const proximo = ((p[campo] + 1) % 4) as NivelEspacamento;
    atualizar(campo, proximo);
    anunciar(nome + ": " + rotulos[proximo] + ".");
  }

  function alternar(
    campo:
      | "letrasDestacadas" | "destacarLinks" | "destacarTitulos"
      | "mascaraLeitura" | "guiaLeitura" | "lupaTexto"
      | "esconderDecorativas" | "pausarAnimacoes",
    nome: string,
  ) {
    const proximo = !p[campo];
    atualizar(campo, proximo);
    anunciar(nome + (proximo ? " ativado." : " desativado."));
  }

  function ciclarContraste() {
    const opcoes: readonly ContrasteAcessivel[] = ["padrao", "escuro", "claro"];
    const proximo = opcoes[(opcoes.indexOf(p.contraste) + 1) % opcoes.length];
    atualizar("contraste", proximo);
    anunciar("Contraste: " + ({ padrao: "Original", escuro: "Escuro", claro: "Claro" }[proximo]) + ".");
  }

  function alternarLeitura() {
    if (lendo) {
      window.speechSynthesis?.cancel();
      setLendo(false);
      anunciar("Leitura interrompida.");
      return;
    }
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      anunciar("Seu navegador não oferece leitura em voz alta.");
      return;
    }

    const principal = document.querySelector<HTMLElement>("main.conteudo");
    if (!principal) {
      anunciar("Conteúdo da página não encontrado.");
      return;
    }
    const copia = principal.cloneNode(true) as HTMLElement;
    copia.querySelectorAll("button, input, textarea, select, script, style, [aria-hidden='true']").forEach((elemento) => elemento.remove());
    const texto = (copia.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!texto) {
      anunciar("Não há texto disponível para leitura.");
      return;
    }
    const fala = new SpeechSynthesisUtterance(texto.slice(0, 12000));
    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.onend = () => setLendo(false);
    fala.onerror = () => {
      setLendo(false);
      anunciar("A leitura foi interrompida ou não está disponível.");
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fala);
    setLendo(true);
    anunciar("Leitura iniciada. Ative novamente para interromper.");
  }

  function abrirLibras() {
    ativarLibras();
    anunciar(librasEstado === "pronto" ? "Alternando tradutor de Libras." : "Carregando tradutor de Libras...");
  }

  function iniciarArraste(evento: PointerEvent<HTMLElement>) {
    if (evento.button !== 0 || (evento.target instanceof HTMLElement && evento.target.closest("button"))) {
      return;
    }
    const retangulo = painelRef.current?.getBoundingClientRect();
    if (!retangulo) return;

    arraste.current = {
      id: evento.pointerId,
      inicioX: evento.clientX,
      inicioY: evento.clientY,
      esquerda: retangulo.left,
      topo: retangulo.top,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function moverPainel(evento: PointerEvent<HTMLElement>) {
    const dados = arraste.current;
    if (!dados || dados.id !== evento.pointerId) return;
    const largura = painelRef.current?.offsetWidth ?? 500;
    const altura = painelRef.current?.offsetHeight ?? 690;
    setPosicao({
      x: Math.max(8, Math.min(window.innerWidth - largura - 8, dados.esquerda + evento.clientX - dados.inicioX)),
      y: Math.max(8, Math.min(window.innerHeight - altura - 8, dados.topo + evento.clientY - dados.inicioY)),
    });
  }

  function terminarArraste(evento: PointerEvent<HTMLElement>) {
    if (arraste.current?.id !== evento.pointerId) return;
    arraste.current = null;
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  const rotuloContraste = p.contraste === "padrao" ? "Desativado" : p.contraste === "escuro" ? "Escuro" : "Claro";
  const booleano = (ativo: boolean) => ativo ? "Ativado" : "Desativado";

  return (
    <div className="eco-a11y-raiz">
      <nav className="eco-a11y-atalhos" aria-label="Atalhos de acessibilidade">
        <button
          ref={botaoAbrir}
          type="button"
          className="eco-a11y-atalho"
          aria-label={aberto ? "Fechar recursos assistivos" : "Abrir recursos assistivos"}
          aria-controls={id + "-painel"}
          aria-expanded={aberto}
          onClick={() => setAberto((anterior) => !anterior)}
        >
          <span className="eco-a11y-atalho__icone" aria-hidden="true">
            <img src={icones + "botao-acessibilidade.svg"} alt="" />
          </span>
          <span className="eco-a11y-atalho__nome">Recursos assistivos</span>
        </button>
        <button
          type="button"
          className="eco-a11y-atalho"
          aria-label="Abrir ou fechar tradução para Libras"
          onClick={abrirLibras}
        >
          <span className="eco-a11y-atalho__icone" aria-hidden="true">
            <img src={icones + "botao-libras.svg"} alt="" />
          </span>
          <span className="eco-a11y-atalho__nome">Acessível em Libras</span>
        </button>
      </nav>

      <aside
        ref={painelRef}
        id={id + "-painel"}
        className={"eco-a11y-painel" + (aberto ? " eco-a11y-painel--aberto" : "") + (ampliado ? " eco-a11y-painel--ampliado" : "") + (posicao ? " eco-a11y-painel--arrastado" : "")}
        aria-labelledby={id + "-titulo"}
        aria-hidden={!aberto}
        inert={!aberto}
        style={posicao ? { left: posicao.x, top: posicao.y, right: "auto" } : undefined}
      >
        <header
          className="eco-a11y-cabecalho"
          onPointerDown={iniciarArraste}
          onPointerMove={moverPainel}
          onPointerUp={terminarArraste}
          onPointerCancel={terminarArraste}
          title="Arraste para mover o painel"
        >
          <h2 id={id + "-titulo"}>Recursos assistivos</h2>
          <div className="eco-a11y-cabecalho__controles">
            <button
              type="button"
              title={ampliado ? "Reduzir painel" : "Ampliar painel"}
              aria-label={ampliado ? "Reduzir painel" : "Ampliar painel"}
              className="eco-a11y-fechar"
              onClick={() => { setAmpliado((valor) => !valor); setPosicao(null); }}
            >
              {ampliado ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
            </button>
            <button
              ref={botaoFechar}
              type="button"
              className="eco-a11y-fechar"
              aria-label="Fechar recursos assistivos"
              onClick={fechar}
            >
              <X size={25} aria-hidden="true" />
            </button>
          </div>
        </header>
        <div className="eco-a11y-conteudo">
          <p className="eco-a11y-status" role="status" aria-live="polite">{aviso}</p>
          {guia ? (
            <section className="eco-a11y-guia">
              <h3>Como usar os recursos</h3>
              <p>Clique nos cartões para ativar/desativar ou percorrer níveis. Os indicadores amarelos mostram o nível atual.</p>
              <p>Você pode usar <kbd>Shift</kbd> + <kbd>A</kbd> para abrir o painel, <kbd>Shift</kbd> + <kbd>L</kbd> para Libras e <kbd>Shift</kbd> + <kbd>P</kbd> para pesquisar.</p>
              <p>O painel mantém suas preferências neste navegador. A leitura de página depende da voz disponível, e o VLibras é um serviço externo.</p>
              <button type="button" className="eco-a11y-rodape__acao" onClick={() => setGuia(false)}>
                Voltar aos recursos
              </button>
            </section>
          ) : (
            <>
              <Secao titulo="Libras">
                <CartaoRecurso codigo="tradutor-libras" titulo="Tradutor de Libras"
                  estado={librasEstado === "carregando" ? "Carregando..." : librasEstado === "erro" ? "Indisponível" : "Abrir ou fechar"}
                  ativo={librasEstado === "pronto"} onClick={abrirLibras} />
              </Secao>
              <Secao titulo="Controle de fonte">
                <CartaoRecurso codigo="tamanho-fonte" titulo="Tamanho da fonte"
                  estado={nomesFonte[escalas.indexOf(p.escalaFonte)]} ativo={p.escalaFonte !== 1}
                  nivel={escalas.indexOf(p.escalaFonte)} onClick={ciclarFonte} />
                <CartaoRecurso codigo="estilo-texto" titulo="Estilo de texto"
                  estado={nomesTexto[fontes.indexOf(p.fonte)]} ativo={p.fonte !== "padrao"}
                  nivel={fontes.indexOf(p.fonte)} onClick={ciclarEstilo} />
                <CartaoRecurso codigo="letras-destacadas" titulo="Letras destacadas"
                  estado={booleano(p.letrasDestacadas)} ativo={p.letrasDestacadas}
                  onClick={() => alternar("letrasDestacadas", "Letras destacadas")} />
                <CartaoRecurso codigo="espaco-linhas" titulo="Espaço entre linhas"
                  estado={nomesEspacamento[p.linhas]} ativo={p.linhas !== 0}
                  nivel={p.linhas} onClick={() => ciclarNivel("linhas", nomesEspacamento, "Espaço entre linhas")} />
                <CartaoRecurso codigo="espaco-letras" titulo="Espaço entre letras"
                  estado={nomesEspacamento[p.letras]} ativo={p.letras !== 0}
                  nivel={p.letras} onClick={() => ciclarNivel("letras", nomesEspacamento, "Espaço entre letras")} />
              </Secao>
              <Secao titulo="Navegação e leitura">
                <CartaoRecurso codigo="leitor-sites" titulo="Leitor de sites"
                  estado={lendo ? "Parar leitura" : "Iniciar leitura"}
                  ativo={lendo} onClick={alternarLeitura} />
                <CartaoRecurso codigo="mascara-leitura" titulo="Máscara de leitura"
                  estado={p.mascaraLeitura ? "Ativada" : "Desativada"} ativo={p.mascaraLeitura}
                  onClick={() => alternar("mascaraLeitura", "Máscara de leitura")} />
                <CartaoRecurso codigo="guia-leitura" titulo="Guia de leitura"
                  estado={p.guiaLeitura ? "Ativada" : "Desativada"} ativo={p.guiaLeitura}
                  onClick={() => alternar("guiaLeitura", "Guia de leitura")} />
                <CartaoRecurso codigo="destacar-links" titulo="Destacar links"
                  estado={booleano(p.destacarLinks)} ativo={p.destacarLinks}
                  onClick={() => alternar("destacarLinks", "Destaque de links")} />
                <CartaoRecurso codigo="lupa-conteudo" titulo="Lupa de conteúdo"
                  estado={p.lupaTexto ? "Ativada" : "Desativada"} ativo={p.lupaTexto}
                  onClick={() => alternar("lupaTexto", "Lupa de conteúdo")} />
                <CartaoRecurso codigo="destacar-cabecalhos" titulo="Destacar cabeçalhos"
                  estado={booleano(p.destacarTitulos)} ativo={p.destacarTitulos}
                  onClick={() => alternar("destacarTitulos", "Destaque de cabeçalhos")} />
                <CartaoRecurso codigo="esconder-imagens" titulo="Esconder imagens"
                  estado={booleano(p.esconderDecorativas)} ativo={p.esconderDecorativas}
                  onClick={() => alternar("esconderDecorativas", "Ocultar imagens decorativas")} />
                <CartaoRecurso codigo="pausar-animacoes" titulo="Pausar animações"
                  estado={booleano(p.pausarAnimacoes)} ativo={p.pausarAnimacoes}
                  onClick={() => alternar("pausarAnimacoes", "Pausar animações")} />
              </Secao>
              <Secao titulo="Controle de cor">
                <CartaoRecurso codigo="contraste" titulo="Contraste de cor" estado={rotuloContraste}
                  ativo={p.contraste !== "padrao"} onClick={ciclarContraste} />
                <CartaoRecurso codigo="saturacao" titulo="Saturação"
                  estado={nomesSaturacao[p.nivelSaturacao]} ativo={p.nivelSaturacao !== 0}
                  nivel={p.nivelSaturacao} onClick={() => ciclarNivel("nivelSaturacao", nomesSaturacao, "Saturação")} />
                <CartaoRecurso codigo="modo-daltonico" titulo="Modo daltônico"
                  estado={nomesDaltonismo[p.modoDaltonico]} ativo={p.modoDaltonico !== 0}
                  nivel={p.modoDaltonico} onClick={() => ciclarNivel("modoDaltonico", nomesDaltonismo, "Modo daltônico")} />
              </Secao>

              <footer className="eco-a11y-rodape">
                <button type="button" className="eco-a11y-rodape__acao" onClick={() => setGuia(true)}>
                  Conheça os recursos acessíveis
                </button>
                <button type="button" className="eco-a11y-rodape__acao eco-a11y-rodape__acao--primaria" onClick={() => {
                  restaurar();
                  window.speechSynthesis?.cancel();
                  setLendo(false);
                  anunciar("Configurações de acessibilidade restauradas.");
                }}>
                  Restaurar configurações
                </button>
              </footer>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
