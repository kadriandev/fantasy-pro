"use server";

import YahooFantasy from "yahoo-fantasy";

const yf = new YahooFantasy(
	process.env.NEXT_YAHOO_CLIENT_ID,
	process.env.NEXT_YAHOO_CLIENT_SECRET,
	null,
	`https://${process.env.NEXT_BASE_URL}/auth/yahoo/callback`,
);

export async function requestAuth() {}

export async function getLeagueData(leagueKey: string) {
	console.log("fetching data");
	try {
		// await new Promise((resolve) =>
		// 	yf.setUserToken(process.env.NEXT_YAHOO_USER_TOKEN, () => resolve(null)),
		// );

		const leagueData = await new Promise((resolve, reject) => {
			yf.league.standings(leagueKey, (err, data) => {
				if (err) reject(err);
				else resolve(data);
			});
		});

		const scoreboard = await new Promise((resolve, reject) => {
			yf.league.scoreboard(leagueKey, (err, data) => {
				if (err) reject(err);
				else resolve(data);
			});
		});

		return { leagueData, scoreboard };
	} catch (error) {
		console.error("Error fetching league data:", error);
		throw new Error("Failed to fetch league data");
	}
}
