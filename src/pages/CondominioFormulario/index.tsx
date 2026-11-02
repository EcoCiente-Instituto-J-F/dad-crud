import EditorModuloApi from "../../components/EditorModuloApi";
import type { CondominioFormularioProps } from "../../types/condominioFormularioContratos";

export default function CondominioFormulario({
  modo,
}: CondominioFormularioProps) {
  return <EditorModuloApi modulo="condominios" modo={modo} />;
}
