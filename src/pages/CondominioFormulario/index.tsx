import EditorModuloApi from "../../components/EditorModuloApi";

export default function CondominioFormulario({
  modo,
}: {
  modo: "cadastro" | "edicao";
}) {
  return <EditorModuloApi modulo="condominios" modo={modo} />;
}