import { useId, useMemo, useState } from "react";
import { previaQuizSchema } from "../utils/validarPreviaQuiz";
import { prepararItensEditor } from "../utils/itensEditor";

export function usePreviaQuiz(dados: Record<string, unknown>) {
  const [aberto, setAberto] = useState(false);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [corrigido, setCorrigido] = useState(false);
  const grupo = useId();
  // Parsing profundo: mudanças nas respostas não precisam revalidar o questionário.
  const quiz = useMemo(() => {
    const resultado = previaQuizSchema.safeParse(prepararItensEditor(dados));
    return resultado.success ? resultado.data : null;
  }, [dados]);
  const acertos = quiz?.perguntas.filter((pergunta, indice) => pergunta.alternativas[respostas[indice]]?.correta).length ?? 0;
  const nota = quiz ? acertos / quiz.perguntas.length * 100 : 0;
  function abrir(): void { setRespostas({}); setCorrigido(false); setAberto(true); }
  function conferir(): void {
    if (corrigido) { setRespostas({}); setCorrigido(false); } else setCorrigido(true);
  }
  return { aberto, respostas, corrigido, grupo, quiz, acertos, nota, abrir, conferir,
    fechar: () => setAberto(false), responder: (pergunta: number, alternativa: number) => setRespostas((atual) => ({ ...atual, [pergunta]: alternativa })),
  };
}
