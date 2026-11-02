import { createContext } from "react";

export type EscalaFonte = 1 | 1.125 | 1.25 | 1.375;
export type FonteAcessivel = "padrao" | "arial" | "verdana" | "georgia";
export type ContrasteAcessivel = "padrao" | "claro" | "escuro";
export type NivelEspacamento = 0 | 1 | 2 | 3;

export interface PreferenciasAcessibilidade {
  _versao: 1;
  escalaFonte: EscalaFonte;
  fonte: FonteAcessivel;
  linhas: NivelEspacamento;
  letras: NivelEspacamento;
  letrasDestacadas: boolean;
  destacarLinks: boolean;
  destacarTitulos: boolean;
  guiaLeitura: boolean;
  mascaraLeitura: boolean;
  lupaTexto: boolean;
  esconderDecorativas: boolean;
  pausarAnimacoes: boolean;
  escalaCinza: boolean;
  contraste: ContrasteAcessivel;
  nivelSaturacao: NivelEspacamento;
  modoDaltonico: NivelEspacamento;
}

export interface AcessibilidadeContexto {
  preferencias: PreferenciasAcessibilidade;
  atualizar: <K extends keyof PreferenciasAcessibilidade>(
    campo: K,
    valor: PreferenciasAcessibilidade[K],
  ) => void;
  restaurar: () => void;
}

export const AcessibilidadeContext = createContext<AcessibilidadeContexto | null>(null);
