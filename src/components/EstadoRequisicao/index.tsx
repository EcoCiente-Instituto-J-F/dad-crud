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
          size={28}
          aria-hidden="true"
        />

        <p>{mensagem ?? "Carregando usuários..."}</p>
      </div>
    );
  }

  return (
    <div className="estado-requisicao estado-requisicao--erro">
      <TriangleAlert size={28} aria-hidden="true" />

      <p role="alert">
        {mensagem ?? "Não foi possível concluir a operação."}
      </p>

      {onTentarNovamente && (
        <button
          type="button"
          className="botao"
          onClick={onTentarNovamente}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}