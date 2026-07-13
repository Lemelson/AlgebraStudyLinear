import { Link } from 'react-router-dom';
import { glossaryById } from '../data/glossary';
import GlossaryRichText from './GlossaryRichText';
import MathText from './MathText';

function Example({ example, entryId, index }) {
  const explanationId = `glossary-example-${entryId}-${index}`;
  return <li className={example.explanation ? 'glossary-example has-explanation' : 'glossary-example'} tabIndex={example.explanation ? 0 : undefined} aria-describedby={example.explanation ? explanationId : undefined}>
    <div className="glossary-example-value">
      {example.latex
        ? <MathText text={`$${example.latex}$`} inline />
        : <GlossaryRichText excludeId={entryId}>{example.text}</GlossaryRichText>}
      {example.explanation && <span className="glossary-example-hint" aria-hidden="true">?</span>}
    </div>
    {example.explanation && <span id={explanationId} className="glossary-example-explanation" role="tooltip">
      <GlossaryRichText excludeId={entryId}>{example.explanation}</GlossaryRichText>
    </span>}
  </li>;
}

export default function GlossaryEntryContent({ entry, compact = false, onNavigate }) {
  return <>
    <p className="glossary-short"><GlossaryRichText excludeId={entry.id}>{entry.short}</GlossaryRichText></p>
    <div className="glossary-child">
      <span>Простыми словами</span>
      <p><GlossaryRichText excludeId={entry.id}>{entry.child}</GlossaryRichText></p>
    </div>

    {entry.perspectives.length > 0 && <section className="glossary-perspectives">
      <h4>Ещё способы понять</h4>
      <ul>{entry.perspectives.map((perspective, index) => <li key={`${entry.id}-perspective-${index}`}><GlossaryRichText excludeId={entry.id}>{perspective}</GlossaryRichText></li>)}</ul>
    </section>}

    <div className="glossary-detail-grid">
      <section className="glossary-detail-section">
        <h4>{entry.analogies.length > 1 ? 'Аналогии' : 'Аналогия'}</h4>
        <ul>{entry.analogies.map((analogy, index) => <li key={`${entry.id}-analogy-${index}`}><GlossaryRichText excludeId={entry.id}>{analogy}</GlossaryRichText></li>)}</ul>
      </section>
      <section className="glossary-detail-section glossary-examples">
        <h4>{entry.examples.length > 1 ? 'Примеры' : 'Пример'}</h4>
        <ol>{entry.examples.map((example, index) => <Example key={`${entry.id}-example-${index}`} example={example} entryId={entry.id} index={index} />)}</ol>
        {entry.examples.some((example) => example.explanation) && <small>Наведите или нажмите на пример — появится расшифровка.</small>}
      </section>
    </div>

    {entry.notThis && <p className="glossary-warning"><strong>Не перепутать:</strong> <GlossaryRichText excludeId={entry.id}>{entry.notThis}</GlossaryRichText></p>}

    {!compact && entry.related.length > 0 && <nav className="glossary-related" aria-label={`Связанные понятия для ${entry.term}`}>
      <span>Связанные понятия</span>
      <div>{entry.related.map((id) => {
        const related = glossaryById[id];
        return related ? <Link key={id} to={`/glossary#${id}`} onClick={onNavigate}>{related.term}</Link> : null;
      })}</div>
    </nav>}
  </>;
}
