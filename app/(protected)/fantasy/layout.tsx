import { getSubscription } from "@/lib/supabase/queries";
import { getURL } from "@/lib/utils";
import { refreshToken } from "@/lib/yahoo/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const refresh_token = cookieStore.get("refresh_token");

  const subscription = await getSubscription();
  if (!subscription) {
    redirect(getURL("/settings/plans"));
  }

  if (!access_token) {
    if (!refresh_token) redirect(getURL("/auth/yahoo"));
    else await refreshToken(refresh_token);
  }

  return <div className="mx-10">{children}</div>;
}
