import { useId, useState } from "react";
import { Eye } from "lucide-react";
import Modal from "../Modal";
import { previaQuizSchema } from "../../types/previaQuiz";
import type { PreviaQuizProps } from "../../types/previaQuiz";

export default function PreviaQuiz({ dados }: PreviaQuizProps) {
  const [aberto, setAberto] = useState(false); const [respostas, setRespostas] = useState<Record<number, number>>({}); const [corrigido, setCorrigido] = useState(false); const grupo = useId();
  const resultado = previaQuizSchema.safeParse(dados); const quiz = resultado.success ? resultado.data : null;
  const acertos = quiz?.perguntas.filter((p, i) => p.alternativas[respostas[i]]?.correta).length ?? 0;
  const nota = quiz ? acertos / quiz.perguntas.length * 100 : 0;
  return <><button type="button" className="botao" onClick={() => { setRespostas({}); setCorrigido(false); setAberto(true); }}><Eye size={17} />Prévia do quiz</button>
    <Modal aberto={aberto} titulo="Pré-visualização do quiz" onFechar={() => setAberto(false)}><div className="previa-quiz">
      <p className="visual-aviso">Simulação sem envio de respostas ou geração de pontos.</p>
      {!quiz && <p role="alert">Preencha o título, a nota mínima e pelo menos uma pergunta com duas alternativas e exatamente uma correta.</p>}
      {quiz && <><h3>{quiz.titulo}</h3>{quiz.perguntas.map((p, i) => <fieldset key={i} className="previa-quiz-pergunta visual-fieldset" disabled={corrigido}><legend>{i + 1}. {p.enunciado}</legend>{p.alternativas.map((a, j) => <label key={j} className={`previa-quiz-opcao ${corrigido && a.correta ? "previa-quiz-opcao--correta" : corrigido && respostas[i] === j ? "previa-quiz-opcao--errada" : ""}`}><input type="radio" name={`${grupo}-${i}`} checked={respostas[i] === j} onChange={() => setRespostas((anterior) => ({ ...anterior, [i]: j }))} /><span>{a.texto}</span>{corrigido && a.correta && <small>Correta</small>}</label>)}</fieldset>)}
        {corrigido && <p className="visual-aviso" role="status">{acertos} de {quiz.perguntas.length} corretas. Nota: {nota.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%. {nota >= quiz.notaMinima ? "Aprovado na simulação." : "Nota mínima não atingida."}</p>}
        <div className="formulario-acoes"><button type="button" className="botao" onClick={() => setAberto(false)}>Fechar</button><button type="button" className="botao botao--primario" disabled={!corrigido && !quiz.perguntas.every((_, i) => respostas[i] !== undefined)} onClick={() => { if (corrigido) { setRespostas({}); setCorrigido(false); } else setCorrigido(true); }}>{corrigido ? "Testar novamente" : "Conferir respostas"}</button></div>
      </>}
    </div></Modal></>;
}