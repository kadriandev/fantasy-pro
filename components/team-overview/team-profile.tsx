"use client";

import { ArrowUpCircle, Trash2 } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "../ui/chart";
import { Radar, RadarChart, PolarAngleAxis, PolarGrid } from "recharts";
import { TeamInsight } from "@/lib/ai/types";

const chartConfig = {
	user: {
		label: "Team",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

interface TeamProfileProps {
	data: any[];
	insights: TeamInsight;
}

export default function TeamProfile({ data, insights }: TeamProfileProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<Card className="col-span-2">
				<CardHeader>
					<CardTitle>Matchup Tips</CardTitle>
					<CardDescription>
						Domainate your matchup with these tips.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{insights?.weekly_matchup_tips.map((t) => (
							<p>{t}</p>
						))}
					</div>
				</CardContent>
			</Card>
			<Card className="col-span-2">
				<CardHeader>
					<CardTitle>Analysis</CardTitle>
					<CardDescription>
						Your team's strengths and weaknesses
					</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-4">
					<ChartContainer
						config={chartConfig}
						className="mx-auto aspect-square max-h-[200px]"
					>
						<RadarChart data={data}>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator="line" />}
								labelFormatter={(label) => `${label} Rank`}
							/>
							<PolarAngleAxis dataKey="stat" />
							<PolarGrid radialLines={false} />
							<Radar
								name="Your Team"
								dataKey="userTeam"
								fill="var(--color-user)"
								fillOpacity={0.4}
								stroke="var(--color-user)"
								strokeWidth={2}
								z={1000}
							/>
						</RadarChart>
					</ChartContainer>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold mb-2">Strong Categories</h3>
							<div className="flex flex-wrap gap-2">
								{insights.strong_categories.map((category) => (
									<Badge
										key={category}
										variant="secondary"
										className="bg-green-100 text-green-800"
									>
										{category.toUpperCase()}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">Weak Categories</h3>
							<div className="flex flex-wrap gap-2">
								{insights.weak_categories.map((category) => (
									<Badge
										key={category}
										variant="secondary"
										className="bg-red-100 text-red-800"
									>
										{category.toUpperCase()}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">Suggested Punt Categories</h3>
							<div className="flex flex-wrap gap-2">
								{insights.suggested_punt_categories.map((category) => (
									<Badge
										key={category}
										variant="secondary"
										className="bg-yellow-100 text-yellow-800"
									>
										{category.toUpperCase()}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="col-span-2 md:col-span-1">
				<CardHeader>
					<CardTitle>AI Trade Insights</CardTitle>
					<CardDescription>
						Potential trades to improve your team
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className="space-y-6">
						{insights.trade_suggestions.map((trade, index) => (
							<li
								key={index}
								className="border-b pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex justify-between mb-2">
									<div>
										<p className="font-medium">Trade Away:</p>
										{trade.trade_away.map((n) => (
											<p key={n} className="text-sm text-muted-foreground">
												{n}
											</p>
										))}
									</div>
									<div className="text-right">
										<p className="font-medium">Target:</p>
										{trade.target_players.map((n) => (
											<p key={n} className="text-sm text-muted-foreground">
												{n}
											</p>
										))}
									</div>
								</div>
								<p className="text-sm">{trade.reasoning}</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
			<Card className="col-span-2 md:col-span-1">
				<CardHeader>
					<CardTitle>Adds / Drops</CardTitle>
					<CardDescription>
						Players to consider adding/dropping from your team
					</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-2">
					<ul className="space-y-2">
						{insights.waiver_wire_targets.map((player, index) => (
							<li key={index} className="flex items-center">
								<ArrowUpCircle className="h-4 w-4 text-green-500 mr-2" />
								<span>{player}</span>
							</li>
						))}
					</ul>
					<ul className="space-y-2">
						{insights.drop_candidates.map((player, index) => (
							<li key={index} className="flex items-center">
								<Trash2 className="h-4 w-4 text-red-500 mr-2" />
								<span>{player}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
