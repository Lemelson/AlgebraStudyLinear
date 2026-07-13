import assert from 'node:assert/strict';
import {
  examGeneratedVariants,
  examPreparationProblems,
} from './examTrainerData.js';

assert.equal(examPreparationProblems.length, 21, 'Нужна ровно 21 официальная задача');
assert.equal(examGeneratedVariants.length, 16, 'Нужно ровно 16 собственных вариаций');

const allProblems = [...examPreparationProblems, ...examGeneratedVariants];
const ids = allProblems.map((problem) => problem.id);
assert.equal(new Set(ids).size, ids.length, 'ID задач должны быть уникальны');

for (let number = 1; number <= 8; number += 1) {
  const variants = examGeneratedVariants.filter((problem) => problem.parentNumber === number);
  assert.equal(variants.length, 2, `У реальной задачи ${number} должно быть две вариации`);
  assert.deepEqual(
    variants.map((problem) => problem.variantId).sort(),
    ['foundation', 'transfer'],
    `У задачи ${number} нужны foundation и transfer`,
  );
}

for (const problem of allProblems) {
  assert.ok(problem.title && problem.classification && problem.statement, `${problem.id}: основная метаинформация`);
  assert.ok(problem.difficulty?.level && problem.difficulty?.label, `${problem.id}: сложность`);
  assert.ok(problem.generalization, `${problem.id}: переносимый навык`);
  assert.ok(problem.hints?.length >= 3, `${problem.id}: минимум три подсказки`);
  assert.ok(problem.solution?.idea, `${problem.id}: идея решения`);
  assert.ok(problem.solution?.steps?.length >= 4, `${problem.id}: минимум четыре шага`);
  assert.ok(problem.solution?.answer, `${problem.id}: ответ`);
  assert.ok(problem.verification?.length >= 1, `${problem.id}: проверка`);
  assert.ok(problem.commonMistakes?.length >= 1, `${problem.id}: ошибки`);
  assert.ok(problem.selfCheck?.length >= 2, `${problem.id}: самопроверка`);
}

const serialized = JSON.stringify(allProblems);
for (const forbidden of ['/Users/', '.pdf', '.docx', 'http://', 'https://', 'sourceImage', 'sourceNote']) {
  assert.equal(serialized.includes(forbidden), false, `Запрещённая строка в публичных данных: ${forbidden}`);
}

console.log('Exam trainer data: 21 official problems and 16 generated variants validated.');
