import { Link } from "react-router-dom";

import Campo from "../Campo";
import { useEdicaoUsuarioApi } from "../../hooks/useEdicaoUsuarioApi";

import type { UsuarioApi } from "../../types/usuarioApi";

interface FormularioEdicaoUsuarioApiProps {
  usuario: UsuarioApi;
}

export default function FormularioEdicaoUsuarioApi({
  usuario,
}: FormularioEdicaoUsuarioApiProps) {
  const {
    formulario,
    erros,
    mensagem,
    salvando,
    alterar,
    salvar,
  } = useEdicaoUsuarioApi(usuario);

  return (
    <form
      className="painel formulario"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void salvar();
      }}
    >
      <fieldset disabled={salvando}>
        <legend>Dados pessoais</legend>

        <div className="formulario-grade">
          <Campo
            id="editar-nome"
            titulo="Nome completo"
            valor={formulario.nome}
            maximo={100}
            erro={erros.nome}
            onChange={(valor) => alterar("nome", valor)}
          />

          <Campo
            id="editar-email"
            titulo="E-mail"
            tipo="email"
            valor={formulario.email}
            maximo={255}
            erro={erros.email}
            onChange={(valor) => alterar("email", valor)}
          />

          <div className="campo">
            <label htmlFor="editar-cpf">CPF</label>

            <input
              id="editar-cpf"
              value={usuario.cpfMascarado ?? ""}
              placeholder="Não informado"
              readOnly
            />
          </div>

          <div className="campo">
            <label htmlFor="editar-tipo">Tipo de usuário</label>

            <input
              id="editar-tipo"
              value={usuario.tipoUsuario}
              readOnly
            />
          </div>

          <div className="campo">
            <label htmlFor="editar-nascimento">
              Data de nascimento
            </label>

            <input
              id="editar-nascimento"
              type="date"
              value={formulario.dataNascimento}
              aria-invalid={Boolean(erros.dataNascimento)}
              aria-describedby={
                erros.dataNascimento
                  ? "editar-nascimento-erro"
                  : undefined
              }
              onChange={(evento) =>
                alterar("dataNascimento", evento.target.value)
              }
            />

            {erros.dataNascimento && (
              <span
                id="editar-nascimento-erro"
                className="erro-campo"
                role="alert"
              >
                {erros.dataNascimento}
              </span>
            )}
          </div>

          <Campo
            id="editar-avatar"
            titulo="URL da foto — opcional"
            valor={formulario.avatar}
            maximo={500}
            erro={erros.avatar}
            onChange={(valor) => alterar("avatar", valor)}
          />
        </div>

        <p className="pagina-descricao espaco-superior">
          Deixe nascimento ou URL da foto vazios para remover esses dados.
          CPF, tipo de usuário e senha não são alterados neste formulário.
        </p>

        <section className="secao-formulario">
          <h2>Endereço</h2>

          <div className="formulario-grade">
            <Campo
              id="editar-cep"
              titulo="CEP"
              valor={formulario.cep}
              maximo={9}
              erro={erros.cep}
              onChange={(valor) => alterar("cep", valor)}
            />

            <Campo
              id="editar-uf"
              titulo="UF"
              valor={formulario.uf}
              maximo={2}
              erro={erros.uf}
              onChange={(valor) => alterar("uf", valor.toUpperCase())}
            />

            <Campo
              id="editar-cidade"
              titulo="Cidade"
              valor={formulario.cidade}
              erro={erros.cidade}
              onChange={(valor) => alterar("cidade", valor)}
            />

            <Campo
              id="editar-logradouro"
              titulo="Logradouro"
              valor={formulario.logradouro}
              erro={erros.logradouro}
              onChange={(valor) => alterar("logradouro", valor)}
            />

            <Campo
              id="editar-numero"
              titulo="Número"
              valor={formulario.numero}
              erro={erros.numero}
              onChange={(valor) => alterar("numero", valor)}
            />

            <Campo
              id="editar-complemento"
              titulo="Complemento — opcional"
              valor={formulario.complemento}
              erro={erros.complemento}
              onChange={(valor) => alterar("complemento", valor)}
            />
          </div>
        </section>

        {mensagem && (
          <p className="mensagem-erro" role="alert">
            {mensagem}
          </p>
        )}

        {salvando && (
          <p role="status">Salvando alterações...</p>
        )}

        <div className="formulario-acoes">
          {!salvando && (
            <Link
              className="botao"
              to={`/usuarios/${usuario.id}`}
            >
              Cancelar
            </Link>
          )}

          <button
            type="submit"
            className="botao botao--primario"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}