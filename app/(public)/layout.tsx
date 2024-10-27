import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		return redirect("/fantasy");
	}

	return (
		<>
			<Navbar />
			<div className="mt-14 max-w-7xl flex flex-col gap-12 items-start">
				{children}
			</div>
		</>
	);
}
