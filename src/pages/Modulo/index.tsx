import type { ModuloProps } from "../../types/layout";

export default function Modulo({
  titulo,
  descricao,
}: ModuloProps) {
  return (
    <section>
      <div className="pagina-cabecalho">
        <div>
          <h1 className="pagina-titulo">{titulo}</h1>
          <p className="pagina-descricao">{descricao}</p>
        </div>
      </div>

      <div className="painel estado-vazio">
        <h2>Módulo em construção</h2>
        <p>Vamos implementar as telas desta seção nas próximas partes.</p>
      </div>
    </section>
  );
}