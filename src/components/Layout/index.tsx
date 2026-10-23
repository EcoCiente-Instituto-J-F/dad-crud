import { Suspense } from "react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  CircleHelp,
  Recycle,
  UsersRound,
} from "lucide-react";
import { Outlet } from "react-router-dom";

import Cabecalho from "../Cabecalho";
import MenuLateral from "../MenuLateral";

import type { ItemMenu } from "../../types/layout";

const itensMenu: readonly ItemMenu[] = [
  {
    id: "usuarios",
    titulo: "Usuários",
    caminho: "/usuarios",
    icone: UsersRound,
  },
  {
    id: "condominios",
    titulo: "Condomínios",
    caminho: "/condominios",
    icone: Building2,
  },
  {
    id: "coletas",
    titulo: "Coletas",
    caminho: "/coletas",
    icone: CalendarDays,
  },
  {
    id: "cooperativas",
    titulo: "Cooperativas",
    caminho: "/cooperativas",
    icone: Recycle,
  },
  {
    id: "cursos",
    titulo: "Cursos",
    caminho: "/cursos",
    icone: BookOpen,
  },
  {
    id: "quizzes",
    titulo: "Quizzes",
    caminho: "/quizzes",
    icone: CircleHelp,
  },
];

export default function Layout() {
  return (
    <div className="aplicacao">
      <Cabecalho nomeAdministrador="Admin" />

      <div className="estrutura">
        <MenuLateral itens={itensMenu} />

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
    </div>
  );
}