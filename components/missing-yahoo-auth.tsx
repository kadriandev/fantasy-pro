import { cookies } from "next/headers";
import { Button } from "./ui/button";
import { accessToken, authToken } from "@/lib/yahoo/auth";

export default function MissingYahooAuthPage() {
	const cookieStore = cookies();

	const authenticateWithYahoo = async () => {
		let access_token = cookieStore.get("accessToken");
		const refresh_token = cookieStore.get("refreshToken");

		if (!access_token && !refresh_token) {
			await authToken();
		}
	};
	return (
		<div>
			<Button onClick={authenticateWithYahoo}>Authenticate with Yahoo</Button>
		</div>
	);
}
