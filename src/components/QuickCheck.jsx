import { useState } from 'react';

const questions = [
  {
    text: 'Какая система является базисом в R²?',
    options: ['(1, 0) и (0, 1)', '(1, 1) и (2, 2)', '(1, 0), (0, 1) и (1, 1)'],
    answer: 0,
    explanation: 'Два стандартных вектора линейно независимы и порождают всю плоскость.',
  },
  {
    text: 'Каковы координаты x = (3, −2) в стандартном базисе?',
    options: ['(−2, 3)', '(3, −2)', '(1, −5)'],
    answer: 1,
    explanation: 'В стандартном базисе коэффициенты разложения совпадают с обычными координатами.',
  },
  {
    text: 'Почему разложение по базису единственно?',
    options: ['Потому что базис содержит нулевой вектор', 'Потому что базис ортогонален', 'Из линейной независимости базисных векторов'],
    answer: 2,
    explanation: 'Два разных разложения дали бы нетривиальную линейную комбинацию базисных векторов, равную нулю.',
  },
];

export default function QuickCheck({ onPassed }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const correct = questions.filter((question, index) => answers[index] === question.answer).length;

  const check = () => {
    setChecked(true);
    if (correct === questions.length) onPassed?.();
  };

  return (
    <div className="quick-check">
      {questions.map((question, index) => (
        <fieldset key={question.text}>
          <legend><span>{index + 1}</span>{question.text}</legend>
          {question.options.map((option, optionIndex) => (
            <label key={option} className={checked && optionIndex === question.answer ? 'correct-option' : ''}>
              <input
                type="radio"
                name={`question-${index}`}
                checked={answers[index] === optionIndex}
                onChange={() => {
                  setAnswers((current) => ({ ...current, [index]: optionIndex }));
                  setChecked(false);
                }}
              />
              <span>{option}</span>
            </label>
          ))}
          {checked && <p className={answers[index] === question.answer ? 'feedback success' : 'feedback'}>{question.explanation}</p>}
        </fieldset>
      ))}
      <div className="check-footer">
        <button className="primary-button" onClick={check} disabled={Object.keys(answers).length !== questions.length}>Проверить ответы</button>
        {checked && <strong>{correct} из {questions.length}</strong>}
      </div>
    </div>
  );
}
