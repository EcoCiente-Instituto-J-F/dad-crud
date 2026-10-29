import { Link } from "react-router-dom";

import Campo from "../../components/Campo";
import { useCadastroPessoa } from "../../hooks/useCadastroPessoa";

export default function UsuarioCadastrar() {
  const {
    passo,
    formulario,
    erros,
    mensagem,
    salvando,
    alterar,
    continuar,
    salvar,
    voltar,
  } = useCadastroPessoa();

  return (
    <section className="cadastro-pessoa">
      <form
        className="cadastro-pessoa-card"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();

          if (passo === 1) {
            continuar();
          } else {
            void salvar();
          }
        }}
      >
        <h1>Cadastro</h1>

        <p className="cadastro-pessoa-passos">
          Passo {passo} de 2
          <span
            className={passo === 1 ? "passo-ativo" : ""}
            aria-hidden="true"
          />
          <span
            className={passo === 2 ? "passo-ativo" : ""}
            aria-hidden="true"
          />
        </p>

        <fieldset disabled={salvando}>
          <legend className="somente-leitor">
            {passo === 1 ? "Dados pessoais" : "Endereço e confirmação"}
          </legend>

          {passo === 1 ? (
            <>
              <Campo
                id="cadastro-nome"
                titulo="Nome completo"
                valor={formulario.nomeUsuario}
                maximo={100}
                erro={erros.nomeUsuario}
                onChange={(valor) => alterar("nomeUsuario", valor)}
              />

              <Campo
                id="cadastro-email"
                titulo="E-mail"
                tipo="email"
                valor={formulario.email}
                maximo={255}
                erro={erros.email}
                onChange={(valor) => alterar("email", valor)}
              />

              <div className="cadastro-pessoa-grade">
                <Campo
                  id="cadastro-cpf"
                  titulo="CPF"
                  valor={formulario.cpf}
                  maximo={14}
                  erro={erros.cpf}
                  onChange={(valor) => alterar("cpf", valor)}
                />

                <div className="campo">
                  <label htmlFor="cadastro-nascimento">
                    Data de nascimento
                  </label>

                  <input
                    id="cadastro-nascimento"
                    type="date"
                    value={formulario.dataNascimento}
                    aria-invalid={Boolean(erros.dataNascimento)}
                    aria-describedby={
                      erros.dataNascimento
                        ? "cadastro-nascimento-erro"
                        : undefined
                    }
                    onChange={(evento) =>
                      alterar("dataNascimento", evento.target.value)
                    }
                  />

                  {erros.dataNascimento && (
                    <span
                      id="cadastro-nascimento-erro"
                      className="erro-campo"
                      role="alert"
                    >
                      {erros.dataNascimento}
                    </span>
                  )}
                </div>
              </div>

              <Campo
                id="cadastro-senha"
                titulo="Senha"
                tipo="password"
                valor={formulario.senha}
                erro={erros.senha}
                onChange={(valor) => alterar("senha", valor)}
              />

              <label className="cadastro-pessoa-vinculo">
                <input
                  type="checkbox"
                  checked={formulario.possuiVinculo}
                  onChange={(evento) =>
                    alterar("possuiVinculo", evento.target.checked)
                  }
                />
                Possui vínculo com condomínio
              </label>

              {formulario.possuiVinculo && (
                <Campo
                  id="cadastro-codigo"
                  titulo="Código do condomínio"
                  valor={formulario.codigoCondominio}
                  erro={erros.codigoCondominio}
                  onChange={(valor) =>
                    alterar("codigoCondominio", valor.toUpperCase())
                  }
                />
              )}
            </>
          ) : formulario.possuiVinculo ? (
            <div className="cadastro-pessoa-confirmacao">
              <h2>Vínculo com condomínio</h2>

              <p>
                Código informado:{" "}
                <strong>{formulario.codigoCondominio}</strong>
              </p>

              <p>
                Ao cadastrar, o sistema localizará o condomínio pelo
                código e criará o vínculo. O endereço será o do condomínio.
              </p>
            </div>
          ) : (
            <>
              <p className="pagina-descricao">
                O endereço será localizado pelo CEP informado.
              </p>

              <div className="cadastro-pessoa-grade">
                <Campo
                  id="cadastro-cep"
                  titulo="CEP"
                  valor={formulario.cep}
                  maximo={9}
                  erro={erros.cep}
                  onChange={(valor) => alterar("cep", valor)}
                />

                <Campo
                  id="cadastro-numero"
                  titulo="Número"
                  valor={formulario.numero}
                  erro={erros.numero}
                  onChange={(valor) => alterar("numero", valor)}
                />
              </div>

              <Campo
                id="cadastro-complemento"
                titulo="Complemento — opcional"
                valor={formulario.complemento}
                erro={erros.complemento}
                onChange={(valor) => alterar("complemento", valor)}
              />
            </>
          )}

          {mensagem && (
            <p className="mensagem-erro" role="alert">
              {mensagem}
            </p>
          )}

          {salvando && (
            <p role="status">Cadastrando usuário...</p>
          )}

          <button
            className="botao botao--primario cadastro-pessoa-enviar"
            type="submit"
            disabled={salvando}
          >
            {salvando
              ? "Cadastrando..."
              : passo === 1
                ? "Continuar"
                : "Cadastrar"}
          </button>

          <div className="cadastro-pessoa-voltar">
            {passo === 2 ? (
              <button
                type="button"
                className="link-botao"
                onClick={voltar}
                disabled={salvando}
              >
                Voltar
              </button>
            ) : (
              <Link to="/usuarios">Cancelar</Link>
            )}
          </div>
        </fieldset>
      </form>
    </section>
  );
}