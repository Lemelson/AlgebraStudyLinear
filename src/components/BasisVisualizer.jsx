import { useMemo, useState } from 'react';
import MathText from './MathText';

const presets = {
  standard: { label: 'Стандартный базис', e1: [1, 0], e2: [0, 1] },
  skewed: { label: 'Косой базис', e1: [1, 0.5], e2: [-0.5, 1] },
  stretched: { label: 'Растянутый базис', e1: [1.5, 0], e2: [0, 0.7] },
};

export default function BasisVisualizer() {
  const [presetId, setPresetId] = useState('standard');
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const { e1, e2 } = presets[presetId];

  const vector = useMemo(() => [a * e1[0] + b * e2[0], a * e1[1] + b * e2[1]], [a, b, e1, e2]);
  const determinant = e1[0] * e2[1] - e1[1] * e2[0];
  const origin = [235, 225];
  const scale = 58;
  const point = ([x, y]) => [origin[0] + x * scale, origin[1] - y * scale];
  const endE1 = point([a * e1[0], a * e1[1]]);
  const endE2 = point([b * e2[0], b * e2[1]]);
  const endX = point(vector);

  return (
    <div className="basis-lab">
      <div className="basis-canvas">
        <svg viewBox="0 0 540 380" role="img" aria-label="Разложение вектора по двум базисным векторам">
          <defs>
            <pattern id="grid" width="29" height="29" patternUnits="userSpaceOnUse">
              <path d="M 29 0 L 0 0 0 29" fill="none" stroke="#ecebe7" strokeWidth="1" />
            </pattern>
            <marker id="arrow-dark" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#171717" />
            </marker>
            <marker id="arrow-sage" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#6f8f68" />
            </marker>
          </defs>
          <rect width="540" height="380" fill="url(#grid)" />
          <line x1="32" y1={origin[1]} x2="510" y2={origin[1]} className="axis" markerEnd="url(#arrow-dark)" />
          <line x1={origin[0]} y1="350" x2={origin[0]} y2="25" className="axis" markerEnd="url(#arrow-dark)" />
          <polyline points={`${origin.join(',')} ${endE1.join(',')} ${endX.join(',')} ${endE2.join(',')} ${origin.join(',')}`} className="decomposition-shape" />
          <line x1={origin[0]} y1={origin[1]} x2={endE1[0]} y2={endE1[1]} className="component-vector" markerEnd="url(#arrow-dark)" />
          <line x1={origin[0]} y1={origin[1]} x2={endE2[0]} y2={endE2[1]} className="component-vector" markerEnd="url(#arrow-dark)" />
          <line x1={origin[0]} y1={origin[1]} x2={endX[0]} y2={endX[1]} className="result-vector" markerEnd="url(#arrow-sage)" />
          <text x={Math.min(500, endX[0] + 8)} y={Math.max(22, endX[1] - 8)} className="svg-label">x = ({vector[0].toFixed(1)}, {vector[1].toFixed(1)})</text>
          <text x={endE1[0] + 8} y={endE1[1] + 20} className="svg-label">a·e₁</text>
          <text x={endE2[0] + 8} y={endE2[1] - 10} className="svg-label">b·e₂</text>
        </svg>
      </div>

      <div className="basis-controls">
        <div>
          <label htmlFor="basis-preset">Базис</label>
          <select id="basis-preset" value={presetId} onChange={(event) => setPresetId(event.target.value)}>
            {Object.entries(presets).map(([id, preset]) => <option key={id} value={id}>{preset.label}</option>)}
          </select>
        </div>
        <label className="range-control">
          <span>Коэффициент a <strong>{a}</strong></span>
          <input type="range" min="-3" max="3" step="1" value={a} onChange={(event) => setA(Number(event.target.value))} />
        </label>
        <label className="range-control">
          <span>Коэффициент b <strong>{b}</strong></span>
          <input type="range" min="-3" max="3" step="1" value={b} onChange={(event) => setB(Number(event.target.value))} />
        </label>
        <div className="formula-panel">
          <span>Разложение</span>
          <MathText text={`$$x = ${a}e_1 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}e_2$$`} />
        </div>
        <p className="lab-note">
          Определитель матрицы базиса равен <strong>{determinant.toFixed(2)}</strong>. Он не равен нулю, значит векторы линейно независимы.
        </p>
      </div>
    </div>
  );
}
