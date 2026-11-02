import { useEffect,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormularioCadastroPessoa } from "../types/cadastroPessoa";
import { validarCadastroPessoa,validarEtapaPessoa } from "../utils/validarCadastroPessoa";

import { cadastrarPessoa } from "../services/cadastroPublicoService";

export function useCadastroPessoa() {
  const navigate = useNavigate();
  const operacao = useRef<AbortController | null>(null);

  const [passo, setPasso] = useState<1 | 2>(1);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [formulario, setFormulario] = useState<FormularioCadastroPessoa>({
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
    const resultado = validarEtapaPessoa(formulario);
    setErros(resultado.valido ? {} : resultado.erros);
    if (resultado.valido) { setMensagem(""); setPasso(2); }
  }

  async function salvar(): Promise<void> {
    if (operacao.current) return;

    const resultado = validarCadastroPessoa(formulario);
    setErros(resultado.valido ? {} : resultado.erros);
    if (!resultado.valido) { setPasso(1); return; }

    const controller = new AbortController();
    operacao.current = controller;

    setSalvando(true);
    setMensagem("");

    try {
      await cadastrarPessoa(resultado.dados.cadastro, controller.signal);

      if (!controller.signal.aborted) {
        navigate("/usuarios", { replace: true, state: { mensagemSucesso: "Usuário cadastrado com sucesso." } });
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
