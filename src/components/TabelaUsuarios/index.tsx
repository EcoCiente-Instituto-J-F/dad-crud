import {
  obterIniciais,
  rotulosTipoUsuario,
} from "../../utils/usuarios";

import type { TabelaUsuariosProps } from "../../types/usuario";

import { Link } from "react-router-dom";

export default function TabelaUsuarios({
  usuarios,
}: TabelaUsuariosProps) {
  if (usuarios.length === 0) {
    return (
      <div className="estado-vazio">
        <h2>Nenhum usuário encontrado</h2>
        <p>Tente pesquisar outro termo ou alterar o filtro de status.</p>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <table className="tabela-usuarios">
        <thead>
          <tr>
            <th scope="col">Nome do usuário</th>
            <th scope="col">E-mail</th>
            <th scope="col">Localidade</th>
            <th scope="col">Pontuação</th>
            <th scope="col">Tipo</th>
            <th scope="col">Status</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>
                <div className="usuario-identificacao">
                  <span className="usuario-avatar" aria-hidden="true">
                    {obterIniciais(usuario.nome)}
                  </span>

                  <Link
                    className="usuario-nome usuario-link"
                    to={`/usuarios/${usuario.id}`}
                  >
                    {usuario.nome}
                  </Link>
                </div>
              </td>

              <td>{usuario.email}</td>

              <td>
                {usuario.cidade}, {usuario.uf}
              </td>

              <td>
                {usuario.pontuacao === null ? (
                  "—"
                ) : (
                  <>
                    <strong>
                      {usuario.pontuacao.toLocaleString("pt-BR")}
                    </strong>{" "}
                    pontos
                  </>
                )}
              </td>

              <td>{rotulosTipoUsuario[usuario.tipo]}</td>

              <td>
                <span
                  className={
                    usuario.status === "ATIVO"
                      ? "status-usuario status-usuario--ativo"
                      : "status-usuario status-usuario--inativo"
                  }
                >
                  {usuario.status === "ATIVO" ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}