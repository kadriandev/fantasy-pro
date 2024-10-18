import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import YahooFantasy from "yahoo-fantasy";

class MissingAccessTokenError extends Error {
	name = "MissingAccessTokenError";
	message = "Missing token required to access Yahoo! resources.";
	// stack = undefined;
}

export const createYahooClient = (access_token: RequestCookie | undefined) => {
	if (!access_token) throw new MissingAccessTokenError();

	const yf = new YahooFantasy(
		process.env.NEXT_YAHOO_CLIENT_ID!,
		process.env.NEXT_YAHOO_CLIENT_SECRET!,
	);

	yf.setUserToken(access_token.value);

	return yf;
};
