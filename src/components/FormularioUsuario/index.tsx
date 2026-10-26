import { Link } from "react-router-dom";

import type { FormularioUsuarioProps } from "../../types/usuario";

export default function FormularioUsuario({
  formulario,
  erros,
  salvando,
  textoBotao,
  caminhoVoltar,
  mensagemErro,
  onAlterar,
  onSalvar,
}: FormularioUsuarioProps) {
  return (
    <form
      className="painel formulario"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void onSalvar();
      }}
    >
      <fieldset disabled={salvando}>
        <legend>Dados do usuário</legend>

        <div className="formulario-grade">
          <div className="campo">
            <label htmlFor="form-usuario-nome">Nome completo</label>
            <input
              id="form-usuario-nome"
              type="text"
              autoComplete="name"
              maxLength={100}
              required
              value={formulario.nome}
              onChange={(e) => onAlterar("nome", e.target.value)}
            />
            {erros.nome && (
              <span className="erro-campo" role="alert">
                {erros.nome}
              </span>
            )}
          </div>

          <div className="campo">
            <label htmlFor="form-usuario-email">E-mail</label>
            <input
              id="form-usuario-email"
              type="email"
              autoComplete="email"
              maxLength={160}
              required
              value={formulario.email}
              onChange={(e) => onAlterar("email", e.target.value)}
            />
            {erros.email && (
              <span className="erro-campo" role="alert">
                {erros.email}
              </span>
            )}
          </div>

          <div className="campo">
            <label htmlFor="form-usuario-cidade">Cidade</label>
            <input
              id="form-usuario-cidade"
              type="text"
              autoComplete="address-level2"
              maxLength={80}
              required
              value={formulario.cidade}
              onChange={(e) => onAlterar("cidade", e.target.value)}
            />
            {erros.cidade && (
              <span className="erro-campo" role="alert">
                {erros.cidade}
              </span>
            )}
          </div>

          <div className="campo">
            <label htmlFor="form-usuario-uf">UF</label>
            <input
              id="form-usuario-uf"
              type="text"
              autoComplete="address-level1"
              maxLength={2}
              required
              value={formulario.uf}
              onChange={(e) =>
                onAlterar("uf", e.target.value.toUpperCase())
              }
            />
            {erros.uf && (
              <span className="erro-campo" role="alert">
                {erros.uf}
              </span>
            )}
          </div>

          <div className="campo">
            <label htmlFor="form-usuario-tipo">Tipo de usuário</label>
            <select
              id="form-usuario-tipo"
              value={formulario.tipo}
              onChange={(e) => {
                const valor = e.target.value;

                if (
                  valor === "MORADOR" ||
                  valor === "USUARIO_COMUM" ||
                  valor === "SINDICO" ||
                  valor === "COOPERATIVA"
                ) {
                  onAlterar("tipo", valor);
                }
              }}
            >
              <option value="USUARIO_COMUM">Usuário comum</option>
              <option value="MORADOR">Morador</option>
              <option value="SINDICO">Síndico</option>
              <option value="COOPERATIVA">Cooperativa</option>
            </select>
            {erros.tipo && (
              <span className="erro-campo" role="alert">
                {erros.tipo}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {mensagemErro && (
        <p className="erro-campo" role="alert">
          {mensagemErro}
        </p>
      )}

      {salvando && <p role="status">Salvando alterações...</p>}

      <div className="formulario-acoes">
        <Link className="botao" to={caminhoVoltar}>
          Voltar
        </Link>

        <button
          className="botao botao--primario"
          type="submit"
          disabled={salvando}
        >
          {salvando ? "Salvando..." : textoBotao}
        </button>
      </div>
    </form>
  );
}