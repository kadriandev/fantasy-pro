"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LeagueStatsTable({
	league_key,
}: { league_key: string }) {
	const [leagueStats, setLeagueStats] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const data = await fetch(`/api/stats?league_key=${league_key}`).then(
					(res) => res.json(),
				); // Replace with your league key

				setLeagueStats(data);
			} catch (err) {
				// setError(err?.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="container mx-auto">
			<ScrollArea className="h-[700px]">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="sticky left-0 bg-background">
								Team
							</TableHead>
							{leagueStats.categories.map((category: any, index: number) => (
								<TableHead key={index} className="text-xs">
									{category.abbr}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{leagueStats.stats.map((team: any) => (
							<TableRow key={team.team_key}>
								<TableCell className="sticky left-0 bg-background font-medium">
									{team.name}
								</TableCell>
								{leagueStats.stats.map(
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
