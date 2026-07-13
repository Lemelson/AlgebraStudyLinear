import { Link } from 'react-router-dom';
import MathText from './MathText';
import ExamHintList from './ExamHintList';
import ExamSelfCheck from './ExamSelfCheck';

const asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

function labelFor(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.label || value.title || value.name || value.text || value.body || fallback;
}

function stepFor(step, index) {
  if (typeof step === 'string') return { title: `Шаг ${index + 1}`, body: step };
  return {
    title: step?.title || step?.label || `Шаг ${index + 1}`,
    body: step?.body || step?.text || step?.explanation || '',
    math: step?.math || step?.latex || '',
  };
}

function linkFor(item) {
  if (!item || typeof item === 'string') return '';
  const directLink = item.href || item.to || item.path;
  if (directLink) return directLink;
  const parentNumber = item.parentNumber ?? item.realProblemNumber ?? item.sourceProblemNumber;
  const variantId = item.variantId || item.slug;
  if (parentNumber != null && variantId) return `/exam-2025/${parentNumber}/practice/${variantId}`;
  if (item.origin === 'official' && item.number != null) return `/exam-2025/preparation/${item.number}`;
  return '';
}

export default function ExamProblemDetail({
  problem,
  contextLabel = 'Экзаменационный тренажёр',
  backTo,
  backLabel,
  previous,
  next,
}) {
  const statement = problem.statement || problem.exactStatement || problem.latexText || problem.text || '';
  const solution = problem.solution || {};
  const steps = asArray(solution.steps || problem.steps || problem.algorithm).map(stepFor);
  const answer = solution.answer || problem.answer || '';
  const idea = solution.idea || problem.idea || problem.bigIdea || problem.generalization || '';
  const generalization = problem.generalization || problem.learningGoal || problem.skill || idea;
  const verification = asArray(problem.verification || problem.checks || problem.selfVerification);
  const mistakes = asArray(problem.commonMistakes || problem.commonMistake || problem.mistakes);
  const hints = asArray(problem.hints || solution.hints);
  const selfCheck = asArray(problem.selfCheck || problem.selfCheckQuestions || problem.quickCheck);
  const prerequisites = asArray(problem.prerequisites);
  const related = asArray(problem.relatedProblems || problem.relatedGeneratedVariants || problem.relatedOfficialProblems);
  const type = labelFor(problem.type) || problem.typeLabel || problem.classification || 'Экзаменационная задача';
  const difficulty = labelFor(problem.difficulty) || problem.difficultyLabel || 'Базовый уровень';
  const difficultyRationale = typeof problem.difficulty === 'object' ? problem.difficulty.rationale : '';
  const displayNumber = problem.number ?? problem.parentNumber ?? '—';

  return (
    <main className="page-shell exam-problem-page">
      {backTo && <Link className="back-link" to={backTo}>← {backLabel || 'Вернуться к тренажёру'}</Link>}
      <header className="exam-problem-header">
        <div className="exam-problem-index">
          <span>{contextLabel}</span>
          <strong>{String(displayNumber).padStart(2, '0')}</strong>
          <small>{difficulty}</small>
        </div>
        <div>
          <p className="eyebrow">Формулировка задачи · LaTeX</p>
          <h1>{problem.title || type}</h1>
          <MathText className="exam-exact-statement" text={statement} />
          <div className="prerequisite-strip">
            <span>Паспорт задачи</span>
            <small>{type}</small>
            <small>{difficulty}</small>
          </div>
          {difficultyRationale && <p className="exam-difficulty-rationale">{difficultyRationale}</p>}
        </div>
      </header>

      {(generalization || prerequisites.length > 0) && (
        <section className="exam-prerequisite-section">
          <div>
            <p className="section-kicker">Не заучивать конкретные числа</p>
            <h2>Что нужно уметь в общем случае</h2>
            {generalization && <MathText text={generalization} />}
          </div>
          {prerequisites.length > 0 && (
            <nav aria-label="Пререквизиты задачи">
              {prerequisites.map((item, index) => {
                const title = typeof item === 'string' ? item : labelFor(item, `Пререквизит ${index + 1}`);
                const href = linkFor(item);
                return href ? (
                  <Link key={`${index}-${title}`} to={href}>
                    <span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><b>Повторить →</b>
                  </Link>
                ) : (
                  <div className="prerequisite-strip" key={`${index}-${title}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span><small>{title}</small>
                  </div>
                );
              })}
            </nav>
          )}
        </section>
      )}

      <ExamHintList hints={hints} />

      <section className="exam-solution-section">
        {idea && <article className="solution-big-idea"><span>Смысл решения</span><MathText text={idea} /></article>}
        <div className="exam-solution-steps">
          <p className="section-kicker">Решение без пропущенных переходов</p>
          <ol>
            {steps.map((step, index) => (
              <li key={`${index}-${step.title}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{step.title}</h2>
                  {step.body && <MathText text={step.body} />}
                  {step.math && <MathText className="step-display-math" text={step.math} />}
                </div>
              </li>
            ))}
          </ol>
        </div>
        {answer && <article className="exam-final-answer"><span>Ответ</span><MathText text={answer} /></article>}
      </section>

      {(verification.length > 0 || mistakes.length > 0) && (
        <section className="exam-check-grid">
          <article>
            <span>Как проверить себя</span>
            <ol>{verification.map((item, index) => <li key={`${index}-${labelFor(item, String(item))}`}><MathText text={labelFor(item, String(item))} /></li>)}</ol>
          </article>
          <article className="warning-card">
            <span>Типичные ошибки</span>
            <ol>{mistakes.map((item, index) => <li key={`${index}-${labelFor(item, String(item))}`}><MathText text={labelFor(item, String(item))} /></li>)}</ol>
          </article>
        </section>
      )}

      <ExamSelfCheck items={selfCheck} />

      {related.length > 0 && (
        <section className="related-official-section">
          <div className="section-heading"><p className="eyebrow">После этой задачи</p><h2>Продолжить тренировку</h2></div>
          <div>
            {related.map((item, index) => {
              const href = linkFor(item);
              const title = labelFor(item, `Связанная задача ${index + 1}`);
              const relation = typeof item === 'object' ? item.relation || item.description || '' : '';
              if (!href) return null;
              return <Link key={`${index}-${href}`} to={href}><span>Связанная задача</span><h3>{title}</h3>{relation && <p>{relation}</p>}<b>Открыть →</b></Link>;
            })}
          </div>
        </section>
      )}

      {(previous || next) && (
        <nav className="exam-problem-pagination" aria-label="Навигация по задачам тренажёра">
          {previous ? <Link to={previous.to || previous.href}><span>← Предыдущая</span><strong>{previous.title}</strong></Link> : <span />}
          {next ? <Link to={next.to || next.href}><span>Следующая →</span><strong>{next.title}</strong></Link> : <Link to={backTo || '/exam-2025'}><span>Готово</span><strong>Вернуться к списку</strong></Link>}
        </nav>
      )}
    </main>
  );
}
