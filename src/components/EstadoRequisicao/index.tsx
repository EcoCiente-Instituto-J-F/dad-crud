import { LoaderCircle, TriangleAlert } from "lucide-react";

import type { EstadoRequisicaoProps } from "../../types/requisicao";

export default function EstadoRequisicao({
  estado,
  mensagem,
  onTentarNovamente,
}: EstadoRequisicaoProps) {
  if (estado === "carregando") {
    return (
      <div className="estado-requisicao" role="status">
        <LoaderCircle
          className="icone-carregando"
          size={32}
          aria-hidden="true"
        />
        <p>{mensagem ?? "Carregando dados..."}</p>
      </div>
    );
  }

  return (
    <div className="estado-requisicao estado-requisicao--erro">
      <div className="erro-ilustracao">
        <TriangleAlert size={42} aria-hidden="true" />
      </div>

      <h2>Não foi possível carregar os dados</h2>

      <p role="alert">
        {mensagem ?? "Ocorreu uma falha durante a operação."}
      </p>

      {onTentarNovamente && (
        <button
          type="button"
          className="botao botao--primario"
          onClick={onTentarNovamente}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}