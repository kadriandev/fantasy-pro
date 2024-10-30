import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { YahooGameLeagues } from "@/lib/yahoo/types";
import Link from "next/link";

export default async function Page() {
	const yf = await createYahooClient();
	const [err, data] = await attempt(
		yf.user.game_leagues("nba") as Promise<YahooGameLeagues>,
	);
	if (err) throw new Error();
	const games = data.games;

	return (
		<div>
			{games.map((g) => (
				<div key={g.name}>
					<h2 className="font-semibold text-xl">{g.name}</h2>
					<div className="mt-8 flex gap-4">
						{g.leagues.map((l) => (
							<Card>
								<CardHeader>
									<CardTitle>{l.name}</CardTitle>
									<CardDescription>{l.num_teams} teams</CardDescription>
								</CardHeader>
								<CardContent></CardContent>
								<CardFooter className="flex gap-4">
									<Link href={l.url} className="flex text-xs items-center">
										<Button variant="outline">Go to Yahoo</Button>
									</Link>
									<Link href={`/fantasy/${l.league_key}`}>
										<Button variant="default">Go to League</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
