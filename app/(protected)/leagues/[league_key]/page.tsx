import LeagueStandings from "@/components/league-standings";
import LeagueStats from "@/components/league-stats";

export default async function Page({
	params,
}: { params: { league_key: string } }) {
	return (
		<div className="w-full">
			<h1 className="py-4 text-xl font-bold">Overview</h1>
			<div className="grid grid-cols-[4fr,1fr] gap-4">
				<LeagueStats league_key={params.league_key} />
				<LeagueStandings league_key={params.league_key} />
			</div>
		</div>
	);
}
