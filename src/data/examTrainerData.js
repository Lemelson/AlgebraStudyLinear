import { corpusGroups } from './examCorpus.js';
import { officialProblemStatements } from './officialProblemStatements.js';
import { problemGuidesExpanded } from './problemGuidesExpanded.js';
import { examGeneratedVariantsA } from './examGeneratedVariantsA.js';
import { examGeneratedVariantsB } from './examGeneratedVariantsB.js';

const officialMeta = [
  ['Система уравнений для линейной оболочки', 'subspaces', 'Базовый', 'foundation', [2]],
  ['Сумма и пересечение подпространств', 'subspaces', 'Экзаменационный', 'standard', [2]],
  ['Прямая сумма и косые проекции', 'subspaces', 'Экзаменационный', 'standard', [2]],
  ['Матрица билинейной формы в новом базисе', 'forms', 'Базовый', 'foundation', [3]],
  ['Матрица квадратичной формы в новом базисе', 'forms', 'Экзаменационный', 'standard', [3]],
  ['Нормальный вид методом Лагранжа', 'forms', 'Экзаменационный', 'standard', [3]],
  ['Ортогональное приведение квадратичной формы', 'forms', 'Повышенный', 'advanced', [3, 5]],
  ['Знакоопределённость формы с параметром', 'forms', 'Повышенный', 'advanced', [3]],
  ['Спектр, диагонализация и степень матрицы', 'operators', 'Экзаменационный', 'standard', [5]],
  ['Матрица оператора по образам базиса', 'operators', 'Базовый', 'foundation', [2]],
  ['Матрица оператора при замене базиса', 'operators', 'Экзаменационный', 'standard', [5]],
  ['Собственный базис симметрической матрицы', 'spectrum', 'Экзаменационный', 'standard', [5]],
  ['Образы, прообразы и инвариантные прямые', 'operators', 'Повышенный', 'advanced', [2, 5]],
  ['Ядро и образ линейного отображения', 'operators', 'Экзаменационный', 'standard', [2]],
  ['QR-разложение матрицы', 'decompositions', 'Экзаменационный', 'standard', [6]],
  ['Сингулярное разложение матрицы', 'decompositions', 'Повышенный', 'advanced', [6]],
  ['Матрица сопряжённого оператора', 'euclidean', 'Повышенный', 'advanced', [4, 7]],
  ['Главные оси квадратичной формы', 'forms', 'Повышенный', 'advanced', [3, 5]],
  ['Канонический вид линии второго порядка', 'geometry', 'Повышенный', 'advanced', [8]],
  ['Распознавание поверхностей второго порядка', 'geometry', 'Базовый', 'foundation', [1]],
  ['Эллиптический параболоид вращения', 'geometry', 'Базовый', 'foundation', [1]],
];

const officialItems = corpusGroups.problems[0].items;

const typeLabels = {
  subspaces: 'Подпространства',
  forms: 'Формы',
  operators: 'Операторы',
  spectrum: 'Спектр',
  decompositions: 'Разложения',
  euclidean: 'Евклидова геометрия',
  geometry: 'Коники и квадрики',
};

const typePrerequisites = {
  subspaces: ['Линейная оболочка и базис', 'Ранг матрицы и метод Гаусса'],
  forms: ['Матрица билинейной и квадратичной формы', 'Закон инерции и смена базиса'],
  operators: ['Матрица линейного отображения', 'Ядро, образ и смена базиса'],
  spectrum: ['Собственные значения и векторы', 'Ортонормирование'],
  decompositions: ['Ортогональные матрицы', 'Скалярное произведение и собственные значения'],
  euclidean: ['Матрица Грама', 'Ортогональная проекция и сопряжённый оператор'],
  geometry: ['Квадратичные формы', 'Канонические уравнения кривых и поверхностей'],
};

