import type {
  DBFantasyStats,
  YahooLeagueScoreboard,
  YahooSettingsStatCategory,
} from "./types";
import { createClient, createServiceClient } from "../supabase/server";
import { createYahooClient } from ".";
import { getNewInsight } from "../ai/queries";
import { TeamInsight } from "../ai/types";

const fetchDataForNewWeek = async (
  league_key: string,
  team_key: string,
  week: number,
  unsavedWeeks: number,
) => {
  const supabase = createClient();
  const yf = createYahooClient();

  const weeksToFetch = Array(unsavedWeeks)
    .fill(week ?? 0)
    .map((x, i) => x + i + 1)
    .join(",");

  console.log(weeksToFetch);

  const scoreboard: YahooLeagueScoreboard = await yf.league.scoreboard(
    league_key,
    weeksToFetch,
  );
  console.log(scoreboard);

  const teams = scoreboard.scoreboard.matchups.flatMap((m) => m.teams);
  const stats = teams.map((t) => ({
    league_key,
    week: +t.points.week,
    team_id: t.team_id,
    name: t.name,
    stats: t.stats,
  }));
  console.log("stats", stats);
  await supabase.from("league_stats").insert(stats);

  const insight: TeamInsight = await getNewInsight(league_key, team_key);
  await supabase
    .from("user_leagues")
    .update({
      last_insight: new Date().toISOString(),
      team_insights: JSON.stringify(insight),
    })
    .eq("league_key", league_key);
};

export const getUsersTeamId = async (league_key: string) => {
  const supabase = createClient();
  return supabase
    .from("user_leagues")
    .select("team_id")
    .eq("league_key", league_key)
    .single()
    .then((data) => data.data?.team_id as string);
};

export const getUserLeagues = async () => {
  const supabase = createClient();
  const { data } = await supabase.from("leagues").select();
  return data;
};

export const insertUserLeagues = async (
  leagues: {
    league_key: string;
    name: string;
    num_teams: number;
    game: string;
    url: string;
    stat_categories: Array<YahooSettingsStatCategory>;
  }[],
  user_leagues: { league_key: string; team_id: string }[],
) => {
  const supabase = createClient();
  const service_client = createServiceClient();
  await service_client.from("leagues").upsert(leagues);
  await supabase.from("user_leagues").upsert(user_leagues);
};

export const fetchAndSaveLeagueStats = async (
  league_key: string,
  team_key: string,
) => {
  const supabase = createClient();
  const yf = createYahooClient();

  const [settings, data] = await Promise.all([
    yf.league.settings(league_key),
    supabase
      .from("league_stats")
      .select("week")
      .eq("league_key", league_key)
      .order("week", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Fetch and save last week if it doesnt exist
  const unsavedWeeks = settings.current_week - (data.data?.week ?? 0) - 1;
  if (data.data === null || unsavedWeeks) {
    await fetchDataForNewWeek(
      league_key,
      team_key,
      data.data?.week ?? 0,
      unsavedWeeks,
    );
  }

  const [cats, stats, insights] = await Promise.all([
    supabase
      .from("leagues")
      .select("stat_categories")
      .eq("league_key", league_key)
      .single()
      .then((res) => res.data?.stat_categories),
    supabase
      .from("league_stats")
      .select("*")
      .eq("league_key", league_key)
      .then((res) => res.data),
    supabase
      .from("user_leagues")
      .select("team_insights")
      .eq("league_key", league_key)
      .single()
      .then((res) => JSON.parse(res.data?.team_insights as string)),
  ]);

  return {
    current_week: settings.current_week as number,
    cats: cats as YahooSettingsStatCategory[],
    stats: stats as DBFantasyStats[],
    insights: insights,
  };
};
