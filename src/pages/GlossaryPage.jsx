import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary';
import { curriculum } from '../data/curriculum';

export default function GlossaryPage() {
  const [query,setQuery]=useState('');
  const [topic,setTopic]=useState('all');
  const items=useMemo(()=>glossary.filter((item)=>(topic==='all'||item.topicId===topic)&&`${item.term} ${item.aliases.join(' ')} ${item.short}`.toLowerCase().includes(query.toLowerCase())),[query,topic]);
  return <main className="page-shell glossary-page"><header className="editorial-header"><p className="eyebrow">104 понятия · 389 словоформ</p><h1>Словарь</h1><p>Здесь сложные слова объясняются без предположения, что вы уже знаете алгебру. На других страницах эти слова подчёркнуты: наведите мышь, подождите секунду или нажмите.</p><div className="glossary-toolbar"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Например: матрица, ядро, кольцо"/><select value={topic} onChange={(e)=>setTopic(e.target.value)}><option value="all">Все темы</option>{curriculum.map((item)=><option value={item.id} key={item.id}>{item.title}</option>)}</select></div></header><div className="glossary-list">{items.map((item)=><article id={item.id} key={item.id}><span>{item.term.slice(0,1).toUpperCase()}</span><div><h2>{item.term}</h2><p className="glossary-list-short">{item.short}</p><p>{item.child}</p><dl><div><dt>Аналогия</dt><dd>{item.analogy}</dd></div><div><dt>Пример</dt><dd>{item.example}</dd></div></dl>{item.notThis&&<aside><strong>Не перепутать:</strong> {item.notThis}</aside>}{item.definitionLink&&<Link to={item.definitionLink}>Полное определение →</Link>}</div></article>)}</div>{items.length===0&&<p className="empty-glossary">Ничего не найдено. Попробуйте более короткую форму слова.</p>}</main>;
}
