import { FantasyStats, YahooLeagueSettings } from "@/lib/yahoo/types";
import { ColumnDef } from "@tanstack/react-table";

export const createStatTableColumns = (settings: YahooLeagueSettings) => {
	const columns: ColumnDef<FantasyStats>[] = [
		{
			header: "Team ID",
			accessorKey: "team_id",
			enableSorting: false,
			enableHiding: true,
		},
		{ header: "Team", accessorKey: "team", enableSorting: false },
	];

	columns.push(
		...settings.settings.stat_categories.map(
			(cat): ColumnDef<FantasyStats> => ({
				header: cat.abbr,
				accessorKey: cat.stat_id + "",
				sortingFn: "alphanumeric",
				enableSorting: true,
				sortDescFirst: true,
			}),
		),
	);

	return columns;
};
