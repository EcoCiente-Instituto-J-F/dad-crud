import { usePreviaQuiz } from "../../hooks/usePreviaQuiz";
import { chaveItemEditor } from "../../utils/itensEditor";
import { Eye } from "lucide-react";
import type { PreviaQuizProps } from "../../types/previaQuiz";
import Modal from "../Modal";

export default function PreviaQuiz({ dados }: PreviaQuizProps) {
  const { aberto, respostas, corrigido, grupo, quiz, acertos, nota, abrir, fechar, conferir, responder } = usePreviaQuiz(dados);
  return <><button type="button" className="botao" onClick={abrir}><Eye size={17} />Prévia do quiz</button>
    <Modal aberto={aberto} titulo="Pré-visualização do quiz" onFechar={fechar}><div className="previa-quiz">
      <p className="visual-aviso">Simulação sem envio de respostas ou geração de pontos.</p>
      {!quiz && <p role="alert">Preencha o título, a nota mínima e pelo menos uma pergunta com duas alternativas e exatamente uma correta.</p>}
      {quiz && <><h3>{quiz.titulo}</h3>{quiz.perguntas.map((p, i) => <fieldset key={chaveItemEditor(p)} className="previa-quiz-pergunta visual-fieldset" disabled={corrigido}><legend>{i + 1}. {p.enunciado}</legend>{p.alternativas.map((a, j) => <label key={chaveItemEditor(a)} className={`previa-quiz-opcao ${corrigido && a.correta ? "previa-quiz-opcao--correta" : corrigido && respostas[i] === j ? "previa-quiz-opcao--errada" : ""}`}><input type="radio" name={`${grupo}-${i}`} checked={respostas[i] === j} onChange={() => responder(i, j)} /><span>{a.texto}</span>{corrigido && a.correta && <small>Correta</small>}</label>)}</fieldset>)}
        {corrigido && <p className="visual-aviso" role="status">{acertos} de {quiz.perguntas.length} corretas. Nota: {nota.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%. {nota >= quiz.notaMinima ? "Aprovado na simulação." : "Nota mínima não atingida."}</p>}
        <div className="formulario-acoes"><button type="button" className="botao" onClick={fechar}>Fechar</button><button type="button" className="botao botao--primario" disabled={!corrigido && !quiz.perguntas.every((_, i) => respostas[i] !== undefined)} onClick={conferir}>{corrigido ? "Testar novamente" : "Conferir respostas"}</button></div>
      </>}
    </div></Modal></>;
}
