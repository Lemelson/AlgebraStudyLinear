import { Link, useParams } from 'react-router-dom';
import MathText from '../components/MathText';
import { examVariant2025 } from '../data/examVariant2025';

export default function ExamVariantProblemPage() {
  const { number } = useParams();
  const index = examVariant2025.problems.findIndex((item) => item.number === Number(number));
  const problem = examVariant2025.problems[index];
  if (!problem) return <main className="page-shell empty-state"><h1>Задача не найдена</h1><Link to="/exam-2025">Вернуться к варианту</Link></main>;
  const previous = examVariant2025.problems[index - 1];
  const next = examVariant2025.problems[index + 1];

  return (
    <main className="page-shell exam-problem-page">
      <Link className="back-link" to="/exam-2025">← Реальный экзамен 2025</Link>
      <header className="exam-problem-header">
        <div className="exam-problem-index"><span>Экзамен · задача</span><strong>{String(problem.number).padStart(2, '0')}</strong><small>{problem.weight} балла</small></div>
        <div>
          <p className="eyebrow">Формулировка задачи · LaTeX</p>
          <h1>{problem.title}</h1>
          <MathText className="exam-exact-statement" text={problem.statement} />
        </div>
      </header>

      <section className="exam-prerequisite-section">
        <div><p className="section-kicker">Не заучивать конкретные числа</p><h2>Что нужно уметь в общем случае</h2><p>{problem.generalization}</p></div>
        <nav aria-label="Пререквизиты задачи">
          {problem.prerequisites.map((item, itemIndex) => <Link key={`${item.id}-${itemIndex}`} to={item.href}><span>{String(itemIndex + 1).padStart(2, '0')}</span><strong>{item.title}</strong><b>Учить →</b></Link>)}
        </nav>
      </section>

      <section className="exam-solution-section">
        <article className="solution-big-idea"><span>Смысл решения</span><MathText text={problem.solution.idea} /></article>
        <div className="exam-solution-steps">
          <p className="section-kicker">Решение без пропущенных переходов</p>
          <ol>
            {problem.solution.steps.map((step, stepIndex) => (
              <li key={`${step.title}-${stepIndex}`}>
                <span>{String(stepIndex + 1).padStart(2, '0')}</span>
                <div><h2>{step.title}</h2><MathText text={step.body} />{step.math && <MathText className="step-display-math" text={step.math} />}</div>
              </li>
            ))}
          </ol>
        </div>
        <article className="exam-final-answer"><span>Ответ</span><MathText text={problem.solution.answer} /></article>
      </section>

      <section className="exam-check-grid">
        <article><span>Как проверить себя</span><ol>{problem.verification.map((item) => <li key={item}><MathText text={item} /></li>)}</ol></article>
        <article className="warning-card"><span>Типичные ошибки</span><ol>{problem.commonMistakes.map((item) => <li key={item}><MathText text={item} /></li>)}</ol></article>
      </section>

      <section className="related-official-section">
        <div className="section-heading"><p className="eyebrow">После этой задачи</p><h2>Похожие официальные типы</h2></div>
        <div>{problem.relatedOfficialProblems.map((item) => <Link key={`${item.number}-${item.title}`} to={item.href}><span>Официальная № {item.number}</span><h3>{item.title}</h3><p>{item.relation}</p><b>Открыть разбор →</b></Link>)}</div>
      </section>

      <nav className="exam-problem-pagination" aria-label="Навигация по реальному варианту">
        {previous ? <Link to={`/exam-2025/${previous.number}`}><span>← Предыдущая</span><strong>№ {previous.number} · {previous.title}</strong></Link> : <span />}
        {next ? <Link to={`/exam-2025/${next.number}`}><span>Следующая →</span><strong>№ {next.number} · {next.title}</strong></Link> : <Link to="/exam-2025"><span>Готово</span><strong>Вернуться ко всему варианту</strong></Link>}
      </nav>
    </main>
  );
}
