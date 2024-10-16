"use client";

import { useState, useEffect } from "react";
import LeagueInfo from "./league-info";
import LeagueStandings from "./league-standings";
import LeagueStats from "./league-stats";

function fetchLeagueInfo(league_key): Promise<any> {
	return fetch(`/api/league?league_key=${league_key}`).then((res) =>
		res.json(),
	);
}

function fetchStats(league_key): Promise<any> {
	return fetch(`/api/stats?league_key=${league_key}`).then((res) => res.json());
}

function fetchStandings(league_key): Promise<any> {
	return fetch(`/api/scoreboard?league_key=${league_key}`).then((res) =>
		res.json(),
	);
}

type LeagueData = {
	league: any;
	stats: any;
	standings: any;
};

export default function LeagueOverview({ league_key }: { league_key: string }) {
	const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const [league, stats, standings] = await Promise.all([
					fetchLeagueInfo(league_key),
					fetchStats(league_key),
					fetchStandings(league_key),
				]);

				console.log({ league, stats, standings });
				setLeagueData({ league, stats, standings });
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

	if (error || !leagueData) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="my-4 grid grid-cols-[1fr,3fr,1fr] gap-2 items-start">
			<LeagueInfo leagueData={leagueData} />
			<LeagueStats leagueData={leagueData} />
			<LeagueStandings leagueData={leagueData} />
		</div>
	);
}
