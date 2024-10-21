import { Button } from "./ui/button";
import Link from "next/link";

interface MissingYahooAuthPageProps {}

export default function MissingYahooAuthPage(props: MissingYahooAuthPageProps) {
	return (
		<div>
			<Link href="/auth/yahoo">
				<Button>Authenticate with Yahoo</Button>
			</Link>
		</div>
	);
}
