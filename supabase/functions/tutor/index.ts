// Edge Function "tutor": valida o usuário, grava a conversa e chama a API de IA (compatível com OpenAI) no servidor.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Content-Type': 'application/json' }
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: cors })

const BASE = `Você é o StudyHub AI Tutor, tutor de Ensino Médio (matemática, física, química, biologia, anatomia, história, geografia, inglês, gramática e redação).
Regras: use linguagem simples e adapte o nível ao aluno; explique passo a passo; em matemática mostre cada cálculo e o raciocínio de forma organizada; não invente fatos nem resultados, e diga quando não tiver certeza; em tarefas escolares, ensine o caminho em vez de só entregar a resposta final; recuse conteúdo fora do contexto de estudos de forma gentil.`
const MODES: Record<string, string> = {
  explain: 'Modo Explain a Topic: explique o conteúdo com definição, intuição, exemplo e um mini-resumo.',
  solve: 'Modo Solve a Problem: resolva o exercício em passos numerados, justifique cada passo e confira o resultado no final.',
  quiz: 'Modo Quiz Me: faça UMA pergunta por vez (múltipla escolha ou aberta), espere a resposta do aluno, corrija e explique antes de continuar.',
  summarize: 'Modo Summarize: resuma o conteúdo em tópicos curtos, com termos-chave e fórmulas importantes.',
  homework: 'Modo Help With Homework: guie o aluno com dicas e perguntas, revele a solução completa apenas se ele pedir ou após tentar.',
}
const LANGS: Record<string, string> = { auto: 'Responda no idioma em que o aluno escreveu.', pt: 'Responda em português do Brasil.', en: 'Reply in English.', both: 'Responda em português e depois repita a explicação em inglês (bilíngue), com a tradução dos termos-chave.' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const key = Deno.env.get('OPENAI_API_KEY')
    if (!key) return json({ error: 'IA não configurada: defina o secret OPENAI_API_KEY.' }, 503)
    const auth = req.headers.get('Authorization') ?? ''
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
    const { data: u } = await sb.auth.getUser()
    if (!u?.user) return json({ error: 'Faça login para usar o tutor.' }, 401)

    const { conversationId, message, mode = 'explain', language = 'auto' } = await req.json()
    const text = String(message ?? '').trim()
    if (!text || text.length > 4000) return json({ error: 'Mensagem vazia ou maior que 4000 caracteres.' }, 400)

    let cid = conversationId as string | undefined
    if (cid) {
      const { data } = await sb.from('conversations').select('id').eq('id', cid).maybeSingle() // RLS: só do próprio usuário
      if (!data) return json({ error: 'Conversa não encontrada.' }, 404)
    } else {
      const { data, error } = await sb.from('conversations').insert({ title: text.slice(0, 60), mode }).select('id').single()
      if (error) return json({ error: error.message }, 500)
      cid = data.id
    }
    const ins = await sb.from('messages').insert({ conversation_id: cid, role: 'user', content: text })
    if (ins.error) return json({ error: ins.error.message }, 500)

    const { data: hist } = await sb.from('messages').select('role,content').eq('conversation_id', cid).order('created_at', { ascending: false }).limit(20)
    const msgs = (hist ?? []).reverse()

    const base = (Deno.env.get('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/$/, '')
    const r = await fetch(`${base}/chat/completions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini', temperature: 0.3, max_tokens: 1500,
        messages: [{ role: 'system', content: `${BASE}\n${MODES[mode] ?? MODES.explain}\n${LANGS[language] ?? LANGS.auto}` }, ...msgs] }),
    })
    if (!r.ok) return json({ error: `Falha no provedor de IA (${r.status}).` }, 502)
    const reply = (await r.json()).choices?.[0]?.message?.content?.trim()
    if (!reply) return json({ error: 'A IA não retornou resposta.' }, 502)

    await sb.from('messages').insert({ conversation_id: cid, role: 'assistant', content: reply })
    await sb.from('conversations').update({ updated_at: new Date().toISOString(), mode }).eq('id', cid)
    return json({ conversationId: cid, reply })
  } catch (e) {
    return json({ error: 'Erro interno: ' + (e as Error).message }, 500)
  }
})
