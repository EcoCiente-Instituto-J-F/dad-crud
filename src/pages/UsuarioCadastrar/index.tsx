import { Link } from "react-router-dom";

import { useCadastroUsuario } from "../../hooks/useCadastroUsuario";

export default function UsuarioCadastrar() {
  const {
    formulario,
    erros,
    estado,
    alterarCampo,
    salvar,
  } = useCadastroUsuario();

  if (estado.status === "sucesso") {
    return (
      <section className="painel estado-vazio">
        <h1>Usuário cadastrado</h1>

        <p role="status">
          O cadastro de {estado.usuario.nome} foi salvo com sucesso.
        </p>

        <div className="formulario-acoes">
          <Link className="botao" to="/usuarios">
            Voltar para lista
          </Link>

          <Link
            className="botao botao--primario"
            to={`/usuarios/${estado.usuario.id}`}
          >
            Ver detalhes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Cadastrar usuário</h1>
          <p className="pagina-descricao">
            Preencha os dados do novo usuário
          </p>
        </div>
      </div>

      <form
        className="painel formulario"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          void salvar();
        }}
      >
        <fieldset disabled={estado.status === "salvando"}>
          <legend>Dados do usuário</legend>

          <div className="formulario-grade">
            <div className="campo">
              <label htmlFor="usuario-nome">Nome completo</label>
              <input
                id="usuario-nome"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
                value={formulario.nome}
                onChange={(e) => alterarCampo("nome", e.target.value)}
              />
              {erros.nome && (
                <span className="erro-campo" role="alert">
                  {erros.nome}
                </span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="usuario-email">E-mail</label>
              <input
                id="usuario-email"
                type="email"
                autoComplete="email"
                maxLength={160}
                required
                value={formulario.email}
                onChange={(e) => alterarCampo("email", e.target.value)}
              />
              {erros.email && (
                <span className="erro-campo" role="alert">
                  {erros.email}
                </span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="usuario-cidade">Cidade</label>
              <input
                id="usuario-cidade"
                type="text"
                autoComplete="address-level2"
                maxLength={80}
                required
                value={formulario.cidade}
                onChange={(e) => alterarCampo("cidade", e.target.value)}
              />
              {erros.cidade && (
                <span className="erro-campo" role="alert">
                  {erros.cidade}
                </span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="usuario-uf">UF</label>
              <input
                id="usuario-uf"
                type="text"
                autoComplete="address-level1"
                placeholder="SP"
                maxLength={2}
                required
                value={formulario.uf}
                onChange={(e) =>
                  alterarCampo("uf", e.target.value.toUpperCase())
                }
              />
              {erros.uf && (
                <span className="erro-campo" role="alert">
                  {erros.uf}
                </span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="usuario-tipo">Tipo de usuário</label>
              <select
                id="usuario-tipo"
                value={formulario.tipo}
                onChange={(e) => {
                  const valor = e.target.value;

                  if (
                    valor === "MORADOR" ||
                    valor === "USUARIO_COMUM" ||
                    valor === "SINDICO" ||
                    valor === "COOPERATIVA"
                  ) {
                    alterarCampo("tipo", valor);
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

        {estado.status === "erro" && (
          <p className="erro-campo" role="alert">
            {estado.mensagem}
          </p>
        )}

        {estado.status === "salvando" && (
          <p role="status">Salvando usuário...</p>
        )}

        <div className="formulario-acoes">
          <Link className="botao" to="/usuarios">
            Voltar
          </Link>

          <button
            className="botao botao--primario"
            type="submit"
            disabled={estado.status === "salvando"}
          >
            {estado.status === "salvando" ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </section>
  );
}