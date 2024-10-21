import { cookies } from "next/headers";
import { accessToken } from "@/lib/yahoo/auth";
import { NextResponse } from "next/server";
import { getURL } from "@/lib/utils";

export async function GET(request: Request) {
	const cookieStore = cookies();

	const res = await accessToken(request);

	if (res.error) {
		cookieStore.delete("access_token");
		cookieStore.delete("refresh_token");
	}

	if (res.access_token?.length)
		cookieStore.set("access_token", res.access_token as string, {
			expires: new Date(Date.now() + res.expires_in * 1000),
			httpOnly: true,
			path: "/",
		});

	if (res.refresh_token?.length)
		cookieStore.set("refresh_token", res.refresh_token as string, {
			httpOnly: true,
			path: "/",
		});

	return NextResponse.redirect(getURL("/fantasy"));
}
