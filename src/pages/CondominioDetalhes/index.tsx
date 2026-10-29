import { useState } from "react";
import { useParams } from "react-router-dom";

import EditorModuloApi from "../../components/EditorModuloApi";
import EstadoRequisicao from "../../components/EstadoRequisicao";

import { useCondominioApi } from "../../hooks/useModulosApi";
import { useSituacaoCondominio } from "../../hooks/useSituacaoCondominio";

export default function CondominioDetalhes() {
  const { id } = useParams();

  const consulta = useCondominioApi(id);
  const situacao = useSituacaoCondominio();
  const [versao, setVersao] = useState(0);

  if (consulta.requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (consulta.requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={consulta.requisicao.mensagem}
        onTentarNovamente={consulta.recarregar}
      />
    );
  }

  const condominio = consulta.requisicao.dados;

  return (
    <>
      <EditorModuloApi
        key={versao}
        modulo="condominios"
        leitura
      />

      <section className="painel formulario espaco-superior">
        <h2>Situação do condomínio</h2>

        <p>{condominio.ativo ? "Ativo" : "Inativo"}</p>

        {situacao.mensagem && (
          <p className="mensagem-erro" role="alert">
            {situacao.mensagem}
          </p>
        )}

        <button
          type="button"
          className={
            condominio.ativo
              ? "botao botao--perigo"
              : "botao botao--primario"
          }
          disabled={situacao.salvando}
          onClick={() => {
            const verbo = condominio.ativo ? "desativar" : "ativar";

            if (window.confirm(`Deseja ${verbo} este condomínio?`)) {
              void situacao.alterar(
                condominio.id,
                !condominio.ativo,
                () => {
                  consulta.recarregar();
                  setVersao((valor) => valor + 1);
                },
              );
            }
          }}
        >
          {situacao.salvando
            ? "Salvando..."
            : condominio.ativo
              ? "Desativar"
              : "Ativar"}
        </button>
      </section>
    </>
  );
}