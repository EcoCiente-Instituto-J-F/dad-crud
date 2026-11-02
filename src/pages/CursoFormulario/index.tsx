import EditorModuloApi from "../../components/EditorModuloApi";
import type { CursoFormularioProps } from "../../types/cursoFormularioContratos";

export default function CursoFormulario({
  modo,
}: CursoFormularioProps) {
  return <EditorModuloApi modulo="cursos" modo={modo} />;
}
