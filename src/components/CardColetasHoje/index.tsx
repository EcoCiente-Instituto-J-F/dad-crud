import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

import { useColetasHoje } from "../../hooks/useColetasHoje";

export default function CardColetasHoje() {
  const { requisicao, recarregar } = useColetasHoje();

  return (
    <section className="home-card home-estatistica">
      <div className="home-estatistica-titulo">
        <span className="home-estatistica-icone">
          <CalendarDays size={23} aria-hidden="true" />
        </span>

        <h2>Coletas de hoje</h2>
      </div>

      <div className="home-estatistica-numero">
        {requisicao.status === "carregando" && (
          <span className="home-coletas-carregando" role="status">
            Carregando...
          </span>
        )}

        {requisicao.status === "sucesso" && (
          <Link
            className="home-coletas-valor"
            to="/coletas/calendario"
            aria-label={`${requisicao.dados} coletas de hoje. Abrir calendário`}
          >
            <strong>{requisicao.dados.toLocaleString("pt-BR")}</strong>
          </Link>
        )}

        {requisicao.status === "erro" && (
          <div className="home-coletas-erro" role="alert">
            <span>Não foi possível carregar.</span>
            <button
              type="button"
              onClick={recarregar}
              title={requisicao.mensagem}
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}