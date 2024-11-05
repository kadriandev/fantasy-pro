import { CategoryRadarChart } from "@/components/category-radar-chart";
import { StatsChart } from "@/components/stats-chart";
import { createClient } from "@/lib/supabase/server";
import {
	getLeagueStatCategories,
	getRadarChartData,
	getStatChartData,
} from "@/lib/yahoo/queries";
import { YahooSettingsStatCategory } from "@/lib/yahoo/types";

const chartData = [
	{ stat: "FG%", lastWeek: 186, thisWeek: 160 },
	{ stat: "FT%", lastWeek: 185, thisWeek: 170 },
	{ stat: "PTS", lastWeek: 207, thisWeek: 180 },
	{ stat: "REB", lastWeek: 173, thisWeek: 160 },
	{ stat: "AST", lastWeek: 160, thisWeek: 190 },
	{ stat: "STL", lastWeek: 174, thisWeek: 204 },
	{ stat: "BLK", lastWeek: 174, thisWeek: 204 },
	{ stat: "TO", lastWeek: 174, thisWeek: 204 },
];

export interface OverviewPageProps {
	params: { league_key: string };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
	const supabase = createClient();
	const stat_categories = await getLeagueStatCategories(
		supabase,
		params.league_key,
	);
	const counting_stat_cats: YahooSettingsStatCategory[] =
		stat_categories.filter((e: any) => !e.abbr.includes("/"));

	const cat_stats = await Promise.all(
		counting_stat_cats.map(async (cat) => {
			const data = await getStatChartData(
				supabase,
				params.league_key,
				cat.stat_id + "",
			);
			return { name: cat.name, abbr: cat.abbr, data: data };
		}),
	);

	const radarChartData = await getRadarChartData(
		supabase,
		params.league_key,
		3,
	);

	return (
		<>
			<h1 className="py-4 flex text-xl font-bold">Overview</h1>
			<div className="grid grid-cols-3 gap-4">
				<CategoryRadarChart data={radarChartData} />
				{cat_stats.map((s) => (
					<StatsChart key={s.abbr} name={s.abbr} desc={s.name} data={s.data} />
				))}
			</div>
		</>
	);
}
