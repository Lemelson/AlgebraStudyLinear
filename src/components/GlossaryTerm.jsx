import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { glossaryById } from '../data/glossary';

const OPEN_DELAY = 850;
const CLOSE_DELAY = 140;

export default function GlossaryTerm({ id, children }) {
  const entry = glossaryById[id];
  const anchorRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 20, top: 20 });

  useEffect(() => () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); }, []);
  if (!entry) return children;

  const place = () => {
    const box = anchorRef.current?.getBoundingClientRect();
    if (!box) return;
    const width = Math.min(440, window.innerWidth - 24);
    const left = Math.max(12, Math.min(box.left + box.width / 2 - width / 2, window.innerWidth - width - 12));
    const roomBelow = window.innerHeight - box.bottom;
    setPosition({ left, top: roomBelow > 330 ? box.bottom + 12 : Math.max(12, box.top - 322), width });
  };
  const scheduleOpen = () => { clearTimeout(closeTimer.current); clearTimeout(openTimer.current); openTimer.current = setTimeout(() => { place(); setOpen(true); }, OPEN_DELAY); };
  const scheduleClose = () => { clearTimeout(openTimer.current); closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY); };
  const openNow = () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); place(); setOpen(true); };

  const tooltip = open && createPortal(<aside className="glossary-popover" style={position} role="tooltip" onMouseEnter={() => clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
    <div className="glossary-popover-head"><span>Словарь · простыми словами</span><button onClick={() => setOpen(false)} aria-label="Закрыть подсказку">×</button></div>
    <h3>{entry.term}</h3>
    <p className="glossary-short">{entry.short}</p>
    <div className="glossary-child"><span>Простыми словами</span><p>{entry.child}</p></div>
    <dl><div><dt>Аналогия</dt><dd>{entry.analogy}</dd></div><div><dt>Пример</dt><dd>{entry.example}</dd></div></dl>
    {entry.notThis && <p className="glossary-warning"><strong>Не перепутать:</strong> {entry.notThis}</p>}
    {entry.definitionLink && <Link to={entry.definitionLink} onClick={() => setOpen(false)}>Открыть полное определение →</Link>}
  </aside>, document.body);

  return <><button ref={anchorRef} type="button" className="glossary-term" aria-expanded={open} onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose} onFocus={openNow} onBlur={scheduleClose} onClick={openNow}>{children}</button>{tooltip}</>;
}
