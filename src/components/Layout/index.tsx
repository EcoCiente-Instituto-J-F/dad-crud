import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  BookOpen,
  Building2,
  CalendarDays,
  CircleHelp,
  House,
  LogOut,
  Recycle,
  UserRound,
  UsersRound,
} from "lucide-react";

import Acessibilidade from "../PainelAcessibilidade";
import MascoteEko from "../MascoteEko";
import RecursosLeitura from "../RecursosLeitura";
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
  { id: "cursos", titulo: "Cursos", caminho: "/cursos", icone: BookOpen },
  { id: "quizzes", titulo: "Quizzes", caminho: "/quizzes", icone: CircleHelp },
  { id: "perfil", titulo: "Meu perfil", caminho: "/perfil", icone: UserRound },
];

export default function Layout() {
  const { sair } = useAuth();
  const navigate = useNavigate();
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  return (
    <div className="aplicacao">
      <a className="link-pular-conteudo" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>
      <Cabecalho />

      <div className="estrutura">
        <aside className="barra-lateral">
          <MenuLateral itens={itensMenu} />

          <button
            type="button"
            className="sair-painel"
            aria-label="Sair da conta"
            title="Sair da conta"
            onClick={() => setConfirmarSaida(true)}
          >
            <LogOut size={23} />
          </button>
        </aside>

        <main className="conteudo" id="conteudo-principal" tabIndex={-1}>
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

      <Acessibilidade />
      <RecursosLeitura />
      <MascoteEko />

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