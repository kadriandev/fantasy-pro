import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { signOutAction } from "@/lib/actions/auth";

export default async function Navbar() {
	const {
		data: { user },
	} = await createClient().auth.getUser();

	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<div className="flex gap-5 items-center font-semibold">
					<Link href={"/"}>Fantasy Pro</Link>
					{user ? (
						<>
							<Link href={"/fantasy/leagues"}>Leagues</Link>
							<Link href={"/account"}>Account</Link>
						</>
					) : (
						<>
							<Link href={"/pricing"}>Pricing</Link>
						</>
					)}
				</div>
				{user ? (
					<div className="flex items-center gap-4">
						<ThemeSwitcher />
						<form action={signOutAction}>
							<Button type="submit" variant={"outline"}>
								Sign out
							</Button>
						</form>
					</div>
				) : (
					<div className="flex gap-2">
						<ThemeSwitcher />
						<Button asChild size="sm" variant={"outline"}>
							<Link href="/sign-in">Sign in</Link>
						</Button>
						<Button asChild size="sm" variant={"default"}>
							<Link href="/sign-up">Sign up</Link>
						</Button>
					</div>
				)}
			</div>
		</nav>
	);
}
