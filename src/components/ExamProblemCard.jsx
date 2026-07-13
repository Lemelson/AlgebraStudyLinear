import { Link } from 'react-router-dom';
import MathText from './MathText';

function textValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.label || value.title || value.name || '';
}

export default function ExamProblemCard({ problem, to }) {
  const statement = problem.statement || problem.exactStatement || problem.latexText || problem.text || '';
  const type = textValue(problem.type) || problem.classification || 'Экзаменационная задача';
  const difficulty = textValue(problem.difficulty) || problem.difficultyLabel || 'Базовый уровень';

  return (
    <li>
      <Link to={to}>
        <div className="ticket-card-meta">
          <span>№ {problem.number}</span>
          <small>{difficulty}</small>
        </div>
        <h3>{problem.title || type}</h3>
        {statement && <MathText text={statement} />}
        <div className="ticket-card-footer">
          <span>{type}</span>
          <b>Полный разбор →</b>
        </div>
      </Link>
    </li>
  );
}
