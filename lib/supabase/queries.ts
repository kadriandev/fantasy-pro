import { cache } from "react";
import { createClient } from "./server";

export const getUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user!;
});

export const getSubscription = async () => {
  const supabase = createClient();
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  return subscription;
};

export const getProducts = async () => {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  return products;
};

export const getUserDetails = cache(async () => {
  const supabase = createClient();
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .single();
  return userDetails;
});
