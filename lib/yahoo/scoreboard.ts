import { createYahooClient } from ".";

export const getLeagueScoreboard = async (
	access_token: string,
	leagueKey: string,
	week?: number,
) => {
	const yf = createYahooClient();
	yf.setUserToken(access_token);

	try {
		const scoreboard = await yf.league.scoreboard(leagueKey, week);
		return scoreboard;
	} catch (e) {
		console.log(e);
		return null;
	}
};
