import { getURL } from "@/lib/utils";
import { refreshToken } from "@/lib/yahoo/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
	const cookieStore = cookies();
	const access_token = cookieStore.get("access_token");
	const refresh_token = cookieStore.get("refresh_token");

	if (!access_token && !refresh_token) {
		redirect(getURL("/fantasy/link-yahoo"));
	} else if (refresh_token) {
		const res = await refreshToken(refresh_token);
		if (res.error) {
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
	}

	return <>{children}</>;
}
