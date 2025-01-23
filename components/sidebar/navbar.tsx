import Link from "next/link";
import { Button } from "../ui/button";
import { BarChart2 } from "lucide-react";
import SignInButton from "./sign-in-button";
import { signOutAction } from "@/lib/actions/auth";

export default async function Navbar() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="#">
        <BarChart2 className="h-6 w-6" />
        <span className="ml-2 text-2xl font-bold text-primary">
          Fantasy Pro
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/#features"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/#how-it-works"
        >
          How It Works
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/pricing"
        >
          Pricing
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/#faq"
        >
          FAQ
        </Link>

        <div className="flex gap-4">
          {!data.user ? (
            <Button asChild size="sm" variant={"outline"}>
              <SignInButton />
            </Button>
          ) : (
            <Button variant={"outline"} onClick={signOutAction}>
              Sign Out
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
