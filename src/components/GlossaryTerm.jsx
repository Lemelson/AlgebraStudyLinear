import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { glossaryById } from '../data/glossary';
import GlossaryEntryContent from './GlossaryEntryContent';

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
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  if (!entry) return children;

  const place = () => {
    const box = anchorRef.current?.getBoundingClientRect();
    if (!box) return;
    const width = Math.min(540, window.innerWidth - 24);
    const left = Math.max(12, Math.min(box.left + box.width / 2 - width / 2, window.innerWidth - width - 12));
    const roomBelow = window.innerHeight - box.bottom;
    const estimatedHeight = Math.min(620, window.innerHeight - 24);
    setPosition({ left, top: roomBelow > 380 ? box.bottom + 12 : Math.max(12, box.top - estimatedHeight - 12), width });
  };
  const scheduleOpen = () => { clearTimeout(closeTimer.current); clearTimeout(openTimer.current); openTimer.current = setTimeout(() => { place(); setOpen(true); }, OPEN_DELAY); };
  const scheduleClose = () => { clearTimeout(openTimer.current); closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY); };
  const openNow = () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); place(); setOpen(true); };

  const tooltip = open && createPortal(<aside className="glossary-popover" style={position} role="dialog" aria-label={`Словарь: ${entry.term}`} onMouseEnter={() => clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
    <div className="glossary-popover-head"><span>Словарь · простыми словами</span><button onClick={() => setOpen(false)} aria-label="Закрыть подсказку">×</button></div>
    <h3>{entry.term}</h3>
    <GlossaryEntryContent entry={entry} compact />
    {entry.definitionLink && <Link to={entry.definitionLink} onClick={() => setOpen(false)}>Открыть полное определение →</Link>}
  </aside>, document.body);

  return <><button ref={anchorRef} type="button" className="glossary-term" aria-expanded={open} onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose} onFocus={openNow} onBlur={scheduleClose} onClick={openNow}>{children}</button>{tooltip}</>;
}
