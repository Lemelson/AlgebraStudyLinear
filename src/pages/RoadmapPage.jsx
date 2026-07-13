import { Link } from 'react-router-dom';
import { curriculum, weeklyPlan } from '../data/curriculum';
import { useStudyProgress } from '../hooks/useStudyProgress';

export default function RoadmapPage() {
  const { completedCount, topicPercent } = useStudyProgress();
  const totalPercent = Math.round((completedCount / curriculum.length) * 100);
  const featuredTopic = curriculum.find((topic) => topic.featured && topicPercent(topic.id) < 100);
  const nextTopic = featuredTopic || curriculum.find((topic) => topicPercent(topic.id) < 100) || curriculum[0];

  return (
    <main className="page-shell roadmap-page">
      <section className="roadmap-hero reveal">
        <p className="eyebrow">Личный маршрут</p>
        <h1>План подготовки</h1>
        <p className="hero-meta">8 тем <span>·</span> 21 задача <span>·</span> 34 доказательства</p>
        <Link className="exam-priority-link" to="/exam-2025"><span>Главный приоритет</span><strong>Реальный экзамен 2025 · 8 задач</strong><b>Разобрать вариант →</b></Link>
      </section>

      <div className="roadmap-layout">
        <section className="roadmap-list" aria-label="Темы подготовки">
          {curriculum.map((topic, index) => {
            const percent = topicPercent(topic.id);
            return (
              <Link to={`/topics/${topic.id}`} className="roadmap-row reveal" style={{ '--delay': `${index * 45}ms` }} key={topic.id}>
                <span className={`roadmap-number ${percent === 100 ? 'done' : ''}`}>{index + 1}</span>
                <div className="roadmap-row-main">
                  <div className="roadmap-row-title">
                    <h2>{topic.title}</h2>
                    <div><span>{topic.duration}</span><strong>{percent}%</strong></div>
                  </div>
                  <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
                  <p>{topic.summary}</p>
                </div>
                <span className="row-arrow" aria-hidden="true">→</span>
              </Link>
            );
          })}
          <div className="roadmap-legend">
            <span><i className="legend-done" />Завершено</span>
            <span><i className="legend-active" />В процессе</span>
            <span><i />Не начато</span>
          </div>
        </section>

        <aside className="study-panels">
          <section className="study-panel recommendation reveal">
            <p className="panel-label">Рекомендуется сейчас</p>
            <span className="topic-index">Тема {Number(nextTopic.number)}</span>
            <h2>{nextTopic.title}</h2>
            <div className="progress-track"><span style={{ width: `${topicPercent(nextTopic.id)}%` }} /></div>
            <p>{nextTopic.summary}</p>
            <Link className="primary-button" to={`/topics/${nextTopic.id}`}>Продолжить</Link>
          </section>

          <section className="study-panel weekly-panel reveal">
            <div className="panel-heading"><h2>Ритм на неделю</h2><span>7 занятий</span></div>
            <div className="week-list">
              {weeklyPlan.map(([day, type, task]) => (
                <div key={day}><strong>{day}</strong><span>{type}</span><p>{task}</p></div>
              ))}
            </div>
          </section>

          <section className="study-panel progress-panel reveal">
            <p className="panel-label">Общий прогресс</p>
            <div className="total-progress"><strong>{totalPercent}%</strong><span>{completedCount} из {curriculum.length} тем</span></div>
            <div className="progress-track"><span style={{ width: `${totalPercent}%` }} /></div>
          </section>
        </aside>
      </div>
    </main>
  );
}
