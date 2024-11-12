import { ChevronDown, Icon, Menu } from "lucide-react";
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
import SignOutButton from "../sign-out-button";
import { getSubscription } from "@/lib/supabase/queries";
import { getUserLeagues } from "@/lib/yahoo/queries";
import { ThemeSwitcher } from "../theme-switcher";

export async function AppSidebar() {
	const subscription = await getSubscription();
	const leagues = await getUserLeagues();

	return (
		<>
			<Sidebar>
				<SidebarHeader className="m-2 text-xl font-bold text-purple-700">
					<Link href="/fantasy">Fantasy Pro</Link>
				</SidebarHeader>
				<SidebarContent>
					{subscription && leagues?.length ? (
						<SidebarGroup>
							<SidebarGroupLabel className="text-lg">Leagues</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{leagues?.map((l) => (
										<Collapsible defaultOpen className="group/collapsible">
											<SidebarGroup>
												<SidebarGroupLabel>
													<CollapsibleTrigger className="flex gap-2 items-center">
														{l.game === "nba" ? (
															<Icon iconNode={basketball} />
														) : l.game === "nfl" ? (
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
					) : null}
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
					<SidebarGroup>
						<ThemeSwitcher />
					</SidebarGroup>
				</SidebarFooter>
			</Sidebar>
		</>
	);
}
