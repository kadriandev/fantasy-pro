-- Create leagues table
CREATE TABLE
  public.leagues (
    league_key TEXT NOT NULL,
    NAME TEXT NULL,
    num_teams INTEGER NULL,
    game TEXT NULL,
    url TEXT NULL,
    CONSTRAINT leagues_pkey PRIMARY KEY (league_key)
  ) TABLESPACE pg_default;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for leagues
CREATE POLICY leagues_select_policy ON public.leagues FOR
SELECT
  USING (TRUE);

create policy "Can select leagues that user is in" on "public"."leagues"
for select as permissive to authenticated using (
  (league_key IN (
      SELECT user_leagues.league_key
      FROM user_leagues
      WHERE (
        user_leagues.user_id = ( SELECT auth.uid() AS uid)
      ))));

create policy "Enable insert for authenticated users only" on "public"."leagues"
for insert as permissive to service_role with check (true);

create policy "Enable update for service_role" on "public"."leagues"
for update as permissive to service_role using (true);

-- Adjust the condition as needed
-- Enable Row Level Security for the user_leagues table

-- Create user_leagues table
CREATE TABLE
  public.user_leagues (
    user_id UUID NOT NULL DEFAULT auth.uid (),
    league_key TEXT NOT NULL,
    team_id TEXT NULL,
    CONSTRAINT user_leagues_pkey PRIMARY KEY (user_id, league_key),
    CONSTRAINT user_leagues_league_id_fkey FOREIGN KEY (league_key) REFERENCES public.leagues (league_key),
    CONSTRAINT user_leagues_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
  ) TABLESPACE pg_default;
ALTER TABLE public.user_leagues ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for user_leagues
create policy "Enable users to view their own data only" on "public"."user_leagues"
for select as permissive to authenticated using (
  (( SELECT auth.uid() AS uid) = user_id));

create policy "Enable insert for users based on user_id" on "public"."user_leagues"
for insert to authenticated with check (
  (( SELECT auth.uid() AS uid) = user_id));

alter policy "Enable update for users based on user_id" on "public"."user_leagues"
for update to authenticated using (
  ( SELECT auth.uid() AS uid) = user_id
) with check (
  (( SELECT auth.uid() AS uid) = user_id)
);

-- Create league_stats table
CREATE TABLE
  public.league_stats (
    league_key TEXT NOT NULL,
    team_id TEXT NOT NULL,
    NAME TEXT NULL,
    week INTEGER NOT NULL,
    stats jsonb NULL,
    CONSTRAINT league_stats_pkey PRIMARY KEY (league_key, team_id, week),
    CONSTRAINT user_leagues_league_key_fkey FOREIGN KEY (league_key) REFERENCES public.leagues (league_key)
  ) TABLESPACE pg_default;
ALTER TABLE public.league_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for league_stats
create policy "Enable insert for service role" on "public"."league_stats"
to service_role with check (true);

create policy "Allow user to select stats from their leagues" on "public"."league_stats"
to authenticated using (((
  SELECT auth.uid() AS uid) IN ( SELECT user_leagues.user_id
  FROM user_leagues
  WHERE (user_leagues.league_key = user_leagues.league_key)))
);

-- Adjust the condition as needed
-- Apply the policies
ALTER TABLE public.leagues FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_leagues FORCE ROW LEVEL SECURITY;
ALTER TABLE public.league_stats FORCE ROW LEVEL SECURITY;

-- End of migration file
