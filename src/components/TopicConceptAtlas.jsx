import { useState } from 'react';

const mod = (value, n) => ((value % n) + n) % n;
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

function Axes({ children, label }) {
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label={label}>
      <line className="atlas-axis" x1="24" y1="120" x2="296" y2="120" />
      <line className="atlas-axis" x1="160" y1="18" x2="160" y2="222" />
      {children}
    </svg>
  );
}

function RingsAtlas() {
  const [n, setN] = useState(6);
  const units = Array.from({ length: n }, (_, value) => value).filter((value) => gcd(value, n) === 1);
  return (
    <div className="mastery-visual atlas-residues">
      <div className="atlas-heading">
        <div><span>Таблица умножения</span><strong>Почему модуль 5 даёт поле, а модуль 6 — нет</strong></div>
        <div className="atlas-toggle" aria-label="Выбор модуля">
          {[5, 6].map((value) => <button type="button" className={n === value ? 'active' : ''} onClick={() => setN(value)} key={value}>Z/{value}Z</button>)}
        </div>
      </div>
      <div className="residue-table" style={{ '--residue-count': n + 1 }}>
        <span className="corner">×</span>
        {Array.from({ length: n }, (_, value) => <b key={`h-${value}`}>{value}</b>)}
        {Array.from({ length: n }, (_, row) => (
          <div className="residue-row" key={row}>
            <b>{row}</b>
            {Array.from({ length: n }, (_, column) => {
              const value = mod(row * column, n);
              return <span className={value === 1 ? 'one' : value === 0 && row && column ? 'zero' : ''} key={column}>{value}</span>;
            })}
          </div>
        ))}
      </div>
      <p><strong>Обратимые ненулевые классы:</strong> {units.map((value) => `[${value}]`).join(', ')}. {n === 5 ? 'У каждого ненулевого класса есть единица в его строке — это поле.' : 'В строках 2, 3 и 4 единицы нет; клетки 2·3 и 3·2 дают ноль — видны делители нуля.'}</p>
    </div>
  );
}

function VectorAtlas() {
  const [intersection, setIntersection] = useState(1);
  const sum = 2 + 2 - intersection;
  const xShift = intersection * 32;
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>Формула Грассмана</span><strong>Общее направление нельзя считать дважды</strong></div><label>dim(U∩W) <b>{intersection}</b><input type="range" min="0" max="2" value={intersection} onChange={(event) => setIntersection(Number(event.target.value))} /></label></div>
      <svg className="atlas-wide-svg" viewBox="0 0 640 250" role="img" aria-label={`Два подпространства размерности 2, пересечение ${intersection}, сумма ${sum}`}>
        <rect className="atlas-region atlas-region-a" x="90" y="52" width="250" height="142" rx="70" />
        <rect className="atlas-region atlas-region-b" x={300 - xShift} y="52" width="250" height="142" rx="70" />
        <text x="120" y="88">U · 2 направления</text>
        <text x={430 - xShift} y="178">W · 2 направления</text>
        <text className="atlas-main-label" x="320" y="128" textAnchor="middle">общих: {intersection}</text>
        <line className="atlas-formula-line" x1="145" y1="222" x2="495" y2="222" />
        <text className="atlas-main-label" x="320" y="244" textAnchor="middle">2 + 2 − {intersection} = {sum}</text>
      </svg>
      <p>{intersection === 0 ? 'Пересечение нулевое: сумма прямая, каждое разложение единственно.' : intersection === 2 ? 'Подпространства совпадают: объединение порождающих не добавляет новых направлений.' : 'Одно общее направление входит в оба базиса, поэтому в размерности суммы его вычитают один раз.'}</p>
    </div>
  );
}

