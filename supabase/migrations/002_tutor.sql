-- StudyHub AI Tutor: conversas e mensagens privadas por usuário
create table conversations (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null default 'Nova conversa', mode text not null default 'explain', created_at timestamptz default now(), updated_at timestamptz default now());
create table messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references conversations on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade, role text not null check (role in ('user','assistant')),
  content text not null check (char_length(content) <= 20000), created_at timestamptz default now());
create index on messages (conversation_id, created_at);
alter table conversations enable row level security; alter table messages enable row level security;
create policy "own conversations" on conversations for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own messages" on messages for all
  using (user_id = auth.uid() and exists (select 1 from conversations c where c.id = conversation_id and c.user_id = auth.uid()))
  with check (user_id = auth.uid() and exists (select 1 from conversations c where c.id = conversation_id and c.user_id = auth.uid()));
