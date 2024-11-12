import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface TeamSelectorProps {
	teams: string[];
	team: string;
	onTeamChange: Dispatch<SetStateAction<string>>;
}

export default function TeamSelector({
	teams,
	team,
	onTeamChange,
}: TeamSelectorProps) {
	return (
		<Select value={team} onValueChange={(v) => onTeamChange(v)}>
			<SelectTrigger>
				<SelectValue defaultValue={"league"} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={"league"}>Rest of League</SelectItem>
				{teams.map((t) => (
					<SelectItem key={t} value={t}>
						{t}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