function FormsAtlas() {
  const [a, setA] = useState(0.6);
  const absolute = Math.abs(a);
  const type = absolute < 0.98 ? 'эллипс' : absolute <= 1.02 ? 'две параллельные прямые' : 'гипербола';
  const rotation = a >= 0 ? 45 : -45;
  const major = Math.min(104, 58 / Math.sqrt(Math.max(0.12, 1 - absolute)));
  const minor = 58 / Math.sqrt(1 + absolute);
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>Семейство qₐ=x²+2axy+y²</span><strong>Один параметр меняет инерцию формы</strong></div><label>a <b>{a.toFixed(1)}</b><input type="range" min="-1.5" max="1.5" step="0.1" value={a} onChange={(event) => setA(Number(event.target.value))} /></label></div>
      <Axes label={`Линия уровня квадратичной формы, тип ${type}`}>
        <g transform={`rotate(${rotation} 160 120)`}>
          {absolute < 0.98 && <ellipse className="atlas-curve" cx="160" cy="120" rx={major} ry={minor} />}
          {absolute >= 0.98 && absolute <= 1.02 && <><line className="atlas-curve" x1="72" y1="86" x2="248" y2="86" /><line className="atlas-curve" x1="72" y1="154" x2="248" y2="154" /></>}
          {absolute > 1.02 && <><path className="atlas-curve" d="M76 42 C132 72 132 168 76 198" /><path className="atlas-curve" d="M244 42 C188 72 188 168 244 198" /></>}
          <line className="atlas-principal" x1="48" y1="120" x2="272" y2="120" />
          <line className="atlas-principal" x1="160" y1="28" x2="160" y2="212" />
        </g>
      </Axes>
      <div className="atlas-facts"><span>λ₁=1+a = {(1 + a).toFixed(1)}</span><span>λ₂=1−a = {(1 - a).toFixed(1)}</span><strong>{type}</strong></div>
      <p>{absolute < 0.98 ? 'Оба собственных значения положительны: форма положительно определена.' : absolute <= 1.02 ? 'Одно собственное значение равно нулю: ранг падает до 1.' : 'Собственные значения разных знаков: есть положительные и отрицательные направления.'}</p>
    </div>
  );
}

function OperatorsAtlas() {
  const [angle, setAngle] = useState(32);
  const radians = angle * Math.PI / 180;
  const input = [88 * Math.cos(radians), 88 * Math.sin(radians)];
  const output = [2 * input[0], 0.5 * input[1]];
  const outputLength = Math.hypot(...output);
  const scale = Math.min(1, 118 / outputLength);
  const cross = Math.abs(input[0] * output[1] - input[1] * output[0]);
  const aligned = cross < 10;
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>A=diag(2, 1/2)</span><strong>Собственное направление не поворачивается</strong></div><label>угол x <b>{angle}°</b><input type="range" min="0" max="180" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label></div>
      <Axes label="Вектор и его образ диагональным оператором">
        <line className="atlas-input-vector" x1="160" y1="120" x2={160 + input[0]} y2={120 - input[1]} />
        <circle className="atlas-input-dot" cx={160 + input[0]} cy={120 - input[1]} r="5" />
        <line className="atlas-output-vector" x1="160" y1="120" x2={160 + output[0] * scale} y2={120 - output[1] * scale} />
        <circle className="atlas-output-dot" cx={160 + output[0] * scale} cy={120 - output[1] * scale} r="5" />
        <text x="254" y="106">λ=2</text><text x="168" y="30">λ=1/2</text>
      </Axes>
      <div className="atlas-legend"><span><i className="input" />x</span><span><i className="output" />Ax</span><strong>{aligned ? 'собственное направление' : 'направление изменилось'}</strong></div>
      <p>Поставьте угол 0° или 180°: горизонтальная ось сохраняется и только растягивается в 2 раза. При 90° сохраняется вертикальная ось и масштаб равен 1/2.</p>
    </div>
  );
}

