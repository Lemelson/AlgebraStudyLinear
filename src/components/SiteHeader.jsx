import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Маршрут'],
  ['/topics', 'Темы'],
  ['/definitions', 'Определения'],
  ['/proofs', 'Доказательства'],
  ['/problems', 'Задачи'],
  ['/exam-2025', 'Экзамен 2025'],
  ['/exam-2025/preparation', 'Тренажёр'],
  ['/lectures', 'Лекции'],
  ['/glossary', 'Словарь'],
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <NavLink to="/" className="wordmark">Алгебра <span>/ Экзамен</span></NavLink>
      <nav className="site-nav" aria-label="Основная навигация">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
        ))}
      </nav>
      <div className="profile-mark" aria-label="Локальный профиль">АБ</div>
    </header>
  );
}
