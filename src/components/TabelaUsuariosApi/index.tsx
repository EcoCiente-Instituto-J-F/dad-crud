import { Link } from "react-router-dom";

import { obterIniciais } from "../../utils/usuarios";

import type { UsuarioApi } from "../../types/usuarioApi";

interface TabelaUsuariosApiProps {
  usuarios: readonly UsuarioApi[];
}

export default function TabelaUsuariosApi({
  usuarios,
}: TabelaUsuariosApiProps) {
  if (usuarios.length === 0) {
    return (
      <div className="estado-vazio">
        <h2>Nenhum usuário encontrado</h2>
        <p>Altere os filtros para tentar novamente.</p>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <table className="tabela-usuarios">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome</th>
            <th scope="col">E-mail</th>
            <th scope="col">CPF</th>
            <th scope="col">Tipo</th>
            <th scope="col">Cidade / UF</th>
            <th scope="col">Situação</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>

              <td>
                <Link
                  className="usuario-identificacao usuario-link"
                  to={`/usuarios/${usuario.id}`}
                >
                  <span className="usuario-avatar" aria-hidden="true">
                    {obterIniciais(usuario.nome)}
                  </span>

                  <span className="usuario-nome">
                    {usuario.nome}
                  </span>
                </Link>
              </td>

              <td>{usuario.email}</td>
              <td>{usuario.cpfMascarado || "—"}</td>
              <td>{usuario.tipoUsuario}</td>

              <td>
                {[
                  usuario.endereco?.cidade,
                  usuario.endereco?.uf,
                ]
                  .filter(Boolean)
                  .join(" / ") || "—"}
              </td>

              <td>
                <span
                  className={`status-usuario status-usuario--${usuario.ativo ? "ativo" : "inativo"
                    }`}
                >
                  {usuario.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}