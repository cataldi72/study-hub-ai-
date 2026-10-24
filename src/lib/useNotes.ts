import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'
export type Note = { id: string; title: string; body: string; subject: string|null; pinned: boolean; favorite: boolean; updated_at: string }
const KEY = 'studyhub-notes'
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true)
    if (supabase) { const { data, error } = await supabase.from('notes').select('*').order('updated_at', { ascending: false }); if (error) setError(error.message); else setNotes(data as Note[]) }
    else setNotes(JSON.parse(localStorage.getItem(KEY) || '[]'))
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])
  const persistLocal = (n: Note[]) => { setNotes(n); localStorage.setItem(KEY, JSON.stringify(n)) }
  const add = async () => { const base = { title: 'Nova nota', body: '', subject: null, pinned: false, favorite: false }
    if (supabase) { const { error } = await supabase.from('notes').insert(base); if (error) setError(error.message); else load() }
    else persistLocal([{ ...base, id: crypto.randomUUID(), updated_at: new Date().toISOString() }, ...notes]) }
  const update = async (id: string, patch: Partial<Note>) => { const p = { ...patch, updated_at: new Date().toISOString() }
    setNotes(ns => ns.map(n => n.id === id ? { ...n, ...p } : n))
    if (supabase) { const { error } = await supabase.from('notes').update(p).eq('id', id); if (error) setError(error.message) }
    else persistLocal(notes.map(n => n.id === id ? { ...n, ...p } : n)) }
  const remove = async (id: string) => { if (supabase) { await supabase.from('notes').delete().eq('id', id); load() } else persistLocal(notes.filter(n => n.id !== id)) }
  return { notes, loading, error, add, update, remove }
}
