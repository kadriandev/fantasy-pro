"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

const chartConfig = {
	user: {
		label: "You",
		color: "hsl(var(--chart-1))",
	},
	league: {
		label: "League Avg.",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export interface StatsChartProps {
	name: string;
	data: any[];
	desc?: string;
}

export function StatsChart({ name, data, desc }: StatsChartProps) {
	const isPercent = data[0].user.startsWith(".");
	return (
		<Card>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
				{desc && <CardDescription>{desc}</CardDescription>}
			</CardHeader>
			<CardContent className="px-4">
				<ChartContainer config={chartConfig}>
					<LineChart
						width={20}
						height={20}
						accessibilityLayer
						data={data}
						margin={{
							left: 20,
							right: 10,
						}}
					>
						<CartesianGrid vertical={false} />
						<YAxis
							type="number"
							hide
							domain={
								isPercent
									? [
											data[0].league - data[0].league * 0.15,
											data[0].league + data[0].league * 0.25,
										]
									: [
											Math.floor(data[0].league - data[0].league * 0.75),
											Math.ceil(data[0].league + data[0].league * 0.75),
										]
							}
						/>
						<XAxis
							dataKey="week"
							tickLine={true}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => "Week " + value}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey="user"
							type="natural"
							stroke="var(--color-user)"
							strokeWidth={2}
							dot={true}
						/>
						<Line
							dataKey="league"
							type="natural"
							stroke="var(--color-league)"
							strokeWidth={2}
							dot={true}
							strokeDasharray={"10 10 10"}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
