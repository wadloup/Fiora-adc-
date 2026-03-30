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
  source_fingerprint text,
  dedupe_key text
);

alter table public.visit_logs
  add column if not exists source_fingerprint text;

alter table public.visit_logs
  add column if not exists dedupe_key text;

create index if not exists visit_logs_visited_at_idx
  on public.visit_logs (visited_at desc);

create index if not exists visit_logs_country_idx
  on public.visit_logs (country);

create index if not exists visit_logs_source_fingerprint_idx
  on public.visit_logs (source_fingerprint);

create index if not exists visit_logs_dedupe_key_idx
  on public.visit_logs (dedupe_key);

drop view if exists public.visit_logs_grouped;
drop view if exists public.visit_logs_readable;

create or replace view public.visit_logs_readable as
select
  id,
  country,
  region,
  city,
  guide_page,
  pathname,
  visited_at,
  timezone('Europe/Paris', visited_at) as visited_at_paris,
  to_char(
    timezone('Europe/Paris', visited_at),
    'YYYY-MM-DD HH24:MI:SS'
  ) as visited_at_paris_text,
  source_fingerprint,
  dedupe_key,
  referrer,
  user_agent,
  case
    when user_agent ilike 'vercel-screenshot/%' then true
    else false
  end as is_vercel_screenshot
from public.visit_logs;

create or replace view public.visit_logs_grouped as
with normalized as (
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
    dedupe_key,
    referrer,
    user_agent,
    case
      when user_agent ilike 'vercel-screenshot/%' then true
      else false
    end as is_vercel_screenshot,
    coalesce(
      source_fingerprint,
      md5(
        coalesce(user_agent, 'unknown') || '|' ||
        coalesce(country, '') || '|' ||
        coalesce(region, '') || '|' ||
        coalesce(city, '')
      )
    ) as visitor_key
  from public.visit_logs
), aggregated as (
  select
    visitor_key,
    max(source_fingerprint) as source_fingerprint,
    max(dedupe_key) as dedupe_key,
    count(*) as visit_count,
    min(visited_at) as first_seen_utc,
    to_char(
      timezone('Europe/Paris', min(visited_at)),
      'YYYY-MM-DD HH24:MI:SS'
    ) as first_seen_paris_text,
    max(visited_at) as last_seen_utc,
    to_char(
      timezone('Europe/Paris', max(visited_at)),
      'YYYY-MM-DD HH24:MI:SS'
    ) as last_seen_paris_text,
    (array_agg(country order by visited_at desc))[1] as latest_country,
    (array_agg(region order by visited_at desc))[1] as latest_region,
    (array_agg(city order by visited_at desc))[1] as latest_city,
    (array_agg(guide_page order by visited_at desc))[1] as latest_guide_page,
    (array_agg(pathname order by visited_at desc))[1] as latest_pathname,
    (array_agg(user_agent order by visited_at desc))[1] as latest_user_agent,
    bool_or(is_vercel_screenshot) as has_vercel_screenshot,
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'visited_at_utc', visited_at,
        'visited_at_paris', visited_at_paris_text,
        'guide_page', guide_page,
        'pathname', pathname,
        'country', country,
        'region', region,
        'city', city,
        'source_fingerprint', source_fingerprint,
        'dedupe_key', dedupe_key,
        'referrer', referrer,
        'user_agent', user_agent,
        'is_vercel_screenshot', is_vercel_screenshot
      )
      order by visited_at desc
    ) as visit_history
  from normalized
  group by visitor_key
)
select
  latest_country,
  latest_region,
  latest_city,
  latest_guide_page,
  latest_pathname,
  visitor_key,
  source_fingerprint,
  dedupe_key,
  visit_count,
  first_seen_utc,
  first_seen_paris_text,
  last_seen_utc,
  last_seen_paris_text,
  latest_user_agent,
  has_vercel_screenshot,
  visit_history
from aggregated;
