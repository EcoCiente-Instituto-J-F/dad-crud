function normalizarUrl(
  valor: string | undefined,
  nome: string,
): string {
  const url = valor?.trim().replace(/\/+$/, "");

  if (!url) {
    throw new Error(
      `Configure ${nome} no ambiente do frontend.`,
    );
  }

  return url;
}

export const apiConfig = {
  dad: normalizarUrl(
    import.meta.env.VITE_DAD_API_URL,
    "VITE_DAD_API_URL",
  ),

  autenticacao: normalizarUrl(
    import.meta.env.VITE_AUTH_API_URL,
    "VITE_AUTH_API_URL",
  ),

  cadastro: normalizarUrl(
    import.meta.env.VITE_CADASTRO_API_URL,
    "VITE_CADASTRO_API_URL",
  ),

  senha: normalizarUrl(
    import.meta.env.VITE_SENHA_API_URL,
    "VITE_SENHA_API_URL",
  ),
};