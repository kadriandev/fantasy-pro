import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

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
			<div className="mt-14 flex-1 w-full flex flex-col items-center">
				<div className="w-full flex flex-col max-w-7xl px-5">{children}</div>
			</div>
		</SidebarProvider>
	);
}
