"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { YahooGameLeague } from "@/lib/yahoo/types";
import { ArrowRight } from "lucide-react";

interface SidebarLeagueLinksProps {
	league: YahooGameLeague;
}

interface SidebarLinkProps {
	label: string;
	link: string;
	pathname: string;
}

function SidebarLink({ link, pathname, label }: SidebarLinkProps) {
	return (
		<SidebarMenuItem
			className={cn("ml-4", pathname === link && "text-purple-500")}
		>
			<Link href={link}>
				<SidebarMenuButton
					className={cn(pathname === link && "hover:text-purple-500")}
				>
					{label}
				</SidebarMenuButton>
			</Link>
		</SidebarMenuItem>
	);
}

export default function SidebarLeagueLinks({
	league,
}: SidebarLeagueLinksProps) {
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
			<SidebarLink
				label={"Overview"}
				link={`/fantasy/${league_key}/overview`}
				pathname={pathname}
			/>
			<SidebarLink
				label={"Standings"}
				link={`/fantasy/${league_key}`}
				pathname={pathname}
			/>
			<SidebarLink
				label={"Stats"}
				link={`/fantasy/${league_key}/stats`}
				pathname={pathname}
			/>
			<SidebarLink
				label={"Teams"}
				link={`/fantasy/${league_key}/teams`}
				pathname={pathname}
			/>
		</>
	);
}
