import { useState } from "react";
import { Link } from "react-router-dom";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useCursos } from "../../hooks/useCursos";
import { normalizarPesquisa } from "../../utils/usuarios";

export default function Cursos() {
  const { requisicao, recarregar } = useCursos();
  const [busca, setBusca] = useState("");

  const cursos = requisicao.status === "sucesso"
    ? requisicao.dados.filter((curso) =>
        normalizarPesquisa(curso.titulo).includes(normalizarPesquisa(busca)),
      )
    : [];

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Cursos</h1>
          <p className="pagina-descricao">Gerencie cursos e aulas</p>
        </div>

        <Link className="botao botao--primario" to="/cursos/cadastrar">
          Cadastrar curso
        </Link>
      </div>

      <div className="campo filtro-simples">
        <label htmlFor="busca-cursos">Pesquisar cursos</label>
        <input
          id="busca-cursos"
          className="entrada"
          type="search"
          value={busca}
          maxLength={120}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </div>

      {requisicao.status === "carregando" && (
        <EstadoRequisicao estado="carregando" />
      )}

      {requisicao.status === "erro" && (
        <EstadoRequisicao
          estado="erro"
          mensagem={requisicao.mensagem}
          onTentarNovamente={recarregar}
        />
      )}

      {requisicao.status === "sucesso" && (
        <>
          <p role="status">{cursos.length} curso(s) encontrado(s).</p>

          <div className="grade-cards">
            {cursos.map((curso) => (
              <article className="painel card-conteudo" key={curso.id}>
                <span className="material-etiqueta">
                  {curso.ativo ? "Ativo" : "Inativo"}
                </span>
                <h2>{curso.titulo}</h2>
                <p className="texto-resumo">{curso.descricao}</p>
                <p>{curso.aulas.length} aula(s)</p>

                <Link className="botao" to={`/cursos/${curso.id}`}>
                  Ver detalhes
                </Link>
              </article>
            ))}
          </div>

          {cursos.length === 0 && (
            <div className="painel estado-vazio">
              <h2>Nenhum curso encontrado</h2>
              <p>Cadastre um curso ou altere a pesquisa.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}