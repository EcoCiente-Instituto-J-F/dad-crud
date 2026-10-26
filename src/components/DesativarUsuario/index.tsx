import { useDesativarUsuario } from "../../hooks/useDesativarUsuario";

import type { DesativarUsuarioProps } from "../../types/usuario";

export default function DesativarUsuario({
  usuarioId,
  onDesativado,
}: DesativarUsuarioProps) {
  const {
    estado,
    abrirConfirmacao,
    cancelar,
    confirmar,
  } = useDesativarUsuario(usuarioId, onDesativado);

  if (estado.status === "inicial") {
    return (
      <button
        type="button"
        className="botao botao--perigo"
        onClick={abrirConfirmacao}
      >
        Desativar usuário
      </button>
    );
  }

  if (estado.status === "sucesso") {
    return <p role="status">Usuário desativado com sucesso.</p>;
  }

  return (
    <section className="confirmacao-desativacao">
      <h2>Desativar este usuário?</h2>

      <p>
        O cadastro será mantido e passará a aparecer como inativo.
      </p>

      {estado.status === "erro" && (
        <p className="erro-campo" role="alert">
          {estado.mensagem}
        </p>
      )}

      {estado.status === "salvando" && (
        <p role="status">Desativando usuário...</p>
      )}

      <div className="acoes-pagina">
        <button
          type="button"
          className="botao"
          onClick={cancelar}
          disabled={estado.status === "salvando"}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="botao botao--perigo"
          onClick={() => void confirmar()}
          disabled={estado.status === "salvando"}
        >
          Confirmar desativação
        </button>
      </div>
    </section>
  );
}