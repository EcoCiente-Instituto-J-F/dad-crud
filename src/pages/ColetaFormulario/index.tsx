import EditorModuloApi from "../../components/EditorModuloApi";
import type { ColetaFormularioProps } from "../../types/coletaFormularioContratos";

export default function ColetaFormulario({
  modo,
}: ColetaFormularioProps) {
  return <EditorModuloApi modulo="coletas" modo={modo} />;
}
