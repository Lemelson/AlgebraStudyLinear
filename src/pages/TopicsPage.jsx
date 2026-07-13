import { Link } from 'react-router-dom';
import { curriculum } from '../data/curriculum';
import { useStudyProgress } from '../hooks/useStudyProgress';

export default function TopicsPage() {
  const { topicPercent } = useStudyProgress();
  return (
    <main className="page-shell collection-shell">
      <header className="editorial-header reveal">
        <p className="eyebrow">Программа</p>
        <h1>Темы экзамена</h1>
        <p>Восемь модулей выстроены по зависимостям: каждая следующая тема опирается на предыдущие.</p>
      </header>
      <div className="topic-index-list">
        {curriculum.map((topic, index) => (
          <Link key={topic.id} to={`/topics/${topic.id}`} className="topic-index-row reveal" style={{ '--delay': `${index * 45}ms` }}>
            <span className="topic-big-number">{topic.number}</span>
            <div>
              <h2>{topic.title}</h2>
              <p>{topic.summary}</p>
              <div className="topic-facts">
                <span>{topic.duration}</span><span>{topic.problemCount} задач</span><span>{topic.proofCount} доказательств</span>
              </div>
            </div>
            <strong>{topicPercent(topic.id)}%</strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
