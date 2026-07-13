import { useMemo, useState } from 'react';

const mod = (value, n) => ((value % n) + n) % n;
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const values = (count) => Array.from({ length: count }, (_, index) => index);
const sameSet = (left, right) => left.length === right.length && left.every((item) => right.includes(item));
const formatNumber = (value) => Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.0', '');

function VisualShell({ eyebrow, title, description, children, conclusion }) {
  return (
    <section className="control-visual-shell">
      <header className="control-visual-header">
        <span>{eyebrow}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>
      <div className="control-visual-stage">{children}</div>
      <p className="control-visual-conclusion">{conclusion}</p>
    </section>
  );
}

function SegmentedButtons({ label, options, value, onChange }) {
  return (
    <div className="control-visual-segments" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          className={value === option.value ? 'is-active' : ''}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          key={option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PropertyStrip({ items }) {
  return (
    <dl className="control-visual-properties">
      {items.map(({ label, value, good }) => (
        <div data-good={good ? 'true' : 'false'} key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ArrowLine({ from, to, className = '' }) {
  return (
    <g className={className}>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
      <circle cx={to[0]} cy={to[1]} r="5" />
    </g>
  );
}

const operationOptions = [
  { value: 'add', label: 'a + b', apply: (a, b) => mod(a + b, 4) },
  { value: 'shift', label: 'a + b + 1', apply: (a, b) => mod(a + b + 1, 4) },
  { value: 'subtract', label: 'a − b', apply: (a, b) => mod(a - b, 4) },
  { value: 'multiply', label: 'a · b', apply: (a, b) => mod(a * b, 4) },
];

function GroupAxiomLab() {
  const [operationId, setOperationId] = useState('add');
  const [selected, setSelected] = useState(1);
  const operation = operationOptions.find((item) => item.value === operationId);
  const elements = values(4);
  const apply = operation.apply;
  const associative = elements.every((a) => elements.every((b) => elements.every((c) => apply(apply(a, b), c) === apply(a, apply(b, c)))));
  const commutative = elements.every((a) => elements.every((b) => apply(a, b) === apply(b, a)));
  const neutral = elements.find((candidate) => elements.every((item) => apply(candidate, item) === item && apply(item, candidate) === item));
  const inverses = neutral === undefined ? [] : elements.map((item) => elements.find((candidate) => apply(item, candidate) === neutral && apply(candidate, item) === neutral));
  const allInvertible = neutral !== undefined && inverses.every((item) => item !== undefined);
  const isGroup = associative && neutral !== undefined && allInvertible;

  return (
    <VisualShell
      eyebrow="Лаборатория аксиом"
      title="Когда таблица операции действительно задаёт группу"
      description="Меняйте операцию на множестве {0,1,2,3}. Замкнутости недостаточно: нужны ассоциативность, нейтральный элемент и обратный для каждого элемента."
      conclusion={isGroup ? `Получилась ${commutative ? 'абелева ' : ''}группа. Нейтральный элемент — ${neutral}.` : 'Это не группа. Найдите первое условие, которое перестало выполняться.'}
    >
      <SegmentedButtons label="Операция по модулю 4" options={operationOptions} value={operationId} onChange={setOperationId} />
      <div className="control-visual-split">
        <div className="control-visual-table-wrap">
          <table className="control-visual-cayley-table">
            <caption>Таблица операции {operation.label} по модулю 4</caption>
            <thead><tr><th scope="col">{operation.label}</th>{elements.map((item) => <th scope="col" key={item}>{item}</th>)}</tr></thead>
            <tbody>{elements.map((row) => <tr data-selected={row === selected ? 'true' : 'false'} key={row}><th scope="row"><button type="button" aria-pressed={row === selected} onClick={() => setSelected(row)}>{row}</button></th>{elements.map((column) => <td data-neutral={apply(row, column) === neutral ? 'true' : 'false'} key={column}>{apply(row, column)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="control-visual-explainer">
          <span>Разбираем элемент {selected}</span>
          <strong>{neutral === undefined ? 'Нейтрального элемента нет' : inverses[selected] === undefined ? 'Обратного элемента нет' : `Обратный: ${inverses[selected]}`}</strong>
          <p>{neutral === undefined ? 'Нельзя даже сформулировать условие a·a⁻¹=e.' : inverses[selected] === undefined ? `Ни один элемент не даёт ${neutral} одновременно слева и справа.` : `${selected} ⋆ ${inverses[selected]} = ${inverses[selected]} ⋆ ${selected} = ${neutral}.`}</p>
        </div>
      </div>
      <PropertyStrip items={[
        { label: 'Замкнутость', value: 'да', good: true },
        { label: 'Ассоциативность', value: associative ? 'да' : 'нет', good: associative },
        { label: 'Нейтральный', value: neutral === undefined ? 'нет' : neutral, good: neutral !== undefined },
        { label: 'Все обратимы', value: allInvertible ? 'да' : 'нет', good: allInvertible },
      ]} />
    </VisualShell>
  );
}

const groupModels = {
  z4: {
    title: 'Циклическая группа Z₄',
    labels: ['0', '1', '2', '3'],
    apply: (a, b) => mod(a + b, 4),
    identity: 0,
  },
  klein: {
    title: 'Группа Клейна V₄',
    labels: ['e', 'a', 'b', 'c'],
    apply: (a, b) => a ^ b,
    identity: 0,
  },
};

function elementOrder(model, element) {
  if (element === model.identity) return 1;
  let result = model.identity;
  for (let order = 1; order <= 8; order += 1) {
    result = model.apply(result, element);
    if (result === model.identity) return order;
  }
  return null;
}

function CayleyStructureAtlas() {
  const [modelId, setModelId] = useState('z4');
  const [selected, setSelected] = useState(1);
  const model = groupModels[modelId];
  const elements = values(4);
  const inverse = elements.find((candidate) => model.apply(selected, candidate) === model.identity);

  const changeModel = (next) => {
    setModelId(next);
    setSelected(1);
  };

  return (
    <VisualShell
      eyebrow="Атлас таблиц Кэли"
      title="Одинаковое число элементов — разное устройство группы"
      description="У Z₄ есть элемент порядка 4. В группе Клейна каждый ненейтральный элемент имеет порядок 2. Таблица Кэли хранит это различие целиком."
      conclusion={modelId === 'z4' ? 'Строка элемента 1 проходит через все четыре значения: один элемент порождает всю Z₄.' : 'Ни одна строка ненейтрального элемента не создаёт цикл длины 4: V₄ не циклическая.'}
    >
      <SegmentedButtons label="Сравниваемые группы" options={[{ value: 'z4', label: 'Z₄' }, { value: 'klein', label: 'V₄' }]} value={modelId} onChange={changeModel} />
      <div className="control-visual-split">
        <div className="control-visual-table-wrap">
          <table className="control-visual-cayley-table">
            <caption>{model.title}</caption>
            <thead><tr><th scope="col">⋆</th>{elements.map((item) => <th scope="col" key={item}>{model.labels[item]}</th>)}</tr></thead>
            <tbody>{elements.map((row) => <tr data-selected={row === selected ? 'true' : 'false'} key={row}><th scope="row"><button type="button" aria-pressed={row === selected} onClick={() => setSelected(row)}>{model.labels[row]}</button></th>{elements.map((column) => <td data-neutral={model.apply(row, column) === model.identity ? 'true' : 'false'} key={column}>{model.labels[model.apply(row, column)]}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="control-visual-order-list">
          <span>Порядки элементов</span>
          {elements.map((item) => <button type="button" className={selected === item ? 'is-active' : ''} onClick={() => setSelected(item)} key={item}><b>{model.labels[item]}</b><small>ord = {elementOrder(model, item)}</small></button>)}
          <p>Для {model.labels[selected]} обратный элемент — {model.labels[inverse]}.</p>
        </div>
      </div>
    </VisualShell>
  );
}

function CyclicOrbitLab() {
  const [n, setN] = useState(8);
  const [step, setStep] = useState(3);
  const orbit = useMemo(() => {
    const result = [];
    let current = 0;
    do {
      result.push(current);
      current = mod(current + step, n);
    } while (current !== 0 && result.length <= n);
    return result;
  }, [n, step]);
  const radius = 92;
  const center = 130;
  const points = values(n).map((item) => {
    const angle = -Math.PI / 2 + 2 * Math.PI * item / n;
    return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)];
  });

  const updateN = (event) => {
    const next = Number(event.target.value);
    setN(next);
    setStep((current) => Math.min(current, next - 1));
  };

  return (
    <VisualShell
      eyebrow="Циклический маршрут"
      title="Шаг k по кругу Zₙ показывает порядок элемента"
      description="Начинаем с нуля и каждый раз прибавляем k. Порядок [k] — число шагов до первого возвращения в ноль."
      conclusion={`ord([${step}]) = ${orbit.length} = ${n}/gcd(${n},${step}). ${orbit.length === n ? 'Элемент порождает всю группу.' : `Он порождает только подгруппу из ${orbit.length} элементов.`}`}
    >
      <div className="control-visual-controls">
        <label><span>Размер группы n</span><b>{n}</b><input type="range" min="5" max="14" value={n} onChange={updateN} /></label>
        <label><span>Шаг k</span><b>{step}</b><input type="range" min="1" max={n - 1} value={step} onChange={(event) => setStep(Number(event.target.value))} /></label>
      </div>
      <div className="control-visual-split">
        <svg className="control-visual-clock" viewBox="0 0 260 260" role="img" aria-labelledby="cyclic-title cyclic-desc">
          <title id="cyclic-title">Орбита элемента {step} в Z по модулю {n}</title>
          <desc id="cyclic-desc">Последовательность {orbit.join(', ')} возвращается в ноль после {orbit.length} шагов.</desc>
          <circle className="control-visual-clock-ring" cx={center} cy={center} r={radius} />
          {orbit.map((item, index) => {
            const next = orbit[(index + 1) % orbit.length];
            return <line className="control-visual-orbit-edge" x1={points[item][0]} y1={points[item][1]} x2={points[next][0]} y2={points[next][1]} key={`${item}-${next}`} />;
          })}
          {points.map(([x, y], item) => <g className={orbit.includes(item) ? 'is-visited' : ''} key={item}><circle cx={x} cy={y} r="15" /><text x={x} y={y + 4} textAnchor="middle">{item}</text></g>)}
        </svg>
        <div className="control-visual-sequence">
          <span>Последовательность степеней</span>
          <ol>{orbit.map((item, index) => <li key={item}><small>{index === 0 ? '0' : index}</small><b>{item}</b></li>)}</ol>
          <p>НОД({n},{step}) = {gcd(n, step)}. Чем больше общий делитель, тем короче цикл.</p>
        </div>
      </div>
    </VisualShell>
  );
}

function CosetPartitionAtlas() {
  const [generator, setGenerator] = useState(4);
  const n = 12;
  const divisor = gcd(n, generator);
  const subgroup = values(n / divisor).map((index) => mod(index * generator, n));
  const cosets = values(divisor).map((representative) => subgroup.map((item) => mod(item + representative, n)).sort((a, b) => a - b));

  return (
    <VisualShell
      eyebrow="Разбиение на классы"
      title="Смежные классы не перекрываются и покрывают всю группу"
      description="В Z₁₂ выберите порождающий элемент подгруппы H. Каждый класс a+H — копия H, сдвинутая на a."
      conclusion={`|H|=${subgroup.length}, классов ${cosets.length}. Проверка Лагранжа: ${subgroup.length} · ${cosets.length} = 12.`}
    >
      <div className="control-visual-select-row">
        <label htmlFor="coset-generator">Подгруппа</label>
        <select id="coset-generator" value={generator} onChange={(event) => setGenerator(Number(event.target.value))}>
          {[2, 3, 4, 6].map((item) => <option value={item} key={item}>H = &lt;{item}&gt;</option>)}
        </select>
        <p>H = {'{'}{subgroup.join(', ')}{'}'}</p>
      </div>
      <div className="control-visual-coset-grid" aria-label={`Смежные классы Z12 по подгруппе, порождённой ${generator}`}>
        {cosets.map((coset, cosetIndex) => <section className={`control-visual-tone-${cosetIndex % 6}`} key={coset.join('-')}><span>{cosetIndex}+H</span><div>{coset.map((item) => <b key={item}>{item}</b>)}</div></section>)}
      </div>
      <div className="control-visual-number-line" aria-hidden="true">{values(n).map((item) => {
        const cosetIndex = cosets.findIndex((coset) => coset.includes(item));
        return <span className={`control-visual-tone-${cosetIndex % 6}`} key={item}>{item}</span>;
      })}</div>
    </VisualShell>
  );
}

const permutations = [
  { id: 'e', label: 'e', map: [0, 1, 2] },
  { id: 't12', label: '(12)', map: [1, 0, 2] },
  { id: 't13', label: '(13)', map: [2, 1, 0] },
  { id: 't23', label: '(23)', map: [0, 2, 1] },
  { id: 'c123', label: '(123)', map: [1, 2, 0] },
  { id: 'c132', label: '(132)', map: [2, 0, 1] },
];
const permutationByMap = (map) => permutations.find((item) => item.map.every((value, index) => value === map[index]));
const compose = (left, right) => permutationByMap(right.map.map((image) => left.map[image]));

function NormalityLab() {
  const [subgroupId, setSubgroupId] = useState('a3');
  const [gId, setGId] = useState('t13');
  const subgroup = subgroupId === 'a3' ? ['e', 'c123', 'c132'] : ['e', 't12'];
  const g = permutations.find((item) => item.id === gId);
  const members = subgroup.map((id) => permutations.find((item) => item.id === id));
  const left = members.map((item) => compose(g, item).id).sort();
  const right = members.map((item) => compose(item, g).id).sort();
  const normalForG = sameSet(left, right);
  const labels = (ids) => ids.map((id) => permutations.find((item) => item.id === id).label);
  const subgroupNormal = subgroupId === 'a3';

  return (
    <VisualShell
      eyebrow="Тест нормальности"
      title="Левый и правый сдвиг подгруппы могут не совпасть"
      description="В S₃ сравните gH и Hg. Нормальная подгруппа остаётся тем же набором классов независимо от стороны умножения."
      conclusion={subgroupNormal ? 'A₃ нормальна в S₃: равенство gH=Hg выполнено для каждого g.' : 'Подгруппа {e,(12)} не нормальна: достаточно одного g, для которого левый и правый классы различаются.'}
    >
      <div className="control-visual-select-grid">
        <label><span>Подгруппа H</span><select value={subgroupId} onChange={(event) => setSubgroupId(event.target.value)}><option value="a3">A₃ = {'{'}e,(123),(132){'}'}</option><option value="h12">{'{'}e,(12){'}'}</option></select></label>
        <label><span>Элемент g</span><select value={gId} onChange={(event) => setGId(event.target.value)}>{permutations.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
      </div>
      <div className="control-visual-coset-comparison">
        <section data-match={normalForG ? 'true' : 'false'}><span>gH</span><div>{labels(left).map((item) => <b key={item}>{item}</b>)}</div></section>
        <strong>{normalForG ? '=' : '≠'}</strong>
        <section data-match={normalForG ? 'true' : 'false'}><span>Hg</span><div>{labels(right).map((item) => <b key={item}>{item}</b>)}</div></section>
      </div>
      <p className="control-visual-inline-note">Для выбранного g: {normalForG ? 'совпали' : 'не совпали'}. Но нормальность требует совпадения для всех g.</p>
    </VisualShell>
  );
}

function HomomorphismAtlas() {
  const [target, setTarget] = useState(4);
  const domain = values(12);
  const kernel = domain.filter((item) => mod(item, target) === 0);
  const fibers = values(target).map((image) => domain.filter((item) => mod(item, target) === image));

  return (
    <VisualShell
      eyebrow="Гомоморфизм по слоям"
      title="Фактор по ядру оставляет ровно различимые образы"
      description={`Рассматриваем φ: Z₁₂ → Zₘ, φ([x])=[x]ₘ. Выберите m, делящий 12, и проследите, какие элементы склеиваются.`}
      conclusion={`ker φ = {${kernel.join(', ')}}. После склеивания каждого волокна остаётся ${target} классов — ровно столько же, сколько элементов в Im φ.`}
    >
      <div className="control-visual-select-row">
        <label htmlFor="hom-target">Целевая группа</label>
        <select id="hom-target" value={target} onChange={(event) => setTarget(Number(event.target.value))}>{[3, 4, 6].map((item) => <option value={item} key={item}>Z₍{item}₎</option>)}</select>
        <p>φ(x)=x mod {target}</p>
      </div>
      <div className="control-visual-fiber-map">
        {fibers.map((fiber, image) => <section className={`control-visual-tone-${image % 6}`} key={image}><div><span>класс {image}+ker φ</span>{fiber.map((item) => <b data-kernel={image === 0 ? 'true' : 'false'} key={item}>{item}</b>)}</div><i aria-hidden="true">→</i><strong>{image}</strong></section>)}
      </div>
      <div className="control-visual-equation" aria-label="Первая теорема о гомоморфизме">Z₁₂ / ker φ ≅ Im φ = Z<sub>{target}</sub></div>
    </VisualShell>
  );
}

function ResidueFieldLab() {
  const [n, setN] = useState(5);
  const elements = values(n);
  const units = elements.filter((item) => gcd(item, n) === 1);
  const zeroDivisors = elements.filter((item) => item !== 0 && elements.some((other) => other !== 0 && mod(item * other, n) === 0));
  const isField = units.length === n - 1;

  return (
    <VisualShell
      eyebrow="Кольцо или поле"
      title="Z₅ против Z₆: единица в строке решает вопрос о делении"
      description="В поле каждая ненулевая строка таблицы умножения содержит 1: значит, у каждого ненулевого класса есть обратный."
      conclusion={isField ? 'Z₅ — поле: все четыре ненулевых класса обратимы, делителей нуля нет.' : 'Z₆ — не поле: 2·3=0 при ненулевых 2 и 3, а классы 2, 3, 4 необратимы.'}
    >
      <SegmentedButtons label="Модуль" options={[{ value: 5, label: 'Z₅' }, { value: 6, label: 'Z₆' }]} value={n} onChange={setN} />
      <div className="control-visual-table-wrap">
        <table className="control-visual-cayley-table control-visual-residue-table">
          <caption>Умножение по модулю {n}</caption>
          <thead><tr><th scope="col">×</th>{elements.map((item) => <th scope="col" key={item}>{item}</th>)}</tr></thead>
          <tbody>{elements.map((row) => <tr key={row}><th scope="row">{row}</th>{elements.map((column) => { const product = mod(row * column, n); return <td data-one={product === 1 ? 'true' : 'false'} data-zero-divisor={product === 0 && row !== 0 && column !== 0 ? 'true' : 'false'} key={column}>{product}</td>; })}</tr>)}</tbody>
        </table>
      </div>
      <PropertyStrip items={[
        { label: 'Обратимые', value: units.join(', '), good: isField },
        { label: 'Делители нуля', value: zeroDivisors.length ? zeroDivisors.join(', ') : 'нет', good: zeroDivisors.length === 0 },
        { label: 'Каждый ненулевой обратим', value: isField ? 'да' : 'нет', good: isField },
      ]} />
    </VisualShell>
  );
}

function CharacteristicAtlas() {
  const [structure, setStructure] = useState('5');
  const [steps, setSteps] = useState(7);
  const rational = structure === 'Q';
  const n = rational ? null : Number(structure);
  const sequence = values(steps + 1).map((item) => rational ? item : mod(item, n));
  const firstReturn = rational ? null : n;

  return (
    <VisualShell
      eyebrow="Характеристика"
      title="Сколько единиц нужно сложить, чтобы снова получить ноль"
      description="Характеристика — первый положительный момент возврата суммы 1+…+1 в ноль. Если возврата нет, характеристика равна 0."
      conclusion={rational ? 'В Q суммы 1,2,3,… никогда не равны нулю, поэтому char Q=0.' : `${n}·1=0 впервые при ${n} слагаемых, поэтому char(Z₍${n}₎)=${n}. ${[2, 3, 5].includes(n) ? 'Простая характеристика совместима с полем.' : 'Составная характеристика возможна у кольца, но не у поля.'}`}
    >
      <div className="control-visual-select-grid">
        <label><span>Структура</span><select value={structure} onChange={(event) => setStructure(event.target.value)}>{['2', '3', '5', '6'].map((item) => <option value={item} key={item}>Z₍{item}₎</option>)}<option value="Q">Q</option></select></label>
        <label><span>Число сложений: {steps}</span><input type="range" min="3" max="12" value={steps} onChange={(event) => setSteps(Number(event.target.value))} /></label>
      </div>
      <ol className="control-visual-addition-walk">
        {sequence.map((item, index) => <li data-return={index === firstReturn ? 'true' : 'false'} key={index}><small>{index}·1</small><b>{item}</b>{index === firstReturn && <span>первый возврат</span>}</li>)}
      </ol>
      <div className="control-visual-equation">char {rational ? 'Q' : `Z${n}`} = {rational ? '0' : n}</div>
    </VisualShell>
  );
}

function IdealQuotientLab() {
  const [generator, setGenerator] = useState(3);
  const n = 12;
  const ideal = values(n / generator).map((index) => index * generator);
  const cosets = values(generator).map((representative) => ideal.map((item) => mod(item + representative, n)).sort((a, b) => a - b));

  return (
    <VisualShell
      eyebrow="Идеал как разрешённая разность"
      title="Факторкольцо склеивает числа, различающиеся на элемент идеала"
      description="В Z₁₂ выберите идеал (d). Числа a и b становятся одним классом, если a−b лежит в (d)."
      conclusion={`Идеал (${generator}) содержит ${ideal.length} элементов, а фактор Z₁₂/(${generator}) содержит ${cosets.length} классов и изоморфен Z${generator}.`}
    >
      <div className="control-visual-select-row">
        <label htmlFor="ideal-generator">Порождающий d</label>
        <select id="ideal-generator" value={generator} onChange={(event) => setGenerator(Number(event.target.value))}>{[2, 3, 4, 6].map((item) => <option value={item} key={item}>d = {item}</option>)}</select>
        <p>({generator}) = {'{'}{ideal.join(', ')}{'}'}</p>
      </div>
      <div className="control-visual-quotient-stack">
        {cosets.map((coset, index) => <section className={`control-visual-tone-${index % 6}`} key={index}><span>Класс [{index}]</span><div>{coset.map((item) => <b key={item}>{item}</b>)}</div><small>все числа имеют остаток {index} по модулю {generator}</small></section>)}
      </div>
      <div className="control-visual-equation">a ≡ b mod ({generator}) ⇔ a − b ∈ ({generator})</div>
    </VisualShell>
  );
}

const f4Labels = ['0', '1', 'α', 'α+1'];
const f4Add = (left, right) => left ^ right;
const f4Multiply = (left, right) => {
  const [a0, a1] = [left & 1, (left >> 1) & 1];
  const [b0, b1] = [right & 1, (right >> 1) & 1];
  const constant = (a0 * b0 + a1 * b1) % 2;
  const alpha = (a0 * b1 + a1 * b0 + a1 * b1) % 2;
  return constant + 2 * alpha;
};

function FiniteFieldAtlas() {
  const [left, setLeft] = useState(2);
  const [right, setRight] = useState(3);
  const [operation, setOperation] = useState('multiply');
  const result = operation === 'add' ? f4Add(left, right) : f4Multiply(left, right);
  const operationSymbol = operation === 'add' ? '+' : '·';

  return (
    <VisualShell
      eyebrow="Поле из четырёх элементов"
      title="F₄ строится из многочленов, а не из чисел по модулю 4"
      description="В F₂[x]/(x²+x+1) каждый класс имеет вид a+bα. Соотношение α²+α+1=0 превращается в правило α²=α+1."
      conclusion={`${f4Labels[left]} ${operationSymbol} ${f4Labels[right]} = ${f4Labels[result]}. ${operation === 'multiply' && left !== 0 ? `Ненулевой множитель ${f4Labels[left]} имеет обратный.` : 'Сложение коэффициентов выполняется по модулю 2.'}`}
    >
      <SegmentedButtons label="Операция в F4" options={[{ value: 'add', label: 'Сложение' }, { value: 'multiply', label: 'Умножение' }]} value={operation} onChange={setOperation} />
      <div className="control-visual-field-calculator">
        <label><span>Первый элемент</span><select value={left} onChange={(event) => setLeft(Number(event.target.value))}>{f4Labels.map((label, index) => <option value={index} key={label}>{label}</option>)}</select></label>
        <strong>{operationSymbol}</strong>
        <label><span>Второй элемент</span><select value={right} onChange={(event) => setRight(Number(event.target.value))}>{f4Labels.map((label, index) => <option value={index} key={label}>{label}</option>)}</select></label>
        <strong>=</strong>
        <output>{f4Labels[result]}</output>
      </div>
      <div className="control-visual-polynomial-rule"><span>Правило сокращения</span><b>α² = α + 1</b><p>После каждого умножения заменяем α² и складываем коэффициенты по модулю 2.</p></div>
      <div className="control-visual-element-strip" aria-label="Все элементы поля F4">{f4Labels.map((label) => <span key={label}>{label}</span>)}</div>
    </VisualShell>
  );
}

const basisModels = {
  standard: { label: 'Стандартный', first: [1, 0], second: [0, 1] },
  skew: { label: 'Косой', first: [1, 0], second: [1, 1] },
  diagonal: { label: 'Диагональный', first: [1, 1], second: [1, -1] },
};

function BasisCoordinatesLab() {
  const [basisId, setBasisId] = useState('skew');
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const basis = basisModels[basisId];
  const vector = [a * basis.first[0] + b * basis.second[0], a * basis.first[1] + b * basis.second[1]];
  const origin = [170, 150];
  const scale = 22;
  const point = ([x, y]) => [origin[0] + scale * x, origin[1] - scale * y];

  return (
    <VisualShell
      eyebrow="Координаты как инструкция сборки"
      title="Один и тот же столбец координат задаёт разные векторы в разных базисах"
      description="Координаты (a,b) означают не положение точки сами по себе, а команду a·v₁+b·v₂ для выбранного базиса."
      conclusion={`В базисе «${basis.label}» координаты (${a},${b}) собирают физический вектор (${vector[0]},${vector[1]}).`}
    >
      <div className="control-visual-select-grid">
        <label><span>Базис</span><select value={basisId} onChange={(event) => setBasisId(event.target.value)}>{Object.entries(basisModels).map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}</select></label>
        <div className="control-visual-coordinate-pair"><span>[x]ᵥ</span><b>({a}, {b})</b></div>
      </div>
      <div className="control-visual-controls">
        <label><span>Коэффициент a</span><b>{a}</b><input type="range" min="-3" max="3" value={a} onChange={(event) => setA(Number(event.target.value))} /></label>
        <label><span>Коэффициент b</span><b>{b}</b><input type="range" min="-3" max="3" value={b} onChange={(event) => setB(Number(event.target.value))} /></label>
      </div>
      <svg className="control-visual-vector-plane" viewBox="0 0 340 300" role="img" aria-labelledby="basis-title basis-desc">
        <title id="basis-title">Сборка вектора из двух базисных направлений</title>
        <desc id="basis-desc">Вектор с координатами {a}, {b} в выбранном базисе равен {vector[0]}, {vector[1]} в стандартных координатах.</desc>
        <line className="control-visual-axis" x1="20" y1={origin[1]} x2="320" y2={origin[1]} />
        <line className="control-visual-axis" x1={origin[0]} y1="15" x2={origin[0]} y2="285" />
        <ArrowLine className="control-visual-basis-first" from={origin} to={point([basis.first[0] * 1.8, basis.first[1] * 1.8])} />
        <ArrowLine className="control-visual-basis-second" from={origin} to={point([basis.second[0] * 1.8, basis.second[1] * 1.8])} />
        <ArrowLine className="control-visual-vector-result" from={origin} to={point(vector)} />
        <text x={point([basis.first[0] * 1.8, basis.first[1] * 1.8])[0] + 7} y={point([basis.first[0] * 1.8, basis.first[1] * 1.8])[1] - 7}>v₁</text>
        <text x={point([basis.second[0] * 1.8, basis.second[1] * 1.8])[0] + 7} y={point([basis.second[0] * 1.8, basis.second[1] * 1.8])[1] - 7}>v₂</text>
        <text x={point(vector)[0] + 7} y={point(vector)[1] - 7}>x</text>
      </svg>
      <div className="control-visual-equation">x = {a}·v₁ + {b}·v₂ = ({vector[0]}, {vector[1]})</div>
    </VisualShell>
  );
}

function BasisChangeAtlas() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(1);
  const firstCoordinate = (x + y) / 2;
  const secondCoordinate = (x - y) / 2;
  const origin = [170, 150];
  const scale = 40;
  const point = ([horizontal, vertical]) => [origin[0] + scale * horizontal, origin[1] - scale * vertical];
  const firstPart = [firstCoordinate, firstCoordinate];
  const vector = [x, y];

  return (
    <VisualShell
      eyebrow="Смена базиса"
      title="Вектор не меняется — меняются числа, которыми мы его описываем"
      description="Новый базис f₁=(1,1), f₂=(1,−1). Матрица C хранит новые базисные векторы в старых координатах, поэтому [x]ₑ=C[x]𝒇."
      conclusion={`Физический вектор (${x},${y}) имеет старые координаты (${x},${y}) и новые (${formatNumber(firstCoordinate)},${formatNumber(secondCoordinate)}). Обе записи задают одну точку.`}
    >
      <div className="control-visual-controls">
        <label><span>Стандартная координата x</span><b>{x}</b><input type="range" min="-3" max="3" value={x} onChange={(event) => setX(Number(event.target.value))} /></label>
        <label><span>Стандартная координата y</span><b>{y}</b><input type="range" min="-3" max="3" value={y} onChange={(event) => setY(Number(event.target.value))} /></label>
      </div>
      <div className="control-visual-split">
        <svg className="control-visual-vector-plane" viewBox="0 0 340 300" role="img" aria-labelledby="change-title change-desc">
          <title id="change-title">Один вектор в двух базисах</title>
          <desc id="change-desc">Стандартные координаты {x}, {y}; координаты в диагональном базисе {formatNumber(firstCoordinate)}, {formatNumber(secondCoordinate)}.</desc>
          <line className="control-visual-axis" x1="20" y1={origin[1]} x2="320" y2={origin[1]} />
          <line className="control-visual-axis" x1={origin[0]} y1="15" x2={origin[0]} y2="285" />
          <line className="control-visual-basis-first" x1="40" y1="280" x2="300" y2="20" />
          <line className="control-visual-basis-second" x1="40" y1="20" x2="300" y2="280" />
          <ArrowLine className="control-visual-coordinate-part" from={origin} to={point(firstPart)} />
          <ArrowLine className="control-visual-coordinate-part" from={point(firstPart)} to={point(vector)} />
          <ArrowLine className="control-visual-vector-result" from={origin} to={point(vector)} />
        </svg>
        <div className="control-visual-matrix-work">
          <div><span>Матрица перехода</span><b>C = [[1, 1], [1, −1]]</b></div>
          <div><span>Старые координаты</span><b>[x]ₑ = ({x}, {y})</b></div>
          <div><span>Новые координаты</span><b>[x]𝒇 = ({formatNumber(firstCoordinate)}, {formatNumber(secondCoordinate)})</b></div>
          <p>C · ({formatNumber(firstCoordinate)}, {formatNumber(secondCoordinate)})ᵀ = ({x}, {y})ᵀ</p>
        </div>
      </div>
    </VisualShell>
  );
}

const firstVisuals = {
  'group-foundations': GroupAxiomLab,
  'cyclic-groups': CyclicOrbitLab,
  'quotient-groups': NormalityLab,
  'control-rings-fields': ResidueFieldLab,
  'quotient-rings': IdealQuotientLab,
  'control-vector-spaces': BasisCoordinatesLab,
};

const atlasVisuals = {
  'group-foundations': CayleyStructureAtlas,
  'cyclic-groups': CosetPartitionAtlas,
  'quotient-groups': HomomorphismAtlas,
  'control-rings-fields': CharacteristicAtlas,
  'quotient-rings': FiniteFieldAtlas,
  'control-vector-spaces': BasisChangeAtlas,
};

function MissingVisual({ topicId }) {
  return <p className="control-visual-missing" role="note">Для темы «{topicId}» визуализация пока не зарегистрирована.</p>;
}

export function ControlTopicVisualizer({ topicId }) {
  const Visual = firstVisuals[topicId];
  return Visual ? <Visual /> : <MissingVisual topicId={topicId} />;
}

export function ControlTopicAtlas({ topicId }) {
  const Visual = atlasVisuals[topicId];
  return Visual ? <Visual /> : <MissingVisual topicId={topicId} />;
}
