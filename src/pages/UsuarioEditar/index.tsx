import { useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import FormularioEdicaoUsuarioApi from "../../components/FormularioEdicaoUsuarioApi";

import { useUsuarioApi } from "../../hooks/useUsuarioApi";

export default function UsuarioEditar() {
  const { id } = useParams();
  const { requisicao, recarregar } = useUsuarioApi(id);

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

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Editar usuário</h1>

          <p className="pagina-descricao">
            Atualize os dados de {usuario.nome}.
          </p>
        </div>
      </div>

      <FormularioEdicaoUsuarioApi
        key={usuario.id}
        usuario={usuario}
      />
    </section>
  );
}