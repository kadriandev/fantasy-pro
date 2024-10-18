import { refreshToken } from "@/lib/yahoo/auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("refresh_token");

	const res = await refreshToken(token);
	cookieStore.set("access_token", res.access_token, {
		expires: res.expires_in,
		httpOnly: true,
	});
	cookieStore.set("refresh_token", res.refresh_token, {
		httpOnly: true,
	});

	return Response.json({ ok: true });
}
