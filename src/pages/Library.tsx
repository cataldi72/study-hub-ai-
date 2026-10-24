import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { topics } from '../content/topics'
import Tex from '../lib/Tex'
export function Library() {
  return <div><h1 className="text-2xl font-bold mb-3">Biblioteca</h1><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {topics.map(t => <Link key={t.id} to={`/biblioteca/${t.id}`} className="bg-card border border-line rounded p-4 hover:border-brand"><div className="text-brand text-sm">{t.subject} · {t.level}</div><div className="font-semibold">{t.title}</div></Link>)}</div></div>
}
export function TopicPage() {
  const { id } = useParams(); const t = topics.find(x => x.id === id); const [ans, setAns] = useState<Record<number, number>>({})
  if (!t) return <p>Tópico não encontrado.</p>
  return <article className="space-y-3 max-w-2xl"><h1 className="text-2xl font-bold">{t.title}</h1><p>{t.explain}</p>
    {t.formulas.map(f => <div key={f} className="bg-card rounded p-3"><Tex f={f} /></div>)}
    <p><b>Exemplo:</b> {t.example}</p><p><b>Resumo:</b> {t.summary}</p><p><b>Erro comum:</b> {t.mistakes}</p>
    <h2 className="font-bold">Exercícios</h2>
    {t.quiz.map((q, i) => <div key={i} className="bg-card border border-line rounded p-3"><p>{q.q}</p>
      {q.options.map((o, j) => <button key={j} disabled={ans[i] !== undefined} onClick={() => setAns({ ...ans, [i]: j })} className={`block w-full text-left border rounded px-2 py-1 my-1 ${ans[i] === undefined ? 'border-line' : j === q.answer ? 'border-green-500' : ans[i] === j ? 'border-red-500' : 'border-line'}`}>{o}</button>)}
      {ans[i] !== undefined && <p>{ans[i] === q.answer ? 'Correto. ' : 'Incorreto. '}{q.why}</p>}</div>)}</article>
}
