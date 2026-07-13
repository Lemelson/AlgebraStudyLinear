import assert from 'node:assert/strict';
import { curriculum } from './curriculum.js';
import { topicMastery } from './topicMastery.js';

const ids = curriculum.map((topic) => topic.id);
assert.deepEqual(Object.keys(topicMastery), ids, 'Every exam topic must have one mastery expansion in curriculum order');

for (const topic of curriculum) {
  const content = topicMastery[topic.id];
  assert.ok(content.scope.exam.length >= 1, `${topic.id}: missing direct exam scope`);
  assert.ok(content.scope.foundation.length >= 1, `${topic.id}: missing colloquium/foundation scope`);
  assert.ok(content.scope.links.length >= 2, `${topic.id}: missing links to official material`);
  assert.equal(content.bridge.length, 4, `${topic.id}: zero-to-exam ladder must have four steps`);
  assert.ok(content.layers.school && content.layers.meaning && content.layers.oral, `${topic.id}: all three explanation levels are required`);
  assert.ok(content.algorithm.steps.length >= 4, `${topic.id}: algorithm is too short`);
  assert.ok(content.proofs.length >= 2, `${topic.id}: at least two proof maps are required`);
  assert.ok(content.practice.length >= 3, `${topic.id}: practice ladder is too short`);
  assert.ok(content.practice.every((problem) => problem.hint && problem.solution && problem.variation), `${topic.id}: every practice problem needs hint, solution and transfer variation`);
  assert.ok(content.checklist.length >= 5, `${topic.id}: readiness checklist is too short`);
}

console.log(`Topic mastery data: ${ids.length} exam topics validated.`);
