import DataTable from "@/components/data-table";
import FantasyWeekSelect from "@/components/fantasy-week-select";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import {
	YahooLeagueScoreboard,
	YahooLeagueSettings,
	YahooUserGameTeams,
} from "@/lib/yahoo/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ColumnDef } from "@tanstack/react-table";
import {
	createSearchParamsCache,
	parseAsString,
	type SearchParams,
} from "nuqs/server";

type FantasyStats = {
	team: string;
	[key: string]: string;
};

type PageProps = {
	params: { league_key: string };
	searchParams: Promise<SearchParams>; // Next.js 15+: async searchParams prop
};

const searchParamsCache = createSearchParamsCache({
	week: parseAsString.withDefault(""),
});

export default async function StatsPage({ params, searchParams }: PageProps) {
	const { week } = searchParamsCache.parse(await searchParams);
	const yf = await createYahooClient();

	const teams_promise: Promise<YahooUserGameTeams> = yf.user.game_teams(
		params.league_key,
	);
	const settings_promise: Promise<YahooLeagueSettings> = yf.league.settings(
		params.league_key,
	);
	const scoreboard_promise: Promise<YahooLeagueScoreboard> =
		yf.league.scoreboard(params.league_key, week);

	const promises = Promise.all([
		teams_promise,
		settings_promise,
		scoreboard_promise,
	]);

	const [err, res] = await attempt(promises);
	if (err) throw new Error("Error getting settings and scoreboard data");
	const [teams, settings, scoreboard] = res;

	const userTeam = teams.teams
		.flatMap((t) => t.teams)
		.find((t) => t.team_key.startsWith(params.league_key));

	const columns: ColumnDef<FantasyStats>[] = [
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

	const data = scoreboard.scoreboard.matchups
		.reduce((acc: any[], curr: any) => {
			acc.push(curr.teams);
			return acc;
		}, [])
		.flat()
		.map((s) => {
			const res: any = {};
			s.stats.forEach((r: any) => {
				res["team"] = s.name;
				res[r.stat_id] = r.value;
			});
			return res;
		});

	const weeks: string[] = Array.from(
		{ length: +settings.current_week },
		(x, i) => i + 1 + "",
	);

	return (
		<>
			<h1 className="py-4 flex text-xl font-bold">
				Stats
				<span className="ml-auto">
					<FantasyWeekSelect weeks={weeks} />
				</span>
			</h1>
			<ScrollArea className="h-[900px]">
				<DataTable
					teamName={userTeam?.name ?? ""}
					columns={columns}
					data={data}
				/>
			</ScrollArea>
		</>
	);
}
