create table if not exists public.visit_logs (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default timezone('utc', now()),
  guide_page text not null,
  pathname text not null,
  country text,
  region text,
  city text,
  referrer text,
  user_agent text
);

create index if not exists visit_logs_visited_at_idx
  on public.visit_logs (visited_at desc);

create index if not exists visit_logs_country_idx
  on public.visit_logs (country);
