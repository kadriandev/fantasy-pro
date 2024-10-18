import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cookies } from "next/headers";
import { createYahooClient } from "@/lib/yahoo";
import { attempt } from "@/lib/utils";

export default async function LeagueStats({
	league_key,
}: { league_key: string }) {
	const cookieStore = cookies();
	const access_token = cookieStore.get("access_token");

	const yf = createYahooClient(access_token);
	const [err, [settings, scoreboard]] = await attempt(
		Promise.all([
			yf.league.settings(league_key),
			yf.league.scoreboard(league_key),
		]),
	);
	if (err) throw new Error("Error getting settings and scoreboard data");

	const stats = scoreboard.scoreboard.matchups
		.reduce((acc: any[], curr: any) => {
			acc.push(curr.teams);
			return acc;
		}, [])
		.flat();

	return (
		<div className="">
			<ScrollArea className="h-[900px]">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="sticky left-0 bg-background">
								Team
							</TableHead>
							{settings.settings.stat_categories.map(
								(category: any, index: number) => (
									<TableHead key={index} className="text-xs">
										{category.abbr}
									</TableHead>
								),
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{stats.map((team: any) => (
							<TableRow key={team.team_key}>
								<TableCell className="sticky left-0 bg-background font-medium">
									{team.name}
								</TableCell>
								{stats.map(
									(stat: { stat_id: string; value: string }, index: number) => {
										return (
											<TableCell key={index}>
												{stat ? stat.value : "N/A"}
											</TableCell>
										);
									},
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</div>
	);
}
