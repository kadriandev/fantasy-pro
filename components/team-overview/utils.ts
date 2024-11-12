import { YahooSettingsStatCategory, DBFantasyStats } from "@/lib/yahoo/types";

export const groupStatsByWeek = (
	data: Array<DBFantasyStats>,
): Array<Array<DBFantasyStats>> => {
	return data
		.reduce((acc: Array<Array<DBFantasyStats>>, curr) => {
			if (!acc[curr.week - 1]) acc[curr.week - 1] = [];
			acc[curr.week - 1].push(curr);
			return acc;
		}, [])
		.reverse();
};

export const processTeams = (userTeamId: string, stats: any[]) => {
	const statData = groupStatsByWeek(stats);
	return statData[0].filter((t) => t.team_id !== userTeamId).map((t) => t.name);
};

export const processStatChartData = (
	userTeamId: string,
	categories: YahooSettingsStatCategory[],
	stats: any[],
	compareToTeam: string,
) => {
	const statData = groupStatsByWeek(stats);

	return categories
		.filter((c) => !c.is_only_display_stat)
		.map((c) => {
			let data = statData!.map((week) => {
				let week_stat_data = week.reduce((acc, curr) => {
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

				if (compareToTeam !== "league") {
					let comparison_stat = week
						.filter((w) => w.name === compareToTeam)[0]
						.stats.find((s) => s.stat_id === c.stat_id.toString())!.value;
					return {
						week: week[0].week,
						user: user_stat,
						comparison: comparison_stat,
					};
				} else {
					const leagueAvg = (week_stat_data / week.length).toFixed(3);
					return {
						week: week[0].week,
						user: user_stat,
						comparison: leagueAvg.startsWith("0.")
							? leagueAvg.slice(1)
							: leagueAvg,
					};
				}
			});

			return {
				stat_id: c.stat_id,
				abbr: c.abbr,
				name: c.name,
				data: data.sort((a, b) => a.week - b.week),
			};
		});
};

export const processRadarChartData = (
	userTeamId: string,
	categories: YahooSettingsStatCategory[],
	stats: any[],
	compareToTeam: string,
) => {
	const statData = groupStatsByWeek(stats);

	const statValue = (team: DBFantasyStats, cat: YahooSettingsStatCategory) =>
		parseFloat(
			team.stats.find((s) => s.stat_id === cat.stat_id.toString())!.value,
		);

	return categories
		.filter((c) => !c.is_only_display_stat)
		.map(function (c) {
			const sortStat = (a: DBFantasyStats, b: DBFantasyStats) =>
				c.sort_order === "1"
					? statValue(a, c) - statValue(b, c)
					: statValue(b, c) - statValue(a, c);

			let thisWeek = [...statData[0]].sort(sortStat);
			let compareWeek = [...statData[1]].sort(sortStat);

			if (compareToTeam === "league")
				return {
					stat: c.abbr,
					userTeam: thisWeek.map((t) => t.team_id).indexOf(userTeamId) + 1,
					compareTeam:
						compareWeek.map((t) => t.team_id).indexOf(userTeamId) + 1,
				};
			else {
				return {
					stat: c.abbr,
					userTeam: thisWeek.map((t) => t.team_id).indexOf(userTeamId) + 1,
					compareTeam: thisWeek.map((t) => t.name).indexOf(compareToTeam) + 1,
				};
			}
		});
};
