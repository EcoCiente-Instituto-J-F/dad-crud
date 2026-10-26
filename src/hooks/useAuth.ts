import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";

import type { AuthContextValue } from "../types/auth";

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
  }

  return contexto;
}