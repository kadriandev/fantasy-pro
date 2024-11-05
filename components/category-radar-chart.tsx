"use client";

import { TrendingUp } from "lucide-react";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface CategoryRadarChartProps {
	data: { stat: string; lastWeek: number; thisWeek: number }[];
}

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "hsl(var(--chart-1))",
	},
	mobile: {
		label: "Mobile",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function CategoryRadarChart({ data }: CategoryRadarChartProps) {
	return (
		<Card>
			<CardHeader className="items-center pb-4">
				<CardTitle>Team Profile</CardTitle>
			</CardHeader>
			<CardContent className="pb-0">
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
							name="Last Week"
							dataKey="thisWeek"
							fill="var(--color-desktop)"
							fillOpacity={0}
							stroke="var(--color-desktop)"
							strokeWidth={2}
						/>
						<Radar
							name="2 Weeks Ago"
							dataKey="lastWeek"
							fill="var(--color-mobile)"
							fillOpacity={0}
							stroke="var(--color-mobile)"
							strokeWidth={2}
						/>
					</RadarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
