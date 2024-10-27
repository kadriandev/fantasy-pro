import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

export default async function Navbar() {
	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<div className="flex gap-5 items-center font-semibold">
					<Link href={"/"}>Fantasy Pro</Link>
					<Link href={"/pricing"}>Pricing</Link>
				</div>
				<div className="flex gap-2">
					<ThemeSwitcher />
					<Button asChild size="sm" variant={"outline"}>
						<Link href="/sign-in">Sign in</Link>
					</Button>
					<Button asChild size="sm" variant={"default"}>
						<Link href="/sign-up">Sign up</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
}
