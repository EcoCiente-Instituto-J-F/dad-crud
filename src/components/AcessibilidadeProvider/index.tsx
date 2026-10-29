import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";

import { AcessibilidadeContext } from "../../contexts/AcessibilidadeContext";
import type { PreferenciasAcessibilidade } from "../../contexts/AcessibilidadeContext";

const CHAVE = "ecociente-acessibilidade-v1";

const preferenciasPadrao: PreferenciasAcessibilidade = {
  _versao: 1,
  escalaFonte: 1,
  fonte: "padrao",
  linhas: 0,
  letras: 0,
  letrasDestacadas: false,
  destacarLinks: false,
  destacarTitulos: false,
  guiaLeitura: false,
  mascaraLeitura: false,
  lupaTexto: false,
  esconderDecorativas: false,
  pausarAnimacoes: false,
  escalaCinza: false,
  contraste: "padrao",
  nivelSaturacao: 0,
  modoDaltonico: 0,
};

type Acao =
  | { tipo: "atualizar"; campo: keyof PreferenciasAcessibilidade; valor: PreferenciasAcessibilidade[keyof PreferenciasAcessibilidade] }
  | { tipo: "restaurar" };

function validarPreferencias(valor: unknown): PreferenciasAcessibilidade {
  if (!valor || typeof valor !== "object") return preferenciasPadrao;

  const dados = valor as Partial<PreferenciasAcessibilidade>;
  if (dados._versao !== 1) return preferenciasPadrao;

  const booleano = (campo: keyof PreferenciasAcessibilidade) =>
    typeof dados[campo] === "boolean" ? Boolean(dados[campo]) : false;

  return {
    _versao: 1,
    escalaFonte: ([1, 1.125, 1.25, 1.375] as readonly unknown[]).includes(dados.escalaFonte)
      ? dados.escalaFonte as PreferenciasAcessibilidade["escalaFonte"] : 1,
    fonte: (["padrao", "arial", "verdana", "georgia"] as readonly unknown[]).includes(dados.fonte)
      ? dados.fonte as PreferenciasAcessibilidade["fonte"] : "padrao",
    linhas: ([0, 1, 2, 3] as readonly unknown[]).includes(dados.linhas)
      ? dados.linhas as PreferenciasAcessibilidade["linhas"] : 0,
    letras: ([0, 1, 2, 3] as readonly unknown[]).includes(dados.letras)
      ? dados.letras as PreferenciasAcessibilidade["letras"] : 0,
    letrasDestacadas: booleano("letrasDestacadas"),
    destacarLinks: booleano("destacarLinks"),
    destacarTitulos: booleano("destacarTitulos"),
    guiaLeitura: booleano("guiaLeitura"),
    mascaraLeitura: booleano("mascaraLeitura"),
    lupaTexto: booleano("lupaTexto"),
    esconderDecorativas: booleano("esconderDecorativas"),
    pausarAnimacoes: booleano("pausarAnimacoes"),
    escalaCinza: booleano("escalaCinza"),
    contraste: (["padrao", "claro", "escuro"] as readonly unknown[]).includes(dados.contraste)
      ? dados.contraste as PreferenciasAcessibilidade["contraste"] : "padrao",
    nivelSaturacao: ([0, 1, 2, 3] as readonly unknown[]).includes(dados.nivelSaturacao)
      ? dados.nivelSaturacao as PreferenciasAcessibilidade["nivelSaturacao"] : 0,
    modoDaltonico: ([0, 1, 2, 3] as readonly unknown[]).includes(dados.modoDaltonico)
      ? dados.modoDaltonico as PreferenciasAcessibilidade["modoDaltonico"] : 0,
  };
}

function carregar(): PreferenciasAcessibilidade {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? validarPreferencias(JSON.parse(salvo) as unknown) : preferenciasPadrao;
  } catch {
    return preferenciasPadrao;
  }
}

function reduzir(
  estado: PreferenciasAcessibilidade,
  acao: Acao,
): PreferenciasAcessibilidade {
  if (acao.tipo === "restaurar") return { ...preferenciasPadrao };
  if (acao.campo === "_versao") return estado;
  return validarPreferencias({ ...estado, [acao.campo]: acao.valor });
}

export default function AcessibilidadeProvider({ children }: { children: ReactNode }) {
  const [preferencias, dispatch] = useReducer(reduzir, undefined, carregar);

  const atualizar = useCallback(
    <K extends keyof PreferenciasAcessibilidade>(
      campo: K,
      valor: PreferenciasAcessibilidade[K],
    ) => dispatch({ tipo: "atualizar", campo, valor }),
    [],
  );

  const restaurar = useCallback(() => dispatch({ tipo: "restaurar" }), []);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.ecoAcessibilidade = "true";
    raiz.dataset.ecoContraste = preferencias.contraste;
    raiz.dataset.ecoFonte = preferencias.fonte;
    raiz.dataset.ecoEscala = String(preferencias.escalaFonte);
    raiz.dataset.ecoLinhas = String(preferencias.linhas);
    raiz.dataset.ecoLetras = String(preferencias.letras);
    raiz.dataset.ecoLetrasDestacadas = String(preferencias.letrasDestacadas);
    raiz.dataset.ecoLinks = String(preferencias.destacarLinks);
    raiz.dataset.ecoTitulos = String(preferencias.destacarTitulos);
    raiz.dataset.ecoEsconderDecorativas = String(preferencias.esconderDecorativas);
    raiz.dataset.ecoPausarAnimacoes = String(preferencias.pausarAnimacoes);
    raiz.dataset.ecoEscalaCinza = String(preferencias.escalaCinza);
    raiz.dataset.ecoSaturacao = String(preferencias.nivelSaturacao);
    raiz.dataset.ecoDaltonico = String(preferencias.modoDaltonico);
    raiz.style.setProperty("--eco-fator-fonte", String(preferencias.escalaFonte));
    raiz.style.setProperty("--eco-espaco-linhas", ["normal", "1.6", "1.85", "2.1"][preferencias.linhas]);
    raiz.style.setProperty("--eco-espaco-letras", ["normal", "0.025em", "0.06em", "0.1em"][preferencias.letras]);

    try {
      localStorage.setItem(CHAVE, JSON.stringify(preferencias));
    } catch {
      return;
    }
  }, [preferencias]);

  const contexto = useMemo(
    () => ({ preferencias, atualizar, restaurar }),
    [preferencias, atualizar, restaurar],
  );

  return (
    <AcessibilidadeContext.Provider value={contexto}>
      {children}
    </AcessibilidadeContext.Provider>
  );
}
