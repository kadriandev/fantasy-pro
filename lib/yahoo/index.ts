import YahooFantasy from "yahoo-fantasy";
import { cookies } from "next/headers";

export const createYahooClient = () => {
	const cookieStore = cookies();
	const access_token = cookieStore.get("access_token");

	let token = access_token?.value;
	const yf = new YahooFantasy(
		process.env.YAHOO_CLIENT_ID!,
		process.env.YAHOO_CLIENT_SECRET!,
	);

	yf.setUserToken(token);

	return yf;
};
