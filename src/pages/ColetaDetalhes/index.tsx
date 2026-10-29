import EditorModuloApi from "../../components/EditorModuloApi";
import AcoesRegistroApi from "../../components/AcoesRegistroApi";

export default function ColetaDetalhes() {
  return (
    <>
      <EditorModuloApi modulo="coletas" leitura />
      <AcoesRegistroApi modulo="coletas" />
    </>
  );
}