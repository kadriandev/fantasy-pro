import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { cookies } from "next/headers";

class LeagueError extends Error {
	name = "LeagueError";
	message = "Unable to get league data.";
	stack = undefined;
}

export default async function LeagueListPage() {
	const cookieStore = cookies();
	let access_token = cookieStore.get("access_token");

	const yf = createYahooClient(access_token);
	const [err, games] = await attempt(
		yf.user.game_leagues("nba") as Promise<any>,
	);
	if (err) throw new LeagueError();

	const leagueData = games.games[0];
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
			{leagueData?.leagues.map((league: any) => (
				<Link key={league.league_key} href={`/leagues/${league.league_key}`}>
					<Card className="flex flex-col hover:bg-white/20">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								{league.name}
							</CardTitle>
							<CardDescription>
								Week {league.current_week}/{league.end_week}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow">
							<div className="grid grid-cols-2">
								<p>Season</p>
								<p>{league.season}</p>

								<p>Teams</p>
								<p>{league.num_teams}</p>
							</div>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
