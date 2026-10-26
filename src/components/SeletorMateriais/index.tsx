import {
  materiaisDisponiveis,
  nomesMateriais,
} from "../../data/cooperativa";

import type { SeletorMateriaisProps } from "../../types/cooperativa";

export default function SeletorMateriais({
  id,
  selecionados,
  onChange,
}: SeletorMateriaisProps) {
  return (
    <div className="materiais-opcoes">
      {materiaisDisponiveis.map((material) => (
        <label className="material-opcao" key={material}>
          <input
            id={`${id}-${material}`}
            type="checkbox"
            checked={selecionados.includes(material)}
            onChange={(evento) =>
              onChange(
                evento.target.checked
                  ? [...selecionados, material]
                  : selecionados.filter((item) => item !== material),
              )
            }
          />
          <span>{nomesMateriais[material]}</span>
        </label>
      ))}
    </div>
  );
}