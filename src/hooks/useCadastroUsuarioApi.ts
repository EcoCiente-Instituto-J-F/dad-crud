import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { criarUsuarioApi } from "../services/usuariosApiService";
import { ErroHttp } from "../services/httpService";

import type { CriarUsuarioApi } from "../types/usuarioApi";

export interface FormularioCadastroUsuarioApi {
  nome: string;
  email: string;
  senha: string;
  tipoUsuarioId: string;
  dataNascimento: string;
  cpf: string;
  avatar: string;
  condominioId: string;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
}

const inicial: FormularioCadastroUsuarioApi = {
  nome: "",
  email: "",
  senha: "",
  tipoUsuarioId: "",
  dataNascimento: "",
  cpf: "",
  avatar: "",
  condominioId: "",
  cep: "",
  uf: "",
  cidade: "",
  logradouro: "",
  numero: "",
  complemento: "",
};

export function useCadastroUsuarioApi() {
  const navigate = useNavigate();
  const operacao = useRef<AbortController | null>(null);

  const [formulario, setFormulario] = useState(inicial);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  function alterar(
    campo: keyof FormularioCadastroUsuarioApi,
    valor: string,
  ): void {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
      ...(campo === "tipoUsuarioId" ? { condominioId: "" } : {}),
    }));

    setErros({});
    setMensagem("");
  }

  async function salvar(morador: boolean): Promise<void> {
    if (operacao.current) return;

    const novosErros: Record<string, string> = {};
    const tipoUsuarioId = Number(formulario.tipoUsuarioId);
    const condominioId = Number(formulario.condominioId);
    const cep = formulario.cep.replace(/\D/g, "");
    const cpf = formulario.cpf.replace(/\D/g, "");

    if (!formulario.nome.trim()) {
      novosErros.nome = "Informe o nome.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (
      formulario.senha.length < 8 ||
      formulario.senha.length > 72 ||
      !/[a-z]/.test(formulario.senha) ||
      !/[A-Z]/.test(formulario.senha) ||
      !/[0-9]/.test(formulario.senha) ||
      !/[^\p{L}\p{N}\s]/u.test(formulario.senha) ||
      /\s/.test(formulario.senha)
    ) {
      novosErros.senha =
        "Use de 8 a 72 caracteres com maiúscula, minúscula, número e especial, sem espaços.";
    }

    if (!Number.isSafeInteger(tipoUsuarioId) || tipoUsuarioId <= 0) {
      novosErros.tipoUsuarioId = "Selecione o tipo.";
    }

    if (formulario.cpf.trim() && cpf.length !== 11) {
      novosErros.cpf = "Informe o CPF com 11 números.";
    }

    if (cep.length !== 8) {
      novosErros.cep = "Informe o CEP com 8 números.";
    }

    if (!/^[A-Z]{2}$/.test(formulario.uf.trim().toUpperCase())) {
      novosErros.uf = "Informe a UF com duas letras.";
    }

    for (const campo of ["cidade", "logradouro", "numero"] as const) {
      if (!formulario[campo].trim()) {
        novosErros[campo] = "Preencha este campo.";
      }
    }

    if (
      morador &&
      (!Number.isSafeInteger(condominioId) || condominioId <= 0)
    ) {
      novosErros.condominioId = "Informe o ID do condomínio.";
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

    const dados: CriarUsuarioApi = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim().toLowerCase(),
      senha: formulario.senha,
      tipoUsuarioId,
      dataNascimento: formulario.dataNascimento || null,
      cpf: cpf || null,
      avatar: formulario.avatar.trim() || null,
      condominioId: morador ? condominioId : null,
      endereco: {
        cep,
        uf: formulario.uf.trim().toUpperCase(),
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
      await criarUsuarioApi(dados, controller.signal);

      if (!controller.signal.aborted) {
        navigate("/usuarios", { replace: true });
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
          : "Não foi possível cadastrar o usuário.",
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