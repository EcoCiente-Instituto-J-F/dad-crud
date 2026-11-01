import { useState } from "react";
import { MapPin } from "lucide-react";

import Modal from "../Modal";
import CamposEditorApi from "../CamposEditorApi";
import type { GerenciarPontosProps } from "../../types/gerenciarPontos";

function registro(valor: unknown): Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor)
    ? valor as Record<string, unknown>
    : {};
}

function validarPontos(pontos: unknown[]): string | null {
  for (const [indice, valor] of pontos.entries()) {
    const ponto = registro(valor);
    const endereco = registro(ponto.endereco);
    const prefixo = `Ponto ${indice + 1}: `;

    if (typeof ponto.nome !== "string" || !ponto.nome.trim()) {
      return prefixo + "informe o nome.";
    }

    if (
      typeof endereco.cep !== "string" ||
      !/^\d{8}$/.test(endereco.cep)
    ) {
      return prefixo + "informe um CEP com oito números.";
    }

    if (
      typeof endereco.uf !== "string" ||
      !/^[A-Z]{2}$/.test(endereco.uf)
    ) {
      return prefixo + "informe a UF com duas letras maiúsculas.";
    }

    for (const campo of ["cidade", "logradouro", "numero"]) {
      const texto = endereco[campo];

      if (typeof texto !== "string" || !texto.trim()) {
        return prefixo + "preencha cidade, logradouro e número.";
      }
    }

    if (!Array.isArray(ponto.categoriaIds) || ponto.categoriaIds.length === 0) {
      return prefixo + "selecione pelo menos uma categoria.";
    }

    if (Boolean(ponto.abertura) !== Boolean(ponto.fechamento)) {
      return prefixo + "informe abertura e fechamento juntos.";
    }
  }

  return null;
}

export default function GerenciarPontos({
  campos,
  dados,
  onChange,
}: GerenciarPontosProps) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<Record<string, unknown>>({});
  const [erro, setErro] = useState("");

  const campoPontos = campos.find((campo) => campo.chave === "pontos");
  const pontos: unknown[] = Array.isArray(dados.pontos) ? dados.pontos : [];

  function abrir(): void {
    setRascunho({ pontos: structuredClone(pontos) });
    setErro("");
    setAberto(true);
  }

  function aplicar(): void {
    const lista = rascunho.pontos;

    if (!Array.isArray(lista)) {
      setErro("A lista de pontos é inválida.");
      return;
    }

    const falha = validarPontos(lista);

    if (falha) {
      setErro(falha);
      return;
    }

    onChange({ ...dados, pontos: structuredClone(lista) });
    setAberto(false);
  }

  return (
    <>
      <section className="cooperativa-pontos-resumo">
        <div className="cooperativa-pontos-cabecalho">
          <div>
            <h2>
              <MapPin size={20} aria-hidden="true" />
              Pontos de coleta
            </h2>
            <p>{pontos.length} ponto(s) no formulário.</p>
          </div>

          <button type="button" className="botao" onClick={abrir}>
            Gerenciar pontos
          </button>
        </div>

        {pontos.length > 0 && (
          <ul className="cooperativa-pontos-lista">
            {pontos.map((valor, indice) => {
              const ponto = registro(valor);

              return (
                <li key={typeof ponto.id === "number" ? ponto.id : `novo-${indice}`}>
                  <span>
                    {typeof ponto.nome === "string" && ponto.nome.trim()
                      ? ponto.nome
                      : `Ponto ${indice + 1}`}
                  </span>

                  <span
                    className={`status-usuario status-usuario--${ponto.ativo ? "ativo" : "inativo"}`}
                  >
                    {ponto.ativo ? "Ativo" : "Inativo"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        aberto={aberto}
        titulo="Gerenciar pontos de coleta"
        onFechar={() => setAberto(false)}
      >
        <div className="pontos-modal-conteudo">
          <p className="pontos-modal-aviso">
            Aplique as alterações e depois clique em Salvar no formulário da cooperativa.
          </p>

          <p className="pontos-modal-alerta">
            Para desativar, desmarque “Ponto ativo”.
            Remover da lista solicita a exclusão do ponto ao salvar.
          </p>

          {campoPontos ? (
            <CamposEditorApi
              campos={[campoPontos]}
              dados={rascunho}
              leitura={false}
              onChange={(valores) => {
                setRascunho(valores);
                setErro("");
              }}
            />
          ) : (
            <p role="alert">Configuração dos pontos indisponível.</p>
          )}

          {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

          <div className="formulario-acoes">
            <button type="button" className="botao" onClick={() => setAberto(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="botao botao--primario"
              disabled={!campoPontos}
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