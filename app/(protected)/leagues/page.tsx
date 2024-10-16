import LeaguesList from "@/components/leagues-list";

export default function Page() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Your Leagues</h1>
			<LeaguesList />
		</div>
	);
}
