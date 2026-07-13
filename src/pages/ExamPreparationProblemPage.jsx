import { Link, useParams } from 'react-router-dom';
import ExamProblemDetail from '../components/ExamProblemDetail';
import { examPreparationProblems, findPreparationProblem } from '../data/examTrainerData';

export default function ExamPreparationProblemPage() {
  const { number } = useParams();
  const problem = findPreparationProblem(Number(number));
  if (!problem) return <main className="page-shell empty-state"><h1>Задача не найдена</h1><Link to="/exam-2025/preparation">Вернуться к подготовке</Link></main>;

  const index = examPreparationProblems.findIndex((item) => item.number === problem.number);
  const previousProblem = examPreparationProblems[index - 1];
  const nextProblem = examPreparationProblems[index + 1];
  const navigationItem = (item) => item ? {
    to: `/exam-2025/preparation/${item.number}`,
    title: `№ ${item.number} · ${item.title}`,
  } : null;

  return (
    <ExamProblemDetail
      key={problem.id}
      problem={problem}
      contextLabel="Подготовка · задача"
      backTo="/exam-2025/preparation"
      backLabel="21 задача для подготовки"
      previous={navigationItem(previousProblem)}
      next={navigationItem(nextProblem)}
    />
  );
}
