import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "./auth";

export const updateYahooAuth = async (request: NextRequest) => {
	const access_token = request.cookies.get("access_token");
	const refresh_token = request.cookies.get("refresh_token");

	if (!access_token && !refresh_token) {
		return NextResponse.redirect(
			"https://" + process.env.VERCEL_URL + "/auth/yahoo",
		);
	}

	let response = NextResponse.next();

	if (!access_token) {
		const res = await refreshToken(refresh_token);
		if (res.error) {
			response.cookies.delete("refresh_token");
		}

		if (res.access_token?.length)
			response.cookies.set("access_token", res.access_token as string, {
				expires: new Date(Date.now() + res.expires_in * 1000),
				httpOnly: true,
				path: "/",
			});

		if (res.refresh_token?.length)
			response.cookies.set("refresh_token", res.refresh_token as string, {
				httpOnly: true,
				path: "/",
			});
	}

	return response;
};