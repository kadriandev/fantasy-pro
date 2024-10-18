import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function authToken() {
	const params = new URLSearchParams();

	params.set("client_id", process.env.NEXT_YAHOO_CLIENT_ID!);
	params.set("response_type", "code");
	params.set("redirect_uri", `${process.env.VERCEL_URL}/auth/yahoo/callback`);

	return fetch(
		`https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`,
		{
			method: "GET",
		},
	).then((res) => res.url);
}

export async function accessToken(request: Request) {
	const code = request.url.split("=")[1];

	const auth_token = btoa(
		`${process.env.NEXT_YAHOO_CLIENT_ID}:${process.env.NEXT_YAHOO_CLIENT_SECRET}`,
	);

	return fetch(`https://api.login.yahoo.com/oauth2/get_token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth_token}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `grant_type=authorization_code&redirect_uri=oob&code=${code}`,
	}).then((res) => res.json());
}

export async function refreshToken(refresh_token: RequestCookie | undefined) {
	if (!refresh_token) throw new Error("Missing refresh token");

	const auth_token = btoa(
		`${process.env.NEXT_YAHOO_CLIENT_ID}:${process.env.NEXT_YAHOO_CLIENT_SECRET}`,
	);

	return fetch(`https://api.login.yahoo.com/oauth2/get_token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth_token}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `grant_type=refresh_token&redirect_uri=oob&refresh_token=${refresh_token.value}`,
	}).then((res) => res.json());
}
