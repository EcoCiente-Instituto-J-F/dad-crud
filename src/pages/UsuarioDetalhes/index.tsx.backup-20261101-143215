import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";

import { useUsuarioApi } from "../../hooks/useUsuarioApi";
import { alterarStatusUsuarioApi } from "../../services/usuariosApiService";

export default function UsuarioDetalhes() {
  const { id } = useParams();
  const { requisicao, recarregar } = useUsuarioApi(id);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  const operacao = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => operacao.current?.abort();
  }, []);

  async function alterarStatus(): Promise<void> {
    if (
      operacao.current ||
      requisicao.status !== "sucesso"
    ) {
      return;
    }

    const usuario = requisicao.dados;
    const controller = new AbortController();

    operacao.current = controller;
    setSalvando(true);
    setMensagem("");

    try {
      await alterarStatusUsuarioApi(
        usuario.id,
        !usuario.ativo,
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setConfirmando(false);
        recarregar();
      }
    } catch (erro: unknown) {
      if (!controller.signal.aborted) {
        setMensagem(
          erro instanceof Error
            ? erro.message
            : "Não foi possível alterar a situação.",
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

  if (requisicao.status === "carregando") {
    return (
      <EstadoRequisicao
        estado="carregando"
        mensagem="Carregando usuário..."
      />
    );
  }

  if (requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={requisicao.mensagem}
        onTentarNovamente={recarregar}
      />
    );
  }

  const usuario = requisicao.dados;
  const endereco = usuario.endereco;

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{usuario.nome}</h1>

          <p className="pagina-descricao">
            Usuário #{usuario.id}
          </p>
        </div>

        <div className="acoes-pagina">
          <Link className="botao" to="/usuarios">
            Voltar
          </Link>

          <Link
            className="botao botao--primario"
            to={`/usuarios/${usuario.id}/editar`}
          >
            Editar
          </Link>
        </div>
      </div>

      <section className="painel formulario">
        <h2>Dados pessoais</h2>

        <dl className="detalhes-grade">
          <div>
            <dt>E-mail</dt>
            <dd>{usuario.email}</dd>
          </div>

          <div>
            <dt>Tipo</dt>
            <dd>{usuario.tipoUsuario}</dd>
          </div>

          <div>
            <dt>CPF</dt>
            <dd>{usuario.cpfMascarado || "Não informado"}</dd>
          </div>

          <div>
            <dt>Nascimento</dt>
            <dd>
              {usuario.dataNascimento
                ? usuario.dataNascimento
                  .split("-")
                  .reverse()
                  .join("/")
                : "Não informado"}
            </dd>
          </div>

          <div>
            <dt>Situação</dt>
            <dd>{usuario.ativo ? "Ativo" : "Inativo"}</dd>
          </div>

          <div>
            <dt>Condomínio</dt>
            <dd>{usuario.condominioId ?? "Não informado"}</dd>
          </div>
        </dl>

        <section className="secao-formulario">
          <h2>Endereço</h2>

          <dl className="detalhes-grade">
            <div>
              <dt>CEP</dt>
              <dd>{endereco?.cep || "Não informado"}</dd>
            </div>

            <div>
              <dt>Cidade / UF</dt>
              <dd>
                {[endereco?.cidade, endereco?.uf]
                  .filter(Boolean)
                  .join(" / ") || "Não informado"}
              </dd>
            </div>

            <div>
              <dt>Logradouro</dt>
              <dd>{endereco?.logradouro || "Não informado"}</dd>
            </div>

            <div>
              <dt>Número</dt>
              <dd>{endereco?.numero || "Não informado"}</dd>
            </div>

            <div>
              <dt>Complemento</dt>
              <dd>{endereco?.complemento || "Não informado"}</dd>
            </div>
          </dl>
        </section>

        <section className="area-desativacao">
          <h2>Situação do usuário</h2>

          {mensagem && (
            <p className="mensagem-erro" role="alert">
              {mensagem}
            </p>
          )}

          {confirmando ? (
            <div className="confirmacao-desativacao">
              <p>
                Deseja realmente{" "}
                {usuario.ativo ? "desativar" : "ativar"} este usuário?
              </p>

              <div className="formulario-acoes">
                <button
                  type="button"
                  className="botao"
                  disabled={salvando}
                  onClick={() => setConfirmando(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="botao botao--primario"
                  disabled={salvando}
                  onClick={() => void alterarStatus()}
                >
                  {salvando ? "Salvando..." : "Confirmar"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={
                usuario.ativo
                  ? "botao botao--perigo"
                  : "botao botao--primario"
              }
              onClick={() => {
                setMensagem("");
                setConfirmando(true);
              }}
            >
              {usuario.ativo ? "Desativar usuário" : "Ativar usuário"}
            </button>
          )}
        </section>
      </section>
    </section>
  );
}