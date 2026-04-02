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
  dedupe_key text,
  visit_token text,
  duration_seconds integer not null default 0
);

alter table public.visit_logs
  add column if not exists source_fingerprint text;

alter table public.visit_logs
  add column if not exists dedupe_key text;

alter table public.visit_logs
  add column if not exists visit_token text;

alter table public.visit_logs
  add column if not exists duration_seconds integer not null default 0;

create index if not exists visit_logs_visited_at_idx
  on public.visit_logs (visited_at desc);

create index if not exists visit_logs_country_idx
  on public.visit_logs (country);

create index if not exists visit_logs_source_fingerprint_idx
  on public.visit_logs (source_fingerprint);

create index if not exists visit_logs_dedupe_key_idx
  on public.visit_logs (dedupe_key);

create index if not exists visit_logs_visit_token_idx
  on public.visit_logs (visit_token);

create unique index if not exists visit_logs_visit_token_uidx
  on public.visit_logs (visit_token)
  where visit_token is not null;

drop view if exists public.visit_logs_grouped;
drop view if exists public.visit_logs_readable;
drop view if exists public.visit_logs_human_source;

create or replace view public.visit_logs_human_source as
select *
from public.visit_logs
where coalesce(user_agent, '') !~* '(vercel-screenshot|headlesschrome|bytespider|facebookexternalhit|discordbot|telegrambot|googlebot|bingbot|crawler|spider|lighthouse|playwright|puppeteer|selenium|wget|curl)';

create or replace view public.visit_logs_readable as
select
  timezone('Europe/Paris', visited_at) as visited_at_paris,
  to_char(
    timezone('Europe/Paris', visited_at),
    'YYYY-MM-DD HH24:MI:SS'
  ) as visited_at_paris_text,
  coalesce(duration_seconds, 0) as duration_seconds,
  case
    when coalesce(duration_seconds, 0) >= 3600 then
      floor(coalesce(duration_seconds, 0) / 3600.0)::int::text || 'h ' ||
      lpad(((coalesce(duration_seconds, 0) % 3600) / 60)::int::text, 2, '0') || 'm'
    when coalesce(duration_seconds, 0) >= 60 then
      floor(coalesce(duration_seconds, 0) / 60.0)::int::text || 'm ' ||
      lpad((coalesce(duration_seconds, 0) % 60)::int::text, 2, '0') || 's'
    else
      coalesce(duration_seconds, 0)::text || 's'
  end as duration_text,
  id,
  country,
  region,
  city,
  guide_page,
  pathname,
  referrer,
  user_agent,
  case
    when user_agent ilike 'vercel-screenshot/%' then true
    else false
  end as is_vercel_screenshot,
  source_fingerprint,
  dedupe_key,
  visit_token
from public.visit_logs_human_source
order by visited_at desc;

create or replace view public.visit_logs_grouped as
with normalized as (
  select
    id,
    visited_at,
    coalesce(duration_seconds, 0) as duration_seconds,
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
    visit_token,
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
  from public.visit_logs_human_source
), aggregated as (
  select
    visitor_key,
    max(source_fingerprint) as source_fingerprint,
    max(dedupe_key) as dedupe_key,
    count(*) as visit_count,
    max(visited_at) as last_seen_at,
    timezone('Europe/Paris', min(visited_at)) as first_seen_at_paris,
    to_char(
      timezone('Europe/Paris', min(visited_at)),
      'YYYY-MM-DD HH24:MI:SS'
    ) as first_seen_paris_text,
    timezone('Europe/Paris', max(visited_at)) as last_seen_at_paris,
    to_char(
      timezone('Europe/Paris', max(visited_at)),
      'YYYY-MM-DD HH24:MI:SS'
    ) as last_seen_paris_text,
    coalesce(sum(duration_seconds), 0) as total_duration_seconds,
    (array_agg(duration_seconds order by visited_at desc))[1] as latest_duration_seconds,
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
        'visited_at_paris', visited_at_paris_text,
        'duration_seconds', duration_seconds,
        'duration_text',
          case
            when duration_seconds >= 3600 then
              floor(duration_seconds / 3600.0)::int::text || 'h ' ||
              lpad(((duration_seconds % 3600) / 60)::int::text, 2, '0') || 'm'
            when duration_seconds >= 60 then
              floor(duration_seconds / 60.0)::int::text || 'm ' ||
              lpad((duration_seconds % 60)::int::text, 2, '0') || 's'
            else
              duration_seconds::text || 's'
          end,
        'guide_page', guide_page,
        'pathname', pathname,
        'country', country,
        'region', region,
        'city', city,
        'source_fingerprint', source_fingerprint,
        'dedupe_key', dedupe_key,
        'referrer', referrer,
        'user_agent', user_agent,
        'visit_token', visit_token,
        'is_vercel_screenshot', is_vercel_screenshot
      )
      order by visited_at desc
    ) as visit_history
  from normalized
  group by visitor_key
)
select
  last_seen_at_paris,
  last_seen_paris_text,
  first_seen_at_paris,
  first_seen_paris_text,
  total_duration_seconds,
  case
    when total_duration_seconds >= 3600 then
      floor(total_duration_seconds / 3600.0)::int::text || 'h ' ||
      lpad(((total_duration_seconds % 3600) / 60)::int::text, 2, '0') || 'm'
    when total_duration_seconds >= 60 then
      floor(total_duration_seconds / 60.0)::int::text || 'm ' ||
      lpad((total_duration_seconds % 60)::int::text, 2, '0') || 's'
    else
      total_duration_seconds::text || 's'
  end as total_duration_text,
  latest_duration_seconds,
  case
    when latest_duration_seconds >= 3600 then
      floor(latest_duration_seconds / 3600.0)::int::text || 'h ' ||
      lpad(((latest_duration_seconds % 3600) / 60)::int::text, 2, '0') || 'm'
    when latest_duration_seconds >= 60 then
      floor(latest_duration_seconds / 60.0)::int::text || 'm ' ||
      lpad((latest_duration_seconds % 60)::int::text, 2, '0') || 's'
    else
      latest_duration_seconds::text || 's'
  end as latest_duration_text,
  latest_country,
  latest_region,
  latest_city,
  latest_guide_page,
  latest_pathname,
  visit_count,
  latest_user_agent,
  has_vercel_screenshot,
  visit_history,
  visitor_key,
  source_fingerprint,
  dedupe_key
from aggregated
order by last_seen_at_paris desc;
