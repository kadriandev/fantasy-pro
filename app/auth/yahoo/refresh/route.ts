import { refreshToken } from "@/lib/yahoo/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const redirect_uri = await refreshToken(request);
	return NextResponse.redirect(redirect_uri);
}
