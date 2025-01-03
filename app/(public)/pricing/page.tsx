import Pricing from "@/components/payments/pricing";
import { createClient } from "@/lib/supabase/server";
import { getProducts, getSubscription, getUser } from "@/lib/supabase/queries";

export default async function PricingPage() {
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
