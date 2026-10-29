import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cadastrarPessoa } from "../services/cadastroPublicoService";

export function useCadastroPessoa() {
  const navigate = useNavigate();
  const operacao = useRef<AbortController | null>(null);

  const [passo, setPasso] = useState<1 | 2>(1);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [formulario, setFormulario] = useState({
    nomeUsuario: "",
    email: "",
    senha: "",
    cpf: "",
    dataNascimento: "",
    possuiVinculo: false,
    codigoCondominio: "",
    cep: "",
    numero: "",
    complemento: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  function alterar<K extends keyof typeof formulario>(
    campo: K,
    valor: (typeof formulario)[K],
  ): void {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros({});
    setMensagem("");
  }

  function continuar(): void {
    const novos: Record<string, string> = {};

    if (!formulario.nomeUsuario.trim()) {
      novos.nomeUsuario = "Informe o nome completo.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
      novos.email = "Informe um e-mail válido.";
    }

    if (formulario.cpf.replace(/\D/g, "").length !== 11) {
      novos.cpf = "Informe o CPF com 11 números.";
    }

    if (!formulario.dataNascimento) {
      novos.dataNascimento = "Informe a data de nascimento.";
    } else {
      const data = new Date(`${formulario.dataNascimento}T12:00:00`);
      const hoje = new Date();

      let idade = hoje.getFullYear() - data.getFullYear();

      if (
        hoje.getMonth() < data.getMonth() ||
        (
          hoje.getMonth() === data.getMonth() &&
          hoje.getDate() < data.getDate()
        )
      ) {
        idade -= 1;
      }

      if (Number.isNaN(data.getTime()) || idade < 10) {
        novos.dataNascimento = "A idade mínima é de 10 anos.";
      }
    }

    if (
      formulario.senha.length < 8 ||
      !/[a-z]/.test(formulario.senha) ||
      !/[A-Z]/.test(formulario.senha) ||
      !/\d/.test(formulario.senha) ||
      !/[^\sa-zA-Z\d]/.test(formulario.senha)
    ) {
      novos.senha =
        "Use ao menos 8 caracteres, maiúscula, minúscula, número e especial.";
    }

    if (
      formulario.possuiVinculo &&
      !formulario.codigoCondominio.trim()
    ) {
      novos.codigoCondominio = "Informe o código do condomínio.";
    }

    setErros(novos);

    if (Object.keys(novos).length === 0) {
      setMensagem("");
      setPasso(2);
    }
  }

  async function salvar(): Promise<void> {
    if (operacao.current) return;

    const novos: Record<string, string> = {};

    if (!formulario.possuiVinculo) {
      if (formulario.cep.replace(/\D/g, "").length !== 8) {
        novos.cep = "Informe o CEP com 8 números.";
      }

      if (!formulario.numero.trim()) {
        novos.numero = "Informe o número.";
      }
    }

    setErros(novos);

    if (Object.keys(novos).length > 0) return;

    const controller = new AbortController();
    operacao.current = controller;

    setSalvando(true);
    setMensagem("");

    const dados = {
      nomeUsuario: formulario.nomeUsuario.trim(),
      email: formulario.email.trim().toLowerCase(),
      senha: formulario.senha,
      cpf: formulario.cpf.replace(/\D/g, ""),
      dataNascimento: formulario.dataNascimento,
    };

    try {
      if (formulario.possuiVinculo) {
        await cadastrarPessoa(
          {
            possuiVinculo: true,
            dados: {
              ...dados,
              codigoCondominio:
                formulario.codigoCondominio.trim().toUpperCase(),
            },
          },
          controller.signal,
        );
      } else {
        await cadastrarPessoa(
          {
            possuiVinculo: false,
            dados: {
              ...dados,
              cep: formulario.cep.replace(/\D/g, ""),
              numero: formulario.numero.trim(),
              complemento: formulario.complemento.trim() || null,
            },
          },
          controller.signal,
        );
      }

      if (!controller.signal.aborted) {
        navigate("/usuarios", { replace: true });
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setMensagem(
          erro instanceof Error
            ? erro.message
            : "Não foi possível cadastrar.",
        );
      }
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
    passo,
    formulario,
    erros,
    mensagem,
    salvando,
    alterar,
    continuar,
    salvar,
    voltar: () => {
      setMensagem("");
      setErros({});
      setPasso(1);
    },
  };
}