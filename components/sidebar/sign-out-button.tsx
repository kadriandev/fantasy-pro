"use client";

import { signOutAction } from "@/lib/actions/auth";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function SignOutButton() {
  return (
    <SidebarMenuItem onClick={() => signOutAction()}>
      <SidebarMenuButton asChild>
        <span>Sign out</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
