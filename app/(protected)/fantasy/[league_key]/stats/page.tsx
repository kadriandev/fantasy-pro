import DataTable from "@/components/data-table";
import FantasyWeekSelect from "@/components/fantasy-week-select";
import { createClient } from "@/lib/supabase/server";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import {
	getUsersTeamId,
	getWeekStats,
	updateWeekStats,
} from "@/lib/yahoo/queries";
import { YahooLeagueSettings, YahooUserGameTeams } from "@/lib/yahoo/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
	createSearchParamsCache,
	parseAsString,
	type SearchParams,
} from "nuqs/server";
import { createStatTableColumns } from "./columns";

type PageProps = {
	params: { league_key: string };
	searchParams: Promise<SearchParams>; // Next.js 15+: async searchParams prop
};

const searchParamsCache = createSearchParamsCache({
	week: parseAsString.withDefault(""),
});

export default async function StatsPage({ params, searchParams }: PageProps) {
	const { week } = searchParamsCache.parse(await searchParams);

	const supabase = createClient();
	const yf = await createYahooClient();

	const settings_promise: Promise<YahooLeagueSettings> = yf.league.settings(
		params.league_key,
	);
	const stats_promise = getWeekStats(supabase, params.league_key, week);
	const team_id_promise = getUsersTeamId(supabase, params.league_key);

	const promises = Promise.all([
		settings_promise,
		stats_promise,
		team_id_promise,
	]);

	const [err, res] = await attempt(promises);
	if (err) throw new Error("Error getting settings and stats data");
	const [settings, stats, team_id] = res;

	if (week) {
		await updateWeekStats(params.league_key, week);
	}

	const columns = createStatTableColumns(settings);

	const weeks: string[] = Array.from(
		{ length: +settings.current_week },
		(_, i) => i + 1 + "",
	);

	return (
		<>
			<h1 className="py-4 flex text-xl font-bold">
				Stats
				<span className="ml-auto">
					<FantasyWeekSelect league_key={params.league_key} weeks={weeks} />
				</span>
			</h1>
			<ScrollArea className="h-[900px]">
				<DataTable teamId={team_id?.team_id} columns={columns} data={stats} />
			</ScrollArea>
		</>
	);
}
