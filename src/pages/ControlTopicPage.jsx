import { Link, useParams } from 'react-router-dom';
import ControlScope from '../components/ControlScope';
import DeepDive from '../components/DeepDive';
import GlossaryText from '../components/GlossaryText';
import MathText from '../components/MathText';
import TopicMastery from '../components/TopicMastery';
import { ControlTopicAtlas, ControlTopicVisualizer } from '../components/ControlTopicVisuals';
import { controlCurriculum } from '../data/controlCurriculum';
import { controlTopicDeepDives } from '../data/controlTopicDeepDives';
import { controlTopicLessons } from '../data/controlTopicLessons';
import { controlTopicMastery } from '../data/controlTopicMastery';
import { useStudyProgress } from '../hooks/useStudyProgress';

const baseSections = [
  ['control-scope', 'Что на контрольной'],
  ['intuition', 'Интуиция'],
  ['definition', 'Определения'],
  ['ideas', 'Главные идеи'],
  ['visualization', 'Визуализация'],
  ['example', 'Пример'],
  ['mistakes', 'Ошибки'],
  ['practice', 'Практика'],
];

function DoneButton({ done, onClick }) {
  return <button className={`section-done ${done ? 'is-done' : ''}`} onClick={onClick}><span>{done ? '✓' : '○'}</span>{done ? 'Раздел отмечен' : 'Отметить раздел понятным'}</button>;
}

