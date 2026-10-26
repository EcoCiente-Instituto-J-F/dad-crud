import Campo from "../../components/Campo";
import { usePerfilAdmin } from "../../hooks/usePerfilAdmin";
import { obterIniciais } from "../../utils/usuarios";

export default function Perfil() {
  const {
    perfil,
    dados,
    senha,
    estado,
    erros,
    alterarDados,
    alterarSenha,
    executar,
  } = usePerfilAdmin();

  const salvando = estado.status === "salvando";

  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">Meu perfil</h1>
          <p className="pagina-descricao">
            Gerencie suas informações pessoais.
          </p>
        </div>
      </div>

      <section className="painel formulario perfil-apresentacao">
        {perfil?.avatar ? (
          <img
            className="perfil-foto"
            src={perfil.avatar}
            alt={`Foto de ${perfil.nome}`}
          />
        ) : (
          <span className="perfil-foto perfil-foto--iniciais">
            {obterIniciais(perfil?.nome ?? "Admin")}
          </span>
        )}

        <div>
          <h2>{perfil?.nome}</h2>
          <p className="pagina-descricao">Administradora</p>

          <div className="campo espaco-superior">
            <label htmlFor="perfil-avatar">
              Alterar foto — PNG, JPEG ou WebP, até 500 KB
            </label>

            <input
              id="perfil-avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={salvando}
              onChange={(evento) => {
                const arquivo = evento.target.files?.[0];

                if (arquivo) void executar("avatar", arquivo);

                evento.target.value = "";
              }}
            />
          </div>
        </div>
      </section>

      {estado.status === "salvando" && (
        <p role="status">Salvando alterações...</p>
      )}

      {estado.status === "sucesso" && (
        <p className="mensagem-sucesso" role="status">{estado.mensagem}</p>
      )}

      {estado.status === "erro" && (
        <p className="mensagem-erro" role="alert">{estado.mensagem}</p>
      )}

      <form
        className="painel formulario espaco-superior"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          void executar("perfil");
        }}
      >
        <fieldset disabled={salvando}>
          <legend>Informações pessoais</legend>

          <div className="formulario-grade">
            <Campo
              id="perfil-nome"
              titulo="Nome completo"
              valor={dados.nome}
              maximo={100}
              erro={erros.nome}
              onChange={(valor) => alterarDados("nome", valor)}
            />

            <Campo
              id="perfil-email"
              titulo="E-mail de contato"
              tipo="email"
              valor={dados.email}
              maximo={160}
              erro={erros.email}
              onChange={(valor) => alterarDados("email", valor)}
            />

            <Campo
              id="perfil-telefone"
              titulo="Telefone"
              tipo="tel"
              valor={dados.telefone}
              maximo={20}
              erro={erros.telefone}
              onChange={(valor) => alterarDados("telefone", valor)}
            />

            <div className="campo">
              <label htmlFor="perfil-cpf">CPF</label>
              <input
                id="perfil-cpf"
                type="text"
                value={perfil?.cpf ?? ""}
                placeholder="Não informado na demonstração"
                readOnly
              />
            </div>
          </div>

          <p className="pagina-descricao">
            Na demonstração, o e-mail de acesso continua sendo admin@ecociente.com.
          </p>

          <div className="formulario-acoes">
            <button type="submit" className="botao botao--primario">
              Salvar informações
            </button>
          </div>
        </fieldset>
      </form>

      <form
        className="painel formulario espaco-superior"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          void executar("senha");
        }}
      >
        <fieldset disabled={salvando}>
          <legend>Segurança</legend>

          <div className="formulario-grade">
            <Campo
              id="perfil-senha-atual"
              titulo="Senha atual"
              tipo="password"
              maximo={128}
              valor={senha.senhaAtual}
              erro={erros.senhaAtual}
              onChange={(valor) => alterarSenha("senhaAtual", valor)}
            />

            <Campo
              id="perfil-nova-senha"
              titulo="Nova senha"
              tipo="password"
              maximo={128}
              valor={senha.novaSenha}
              erro={erros.novaSenha}
              onChange={(valor) => alterarSenha("novaSenha", valor)}
            />

            <Campo
              id="perfil-confirmar-senha"
              titulo="Confirmar nova senha"
              tipo="password"
              maximo={128}
              valor={senha.confirmarSenha}
              erro={erros.confirmarSenha}
              onChange={(valor) => alterarSenha("confirmarSenha", valor)}
            />
          </div>

          <p className="aviso-demonstracao">
            Modo de demonstração: a mudança de senha é reiniciada ao recarregar
            a aplicação. A persistência real será feita pela API.
          </p>

          <div className="formulario-acoes">
            <button type="submit" className="botao botao--primario">
              Alterar senha
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}