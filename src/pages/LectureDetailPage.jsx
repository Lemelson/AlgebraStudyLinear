import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FirstSemesterVisual from '../components/FirstSemesterVisual';
import LectureMarkdown from '../components/LectureMarkdown';
import { curriculum } from '../data/curriculum';
import { courseSourceUrl, lectures, moduleInfo } from '../data/lectures';
import { getLectureLesson } from '../data/lectureLessons';

const priorityCopy = {
  critical: {
    label: 'P0 · обязательно к экзамену',
    text: 'Тема уже встречалась в реальном варианте 2024/25 или напрямую даёт метод решения экзаменационной задачи.',
  },
  high: {
    label: 'P1 · высокий приоритет',
    text: 'Тема входит в официальный экзаменационный список и связывает несколько задач курса.',
  },
  supporting: {
    label: 'Подготовка ко 2 семестру',
    text: 'Эта лекция создаёт язык и технику, на которых строится четвёртый модуль.',
  },
  foundation: {
    label: 'Первый семестр · фундамент курса',
    text: 'Подробная глава первого семестра: эта техника проверяется на КР-1 или письменном экзамене и затем используется во всём курсе.',
  },
};

const firstSemesterAssessment = {
  1: {
    title: 'Контрольная работа 1',
    text: 'Матрицы, метод Гаусса, определители, обратная матрица, ранг и СЛАУ входят в первую контрольную. Её вес в оценке за семестр — 27%.',
  },
  2: {
    title: 'Письменный экзамен первого семестра',
    text: 'Экзамен после второго модуля объединяет СЛАУ, комплексные числа, многочлены, аналитическую геометрию и начала общей алгебры. Его вес — 45%.',
  },
};

export default function LectureDetailPage() {
  const { slug } = useParams();
  const lectureIndex = lectures.findIndex((item) => item.slug === slug);
  const lecture = lectures[lectureIndex];
  const [lessonState, setLessonState] = useState({ filename: null, source: '' });

  useEffect(() => {
    let current = true;

    if (!lecture) return () => { current = false; };

    getLectureLesson(lecture.lessonFile)
      .then((source) => {
        if (current) setLessonState({ filename: lecture.lessonFile, source });
      });

    return () => { current = false; };
  }, [lecture]);

  if (!lecture) {
    return (
      <main className="page-shell empty-state">
        <h1>Лекция не найдена</h1>
        <Link to="/lectures">Вернуться к лекциям</Link>
      </main>
    );
  }

  const topic = lecture.topicId ? curriculum.find((item) => item.id === lecture.topicId) : null;
  const previous = lectures[lectureIndex - 1];
  const next = lectures[lectureIndex + 1];
  const priority = priorityCopy[lecture.examPriority];
  const assessment = firstSemesterAssessment[lecture.module];
  const lessonLoading = lessonState.filename !== lecture.lessonFile;
  const lesson = lessonLoading ? '' : lessonState.source;

  return (
    <main className="page-shell document-page lecture-document">
      <Link className="back-link" to="/lectures">← Все 38 лекций</Link>

      <header className="document-header">
        <p className="eyebrow">
          Лекция {lecture.number} · {lecture.fullDate} · {moduleInfo[lecture.module].title}
        </p>
        <h1>{lecture.title}</h1>
        <p>
          {lecture.semester === 1
            ? 'Подробный урок первого семестра: простая интуиция, теория, доказательства, визуализация, разобранные примеры и подготовка к проверочной работе.'
            : 'Подробный урок простым языком: теория, LaTeX-формулы, разобранные примеры, практика и самопроверка.'}
        </p>
      </header>

      <section className={`lecture-priority-card priority-${lecture.examPriority}`}>
        <div><span>Роль в подготовке</span><h2>{priority.label}</h2><p>{priority.text}</p></div>
        {lecture.module === 4 && <Link className="secondary-button" to="/exam-2025/preparation">Открыть тренажёр экзамена</Link>}
      </section>

      <section className="lecture-summary">
        <div>
          <span>Официальный охват</span>
          <ol>{lecture.highlights.map((item) => <li key={item}>{item}</li>)}</ol>
        </div>
        <div>
          <span>Материалы</span>
          <h2>{lecture.recordingUrl ? 'Запись доступна' : 'Записи на странице нет'}</h2>
          <p>
            {lecture.recordingKind === 'rutube' && 'Приватная запись Rutube сохранена ссылкой.'}
            {lecture.recordingKind === 'yandex' && 'Запись и раздаточные материалы размещены на Яндекс Диске.'}
            {!lecture.recordingUrl && 'Для лекций 1–15 официальный источник содержит только перечень пройденных тем.'}
          </p>
          <div className="lecture-resource-links">
            {lecture.recordingUrl && <a className="secondary-button" href={lecture.recordingUrl} target="_blank" rel="noreferrer">Открыть запись ↗</a>}
            {lecture.presentationUrl && <a className="secondary-button" href={lecture.presentationUrl} target="_blank" rel="noreferrer">Презентация по коникам ↗</a>}
            <a href={courseSourceUrl} target="_blank" rel="noreferrer">Официальная страница курса ↗</a>
          </div>
        </div>
      </section>

      {assessment && (
        <aside className="lecture-topic-bridge lecture-assessment-bridge">
          <div><span>К чему готовит эта лекция</span><h2>{assessment.title}</h2><p>{assessment.text}</p></div>
          <Link className="secondary-button" to="/lectures">К карте первого семестра</Link>
        </aside>
      )}

      {topic && (
        <aside className="lecture-topic-bridge">
          <div><span>Связанная глава учебника</span><h2>{topic.title}</h2><p>{topic.summary}</p></div>
          <Link className="secondary-button" to={`/topics/${topic.id}`}>Открыть интерактивную главу</Link>
        </aside>
      )}

      {lecture.number <= 15 && (
        <FirstSemesterVisual key={lecture.number} lectureNumber={lecture.number} />
      )}

      {lessonLoading ? (
        <section className="lecture-notes lecture-notes-empty" aria-live="polite">
          <h2>Загружаем подробный конспект…</h2>
        </section>
      ) : (
        <LectureMarkdown source={lesson} />
      )}

      <nav className="lecture-pagination" aria-label="Соседние лекции">
        {previous ? <Link to={`/lectures/${previous.slug}`}><span>← Лекция {previous.number}</span><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link to={`/lectures/${next.slug}`}><span>Лекция {next.number} →</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
    </main>
  );
}
