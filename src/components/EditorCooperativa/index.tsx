import { Link } from "react-router-dom";

import CamposEndereco from "../CamposEndereco";
import PontosColeta from "../PontosColeta";
import SeletorMateriais from "../SeletorMateriais";
import { useSalvarCooperativa } from "../../hooks/useSalvarCooperativa";

import type { EditorCooperativaProps } from "../../types/cooperativa";

const campos = [
  { nome: "nome", titulo: "Nome da cooperativa", tipo: "text", maximo: 120 },
  { nome: "cnpj", titulo: "CNPJ", tipo: "text", maximo: 18 },
  { nome: "email", titulo: "E-mail", tipo: "email", maximo: 160 },
  { nome: "telefone", titulo: "Telefone com DDD", tipo: "tel", maximo: 20 },
] as const;

export default function EditorCooperativa({
  inicial,
  id,
  usuarios,
}: EditorCooperativaProps) {
  const { formulario, erros, estado, alterar, salvar } =
    useSalvarCooperativa(inicial, id);

  const opcoesUsuarios = usuarios.filter(
    (usuario) =>
      usuario.tipo === "COOPERATIVA" &&
      usuario.status === "ATIVO",
  );

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Cooperativa salva</h1>
        <p role="status">O cadastro foi salvo com sucesso.</p>

        <div className="formulario-acoes">
          <Link className="botao" to="/cooperativas">
            Voltar para lista
          </Link>

          <Link
            className="botao botao--primario"
            to={`/cooperativas/${estado.id}`}
          >
            Ver detalhes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      className="painel formulario"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void salvar();
      }}
    >
      <fieldset disabled={estado.status === "salvando"}>
        <legend>Dados da cooperativa</legend>

        <div className="formulario-grade">
          {campos.map((campo) => (
            <div className="campo" key={campo.nome}>
              <label htmlFor={`cooperativa-${campo.nome}`}>
                {campo.titulo}
              </label>
              <input
                id={`cooperativa-${campo.nome}`}
                type={campo.tipo}
                maxLength={campo.maximo}
                required
                value={formulario[campo.nome]}
                onChange={(evento) =>
                  alterar(campo.nome, evento.target.value)
                }
              />
              {erros[campo.nome] && (
                <span className="erro-campo" role="alert">
                  {erros[campo.nome]}
                </span>
              )}
            </div>
          ))}

          <div className="campo">
            <label htmlFor="cooperativa-usuario">Usuário vinculado</label>
            <select
              id="cooperativa-usuario"
              value={formulario.usuarioId}
              onChange={(evento) =>
                alterar("usuarioId", evento.target.value)
              }
            >
              <option value="">Sem usuário vinculado</option>

              {formulario.usuarioId &&
                !opcoesUsuarios.some(
                  (usuario) => usuario.id === formulario.usuarioId,
                ) && (
                  <option value={formulario.usuarioId}>
                    Vínculo atual — usuário indisponível
                  </option>
                )}

              {opcoesUsuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} — {usuario.email}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="cooperativa-status">Status</label>
            <select
              id="cooperativa-status"
              value={formulario.status}
              onChange={(evento) => {
                const valor = evento.target.value;

                if (valor === "ATIVO" || valor === "INATIVO") {
                  alterar("status", valor);
                }
              }}
            >
              <option value="ATIVO">Ativa</option>
              <option value="INATIVO">Inativa</option>
            </select>
          </div>
        </div>

        <section className="secao-formulario">
          <h2>Endereço</h2>
          <CamposEndereco
            prefixo="endereco"
            endereco={formulario.endereco}
            erros={erros}
            onChange={(endereco) => alterar("endereco", endereco)}
          />
        </section>

        <section className="secao-formulario">
          <h2>Materiais aceitos pela cooperativa</h2>

          <SeletorMateriais
            id="cooperativa-materiais"
            selecionados={formulario.materiais}
            onChange={(materiais) => alterar("materiais", materiais)}
          />

          {erros.materiais && (
            <p className="erro-campo" role="alert">{erros.materiais}</p>
          )}
        </section>

        <PontosColeta
          pontos={formulario.pontos}
          erros={erros}
          onChange={(pontos) => alterar("pontos", pontos)}
        />
      </fieldset>

      {estado.status === "erro" && (
        <p className="erro-campo" role="alert">{estado.mensagem}</p>
      )}

      {estado.status === "salvando" && (
        <p role="status">Salvando cooperativa e pontos de coleta...</p>
      )}

      <div className="formulario-acoes">
        <Link
          className="botao"
          to={id ? `/cooperativas/${id}` : "/cooperativas"}
        >
          Voltar
        </Link>

        <button
          type="submit"
          className="botao botao--primario"
          disabled={estado.status === "salvando"}
        >
          {estado.status === "salvando" ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}