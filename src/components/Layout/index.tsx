import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  House,
  LogOut,
  Recycle,
  UsersRound,
} from "lucide-react";

import Cabecalho from "../Cabecalho";
import MenuLateral from "../MenuLateral";
import Modal from "../Modal";
import { useAuth } from "../../hooks/useAuth";

import type { ItemMenu } from "../../types/layout";

const itensMenu: readonly ItemMenu[] = [
  { id: "home", titulo: "Início", caminho: "/home", icone: House },
  { id: "usuarios", titulo: "Usuários", caminho: "/usuarios", icone: UsersRound },
  { id: "condominios", titulo: "Condomínios", caminho: "/condominios", icone: Building2 },
  { id: "coletas", titulo: "Coletas", caminho: "/coletas", icone: CalendarDays },
  { id: "cooperativas", titulo: "Cooperativas", caminho: "/cooperativas", icone: Recycle },
  { id: "cursos", titulo: "Cursos e aulas", caminho: "/cursos", icone: BookOpen },
  { id: "quizzes", titulo: "Quizzes", caminho: "/quizzes", icone: CircleHelp },
];

export default function Layout() {
  const { sair } = useAuth();
  const navigate = useNavigate();
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="aplicacao">
      <Cabecalho />

      <div
        className={`estrutura estrutura--menu-${menuAberto ? "aberto" : "fechado"}`}
      >
        <aside
          className={`barra-lateral sidebar-nova ${menuAberto ? "sidebar-nova--aberta" : ""}`}
          aria-label="Navegação do painel"
        >
          <button
            type="button"
            className="sidebar-alternar"
            aria-expanded={menuAberto}
            aria-controls="navegacao-painel"
            aria-label={menuAberto ? "Recolher menu" : "Expandir menu"}
            title={menuAberto ? "Recolher menu" : "Expandir menu"}
            onClick={() => setMenuAberto((anterior) => !anterior)}
          >
            {menuAberto
              ? <ChevronLeft size={19} aria-hidden="true" />
              : <ChevronRight size={19} aria-hidden="true" />}
          </button>

          <div id="navegacao-painel" className="sidebar-navegacao">
            <MenuLateral itens={itensMenu} />
          </div>

          <div className="sidebar-rodape">
            <button
              type="button"
              className="sair-painel"
              aria-label="Sair da conta"
              title="Sair da conta"
              onClick={() => setConfirmarSaida(true)}
            >
              <LogOut size={22} aria-hidden="true" />
              <span className="sidebar-texto">Sair</span>
            </button>
          </div>
        </aside>

        <main className="conteudo">
          <Suspense
            fallback={
              <p className="mensagem-carregamento" role="status">
                Carregando página...
              </p>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      <footer className="rodape">
        EcoCiente — dados que despertam consciência
      </footer>

      <Modal
        aberto={confirmarSaida}
        titulo="Sair do perfil"
        onFechar={() => setConfirmarSaida(false)}
      >
        <p>Tem certeza de que deseja sair da sua conta?</p>

        <div className="formulario-acoes">
          <button
            type="button"
            className="botao"
            onClick={() => setConfirmarSaida(false)}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="botao botao--primario"
            onClick={() => {
              sair();
              navigate("/login", { replace: true });
            }}
          >
            Sair
          </button>
        </div>
      </Modal>
    </div>
  );
}