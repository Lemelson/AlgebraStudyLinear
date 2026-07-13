import { Link, useParams } from 'react-router-dom';
import { corpusGroups } from '../data/examCorpus';
import { curriculum } from '../data/curriculum';
import { controlCurriculum } from '../data/controlCurriculum';
import { topicForText } from '../data/topicLessons';
import { guideFor } from '../data/studyGuides';
import { getDefinitionGuide } from '../data/definitionGuides';
import { proofGuidesExpanded } from '../data/proofGuidesExpanded';
import { problemGuidesExpanded } from '../data/problemGuidesExpanded';
import ExpandedGuide from '../components/ExpandedGuide';
import DefinitionExpansion from '../components/DefinitionExpansion';
import { getDefinitionEnrichment } from '../data/definitionEnrichment';
import { proofEnrichment } from '../data/proofEnrichment';
import MathText from '../components/MathText';

const labels = { definitions: ['Определение','Определения'], proofs: ['Доказательство','Доказательства'], problems: ['Задача','Задачи'] };

export default function CorpusDetailPage({ kind }) {
  const { groupId, number } = useParams();
  const group = corpusGroups[kind].find((item) => item.id === groupId);
  const item = group?.items.find((entry) => entry.number === Number(number));
  if (!item) return <main className="page-shell empty-state"><h1>Пункт не найден</h1><Link to={`/${kind}`}>Вернуться к списку</Link></main>;
  const storedDefinitionGuide = kind === 'definitions' ? getDefinitionGuide(groupId, item.number) : null;
  const definitionGuide = storedDefinitionGuide ? { ...storedDefinitionGuide, source: null } : null;
  const definitionDeep = kind === 'definitions' ? getDefinitionEnrichment(groupId, item.number) : null;
  const topicId = item.topicId || definitionGuide?.topicId || topicForText(item.text);
  const topic = [...controlCurriculum, ...curriculum].find((entry) => entry.id === topicId) || curriculum[0];
  const topicPath = controlCurriculum.some((entry) => entry.id === topic.id) ? `/control-topics/${topic.id}` : `/topics/${topic.id}`;
  const guide = guideFor(kind, groupId, item.number, item.text);
  const expandedGuide = kind === 'proofs' ? proofGuidesExpanded[`${groupId}:${item.number}`] : kind === 'problems' ? problemGuidesExpanded[`${groupId}:${item.number}`] : null;
  const proofDeep = kind === 'proofs' ? proofEnrichment[`${groupId}:${item.number}`] : null;
  const currentIndex = group.items.findIndex((entry) => entry.number === item.number);
  const next = group.items[currentIndex + 1];
  return <main className="page-shell document-page"><Link className="back-link" to={`/${kind}`}>← {labels[kind][1]}</Link><header className="document-header"><p className="eyebrow">{group.title} · № {item.number}</p><h1>{labels[kind][0]}</h1>{kind === 'problems' ? <MathText className="official-wording" text={item.latexText || item.text} /> : <p className="official-wording">{item.text}</p>}</header><DefinitionExpansion guide={definitionGuide} enrichment={definitionDeep}/><ExpandedGuide kind={kind} guide={expandedGuide} enrichment={proofDeep}/>{!expandedGuide && <section className="guide-layout"><article><p className="section-kicker">Как закрепить</p><h2>{guide.label}</h2><div className="solution-steps">{guide.steps.map((step,index) => <div key={step}><span>Шаг {index + 1}</span><div><p>{step}</p></div></div>)}</div></article><aside><span>Связанная тема</span><h2>{topic.title}</h2><p>{topic.summary}</p>{definitionGuide?.source && <small>{definitionGuide.source}</small>}<Link className="secondary-button" to={topicPath}>Открыть главу</Link></aside></section>}{expandedGuide && <aside className="related-topic-card"><span>Связанная тема</span><h2>{topic.title}</h2><p>{topic.summary}</p><Link className="secondary-button" to={topicPath}>Открыть главу</Link></aside>}{next && <Link className="next-document" to={`/${kind}/${groupId}/${next.number}`}><span>Следующий пункт</span><strong>№ {next.number} · {next.text}</strong></Link>}</main>;
}
