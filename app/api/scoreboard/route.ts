import { cookies } from "next/headers";
import { createYahooClient } from "@/lib/yahoo";
import { refreshToken } from "@/lib/yahoo/auth";

export async function GET(request: Request) {
	const cookieStore = cookies();
	let access_token = cookieStore.get("access_token");
	let refresh_token = cookieStore.get("refresh_token");

	const { searchParams } = new URL(request.url);
	const league_key = searchParams.get("league_key");

	if (!access_token) {
		const res = await refreshToken(refresh_token?.value ?? "");
		cookieStore.set("access_token", res.access_token, {
			expires: res.expires_in,
			httpOnly: true,
		});
		cookieStore.set("refresh_token", res.refresh_token, {
			httpOnly: true,
		});

		access_token = {
			name: "access_token",
			value: res.access_token ?? "",
		};
	}

	const yf = createYahooClient();
	yf.setUserToken(access_token?.value);

	try {
		const [leagueData, scoreboard] = await Promise.all([
			yf.league.standings(league_key),
			yf.league.scoreboard(league_key),
		]);

		return Response.json({ leagueData, scoreboard });
	} catch (e) {
		console.log(e);
		return null;
	}
}