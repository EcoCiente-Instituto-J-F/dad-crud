import EditorModuloApi from "../../components/EditorModuloApi";
import AcoesRegistroApi from "../../components/AcoesRegistroApi";

export default function QuizFormulario({
  modo,
}: {
  modo: "cadastro" | "edicao";
}) {
  return (
    <>
      <EditorModuloApi modulo="quizzes" modo={modo} />
      {modo === "edicao" && <AcoesRegistroApi modulo="quizzes" />}
    </>
  );
}