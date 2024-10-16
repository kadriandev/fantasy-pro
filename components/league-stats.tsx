"use client";

import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LeagueStats({ leagueData }: { leagueData: any }) {
	return (
		<div className="container mx-auto">
			<ScrollArea className="h-[700px]">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="sticky left-0 bg-background">
								Team
							</TableHead>
							{leagueData.stats.categories.map(
								(category: any, index: number) => (
									<TableHead key={index} className="text-xs">
										{category.abbr}
									</TableHead>
								),
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{leagueData.stats.stats.map((team: any) => (
							<TableRow key={team.team_key}>
								<TableCell className="sticky left-0 bg-background font-medium">
									{team.name}
								</TableCell>
								{leagueData.stats.stats.map(
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
