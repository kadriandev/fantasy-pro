import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Menu } from "lucide-react";

export default async function Layout({ children }: { children: ReactNode }) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/sign-in");
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger className="m-4">
				<Menu />
			</SidebarTrigger>
			<div className="mt-14 flex-1 w-full flex flex-col items-center">
				<div className="w-full flex flex-col max-w-7xl px-5">{children}</div>
			</div>
		</SidebarProvider>
	);
}
