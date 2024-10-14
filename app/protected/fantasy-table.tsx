"use client";

import { useState, useEffect } from "react";
import { getLeagueData } from "@/lib/actions/fantasy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FantasyBasketballLeague() {
	const [leagueData, setLeagueData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const data = await getLeagueData("nba.l.109997"); // Replace with your league key
				setLeagueData(data);
			} catch (err) {
				// setError(err.message);
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
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Fantasy Basketball League</h1>
			<Card>
				<CardHeader>
					<CardTitle>{leagueData.leagueData.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="standings">
						<TabsList>
							<TabsTrigger value="standings">Standings</TabsTrigger>
							<TabsTrigger value="weekly">Weekly Results</TabsTrigger>
						</TabsList>
						<TabsContent value="standings">
							<Table>
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
									{leagueData.leagueData.standings.map((team, index) => (
										<TableRow key={team.team_key}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>{team.name}</TableCell>
											<TableCell>{team.number_of_moves}</TableCell>
											<TableCell>{team.number_of_trades}</TableCell>
											<TableCell>
												{team.clinched_playoffs ? "Yes" : "No"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TabsContent>
						<TabsContent value="weekly">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Week</TableHead>
										<TableHead>Home Team</TableHead>
										<TableHead>Score</TableHead>
										<TableHead>Away Team</TableHead>
										<TableHead>Score</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{leagueData.scoreboard.matchups.map((matchup, index) => (
										<TableRow key={index}>
											<TableCell>{matchup.week}</TableCell>
											<TableCell>{matchup.teams[0].name}</TableCell>
											<TableCell>{matchup.teams[0].points.total}</TableCell>
											<TableCell>{matchup.teams[1].name}</TableCell>
											<TableCell>{matchup.teams[1].points.total}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
