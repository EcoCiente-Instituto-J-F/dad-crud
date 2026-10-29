import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";

import {
  buscarModulo,
  salvarModulo,
} from "../services/editorModuloService";
import { ErroHttp } from "../services/httpService";

import type { NomeModulo } from "../types/editorModulo";

export function useEditorModulo(
  modulo: NomeModulo,
  id: number | null,
  inicial: Record<string, unknown>,
) {
  const navigate = useNavigate();
  const operacao = useRef<AbortController | null>(null);

  const [dados, setDados] = useState(inicial);
  const [carregando, setCarregando] = useState(id !== null);
  const [falhaCarga, setFalhaCarga] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (id === null) return;

    const controller = new AbortController();
    setCarregando(true);
    setFalhaCarga("");

    buscarModulo(modulo, id, controller.signal)
      .then((resposta) => {
        if (!controller.signal.aborted) setDados(resposta);
      })
      .catch((erro: unknown) => {
        if (!controller.signal.aborted) {
          setFalhaCarga(
            erro instanceof Error ? erro.message : "Falha ao carregar.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    return () => controller.abort();
  }, [modulo, id, tentativa]);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function salvar(): Promise<void> {
    if (operacao.current) return;

    const controller = new AbortController();
    operacao.current = controller;
    setSalvando(true);
    setMensagem("");

    try {
      await salvarModulo(modulo, id, dados, controller.signal);

      if (!controller.signal.aborted) {
        navigate(`/${modulo}`, { replace: true });
      }
    } catch (erro: unknown) {
      if (controller.signal.aborted) return;

      if (erro instanceof ZodError) {
        setMensagem(
          erro.issues
            .map((item) => `${item.path.join(".")}: ${item.message}`)
            .join(" • "),
        );
      } else if (erro instanceof ErroHttp) {
        setMensagem([
          erro.message,
          ...Object.entries(erro.campos).map(
            ([campo, texto]) => `${campo}: ${texto}`,
          ),
        ].join(" • "));
      } else {
        setMensagem(
          erro instanceof Error ? erro.message : "Falha ao salvar.",
        );
      }
    } finally {
      operacao.current = null;
      if (!controller.signal.aborted) setSalvando(false);
    }
  }

  return {
    dados,
    setDados,
    carregando,
    falhaCarga,
    mensagem,
    salvando,
    salvar,
    recarregar: () => setTentativa((valor) => valor + 1),
  };
}