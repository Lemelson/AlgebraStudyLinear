import assert from 'node:assert/strict';
import katex from 'katex';
import { enrichedGlossaryIds, glossary, glossaryById, glossaryCoverage } from './glossary.js';

assert.equal(glossaryCoverage.total, 104, 'the complete glossary must stay available');
assert.deepEqual(glossaryCoverage.invalidEntries, [], 'every glossary entry must satisfy the schema');
assert.ok(enrichedGlossaryIds.length >= 35, 'complex concepts need the expanded learning format');

for (const entry of glossary) {
  assert.ok(Array.isArray(entry.analogies) && entry.analogies.length > 0, `${entry.id}: analogies must be dynamic`);
  assert.ok(Array.isArray(entry.examples) && entry.examples.length > 0, `${entry.id}: examples must be dynamic`);
  assert.ok(Array.isArray(entry.perspectives), `${entry.id}: perspectives must be an array`);
  assert.ok(Array.isArray(entry.related), `${entry.id}: related terms must be an array`);

  for (const relatedId of entry.related) {
    assert.ok(glossaryById[relatedId], `${entry.id}: related term ${relatedId} does not exist`);
    assert.notEqual(relatedId, entry.id, `${entry.id}: an entry cannot relate to itself`);
  }

  for (const example of entry.examples) {
    assert.ok(example.text || example.latex, `${entry.id}: every example needs text or LaTeX`);
    if (example.latex) {
      assert.doesNotThrow(() => katex.renderToString(example.latex, { throwOnError: true }), `${entry.id}: invalid LaTeX in example`);
    }
  }
}

for (const id of enrichedGlossaryIds) {
  const entry = glossaryById[id];
  assert.ok(entry, `${id}: enrichment has no glossary entry`);
  assert.ok(entry.perspectives.length >= 2, `${id}: add at least two complementary explanations`);
  assert.ok(entry.analogies.length >= 2, `${id}: add at least two analogies`);
  assert.ok(entry.examples.length >= 2, `${id}: add at least two examples`);
  assert.ok(entry.examples.every((example) => example.latex && example.explanation), `${id}: enriched examples need LaTeX and a plain-language explanation`);
}

const polar = glossaryById['polar-decomposition'];
assert.equal(polar.examples.length, 2);
assert.equal(polar.analogies.length, 3);
assert.ok(polar.related.includes('orthogonal-operator'));
assert.ok(glossaryById['orthogonal-operator'].aliases.includes('ортогонального движения'));

console.log(`Glossary verified: ${glossary.length} terms, ${enrichedGlossaryIds.length} expanded concepts, all LaTeX examples valid.`);
