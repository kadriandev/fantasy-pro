import LeagueInfo from "@/components/league-info";
import { ReactNode } from "react";

export default async function Layout({
	children,
	params,
}: { children: ReactNode; params: { league_key: string } }) {
	return (
		<div className="mt-4 grid grid-cols-[1fr,5fr] gap-8">
			<LeagueInfo league_key={params.league_key} />
			<div className="">{children}</div>
		</div>
	);
}
