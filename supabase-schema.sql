-- Rode no SQL Editor do Supabase
create table notes (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null default '', body text not null default '', subject text, pinned boolean default false, favorite boolean default false, updated_at timestamptz default now());
create table progress (user_id uuid not null default auth.uid() references auth.users on delete cascade, topic_id text not null, done boolean default false, favorite boolean default false, primary key (user_id, topic_id));
create table tasks (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users on delete cascade, title text not null, due date, done boolean default false);
create table attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users on delete cascade, question_id text not null, answer int, correct boolean, created_at timestamptz default now());
alter table notes enable row level security; alter table progress enable row level security; alter table tasks enable row level security; alter table attempts enable row level security;
create policy "own notes" on notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own progress" on progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own tasks" on tasks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own attempts" on attempts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
