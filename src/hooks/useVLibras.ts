import { useCallback, useState } from "react";

type EstadoVLibras = "inativo" | "carregando" | "pronto" | "erro";
type JanelaVLibras = Window & {
  VLibras?: { Widget: new (endereco: string) => unknown };
};

export function useVLibras() {
  const [estado, setEstado] = useState<EstadoVLibras>("inativo");

  const ativar = useCallback(() => {
    const botao = document.querySelector<HTMLElement>("[vw-access-button]");
    if (botao && estado === "pronto") {
      botao.click();
      return;
    }

    if (estado === "carregando") return;

    setEstado("carregando");

    if (!document.querySelector("[vw]")) {
      const area = document.createElement("div");
      area.setAttribute("vw", "");
      area.className = "enabled";

      const acionador = document.createElement("div");
      acionador.setAttribute("vw-access-button", "");
      acionador.className = "active";

      const conteudo = document.createElement("div");
      conteudo.setAttribute("vw-plugin-wrapper", "");

      const topo = document.createElement("div");
      topo.className = "vw-plugin-top-wrapper";
      conteudo.appendChild(topo);
      area.append(acionador, conteudo);
      document.body.appendChild(area);
    }

    const iniciar = () => {
      const janela = window as JanelaVLibras;
      if (!janela.VLibras?.Widget) {
        setEstado("erro");
        return;
      }

      if (document.body.dataset.ecoVlibrasInicializado !== "true") {
        new janela.VLibras.Widget("https://vlibras.gov.br/app");
        document.body.dataset.ecoVlibrasInicializado = "true";
      }
      setEstado("pronto");
    };

    if ((window as JanelaVLibras).VLibras?.Widget) {
      iniciar();
      return;
    }

    const existente = document.querySelector<HTMLScriptElement>(
      'script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]',
    );

    if (existente) {
      existente.addEventListener("load", iniciar, { once: true });
      existente.addEventListener("error", () => setEstado("erro"), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = iniciar;
    script.onerror = () => {
      script.remove();
      setEstado("erro");
    };
    document.head.appendChild(script);
  }, [estado]);

  return { estado, ativar };
}
