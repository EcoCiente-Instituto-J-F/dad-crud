import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function PrivateRoute() {
  const { estado } = useAuth();
  const location = useLocation();

  if (estado.status !== "autenticado") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          retorno: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return <Outlet />;
}