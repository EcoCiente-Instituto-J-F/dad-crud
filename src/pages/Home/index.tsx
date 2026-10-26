import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  MoreVertical,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import EstadoRequisicao from "../../components/EstadoRequisicao";
import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
import {
  obterIniciais,
  rotulosTipoUsuario,
} from "../../utils/usuarios";

const series = [
  {
    nome: "Síndico",
    cor: "#4c8eff",
    valores: [52, 56, 50, 60, 58, 61, 47, 50, 48, 40, 42, 50],
  },
  {
    nome: "Usuário",
    cor: "#064e3b",
    valores: [45, 48, 43, 52, 51, 54, 40, 42, 41, 33, 35, 43],
  },
  {
    nome: "Cooperativa",
    cor: "#d64573",
    valores: [41, 52, 46, 44, 45, 39, 30, 34, 35, 42, 38, 39],
  },
];

function pontos(valores: number[]): string {
  return valores
    .map((valor, indice) => {
      const x = 64 + (indice / (valores.length - 1)) * 696;
      const y = 260 - ((valor - 30) / 35) * 210;

      return `${x},${y}`;
    })
    .join(" ");
}

export default function Home() {
  const { estado } = useAuth();
  const { requisicao, recarregar } = useDashboard();
  const [periodo, setPeriodo] = useState("6");

  const nome =
    estado.status === "autenticado"
      ? estado.sessao.perfil.nome.split(" ")[0]
      : "Admin";

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

  const usuarios = requisicao.dados.usuarios.slice(0, 5);
  const quantidade = periodo === "3" ? 6 : 12;

  return (
    <section className="home-referencia">
      <h1 className="home-saudacao">
        Bem-vindo, <span>{nome}</span>
      </h1>

      <div className="home-resumo">
        <section className="home-card home-grafico">
          <div className="home-grafico-cabecalho">
            <div>
              <h2>Acompanhamento Mensal - Usuários</h2>

              <span className="home-crescimento">
                <TrendingUp size={14} />
                23,5%
              </span>
            </div>

            <label className="home-periodo">
              <span className="somente-leitor">Período do gráfico</span>

              <select
                value={periodo}
                onChange={(evento) => setPeriodo(evento.target.value)}
              >
                <option value="6">Últimos 6 meses</option>
                <option value="3">Últimos 3 meses</option>
              </select>

              <CalendarDays size={19} aria-hidden="true" />
            </label>
          </div>

          <div className="home-legenda">
            {series.map((serie) => (
              <span key={serie.nome}>
                <i style={{ background: serie.cor }} />
                {serie.nome}
              </span>
            ))}
          </div>

          <svg
            className="home-chart"
            viewBox="0 0 800 320"
            role="img"
            aria-label="Gráfico demonstrativo de acompanhamento mensal de usuários"
          >
            {[60, 50, 40, 30].map((valor) => (
              <text
                key={valor}
                x="8"
                y={265 - ((valor - 30) / 35) * 210}
                fill="#8492a7"
                fontSize="15"
              >
                {valor}k
              </text>
            ))}

            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"].map(
              (mes, indice) => (
                <g key={mes}>
                  <rect
                    x={64 + indice * 116}
                    y="50"
                    width="50"
                    height="210"
                    rx="7"
                    fill={indice === 3 ? "#f2c9d7" : "#dfeade"}
                  />

                  <text
                    x={89 + indice * 116}
                    y="299"
                    textAnchor="middle"
                    fill="#8492a7"
                    fontSize="15"
                  >
                    {mes}
                  </text>
                </g>
              ),
            )}

            {series.map((serie) => (
              <polyline
                key={serie.nome}
                points={pontos(serie.valores.slice(-quantidade))}
                fill="none"
                stroke={serie.cor}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          <small className="home-dados-demo">
            Dados demonstrativos
          </small>
        </section>

        <div className="home-estatisticas">
          <section className="home-card home-estatistica">
            <div className="home-estatistica-titulo">
              <span className="home-estatistica-icone">
                <UsersRound size={25} />
              </span>

              <div>
                <h2>Novos Usuários</h2>
                <span className="home-data">Dados demonstrativos</span>
              </div>

              <MoreVertical
                className="home-mais"
                size={21}
                aria-hidden="true"
              />
            </div>

            <div className="home-estatistica-numero">
              <strong>12.0123</strong>

              <div className="home-mini-barras" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>

            <p className="home-variacao">
              <span>- 0,5%</span> a menos que ontem
            </p>
          </section>

          <section className="home-card home-estatistica">
            <div className="home-estatistica-titulo">
              <span className="home-estatistica-icone">
                <Camera size={27} />
              </span>

              <h2>Fotos enviadas</h2>

              <MoreVertical
                className="home-mais"
                size={21}
                aria-hidden="true"
              />
            </div>

            <div className="home-estatistica-numero">
              <strong>256</strong>
            </div>

            <p className="home-variacao">
              <span>+ 1,0%</span> a mais que ontem
            </p>
          </section>
        </div>
      </div>

      <section className="home-card home-recentes">
        <h2>Usuários Recentes</h2>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo usuário</th>
                <th>Pontos</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario, indice) => (
                <tr key={usuario.id}>
                  <td>{String(indice + 1).padStart(2, "0")}</td>

                  <td>
                    <Link
                      className="home-usuario"
                      to={`/usuarios/${usuario.id}`}
                    >
                      <span className="home-usuario-avatar">
                        {obterIniciais(usuario.nome)}
                      </span>

                      <span>
                        {usuario.nome}
                        <small>#{usuario.id}</small>
                      </span>
                    </Link>
                  </td>

                  <td>{usuario.email}</td>
                  <td>{rotulosTipoUsuario[usuario.tipo]}</td>
                  <td>{usuario.pontuacao ?? "—"}</td>
                </tr>
              ))}

              {usuarios.length === 0 && (
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