import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { accessToken } from "@/lib/yahoo/auth";

export async function GET(request: Request) {
	const cookieStore = cookies();

	const res = await accessToken(request);

	cookieStore.set("access_token", res.access_token, {
		expires: res.expires_in,
	});

	cookieStore.set("refresh_token", res.refresh_token);

	redirect("/leagues");
}