function EuclideanAtlas() {
  const [angle, setAngle] = useState(22);
  const radians = angle * Math.PI / 180;
  const u = [Math.cos(radians), Math.sin(radians)];
  const x = [84, 68];
  const coefficient = x[0] * u[0] + x[1] * u[1];
  const projection = [coefficient * u[0], coefficient * u[1]];
  const residual = [x[0] - projection[0], x[1] - projection[1]];
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>Ортогональная проекция</span><strong>Ближайшая точка и перпендикулярный остаток</strong></div><label>угол H <b>{angle}°</b><input type="range" min="-70" max="70" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label></div>
      <Axes label="Разложение вектора на проекцию и ортогональный остаток">
        <line className="atlas-subspace" x1={160 - 145 * u[0]} y1={120 + 145 * u[1]} x2={160 + 145 * u[0]} y2={120 - 145 * u[1]} />
        <line className="atlas-output-vector" x1="160" y1="120" x2={160 + projection[0]} y2={120 - projection[1]} />
        <line className="atlas-residual" x1={160 + projection[0]} y1={120 - projection[1]} x2={160 + x[0]} y2={120 - x[1]} />
        <line className="atlas-input-vector" x1="160" y1="120" x2={160 + x[0]} y2={120 - x[1]} />
        <circle className="atlas-input-dot" cx={160 + x[0]} cy={120 - x[1]} r="5" />
      </Axes>
      <div className="atlas-facts"><span>||x||² = {Math.round(x[0] ** 2 + x[1] ** 2)}</span><span>||proj x||² = {Math.round(projection[0] ** 2 + projection[1] ** 2)}</span><span>||r||² = {Math.round(residual[0] ** 2 + residual[1] ** 2)}</span></div>
      <p>Зелёная часть лежит в H, пунктирный остаток перпендикулярен H. Их квадраты длин складываются в квадрат длины исходного вектора.</p>
    </div>
  );
}

function OrthogonalAtlas() {
  const [mode, setMode] = useState('rotation');
  const points = Array.from({ length: 16 }, (_, index) => {
    const angle = 2 * Math.PI * index / 16;
    const input = [Math.cos(angle), Math.sin(angle)];
    if (mode === 'rotation') {
      const turn = Math.PI / 5;
      return [Math.cos(turn) * input[0] - Math.sin(turn) * input[1], Math.sin(turn) * input[0] + Math.cos(turn) * input[1]];
    }
    return [1.55 * input[0], 0.65 * input[1]];
  });
  const path = `${points.map(([x, y], index) => `${index ? 'L' : 'M'} ${160 + 68 * x} ${120 - 68 * y}`).join(' ')} Z`;
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>Тест единичной окружности</span><strong>Ортогональный оператор сохраняет все длины</strong></div><div className="atlas-toggle"><button type="button" className={mode === 'rotation' ? 'active' : ''} onClick={() => setMode('rotation')}>Поворот</button><button type="button" className={mode === 'stretch' ? 'active' : ''} onClick={() => setMode('stretch')}>Растяжение</button></div></div>
      <Axes label="Единичная окружность и её образ оператором">
        <circle className="atlas-reference-circle" cx="160" cy="120" r="68" />
        <path className="atlas-curve" d={path} />
        {points.map(([x, y], index) => <circle className="atlas-sample-dot" cx={160 + 68 * x} cy={120 - 68 * y} r="3" key={index} />)}
      </Axes>
      <p>{mode === 'rotation' ? 'Образ совпадает с единичной окружностью: QᵀQ=E, длина каждого вектора сохранена.' : 'Круг стал эллипсом: определитель может даже равняться 1, но длины не сохраняются. Значит, одного det A=±1 недостаточно.'}</p>
    </div>
  );
}

function DecompositionsAtlas() {
  const [sigma, setSigma] = useState(1.8);
  const angle = 28;
  const input = [44, 24];
  const rotate = ([x, y], degrees) => {
    const radians = degrees * Math.PI / 180;
    return [x * Math.cos(radians) - y * Math.sin(radians), x * Math.sin(radians) + y * Math.cos(radians)];
  };
  const afterV = rotate(input, -angle);
  const afterSigma = [sigma * afterV[0], 0.65 * afterV[1]];
  const afterU = rotate(afterSigma, 42);
  const stages = [
    { label: 'x', vector: input, note: 'вход' },
    { label: 'Vᵀx', vector: afterV, note: 'выбор осей' },
    { label: 'ΣVᵀx', vector: afterSigma, note: 'растяжение' },
    { label: 'UΣVᵀx', vector: afterU, note: 'выход' },
  ];
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>SVD по кадрам</span><strong>Поворот → растяжение → поворот</strong></div><label>σ₁ <b>{sigma.toFixed(1)}</b><input type="range" min="0.6" max="2.4" step="0.1" value={sigma} onChange={(event) => setSigma(Number(event.target.value))} /></label></div>
      <div className="svd-stages">
        {stages.map((stage, index) => {
          const length = Math.hypot(...stage.vector);
          const scale = Math.min(1, 54 / length);
          return <div key={stage.label}><svg viewBox="0 0 130 130" role="img" aria-label={`${stage.note}: ${stage.label}`}><line className="atlas-axis" x1="12" y1="65" x2="118" y2="65"/><line className="atlas-axis" x1="65" y1="12" x2="65" y2="118"/><line className="atlas-output-vector" x1="65" y1="65" x2={65 + stage.vector[0] * scale} y2={65 - stage.vector[1] * scale}/><circle className="atlas-output-dot" cx={65 + stage.vector[0] * scale} cy={65 - stage.vector[1] * scale} r="4"/></svg><strong>{stage.label}</strong><span>{stage.note}</span>{index < stages.length - 1 && <i>→</i>}</div>;
        })}
      </div>
      <p>Vᵀ меняет входной ортонормированный базис, Σ независимо масштабирует оси сингулярными значениями, U размещает результат в выходном пространстве.</p>
    </div>
  );
}

