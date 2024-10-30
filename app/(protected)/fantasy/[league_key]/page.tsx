import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { YahooLeagueStandings } from "@/lib/yahoo/types";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export default async function Page({
	params,
}: {
	params: { league_key: string };
}) {
	const yf = await createYahooClient();

	const [err, data] = await attempt(
		yf.league.standings(params.league_key) as Promise<YahooLeagueStandings>,
	);
	if (err) throw new Error("Unable to get league standings.");

	return (
		<>
			<h1 className="py-4 flex text-xl font-bold">Standings</h1>
			<Table className="text-lg">
				<TableHeader>
					<TableRow>
						<TableHead>Rank</TableHead>
						<TableHead>Team</TableHead>
						<TableHead>Manager</TableHead>
						<TableHead>W</TableHead>
						<TableHead>L</TableHead>
						<TableHead>T</TableHead>
						<TableHead>Win %</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.standings.map((team, index) => (
						<TableRow key={team.team_key}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>
								<Link
									href={`/fantasy/${params.league_key}/teams/${team.team_id}`}
									className="flex gap-4 items-center"
								>
									<Avatar>
										<AvatarImage
											className="h-8 w-8 rounded-full"
											src={team.team_logos[0].url}
											alt={`${team.name} logo`}
										/>
									</Avatar>
									{team.name}
								</Link>
							</TableCell>
							<TableCell>{team.managers[0].nickname}</TableCell>
							<TableCell>{team.standings.outcome_totals.wins}</TableCell>
							<TableCell>{team.standings.outcome_totals.losses}</TableCell>
							<TableCell>{team.standings.outcome_totals.ties}</TableCell>
							<TableCell>{team.standings.outcome_totals.percentage}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