const realProblemPrerequisites = {
  1: typePrerequisites.geometry,
  2: typePrerequisites.subspaces,
  3: typePrerequisites.forms,
  4: typePrerequisites.operators,
  5: typePrerequisites.spectrum,
  6: typePrerequisites.decompositions,
  7: typePrerequisites.euclidean,
  8: typePrerequisites.geometry,
};

function asList(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function adaptOfficialProblem(item) {
  const number = item.number;
  const guide = problemGuidesExpanded[`problems-exam:${number}`];
  const [title, typeId, difficultyLabel, difficultyLevel, realProblemNumbers] = officialMeta[number - 1];
  const algorithm = asList(guide.algorithm);
  const computations = asList(guide.keyComputations);
  const steps = [
    ...algorithm.map((body, index) => ({ title: `Шаг ${index + 1} · план`, body })),
    ...computations.map((body, index) => ({ title: `Вычисление ${index + 1}`, body })),
  ];

  return {
    id: `official-${number}`,
    number,
    origin: 'official',
    title,
    typeId,
    type: { id: typeId, label: typeLabels[typeId] },
    classification: guide.classification,
    difficulty: {
      level: difficultyLevel,
      label: difficultyLabel,
      rationale: difficultyLevel === 'foundation'
        ? 'Изолирует один базовый приём и помогает закрепить алгоритм.'
        : difficultyLevel === 'advanced'
          ? 'Требует связать несколько идей или аккуратно обработать параметр и смену базиса.'
          : 'Соответствует типичной вычислительной нагрузке экзамена.',
    },
    statement: officialProblemStatements[number] || item.latexText || item.text,
    generalization: `Главный переносимый навык: ${guide.classification}`,
    prerequisites: typePrerequisites[typeId],
    hints: algorithm.slice(0, 3).map((body, index) => ({
      title: `Подсказка ${index + 1}`,
      body,
    })),
    solution: {
      idea: algorithm[0] || guide.classification,
      steps,
      answer: guide.answer,
    },
    verification: asList(guide.verification),
    commonMistakes: asList(guide.commonMistake),
    selfCheck: [
      {
        prompt: 'Какой первый объект нужно построить до вычислений?',
        answer: algorithm[0] || 'Определить тип задачи и выбрать соответствующий алгоритм.',
        explanation: 'Правильная стартовая конструкция сокращает вычисления и не даёт смешать законы смены базиса.',
      },
      {
        prompt: 'Как независимо проверить итог?',
        answer: guide.verification,
        explanation: 'Проверка должна возвращаться к исходному условию, а не повторять те же преобразования.',
      },
    ],
    relatedRealProblemNumbers: realProblemNumbers,
    relatedProblems: realProblemNumbers.map((realNumber) => ({
      title: `Реальная задача № ${realNumber}`,
      href: `/exam-2025/${realNumber}`,
      relation: 'Показывает, как этот приём встречается в цельном экзаменационном билете.',
    })),
  };
}

export const examPreparationProblems = officialItems.map(adaptOfficialProblem);

export const examGeneratedVariants = [
  ...examGeneratedVariantsA,
  ...examGeneratedVariantsB,
].map((problem) => ({
  ...problem,
  prerequisites: problem.prerequisites || realProblemPrerequisites[problem.parentNumber],
  relatedProblems: problem.relatedProblems || [{
    title: `Реальная задача № ${problem.parentNumber}`,
    href: `/exam-2025/${problem.parentNumber}`,
    relation: 'Сравните новый ход решения с формулировкой и подробным разбором реального экзамена.',
  }],
}));

export const trainerTypeLabels = typeLabels;

export function findPreparationProblem(number) {
  return examPreparationProblems.find((problem) => problem.number === Number(number));
}

export function findGeneratedVariant(parentNumber, variantId) {
  return examGeneratedVariants.find((problem) => (
    problem.parentNumber === Number(parentNumber) && problem.variantId === variantId
  ));
}

export function variantsForRealProblem(number) {
  return examGeneratedVariants.filter((problem) => problem.parentNumber === Number(number));
}
