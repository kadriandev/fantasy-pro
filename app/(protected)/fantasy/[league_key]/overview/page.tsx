import { CategoryRadarChart } from "@/components/category-radar-chart";
import { StatsChart } from "@/components/stats-chart";
import { fetchAndSaveLeagueStats, getUsersTeamId } from "@/lib/yahoo/queries";
import { processRadarChartData, processStatChartData } from "./charts";

export interface OverviewPageProps {
	params: { league_key: string };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
	const userTeamId = await getUsersTeamId(params.league_key);
	const { cats, stats } = await fetchAndSaveLeagueStats(params.league_key);

	const radarChartData = processRadarChartData(userTeamId!, cats, stats ?? []);
	const statChartData = processStatChartData(userTeamId!, cats, stats ?? []);

	return (
		<>
			<h1 className="py-4 flex text-xl font-bold">Overview</h1>
			<div className="mt-6 grid grid-cols-3 gap-4">
				<CategoryRadarChart data={radarChartData} />
				{statChartData.map((s) => (
					<StatsChart
						key={s.stat_id}
						name={s.abbr}
						desc={s.name}
						data={s.data}
					/>
				))}
			</div>
		</>
	);
}
