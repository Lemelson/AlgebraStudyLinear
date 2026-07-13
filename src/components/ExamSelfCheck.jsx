import { useState } from 'react';
import MathText from './MathText';

function promptFor(item) {
  if (typeof item === 'string') return item;
  return item?.prompt || item?.question || item?.text || '';
}

function answerFor(item) {
  if (typeof item === 'string') return '';
  const answer = item?.answer ?? item?.expectedAnswer ?? item?.expected ?? '';
  if (typeof answer === 'number' && Array.isArray(item?.options)) return item.options[answer] || String(answer);
  return String(answer);
}

export default function ExamSelfCheck({ items = [] }) {
  const [revealed, setRevealed] = useState({});
  if (!items.length) return null;

  return (
    <section className="expanded-guide" aria-labelledby="self-check-title">
      <div className="section-heading">
        <p className="eyebrow">Закрыть решение и воспроизвести</p>
        <h2 id="self-check-title">Самопроверка</h2>
      </div>
      <div className="strict-steps">
        <ol>
          {items.map((item, index) => {
            const answer = answerFor(item);
            const explanation = typeof item === 'object' ? item?.explanation : '';
            const isRevealed = Boolean(revealed[index]);
            return (
              <li key={`${index}-${promptFor(item)}`}>
                <MathText text={promptFor(item)} />
                {(answer || explanation) && (
                  <button
                    className="secondary-button"
                    type="button"
                    aria-expanded={isRevealed}
                    onClick={() => setRevealed((current) => ({ ...current, [index]: !current[index] }))}
                  >
                    {isRevealed ? 'Скрыть ответ' : 'Показать ответ'}
                  </button>
                )}
                {isRevealed && answer && <aside><strong>Ответ:</strong> <MathText text={answer} /></aside>}
                {isRevealed && explanation && <aside><strong>Почему:</strong> <MathText text={explanation} /></aside>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
