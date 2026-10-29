import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { editarUsuarioApi } from "../services/usuariosApiService";
import { ErroHttp } from "../services/httpService";

import type {
  EditarUsuarioApi,
  UsuarioApi,
} from "../types/usuarioApi";

export function useEdicaoUsuarioApi(usuario: UsuarioApi) {
  const navigate = useNavigate();
  const operacao = useRef<AbortController | null>(null);

  const [formulario, setFormulario] = useState({
    nome: usuario.nome,
    email: usuario.email,
    dataNascimento: usuario.dataNascimento ?? "",
    avatar: usuario.avatar ?? "",
    cep: usuario.endereco?.cep ?? "",
    uf: usuario.endereco?.uf ?? "",
    cidade: usuario.endereco?.cidade ?? "",
    logradouro: usuario.endereco?.logradouro ?? "",
    numero: usuario.endereco?.numero ?? "",
    complemento: usuario.endereco?.complemento ?? "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  function alterar(
    campo: keyof typeof formulario,
    valor: string,
  ): void {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros({});
    setMensagem("");
  }

  async function salvar(): Promise<void> {
    if (operacao.current) return;

    const novosErros: Record<string, string> = {};
    const cep = formulario.cep.replace(/\D/g, "");
    const uf = formulario.uf.trim().toUpperCase();

    if (!formulario.nome.trim()) {
      novosErros.nome = "Informe o nome.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (cep.length !== 8) {
      novosErros.cep = "Informe o CEP com 8 números.";
    }

    if (!/^[A-Z]{2}$/.test(uf)) {
      novosErros.uf = "Informe a UF com duas letras.";
    }

    for (const campo of ["cidade", "logradouro", "numero"] as const) {
      if (!formulario[campo].trim()) {
        novosErros[campo] = "Preencha este campo.";
      }
    }

    if (formulario.avatar.trim()) {
      try {
        const url = new URL(formulario.avatar.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          novosErros.avatar = "Informe uma URL HTTP ou HTTPS.";
        }
      } catch {
        novosErros.avatar = "Informe uma URL válida.";
      }
    }

    setErros(novosErros);
    setMensagem("");

    if (Object.keys(novosErros).length > 0) return;

    const dados: EditarUsuarioApi = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim().toLowerCase(),
      dataNascimento: formulario.dataNascimento || null,
      avatar: formulario.avatar.trim() || null,
      endereco: {
        cep,
        uf,
        cidade: formulario.cidade.trim(),
        logradouro: formulario.logradouro.trim(),
        numero: formulario.numero.trim(),
        complemento: formulario.complemento.trim() || null,
      },
    };

    const controller = new AbortController();
    operacao.current = controller;
    setSalvando(true);

    try {
      await editarUsuarioApi(usuario.id, dados, controller.signal);

      if (!controller.signal.aborted) {
        navigate(`/usuarios/${usuario.id}`, { replace: true });
      }
    } catch (erro: unknown) {
      if (controller.signal.aborted) return;

      if (erro instanceof ErroHttp) {
        const campos: Record<string, string> = {};

        for (const [campo, texto] of Object.entries(erro.campos)) {
          campos[campo.replace(/^endereco\./, "")] = texto;
        }

        setErros(campos);
      }

      setMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível atualizar o usuário.",
      );
    } finally {
      if (operacao.current === controller) {
        operacao.current = null;
      }

      if (!controller.signal.aborted) {
        setSalvando(false);
      }
    }
  }

  return {
    formulario,
    erros,
    mensagem,
    salvando,
    alterar,
    salvar,
  };
}