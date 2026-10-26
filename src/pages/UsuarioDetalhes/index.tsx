import { Link, useParams } from "react-router-dom";

import DesativarUsuario from "../../components/DesativarUsuario";
import EstadoRequisicao from "../../components/EstadoRequisicao";

import { useUsuario } from "../../hooks/useUsuario";
import { rotulosTipoUsuario } from "../../utils/usuarios";

export default function UsuarioDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { requisicao, recarregar } = useUsuario(id);

  if (!id) {
    return (
      <section className="painel estado-vazio">
        <h1>Identificador ausente</h1>

        <Link className="botao" to="/usuarios">
          Voltar para usuários
        </Link>
      </section>
    );
  }

  if (requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (requisicao.status === "erro") {
    return (
      <>
        <EstadoRequisicao
          estado="erro"
          mensagem={requisicao.mensagem}
          onTentarNovamente={recarregar}
        />

        <Link className="botao" to="/usuarios">
          Voltar para usuários
        </Link>
      </>
    );
  }

  const usuario = requisicao.dados;

  if (!usuario) {
    return (
      <section className="painel estado-vazio">
        <h1>Usuário não encontrado</h1>

        <p>Não existe um cadastro com esse identificador.</p>

        <div className="formulario-acoes">
          <Link className="botao" to="/usuarios">
            Voltar para usuários
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{usuario.nome}</h1>

          <p className="pagina-descricao">
            Detalhes do usuário
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
            Editar usuário
          </Link>
        </div>
      </div>

      <div className="painel formulario">
        <p className="detalhes-confirmacao" role="status">
          Dados carregados com sucesso.
        </p>

        <h2>Informações do cadastro</h2>

        <dl className="detalhes-grade">
          <div>
            <dt>Nome</dt>
            <dd>{usuario.nome}</dd>
          </div>

          <div>
            <dt>E-mail</dt>
            <dd>{usuario.email}</dd>
          </div>

          <div>
            <dt>Localidade</dt>
            <dd>
              {usuario.cidade}, {usuario.uf}
            </dd>
          </div>

          <div>
            <dt>Tipo</dt>
            <dd>{rotulosTipoUsuario[usuario.tipo]}</dd>
          </div>

          <div>
            <dt>Pontuação</dt>
            <dd>
              {usuario.pontuacao === null
                ? "Não se aplica"
                : `${usuario.pontuacao.toLocaleString("pt-BR")} pontos`}
            </dd>
          </div>

          <div>
            <dt>Status</dt>
            <dd>
              {usuario.status === "ATIVO" ? "Ativo" : "Inativo"}
            </dd>
          </div>
        </dl>

        {usuario.status === "ATIVO" && (
          <div className="area-desativacao">
            <DesativarUsuario
              key={usuario.id}
              usuarioId={usuario.id}
              onDesativado={recarregar}
            />
          </div>
        )}
      </div>
    </section>
  );
}