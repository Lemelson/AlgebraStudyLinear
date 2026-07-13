import { Link } from 'react-router-dom';
import MathText from '../components/MathText';
import { examVariant2025 } from '../data/examVariant2025';
import { module3, module4, module3ToModule4, preparationPriority } from '../data/semesterClassification';

function TopicRows({ module }) {
  return (
    <ol className="assessment-topic-list">
      {module.topics.map((topic, index) => (
        <li key={topic.id}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <div className="assessment-topic-heading">
              <h3>{topic.title}</h3>
              <small data-priority={topic.priority}>{preparationPriority[topic.priority].label}</small>
            </div>
            <p>{topic.exactTopics.join(' · ')}</p>
            <div className="topic-jump-links">
              {topic.siteTopicIds.map((id) => <Link key={id} to={`/topics/${id}`}>Открыть учебную главу →</Link>)}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ExamFocusPage() {
  return (
    <main className="page-shell exam-focus-page">
      <header className="exam-focus-hero reveal">
        <div>
          <p className="eyebrow">Главный маршрут · второй семестр</p>
          <h1>Экзамен<br />2025</h1>
          <p>Восемь задач, 21 тип и понятная карта: что является фундаментом третьего модуля, а что проверяется на экзамене четвёртого.</p>
          <div className="exam-focus-facts">
            <span><strong>8</strong> задач в варианте</span>
            <span><strong>{examVariant2025.totalWeight}</strong> баллов</span>
            <span><strong>21</strong> официальный тип</span>
          </div>
        </div>
      </header>

      <section className="assessment-split" aria-labelledby="assessment-title">
        <div className="section-heading">
          <p className="eyebrow">Не смешивать две проверки</p>
          <h2 id="assessment-title">Контрольная строит фундамент. Экзамен проверяет применение.</h2>
        </div>
        <article className="assessment-card assessment-card-support">
          <span>03 · контрольная</span>
          <h3>{module3.title}</h3>
          <p>{module3.role}</p>
          <b>Полезно, но не конечная цель</b>
          <TopicRows module={module3} />
        </article>
        <article className="assessment-card assessment-card-primary">
          <span>04 · экзамен</span>
          <h3>{module4.title}</h3>
          <p>{module4.role}</p>
          <b>Главный приоритет подготовки</b>
          <TopicRows module={module4} />
        </article>
      </section>

      <section className="real-ticket-section" aria-labelledby="ticket-title">
        <div className="section-heading section-heading-inline">
          <div><p className="eyebrow">Разобрать один в один</p><h2 id="ticket-title">Задачи реального экзамена</h2></div>
          <p>Сначала решаем конкретный вариант. Затем каждая карточка выводит к общей теме и другим официальным задачам того же типа.</p>
        </div>
        <ol className="real-ticket-grid">
          {examVariant2025.problems.map((problem) => (
            <li key={problem.id}>
              <Link to={`/exam-2025/${problem.number}`}>
                <div className="ticket-card-meta"><span>№ {problem.number}</span><small>{problem.weight} балла</small></div>
                <h3>{problem.title}</h3>
                <MathText text={problem.statement} />
                <div className="ticket-card-footer"><span>{problem.classification}</span><b>Полный разбор →</b></div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="bridge-section">
        <div className="section-heading"><p className="eyebrow">Зачем всё-таки нужен третий модуль</p><h2>Пять мостов к экзамену</h2></div>
        <ol>{module3ToModule4.map((bridge, index) => <li key={bridge.fromTopicId}><span>{index + 1}</span><p>{bridge.relation}</p></li>)}</ol>
      </section>

      <section className="official-types-section">
        <div className="section-heading section-heading-inline">
          <div><p className="eyebrow">Полное покрытие</p><h2>Официальные типы задач</h2></div>
          <p>Реальный билет не заменяет подготовку по всему списку. Эти типы нужно уметь решать с другими числами и формулировками.</p>
        </div>
        <div className="official-type-grid">
          {module4.problemTypes.map((type) => (
            <article key={type.id}>
              <span>{type.officialProblemNumbers.map((number) => `№${number}`).join(', ')}</span>
              <h3>{type.title}</h3>
              <Link to={`/problems/problems-exam/${type.officialProblemNumbers[0]}`}>Открыть официальный разбор →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
