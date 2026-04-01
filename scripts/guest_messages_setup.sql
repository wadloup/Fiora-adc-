create table if not exists public.guest_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default timezone('utc', now()),
  nickname text,
  message text not null,
  visitor_key text not null,
  source_fingerprint text,
  country text,
  region text,
  city text,
  user_agent text
);

create index if not exists guest_messages_created_at_idx
  on public.guest_messages (created_at desc);

create index if not exists guest_messages_visitor_key_idx
  on public.guest_messages (visitor_key);

create index if not exists guest_messages_source_fingerprint_idx
  on public.guest_messages (source_fingerprint);

alter table public.guest_messages enable row level security;

drop policy if exists "guest_messages_no_public_select" on public.guest_messages;
drop policy if exists "guest_messages_no_public_insert" on public.guest_messages;
drop policy if exists "guest_messages_no_public_update" on public.guest_messages;
drop policy if exists "guest_messages_no_public_delete" on public.guest_messages;

create policy "guest_messages_no_public_select"
  on public.guest_messages
  for select
  to anon, authenticated
  using (false);

create policy "guest_messages_no_public_insert"
  on public.guest_messages
  for insert
  to anon, authenticated
  with check (false);

create policy "guest_messages_no_public_update"
  on public.guest_messages
  for update
  to anon, authenticated
  using (false);

create policy "guest_messages_no_public_delete"
  on public.guest_messages
  for delete
  to anon, authenticated
  using (false);
