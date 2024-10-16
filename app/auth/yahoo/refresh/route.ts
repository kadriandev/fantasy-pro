import { refreshToken } from "@/lib/yahoo/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("refreshToken");
	const redirect_uri = await refreshToken(token?.value ?? "");
	return NextResponse.redirect(redirect_uri);
}
