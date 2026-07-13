import GlossaryText from './GlossaryText';

export default function LectureCompanion({ data }) {
  if (!data) return null;
  return <section className="lecture-companion"><p className="section-kicker">Как учить эту лекцию</p><div className="companion-grid"><div><h2>Маршрут понимания</h2><ol>{data.map.map((item)=><li key={item}><GlossaryText>{item}</GlossaryText></li>)}</ol></div><div><h2>Формулы-якоря</h2>{data.formulas.map((formula)=><code key={formula}>{formula}</code>)}</div></div><div className="answer-cards">{data.checks.map((item)=><details key={item.question}><summary><GlossaryText>{item.question}</GlossaryText></summary><p><GlossaryText>{item.answer}</GlossaryText></p></details>)}</div></section>;
}
