"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function LeagueStandings({ leagueData }: { leagueData: any }) {
	return (
		<div className="text-xs">
			<Card>
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
							{leagueData.standings.leagueData.standings.map(
								(team: any, index: number) => (
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
								),
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
