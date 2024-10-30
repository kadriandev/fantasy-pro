"use client";

import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";

interface FantasyWeekSelectProps {
	league_key: string;
	weeks: string[];
}

export default function FantasyWeekSelect(props: FantasyWeekSelectProps) {
	const { league_key, weeks } = props;

	const router = useRouter();
	const [week, _] = useQueryState("week");

	const selectWeek = (week: string) => {
		if (week === "current") router.replace(`/fantasy/${league_key}/stats`);
		else router.replace(`/fantasy/${league_key}/stats?week=${week}`);
	};

	return (
		<Select value={week ?? "current"} onValueChange={selectWeek}>
			<SelectTrigger>
				<SelectValue placeholder="Current Week" />
			</SelectTrigger>
			<SelectContent>
				{weeks.toReversed().map((week, i) => (
					<SelectItem key={week} value={i === 0 ? "current" : week}>
						{i === 0 ? "Current Week" : `Week ${week}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
