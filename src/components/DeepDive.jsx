import MathText from './MathText';
import GlossaryText from './GlossaryText';

export default function DeepDive({ content }) {
  if (!content) return null;
  return <section id="deep-dive" className="lesson-section deep-dive"><p className="section-kicker">08 · Углублённый разбор</p><h2>Связываем определения, теоремы и вычисления</h2><div className="deep-sections">{content.sections.map((section,index)=><article key={section.title}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{section.title}</h3><p><GlossaryText>{section.explanation}</GlossaryText></p>{section.formula&&<MathText text={section.formula}/>}</div></article>)}</div><h2 className="deep-subtitle">Ещё два разобранных примера</h2>{content.workedExamples.map((example)=><article className="worked-card" key={example.title}><h3>{example.title}</h3><p><GlossaryText>{example.prompt}</GlossaryText></p><ol>{example.steps.map((step)=><li key={step}><GlossaryText>{step}</GlossaryText></li>)}</ol><strong>Ответ: <GlossaryText>{example.answer}</GlossaryText></strong></article>)}<h2 className="deep-subtitle">Быстрая самопроверка</h2><div className="answer-cards">{content.exercises.map((item)=><details key={item.question}><summary><GlossaryText>{item.question}</GlossaryText></summary><p><GlossaryText>{item.answer}</GlossaryText></p></details>)}</div></section>;
}
