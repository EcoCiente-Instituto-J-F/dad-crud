import { Link, useParams } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useCondominio } from "../../hooks/useCondominio";

export default function CondominioDetalhes() {
  const { id } = useParams<{ id: string }>();

  const {
    requisicao,
    acao,
    abrirConfirmacao,
    cancelar,
    confirmar,
    recarregar,
  } = useCondominio(id);

  if (!id) {
    return (
      <section className="estado-vazio">
        <h1>Identificador ausente</h1>
        <Link className="botao" to="/condominios">Voltar</Link>
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
        <Link className="botao" to="/condominios">Voltar</Link>
      </>
    );
  }

  const { condominio, sindicos } = requisicao.dados;

  if (!condominio) {
    return (
      <section className="painel estado-vazio">
        <h1>Condomínio não encontrado</h1>
        <Link className="botao" to="/condominios">Voltar</Link>
      </section>
    );
  }

  const sindico = sindicos.find(
    (usuario) => usuario.id === condominio.sindicoId,
  );

  const confirmando =
    acao.status === "confirmando" ||
    acao.status === "salvando" ||
    acao.status === "erro";

  const rotuloStatus =
    condominio.status === "ATIVO" ? "Desativar" : "Ativar";

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{condominio.nome}</h1>

          <p className="pagina-descricao">
            {condominio.tipo} · Código {condominio.codigoAcesso}
          </p>
        </div>

        <div className="acoes-pagina">
          <Link className="botao" to="/condominios">Voltar</Link>

          <Link
            className="botao botao--primario"
            to={`/condominios/${condominio.id}/editar`}
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="indicadores">
        <div className="painel indicador">
          <strong>{condominio.moradores}</strong>
          <span>Moradores</span>
        </div>

        <div className="painel indicador">
          <strong>{condominio.torres.length}</strong>
          <span>Torres</span>
        </div>

        <div className="painel indicador">
          <strong>
            {condominio.status === "ATIVO" ? "Ativo" : "Inativo"}
          </strong>
          <span>Status</span>
        </div>
      </div>

      <div className="painel formulario">
        <h2>Cadastro e endereço</h2>

        <dl className="detalhes-grade">
          <div>
            <dt>CNPJ</dt>
            <dd>{condominio.cnpj}</dd>
          </div>

          <div>
            <dt>Síndico responsável</dt>
            <dd>
              {sindico?.nome ?? (
                condominio.sindicoId
                  ? "Vínculo existente — usuário indisponível"
                  : "Sem síndico vinculado"
              )}
            </dd>
          </div>

          <div>
            <dt>Endereço</dt>
            <dd>
              {condominio.logradouro}, {condominio.numero}
              {condominio.complemento
                ? ` — ${condominio.complemento}`
                : ""}
            </dd>
          </div>

          <div>
            <dt>Bairro</dt>
            <dd>{condominio.bairro}</dd>
          </div>

          <div>
            <dt>Cidade / UF</dt>
            <dd>{condominio.cidade} / {condominio.uf}</dd>
          </div>

          <div>
            <dt>CEP</dt>
            <dd>{condominio.cep}</dd>
          </div>
        </dl>

        <section className="secao-formulario">
          <h2>Torres</h2>

          {condominio.torres.length === 0 ? (
            <p>Este condomínio não possui torres cadastradas.</p>
          ) : (
            <ul className="torres-resumo">
              {condominio.torres.map((torre) => (
                <li key={torre.id}>
                  <strong>{torre.nome}</strong>
                  <span>{torre.moradores} moradores</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="area-desativacao">
          {acao.status === "sucesso" && (
            <p role="status">{acao.mensagem}</p>
          )}

          {!confirmando ? (
            <button
              type="button"
              className="botao botao--perigo"
              onClick={abrirConfirmacao}
            >
              {rotuloStatus} condomínio
            </button>
          ) : (
            <div className="confirmacao-desativacao">
              <h2>{rotuloStatus} este condomínio?</h2>

              <p>Os dados do cadastro serão preservados.</p>

              {acao.status === "erro" && (
                <p className="erro-campo" role="alert">
                  {acao.mensagem}
                </p>
              )}

              {acao.status === "salvando" && (
                <p role="status">Atualizando status...</p>
              )}

              <div className="acoes-pagina">
                <button
                  type="button"
                  className="botao"
                  onClick={cancelar}
                  disabled={acao.status === "salvando"}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="botao botao--perigo"
                  onClick={() => void confirmar()}
                  disabled={acao.status === "salvando"}
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}