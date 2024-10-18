import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { YahooStandings } from "@/lib/yahoo/types";
import { cookies } from "next/headers";

export default async function LeagueStandings({
	league_key,
}: { league_key: string }) {
	const cookieStore = cookies();
	const access_token = cookieStore.get("access_token");
	const yf = createYahooClient(access_token);

	const [err, data] = await attempt(
		yf.league.standings(league_key) as Promise<YahooStandings>,
	);
	if (err) throw new Error("Unable to get league standings.");

	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle>Standings</CardTitle>
			</CardHeader>
			<CardContent>
				<Table className="text-xs">
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Team</TableHead>
							<TableHead>W</TableHead>
							<TableHead>L</TableHead>
							<TableHead>T</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.standings.map((team, index) => (
							<TableRow key={team.team_key}>
								<TableCell className="py-2">{index + 1}</TableCell>
								<TableCell className="py-2">{team.name}</TableCell>
								<TableCell className="py-2">
									{team.standings.outcome_totals.wins}
								</TableCell>
								<TableCell className="py-2">
									{team.standings.outcome_totals.losses}
								</TableCell>
								<TableCell className="py-2">
									{team.standings.outcome_totals.ties}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
