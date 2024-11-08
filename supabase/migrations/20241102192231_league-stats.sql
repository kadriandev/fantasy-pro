
-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing
-- Create leagues table
create table
  public.leagues (
    league_key text not null,
    name text null,
    num_teams integer null,
    game text null,
    url text null,
    stat_categories jsonb null,
    constraint leagues_pkey primary key (league_key)
  ) tablespace pg_default;

alter table public.leagues enable row level security;

-- Create RLS policy for leagu


create policy "Enable insert for authenticated users only" on public.leagues for insert to service_role
with
  check (true);

create policy "Enable update for service_role" on public.leagues
for update
  to service_role using (true);

-- Adjust the condition as needed
-- Enable Row Level Security for the user_leagues table
-- Create user_leagues table
create table
  public.user_leagues (
    user_id uuid not null default auth.uid (),
    league_key text not null,
    team_id text null,
    constraint user_leagues_pkey primary key (user_id, league_key),
    constraint user_leagues_league_id_fkey foreign key (league_key) references public.leagues (league_key),
    constraint user_leagues_user_id_fkey foreign key (user_id) references public.users (id)
  ) tablespace pg_default;

alter table public.user_leagues enable row level security;

create policy "Can select leagues that user is in" on "public"."leagues" for
select
  to authenticated using (
    (
      league_key in (
        select
          user_leagues.league_key
        from
          user_leagues
        where
          (
            user_leagues.user_id = (
              select
                auth.uid () as uid
            )
          )
      )
    )
  );

-- Create RLS policy for user_leagues
create policy "Enable users to view their own data only" on "public"."user_leagues" for
select
  to authenticated using (
    (
      (
        select
          auth.uid () as uid
      ) = user_id
    )
  );

create policy "Enable insert for users based on user_id" on "public"."user_leagues" for insert to authenticated
with
  check (
    (
      (
        select
          auth.uid () as uid
      ) = user_id
    )
  );

create policy "Enable update for users based on user_id" on public.user_leagues
for update
  to authenticated using (
    (
      select
        auth.uid () as uid
    ) = user_id
  )
with
  check (
    (
      (
        select
          auth.uid () as uid
      ) = user_id
    )
  );

-- Create league_stats table
create table
  public.league_stats (
    league_key text not null,
    team_id text not null,
    name text null,
    week integer not null,
    stats jsonb null,
    constraint league_stats_pkey primary key (league_key, team_id, week),
    constraint user_leagues_league_key_fkey foreign key (league_key) references public.leagues (league_key)
  ) tablespace pg_default;

alter table public.league_stats enable row level security;

-- Create RLS policy for league_stats
create policy "Enable insert for service role" on "public"."league_stats" to service_role
with
  check (true);

create policy "Allow user to select stats from their leagues" on "public"."league_stats" to authenticated using (
  (
    (
      select
        auth.uid () as uid
    ) in (
      select
        user_leagues.user_id
      from
        user_leagues
      where (
        (select auth.uid() as uid) = user_id
      )
    )
  )
);

-- Adjust the condition as needed
-- Apply the policies
alter table public.leagues force row level security;

alter table public.user_leagues force row level security;

alter table public.league_stats force row level security;

-- End of migration file
