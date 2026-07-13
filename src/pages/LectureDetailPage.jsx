import { Link, useParams } from 'react-router-dom';
import { lectures } from '../data/lectures';
import { curriculum } from '../data/curriculum';
import { lectureCompanionsB } from '../data/lectureCompanionsB';
import { lectureCompanionsA } from '../data/lectureCompanionsA';
import LectureCompanion from '../components/LectureCompanion';

export default function LectureDetailPage() {
  const { slug } = useParams();
  const lecture = lectures.find((item) => item.slug === slug);
  if (!lecture) return <main className="page-shell empty-state"><h1>Лекция не найдена</h1><Link to="/lectures">Вернуться к лекциям</Link></main>;
  const topic = curriculum.find((item) => item.id === lecture.topicId);
  const companion = lectureCompanionsA[lecture.slug] || lectureCompanionsB[lecture.slug];
  return <main className="page-shell document-page"><Link className="back-link" to="/lectures">← Все лекции</Link><header className="document-header"><p className="eyebrow">Лекция · {lecture.date}.2025</p><h1>{lecture.title}</h1><p>Навигационная выжимка: ключевые идеи, формулы и вопросы для самопроверки.</p></header><section className="lecture-summary"><div><span>Главное</span><ol>{lecture.highlights.map((item) => <li key={item}>{item}</li>)}</ol></div><div><span>Связанная тема</span><h2>{topic.title}</h2><p>{topic.summary}</p><Link className="secondary-button" to={`/topics/${topic.id}`}>Разобрать понятным языком</Link></div></section><LectureCompanion data={companion} /></main>;
}
