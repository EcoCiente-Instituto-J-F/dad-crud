import { useState } from "react";
import { Building2, UsersRound } from "lucide-react";

import Modal from "../Modal";
import CamposEditorApi from "../CamposEditorApi";
import type { ConfiguracoesCondominioProps } from "../../types/configuracoesCondominio";

export default function ConfiguracoesCondominio({
  campos,
  dados,
  onChange,
}: ConfiguracoesCondominioProps) {
  const [modal, setModal] = useState<"sindico" | "torres" | null>(null);
  const [rascunho, setRascunho] = useState<Record<string, unknown>>({});
  const [erro, setErro] = useState("");

  const campoSindico = campos.find((campo) => campo.chave === "sindicoId");
  const campoTorres = campos.find((campo) => campo.chave === "torres");

  const sindico = campoSindico?.opcoes?.find(
    (opcao) => opcao.id === dados.sindicoId,
  );

  const quantidadeTorres = Array.isArray(dados.torres)
    ? dados.torres.length
    : 0;

  function abrir(tipo: "sindico" | "torres"): void {
    setErro("");

    setRascunho(tipo === "sindico"
      ? { sindicoId: dados.sindicoId ?? null }
      : { torres: structuredClone(dados.torres ?? []) });

    setModal(tipo);
  }

  function aplicar(): void {
    if (modal === "sindico") {
      const id = rascunho.sindicoId ?? null;

      if (
        id !== null &&
        !campoSindico?.opcoes?.some((opcao) => opcao.id === id)
      ) {
        setErro("Selecione um síndico válido.");
        return;
      }

      onChange({ ...dados, sindicoId: id });
    }

    if (modal === "torres") {
      const torres = rascunho.torres;

      if (!Array.isArray(torres)) {
        setErro("A lista de torres é inválida.");
        return;
      }

      const possuiNomeVazio = torres.some((item: unknown) => {
        if (typeof item !== "object" || item === null || !("nome" in item)) {
          return true;
        }

        return typeof item.nome !== "string" || !item.nome.trim();
      });

      if (possuiNomeVazio) {
        setErro("Preencha o nome de todas as torres.");
        return;
      }

      onChange({ ...dados, torres: structuredClone(torres) });
    }

    setModal(null);
  }

  const campoSelecionado = modal === "sindico" ? campoSindico : campoTorres;

  return (
    <>
      <div className="condominio-configuracoes">
        <section className="condominio-configuracao">
          <div className="condominio-configuracao-titulo">
            <UsersRound size={21} aria-hidden="true" />
            <h2>Síndico responsável</h2>
          </div>

          <p>{sindico?.nome ?? "Nenhum síndico vinculado."}</p>

          <button type="button" className="botao" onClick={() => abrir("sindico")}>
            {sindico ? "Alterar síndico" : "Vincular síndico"}
          </button>
        </section>

        <section className="condominio-configuracao">
          <div className="condominio-configuracao-titulo">
            <Building2 size={21} aria-hidden="true" />
            <h2>Torres</h2>
          </div>

          <p>{quantidadeTorres} torre(s) no formulário.</p>

          <button type="button" className="botao" onClick={() => abrir("torres")}>
            Gerenciar torres
          </button>
        </section>
      </div>

      <Modal
        aberto={modal !== null}
        titulo={modal === "sindico" ? "Vincular síndico" : "Gerenciar torres"}
        onFechar={() => setModal(null)}
      >
        <div className="condominio-modal-conteudo">
          <p className="condominio-configuracao-aviso">
            Aplique as alterações e depois clique em Salvar no formulário do condomínio.
          </p>

          {modal === "torres" && (
            <p className="condominio-configuracao-alerta">
              Remover uma torre da lista solicita sua exclusão ao salvar.
              Torres com histórico podem ter a exclusão bloqueada.
            </p>
          )}

          {campoSelecionado ? (
            <CamposEditorApi
              campos={[campoSelecionado]}
              dados={rascunho}
              leitura={false}
              onChange={(valores) => {
                setRascunho(valores);
                setErro("");
              }}
            />
          ) : (
            <p role="alert">Configuração do formulário indisponível.</p>
          )}

          {modal === "sindico" && (
            <button
              type="button"
              className="botao condominio-desvincular"
              onClick={() => {
                setRascunho({ sindicoId: null });
                setErro("");
              }}
            >
              Deixar sem síndico
            </button>
          )}

          {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

          <div className="formulario-acoes">
            <button type="button" className="botao" onClick={() => setModal(null)}>
              Cancelar
            </button>

            <button
              type="button"
              className="botao botao--primario"
              disabled={!campoSelecionado}
              onClick={aplicar}
            >
              Aplicar ao formulário
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}