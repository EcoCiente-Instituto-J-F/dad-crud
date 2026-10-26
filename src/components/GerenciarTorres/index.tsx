import type { GerenciarTorresProps } from "../../types/condominio";

export default function GerenciarTorres({
  torres,
  onChange,
}: GerenciarTorresProps) {
  return (
    <section className="secao-formulario">
      <div className="pagina-cabecalho">
        <div>
          <h2>Torres</h2>
          <p className="pagina-descricao">
            O cadastro de torres é opcional.
          </p>
        </div>

        <button
          type="button"
          className="botao"
          onClick={() =>
            onChange([
              ...torres,
              {
                id: crypto.randomUUID(),
                nome: "",
                moradores: 0,
              },
            ])
          }
        >
          Adicionar torre
        </button>
      </div>

      {torres.length === 0 && (
        <p className="pagina-descricao">Nenhuma torre cadastrada.</p>
      )}

      <div className="lista-torres">
        {torres.map((torre) => (
          <div className="torre-linha" key={torre.id}>
            <div className="campo">
              <label htmlFor={`torre-${torre.id}`}>Nome da torre</label>
              <input
                id={`torre-${torre.id}`}
                type="text"
                maxLength={60}
                value={torre.nome}
                onChange={(evento) =>
                  onChange(
                    torres.map((item) =>
                      item.id === torre.id
                        ? { ...item, nome: evento.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>

            <span>{torre.moradores} moradores</span>

            <button
              type="button"
              className="botao botao--perigo"
              disabled={torre.moradores > 0}
              title={
                torre.moradores > 0
                  ? "Transfira os moradores antes de remover a torre."
                  : "Remover torre"
              }
              onClick={() =>
                onChange(torres.filter((item) => item.id !== torre.id))
              }
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}