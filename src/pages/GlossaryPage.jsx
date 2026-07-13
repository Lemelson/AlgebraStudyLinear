import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import GlossaryEntryContent from '../components/GlossaryEntryContent';
import { glossary, glossaryCoverage } from '../data/glossary';
import { curriculum } from '../data/curriculum';

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU');
    return glossary.filter((item) => {
      if (topic !== 'all' && item.topicId !== topic) return false;
      const searchable = [item.term, ...item.aliases, item.short, item.child, ...item.perspectives, ...item.analogies, ...item.examples.flatMap((example) => [example.text, example.explanation])]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('ru-RU');
      return searchable.includes(normalizedQuery);
    });
  }, [query, topic]);

  return <main className="page-shell glossary-page">
    <header className="editorial-header">
      <p className="eyebrow">{glossaryCoverage.total} понятия · {glossaryCoverage.aliases} словоформ</p>
      <h1>Словарь</h1>
      <p>Короткое определение, объяснение простыми словами, несколько способов понять идею и разобранные примеры. Формулы набраны в LaTeX. На других страницах подчёркнутый термин можно открыть наведением, фокусом или нажатием.</p>
      <div className="glossary-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Поиск по словарю" placeholder="Например: матрица, ядро, кольцо" />
        <select value={topic} onChange={(event) => setTopic(event.target.value)} aria-label="Фильтр по теме">
          <option value="all">Все темы</option>
          {curriculum.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
        </select>
      </div>
    </header>
    <div className="glossary-list">{items.map((item) => <article id={item.id} key={item.id}>
      <span aria-hidden="true">{item.term.slice(0, 1).toUpperCase()}</span>
      <div>
        <h2>{item.term}</h2>
        <GlossaryEntryContent entry={item} />
        {item.definitionLink && <Link className="glossary-definition-link" to={item.definitionLink}>Полное определение →</Link>}
      </div>
    </article>)}</div>
    {items.length === 0 && <p className="empty-glossary">Ничего не найдено. Попробуйте более короткую форму слова.</p>}
  </main>;
}
