"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { YahooGameLeague } from "@/lib/yahoo/types";
import { ArrowRight } from "lucide-react";

interface SidebarLeagueProps {
	league: YahooGameLeague;
}

export default function SidebarLeagueLinks({ league }: SidebarLeagueProps) {
	const pathname = usePathname();
	const league_key = league.league_key;
	return (
		<>
			<SidebarMenuItem className={"ml-4"}>
				<Link href={league.url}>
					<SidebarMenuButton className={"text-purple-300"}>
						Go to Yahoo <ArrowRight size={20} />
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
			<SidebarMenuItem
				className={cn(
					"ml-4",
					pathname === `/fantasy/${league_key}` && "text-purple-500",
				)}
			>
				<Link href={`/fantasy/${league_key}`}>
					<SidebarMenuButton
						className={cn(
							pathname === `/fantasy/${league_key}` && "hover:text-purple-500",
						)}
					>
						Standings
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
			<SidebarMenuItem
				className={cn(
					"ml-4",
					pathname === `/fantasy/${league_key}/stats` && "text-purple-500",
				)}
			>
				<Link href={`/fantasy/${league_key}/stats`}>
					<SidebarMenuButton
						className={cn(
							pathname === `/fantasy/${league_key}/stats` &&
								"hover:text-purple-500",
						)}
					>
						Stats
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
			<SidebarMenuItem
				className={cn(
					"ml-4",
					pathname === `/fantasy/${league_key}/teams` && "text-purple-500",
				)}
			>
				<Link href={`/fantasy/${league_key}/teams`}>
					<SidebarMenuButton
						className={cn(
							pathname === `/fantasy/${league_key}/teams` &&
								"hover:text-purple-500",
						)}
					>
						Teams
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
		</>
	);
}
