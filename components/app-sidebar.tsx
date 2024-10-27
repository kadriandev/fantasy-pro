import { ChevronDown, Icon } from "lucide-react";
import { baseball, basketball, football } from "@lucide/lab";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createYahooClient } from "@/lib/yahoo";
import { attempt } from "@/lib/utils";
import Link from "next/link";
import { YahooGameLeagues } from "@/lib/yahoo/types";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@radix-ui/react-collapsible";
import SidebarLeagueLinks from "./sidebar-league";
import SignOutButton from "./sign-out-button";

class LeagueError extends Error {
	name = "LeagueError";
	message = "Unable to get league data.";
	stack = undefined;
}

export async function AppSidebar() {
	const yf = await createYahooClient();

	const [err, games] = await attempt(
		yf.user.game_leagues("nba") as Promise<YahooGameLeagues>,
	);
	if (err) throw new LeagueError();

	return (
		<Sidebar>
			<SidebarHeader className="m-2 text-xl font-bold text-purple-700">
				Fantasy Pro
			</SidebarHeader>
			<SidebarContent>
				{games.games?.map((game) => (
					<SidebarGroup>
						<SidebarGroupLabel className="text-lg">Leagues</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{game.leagues.map((league) => (
									<Collapsible defaultOpen className="group/collapsible">
										<SidebarGroup>
											<SidebarGroupLabel>
												<CollapsibleTrigger className="flex gap-2 items-center">
													{game.name === "Basketball" ? (
														<Icon iconNode={basketball} />
													) : game.name === "Football" ? (
														<Icon iconNode={football} />
													) : (
														<Icon iconNode={baseball} />
													)}
													<span>{league.name}</span>
													<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-180" />
												</CollapsibleTrigger>
											</SidebarGroupLabel>
											<CollapsibleContent>
												<SidebarGroupContent>
													<SidebarLeagueLinks league_key={league.league_key} />
												</SidebarGroupContent>
											</CollapsibleContent>
										</SidebarGroup>
									</Collapsible>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter className="mb-8">
				<SidebarGroup>
					<SidebarGroupLabel className="text-lg">Settings</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/account">
										{/* <item.icon /> */}
										<span>Account</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SignOutButton />
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}