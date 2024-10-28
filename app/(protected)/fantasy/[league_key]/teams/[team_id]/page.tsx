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
import { YahooTeamRoster } from "@/lib/yahoo/types";

export default async function Page({
	params,
}: {
	params: { league_key: string; team_id: string };
}) {
	const yf = await createYahooClient();
	const [err, data] = await attempt(
		yf.team.roster(
			`${params.league_key}.t.${params.team_id}`,
		) as Promise<YahooTeamRoster>,
	);
	if (err) throw new Error("Unable to get roster.");

	return (
		<div className="w-full">
			<h1 className="my-4 text-xl font-bold">{data.name}</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Player</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.roster.map((player) => (
						<TableRow key={player.player_id}>
							<TableCell>{player.name.full}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
