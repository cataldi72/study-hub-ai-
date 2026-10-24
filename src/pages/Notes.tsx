import { useState } from 'react'
import { useNotes } from '../lib/useNotes'
import { hasSupabase } from '../lib/supabase'
export default function Notes() {
  const { notes, loading, error, add, update, remove } = useNotes(); const [sel, setSel] = useState<string>(''); const [q, setQ] = useState('')
  const list = notes.filter(n => (n.title + n.body).toLowerCase().includes(q.toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned))
  const n = notes.find(x => x.id === sel) ?? list[0]
  return <div className="grid md:grid-cols-[260px_1fr] gap-4">
    <div><h1 className="text-2xl font-bold">Caderno</h1>
      {!hasSupabase && <p className="text-amber-400 text-sm my-2">Supabase não configurado: notas salvas só neste navegador.</p>}
      {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
      <button onClick={add} className="bg-brand rounded px-3 py-1 my-2">+ Nova nota</button>
      <input aria-label="Buscar" placeholder="Buscar" value={q} onChange={e => setQ(e.target.value)} className="w-full bg-card border border-line rounded px-2 py-1 mb-2" />
      {loading ? <p>Carregando…</p> : list.map(x => <button key={x.id} onClick={() => setSel(x.id)} className="block w-full text-left bg-card border border-line rounded p-2 mb-1">{x.pinned && '📌 '}{x.favorite && '★ '}{x.title || 'Sem título'}</button>)}</div>
    {n && <div className="bg-card border border-line rounded p-4">
      <input aria-label="Título" value={n.title} onChange={e => update(n.id, { title: e.target.value })} className="w-full bg-transparent text-xl font-bold mb-2" />
      <div className="flex gap-2 mb-2"><button onClick={() => update(n.id, { pinned: !n.pinned })}>{n.pinned ? 'Desafixar' : 'Fixar'}</button><button onClick={() => update(n.id, { favorite: !n.favorite })}>{n.favorite ? '★' : '☆'}</button><button onClick={() => confirm('Excluir?') && remove(n.id)}>Excluir</button></div>
      <textarea aria-label="Texto" rows={16} value={n.body} onChange={e => update(n.id, { body: e.target.value })} className="w-full bg-bg border border-line rounded p-2" /></div>}
  </div>
}