export default function ControlTopicPage() {
  const { slug } = useParams();
  const topic = controlCurriculum.find((item) => item.id === slug);
  const lesson = controlTopicLessons[slug];
  const deepDive = controlTopicDeepDives[slug];
  const mastery = controlTopicMastery[slug];
  const { progress, update, topicPercent } = useStudyProgress();

  if (!topic || !lesson) {
    return <main className="page-shell empty-state"><h1>Тема контрольной не найдена</h1><Link to="/topics?track=control">Вернуться к темам</Link></main>;
  }

  const sections = [...baseSections, ...(deepDive ? [['deep-dive', 'Углубление']] : []), ...(mastery ? [['mastery', 'Тренажёр темы']] : [])];
  const completed = new Set(progress[topic.id] || []);
  const toggle = (id) => update(topic.id, id);
  const percent = topicPercent(topic.id, sections.length);

  return (
    <main className="lesson-page control-lesson-page">
      <nav className="lesson-toc" aria-label="Содержание главы контрольной"><p>Содержание</p>{sections.map(([id, label], index) => <a key={id} href={`#${id}`} className={completed.has(id) ? 'done' : ''}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
      <article className="lesson-article">
        <div className="lesson-breadcrumb"><Link to="/topics?track=control">Контрольная</Link><span>/</span><span>{topic.title}</span></div>
        <header className="lesson-header reveal"><p className="eyebrow">{topic.number} · {topic.duration}</p><h1>{topic.title}</h1><p>{lesson.subtitle}. Глава начинает со школьных примеров, затем доводит формулировки до уровня контрольной и учит переносить метод на изменённое условие.</p></header>

        <ControlScope scope={mastery?.scope} done={completed.has('control-scope')} onDone={() => toggle('control-scope')} />

        <section id="intuition" className="lesson-section reveal"><p className="section-kicker">02 · Интуиция</p><h2>{lesson.intuitionTitle}</h2>{lesson.intuition.map((paragraph) => <p key={paragraph}><GlossaryText>{paragraph}</GlossaryText></p>)}<div className="plain-language-block"><span>Совсем коротко</span><p><GlossaryText>{lesson.plain}</GlossaryText></p></div><DoneButton done={completed.has('intuition')} onClick={() => toggle('intuition')} /></section>

        <section id="definition" className="lesson-section reveal"><p className="section-kicker">03 · Точные определения</p><h2>Что нужно уметь восстановить, а не просто узнать глазами</h2>{lesson.definitions.map((definition) => <div className="definition-block" key={definition}><MathText text={definition} /></div>)}<div className="exam-tip"><strong>Формула полного ответа</strong><p>Назовите объект и каждое условие, приведите пример и контрпример, а затем покажите одно место в задаче, где это условие используется. Так определение становится рабочим инструментом.</p></div><DoneButton done={completed.has('definition')} onClick={() => toggle('definition')} /></section>

        <section id="ideas" className="lesson-section reveal"><p className="section-kicker">04 · Каркас темы</p><h2>Связи, на которых держатся разные типы задач</h2><div className="idea-grid">{lesson.ideas.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p><GlossaryText>{text}</GlossaryText></p></article>)}</div><DoneButton done={completed.has('ideas')} onClick={() => toggle('ideas')} /></section>

        <section id="visualization" className="lesson-section lesson-section-wide reveal"><p className="section-kicker">05 · Первая визуальная лаборатория</p><h2>Меняйте условие и находите момент, где свойство возникает или ломается</h2><p>После каждого изменения сначала предскажите результат, затем сравните с визуализацией и объясните наблюдение одним строгим предложением.</p><ControlTopicVisualizer topicId={slug} /><DoneButton done={completed.has('visualization')} onClick={() => toggle('visualization')} /></section>

        <section id="example" className="lesson-section reveal"><p className="section-kicker">06 · Разобранный пример</p><h2>{lesson.exampleTitle}</h2><div className="definition-block"><MathText text={lesson.examplePrompt} /></div><div className="solution-steps">{lesson.steps.map(([title, text], index) => <div key={title}><span>Шаг {index + 1}</span><div><h3>{title}</h3><p><GlossaryText>{text}</GlossaryText></p></div></div>)}</div><DoneButton done={completed.has('example')} onClick={() => toggle('example')} /></section>

        <section id="mistakes" className="lesson-section reveal"><p className="section-kicker">07 · Типичные ошибки</p><h2>Где теряются баллы и как поймать ошибку проверкой</h2><div className="mistake-list">{lesson.mistakes.map((text, index) => <article key={text}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{text.split(':')[0]}</h3><p><GlossaryText>{text}</GlossaryText></p></div></article>)}</div><DoneButton done={completed.has('mistakes')} onClick={() => toggle('mistakes')} /></section>

        <section id="practice" className="lesson-section reveal"><p className="section-kicker">08 · Первая самопроверка</p><h2>Короткая практика сразу после объяснения</h2><ol className="practice-list">{lesson.practice.map((task) => <li key={task}><GlossaryText>{task}</GlossaryText></li>)}</ol><p>Для каждой задачи запишите четыре строки: тип объекта → нужный критерий → вычисление → независимая проверка. Если тип не узнаётся за 30 секунд, вернитесь к «Каркасу темы».</p><DoneButton done={completed.has('practice')} onClick={() => toggle('practice')} /></section>

        <DeepDive content={deepDive} />
        <TopicMastery topicId={slug} content={mastery} atlas={<ControlTopicAtlas topicId={slug} />} done={completed.has('mastery')} onDone={() => toggle('mastery')} />
        <button className={`complete-topic ${completed.has('complete') ? 'completed' : ''}`} onClick={() => toggle('complete')}>{completed.has('complete') ? 'Тема контрольной отмечена завершённой' : 'Завершить тему контрольной'}</button>
      </article>

      <aside className="exam-rail control-rail"><p className="panel-label">На контрольной</p><h2>Что уметь</h2><ol>{topic.goals.map((goal, index) => <li key={goal}><span>{index + 1}</span><p>{goal}</p></li>)}</ol><div className="rail-source-range"><span>Официальный охват</span><p>Определения {topic.definitionRange}</p><p>Доказательства {topic.proofNumbers.join(', ')}</p></div><div className="rail-progress"><span>Готовность</span><strong>{percent}%</strong><div className="progress-track"><i style={{ width: `${percent}%` }} /></div></div><Link className="primary-button" to="/problems">Открыть задачи КР</Link><Link className="rail-link" to="/proofs">Доказательства КР →</Link></aside>
    </main>
  );
}
