"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	user: {
		label: "User Team",
		color: "hsl(var(--chart-1))",
	},
	comparison: {
		label: "Comparison",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

interface CategoryRadarChartProps {
	data: { stat: string; userTeam: number; compareTeam: number }[];
	comparison?: string;
}

export function CategoryRadarChart({
	data,
	comparison,
}: CategoryRadarChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
			</CardHeader>
			<CardContent className="m-2 p-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
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
						{comparison && (
							<Radar
								name={comparison === "league" ? "Last Week" : comparison}
								dataKey="compareTeam"
								fill="var(--color-comparison)"
								fillOpacity={0.4}
								stroke="var(--color-comparison)"
								strokeWidth={2}
							/>
						)}
					</RadarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
