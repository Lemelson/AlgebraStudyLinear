import { Link } from 'react-router-dom';
import GlossaryText from './GlossaryText';

export default function ControlScope({ scope, done, onDone }) {
  const direct = scope?.direct || scope?.exam || [];
  const foundation = scope?.foundation || [];
  const links = scope?.links || [];

  return (
    <section id="control-scope" className="lesson-section exam-scope-section control-scope-section reveal">
      <p className="section-kicker">01 · Что действительно входит в контрольную</p>
      <h2>Официальный минимум и школьный фундамент</h2>
      <p>Эта глава собрана по финальным спискам контрольной третьего модуля от 30 марта 2026 года. Справа — то, что проверяют напрямую; слева в обучении мы добавляем только необходимые промежуточные шаги.</p>
      <div className="exam-scope-grid">
        <article>
          <span>Прямо в контрольной</span>
          <ul>{direct.map((item) => <li key={item}><GlossaryText>{item}</GlossaryText></li>)}</ul>
        </article>
        <article>
          <span>Что нужно восстановить перед темой</span>
          <ul>{foundation.map((item) => <li key={item}><GlossaryText>{item}</GlossaryText></li>)}</ul>
        </article>
      </div>
      <nav className="exam-scope-links" aria-label="Официальные материалы контрольной">
        {links.map((link) => <Link to={link.to} key={`${link.to}-${link.label}`}>{link.label}<span>→</span></Link>)}
      </nav>
      <button className={`section-done ${done ? 'is-done' : ''}`} onClick={onDone}><span>{done ? '✓' : '○'}</span>{done ? 'Приоритеты отмечены' : 'Приоритеты понятны'}</button>
    </section>
  );
}
