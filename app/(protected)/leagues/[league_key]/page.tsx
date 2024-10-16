import LeagueOverview from "@/components/league-overview";

export default function Page({ params }: { params: { league_key: string } }) {
	return <LeagueOverview league_key={params.league_key} />;
}
