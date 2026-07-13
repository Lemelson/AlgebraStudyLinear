import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { lectures, moduleInfo } from '../data/lectures';

const filters = [
  { value: 4, label: 'Модуль 4 · экзамен' },
  { value: 3, label: 'Модуль 3' },
  { value: 2, label: 'Модуль 2' },
  { value: 1, label: 'Модуль 1' },
  { value: 'all', label: 'Все 38' },
];

const priorityLabels = {
  critical: 'экзамен · P0',
  high: 'экзамен · P1',
  supporting: '2 семестр',
};

function getLectureLabel(lecture) {
  if (lecture.module === 1) return 'КР-1 · 27%';
  if (lecture.module === 2) return 'экзамен-1 · 45%';
  return priorityLabels[lecture.examPriority];
}

export default function LecturesPage() {
  const [activeModule, setActiveModule] = useState(4);
  const groupedLectures = useMemo(() => {
    const visible = activeModule === 'all' ? lectures : lectures.filter((lecture) => lecture.module === activeModule);
    return [1, 2, 3, 4]
      .map((module) => ({ module, items: visible.filter((lecture) => lecture.module === module) }))
      .filter((group) => group.items.length);
  }, [activeModule]);

  return (
    <main className="page-shell collection-shell lectures-page">
      <header className="editorial-header reveal">
        <p className="eyebrow">Алгебра ПИ · 2025/2026</p>
        <h1>Лекции</h1>
        <p>
          Полная хронология из 38 лекций. Оба семестра разобраны как подробный учебник с LaTeX,
          понятной интуицией, визуальными схемами, примерами, задачами и самопроверкой. По умолчанию открыт экзаменационный 4-й модуль.
        </p>
      </header>

      <section className="lecture-focus-card reveal">
        <div>
          <span>Главный приоритет</span>
          <h2>Модуль 4 · лекции 26–38</h2>
          <p>Темы P0 уже встречались в реальном варианте 2024/25 или дают непосредственный метод решения.</p>
        </div>
        <div className="lecture-counters" aria-label="Полнота материалов">
          <strong>38</strong><span>лекций</span>
          <strong>{lectures.length}</strong><span>конспектов на сайте</span>
        </div>
      </section>

      <nav className="lecture-filters" aria-label="Фильтр лекций по модулю">
        {filters.map((filter) => (
          <button
            type="button"
            className={activeModule === filter.value ? 'active' : ''}
            onClick={() => setActiveModule(filter.value)}
            aria-pressed={activeModule === filter.value}
            key={filter.value}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      {groupedLectures.map(({ module, items }) => (
        <section className={`lecture-module lecture-module-${module}`} key={module}>
          <header className="lecture-module-header">
            <div>
              <p>{module <= 2 ? 'Семестр 1' : 'Семестр 2'}</p>
              <h2>{moduleInfo[module].title}</h2>
            </div>
            <div>
              <strong>{moduleInfo[module].subtitle}</strong>
              <span>{moduleInfo[module].range}</span>
            </div>
          </header>
          <div className="lecture-timeline">
            {items.map((lecture, index) => (
              <Link
                to={`/lectures/${lecture.slug}`}
                className={`lecture-row reveal priority-${lecture.examPriority}`}
                style={{ '--delay': `${Math.min(index, 10) * 35}ms` }}
                key={lecture.slug}
              >
                <time dateTime={lecture.slug}>{lecture.date}<small>{lecture.year}</small></time>
                <div>
                  <span>Лекция {lecture.number} · {getLectureLabel(lecture)}</span>
                  <h3>{lecture.title}</h3>
                  <p>{lecture.highlights.join(' · ')}</p>
                </div>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
