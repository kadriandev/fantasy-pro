"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LeaguesList() {
	const [leagueData, setLeagueData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchLeagues = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/leagues").then((res) => res.json());
				setLeagueData(response);
			} catch (e) {
				setError(new Error("Unable to get leagues."));
			}

			setLoading(false);
		};

		fetchLeagues();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				Error:{" "}
				{error instanceof Error ? error.message : "An unknown error occurred"}
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
			{leagueData?.leagues.map((league: any) => (
				<Link key={league.league_key} href={`/leagues/${league.league_key}`}>
					<Card className="flex flex-col hover:bg-white/20">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								{league.name}
							</CardTitle>
							<CardDescription>
								Week {league.current_week}/{league.end_week}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow">
							<div className="grid grid-cols-2">
								<p>Season</p>
								<p>{league.season}</p>

								<p>Teams</p>
								<p>{league.num_teams}</p>
							</div>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
