import LeagueListPage from "@/components/league-list";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { Loader2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

class LeagueError extends Error {
	name = "LeagueError";
	message = "Unable to get league data.";
	stack = undefined;
}

export default async function Page() {
	const cookieStore = cookies();
	let access_token = cookieStore.get("access_token");

	const yf = createYahooClient(access_token);
	const [err, games] = await attempt(
		yf.user.game_leagues("nba") as Promise<any>,
	);
	if (err) throw new LeagueError();

	const leagueData = games.games[0];

	return (
		<Suspense fallback={}>
			<LeagueListPage />
		</Suspense>
	);
}
