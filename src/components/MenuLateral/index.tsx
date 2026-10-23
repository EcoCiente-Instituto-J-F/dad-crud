import { NavLink } from "react-router-dom";

import type { MenuLateralProps } from "../../types/layout";

export default function MenuLateral({
  itens,
}: MenuLateralProps) {
  return (
    <nav className="menu-lateral" aria-label="Menu principal">
      {itens.map((item) => {
        const Icone = item.icone;

        return (
          <NavLink
            key={item.id}
            to={item.caminho}
            title={item.titulo}
            aria-label={item.titulo}
            className={({ isActive }) =>
              isActive
                ? "menu-lateral__link menu-lateral__link--ativo"
                : "menu-lateral__link"
            }
          >
            <Icone size={23} strokeWidth={1.8} />
          </NavLink>
        );
      })}
    </nav>
  );
}