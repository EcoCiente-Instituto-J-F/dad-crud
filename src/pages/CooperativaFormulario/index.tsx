import EditorModuloApi from "../../components/EditorModuloApi";

export default function CooperativaFormulario({
  modo,
}: {
  modo: "cadastro" | "edicao";
}) {
  return <EditorModuloApi modulo="cooperativas" modo={modo} />;
}