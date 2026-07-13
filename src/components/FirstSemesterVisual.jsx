import { useState } from 'react';
import { getFirstSemesterVisual } from '../data/firstSemesterVisuals';

const colors = ['#789372', '#a36f54', '#667b92'];

function SvgFrame({ config, children }) {
  return (
    <svg className="first-semester-svg" viewBox="0 0 680 300" role="img" aria-label={config.ariaLabel}>
      <title>{config.title}</title>
      <desc>{config.caption}</desc>
      {children}
    </svg>
  );
}

function Matrix({ values, x, y, activeRow = -1, activeColumn = -1, activeCell = null, cellSize = 42 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="fsv-bracket" d={`M8 0H0v${values.length * cellSize}h8 M${values[0].length * cellSize - 8} 0h8v${values.length * cellSize}h-8`} />
      {values.flatMap((row, rowIndex) => row.map((value, columnIndex) => {
        const highlighted = rowIndex === activeRow || columnIndex === activeColumn
          || (activeCell && activeCell[0] === rowIndex && activeCell[1] === columnIndex);
        return (
          <g key={`${rowIndex}-${columnIndex}`} transform={`translate(${columnIndex * cellSize} ${rowIndex * cellSize})`}>
            {highlighted && <rect className="fsv-cell-highlight" x="5" y="4" width={cellSize - 10} height={cellSize - 8} rx="3" />}
            <text className="fsv-math" x={cellSize / 2} y={cellSize / 2 + 6} textAnchor="middle">{value}</text>
          </g>
        );
      }))}
    </g>
  );
}

function MatrixProduct({ config, mode }) {
  const a = [[1, 2], [3, 1]];
  const b = [[2, 0], [1, 3]];
  const c = [[4, 6], [7, 3]];
  return <SvgFrame config={config}>
    <text className="fsv-label" x="42" y="54">A</text><Matrix values={a} x={68} y={70} activeRow={mode.cell[0]} />
    <text className="fsv-operator" x="180" y="122">×</text>
    <text className="fsv-label" x="221" y="54">B</text><Matrix values={b} x={247} y={70} activeColumn={mode.cell[1]} />
    <text className="fsv-operator" x="360" y="122">=</text>
    <text className="fsv-label" x="401" y="54">C</text><Matrix values={c} x={427} y={70} activeCell={mode.cell} />
    <path className="fsv-guide" d="M88 174C170 246 290 246 313 174" />
    <rect className="fsv-formula-box" x="151" y="222" width="378" height="48" rx="3" />
    <text className="fsv-formula" x="340" y="252" textAnchor="middle">{mode.work}</text>
  </SvgFrame>;
}

function Gauss({ config, mode }) {
  return <SvgFrame config={config}>
    <path className="fsv-stair" d="M52 58H204V118H356V178H508" />
    <Matrix values={mode.rows} x={218} y={92} activeCell={mode.label === 'Исходная' ? [0, 0] : [1, 1]} cellSize={56} />
    <line className="fsv-divider" x1="324" y1="92" x2="324" y2="204" />
    <text className="fsv-step-tag" x="340" y="248" textAnchor="middle">{mode.label}</text>
    <circle className="fsv-pivot" cx="246" cy="120" r="22" />
    {mode.label !== 'Исходная' && <circle className="fsv-pivot second" cx="302" cy="176" r="22" />}
  </SvgFrame>;
}

function Permutation({ config, mode }) {
  const xs = [180, 340, 500];
  return <SvgFrame config={config}>
    {xs.map((x, index) => <g key={x}><circle className="fsv-node" cx={x} cy="58" r="22" /><text className="fsv-node-text" x={x} y="64" textAnchor="middle">{index + 1}</text></g>)}
    {mode.order.map((target, index) => <path key={`${index}-${target}`} className={`fsv-wire wire-${index}`} d={`M${xs[index]} 80 C${xs[index]} 138 ${xs[target - 1]} 162 ${xs[target - 1]} 220`} />)}
    {mode.order.map((target) => <g key={target}><circle className="fsv-node bottom" cx={xs[target - 1]} cy="242" r="22" /><text className="fsv-node-text" x={xs[target - 1]} y="248" textAnchor="middle">{target}</text></g>)}
    <text className="fsv-metric" x="44" y="132">инверсий</text><text className="fsv-big" x="62" y="181">{mode.inversions}</text>
    <text className="fsv-metric" x="574" y="132">sign σ</text><text className="fsv-big" x="592" y="181">{mode.sign}</text>
  </SvgFrame>;
}

