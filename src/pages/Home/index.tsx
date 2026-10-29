import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, FileImage, UsersRound } from "lucide-react";

import EstadoRequisicao from "../../components/EstadoRequisicao";

import { useAuth } from "../../hooks/useAuth";
import { useDashboardApi } from "../../hooks/useModulosApi";

import { obterIniciais } from "../../utils/usuarios";

function obterX(indice: number, quantidade: number): number {
  return quantidade <= 1
    ? 410
    : 85 + (indice / (quantidade - 1)) * 650;
}

function formatarMes(valor: string): string {
  const resultado = /^(\d{4})-(\d{2})$/.exec(valor);

  if (!resultado) return valor;

  return `${resultado[2]}/${resultado[1].slice(-2)}`;
}

export default function Home() {
  const { estado } = useAuth();
  const [periodo, setPeriodo] = useState("6");

  const { requisicao, recarregar } =
    useDashboardApi(Number(periodo));

  const nome =
    estado.status === "autenticado"
      ? estado.sessao.perfil.nome.trim().split(/\s+/)[0]
      : "";

  if (requisicao.status === "carregando") {
    return (
      <EstadoRequisicao
        estado="carregando"
        mensagem="Carregando painel..."
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

  const dados = requisicao.dados;

  const series = [
    {
      nome: "Novos usuários",
      cor: "#4c8eff",
      valores: dados.evolucao.map((mes) => mes.usuariosNovos),
    },
    {
      nome: "Novas cooperativas",
      cor: "#064e3b",
      valores: dados.evolucao.map((mes) => mes.cooperativasNovas),
    },
    {
      nome: "Postagens",
      cor: "#d64573",
      valores: dados.evolucao.map((mes) => mes.postagens),
    },
  ];

  const maiorValor = Math.max(
    1,
    ...series.flatMap((serie) => serie.valores),
  );

  function obterY(valor: number): number {
    return 260 - (valor / maiorValor) * 210;
  }

  const indicadores = [
    {
      nome: "Usuários",
      valor: dados.usuarios,
      caminho: "/usuarios",
    },
    {
      nome: "Condomínios",
      valor: dados.condominios,
      caminho: "/condominios",
    },
    {
      nome: "Cooperativas",
      valor: dados.cooperativas,
      caminho: "/cooperativas",
    },
    {
      nome: "Cursos",
      valor: dados.cursos,
      caminho: "/cursos",
    },
    {
      nome: "Quizzes",
      valor: dados.quizzes,
      caminho: "/quizzes",
    },
    {
      nome: "Agendamentos",
      valor: dados.agendamentos,
      caminho: "/coletas",
    },
  ];

  return (
    <section className="home-referencia">
      <div className="pagina-cabecalho">
        <h1 className="home-saudacao">
          Bem-vindo{nome ? "," : ""} <span>{nome}</span>
        </h1>

        <button
          className="botao"
          type="button"
          onClick={recarregar}
        >
          Atualizar painel
        </button>
      </div>

      <div className="home-resumo">
        <section className="home-card home-grafico">
          <div className="home-grafico-cabecalho">
            <div>
              <h2>Acompanhamento mensal</h2>

              <p className="pagina-descricao">
                Cadastros e postagens por mês.
              </p>
            </div>

            <label className="home-periodo">
              <span className="somente-leitor">Período</span>

              <select
                value={periodo}
                onChange={(evento) =>
                  setPeriodo(evento.target.value)
                }
              >
                <option value="3">Últimos 3 meses</option>
                <option value="6">Últimos 6 meses</option>
              </select>

              <CalendarDays size={19} aria-hidden="true" />
            </label>
          </div>

          <div className="home-legenda">
            {series.map((serie) => (
              <span key={serie.nome}>
                <i
                  style={{ background: serie.cor }}
                  aria-hidden="true"
                />
                {serie.nome}
              </span>
            ))}
          </div>

          {dados.evolucao.length === 0 ? (
            <div className="estado-vazio">
              <p>Não há dados de evolução neste período.</p>
            </div>
          ) : (
            <svg
              className="home-chart"
              viewBox="0 0 800 320"
              role="img"
              aria-label="Evolução mensal dos cadastros e postagens"
            >
              {[0, 1 / 3, 2 / 3, 1].map((fracao) => {
                const valor = maiorValor * fracao;
                const y = obterY(valor);

                return (
                  <g key={fracao}>
                    <line
                      x1="75"
                      x2="755"
                      y1={y}
                      y2={y}
                      stroke="#e4ebe6"
                    />

                    <text
                      x="8"
                      y={y + 5}
                      fill="#8492a7"
                      fontSize="13"
                    >
                      {valor.toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                      })}
                    </text>
                  </g>
                );
              })}

              {dados.evolucao.map((mes, indice) => (
                <text
                  key={mes.mes}
                  x={obterX(indice, dados.evolucao.length)}
                  y="299"
                  textAnchor="middle"
                  fill="#8492a7"
                  fontSize="14"
                >
                  {formatarMes(mes.mes)}
                </text>
              ))}

              {series.map((serie) => (
                <g key={serie.nome}>
                  <polyline
                    points={serie.valores
                      .map(
                        (valor, indice) =>
                          `${obterX(
                            indice,
                            serie.valores.length,
                          )},${obterY(valor)}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke={serie.cor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {serie.valores.map((valor, indice) => (
                    <circle
                      key={indice}
                      cx={obterX(indice, serie.valores.length)}
                      cy={obterY(valor)}
                      r="3"
                      fill={serie.cor}
                    />
                  ))}
                </g>
              ))}
            </svg>
          )}
        </section>

        <div className="home-estatisticas">
          <section className="home-card home-estatistica">
            <div className="home-estatistica-titulo">
              <span className="home-estatistica-icone">
                <UsersRound size={23} aria-hidden="true" />
              </span>

              <h2>Usuários cadastrados hoje</h2>
            </div>

            <div className="home-estatistica-numero">
              <strong>
                {dados.usuariosCadastradosHoje.toLocaleString("pt-BR")}
              </strong>
            </div>
          </section>

          <section className="home-card home-estatistica">
            <div className="home-estatistica-titulo">
              <span className="home-estatistica-icone">
                <FileImage size={23} aria-hidden="true" />
              </span>

              <h2>Postagens hoje</h2>
            </div>

            <div className="home-estatistica-numero">
              <strong>
                {dados.postagensHoje.toLocaleString("pt-BR")}
              </strong>
            </div>
          </section>
        </div>
      </div>

      <div className="home-totais-api">
        {indicadores.map((indicador) => (
          <Link
            className="home-card home-total-api"
            key={indicador.caminho}
            to={indicador.caminho}
          >
            <span>{indicador.nome}</span>

            <strong>
              {indicador.valor.toLocaleString("pt-BR")}
            </strong>
          </Link>
        ))}
      </div>

      <section className="home-card home-recentes">
        <h2>Usuários recentes</h2>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">E-mail</th>
                <th scope="col">Tipo</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>

            <tbody>
              {dados.usuariosRecentes.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>

                  <td>
                    <Link
                      className="home-usuario"
                      to={`/usuarios/${usuario.id}`}
                    >
                      <span
                        className="home-usuario-avatar"
                        aria-hidden="true"
                      >
                        {obterIniciais(usuario.nome)}
                      </span>

                      <span>{usuario.nome}</span>
                    </Link>
                  </td>

                  <td>{usuario.email}</td>
                  <td>{usuario.tipo}</td>
                  <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>
                </tr>
              ))}

              {dados.usuariosRecentes.length === 0 && (
                <tr>
                  <td colSpan={5}>Nenhum usuário cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}