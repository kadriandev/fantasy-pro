import { SupabaseClient } from "@supabase/supabase-js";
import {
	DBFantasyStats,
	FantasyStats,
	YahooLeagueScoreboard,
	YahooSettingsStatCategory,
} from "./types";
import { createServiceClient } from "../supabase/server";
import { createYahooClient } from ".";
import {
	getStatMapper,
	getWeekStatsFromYahoo,
	groupStatsByWeek,
} from "./utils";
import { Database } from "../supabase/types";

export const getUsersTeamId = async (
	supabase: SupabaseClient<Database>,
	league_key: string,
) => {
	const { data } = await supabase
		.from("user_leagues")
		.select("team_id")
		.eq("league_key", league_key)
		.single();
	return data;
};

export const getUserLeagues = async (supabase: SupabaseClient<Database>) => {
	const { data } = await supabase.from("leagues").select();
	return data;
};

export const getLeagueCurrentWeek = async (
	supabase: SupabaseClient<Database>,
	league_key: string,
) => {
	const { data } = await supabase
		.from("leagues")
		.select("stat_categories")
		.eq("league_key", league_key)
		.single();
};

export const getLeagueStatCategories = async (
	supabase: SupabaseClient<Database>,
	league_key: string,
	options?: { hide_display_only: boolean },
) => {
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
	supabase: SupabaseClient<Database>,
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
	const service_client = createServiceClient();
	await service_client.from("leagues").upsert(leagues);
	await supabase.from("user_leagues").upsert(user_leagues);
};

export const getLeagueStats = async (
	supabase: SupabaseClient<Database>,
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

export const getStatChartData = async (
	supabase: SupabaseClient<Database>,
	league_key: string,
	stat_id: string,
) => {
	const [userTeamId, data] = await Promise.all([
		getUsersTeamId(supabase, league_key),
		supabase.from("league_stats").select("*").eq("league_key", league_key),
	]);
	const statData = groupStatsByWeek(data.data ?? []);

	const res = statData!.map((week, i) => {
		let week_stat_data = week
			.filter((w) => w.team_id !== userTeamId?.team_id?.toString())
			.reduce((acc, curr) => {
				const stat = (
					curr.stats as Array<{
						stat_id: string;
						value: string;
					}>
				).find((s) => s.stat_id === stat_id)!.value;
				return acc + parseFloat(stat);
			}, 0.0);
		let user_stat = week
			.filter((w) => w.team_id === userTeamId?.team_id?.toString())[0]
			.stats.find((s) => s.stat_id === stat_id)!.value;

		return {
			week: i + 1,
			user: user_stat,
			league: week_stat_data / week.length,
		};
	});
	return res;
};

export const getRadarChartData = async (
	supabase: SupabaseClient<Database>,
	league_key: string,
	currentWeek: number,
) => {
	const [userTeamId, cats, data] = await Promise.all([
		getUsersTeamId(supabase, league_key),
		getLeagueStatCategories(supabase, league_key, {
			hide_display_only: true,
		}),
		supabase
			.from("league_stats")
			.select("*")
			.eq("league_key", league_key)
			.gte("week", currentWeek - 2),
	]);
	const statData = groupStatsByWeek(data.data ?? []);

	const statValue = (team: DBFantasyStats, cat: YahooSettingsStatCategory) =>
		parseFloat(
			team.stats.find((s) => s.stat_id === cat.stat_id.toString())!.value,
		);

	return cats.map(function (c) {
		const sortStat = (a: DBFantasyStats, b: DBFantasyStats) =>
			c.sort_order === "1"
				? statValue(a, c) - statValue(b, c)
				: statValue(b, c) - statValue(a, c);

		let lastWeek = statData[0].toSorted(sortStat);
		let thisWeek = statData[1].toSorted(sortStat);

		return {
			stat: c.abbr,
			lastWeek:
				lastWeek.map((t) => t.team_id).indexOf(userTeamId!.team_id!) + 1,
			thisWeek:
				thisWeek.map((t) => t.team_id).indexOf(userTeamId!.team_id!) + 1,
		};
	});
};

export const getWeekStats = async (
	supabase: SupabaseClient<Database>,
	league_key: string,
	week: string,
): Promise<Array<FantasyStats>> => {
	if (week) {
		const { data } = await supabase
			.from("league_stats")
			.select("*")
			.eq("league_key", league_key)
			.eq("week", week);

		const stats = data?.map((t) => {
			const res: FantasyStats = {
				team_id: t.team_id,
				team: t.name!,
			};
			(t.stats as Array<DBFantasyStats>).forEach(
				(s: any) => (res[s.stat_id] = s.value),
			);
			return res;
		});
		return stats!;
	} else {
		return getWeekStatsFromYahoo(league_key, week);
	}
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
