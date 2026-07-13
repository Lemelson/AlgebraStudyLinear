import { glossaryAliases } from '../data/glossary';
import GlossaryTerm from './GlossaryTerm';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function GlossaryText({ children }) {
  const text = typeof children === 'string' ? children : '';
  const pattern = glossaryAliases.length ? new RegExp(`(^|[^\\p{L}\\p{N}_])(${glossaryAliases.map(({ alias }) => escapeRegex(alias)).join('|')})(?=$|[^\\p{L}\\p{N}_])`, 'giu') : null;
  if (!text || !pattern) return children;
  const nodes = [];
  let cursor = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const leadingLength = match[1].length;
    const termStart = match.index + leadingLength;
    if (termStart > cursor) nodes.push(text.slice(cursor, termStart));
    const shown = match[2];
    const normalized = shown.toLocaleLowerCase('ru-RU');
    const entry = glossaryAliases.find(({ alias }) => alias.toLocaleLowerCase('ru-RU') === normalized);
    nodes.push(<GlossaryTerm id={entry.id} key={`${termStart}-${entry.id}`}>{shown}</GlossaryTerm>);
    cursor = termStart + shown.length;
    if (pattern.lastIndex <= cursor) pattern.lastIndex = cursor;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
