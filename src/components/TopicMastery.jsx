import GlossaryText from './GlossaryText';
import MathText from './MathText';
import TopicConceptAtlas from './TopicConceptAtlas';

export default function TopicMastery({ topicId, content, done, onDone, atlas = null }) {
  if (!content) return null;
  const layers = [
    ['Если знаете только школу', content.layers.school],
    ['Что происходит математически', content.layers.meaning],
    ['Как сказать на экзамене', content.layers.oral],
  ];
  return (
    <section id="mastery" className="lesson-section lesson-section-wide topic-mastery reveal">
      <p className="section-kicker">10 · От первого знакомства до переноса на новую задачу</p>
      <h2>Не запоминаем один шаблон — строим рабочую модель темы</h2>

      <div className="mastery-subsection">
        <div className="mastery-heading"><span>А · Лестница понимания</span><h3>Какие четыре ступени нельзя перепрыгивать</h3></div>
        <div className="understanding-ladder">
          {content.bridge.map((item, index) => <article key={item.title}><b>{index + 1}</b><div><h4>{item.title}</h4><p><GlossaryText>{item.text}</GlossaryText></p></div></article>)}
        </div>
      </div>

      <div className="mastery-subsection">
        <div className="mastery-heading"><span>Б · Одно понятие, три масштаба</span><h3>Сначала образ, затем механизм, затем точная речь</h3></div>
        <div className="explanation-levels">
          {layers.map(([label, text], index) => <article key={label}><span>0{index + 1}</span><h4>{label}</h4><p><GlossaryText>{text}</GlossaryText></p></article>)}
        </div>
      </div>

      <div className="mastery-subsection mastery-atlas-section">
        <div className="mastery-heading"><span>В · Вторая визуальная лаборатория</span><h3>Меняйте условия и следите за инвариантом</h3></div>
        {atlas || <TopicConceptAtlas topicId={topicId} />}
      </div>

      <div className="mastery-subsection">
        <div className="mastery-heading"><span>Г · Алгоритм</span><h3>{content.algorithm.title}</h3></div>
        <ol className="mastery-algorithm">
          {content.algorithm.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p><GlossaryText>{step}</GlossaryText></p></li>)}
        </ol>
      </div>

      <div className="mastery-subsection">
        <div className="mastery-heading"><span>Д · Доказательства</span><h3>Идея, строгий каркас и место, где обычно возникает дыра</h3></div>
        <div className="proof-map-grid">
          {content.proofs.map((proof) => <article key={proof.title}>
            <span>Ключевое доказательство</span>
            <h4>{proof.title}</h4>
            <MathText className="proof-claim" text={proof.claim} />
            <div className="proof-big-idea"><b>Главная идея</b><p><GlossaryText>{proof.idea}</GlossaryText></p></div>
            <ol>{proof.steps.map((step) => <li key={step}><GlossaryText>{step}</GlossaryText></li>)}</ol>
            <aside><b>Не оставить дыру:</b> <GlossaryText>{proof.trap}</GlossaryText></aside>
          </article>)}
        </div>
      </div>

      <div className="mastery-subsection">
        <div className="mastery-heading"><span>Е · Практика с переносом</span><h3>После решения меняем условие, чтобы шаблон перестал работать автоматически</h3></div>
        <div className="mastery-practice-grid">
          {content.practice.map((problem, index) => <article key={problem.title}>
            <header><span>{problem.level}</span><b>{String(index + 1).padStart(2, '0')}</b></header>
            <h4>{problem.title}</h4>
            <MathText text={problem.prompt} />
            <details><summary>Подсказка</summary><MathText text={problem.hint} /></details>
            <details><summary>Решение и проверка</summary><MathText text={problem.solution} /></details>
            <div className="transfer-task"><span>Измените условие</span><MathText text={problem.variation} /></div>
          </article>)}
        </div>
      </div>

      <div className="mastery-subsection mastery-checklist">
        <div className="mastery-heading"><span>Ж · Критерий готовности</span><h3>Тема закрыта только если каждый пункт можно выполнить без конспекта</h3></div>
        <ul>{content.checklist.map((item) => <li key={item}><span>□</span><GlossaryText>{item}</GlossaryText></li>)}</ul>
      </div>

      <button className={`section-done ${done ? 'is-done' : ''}`} onClick={onDone}><span>{done ? '✓' : '○'}</span>{done ? 'Углубление отмечено' : 'Отметить углубление понятным'}</button>
    </section>
  );
}
