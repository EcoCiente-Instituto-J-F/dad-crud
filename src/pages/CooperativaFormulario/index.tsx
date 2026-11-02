import EditorModuloApi from "../../components/EditorModuloApi";
import type { CooperativaFormularioProps } from "../../types/cooperativaFormularioContratos";

export default function CooperativaFormulario({
  modo,
}: CooperativaFormularioProps) {
  return <EditorModuloApi modulo="cooperativas" modo={modo} />;
}
