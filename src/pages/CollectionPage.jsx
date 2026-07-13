import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { corpusGroups } from '../data/examCorpus';
import { curriculum } from '../data/curriculum';
import { topicForText } from '../data/topicLessons';
import MathText from '../components/MathText';

const copy = {
  definitions: {
    eyebrow: 'Точный язык',
    title: 'Определения',
    intro: 'Полный официальный перечень коллоквиума и экзамена. Учить нужно не как набор слов, а через связь с примером и задачей.',
  },
  proofs: {
    eyebrow: 'Логика курса',
    title: 'Доказательства',
    intro: 'Официальные вопросы с доказательством. Для каждого понадобится идея, короткий план и строгая полная версия.',
  },
  problems: {
    eyebrow: 'Экзаменационная практика',
    title: 'Задачи',
    intro: 'Основной список задач к экзамену. Сначала определяем тип, затем алгоритм, после этого решаем без подсказки.',
  },
};

export default function CollectionPage({ kind }) {
  const [query, setQuery] = useState('');
  const groups = corpusGroups[kind];
  const meta = copy[kind];
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const filtered = useMemo(() => groups.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.text.toLowerCase().includes(query.toLowerCase())),
  })), [groups, query]);

  return (
    <main className="page-shell collection-shell">
      <header className="editorial-header reveal">
        <p className="eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <p>{meta.intro}</p>
        <div className="collection-toolbar">
          <label>
            <span className="sr-only">Поиск</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти формулировку" />
          </label>
          <span>{total} пунктов в источнике</span>
        </div>
      </header>

      <div className="corpus-groups">
        {filtered.map((group) => (
          <section key={group.id} className="corpus-group">
            <div className="corpus-group-title"><h2>{group.title}</h2><span>{group.items.length}</span></div>
            <ol>
              {group.items.map((item) => (
                <li key={`${group.id}-${item.number}`}>
                  <span>{item.number}</span>
                  <Link className="corpus-item-link" to={`/${kind}/${group.id}/${item.number}`}>
                    {kind === 'problems' ? <MathText className="corpus-statement" text={item.latexText || item.text} /> : <p>{item.text}</p>}
                    <small>{curriculum.find((topic) => topic.id === topicForText(item.text))?.title}</small>
                  </Link>
                  <Link className="open-item" to={`/${kind}/${group.id}/${item.number}`}>Открыть →</Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
