import YahooFantasy from "yahoo-fantasy";

export const createYahooClient = () => {
	const yf = new YahooFantasy(
		process.env.NEXT_YAHOO_CLIENT_ID!,
		process.env.NEXT_YAHOO_CLIENT_SECRET!,
	);

	return yf;
};
