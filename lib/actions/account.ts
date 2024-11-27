"use server";

import { createClient } from "../supabase/server";

export const updateUserProfileAction = async (full_name: string) => {
  const supabase = createClient();
  const res = await supabase.from("users").update({ full_name: full_name });

  if (res.error) {
    console.error("ERROR: ", res.error);
    return { error: "Error updating user data." };
  }

  return { success: true };
};
