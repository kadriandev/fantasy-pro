

ALTER TABLE public.user_leagues
ADD COLUMN team_insights jsonb NULL,
ADD COLUMN last_insight timestamp null
