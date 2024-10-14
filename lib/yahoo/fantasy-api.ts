import YahooFantasy from "yahoo-fantasy";

export const createYahooClient = () => {
	const yf = new YahooFantasy(
		process.env.NEXT_YAHOO_APP_KEY!,
		process.env.NEXT_YAHOO_APP_SECRET!,
		// tokenCallbackFn, // optional
		// redirectUri // optional
	);

	return yf;
};

export const getLeagueScoreboard = async (leagueKey: string, week?: number) => {
	const yf = createYahooClient();
	// promise based
	try {
		const scoreboard = await yf.league.scoreboard(leagueKey, week);
		return scoreboard;
	} catch (e) {
		console.log(e);
		return null;
	}
};
