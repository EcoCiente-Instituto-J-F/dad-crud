import { NavLink } from "react-router-dom";

import type { MenuLateralProps } from "../../types/layout";

export default function MenuLateral({ itens }: MenuLateralProps) {
  return (
    <nav className="menu-lateral" aria-label="Menu principal">
      {itens.map((item) => {
        const Icone = item.icone;

        return (
          <NavLink
            key={item.id}
            to={item.caminho}
            end={item.caminho === "/home"}
            title={item.titulo}
            aria-label={item.titulo}
            className={({ isActive }) =>
              isActive
                ? "menu-lateral__link menu-lateral__link--ativo"
                : "menu-lateral__link"
            }
          >
            <span className="sidebar-icone">
              <Icone size={22} strokeWidth={1.8} aria-hidden="true" />
            </span>

            <span className="sidebar-texto">{item.titulo}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}