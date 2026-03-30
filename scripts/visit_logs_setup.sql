create table if not exists public.visit_logs (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default timezone('utc', now()),
  guide_page text not null,
  pathname text not null,
  country text,
  region text,
  city text,
  referrer text,
  user_agent text,
  source_fingerprint text
);

alter table public.visit_logs
  add column if not exists source_fingerprint text;

create index if not exists visit_logs_visited_at_idx
  on public.visit_logs (visited_at desc);

create index if not exists visit_logs_country_idx
  on public.visit_logs (country);

create index if not exists visit_logs_source_fingerprint_idx
  on public.visit_logs (source_fingerprint);

create or replace view public.visit_logs_readable as
select
  id,
  visited_at,
  timezone('Europe/Paris', visited_at) as visited_at_paris,
  to_char(
    timezone('Europe/Paris', visited_at),
    'YYYY-MM-DD HH24:MI:SS'
  ) as visited_at_paris_text,
  guide_page,
  pathname,
  country,
  region,
  city,
  source_fingerprint,
  referrer,
  user_agent,
  case
    when user_agent ilike 'vercel-screenshot/%' then true
    else false
  end as is_vercel_screenshot
from public.visit_logs;
