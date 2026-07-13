import { useState } from 'react';

const mod = (value, n) => ((value % n) + n) % n;

function RingsLab() {
  const [n, setN] = useState(6);
  const [a, setA] = useState(2);
  const products = Array.from({ length: n }, (_, b) => mod(a * b, n));
  const inverse = products.indexOf(1);
  return <div className="concept-lab"><div className="lab-controls"><label>Модуль n <input type="range" min="2" max="12" value={n} onChange={(e) => { setN(+e.target.value); setA(1); }} /></label><label>Элемент a <input type="range" min="1" max={n - 1} value={Math.min(a, n - 1)} onChange={(e) => setA(+e.target.value)} /></label></div><div className="residue-grid">{products.map((p, b) => <span className={p === 1 ? 'hit' : p === 0 ? 'zero' : ''} key={b}>{a}·{b} = <b>{p}</b></span>)}</div><p className="lab-verdict">{inverse >= 0 ? `${a} обратим: обратный элемент ${inverse}.` : `${a} не обратим: единицу получить нельзя.`}</p></div>;
}

function VectorDiagram({ kind }) {
  const initialValues = { forms: 0, decompositions: 1.7, 'geometry-dual': .6 };
  const [value, setValue] = useState(initialValues[kind] ?? 35);
  const angle = value * Math.PI / 180;
  const x = 130 + 82 * Math.cos(angle);
  const y = 130 - 82 * Math.sin(angle);
  const settings = {
    forms: { label: 'Коэффициент смешанного члена', min: -2, max: 2, step: .1, note: value > .4 ? 'Седловая геометрия: есть направления разных знаков.' : value < -.4 ? 'Оси формы повёрнуты в другую сторону.' : 'Смешанный член мал: главные оси почти совпадают с координатными.' },
    operators: { label: 'Угол направления', min: 0, max: 180, step: 1, note: 'Серая стрелка — вход, зелёная — действие матрицы diag(1.5, 0.65).' },
    euclidean: { label: 'Угол вектора', min: 5, max: 175, step: 1, note: 'Пунктир — ортогональный остаток; зелёная стрелка — проекция на горизонтальную прямую.' },
    'orthogonal-operators': { label: 'Угол поворота', min: -180, max: 180, step: 1, note: 'Длина стрелки сохраняется: ортогональный оператор меняет направление, но не масштаб.' },
    decompositions: { label: 'Сингулярное значение σ₁', min: .5, max: 2.5, step: .1, note: 'Окружность после действия Σ превращается в эллипс; полуоси — сингулярные значения.' },
    'geometry-dual': { label: 'Параметр типа', min: -1, max: 1, step: .1, note: value < -.2 ? 'Разные знаки квадратов: гиперболический тип.' : value > .2 ? 'Одинаковые знаки: эллиптический тип.' : 'Один квадрат исчез: параболический тип.' },
  }[kind];
  const transformPoint = kind === 'operators' ? [130 + 123 * Math.cos(angle), 130 - 53 * Math.sin(angle)] : [x, y];
  return <div className="concept-lab visual-lab"><svg viewBox="0 0 260 260" role="img" aria-label="Интерактивная геометрическая схема"><line x1="18" y1="130" x2="242" y2="130"/><line x1="130" y1="18" x2="130" y2="242"/>{kind === 'decompositions' ? <><circle cx="130" cy="130" r="58" className="input-shape"/><ellipse cx="130" cy="130" rx={58 * value} ry="35" className="output-shape"/></> : kind === 'forms' || kind === 'geometry-dual' ? <><path d={value >= 0 ? 'M65 130 C65 70 195 70 195 130 C195 190 65 190 65 130Z' : 'M25 55 C100 90 100 170 25 205 M235 55 C160 90 160 170 235 205'} className="output-shape"/><line x1="45" y1="215" x2="215" y2="45" className="guide"/></> : <><line x1="130" y1="130" x2={x} y2={y} className="input-vector"/><line x1="130" y1="130" x2={transformPoint[0]} y2={kind === 'euclidean' ? 130 : transformPoint[1]} className="output-vector"/>{kind === 'euclidean' && <line x1={transformPoint[0]} y1="130" x2={x} y2={y} className="guide"/>}</>}</svg><div className="lab-side"><label>{settings.label}<strong>{Number(value).toFixed(settings.step < 1 ? 1 : 0)}</strong><input type="range" min={settings.min} max={settings.max} step={settings.step} value={value} onChange={(e) => setValue(+e.target.value)} /></label><p>{settings.note}</p></div></div>;
}

export default function TopicVisualizer({ topicId }) {
  if (topicId === 'rings-fields') return <RingsLab />;
  return <VectorDiagram kind={topicId} />;
}
