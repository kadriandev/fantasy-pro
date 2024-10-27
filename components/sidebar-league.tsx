"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarLeagueProps {
	league_key: string;
}

export default function SidebarLeagueLinks({ league_key }: SidebarLeagueProps) {
	const pathname = usePathname();
	return (
		<>
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
