import { getUsersTeamId, getLeagueStatCategories } from "@/lib/yahoo/queries";
import { DBFantasyStats, YahooSettingsStatCategory } from "@/lib/yahoo/types";
import { groupStatsByWeek } from "@/lib/yahoo/utils";

export const processRadarChartData = (
	userTeamId: string,
	categories: YahooSettingsStatCategory[],
	stats: any[],
) => {
	const statData = groupStatsByWeek(stats);

	const statValue = (team: DBFantasyStats, cat: YahooSettingsStatCategory) =>
		parseFloat(
			team.stats.find((s) => s.stat_id === cat.stat_id.toString())!.value,
		);

	return categories.map(function (c) {
		const sortStat = (a: DBFantasyStats, b: DBFantasyStats) =>
			c.sort_order === "1"
				? statValue(a, c) - statValue(b, c)
				: statValue(b, c) - statValue(a, c);

		let lastWeek = [...statData[0]].sort(sortStat);
		let thisWeek = [...statData[1]].sort(sortStat);

		return {
			stat: c.abbr,
			lastWeek: lastWeek.map((t) => t.team_id).indexOf(userTeamId) + 1,
			thisWeek: thisWeek.map((t) => t.team_id).indexOf(userTeamId) + 1,
		};
	});
};

export const processStatChartData = (
	userTeamId: string,
	categories: YahooSettingsStatCategory[],
	stats: any[],
) => {
	const statData = groupStatsByWeek(stats);
	return categories
		.filter((c) => !c.is_only_display_stat)
		.map((c) => {
			let data = statData!.map((week, i) => {
				let week_stat_data = week
					.filter((w) => w.team_id !== userTeamId)
					.reduce((acc, curr) => {
						const stat = (
							curr.stats as Array<{
								stat_id: string;
								value: string;
							}>
						).find((s) => s.stat_id === c.stat_id.toString())!.value;
						return acc + parseFloat(stat);
					}, 0.0);

				let user_stat = week
					.filter((w) => w.team_id === userTeamId)[0]
					.stats.find((s) => s.stat_id === c.stat_id.toString())!.value;

				return {
					week: i + 1,
					user: user_stat,
					league: week_stat_data / week.length,
				};
			});

			return {
				stat_id: c.stat_id,
				abbr: c.abbr,
				name: c.name,
				data: data,
			};
		});
};
