import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useLocation } from "react-router-dom";

import Modal from "../../components/Modal";
import { useLogin } from "../../hooks/useLogin";

function obterRetorno(valor: unknown): string {
  if (
    typeof valor === "object" &&
    valor !== null &&
    "retorno" in valor &&
    typeof valor.retorno === "string" &&
    valor.retorno.startsWith("/") &&
    !valor.retorno.startsWith("//") &&
    !valor.retorno.startsWith("/login")
  ) {
    return valor.retorno;
  }

  return "/home";
}

export default function Login() {
  const location = useLocation();
  const estadoRota: unknown = location.state;

  const { formulario, erros, estado, alterar, enviar } = useLogin();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [recuperacao, setRecuperacao] = useState(false);

  const carregando = estado.status === "carregando";

  return (
    <main className="login-pagina">
      <section className="login-card" aria-labelledby="login-titulo">
        <h1 id="login-titulo">Bem-vindo de volta</h1>

        <p className="login-descricao">
          Acesse sua conta para continuar no sistema de administradores do
          EcoCiente.
        </p>

        <form
          noValidate
          onSubmit={(evento) => {
            evento.preventDefault();

            if (!carregando) {
              void enviar(obterRetorno(estadoRota));
            }
          }}
        >
          <fieldset disabled={carregando}>
            <legend className="somente-leitor">Acessar conta</legend>

            <div className="login-campo">
              <label htmlFor="login-email">E-mail</label>

              <div
                className={`login-input-container${
                  erros.email ? " login-input-container--erro" : ""
                }`}
              >
                <Mail
                  className="login-input-icone"
                  size={23}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="seu.email@picpay.com"
                  maxLength={160}
                  value={formulario.email}
                  aria-invalid={Boolean(erros.email)}
                  aria-describedby={
                    erros.email ? "login-email-erro" : undefined
                  }
                  onChange={(evento) =>
                    alterar("email", evento.target.value)
                  }
                />
              </div>

              {erros.email && (
                <span
                  id="login-email-erro"
                  className="erro-campo"
                  role="alert"
                >
                  {erros.email}
                </span>
              )}
            </div>

            <div className="login-campo">
              <label htmlFor="login-senha">Senha</label>

              <div
                className={`login-input-container${
                  erros.senha ? " login-input-container--erro" : ""
                }`}
              >
                <LockKeyhole
                  className="login-input-icone"
                  size={23}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <input
                  id="login-senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  maxLength={128}
                  value={formulario.senha}
                  aria-invalid={Boolean(erros.senha)}
                  aria-describedby={
                    erros.senha ? "login-senha-erro" : undefined
                  }
                  onChange={(evento) =>
                    alterar("senha", evento.target.value)
                  }
                />

                <button
                  type="button"
                  className="senha-visualizar"
                  aria-label={
                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                  aria-controls="login-senha"
                  onClick={() =>
                    setMostrarSenha((anterior) => !anterior)
                  }
                >
                  {mostrarSenha ? (
                    <Eye size={23} aria-hidden="true" />
                  ) : (
                    <EyeOff size={23} aria-hidden="true" />
                  )}
                </button>
              </div>

              {erros.senha && (
                <span
                  id="login-senha-erro"
                  className="erro-campo"
                  role="alert"
                >
                  {erros.senha}
                </span>
              )}
            </div>

            <button
              type="button"
              className="login-recuperacao"
              onClick={() => setRecuperacao(true)}
            >
              Esqueceu a senha?
            </button>

            {estado.status === "erro" && (
              <p className="mensagem-erro" role="alert">
                {estado.mensagem}
              </p>
            )}

            {estado.status === "sucesso" && (
              <p role="status">Acesso autorizado.</p>
            )}

            <button
              className="login-enviar"
              type="submit"
              disabled={carregando}
              aria-busy={carregando}
            >
              {carregando ? "Entrando..." : "Login"}
            </button>
          </fieldset>
        </form>
      </section>

      <Modal
        aberto={recuperacao}
        titulo="Recuperação de acesso"
        onFechar={() => setRecuperacao(false)}
      >
        <p>
          A recuperação de senha ainda não está disponível nesta demonstração.
          Para acessar, use o e-mail admin@ecociente.com e a senha inicial
          EcoCiente@2026.
        </p>

        <div className="formulario-acoes">
          <button
            type="button"
            className="botao botao--primario"
            onClick={() => setRecuperacao(false)}
          >
            Entendi
          </button>
        </div>
      </Modal>
    </main>
  );
}