import { Link } from "react-router-dom";

import { useRecuperacaoSenha } from "../../hooks/useRecuperarSenha";

export default function RecuperarSenha() {
  const recuperacao = useRecuperacaoSenha();

  return (
    <main className="login-pagina">
      <section className="login-card">
        <h1>Recuperar acesso</h1>

        {recuperacao.etapa === "sucesso" ? (
          <>
            <p>Senha redefinida. Entre com sua nova senha.</p>
            <Link className="botao botao--primario" to="/login">
              Ir para o login
            </Link>
          </>
        ) : (
          <form
            onSubmit={(evento) => {
              evento.preventDefault();
              void recuperacao.enviar();
            }}
          >
            <fieldset disabled={recuperacao.carregando}>
              <legend className="somente-leitor">
                Recuperação de senha
              </legend>

              <div className="login-campo">
                <label htmlFor="recuperar-email">E-mail</label>

                <div className="login-input-container">
                  <input
                    id="recuperar-email"
                    type="email"
                    required
                    readOnly={recuperacao.etapa === "codigo"}
                    value={recuperacao.email}
                    onChange={(evento) =>
                      recuperacao.setEmail(evento.target.value)
                    }
                  />
                </div>
              </div>

              {recuperacao.etapa === "codigo" && (
                <>
                  <p>
                    Se houver uma conta elegível, você receberá as
                    instruções de recuperação.
                  </p>

                  <div className="login-campo">
                    <label htmlFor="recuperar-codigo">Código de 4 números</label>
                    <div className="login-input-container">
                      <input
                        id="recuperar-codigo"
                        required
                        inputMode="numeric"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        value={recuperacao.token}
                        onChange={(evento) =>
                          recuperacao.setToken(
                            evento.target.value.replace(/\D/g, ""),
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="login-campo">
                    <label htmlFor="recuperar-senha">Nova senha</label>
                    <div className="login-input-container">
                      <input
                        id="recuperar-senha"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={100}
                        value={recuperacao.novaSenha}
                        onChange={(evento) =>
                          recuperacao.setNovaSenha(evento.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="login-campo">
                    <label htmlFor="recuperar-confirmacao">Confirmar senha</label>
                    <div className="login-input-container">
                      <input
                        id="recuperar-confirmacao"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={100}
                        value={recuperacao.confirmacaoSenha}
                        onChange={(evento) =>
                          recuperacao.setConfirmacaoSenha(evento.target.value)
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {recuperacao.mensagem && (
                <p className="mensagem-erro" role="alert">
                  {recuperacao.mensagem}
                </p>
              )}

              <button
                type="submit"
                className="login-enviar"
                disabled={recuperacao.carregando}
              >
                {recuperacao.carregando
                  ? "Processando..."
                  : recuperacao.etapa === "email"
                    ? "Enviar código"
                    : "Redefinir senha"}
              </button>

              {recuperacao.etapa === "codigo" && (
                <button
                  type="button"
                  className="link-botao espaco-superior"
                  onClick={recuperacao.voltar}
                >
                  Corrigir e-mail ou solicitar novamente
                </button>
              )}
            </fieldset>

            <p className="espaco-superior">
              <Link to="/login">Voltar ao login</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}