function DeterminantOps({ config, mode }) {
  return <SvgFrame config={config}>
    <g transform="translate(56 72)"><rect className="fsv-det-card" width="166" height="140" rx="3" /><text className="fsv-label" x="83" y="36" textAnchor="middle">до операции</text><text className="fsv-det" x="83" y="100" textAnchor="middle">det A = {mode.before}</text></g>
    <path className="fsv-arrow" d="M245 142H427" markerEnd="url(#fsv-arrow-head)" />
    <defs><marker id="fsv-arrow-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker></defs>
    <rect className="fsv-operation" x="274" y="104" width="124" height="38" rx="19" /><text className="fsv-step-tag" x="336" y="129" textAnchor="middle">{mode.label}</text>
    <text className="fsv-result-note" x="336" y="175" textAnchor="middle">{mode.mark}</text>
    <g transform="translate(458 72)"><rect className="fsv-det-card after" width="166" height="140" rx="3" /><text className="fsv-label" x="83" y="36" textAnchor="middle">после операции</text><text className="fsv-det" x="83" y="100" textAnchor="middle">det = {mode.after}</text></g>
  </SvgFrame>;
}

function Cofactor({ config, mode }) {
  const matrix = mode.matrix;
  return <SvgFrame config={config}>
    <Matrix values={matrix} x={76} y={74} activeRow={mode.focus === 'minor' ? 0 : -1} activeCell={[0, 0]} cellSize={52} />
    {mode.focus === 'minor' && <><line className="fsv-strike" x1="68" y1="100" x2="232" y2="100" /><line className="fsv-strike" x1="102" y1="66" x2="102" y2="238" /></>}
    <path className="fsv-arrow" d="M260 150H342" markerEnd="url(#fsv-cofactor-head)" /><defs><marker id="fsv-cofactor-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker></defs>
    <g transform="translate(376 81)"><rect className="fsv-formula-box" width="242" height="132" rx="3" /><text className="fsv-label" x="121" y="34" textAnchor="middle">разложение по строке 1</text><text className="fsv-formula" x="121" y="78" textAnchor="middle">2 · (+1) · det</text><text className="fsv-formula" x="121" y="108" textAnchor="middle">[ 3  4 ; 5  6 ]</text></g>
    {mode.focus === 'result' && <text className="fsv-big" x="340" y="268" textAnchor="middle">−4</text>}
  </SvgFrame>;
}

function Rank({ config, mode }) {
  const size = mode.size;
  return <SvgFrame config={config}>
    <Matrix values={config.matrix} x={76} y={72} cellSize={54} />
    <rect className={`fsv-rank-frame size-${size}`} x="81" y="77" width={size * 54 - 10} height={size * 54 - 10} rx="3" />
    <path className="fsv-arrow" d="M275 151H374" markerEnd="url(#fsv-rank-head)" /><defs><marker id="fsv-rank-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker></defs>
    <g transform="translate(411 70)"><text className="fsv-label" x="90" y="30" textAnchor="middle">минор {size}×{size}</text><circle className={`fsv-rank-value ${mode.value === 0 ? 'zero' : ''}`} cx="90" cy="104" r="58" /><text className="fsv-det" x="90" y="114" textAnchor="middle">{mode.value}</text><text className="fsv-result-note" x="90" y="193" textAnchor="middle">{mode.value === 0 ? 'не поднимает ранг' : `rank ≥ ${size}`}</text></g>
  </SvgFrame>;
}

