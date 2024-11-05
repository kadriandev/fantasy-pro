import { SupabaseClient } from "@supabase/supabase-js";
import { FantasyStats, YahooLeagueScoreboard } from "./types";
import { createServiceClient } from "../supabase/server";
import { createYahooClient } from ".";

export const getUserLeagues = async (supabase: SupabaseClient) => {
	const { data: user_leagues, error } = await supabase.from("leagues").select();
	return user_leagues;
};

export const insertUserLeagues = async (
	supabase: SupabaseClient,
	leagues: {
		league_key: string;
		name: string;
		num_teams: number;
		game: string;
		url: string;
	}[],
	user_leagues: { league_key: string; team_id: string }[],
) => {
	const service_client = createServiceClient();
	await service_client.from("leagues").upsert(leagues);
	await supabase.from("user_leagues").upsert(user_leagues);
};

const getWeekStatsFromYahoo = async (
	league_key: string,
	week?: string,
): Promise<Array<FantasyStats>> => {
	const yf = await createYahooClient();

	const scoreboard: YahooLeagueScoreboard = await yf.league.scoreboard(
		league_key,
		week,
	);

	const stats = scoreboard.scoreboard.matchups
		.reduce((acc: any[], curr: any) => {
			acc.push(curr.teams);
			return acc;
		}, [])
		.flat()
		.map((s) => {
			const res: FantasyStats = {
				team_id: s.team_id,
				team: s.name,
			};
			s.stats.forEach((r: any) => {
				res[r.stat_id] = r.value;
			});
			return res;
		});
	return stats;
};

export const getUsersTeamId = async (
	supabase: SupabaseClient,
	league_key: string,
) => {
	const { data, error } = await supabase
		.from("user_leagues")
		.select("team_id")
		.eq("league_key", league_key)
		.maybeSingle();
	return data;
};

export const getWeekStats = async (
	supabase: SupabaseClient,
	league_key: string,
	week: string,
): Promise<Array<FantasyStats>> => {
	if (week) {
		const { data, error } = await supabase
			.from("league_stats")
			.select("*")
			.eq("league_key", league_key)
			.eq("week", week);

		const stats = data?.map((t) => {
			const res: FantasyStats = {
				team_id: t.team_id,
				team: t.name,
			};
			t.stats.forEach((s: any) => (res[s.stat_id] = s.value));
			return res;
		});
		return stats!;
	} else {
		return getWeekStatsFromYahoo(league_key, week);
	}
};

export const updateWeekStats = async (league_key: string, week: string) => {
	const supabase = createServiceClient();

	const yf = await createYahooClient();

	const scoreboard: YahooLeagueScoreboard = await yf.league.scoreboard(
		league_key,
		week,
	);

	const teams = scoreboard.scoreboard.matchups.flatMap((m) => m.teams);
	const stats = teams.map((t) => ({
		league_key,
		week,
		team_id: t.team_id,
		name: t.name,
		stats: t.stats,
	}));

	const { count } = await supabase
		.from("league_stats")
		.select("*", { count: "exact", head: true })
		.eq("league_key", league_key)
		.eq("week", week);

	if (count != null && count < stats.length) {
		await supabase.from("league_stats").upsert(stats);
	}
};
