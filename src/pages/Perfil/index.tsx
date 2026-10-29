import { useState } from "react";

import Campo from "../../components/Campo";
import EstadoRequisicao from "../../components/EstadoRequisicao";

import { useMinhaContaApi } from "../../hooks/useMinhaContaApi";

import type { UsuarioApi } from "../../types/usuarioApi";
import type {
  AlterarSenhaApi,
  AtualizarPerfilApi,
} from "../../types/perfilApi";

interface FormularioProps {
  usuario: UsuarioApi;
  salvando: boolean;
  mensagem: string;
  salvarPerfil: (dados: AtualizarPerfilApi) => Promise<void>;
  salvarSenha: (dados: AlterarSenhaApi) => Promise<void>;
}

function Formularios({
  usuario,
  salvando,
  mensagem,
  salvarPerfil,
  salvarSenha,
}: FormularioProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [avatar, setAvatar] = useState(usuario.avatar ?? "");
  const [telefone, setTelefone] = useState("");
  const [telefoneId, setTelefoneId] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  return (
    <section>
      <h1 className="pagina-titulo">Meu perfil</h1>

      {mensagem && (
        <p className="mensagem-erro" role="alert">{mensagem}</p>
      )}

      <form
        className="painel formulario espaco-superior"
        onSubmit={(evento) => {
          evento.preventDefault();

          const numero = telefone.replace(/\D/g, "");

          void salvarPerfil({
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            urlAvatar: avatar.trim(),
            ...(numero ? { telefone: numero } : {}),
            ...(numero && telefoneId
              ? { telefoneId: Number(telefoneId) }
              : {}),
          });
        }}
      >
        <fieldset disabled={salvando}>
          <legend>Informações pessoais</legend>

          <div className="formulario-grade">
            <Campo
              id="me-nome"
              titulo="Nome"
              valor={nome}
              maximo={100}
              onChange={setNome}
            />

            <Campo
              id="me-email"
              titulo="E-mail"
              tipo="email"
              valor={email}
              maximo={255}
              onChange={setEmail}
            />

            <Campo
              id="me-avatar"
              titulo="URL da foto — deixe vazio para remover"
              valor={avatar}
              maximo={500}
              onChange={setAvatar}
            />

            <div className="campo">
              <label htmlFor="me-cpf">CPF</label>
              <input
                id="me-cpf"
                value={usuario.cpfMascarado ?? ""}
                readOnly
              />
            </div>

            <Campo
              id="me-telefone"
              titulo="Novo telefone — opcional"
              tipo="tel"
              valor={telefone}
              maximo={20}
              onChange={setTelefone}
            />

            <div className="campo">
              <label htmlFor="me-telefone-id">
                ID do telefone — se houver vários ativos
              </label>
              <input
                id="me-telefone-id"
                type="number"
                min="1"
                step="1"
                value={telefoneId}
                onChange={(evento) =>
                  setTelefoneId(evento.target.value)
                }
              />
            </div>
          </div>

          <p className="pagina-descricao">
            Ao alterar o e-mail, entre novamente com o novo endereço.
            Deixe telefone vazio para preservá-lo.
          </p>

          <div className="formulario-acoes">
            <button
              className="botao botao--primario"
              type="submit"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar perfil"}
            </button>
          </div>
        </fieldset>
      </form>

      <form
        className="painel formulario espaco-superior"
        onSubmit={(evento) => {
          evento.preventDefault();

          void salvarSenha({
            senhaAtual,
            novaSenha,
            confirmacaoSenha,
          });
        }}
      >
        <fieldset disabled={salvando}>
          <legend>Alterar senha</legend>

          <div className="formulario-grade">
            <Campo
              id="me-senha-atual"
              titulo="Senha atual"
              tipo="password"
              valor={senhaAtual}
              maximo={100}
              onChange={setSenhaAtual}
            />

            <Campo
              id="me-nova-senha"
              titulo="Nova senha"
              tipo="password"
              valor={novaSenha}
              maximo={100}
              onChange={setNovaSenha}
            />

            <Campo
              id="me-confirmacao"
              titulo="Confirmar nova senha"
              tipo="password"
              valor={confirmacaoSenha}
              maximo={100}
              onChange={setConfirmacaoSenha}
            />
          </div>

          <p className="pagina-descricao">
            Use de 8 a 100 caracteres com maiúscula, minúscula,
            número e especial, sem espaços. Depois de salvar,
            entre novamente.
          </p>

          <div className="formulario-acoes">
            <button
              className="botao botao--primario"
              type="submit"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

export default function Perfil() {
  const conta = useMinhaContaApi();

  if (conta.requisicao.status === "carregando") {
    return <EstadoRequisicao estado="carregando" />;
  }

  if (conta.requisicao.status === "erro") {
    return (
      <EstadoRequisicao
        estado="erro"
        mensagem={conta.requisicao.mensagem}
        onTentarNovamente={conta.recarregar}
      />
    );
  }

  return (
    <Formularios
      key={conta.requisicao.dados.id}
      usuario={conta.requisicao.dados}
      salvando={conta.salvando}
      mensagem={conta.mensagem}
      salvarPerfil={conta.salvarPerfil}
      salvarSenha={conta.salvarSenha}
    />
  );
}