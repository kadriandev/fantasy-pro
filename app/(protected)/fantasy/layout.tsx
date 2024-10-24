import { getURL } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const refresh_token = cookieStore.get("refresh_token");

  if (!access_token && !refresh_token) {
    redirect(getURL("/auth/yahoo"));
  }

  return <div className="mx-10">{children}</div>;
}
