import { CategoryRadarChart } from "@/components/category-radar-chart";
import { StatsChart } from "@/components/stats-chart";
import { createClient } from "@/lib/supabase/server";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import {
	getLeagueStatCategories,
	getRadarChartData,
	getStatChartData,
} from "@/lib/yahoo/queries";
import { YahooLeagueSettings } from "@/lib/yahoo/types";

export interface OverviewPageProps {
	params: { league_key: string };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
	const supabase = createClient();
	const yf = createYahooClient();

	const settings_promise: Promise<YahooLeagueSettings> = yf.league.settings(
		params.league_key,
	);
	const promises = Promise.all([
		settings_promise,
		getLeagueStatCategories(supabase, params.league_key, {
			hide_display_only: true,
		}),
	]);
	const [err, data] = await attempt(promises);
	if (err) throw new Error("Error getting settings and stat categories");
	const [settings, stat_categories] = data;

	const [radarChartData, ...cat_stats] = await Promise.all([
		getRadarChartData(supabase, params.league_key, settings.current_week),
		...stat_categories.map(async (cat) => {
			const data = await getStatChartData(
				supabase,
				params.league_key,
				cat.stat_id + "",
			);
			return { name: cat.name, abbr: cat.abbr, data: data };
		}),
	]);

	return (
		<>
			<h1 className="py-4 flex text-xl font-bold">Overview</h1>
			<div className="mt-6 grid grid-cols-3 gap-4">
				<CategoryRadarChart data={radarChartData} />
				{cat_stats.map((s) => (
					<StatsChart key={s.abbr} name={s.abbr} desc={s.name} data={s.data} />
				))}
			</div>
		</>
	);
}
