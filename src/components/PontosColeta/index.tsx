import CamposEndereco from "../CamposEndereco";
import SeletorMateriais from "../SeletorMateriais";
import { enderecoVazio } from "../../data/cooperativa";

import type {
  PontoColeta,
  PontosColetaProps,
} from "../../types/cooperativa";

export default function PontosColeta({
  pontos,
  erros,
  onChange,
}: PontosColetaProps) {
  function alterar<K extends keyof PontoColeta>(
    id: string,
    campo: K,
    valor: PontoColeta[K],
  ): void {
    onChange(
      pontos.map((ponto) =>
        ponto.id === id ? { ...ponto, [campo]: valor } : ponto,
      ),
    );
  }

  return (
    <section className="secao-formulario">
      <div className="pagina-cabecalho">
        <div>
          <h2>Pontos de coleta</h2>
          <p className="pagina-descricao">
            Cadastre os locais de atendimento desta cooperativa.
          </p>
        </div>

        <button
          type="button"
          className="botao"
          onClick={() =>
            onChange([
              ...pontos,
              {
                id: crypto.randomUUID(),
                nome: "",
                abertura: "08:00",
                fechamento: "17:00",
                endereco: enderecoVazio(),
                materiais: [],
                status: "ATIVO",
              },
            ])
          }
        >
          Adicionar ponto
        </button>
      </div>

      {pontos.length === 0 && <p>Nenhum ponto cadastrado.</p>}

      {pontos.map((ponto) => {
        const prefixo = `pontos.${ponto.id}`;

        return (
          <section className="ponto-editor" key={ponto.id}>
            <div className="pagina-cabecalho">
              <h3>{ponto.nome || "Novo ponto de coleta"}</h3>

              <button
                type="button"
                className="botao botao--perigo"
                onClick={() =>
                  onChange(pontos.filter((item) => item.id !== ponto.id))
                }
              >
                Remover ponto
              </button>
            </div>

            <div className="formulario-grade">
              <div className="campo">
                <label htmlFor={`${prefixo}.nome`}>Nome do ponto</label>
                <input
                  id={`${prefixo}.nome`}
                  type="text"
                  maxLength={100}
                  required
                  value={ponto.nome}
                  onChange={(evento) =>
                    alterar(ponto.id, "nome", evento.target.value)
                  }
                />
                {erros[`${prefixo}.nome`] && (
                  <span className="erro-campo" role="alert">
                    {erros[`${prefixo}.nome`]}
                  </span>
                )}
              </div>

              <div className="campo">
                <label htmlFor={`${prefixo}.status`}>Status</label>
                <select
                  id={`${prefixo}.status`}
                  value={ponto.status}
                  onChange={(evento) => {
                    const valor = evento.target.value;

                    if (valor === "ATIVO" || valor === "INATIVO") {
                      alterar(ponto.id, "status", valor);
                    }
                  }}
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>

              <div className="campo">
                <label htmlFor={`${prefixo}.abertura`}>Abertura</label>
                <input
                  id={`${prefixo}.abertura`}
                  type="time"
                  required
                  value={ponto.abertura}
                  onChange={(evento) =>
                    alterar(ponto.id, "abertura", evento.target.value)
                  }
                />
                {erros[`${prefixo}.abertura`] && (
                  <span className="erro-campo" role="alert">
                    {erros[`${prefixo}.abertura`]}
                  </span>
                )}
              </div>

              <div className="campo">
                <label htmlFor={`${prefixo}.fechamento`}>
                  Fechamento
                </label>
                <input
                  id={`${prefixo}.fechamento`}
                  type="time"
                  required
                  value={ponto.fechamento}
                  onChange={(evento) =>
                    alterar(ponto.id, "fechamento", evento.target.value)
                  }
                />
                {erros[`${prefixo}.fechamento`] && (
                  <span className="erro-campo" role="alert">
                    {erros[`${prefixo}.fechamento`]}
                  </span>
                )}
              </div>
            </div>

            <h4 className="subtitulo-formulario">Endereço do ponto</h4>

            <CamposEndereco
              prefixo={`${prefixo}.endereco`}
              endereco={ponto.endereco}
              erros={erros}
              onChange={(endereco) =>
                alterar(ponto.id, "endereco", endereco)
              }
            />

            <h4 className="subtitulo-formulario">Materiais aceitos</h4>

            <SeletorMateriais
              id={`${prefixo}.materiais`}
              selecionados={ponto.materiais}
              onChange={(materiais) =>
                alterar(ponto.id, "materiais", materiais)
              }
            />

            {erros[`${prefixo}.materiais`] && (
              <p className="erro-campo" role="alert">
                {erros[`${prefixo}.materiais`]}
              </p>
            )}
          </section>
        );
      })}

      {erros.pontos && (
        <p className="erro-campo" role="alert">{erros.pontos}</p>
      )}
    </section>
  );
}