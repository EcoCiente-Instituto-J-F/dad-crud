import { useEffect, useRef, useState } from "react";

import { useAuth } from "./useAuth";
import { validarPerfil, validarSenha } from "../utils/validarAuth";

import type { DadosPerfil, DadosSenha } from "../types/auth";

type Estado =
  | { status: "pronto" }
  | { status: "salvando" }
  | { status: "sucesso"; mensagem: string }
  | { status: "erro"; mensagem: string };

export function usePerfilAdmin() {
  const auth = useAuth();

  const perfil = auth.estado.status === "autenticado"
    ? auth.estado.sessao.perfil
    : null;

  const [dados, setDados] = useState<DadosPerfil>({
    nome: perfil?.nome ?? "",
    email: perfil?.email ?? "",
    telefone: perfil?.telefone ?? "",
  });

  const [senha, setSenha] = useState<DadosSenha>({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [estado, setEstado] = useState<Estado>({ status: "pronto" });
  const [erros, setErros] = useState<Record<string, string>>({});

  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function executar(
    tipo: "perfil" | "senha" | "avatar",
    arquivo?: File,
  ): Promise<void> {
    if (operacao.current) return;

    if (tipo === "perfil") {
      const resultado = validarPerfil(dados);

      if (!resultado.valido) {
        setErros(resultado.erros);
        return;
      }
    }

    if (tipo === "senha") {
      const resultado = validarSenha(senha);

      if (!resultado.valido) {
        setErros(resultado.erros);
        return;
      }
    }

    if (tipo === "avatar" && !arquivo) return;

    const controller = new AbortController();
    operacao.current = controller;

    setErros({});
    setEstado({ status: "salvando" });

    try {
      if (tipo === "perfil") {
        await auth.atualizarPerfil(dados, controller.signal);
      } else if (tipo === "senha") {
        await auth.alterarSenha(senha, controller.signal);
      } else if (arquivo) {
        await auth.atualizarAvatar(arquivo, controller.signal);
      }

      if (!controller.signal.aborted) {
        if (tipo === "senha") {
          setSenha({
            senhaAtual: "",
            novaSenha: "",
            confirmarSenha: "",
          });
        }

        setEstado({
          status: "sucesso",
          mensagem:
            tipo === "senha"
              ? "Senha alterada nesta demonstração."
              : tipo === "avatar"
                ? "Foto atualizada."
                : "Perfil atualizado.",
        });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setEstado({
          status: "erro",
          mensagem:
            erro instanceof Error ? erro.message : "Não foi possível salvar.",
        });
      }
    } finally {
      if (operacao.current === controller) operacao.current = null;
    }
  }

  return {
    perfil,
    dados,
    senha,
    estado,
    erros,
    alterarDados: (campo: keyof DadosPerfil, valor: string): void => {
      setDados((anterior) => ({ ...anterior, [campo]: valor }));
      setErros({});
      setEstado({ status: "pronto" });
    },
    alterarSenha: (campo: keyof DadosSenha, valor: string): void => {
      setSenha((anterior) => ({ ...anterior, [campo]: valor }));
      setErros({});
      setEstado({ status: "pronto" });
    },
    executar,
  };
}