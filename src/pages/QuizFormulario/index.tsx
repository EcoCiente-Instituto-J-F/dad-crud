import AcoesRegistroApi from "../../components/AcoesRegistroApi";
import EditorModuloApi from "../../components/EditorModuloApi";
import type { QuizFormularioProps } from "../../types/quizFormularioContratos";

export default function QuizFormulario({
  modo,
}: QuizFormularioProps) {
  return (
    <>
      <EditorModuloApi modulo="quizzes" modo={modo} />
      {modo === "edicao" && <AcoesRegistroApi modulo="quizzes" />}
    </>
  );
}
