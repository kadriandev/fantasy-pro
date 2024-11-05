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
import Link from "next/link";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@radix-ui/react-collapsible";
import SidebarLeagueLinks from "./sidebar-league";
import SignOutButton from "./sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/supabase/queries";
import { getUserLeagues } from "@/lib/yahoo/queries";

export async function AppSidebar() {
	const supabase = createClient();
	const subscription = await getSubscription(supabase);
	const leagues = await getUserLeagues(supabase);

	return (
		<Sidebar>
			<SidebarHeader className="m-2 text-xl font-bold text-purple-700">
				<Link href="/fantasy">Fantasy Pro</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="text-lg">Leagues</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{subscription &&
								leagues?.map((l) => (
									<Collapsible defaultOpen className="group/collapsible">
										<SidebarGroup>
											<SidebarGroupLabel>
												<CollapsibleTrigger className="flex gap-2 items-center">
													{l.type === "nba" ? (
														<Icon iconNode={basketball} />
													) : l.type === "nfl" ? (
														<Icon iconNode={football} />
													) : (
														<Icon iconNode={baseball} />
													)}
													<span>{l.name}</span>
													<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-180" />
												</CollapsibleTrigger>
											</SidebarGroupLabel>
											<CollapsibleContent>
												<SidebarGroupContent>
													<SidebarLeagueLinks league={l} />
												</SidebarGroupContent>
											</CollapsibleContent>
										</SidebarGroup>
									</Collapsible>
								))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
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
