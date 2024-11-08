import type { SupabaseClient as SBClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/types";
import type {
	DBFantasyStats,
	FantasyStats,
	YahooLeagueScoreboard,
	YahooSettingsStatCategory,
} from "./types";
import { createClient, createServiceClient } from "../supabase/server";
import { createYahooClient } from ".";
import { getStatMapper } from "./utils";

type SupabaseClient = SBClient<Database>;

export const getUsersTeamId = async (league_key: string) => {
	const supabase = createClient();
	return supabase
		.from("user_leagues")
		.select("team_id")
		.eq("league_key", league_key)
		.single()
		.then((data) => data.data?.team_id);
};

export const getUserLeagues = async () => {
	const supabase = createClient();
	const { data } = await supabase.from("leagues").select();
	return data;
};

export const getLeagueStatCategories = async (
	league_key: string,
	options?: { hide_display_only: boolean },
) => {
	const supabase = createClient();
	const { data } = await supabase
		.from("leagues")
		.select("stat_categories")
		.eq("league_key", league_key)
		.single();

	let cats = data?.stat_categories as Array<YahooSettingsStatCategory>;
	if (options && options.hide_display_only) {
		cats = cats.filter((c) => !c.is_only_display_stat);
	}
	return cats;
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

export const getLeagueStats = async (
	supabase: SupabaseClient,
	league_key: string,
): Promise<Array<FantasyStats>> => {
	const statMapper = await getStatMapper(supabase, league_key);
	const { data } = await supabase
		.from("league_stats")
		.select("*")
		.eq("league_key", league_key);

	const stats = data?.map((t) => {
		const res: FantasyStats = {
			team_id: t.team_id,
			team: t.name!,
			week: t.week + "",
		};
		(t.stats as { stat_id: string; value: string }[]).forEach(
			(s: any) => (res[statMapper.get(s.stat_id)?.abbr ?? s.stat_id] = s.value),
		);
		return res;
	});

	return stats!;
};

export const updateWeekStats = async (league_key: string, week: string) => {
	const supabase = createServiceClient();
	const yf = createYahooClient();

	const scoreboard: YahooLeagueScoreboard = await yf.league.scoreboard(
		league_key,
		week,
	);

	const teams = scoreboard.scoreboard.matchups.flatMap((m) => m.teams);
	const stats = teams.map((t) => ({
		league_key,
		week: +week,
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

export const fetchAndSaveLeagueStats = async (league_key: string) => {
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

	// Save last week if it doesnt exist
	const unsavedWeeks = settings.current_week - (data.data?.week ?? 0) - 1;
	if (data.data === null || unsavedWeeks) {
		const weeksToFetch = Array(unsavedWeeks)
			.fill(unsavedWeeks)
			.map((x) => x + 1)
			.join(",");
		const scoreboard: YahooLeagueScoreboard = await yf.league.scoreboard(
			league_key,
			weeksToFetch,
		);

		const teams = scoreboard.scoreboard.matchups.flatMap((m) => m.teams);
		const stats = teams.map((t) => ({
			league_key,
			week: +t.points.week,
			team_id: t.team_id,
			name: t.name,
			stats: t.stats,
		}));

		await supabase.from("league_stats").insert(stats);
	}

	const [cats, stats] = await Promise.all([
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
	]);

	return {
		current_week: settings.current_week as number,
		cats: cats as YahooSettingsStatCategory[],
		stats: stats as DBFantasyStats[],
	};
};
