import RefreshLeaguesButton from "@/components/refresh-leagues-button";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { fetchUserLeagues } from "@/lib/yahoo/actions";
import { getUserLeagues } from "@/lib/yahoo/queries";
import Link from "next/link";

export default async function Page() {
	const leagues = await getUserLeagues();
	if (!leagues?.length) await fetchUserLeagues();

	if (!leagues)
		return (
			<div className="flex flex-col">
				<h2>No leagues found.</h2>
				<RefreshLeaguesButton />
			</div>
		);

	return (
		<div>
			<div className="flex">
				<h1 className="text-lg">Leagues</h1>
				<span className="ml-auto">
					<RefreshLeaguesButton />
				</span>
			</div>
			<div className="mt-8 flex gap-4">
				{leagues.map((l) => (
					<Card key={l.league_key}>
						<CardHeader>
							<CardTitle>{l.name}</CardTitle>
							<CardDescription>{l.num_teams} teams</CardDescription>
						</CardHeader>
						{/* <CardContent></CardContent> */}
						<CardFooter className="flex gap-4">
							{l.url && (
								<Link href={l.url} className="flex text-xs items-center">
									<Button variant="outline">Go to Yahoo</Button>
								</Link>
							)}
							<Link href={`/fantasy/${l.league_key}`}>
								<Button variant="default">Go to League</Button>
							</Link>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
