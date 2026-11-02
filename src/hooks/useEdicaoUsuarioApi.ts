import { useEffect,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarSchema } from "../utils/validarSchema";
import { editarUsuarioSchema } from "../utils/validarUsuarioApi";

import { ErroHttp } from "../services/httpService";
import { editarUsuarioApi } from "../services/usuariosApiService";

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

    const resultado = validarSchema(editarUsuarioSchema, {
      nome: formulario.nome, email: formulario.email.trim().toLowerCase(),
      dataNascimento: formulario.dataNascimento || null, avatar: formulario.avatar.trim() || null,
      endereco: { cep: formulario.cep.replace(/\D/g, ""), uf: formulario.uf.trim().toUpperCase(), cidade: formulario.cidade,
        logradouro: formulario.logradouro, numero: formulario.numero, complemento: formulario.complemento.trim() || null },
    });
    setMensagem("");
    setErros(resultado.valido ? {} : Object.fromEntries(Object.entries(resultado.erros).map(([campo, mensagem]) => [campo.replace(/^endereco\./, ""), mensagem])));
    if (!resultado.valido) return;
    const dados: EditarUsuarioApi = resultado.dados;

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
