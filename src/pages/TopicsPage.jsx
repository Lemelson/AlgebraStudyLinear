import { Link, useSearchParams } from 'react-router-dom';
import { curriculum } from '../data/curriculum';
import { controlCurriculum } from '../data/controlCurriculum';
import { useStudyProgress } from '../hooks/useStudyProgress';

const tracks = {
  control: {
    eyebrow: 'Контрольная · 3-й модуль',
    title: 'Подготовка к контрольной',
    intro: 'Шесть глав по финальным материалам 2025/2026: от определения группы до смены базиса. Внутри — определения, доказательства, разобранные примеры, тренировка переноса и визуальные лаборатории.',
    topics: controlCurriculum,
    path: '/control-topics',
    totalSections: 10,
  },
  exam: {
    eyebrow: 'Экзамен',
    title: 'Подготовка к экзамену',
    intro: 'Восемь модулей выстроены по зависимостям: каждая следующая тема опирается на предыдущие и ведёт от интуиции к самостоятельному решению.',
    topics: curriculum,
    path: '/topics',
    totalSections: 10,
  },
};

export default function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTrack = searchParams.get('track') === 'exam' ? 'exam' : 'control';
  const current = tracks[selectedTrack];
  const { topicPercent } = useStudyProgress();

  const chooseTrack = (track) => setSearchParams({ track });

  return (
    <main className="page-shell collection-shell topics-hub">
      <header className="editorial-header reveal">
        <p className="eyebrow">Два маршрута подготовки</p>
        <h1>Контрольная и экзамен — отдельно</h1>
        <p>Контрольная третьего модуля проверяет группы, кольца и первые темы линейных пространств. Экзамен продолжает маршрут формами, операторами, евклидовой геометрией и разложениями.</p>
        <div className="topic-track-switch" role="group" aria-label="Выберите маршрут подготовки">
          <button type="button" className={selectedTrack === 'control' ? 'is-active' : ''} aria-pressed={selectedTrack === 'control'} onClick={() => chooseTrack('control')}><span>Контрольная</span><small>6 тем · 56 определений · 16 доказательств</small></button>
          <button type="button" className={selectedTrack === 'exam' ? 'is-active' : ''} aria-pressed={selectedTrack === 'exam'} onClick={() => chooseTrack('exam')}><span>Экзамен</span><small>8 углублённых тем</small></button>
        </div>
      </header>

      <section className="topic-track-intro" aria-live="polite">
        <p className="eyebrow">{current.eyebrow}</p>
        <h2>{current.title}</h2>
        <p>{current.intro}</p>
      </section>

      <div className="topic-index-list">
        {current.topics.map((topic, index) => (
          <Link key={topic.id} to={`${current.path}/${topic.id}`} className="topic-index-row reveal" style={{ '--delay': `${index * 45}ms` }}>
            <span className="topic-big-number">{topic.number}</span>
            <div>
              <h2>{topic.title}</h2>
              <p>{topic.summary}</p>
              <div className="topic-facts">
                <span>{topic.duration}</span><span>{topic.problemCount} задач</span><span>{topic.proofCount} доказательств</span>
              </div>
            </div>
            <strong>{topicPercent(topic.id, current.totalSections)}%</strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
