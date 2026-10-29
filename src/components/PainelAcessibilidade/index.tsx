import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Accessibility, ALargeSmall, BookOpen, Check, Contrast, Eye,
  EyeOff, Focus, Heading, Highlighter, Languages, Link2,
  Maximize2, Minimize2, Moon, MousePointer2, Pause,
  RotateCcw, ScanText, Type, Volume2, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

import Modal from "../Modal";
import { useAcessibilidade } from "../../hooks/useAcessibilidade";
import { useVLibras } from "../../hooks/useVLibras";
import type {
  ContrasteAcessivel, EscalaFonte, FonteAcessivel, NivelEspacamento,
} from "../../contexts/AcessibilidadeContext";

type Aba = "texto" | "leitura" | "cores" | "libras";

const abas: readonly { id: Aba; titulo: string; icone: LucideIcon }[] = [
  { id: "texto", titulo: "Texto", icone: Type },
  { id: "leitura", titulo: "Leitura", icone: BookOpen },
  { id: "cores", titulo: "Cores", icone: Contrast },
  { id: "libras", titulo: "Libras", icone: Languages },
];

function CardRecurso({
  titulo, descricao, icone: Icone, ativo, onClick,
}: {
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={"eco-recurso" + (ativo ? " eco-recurso--ativo" : "")}
      aria-pressed={ativo}
      onClick={onClick}
    >
      <Icone size={22} aria-hidden="true" />
      <strong>{titulo}</strong>
      <span>{descricao}</span>
      {ativo && <Check size={17} className="eco-recurso__check" aria-hidden="true" />}
    </button>
  );
}

