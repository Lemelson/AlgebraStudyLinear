import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ExamProblemCard from '../components/ExamProblemCard';
import { examPreparationProblems } from '../data/examTrainerData';

function valueLabel(value, fallback) {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.label || value.title || value.name || fallback;
}

export default function ExamPreparationPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const types = useMemo(() => [...new Set(examPreparationProblems.map((problem) => valueLabel(problem.type, problem.typeLabel || problem.classification)).filter(Boolean))], []);
  const difficulties = useMemo(() => [...new Set(examPreparationProblems.map((problem) => valueLabel(problem.difficulty, problem.difficultyLabel)).filter(Boolean))], []);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return examPreparationProblems.filter((problem) => {
      const type = valueLabel(problem.type, problem.typeLabel || problem.classification);
      const difficulty = valueLabel(problem.difficulty, problem.difficultyLabel);
      const searchable = [problem.number, problem.title, problem.statement, problem.exactStatement, type, difficulty].filter(Boolean).join(' ').toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (typeFilter === 'all' || type === typeFilter)
        && (difficultyFilter === 'all' || difficulty === difficultyFilter);
    });
  }, [query, typeFilter, difficultyFilter]);

  return (
    <main className="page-shell exam-focus-page">
      <Link className="back-link" to="/exam-2025">← Экзамен 2025</Link>
      <header className="editorial-header reveal">
        <p className="eyebrow">Полное официальное покрытие</p>
        <h1>21 задача<br />для подготовки</h1>
        <p>Точные формулировки, пошаговые решения, подсказки и самопроверка. Ищите не знакомые числа, а повторяющийся тип и метод.</p>
        <div className="collection-toolbar">
          <label>
            <span className="sr-only">Поиск по задачам</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти тему или формулировку" />
          </label>
          <label>
            <span className="sr-only">Фильтр по типу</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">Все типы</option>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Фильтр по сложности</span>
            <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
              <option value="all">Любая сложность</option>
              {difficulties.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
            </select>
          </label>
          <span>{filtered.length} из {examPreparationProblems.length}</span>
        </div>
      </header>

      {filtered.length > 0 ? (
        <ol className="real-ticket-grid">
          {filtered.map((problem) => <ExamProblemCard key={problem.id || problem.number} problem={problem} to={`/exam-2025/preparation/${problem.number}`} />)}
        </ol>
      ) : (
        <section className="empty-state"><h2>Задачи не найдены</h2><p>Сбросьте фильтры или попробуйте более короткий запрос.</p></section>
      )}
    </main>
  );
}
