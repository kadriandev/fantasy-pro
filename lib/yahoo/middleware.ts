import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "./auth";
import { getURL } from "../utils";

export const updateYahooAuth = async (
	request: NextRequest,
	response: NextResponse,
) => {
	const access_token = request.cookies.get("access_token");
	const refresh_token = request.cookies.get("refresh_token");

	if (!access_token && !refresh_token) {
		// "https://" + process.env.NEXT_PUBLIC_VERCEL_URL + "/link-yahoo",
		return NextResponse.redirect(getURL("/fantasy/link-yahoo"));
	}

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