function Dependence({ config, mode }) {
  const origin = [248, 228];
  return <SvgFrame config={config}>
    <line className="fsv-axis" x1="46" y1={origin[1]} x2="484" y2={origin[1]} /><line className="fsv-axis" x1={origin[0]} y1="30" x2={origin[0]} y2="266" />
    <path className="fsv-span-plane" d="M128 248L338 80L442 142L232 282Z" />
    {mode.vectors.map(([dx, dy], index) => <g key={`${dx}-${dy}`}><line className={`fsv-vector vector-${index}`} x1={origin[0]} y1={origin[1]} x2={origin[0] + dx} y2={origin[1] + dy} markerEnd={`url(#fsv-vector-${index})`} /><defs><marker id={`fsv-vector-${index}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs><text className="fsv-vector-label" x={origin[0] + dx + 9} y={origin[1] + dy - 8}>v{index + 1}</text></g>)}
    <g transform="translate(500 74)"><text className="fsv-label" x="70" y="0" textAnchor="middle">размерность оболочки</text><text className="fsv-big" x="70" y="72" textAnchor="middle">2</text>{mode.equation && <text className="fsv-result-note" x="70" y="128" textAnchor="middle">{mode.equation}</text>}</g>
  </SvgFrame>;
}

function Compatibility({ config, mode }) {
  const secondPath = mode.state === 'point' ? 'M110 242L450 56' : mode.state === 'parallel' ? 'M102 252L444 82' : 'M90 250L454 68';
  return <SvgFrame config={config}>
    <line className="fsv-axis" x1="62" y1="250" x2="480" y2="250" /><line className="fsv-axis" x1="92" y1="28" x2="92" y2="272" />
    <path className="fsv-equation-line one" d="M90 250L454 68" />
    <path className={`fsv-equation-line two ${mode.state}`} d={secondPath} />
    {mode.state === 'point' && <circle className="fsv-intersection" cx="280" cy="154" r="7" />}
    <g transform="translate(492 84)"><text className="fsv-label" x="78" y="0" textAnchor="middle">критерий</text><text className="fsv-ranks" x="78" y="48" textAnchor="middle">{mode.ranks}</text><text className={`fsv-status ${mode.state}`} x="78" y="112" textAnchor="middle">{mode.state === 'parallel' ? '∅' : mode.state === 'point' ? '1 точка' : '∞'}</text></g>
  </SvgFrame>;
}

function SolutionSpace({ config, mode }) {
  const origin = [292, 220];
  return <SvgFrame config={config}>
    <path className="fsv-solution-plane" d="M78 214L360 52L570 126L286 288Z" />
    <line className="fsv-vector vector-0" x1={origin[0]} y1={origin[1]} x2={origin[0] + 62} y2={origin[1] - 24} /><line className="fsv-vector vector-1" x1={origin[0]} y1={origin[1]} x2={origin[0] + 18} y2={origin[1] - 68} />
    <text className="fsv-vector-label" x="365" y="191">u</text><text className="fsv-vector-label" x="318" y="142">v</text>
    <line className="fsv-vector vector-2" x1={origin[0]} y1={origin[1]} x2={origin[0] + mode.point[0]} y2={origin[1] + mode.point[1]} markerEnd="url(#fsv-solution-head)" /><defs><marker id="fsv-solution-head" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs>
    <rect className="fsv-formula-box" x="64" y="54" width="192" height="54" rx="3" /><text className="fsv-formula" x="160" y="87" textAnchor="middle">x = {mode.coefficients[0]}u + {mode.coefficients[1]}v</text>
  </SvgFrame>;
}

function ComplexDivision({ config, mode }) {
  const toPoint = ([x, y]) => [290 + x * 62, 154 - y * 62];
  const [px, py] = toPoint(mode.point);
  return <SvgFrame config={config}>
    <line className="fsv-axis" x1="54" y1="154" x2="486" y2="154" /><line className="fsv-axis" x1="290" y1="28" x2="290" y2="278" /><text className="fsv-axis-label" x="472" y="143">Re</text><text className="fsv-axis-label" x="302" y="42">Im</text>
    <line className="fsv-complex-vector" x1="290" y1="154" x2={px} y2={py} /><circle className="fsv-complex-point" cx={px} cy={py} r="7" /><text className="fsv-vector-label" x={px + 10} y={py - 10}>z</text>
    {mode.mirror && <><line className="fsv-mirror-guide" x1={px} y1={py} x2={px} y2={154 + (154 - py)} /><circle className="fsv-complex-point mirror" cx={px} cy={154 + (154 - py)} r="7" /><text className="fsv-vector-label" x={px + 10} y={174 + (154 - py)}>z̄</text></>}
    <rect className="fsv-formula-box" x="493" y="96" width="158" height="116" rx="3" /><text className="fsv-formula compact" x="572" y="151" textAnchor="middle">{mode.formula}</text>
  </SvgFrame>;
}

function ComplexRoots({ config, mode }) {
  const center = [320, 150];
  const points = [0, 120, 240].map((degrees) => {
    const radians = degrees * Math.PI / 180;
    return [center[0] + Math.cos(radians) * 105, center[1] - Math.sin(radians) * 105];
  });
  return <SvgFrame config={config}>
    <circle className="fsv-unit-circle" cx={center[0]} cy={center[1]} r="105" /><line className="fsv-axis" x1="160" y1="150" x2="484" y2="150" /><line className="fsv-axis" x1="320" y1="24" x2="320" y2="276" /><path className="fsv-root-polygon" d={`M${points.map((point) => point.join(' ')).join('L')}Z`} />
    {points.map(([x, y], index) => <g key={index}><circle className={`fsv-root ${index === mode.active ? 'active' : ''}`} cx={x} cy={y} r={index === mode.active ? 10 : 6} /><text className="fsv-root-label" x={x + 12} y={y - 10}>z{index}</text></g>)}
    <text className="fsv-angle" x="553" y="116">φ = {mode.angle}</text><text className="fsv-angle" x="553" y="151">z³ = 1</text>
  </SvgFrame>;
}

function Gram({ config, mode }) {
  const radians = mode.angle * Math.PI / 180;
  const end = [224 + Math.cos(radians) * 130, 206 - Math.sin(radians) * 130];
  return <SvgFrame config={config}>
    <line className="fsv-vector vector-0" x1="224" y1="206" x2="374" y2="206" markerEnd="url(#fsv-gram-u)" /><defs><marker id="fsv-gram-u" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs>
    <line className="fsv-vector vector-1" x1="224" y1="206" x2={end[0]} y2={end[1]} markerEnd="url(#fsv-gram-v)" /><defs><marker id="fsv-gram-v" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs>
    <path className="fsv-angle-arc" d={`M276 206 A52 52 0 0 ${mode.angle > 180 ? 1 : 0} ${224 + Math.cos(radians) * 52} ${206 - Math.sin(radians) * 52}`} /><text className="fsv-vector-label" x="384" y="210">u</text><text className="fsv-vector-label" x={end[0] + 10} y={end[1]}>v</text><text className="fsv-angle" x="244" y="180">{mode.angle}°</text>
    <g transform="translate(440 70)"><text className="fsv-label" x="86" y="0" textAnchor="middle">G(u,v)</text><Matrix values={mode.gram} x={10} y={22} cellSize={76} /><text className="fsv-result-note" x="86" y="202" textAnchor="middle">{mode.dot}</text></g>
  </SvgFrame>;
}

function CrossProduct({ config, mode }) {
  const normalEnd = mode.orientation === 1 ? [330, 55] : [330, 248];
  return <SvgFrame config={config}>
    <path className="fsv-cross-plane" d="M92 214L314 88L570 140L346 268Z" /><line className="fsv-vector vector-0" x1="330" y1="164" x2="465" y2="184" /><line className="fsv-vector vector-1" x1="330" y1="164" x2="224" y2="116" />
    <line className="fsv-normal" x1="330" y1="164" x2={normalEnd[0]} y2={normalEnd[1]} markerEnd="url(#fsv-normal-head)" /><defs><marker id="fsv-normal-head" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs>
    <text className="fsv-vector-label" x="475" y="195">a</text><text className="fsv-vector-label" x="205" y="109">b</text><text className="fsv-vector-label" x="344" y={mode.orientation === 1 ? 64 : 250}>{mode.label}</text>
    <rect className="fsv-formula-box" x="42" y="44" width="168" height="48" rx="3" /><text className="fsv-formula compact" x="126" y="74" textAnchor="middle">{mode.formula}</text>
  </SvgFrame>;
}

function PlaneLine({ config, mode }) {
  const line = mode.state === 'crosses' ? [210, 42, 424, 254] : mode.state === 'parallel' ? [164, 64, 486, 118] : [142, 194, 492, 126];
  return <SvgFrame config={config}>
    <path className="fsv-geometry-plane" d="M92 205L292 90L578 142L376 258Z" />
    <line className={`fsv-geometry-line ${mode.state}`} x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} />
    <line className="fsv-normal" x1="338" y1="174" x2="338" y2="56" markerEnd="url(#fsv-plane-normal)" /><defs><marker id="fsv-plane-normal" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs><text className="fsv-vector-label" x="351" y="70">n</text><text className="fsv-vector-label" x="552" y="163">π</text>
    <rect className="fsv-formula-box" x="42" y="48" width="196" height="48" rx="3" /><text className="fsv-formula compact" x="140" y="78" textAnchor="middle">{mode.condition}</text>
  </SvgFrame>;
}

function Mapping({ config, mode }) {
  const leftY = [75, 150, 225];
  const rightY = Array.from({ length: mode.rightCount }, (_, index) => 64 + index * (172 / Math.max(mode.rightCount - 1, 1)));
  return <SvgFrame config={config}>
    <rect className="fsv-set" x="90" y="32" width="170" height="236" rx="85" /><rect className="fsv-set" x="420" y="32" width="170" height="236" rx="85" />
    <text className="fsv-label" x="175" y="20" textAnchor="middle">X</text><text className="fsv-label" x="505" y="20" textAnchor="middle">Y</text>
    {leftY.map((y, index) => <g key={`left-${y}`}><circle className="fsv-map-node" cx="178" cy={y} r="11" /><text className="fsv-node-text small" x="178" y={y + 4} textAnchor="middle">{index + 1}</text><path className={`fsv-map-arrow wire-${index}`} d={`M190 ${y} C300 ${y} 330 ${rightY[mode.arrows[index]]} 408 ${rightY[mode.arrows[index]]}`} markerEnd={`url(#fsv-map-${index})`} /><defs><marker id={`fsv-map-${index}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker></defs></g>)}
    {rightY.map((y, index) => <g key={`right-${y}`}><circle className={`fsv-map-node ${mode.arrows.includes(index) ? 'reached' : 'empty'}`} cx="505" cy={y} r="11" /><text className="fsv-node-text small" x="505" y={y + 4} textAnchor="middle">{String.fromCharCode(97 + index)}</text></g>)}
  </SvgFrame>;
}

const renderers = {
  'matrix-product': MatrixProduct,
  gauss: Gauss,
  permutation: Permutation,
  'determinant-ops': DeterminantOps,
  cofactor: Cofactor,
  rank: Rank,
  dependence: Dependence,
  compatibility: Compatibility,
  'solution-space': SolutionSpace,
  'complex-division': ComplexDivision,
  'complex-roots': ComplexRoots,
  gram: Gram,
  'cross-product': CrossProduct,
  'plane-line': PlaneLine,
  mapping: Mapping,
};

export default function FirstSemesterVisual({ lectureNumber }) {
  const config = getFirstSemesterVisual(lectureNumber);
  const [selectedMode, setSelectedMode] = useState(0);

  if (!config) return null;

  const modeIndex = selectedMode % config.modes.length;
  const mode = config.modes[modeIndex];
  const Renderer = renderers[config.kind];

  return (
    <section className="first-semester-visual" aria-labelledby={`first-semester-visual-${lectureNumber}`}>
      <style>{visualStyles}</style>
      <header className="fsv-header">
        <div>
          <span>Визуальная пауза · лекция {lectureNumber}</span>
          <h2 id={`first-semester-visual-${lectureNumber}`}>{config.title}</h2>
          <p>{config.caption}</p>
        </div>
        <div className="fsv-mode-switcher" role="group" aria-label="Выберите состояние схемы">
          {config.modes.map((item, index) => (
            <button
              type="button"
              className={index === modeIndex ? 'active' : ''}
              aria-pressed={index === modeIndex}
              onClick={() => setSelectedMode(index)}
              key={item.label}
            >
              <small>{String(index + 1).padStart(2, '0')}</small>{item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="fsv-stage">
        <Renderer config={config} mode={mode} />
      </div>

      <div className="fsv-reading" aria-live="polite">
        <div><span>Сейчас видно</span><p>{mode.note}</p></div>
        <div><span>Что унести с собой</span><p>{config.takeaway}</p></div>
      </div>
    </section>
  );
}

const visualStyles = `
  .first-semester-visual { margin: 48px 0 58px; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line); background: #fbfbfa; }
  .fsv-header { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, .72fr); gap: 42px; padding: 30px 30px 26px; }
  .fsv-header > div:first-child > span, .fsv-reading span { color: var(--muted); font: 10px/1.2 "SF Mono", Menlo, monospace; letter-spacing: .07em; text-transform: uppercase; }
  .fsv-header h2 { margin: 9px 0 8px; font: 34px/1.08 var(--serif); font-weight: 400; letter-spacing: -.025em; }
  .fsv-header p { max-width: 620px; margin: 0; color: var(--muted); line-height: 1.55; }
  .fsv-mode-switcher { align-self: end; display: grid; grid-template-columns: repeat(auto-fit, minmax(82px, 1fr)); border: 1px solid var(--line); background: #fff; }
  .fsv-mode-switcher button { min-height: 56px; padding: 8px 10px; border: 0; border-right: 1px solid var(--line); background: transparent; color: #5e5d58; cursor: pointer; text-align: left; transition: background .2s ease, color .2s ease, transform .15s ease; }
  .fsv-mode-switcher button:last-child { border-right: 0; }
  .fsv-mode-switcher button:hover { background: var(--bone); color: var(--ink); }
  .fsv-mode-switcher button:active { transform: scale(.98); }
  .fsv-mode-switcher button:focus-visible { position: relative; z-index: 1; outline: 2px solid var(--ink); outline-offset: -2px; }
  .fsv-mode-switcher button.active { background: var(--sage); color: #354631; }
  .fsv-mode-switcher small { display: block; margin-bottom: 4px; color: #92918c; font: 9px "SF Mono", Menlo, monospace; }
  .fsv-stage { min-height: 300px; padding: 4px 26px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background-color: #fff; background-image: linear-gradient(#efeee9 1px, transparent 1px), linear-gradient(90deg, #efeee9 1px, transparent 1px); background-size: 24px 24px; overflow: hidden; }
  .first-semester-svg { display: block; width: min(100%, 820px); height: auto; max-height: 360px; margin: 0 auto; overflow: visible; }
  .fsv-reading { display: grid; grid-template-columns: .8fr 1.2fr; gap: 1px; background: var(--line); }
  .fsv-reading > div { padding: 21px 28px 24px; background: #fbfbfa; }
  .fsv-reading > div:last-child { background: var(--sage); }
  .fsv-reading p { margin: 8px 0 0; color: #4f4e49; font-size: 14px; line-height: 1.58; }
  .fsv-reading > div:last-child p { color: #455541; }
  .fsv-label, .fsv-metric, .fsv-axis-label { fill: #77766f; font: 11px "SF Mono", Menlo, monospace; letter-spacing: .04em; text-transform: uppercase; }
  .fsv-math, .fsv-formula, .fsv-det, .fsv-angle, .fsv-ranks { fill: #22221f; font: 20px var(--serif); }
  .fsv-formula.compact, .fsv-ranks { font-size: 16px; }
  .fsv-operator { fill: #8b8a84; font: 28px var(--serif); }
  .fsv-bracket, .fsv-guide, .fsv-divider, .fsv-stair, .fsv-axis, .fsv-angle-arc { fill: none; stroke: #8d8c86; stroke-width: 1.5; }
  .fsv-cell-highlight { fill: #dce8d8; }
  .fsv-guide { stroke: #789372; stroke-dasharray: 5 6; }
  .fsv-formula-box { fill: #f7f6f3; stroke: #d8d7d2; }
  .fsv-pivot { fill: none; stroke: #789372; stroke-width: 2; }
  .fsv-pivot.second { stroke: #a36f54; }
  .fsv-step-tag { fill: #42543e; font: 13px "SF Mono", Menlo, monospace; }
  .fsv-node { fill: #fff; stroke: #789372; stroke-width: 1.5; }
  .fsv-node.bottom { fill: #e7eee4; }
  .fsv-node-text { fill: #33332f; font: 14px "SF Mono", Menlo, monospace; }
  .fsv-node-text.small { font-size: 10px; }
  .fsv-wire, .fsv-map-arrow { fill: none; stroke-width: 2; opacity: .82; }
  .wire-0 { stroke: ${colors[0]}; }.wire-1 { stroke: ${colors[1]}; }.wire-2 { stroke: ${colors[2]}; }
  .fsv-big { fill: #2f382c; font: 44px var(--serif); }
  .fsv-det-card { fill: #fff; stroke: #d8d7d2; }.fsv-det-card.after { fill: #e7eee4; stroke: #b8c9b3; }
  .fsv-arrow { fill: none; stroke: #789372; stroke-width: 1.7; }.fsv-arrow + defs path, .first-semester-visual marker path { fill: #789372; }
  .fsv-operation { fill: #fff; stroke: #9caf96; }
  .fsv-result-note { fill: #63705f; font: 13px "SF Mono", Menlo, monospace; }
  .fsv-strike { stroke: #a36f54; stroke-width: 3; opacity: .8; }
  .fsv-rank-frame { fill: rgba(231,238,228,.3); stroke: #789372; stroke-width: 2.5; }
  .fsv-rank-value { fill: #e7eee4; stroke: #9caf96; }.fsv-rank-value.zero { fill: #f7efcf; stroke: #d1bd6e; }
  .fsv-span-plane, .fsv-solution-plane { fill: rgba(231,238,228,.68); stroke: #a9bca5; }
  .fsv-vector { stroke-width: 3; }.fsv-vector.vector-0 { stroke: ${colors[0]}; }.fsv-vector.vector-1 { stroke: ${colors[1]}; }.fsv-vector.vector-2 { stroke: ${colors[2]}; }
  .fsv-vector-label, .fsv-root-label { fill: #4a4a46; font: italic 15px var(--serif); }
  .fsv-equation-line { fill: none; stroke-width: 3; }.fsv-equation-line.one { stroke: ${colors[0]}; }.fsv-equation-line.two { stroke: ${colors[1]}; }.fsv-equation-line.two.same { stroke-dasharray: 8 5; }
  .fsv-intersection { fill: #2f382c; stroke: #fff; stroke-width: 3; }
  .fsv-status { fill: #41503d; font: 38px var(--serif); }.fsv-status.parallel { fill: #8f523f; }
  .fsv-complex-vector { stroke: #789372; stroke-width: 2.5; }.fsv-complex-point, .fsv-root { fill: #789372; }.fsv-complex-point.mirror { fill: #a36f54; }
  .fsv-mirror-guide { stroke: #aaa9a3; stroke-dasharray: 5 5; }
  .fsv-unit-circle { fill: rgba(231,238,228,.26); stroke: #9caf96; stroke-width: 2; }
  .fsv-root-polygon { fill: rgba(231,238,228,.55); stroke: #a9bca5; }.fsv-root.active { fill: #a36f54; stroke: #fff; stroke-width: 3; }
  .fsv-angle-arc { stroke: #a36f54; stroke-width: 2; }
  .fsv-cross-plane, .fsv-geometry-plane { fill: rgba(231,238,228,.75); stroke: #9caf96; }
  .fsv-normal { stroke: #a36f54; stroke-width: 3; }
  .fsv-geometry-line { stroke: #667b92; stroke-width: 3; }.fsv-geometry-line.parallel { stroke-dasharray: 8 5; }
  .fsv-set { fill: rgba(231,238,228,.35); stroke: #9caf96; stroke-width: 1.5; }
  .fsv-map-node { fill: #fff; stroke: #789372; stroke-width: 1.5; }.fsv-map-node.reached { fill: #dce8d8; }.fsv-map-node.empty { fill: #fff; stroke-dasharray: 3 3; }
  @media (max-width: 760px) {
    .fsv-header { grid-template-columns: 1fr; gap: 22px; padding: 24px 18px 20px; }
    .fsv-header h2 { font-size: 29px; }
    .fsv-mode-switcher { grid-template-columns: repeat(auto-fit, minmax(74px, 1fr)); }
    .fsv-mode-switcher button { min-height: 52px; font-size: 12px; }
    .fsv-stage { min-height: 210px; padding: 0 2px; }
    .first-semester-svg { min-width: 540px; transform: translateX(calc((100% - 540px) / 2)); }
    .fsv-reading { grid-template-columns: 1fr; }
    .fsv-reading > div { padding: 19px 18px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .fsv-mode-switcher button { transition: none; }
  }
`;
