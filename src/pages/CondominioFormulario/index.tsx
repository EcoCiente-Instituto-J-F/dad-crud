import { Link, useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import FormularioCondominio from "../../components/FormularioCondominio";
import { useFormularioCondominio } from "../../hooks/useFormularioCondominio";

import type { CondominioFormularioPaginaProps } from "../../types/condominio";

export default function CondominioFormulario({
  modo,
}: CondominioFormularioPaginaProps) {
  const { id } = useParams<{ id: string }>();

  const {
    estado,
    formulario,
    erros,
    sindicos,
    alterar,
    salvar,
  } = useFormularioCondominio(id, modo);

  if (estado.status === "carregando") {
    return (
      <EstadoRequisicao
        estado="carregando"
        mensagem="Carregando formulário..."
      />
    );
  }

  if (estado.status === "indisponivel") {
    return (
      <>
        <EstadoRequisicao estado="erro" mensagem={estado.mensagem} />
        <Link className="botao" to="/condominios">
          Voltar para condomínios
        </Link>
      </>
    );
  }

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Condomínio salvo</h1>
        <p role="status">Os dados foram salvos com sucesso.</p>

        <div className="formulario-acoes">
          <Link className="botao" to="/condominios">
            Voltar para lista
          </Link>

          <Link
            className="botao botao--primario"
            to={`/condominios/${estado.id}`}
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
          <h1 className="pagina-titulo">
            {modo === "edicao" ? "Editar condomínio" : "Cadastrar condomínio"}
          </h1>

          <p className="pagina-descricao">
            Gerencie o cadastro, o endereço, o síndico e as torres
          </p>
        </div>
      </div>

      <FormularioCondominio
        formulario={formulario}
        erros={erros}
        sindicos={sindicos}
        salvando={estado.status === "salvando"}
        mensagemErro={
          estado.status === "erro" ? estado.mensagem : undefined
        }
        caminhoVoltar={
          modo === "edicao" && id
            ? `/condominios/${id}`
            : "/condominios"
        }
        onAlterar={alterar}
        onSalvar={salvar}
      />
    </section>
  );
}