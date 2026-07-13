import assert from 'node:assert/strict';
import { controlCorpusGroups, controlKostrikinItems, controlProblemItems } from './controlCorpus.js';
import { controlCurriculum, controlTopicIds } from './controlCurriculum.js';
import { controlTopicDeepDives } from './controlTopicDeepDives.js';
import { controlTopicLessons } from './controlTopicLessons.js';
import { controlTopicMastery } from './controlTopicMastery.js';

const expectedIds = ['group-foundations', 'cyclic-groups', 'quotient-groups', 'control-rings-fields', 'quotient-rings', 'control-vector-spaces'];

assert.deepEqual(controlTopicIds, expectedIds, 'The control-work track must keep the agreed six-topic order.');
assert.equal(controlCurriculum.length, 6);
assert.equal(new Set(controlTopicIds).size, 6, 'Control topic IDs must be unique.');
assert.equal(controlCorpusGroups.definitions[0].items.length, 56, 'The final 30.03.2026 list has 56 definitions.');
assert.equal(controlCorpusGroups.proofs[0].items.length, 16, 'The final 30.03.2026 list has 16 proofs.');
assert.equal(controlProblemItems.length, 14, 'The official preparation sheet has 14 bespoke tasks.');
assert.equal(controlKostrikinItems.length, 19, 'The official sheet names 19 Kostrikin entries (combined subparts stay one entry).');
assert.equal(controlCurriculum.reduce((sum, topic) => sum + topic.proofCount, 0), 16);
assert.equal(controlCurriculum.reduce((sum, topic) => sum + topic.problemCount, 0), 14);

for (const topic of controlCurriculum) {
  const lesson = controlTopicLessons[topic.id];
  const deepDive = controlTopicDeepDives[topic.id];
  const mastery = controlTopicMastery[topic.id];

  assert.ok(lesson, `Missing lesson for ${topic.id}`);
  assert.ok(lesson.intuition.length >= 2, `${topic.id} needs a beginner-friendly intuition bridge.`);
  assert.ok(lesson.definitions.length >= 3, `${topic.id} needs precise definitions.`);
  assert.ok(lesson.ideas.length >= 3, `${topic.id} needs a connected concept map.`);
  assert.ok(lesson.steps.length >= 3, `${topic.id} needs a worked example.`);
  assert.ok(lesson.mistakes.length >= 3 && lesson.practice.length >= 3, `${topic.id} needs mistakes and immediate practice.`);

  assert.ok(deepDive, `Missing deep dive for ${topic.id}`);
  assert.ok(deepDive.sections.length >= 5, `${topic.id} needs at least five deep explanations.`);
  assert.ok(deepDive.workedExamples.length >= 2, `${topic.id} needs two additional worked examples.`);
  assert.ok(deepDive.exercises.length >= 5, `${topic.id} needs answer-backed exercises.`);

  assert.ok(mastery, `Missing mastery block for ${topic.id}`);
  assert.ok(mastery.scope.direct.length >= 3 && mastery.scope.foundation.length >= 2);
  assert.ok(mastery.scope.links.length >= 3);
  assert.equal(mastery.bridge.length, 4);
  assert.ok(mastery.algorithm.steps.length >= 5);
  assert.ok(mastery.proofs.length >= 2);
  assert.ok(mastery.practice.length >= 3);
  assert.ok(mastery.checklist.length >= 5);
}

for (const kind of ['definitions', 'proofs', 'problems']) {
  for (const group of controlCorpusGroups[kind]) {
    for (const item of group.items) {
      assert.ok(expectedIds.includes(item.topicId), `${kind}/${group.id}/${item.number} has an unknown topicId.`);
    }
  }
}

console.log('Control-work curriculum verified: 6 topics, 56 definitions, 16 proofs, 14 bespoke tasks, 19 Kostrikin entries.');
