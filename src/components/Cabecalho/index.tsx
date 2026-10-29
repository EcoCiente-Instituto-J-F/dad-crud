import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { normalizarPesquisa, obterIniciais } from "../../utils/usuarios";

const modulos = [
  { id: "home", nome: "Início", caminho: "/home" },
  { id: "usuarios", nome: "Usuários", caminho: "/usuarios" },
  { id: "condominios", nome: "Condomínios", caminho: "/condominios" },
  { id: "cooperativas", nome: "Cooperativas", caminho: "/cooperativas" },
  { id: "cursos", nome: "Cursos e aulas", caminho: "/cursos" },
  { id: "quizzes", nome: "Quizzes", caminho: "/quizzes" },
  { id: "coletas", nome: "Coletas", caminho: "/coletas" },
  { id: "perfil", nome: "Meu perfil", caminho: "/perfil" },
];

export default function Cabecalho() {
  const { estado } = useAuth();
  const [busca, setBusca] = useState("");

  const perfil = estado.status === "autenticado"
    ? estado.sessao.perfil
    : null;

  const resultados = busca.trim()
    ? modulos.filter((modulo) =>
      normalizarPesquisa(modulo.nome).includes(normalizarPesquisa(busca)),
    )
    : [];

  return (
    <header className="cabecalho">
      <Link
        className="marca"
        to="/home"
        aria-label="EcoCiente — início"
      >
        <img
          className="marca__logo"
          src="/ecociente-logo.png"
          alt="EcoCiente"
        />
      </Link>
      
      <div className="busca-global">
        <label className="somente-leitor" htmlFor="busca-modulos">
          Pesquisar módulos
        </label>

        <div className="busca-global-campo">
          <Search size={20} aria-hidden="true" />

          <input
            id="busca-modulos"
            type="search"
            placeholder="Pesquisar módulos"
            maxLength={80}
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        {busca.trim() && (
          <div className="busca-global-resultados">
            {resultados.length === 0 ? (
              <p>Nenhum módulo encontrado.</p>
            ) : (
              resultados.map((modulo) => (
                <Link
                  key={modulo.id}
                  to={modulo.caminho}
                  onClick={() => setBusca("")}
                >
                  {modulo.nome}
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <Link className="perfil perfil-link" to="/perfil">
        {perfil?.avatar ? (
          <img
            className="perfil__avatar"
            src={perfil.avatar}
            alt=""
          />
        ) : (
          <span className="perfil__avatar">
            {obterIniciais(perfil?.nome ?? "Admin")}
          </span>
        )}

        <span>Admin</span>
      </Link>
    </header>
  );
}