function GeometryAtlas() {
  const [mode, setMode] = useState('conics');
  const [conic, setConic] = useState('ellipse');
  const conicPath = {
    ellipse: <ellipse className="atlas-curve" cx="160" cy="120" rx="92" ry="55" />,
    parabola: <path className="atlas-curve" d="M78 28 Q 232 120 78 212" />,
    hyperbola: <><path className="atlas-curve" d="M42 40 C112 70 112 170 42 200"/><path className="atlas-curve" d="M278 40 C208 70 208 170 278 200"/></>,
  };
  const equations = { ellipse: 'x²/a² + y²/b² = 1', parabola: 'y² = 2px', hyperbola: 'x²/a² − y²/b² = 1' };
  return (
    <div className="mastery-visual">
      <div className="atlas-heading"><div><span>Две половины темы</span><strong>Коника — множество точек; ковектор — семейство уровней</strong></div><div className="atlas-toggle"><button type="button" className={mode === 'conics' ? 'active' : ''} onClick={() => setMode('conics')}>Коники</button><button type="button" className={mode === 'covectors' ? 'active' : ''} onClick={() => setMode('covectors')}>Ковектор</button></div></div>
      {mode === 'conics' ? <>
        <div className="atlas-choice-row">{['ellipse', 'parabola', 'hyperbola'].map((value) => <button type="button" className={conic === value ? 'active' : ''} onClick={() => setConic(value)} key={value}>{value === 'ellipse' ? 'Эллипс' : value === 'parabola' ? 'Парабола' : 'Гипербола'}</button>)}</div>
        <Axes label={`Каноническая коника: ${conic}`}>{conicPath[conic]}</Axes>
        <div className="atlas-equation">{equations[conic]}</div>
      </> : <>
        <Axes label="Линии уровня линейного функционала и нормальный ковектор">
          {[-60, -30, 0, 30, 60].map((shift) => <line className="atlas-level-line" x1={66 + shift} y1="210" x2={206 + shift} y2="30" key={shift} />)}
          <line className="atlas-output-vector" x1="160" y1="120" x2="224" y2="170" />
          <circle className="atlas-output-dot" cx="224" cy="170" r="5" />
          <text x="228" y="184">f=(a,b)</text>
        </Axes>
        <div className="atlas-equation">f(x,y)=ax+by=c</div>
        <p>Каждое значение c даёт параллельную линию уровня. Ковектор (a,b) показывает, в каком направлении значение f растёт быстрее всего, и перпендикулярен всем уровням.</p>
      </>}
    </div>
  );
}

export default function TopicConceptAtlas({ topicId }) {
  if (topicId === 'rings-fields') return <RingsAtlas />;
  if (topicId === 'vector-spaces') return <VectorAtlas />;
  if (topicId === 'forms') return <FormsAtlas />;
  if (topicId === 'operators') return <OperatorsAtlas />;
  if (topicId === 'euclidean') return <EuclideanAtlas />;
  if (topicId === 'orthogonal-operators') return <OrthogonalAtlas />;
  if (topicId === 'decompositions') return <DecompositionsAtlas />;
  return <GeometryAtlas />;
}
