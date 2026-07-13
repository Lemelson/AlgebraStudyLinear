import assert from 'node:assert/strict';
import fs from 'node:fs';
import katex from 'katex';
import { firstSemesterVisuals } from './firstSemesterVisuals.js';
import { lectures } from './lectures.js';

const contentDirectory = new URL('../content/lectures/', import.meta.url);
const lessonPattern = /^лекция_\d{2}\.md$/u;
const expectedFiles = lectures.map((lecture) => lecture.lessonFile).sort();
const actualFiles = fs.readdirSync(contentDirectory).filter((filename) => lessonPattern.test(filename)).sort();

assert.equal(lectures.length, 38, 'В хронологии должны оставаться все 38 лекций');
assert.deepEqual(lectures.map((lecture) => lecture.number), Array.from({ length: 38 }, (_, index) => index + 1));
assert.deepEqual(actualFiles, expectedFiles, 'Каждой лекции должен соответствовать ровно один Markdown-файл');

const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u;
const placeholders = /\b(?:TODO|TBD|FIXME)\b|заглушк|дописать|продолжить здесь|аналогично для остальных/iu;
let renderedFormulaCount = 0;

function normalizeMathDelimiters(markdown) {
  return markdown
    .replaceAll('\\[', '$$')
    .replaceAll('\\]', '$$')
    .replaceAll('\\(', '$')
    .replaceAll('\\)', '$');
}

function verifyFormula(formula, filename) {
  const trimmed = formula.trim();
  assert.ok(trimmed, `${filename}: пустая математическая формула`);
  assert.doesNotThrow(
    () => katex.renderToString(trimmed, { throwOnError: true, strict: 'ignore' }),
    `${filename}: KaTeX не разобрал формулу ${trimmed}`,
  );
  renderedFormulaCount += 1;
}

for (const lecture of lectures) {
  const filename = lecture.lessonFile;
  const markdown = fs.readFileSync(new URL(filename, contentDirectory), 'utf8');
  const words = markdown.match(/[\p{L}\p{N}]+/gu) ?? [];

  assert.equal(controlCharacters.test(markdown), false, `${filename}: найден управляющий символ`);
  assert.equal(placeholders.test(markdown), false, `${filename}: найдена незаполненная заглушка`);
  assert.ok(words.length >= 500, `${filename}: конспект слишком короткий (${words.length} слов)`);
  assert.match(markdown, /^#\s+.+/mu, `${filename}: нет заголовка лекции`);
  assert.match(markdown, /^##\s+.*(?:[Зз]адач|[Пп]рактик)/mu, `${filename}: нет раздела с задачами`);
  assert.match(markdown, /^##\s+.*[Оо]шиб/mu, `${filename}: нет раздела с типичными ошибками`);
  assert.match(markdown, /^##\s+.*[Ии]сточник/mu, `${filename}: нет раздела с источниками`);

  if (lecture.number <= 15) {
    assert.ok(words.length >= 750, `${filename}: подробный урок первого семестра должен содержать не менее 750 слов`);
    assert.match(markdown, /^##\s+.*[Сс]амопровер/mu, `${filename}: нет устной самопроверки`);
  }

  let mathSource = normalizeMathDelimiters(markdown).replace(/```[\s\S]*?```/gu, '');
  mathSource = mathSource.replace(/\$\$([\s\S]*?)\$\$/gu, (_, formula) => {
    verifyFormula(formula, filename);
    return '';
  });
  mathSource.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/gu, (_, formula) => {
    verifyFormula(formula, filename);
    return '';
  });
}

assert.ok(renderedFormulaCount >= 2_500, `Ожидалось не менее 2500 формул, найдено ${renderedFormulaCount}`);
assert.deepEqual(
  Object.keys(firstSemesterVisuals).map(Number),
  Array.from({ length: 15 }, (_, index) => index + 1),
  'Интерактивная визуализация нужна каждой лекции первого семестра',
);

for (const [lectureNumber, visual] of Object.entries(firstSemesterVisuals)) {
  assert.ok(visual.title && visual.caption && visual.ariaLabel && visual.takeaway, `Лекция ${lectureNumber}: визуализация заполнена не полностью`);
  assert.ok(visual.modes.length >= 3, `Лекция ${lectureNumber}: нужно минимум три состояния визуализации`);
}

console.log(`Lecture content verified: ${lectures.length} lessons, ${renderedFormulaCount} KaTeX formulas, 15 interactive visualizations.`);
