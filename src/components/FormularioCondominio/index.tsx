import { Link } from "react-router-dom";

import GerenciarTorres from "../GerenciarTorres";

import type {
  CadastroCondominio,
  FormularioCondominioProps,
} from "../../types/condominio";

interface CampoTexto {
  nome: Exclude<
    keyof CadastroCondominio,
    "tipo" | "sindicoId" | "torres"
  >;
  titulo: string;
  maximo: number;
  obrigatorio: boolean;
}

const campos: readonly CampoTexto[] = [
  { nome: "nome", titulo: "Nome do condomínio", maximo: 120, obrigatorio: true },
  { nome: "cnpj", titulo: "CNPJ", maximo: 18, obrigatorio: true },
  { nome: "codigoAcesso", titulo: "Código de acesso", maximo: 20, obrigatorio: true },
  { nome: "cep", titulo: "CEP", maximo: 9, obrigatorio: true },
  { nome: "uf", titulo: "UF", maximo: 2, obrigatorio: true },
  { nome: "cidade", titulo: "Cidade", maximo: 80, obrigatorio: true },
  { nome: "bairro", titulo: "Bairro", maximo: 80, obrigatorio: true },
  { nome: "logradouro", titulo: "Logradouro", maximo: 120, obrigatorio: true },
  { nome: "numero", titulo: "Número", maximo: 20, obrigatorio: true },
  { nome: "complemento", titulo: "Complemento", maximo: 100, obrigatorio: false },
];

export default function FormularioCondominio({
  formulario,
  erros,
  sindicos,
  salvando,
  mensagemErro,
  caminhoVoltar,
  onAlterar,
  onSalvar,
}: FormularioCondominioProps) {
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
        <legend>Dados do condomínio</legend>

        <div className="formulario-grade">
          {campos.map((campo) => (
            <div className="campo" key={campo.nome}>
              <label htmlFor={`condominio-${campo.nome}`}>
                {campo.titulo}
              </label>

              <input
                id={`condominio-${campo.nome}`}
                type="text"
                maxLength={campo.maximo}
                required={campo.obrigatorio}
                value={formulario[campo.nome]}
                onChange={(evento) =>
                  onAlterar(campo.nome, evento.target.value)
                }
              />

              {erros[campo.nome] && (
                <span className="erro-campo" role="alert">
                  {erros[campo.nome]}
                </span>
              )}
            </div>
          ))}

          <div className="campo">
            <label htmlFor="condominio-tipo">Tipo de condomínio</label>
            <select
              id="condominio-tipo"
              value={formulario.tipo}
              onChange={(evento) => {
                const valor = evento.target.value;

                if (
                  valor === "RESIDENCIAL" ||
                  valor === "COMERCIAL" ||
                  valor === "MISTO"
                ) {
                  onAlterar("tipo", valor);
                }
              }}
            >
              <option value="RESIDENCIAL">Residencial</option>
              <option value="COMERCIAL">Comercial</option>
              <option value="MISTO">Misto</option>
            </select>
            {erros.tipo && (
              <span className="erro-campo" role="alert">
                {erros.tipo}
              </span>
            )}
          </div>

          <div className="campo">
            <label htmlFor="condominio-sindico">Síndico responsável</label>

            <select
              id="condominio-sindico"
              value={formulario.sindicoId}
              onChange={(evento) =>
                onAlterar("sindicoId", evento.target.value)
              }
            >
              <option value="">Sem síndico vinculado</option>

              {formulario.sindicoId &&
                !sindicos.some(
                  (sindico) => sindico.id === formulario.sindicoId,
                ) && (
                  <option value={formulario.sindicoId}>
                    Vínculo atual — usuário indisponível
                  </option>
                )}

              {sindicos.map((sindico) => (
                <option key={sindico.id} value={sindico.id}>
                  {sindico.nome} — {sindico.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <GerenciarTorres
          torres={formulario.torres}
          onChange={(torres) => onAlterar("torres", torres)}
        />

        {erros.torres && (
          <p className="erro-campo" role="alert">{erros.torres}</p>
        )}
      </fieldset>

      {mensagemErro && (
        <p className="erro-campo" role="alert">{mensagemErro}</p>
      )}

      {salvando && <p role="status">Salvando condomínio...</p>}

      <div className="formulario-acoes">
        <Link className="botao" to={caminhoVoltar}>
          Voltar
        </Link>

        <button
          type="submit"
          className="botao botao--primario"
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar condomínio"}
        </button>
      </div>
    </form>
  );
}