export default function PainelAcessibilidade() {
  const { preferencias: p, atualizar, restaurar } = useAcessibilidade();
  const { estado: estadoLibras, ativar: ativarLibras } = useVLibras();
  const [aberto, setAberto] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [aba, setAba] = useState<Aba>("texto");
  const [confirmarReset, setConfirmarReset] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [lendo, setLendo] = useState(false);
  const id = useId();
  const botaoAbrir = useRef<HTMLButtonElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const listaAbas = useRef<HTMLDivElement>(null);
  const rota = useLocation();

  useEffect(() => {
    if (!aberto) return;

    botaoFechar.current?.focus();
    const tecla = (evento: globalThis.KeyboardEvent) => {
      if (evento.key === "Escape" && !document.querySelector("dialog[open]")) {
        evento.preventDefault();
        setAberto(false);
      }
    };
    document.addEventListener("keydown", tecla);

    return () => {
      document.removeEventListener("keydown", tecla);
      botaoAbrir.current?.focus();
    };
  }, [aberto]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setLendo(false);
  }, [rota.pathname]);

  function alternarLeitura() {
    if (lendo) {
      window.speechSynthesis?.cancel();
      setLendo(false);
      setMensagem("Leitura interrompida.");
      return;
    }

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setMensagem("Este navegador não oferece leitura em voz alta.");
      return;
    }

    const texto = document.querySelector<HTMLElement>("main.conteudo")?.innerText.trim() ?? "";
    if (!texto) {
      setMensagem("Não há conteúdo disponível para ler nesta página.");
      return;
    }

    const fala = new SpeechSynthesisUtterance(texto.slice(0, 4500));
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.onend = () => setLendo(false);
    fala.onerror = () => {
      setLendo(false);
      setMensagem("A leitura em voz alta foi interrompida pelo navegador.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fala);
    setLendo(true);
    setMensagem("Lendo o conteúdo da página. Você pode interromper a qualquer momento.");
  }

  function navegarAbas(evento: KeyboardEvent<HTMLButtonElement>, atual: Aba) {
    const indice = abas.findIndex((item) => item.id === atual);
    let proximo = indice;

    if (evento.key === "ArrowRight") proximo = (indice + 1) % abas.length;
    else if (evento.key === "ArrowLeft") proximo = (indice + abas.length - 1) % abas.length;
    else if (evento.key === "Home") proximo = 0;
    else if (evento.key === "End") proximo = abas.length - 1;
    else return;

    evento.preventDefault();
    setAba(abas[proximo].id);
    listaAbas.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[proximo]?.focus();
  }

  function definirEscala(valor: EscalaFonte) {
    atualizar("escalaFonte", valor);
    setMensagem("Tamanho do texto ajustado para " + Math.round(valor * 100) + "%.");
  }

  function definirContraste(valor: ContrasteAcessivel) {
    atualizar("contraste", valor);
    setMensagem(valor === "padrao" ? "Contraste padrão restaurado." : "Contraste ajustado.");
  }

  const tituloAba = abas.find((item) => item.id === aba)?.titulo ?? "Recursos";

  return (
    <>
      <div className="eco-atalho-acessibilidade">
        <button
          ref={botaoAbrir}
          type="button"
          className="eco-atalho-acessibilidade__botao"
          aria-label={aberto ? "Fechar painel de acessibilidade" : "Abrir painel de acessibilidade"}
          aria-controls={id + "-painel"}
          aria-expanded={aberto}
          onClick={() => setAberto((anterior) => !anterior)}
        >
          <Accessibility size={27} aria-hidden="true" />
          <span className="somente-leitor">Recursos de acessibilidade</span>
        </button>
        {!aberto && <span className="eco-atalho-acessibilidade__dica" aria-hidden="true">Acessibilidade</span>}
      </div>

      <section
        id={id + "-painel"}
        className={"eco-painel-acessibilidade" + (expandido ? " eco-painel-acessibilidade--ampliado" : "")}
        aria-label="Painel de acessibilidade"
        hidden={!aberto}
      >
        <div className="eco-painel-acessibilidade__cabecalho">
          <span className="eco-painel-acessibilidade__icone"><Accessibility size={23} aria-hidden="true" /></span>
          <div>
            <h2>Recursos assistivos</h2>
            <p>Personalize sua experiência no EcoCiente.</p>
          </div>
          <button
            type="button"
            className="eco-painel-acessibilidade__controle"
            aria-label={expandido ? "Reduzir painel" : "Ampliar painel"}
            title={expandido ? "Reduzir painel" : "Ampliar painel"}
            onClick={() => setExpandido((anterior) => !anterior)}
          >
            {expandido ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            ref={botaoFechar}
            type="button"
            className="eco-painel-acessibilidade__controle"
            aria-label="Fechar painel de acessibilidade"
            onClick={() => setAberto(false)}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="eco-painel-acessibilidade__abas" ref={listaAbas} role="tablist" aria-label="Categorias de recursos">
          {abas.map((item) => {
            const Icone = item.icone;
            return (
              <button
                key={item.id}
                type="button"
                id={id + "-aba-" + item.id}
                role="tab"
                aria-selected={aba === item.id}
                aria-controls={id + "-conteudo"}
                tabIndex={aba === item.id ? 0 : -1}
                onKeyDown={(evento) => navegarAbas(evento, item.id)}
                onClick={() => setAba(item.id)}
              >
                <Icone size={17} aria-hidden="true" />
                {item.titulo}
              </button>
            );
          })}
        </div>

        <div
          className="eco-painel-acessibilidade__corpo"
          role="tabpanel"
          id={id + "-conteudo"}
          aria-labelledby={id + "-aba-" + aba}
          tabIndex={0}
        >
          <h3>{tituloAba}</h3>

          {aba === "texto" && (
            <div className="eco-painel-acessibilidade__conteudo">
              <div className="eco-ajuste">
                <div className="eco-ajuste__titulo">
                  <ALargeSmall size={21} aria-hidden="true" />
                  <strong>Tamanho do texto</strong>
                </div>
                <div className="eco-ajuste__linha">
                  <button
                    type="button"
                    aria-label="Diminuir tamanho do texto"
                    disabled={p.escalaFonte === 1}
                    onClick={() => {
                      const valores: EscalaFonte[] = [1, 1.125, 1.25, 1.375];
                      definirEscala(valores[Math.max(0, valores.indexOf(p.escalaFonte) - 1)]);
                    }}
                  >A−</button>
                  <output aria-label="Escala atual da fonte">{Math.round(p.escalaFonte * 100)}%</output>
                  <button
                    type="button"
                    aria-label="Aumentar tamanho do texto"
                    disabled={p.escalaFonte === 1.375}
                    onClick={() => {
                      const valores: EscalaFonte[] = [1, 1.125, 1.25, 1.375];
                      definirEscala(valores[Math.min(valores.length - 1, valores.indexOf(p.escalaFonte) + 1)]);
                    }}
                  >A+</button>
                </div>
              </div>

              <div className="eco-ajuste">
                <label htmlFor={id + "-fonte"}>Estilo de texto</label>
                <select
                  id={id + "-fonte"}
                  value={p.fonte}
                  onChange={(evento) => atualizar("fonte", evento.target.value as FonteAcessivel)}
                >
                  <option value="padrao">Original</option>
                  <option value="arial">Arial</option>
                  <option value="verdana">Verdana</option>
                  <option value="georgia">Georgia</option>
                </select>
              </div>

              <div className="eco-ajuste">
                <span id={id + "-linhas"}>Espaçamento entre linhas</span>
                <div className="eco-ajuste__opcoes" role="group" aria-labelledby={id + "-linhas"}>
                  {(["Original", "Médio", "Grande", "Muito grande"] as const).map((rotulo, indice) => (
                    <button
                      key={rotulo}
                      type="button"
                      aria-pressed={p.linhas === indice}
                      onClick={() => atualizar("linhas", indice as NivelEspacamento)}
                    >{rotulo}</button>
                  ))}
                </div>
              </div>

              <div className="eco-ajuste">
                <span id={id + "-letras"}>Espaçamento entre letras</span>
                <div className="eco-ajuste__opcoes" role="group" aria-labelledby={id + "-letras"}>
                  {(["Original", "Médio", "Grande", "Muito grande"] as const).map((rotulo, indice) => (
                    <button
                      key={rotulo}
                      type="button"
                      aria-pressed={p.letras === indice}
                      onClick={() => atualizar("letras", indice as NivelEspacamento)}
                    >{rotulo}</button>
                  ))}
                </div>
              </div>

              <div className="eco-painel-acessibilidade__grade">
                <CardRecurso
                  titulo="Letras destacadas"
                  descricao="Realça a escrita em negrito."
                  icone={Highlighter}
                  ativo={p.letrasDestacadas}
                  onClick={() => atualizar("letrasDestacadas", !p.letrasDestacadas)}
                />
                <CardRecurso
                  titulo="Destacar títulos"
                  descricao="Facilita localizar seções."
                  icone={Heading}
                  ativo={p.destacarTitulos}
                  onClick={() => atualizar("destacarTitulos", !p.destacarTitulos)}
                />
              </div>
            </div>
          )}

          {aba === "leitura" && (
            <div className="eco-painel-acessibilidade__conteudo">
              <button
                type="button"
                className="eco-voz-botao"
                aria-pressed={lendo}
                onClick={alternarLeitura}
              >
                {lendo ? <Pause size={20} /> : <Volume2 size={20} />}
                {lendo ? "Parar leitura da página" : "Ler conteúdo da página"}
              </button>
              <p className="eco-painel-acessibilidade__nota">
                Utiliza a voz disponível no seu navegador. Não substitui um leitor de tela.
              </p>
              <div className="eco-painel-acessibilidade__grade">
                <CardRecurso titulo="Guia de leitura" descricao="Acompanha a posição do cursor." icone={Focus} ativo={p.guiaLeitura} onClick={() => atualizar("guiaLeitura", !p.guiaLeitura)} />
                <CardRecurso titulo="Máscara de leitura" descricao="Atenua o entorno do texto." icone={ScanText} ativo={p.mascaraLeitura} onClick={() => atualizar("mascaraLeitura", !p.mascaraLeitura)} />
                <CardRecurso titulo="Lupa de texto" descricao="Amplia trechos ao apontar." icone={Eye} ativo={p.lupaTexto} onClick={() => atualizar("lupaTexto", !p.lupaTexto)} />
                <CardRecurso titulo="Destacar links" descricao="Sublinha os atalhos da página." icone={Link2} ativo={p.destacarLinks} onClick={() => atualizar("destacarLinks", !p.destacarLinks)} />
                <CardRecurso titulo="Ocultar decoração" descricao="Oculta imagens sem texto alternativo." icone={EyeOff} ativo={p.esconderDecorativas} onClick={() => atualizar("esconderDecorativas", !p.esconderDecorativas)} />
                <CardRecurso titulo="Pausar animações" descricao="Reduz os movimentos da interface." icone={Pause} ativo={p.pausarAnimacoes} onClick={() => atualizar("pausarAnimacoes", !p.pausarAnimacoes)} />
              </div>
            </div>
          )}

          {aba === "cores" && (
            <div className="eco-painel-acessibilidade__conteudo">
              <fieldset className="eco-contraste-opcoes">
                <legend>Contraste da interface</legend>
                {([
                  { valor: "padrao", titulo: "Padrão", icone: Eye },
                  { valor: "claro", titulo: "Alto contraste claro", icone: Contrast },
                  { valor: "escuro", titulo: "Alto contraste escuro", icone: Moon },
                ] as const).map((item) => {
                  const Icone = item.icone;
                  return (
                    <label key={item.valor}>
                      <input
                        type="radio"
                        name={id + "-contraste"}
                        value={item.valor}
                        checked={p.contraste === item.valor}
                        onChange={() => definirContraste(item.valor)}
                      />
                      <Icone size={19} aria-hidden="true" />
                      <span>{item.titulo}</span>
                    </label>
                  );
                })}
              </fieldset>
              <div className="eco-painel-acessibilidade__grade">
                <CardRecurso titulo="Escala de cinza" descricao="Remove as cores da página." icone={Contrast} ativo={p.escalaCinza} onClick={() => atualizar("escalaCinza", !p.escalaCinza)} />
                <CardRecurso titulo="Destacar links" descricao="Realça a navegação." icone={MousePointer2} ativo={p.destacarLinks} onClick={() => atualizar("destacarLinks", !p.destacarLinks)} />
              </div>
              <p className="eco-painel-acessibilidade__nota">
                Cores e filtros não substituem uma interface que já tenha contraste acessível.
              </p>
            </div>
          )}

          {aba === "libras" && (
            <div className="eco-painel-acessibilidade__conteudo eco-libras">
              <Languages size={34} aria-hidden="true" />
              <h4>Tradução para Libras</h4>
              <p>O VLibras é um serviço externo. Ele só será carregado quando você solicitar.</p>
              <button
                type="button"
                className="eco-voz-botao"
                onClick={ativarLibras}
                disabled={estadoLibras === "carregando"}
              >
                <Languages size={19} aria-hidden="true" />
                {estadoLibras === "carregando" ? "Carregando VLibras..." :
                  estadoLibras === "pronto" ? "Abrir ou fechar VLibras" : "Ativar VLibras"}
              </button>
              <p role="status" aria-live="polite">
                {estadoLibras === "pronto" ? "VLibras carregado. Use o botão oficial para iniciar a tradução." :
                  estadoLibras === "erro" ? "Não foi possível carregar o VLibras. Tente novamente." : ""}
              </p>
            </div>
          )}
        </div>

        <div className="eco-painel-acessibilidade__rodape">
          <p role="status" aria-live="polite" className="eco-painel-acessibilidade__status">{mensagem}</p>
          <button type="button" className="eco-restaurar" onClick={() => setConfirmarReset(true)}>
            <RotateCcw size={17} aria-hidden="true" />
            Restaurar configurações
          </button>
        </div>
      </section>

      <Modal
        aberto={confirmarReset}
        titulo="Restaurar acessibilidade"
        onFechar={() => setConfirmarReset(false)}
      >
        <p>Deseja restaurar todas as preferências de acessibilidade ao padrão?</p>
        <div className="formulario-acoes">
          <button type="button" className="botao" onClick={() => setConfirmarReset(false)}>Cancelar</button>
          <button
            type="button"
            className="botao botao--primario"
            onClick={() => {
              restaurar();
              window.speechSynthesis?.cancel();
              setLendo(false);
              setConfirmarReset(false);
              setMensagem("Preferências restauradas com sucesso.");
            }}
          >
            Restaurar
          </button>
        </div>
      </Modal>
    </>
  );
}
