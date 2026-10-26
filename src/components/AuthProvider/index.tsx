import { AuthContext } from "../../contexts/AuthContext";
import { useControleSessao } from "../../hooks/useControleSessao";

import type { AuthProviderProps } from "../../types/auth";

export default function AuthProvider({ children }: AuthProviderProps) {
  const auth = useControleSessao();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}