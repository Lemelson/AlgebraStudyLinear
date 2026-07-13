import { useState } from 'react';
import MathText from './MathText';

function hintText(hint) {
  if (typeof hint === 'string') return hint;
  return hint?.body || hint?.text || hint?.content || '';
}

export default function ExamHintList({ hints = [] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  if (!hints.length) return null;

  return (
    <section className="expanded-guide" aria-labelledby="exam-hints-title">
      <div className="section-heading section-heading-inline">
        <div>
          <p className="eyebrow">Не открывать всё сразу</p>
          <h2 id="exam-hints-title">Подсказки по одной</h2>
        </div>
        <p>Попробуйте продолжить решение после каждой подсказки. Следующую открывайте, только если снова остановились.</p>
      </div>
      <div className="strict-steps">
        <ol>
          {hints.slice(0, visibleCount).map((hint, index) => (
            <li key={`${index}-${hintText(hint)}`}>
              {typeof hint === 'object' && hint?.title && <strong>{hint.title}</strong>}
              <MathText text={hintText(hint)} />
            </li>
          ))}
        </ol>
      </div>
      {visibleCount < hints.length ? (
        <button className="primary-button" type="button" onClick={() => setVisibleCount((count) => count + 1)}>
          {visibleCount === 0 ? 'Открыть первую подсказку' : 'Открыть следующую подсказку'}
        </button>
      ) : (
        <p className="section-kicker">Открыты все подсказки · {hints.length}</p>
      )}
    </section>
  );
}
