# StudyHub AI
1. `npm install`
2. Crie um projeto no Supabase, rode `supabase-schema.sql` no SQL Editor e copie `.env.example` para `.env` com URL e chave anon.
3. `npm run dev` (ou `npm run build` e hospede a pasta `dist` na Vercel/Netlify).
Sem .env o caderno usa localStorage e o aviso aparece na tela.

## StudyHub AI Tutor (aba "Tutor IA")
1. Rode `supabase/migrations/002_tutor.sql` no SQL Editor (depois do `supabase-schema.sql`).
2. Instale a CLI do Supabase, faça `supabase link --project-ref SEU_REF` e publique: `supabase functions deploy tutor`.
3. Defina os secrets (nunca no frontend): `supabase secrets set OPENAI_API_KEY=sk-... OPENAI_MODEL=gpt-4o-mini`
   Opcional, para outro provedor compatível: `OPENAI_BASE_URL=https://.../v1`.
`SUPABASE_URL` e `SUPABASE_ANON_KEY` já são injetados na função pelo Supabase.
