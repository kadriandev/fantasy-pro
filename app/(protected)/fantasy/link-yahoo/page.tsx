import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
	return (
		<div>
			<Link href={"/auth/yahoo"}>
				<Button>Link to Yahoo</Button>
			</Link>
		</div>
	);
}
