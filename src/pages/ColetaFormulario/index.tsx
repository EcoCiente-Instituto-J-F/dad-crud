import EditorModuloApi from "../../components/EditorModuloApi";

export default function ColetaFormulario({
  modo,
}: {
  modo: "cadastro" | "edicao";
}) {
  return <EditorModuloApi modulo="coletas" modo={modo} />;
}