import GlossaryText from './GlossaryText';
import MathText from './MathText';

export default function DefinitionExpansion({ guide, enrichment }) {
  if (!guide || !enrichment) return null;
  return <>
    <section className="definition-study">
      <article className="formal-definition"><span>Точная формулировка · LaTeX</span><MathText text={enrichment.latexDefinition}/></article>
      <article><span>Сначала — обычными словами</span><p><GlossaryText>{guide.simple}</GlossaryText></p></article>
      <article><span>Пример</span><p><GlossaryText>{guide.example}</GlossaryText></p></article>
      <article className="warning-card"><span>Не перепутать</span><p><GlossaryText>{guide.pitfall}</GlossaryText></p></article>
    </section>
    <section className="definition-deep-explanation">
      <p className="section-kicker">Понимаем смысл до заучивания</p>
      <h2>Разбираем без скачков и скрытых предположений</h2>
      <article className="child-explanation"><span>Интуиция перед строгой формулировкой</span><p><GlossaryText>{enrichment.childExplanation}</GlossaryText></p></article>
      <div className="definition-understanding-grid"><article><span>Мысленная картинка</span><p><GlossaryText>{enrichment.mentalModel}</GlossaryText></p></article><article><span>Зачем это нужно</span><p><GlossaryText>{enrichment.whyItMatters}</GlossaryText></p></article><article><span>Ещё один пример</span><p><GlossaryText>{enrichment.secondExample}</GlossaryText></p></article><article className="warning-card"><span>Контрпример и граница</span><p><GlossaryText>{enrichment.counterexample}</GlossaryText></p></article></div>
      {enrichment.symbolLegend.length > 0 && <div className="symbol-legend"><span>Перевод обозначений на русский</span>{enrichment.symbolLegend.map(([symbol,meaning])=><div key={symbol}><MathText text={`$${symbol}$`}/><p><GlossaryText>{meaning}</GlossaryText></p></div>)}</div>}
      <details className="definition-check"><summary>{enrichment.checkQuestion}</summary><p><GlossaryText>{enrichment.checkAnswer}</GlossaryText></p></details>
    </section>
  </>;
}
