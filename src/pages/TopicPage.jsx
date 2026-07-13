import { Link, useParams } from 'react-router-dom';
import BasisVisualizer from '../components/BasisVisualizer';
import MathText from '../components/MathText';
import TopicVisualizer from '../components/TopicVisualizer';
import DeepDive from '../components/DeepDive';
import GlossaryText from '../components/GlossaryText';
import { curriculum } from '../data/curriculum';
import { topicLessons } from '../data/topicLessons';
import { topicDeepDivesB } from '../data/topicDeepDivesB';
import { topicDeepDivesA } from '../data/topicDeepDivesA';
import { useStudyProgress } from '../hooks/useStudyProgress';

const baseSections = [['intuition', 'Интуиция'], ['definition', 'Определения'], ['ideas', 'Главные идеи'], ['visualization', 'Визуализация'], ['example', 'Пример'], ['mistakes', 'Ошибки'], ['practice', 'Практика']];

function DoneButton({ done, onClick }) {
  return <button className={`section-done ${done ? 'is-done' : ''}`} onClick={onClick}><span>{done ? '✓' : '○'}</span>{done ? 'Раздел отмечен' : 'Отметить раздел понятным'}</button>;
}

export default function TopicPage() {
  const { slug } = useParams();
  const topic = curriculum.find((item) => item.id === slug);
  const lesson = topicLessons[slug];
  const deepDive = topicDeepDivesA[slug] || topicDeepDivesB[slug];
  const { progress, update, topicPercent } = useStudyProgress();
  if (!topic || !lesson) return <main className="page-shell empty-state"><h1>Тема не найдена</h1><Link to="/topics">Вернуться к темам</Link></main>;

  const sections = deepDive ? [...baseSections, ['deep-dive', 'Углубление']] : baseSections;
  const completed = new Set(progress[topic.id] || []);
  const toggle = (id) => update(topic.id, id);
  const percent = topicPercent(topic.id, sections.length);
  return (
    <main className="lesson-page">
      <nav className="lesson-toc" aria-label="Содержание урока"><p>Содержание</p>{sections.map(([id, label], index) => <a key={id} href={`#${id}`} className={completed.has(id) ? 'done' : ''}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
      <article className="lesson-article">
        <div className="lesson-breadcrumb"><Link to="/topics">Темы</Link><span>/</span><span>{topic.title}</span></div>
        <header className="lesson-header reveal"><p className="eyebrow">Тема {Number(topic.number)} · {topic.duration}</p><h1>{topic.title}</h1><p>{lesson.subtitle}. Здесь собраны формулировки, которые нужны на экзамене, простая интуиция и алгоритмы решения.</p></header>

        <section id="intuition" className="lesson-section reveal"><p className="section-kicker">01 · Интуиция</p><h2>{lesson.intuitionTitle}</h2>{lesson.intuition.map((p) => <p key={p}><GlossaryText>{p}</GlossaryText></p>)}<div className="plain-language-block"><span>Совсем коротко</span><p><GlossaryText>{lesson.plain}</GlossaryText></p></div><DoneButton done={completed.has('intuition')} onClick={() => toggle('intuition')} /></section>

        <section id="definition" className="lesson-section reveal"><p className="section-kicker">02 · Точные определения</p><h2>Что нужно уметь сказать без конспекта</h2>{lesson.definitions.map((definition) => <div className="definition-block" key={definition}><MathText text={definition} /></div>)}<div className="exam-tip"><strong>Как отвечать устно</strong><p>Сначала назовите объект и все условия определения. Затем приведите один пример и один контрпример. После этого объясните, где определение используется в задаче.</p></div><DoneButton done={completed.has('definition')} onClick={() => toggle('definition')} /></section>

        <section id="ideas" className="lesson-section reveal"><p className="section-kicker">03 · Каркас темы</p><h2>Три связи, которые важнее механического заучивания</h2><div className="idea-grid">{lesson.ideas.map(([title, text]) => <article key={title}><span>{String(lesson.ideas.findIndex((item) => item[0] === title) + 1).padStart(2, '0')}</span><h3>{title}</h3><p><GlossaryText>{text}</GlossaryText></p></article>)}</div><DoneButton done={completed.has('ideas')} onClick={() => toggle('ideas')} /></section>

        <section id="visualization" className="lesson-section lesson-section-wide reveal"><p className="section-kicker">04 · Визуализация</p><h2>Поменяйте параметр и посмотрите, что сохраняется</h2><p>Интерактивная схема показывает геометрический смысл, а не заменяет вычисления. После эксперимента проговорите наблюдение своими словами.</p>{slug === 'vector-spaces' ? <BasisVisualizer /> : <TopicVisualizer topicId={slug} />}<DoneButton done={completed.has('visualization')} onClick={() => toggle('visualization')} /></section>

        <section id="example" className="lesson-section reveal"><p className="section-kicker">05 · Разобранный пример</p><h2>{lesson.exampleTitle}</h2><div className="definition-block"><MathText text={lesson.examplePrompt} /></div><div className="solution-steps">{lesson.steps.map(([title, text], index) => <div key={title}><span>Шаг {index + 1}</span><div><h3>{title}</h3><p><GlossaryText>{text}</GlossaryText></p></div></div>)}</div><DoneButton done={completed.has('example')} onClick={() => toggle('example')} /></section>

        <section id="mistakes" className="lesson-section reveal"><p className="section-kicker">06 · Типичные ошибки</p><h2>Где чаще всего теряются баллы</h2><div className="mistake-list">{lesson.mistakes.map((text, index) => <article key={text}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{text.split(':')[0]}</h3><p><GlossaryText>{text}</GlossaryText></p></div></article>)}</div><DoneButton done={completed.has('mistakes')} onClick={() => toggle('mistakes')} /></section>

        <section id="practice" className="lesson-section reveal"><p className="section-kicker">07 · Самопроверка</p><h2>Три задания после главы</h2><ol className="practice-list">{lesson.practice.map((task) => <li key={task}><GlossaryText>{task}</GlossaryText></li>)}</ol><p>Решайте в таком порядке: назвать тип → выписать теорему или алгоритм → выполнить вычисления → проверить ответ. Если не можете назвать тип за 30 секунд, вернитесь к блоку «Главные идеи».</p><DoneButton done={completed.has('practice')} onClick={() => toggle('practice')} /><button className={`complete-topic ${completed.has('complete') ? 'completed' : ''}`} onClick={() => toggle('complete')}>{completed.has('complete') ? 'Тема отмечена завершённой' : 'Завершить тему'}</button></section>
        <DeepDive content={deepDive} />
      </article>
      <aside className="exam-rail"><p className="panel-label">На экзамене</p><h2>Что уметь</h2><ol>{topic.goals.map((goal, index) => <li key={goal}><span>{index + 1}</span><p>{goal}</p></li>)}</ol><div className="rail-progress"><span>Готовность</span><strong>{percent}%</strong><div className="progress-track"><i style={{ width: `${percent}%` }} /></div></div><Link className="primary-button" to="/problems">Открыть задачи</Link><Link className="rail-link" to="/proofs">Доказательства по теме →</Link></aside>
    </main>
  );
}
