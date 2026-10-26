import { Link, useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import FormularioUsuario from "../../components/FormularioUsuario";
import { useEditarUsuario } from "../../hooks/useEditarUsuario";

export default function UsuarioEditar() {
  const { id } = useParams<{ id: string }>();

  const {
    estado,
    formulario,
    erros,
    alterarCampo,
    salvar,
  } = useEditarUsuario(id);

  if (!id) {
    return (
      <section className="estado-vazio">
        <h1>Identificador não informado</h1>
        <Link className="botao" to="/usuarios">
          Voltar para usuários
        </Link>
      </section>
    );
  }

  if (estado.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (estado.status === "indisponivel") {
    return (
      <>
        <EstadoRequisicao
          estado="erro"
          mensagem={estado.mensagem}
        />
        <Link className="botao" to="/usuarios">
          Voltar para usuários
        </Link>
      </>
    );
  }

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Cadastro atualizado</h1>
        <p role="status">As alterações foram salvas com sucesso.</p>

        <div className="formulario-acoes">
          <Link className="botao" to="/usuarios">
            Voltar para lista
          </Link>
          <Link
            className="botao botao--primario"
            to={`/usuarios/${id}`}
          >
            Ver detalhes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Editar usuário</h1>
          <p className="pagina-descricao">
            Atualize os dados do cadastro
          </p>
        </div>
      </div>

      <FormularioUsuario
        formulario={formulario}
        erros={erros}
        salvando={estado.status === "salvando"}
        textoBotao="Salvar alterações"
        caminhoVoltar={`/usuarios/${id}`}
        mensagemErro={
          estado.status === "erro" ? estado.mensagem : undefined
        }
        onAlterar={alterarCampo}
        onSalvar={salvar}
      />
    </section>
  );
}