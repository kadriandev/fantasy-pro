import { FantasyStats, YahooLeagueScoreboard } from "@/lib/yahoo/types";

export function processCurrentWeekStats(scoreboard: YahooLeagueScoreboard) {
	return scoreboard.scoreboard.matchups
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
}
