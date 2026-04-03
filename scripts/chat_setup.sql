create table if not exists public.chat_threads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  thread_token text not null unique,
  visitor_key text not null,
  source_fingerprint text,
  nickname text,
  contact text,
  country text,
  region text,
  city text,
  user_agent text,
  status text not null default 'open',
  last_message_preview text,
  last_visitor_message_at timestamptz,
  last_admin_message_at timestamptz
);

create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  thread_id bigint not null references public.chat_threads(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  author text not null,
  content text not null,
  constraint chat_messages_author_check check (author in ('visitor', 'admin'))
);

create index if not exists chat_threads_updated_at_idx
  on public.chat_threads (updated_at desc);

create index if not exists chat_threads_thread_token_idx
  on public.chat_threads (thread_token);

create index if not exists chat_threads_visitor_key_idx
  on public.chat_threads (visitor_key);

create index if not exists chat_threads_source_fingerprint_idx
  on public.chat_threads (source_fingerprint);

create index if not exists chat_messages_thread_id_idx
  on public.chat_messages (thread_id);

create index if not exists chat_messages_created_at_idx
  on public.chat_messages (created_at desc);

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_threads_no_public_select" on public.chat_threads;
drop policy if exists "chat_threads_no_public_insert" on public.chat_threads;
drop policy if exists "chat_threads_no_public_update" on public.chat_threads;
drop policy if exists "chat_threads_no_public_delete" on public.chat_threads;

drop policy if exists "chat_messages_no_public_select" on public.chat_messages;
drop policy if exists "chat_messages_no_public_insert" on public.chat_messages;
drop policy if exists "chat_messages_no_public_update" on public.chat_messages;
drop policy if exists "chat_messages_no_public_delete" on public.chat_messages;

create policy "chat_threads_no_public_select"
  on public.chat_threads
  for select
  to anon, authenticated
  using (false);

create policy "chat_threads_no_public_insert"
  on public.chat_threads
  for insert
  to anon, authenticated
  with check (false);

create policy "chat_threads_no_public_update"
  on public.chat_threads
  for update
  to anon, authenticated
  using (false);

create policy "chat_threads_no_public_delete"
  on public.chat_threads
  for delete
  to anon, authenticated
  using (false);

create policy "chat_messages_no_public_select"
  on public.chat_messages
  for select
  to anon, authenticated
  using (false);

create policy "chat_messages_no_public_insert"
  on public.chat_messages
  for insert
  to anon, authenticated
  with check (false);

create policy "chat_messages_no_public_update"
  on public.chat_messages
  for update
  to anon, authenticated
  using (false);

create policy "chat_messages_no_public_delete"
  on public.chat_messages
  for delete
  to anon, authenticated
  using (false);
