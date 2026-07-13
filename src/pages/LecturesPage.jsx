import { Link } from 'react-router-dom';
import { lectures } from '../data/lectures';

export default function LecturesPage() {
  return (
    <main className="page-shell collection-shell">
      <header className="editorial-header reveal">
        <p className="eyebrow">Хронология курса</p>
        <h1>Лекции</h1>
        <p>Конспекты ассистентов с 2 апреля по 18 июня. Здесь они собраны в учебную последовательность, а не просто в список файлов.</p>
      </header>
      <div className="lecture-timeline">
        {lectures.map((lecture, index) => (
          <Link to={`/lectures/${lecture.slug}`} className="lecture-row reveal" style={{ '--delay': `${index * 45}ms` }} key={lecture.date}>
            <time>{lecture.date}<small>2025</small></time>
            <div><span>Лекция {index + 1}</span><h2>{lecture.title}</h2><p>{lecture.highlights.join(' · ')}</p></div><b aria-hidden="true">→</b>
          </Link>
        ))}
      </div>
    </main>
  );
}
