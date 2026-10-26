import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, SearchX, ServerCrash } from "lucide-react";

import type { PaginaErroProps } from "../../types/erro";

const configuracoes = {
  "403": {
    titulo: "Acesso negado",
    descricao: "Você não tem permissão para acessar esta área do painel.",
    icone: LockKeyhole,
  },
  "404": {
    titulo: "Página não encontrada",
    descricao: "O endereço acessado não corresponde a uma página do painel.",
    icone: SearchX,
  },
  "500": {
    titulo: "Ops! Algo deu errado",
    descricao: "Não foi possível concluir a operação neste momento.",
    icone: ServerCrash,
  },
};

export default function Erro({ codigo }: PaginaErroProps) {
  const navigate = useNavigate();
  const configuracao = configuracoes[codigo];
  const Icone = configuracao.icone;

  return (
    <section className="erro-pagina">
      <div className="painel erro-card">
        <div className="erro-ilustracao">
          <Icone size={56} strokeWidth={1.4} />
        </div>

        <span className="erro-codigo">Erro {codigo}</span>
        <h1>{configuracao.titulo}</h1>
        <p>{configuracao.descricao}</p>

        <div className="erro-acoes">
          <button
            type="button"
            className="botao"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>

          <Link className="botao botao--primario" to="/home">
            Ir para o início
          </Link>
        </div>
      </div>
    </section>
  );
}