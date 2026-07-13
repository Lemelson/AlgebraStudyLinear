import { Link } from 'react-router-dom';
import GlossaryText from './GlossaryText';

export default function ExamScope({ scope, done, onDone }) {
  return (
    <section id="exam-scope" className="lesson-section exam-scope-section reveal">
      <p className="section-kicker">01 · Что действительно входит в экзамен</p>
      <h2>Отделяем основной приоритет от фундамента коллоквиума</h2>
      <p>Материалы второго коллоквиума здесь не выданы за отдельный экзаменационный билет: они отмечены как фундамент, без которого не решаются задачи и не понимаются доказательства.</p>
      <div className="exam-scope-grid">
        <article>
          <span>Прямо в экзамене</span>
          <ul>{scope.exam.map((item) => <li key={item}><GlossaryText>{item}</GlossaryText></li>)}</ul>
        </article>
        <article>
          <span>Фундамент из коллоквиума 2</span>
          <ul>{scope.foundation.map((item) => <li key={item}><GlossaryText>{item}</GlossaryText></li>)}</ul>
        </article>
      </div>
      <nav className="exam-scope-links" aria-label="Связанные официальные материалы">
        {scope.links.map((link) => <Link to={link.to} key={`${link.to}-${link.label}`}>{link.label}<span>→</span></Link>)}
      </nav>
      <button className={`section-done ${done ? 'is-done' : ''}`} onClick={onDone}><span>{done ? '✓' : '○'}</span>{done ? 'Приоритеты отмечены' : 'Приоритеты понятны'}</button>
    </section>
  );
}
