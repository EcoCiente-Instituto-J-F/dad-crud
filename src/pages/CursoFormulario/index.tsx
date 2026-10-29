import EditorModuloApi from "../../components/EditorModuloApi";

export default function CursoFormulario({
  modo,
}: {
  modo: "cadastro" | "edicao";
}) {
  return <EditorModuloApi modulo="cursos" modo={modo} />;
}