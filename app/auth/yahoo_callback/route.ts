import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createYahooClient } from "@/lib/yahoo/fantasy-api";

export async function GET(request: Request) {
	const headersList = headers();
	const referer = headersList.get("referer");
	const cookieStore = cookies();

	console.log("yahoo callback hit");
	const yf = createYahooClient();
	yf.authCallback(
		request,
		(
			err: string,
			{
				access_token,
				refresh_token,
			}: { access_token: string; refresh_token: string },
		) => {
			if (err) {
				return NextResponse.redirect("/error");
			}

			cookieStore.set("accessToken", access_token, {
				path: "/",
				httpOnly: true,
			});
			cookieStore.set("refreshToken", refresh_token, {
				path: "/",
				httpOnly: true,
			});

			redirect("/protected");
		},
	);
}
