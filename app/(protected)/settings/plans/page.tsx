import Pricing from "@/components/payments/pricing";
import { getUser, getProducts, getSubscription } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function PlansPage() {
  const [user, products, subscription] = await Promise.all([
    getUser(),
    getProducts(),
    getSubscription(),
  ]);

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
