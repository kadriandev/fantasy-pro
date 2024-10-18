import { cookies } from "next/headers";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { createYahooClient } from "@/lib/yahoo";
import { attempt } from "@/lib/utils";
import { LeagueMeta } from "@/lib/yahoo/types";
import Link from "next/link";

type LeagueInfoProps = {
	league_key: string;
};

export default async function LeagueInfo({ league_key }: LeagueInfoProps) {
	const cookieStore = cookies();
	const access_token = cookieStore.get("access_token");
	const yf = createYahooClient(access_token);

	const [err, data] = await attempt(
		yf.league.meta(league_key) as Promise<LeagueMeta>,
	);
	if (err) throw new Error("Unable to get league metadata.");

	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle>League Info</CardTitle>
				<CardDescription>{data.name}</CardDescription>
				<div className="mt-4 border-t py-4 flex flex-col gap-4">
					<Link href={`/leagues/${league_key}`}>Overview</Link>
					<Link href={`/leagues/${league_key}/teams`}>Teams</Link>
				</div>
			</CardHeader>
		</Card>
	);
}
