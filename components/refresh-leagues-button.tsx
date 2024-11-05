"use client";

import { fetchUserLeagues } from "@/lib/yahoo/actions";
import { Button } from "./ui/button";

export default function RefreshLeaguesButton() {
	return (
		<form action={fetchUserLeagues}>
			<Button type="submit" variant="outline" size="sm">
				Refresh Leagues
			</Button>
		</form>
	);
}
