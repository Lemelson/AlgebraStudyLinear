import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { corpusGroups } from '../data/examCorpus';
import { curriculum } from '../data/curriculum';
import { controlCurriculum } from '../data/controlCurriculum';
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
  const [searchParams] = useSearchParams();
  const groups = corpusGroups[kind];
  const meta = copy[kind];
  const controlOnly = searchParams.get('track') === 'control';
  const from = Number(searchParams.get('from')) || null;
  const to = Number(searchParams.get('to')) || null;
  const numbersParam = searchParams.get('numbers') || searchParams.get('number') || '';
  const visibleGroups = controlOnly ? groups.filter((group) => group.id.includes('control')) : groups;
  const total = visibleGroups.reduce((sum, group) => sum + group.items.length, 0);
  const filtered = useMemo(() => {
    const requestedNumbers = new Set(numbersParam.split(',').map(Number).filter(Boolean));
    return visibleGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.text.toLowerCase().includes(query.toLowerCase())) return false;
        if ((from || to || requestedNumbers.size) && group.id.includes('kostrikin')) return false;
        if (from && item.number < from) return false;
        if (to && item.number > to) return false;
        if (requestedNumbers.size && !requestedNumbers.has(item.number)) return false;
        return true;
      }),
    })).filter((group) => group.items.length);
  }, [visibleGroups, query, from, to, numbersParam]);
  const allTopics = [...controlCurriculum, ...curriculum];

  return (
    <main className="page-shell collection-shell">
      <header className="editorial-header reveal">
        <p className="eyebrow">{controlOnly ? 'Контрольная · 3-й модуль · 2025/2026' : meta.eyebrow}</p>
        <h1>{controlOnly ? `${meta.title} к контрольной` : meta.title}</h1>
        <p>{controlOnly ? 'Финальный официальный перечень от 30 марта 2026 года. Каждый пункт связан с одной из шести учебных глав контрольной.' : meta.intro}</p>
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
                    <small>{allTopics.find((topic) => topic.id === (item.topicId || topicForText(item.text)))?.title}</small>
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
