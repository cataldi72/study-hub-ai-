import { useState } from 'react'
import { supabase } from '../lib/supabase'
export default function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [msg, setMsg] = useState('')
  if (!supabase) return <p className="text-amber-400">Configure o Supabase no arquivo .env para ativar o login.</p>
  const sign = async (up: boolean) => { const { error } = up ? await supabase!.auth.signUp({ email, password: pw }) : await supabase!.auth.signInWithPassword({ email, password: pw }); setMsg(error ? error.message : up ? 'Confira seu e-mail para confirmar.' : 'Login feito.') }
  return <div className="max-w-sm space-y-2"><h1 className="text-2xl font-bold">Entrar</h1>
    <input aria-label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-card border border-line rounded p-2" />
    <input aria-label="Senha" type="password" value={pw} onChange={e => setPw(e.target.value)} className="w-full bg-card border border-line rounded p-2" />
    <div className="flex gap-2"><button onClick={() => sign(false)} className="bg-brand rounded px-3 py-1">Entrar</button><button onClick={() => sign(true)}>Criar conta</button><button onClick={() => supabase!.auth.signOut()}>Sair</button></div><p role="status">{msg}</p></div>
}
