import { Link, useParams } from 'react-router-dom';
import ExamProblemDetail from '../components/ExamProblemDetail';
import { examGeneratedVariants, findGeneratedVariant } from '../data/examTrainerData';

function parentNumberFor(problem) {
  return problem.parentNumber ?? problem.realProblemNumber ?? problem.sourceProblemNumber;
}

function variantIdFor(problem) {
  return problem.variantId || problem.slug || problem.id;
}

export default function ExamGeneratedVariantPage() {
  const { number, variantId } = useParams();
  const parentNumber = Number(number);
  const problem = findGeneratedVariant(parentNumber, variantId);
  if (!problem) return <main className="page-shell empty-state"><h1>Вариант не найден</h1><Link to={`/exam-2025/${parentNumber}`}>Вернуться к реальной задаче</Link></main>;

  const siblings = examGeneratedVariants.filter((item) => Number(parentNumberFor(item)) === parentNumber);
  const index = siblings.findIndex((item) => variantIdFor(item) === variantIdFor(problem));
  const navigationItem = (item) => item ? {
    to: `/exam-2025/${parentNumber}/practice/${variantIdFor(item)}`,
    title: item.title,
  } : null;

  return (
    <ExamProblemDetail
      key={problem.id}
      problem={{ ...problem, number: problem.number ?? parentNumber }}
      contextLabel="Тренировка · вариант"
      backTo={`/exam-2025/${parentNumber}`}
      backLabel={`Реальная задача № ${parentNumber}`}
      previous={navigationItem(siblings[index - 1])}
      next={navigationItem(siblings[index + 1])}
    />
  );
}
