import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (
	request: NextRequest,
	response: NextResponse,
) => {
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					response = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const user = await supabase.auth.getUser();
	if (request.nextUrl.pathname.startsWith("/fantasy") && user.error) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	if (request.nextUrl.pathname === "/" && !user.error) {
		return NextResponse.redirect(new URL("/fantasy", request.url));
	}

	return response;
};
