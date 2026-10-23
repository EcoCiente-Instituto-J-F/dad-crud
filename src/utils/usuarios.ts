import type {
  FiltrosUsuarios,
  TipoUsuario,
  Usuario,
} from "../types/usuario";

export const rotulosTipoUsuario: Record<TipoUsuario, string> = {
  MORADOR: "Morador",
  USUARIO_COMUM: "Usuário comum",
  SINDICO: "Síndico",
  COOPERATIVA: "Cooperativa",
};

export function normalizarPesquisa(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function obterIniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join("")
    .toUpperCase();
}

export function filtrarEOrdenarUsuarios(
  usuarios: readonly Usuario[],
  filtros: FiltrosUsuarios,
): Usuario[] {
  const busca = normalizarPesquisa(filtros.busca);

  const filtrados = usuarios.filter((usuario) => {
    const correspondeStatus =
      filtros.status === "TODOS" ||
      usuario.status === filtros.status;

    const textoPesquisa = normalizarPesquisa(
      [
        usuario.nome,
        usuario.email,
        usuario.cidade,
        usuario.uf,
        rotulosTipoUsuario[usuario.tipo],
      ].join(" "),
    );

    return correspondeStatus && textoPesquisa.includes(busca);
  });

  return filtrados.sort((primeiro, segundo) => {
    const comparacao = primeiro.nome.localeCompare(
      segundo.nome,
      "pt-BR",
    );

    return filtros.ordenacao === "NOME_ASC"
      ? comparacao
      : -comparacao;
  });
}