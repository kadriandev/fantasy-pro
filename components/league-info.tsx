"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type LeagueInfoProps = {
	leagueData: any;
};

export default function LeagueInfo({ leagueData }: LeagueInfoProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>League Info</CardTitle>
				<CardDescription>{leagueData.league.name}</CardDescription>
				<div className="grid grid-cols-2">
					<p></p>
				</div>
			</CardHeader>
		</Card>
	);
}
