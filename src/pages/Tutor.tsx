import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Msg = { id?: string; role: 'user' | 'assistant'; content: string }
type Conv = { id: string; title: string }
const MODES = [['explain', 'Explain a Topic'], ['solve', 'Solve a Problem'], ['quiz', 'Quiz Me'], ['summarize', 'Summarize'], ['homework', 'Help With Homework']] as const

export default function Tutor() {
  const [session, setSession] = useState<Session | null>(null); const [ready, setReady] = useState(false)
  const [convs, setConvs] = useState<Conv[]>([]); const [cid, setCid] = useState<string>(''); const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState(''); const [mode, setMode] = useState('explain'); const [lang, setLang] = useState('auto')
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!supabase) { setReady(true); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  const loadConvs = async () => { const { data } = await supabase!.from('conversations').select('id,title').order('updated_at', { ascending: false }); setConvs((data as Conv[]) ?? []) }
  useEffect(() => { if (session) loadConvs() }, [session])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, busy])

  const open = async (id: string) => {
    setCid(id); setErr('')
    const { data, error } = await supabase!.from('messages').select('id,role,content').eq('conversation_id', id).order('created_at')
    if (error) setErr(error.message); else setMsgs(data as Msg[])
  }
  const fresh = () => { setCid(''); setMsgs([]); setErr('') }
  const del = async (id: string) => { if (!confirm('Excluir esta conversa?')) return; await supabase!.from('conversations').delete().eq('id', id); if (id === cid) fresh(); loadConvs() }

  const send = async () => {
    const m = text.trim(); if (!m || busy) return
    setBusy(true); setErr(''); setText(''); setMsgs(x => [...x, { role: 'user', content: m }])
    const { data, error } = await supabase!.functions.invoke('tutor', { body: { conversationId: cid || undefined, message: m, mode, language: lang } })
    if (error || data?.error) {
      let detail = data?.error as string | undefined
      if (!detail && error && 'context' in error) { try { detail = (await (error as any).context.json()).error } catch { /* ignora */ } }
      setErr(detail ?? 'Não foi possível falar com o tutor. A função "tutor" foi publicada?'); setText(m); setMsgs(x => x.slice(0, -1))
    } else { setMsgs(x => [...x, { role: 'assistant', content: data.reply }]); if (!cid) { setCid(data.conversationId); } loadConvs() }
    setBusy(false)
  }

  if (!ready) return <p>Carregando…</p>
  if (!supabase) return <p className="text-amber-400">Configure o Supabase no arquivo .env para usar o Tutor.</p>
  if (!session) return <div><h1 className="text-2xl font-bold mb-2">StudyHub AI Tutor</h1><p className="text-slate-400">Entre na sua conta para conversar com o tutor e salvar seu histórico.</p><Link to="/login" className="inline-block bg-brand rounded px-3 py-1 mt-3">Entrar</Link></div>

  return <div className="grid md:grid-cols-[230px_1fr] gap-4 h-[calc(100vh-3rem)]">
    <aside className="flex flex-col min-h-0">
      <h1 className="text-2xl font-bold mb-2">Tutor IA</h1>
      <button onClick={fresh} className="bg-brand rounded px-3 py-1 mb-2">+ Nova conversa</button>
      <div className="overflow-y-auto max-h-40 md:max-h-none md:flex-1 space-y-1">
        {convs.map(c => <div key={c.id} className={`flex items-center gap-1 bg-card border rounded px-2 py-1 ${c.id === cid ? 'border-brand' : 'border-line'}`}>
          <button onClick={() => open(c.id)} className="flex-1 text-left truncate">{c.title}</button><button aria-label="Excluir conversa" onClick={() => del(c.id)}>✕</button></div>)}
        {!convs.length && <p className="text-slate-500 text-sm">Nenhuma conversa ainda.</p>}</div>
    </aside>
    <section className="flex flex-col min-h-0 bg-card border border-line rounded">
      <div className="flex flex-wrap gap-2 p-3 border-b border-line items-center">
        {MODES.map(([k, l]) => <button key={k} onClick={() => setMode(k)} aria-pressed={mode === k} className={`px-3 py-1 rounded border text-sm ${mode === k ? 'bg-brand border-brand' : 'border-line hover:border-brand'}`}>{l}</button>)}
        <select aria-label="Idioma" value={lang} onChange={e => setLang(e.target.value)} className="ml-auto bg-bg border border-line rounded px-2 py-1 text-sm">
          <option value="auto">Idioma: automático</option><option value="pt">Português</option><option value="en">English</option><option value="both">Bilíngue PT/EN</option></select></div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3" aria-live="polite">
        {!msgs.length && <p className="text-slate-400">Pergunte sobre qualquer matéria do Ensino Médio ou cole um exercício para resolver.</p>}
        {msgs.map((m, i) => <div key={m.id ?? i} className={`max-w-[85%] rounded-lg px-3 py-2 whitespace-pre-wrap break-words ${m.role === 'user' ? 'ml-auto bg-brand' : 'bg-bg border border-line'}`}>{m.content}</div>)}
        {busy && <div className="bg-bg border border-line rounded-lg px-3 py-2 w-fit text-slate-400">Pensando…</div>}
        <div ref={end} /></div>
      {err && <p role="alert" className="text-red-400 text-sm px-3">{err}</p>}
      <div className="p-3 border-t border-line flex gap-2">
        <textarea aria-label="Mensagem" rows={2} value={text} maxLength={4000} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Escreva sua dúvida… (Enter envia, Shift+Enter quebra linha)" className="flex-1 bg-bg border border-line rounded p-2" />
        <button onClick={send} disabled={busy || !text.trim()} className="bg-brand rounded px-4 disabled:opacity-50">Enviar</button></div>
    </section>
  </div>
}
