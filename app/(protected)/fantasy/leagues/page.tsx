import LeagueListPage from "@/components/league-list";
import MissingYahooAuthPage from "@/components/missing-yahoo-auth";
import { Suspense } from "react";

export default async function Page() {
	return (
		<Suspense fallback={<MissingYahooAuthPage />}>
			<LeagueListPage />
		</Suspense>
	);
}
