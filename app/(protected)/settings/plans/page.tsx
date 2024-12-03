import Pricing from "@/components/payments/pricing";
import { getUser, getProducts, getSubscription } from "@/lib/supabase/queries";

export default async function PlansPage() {
  const [user, products, subscription] = await Promise.all([
    getUser(),
    getProducts(),
    getSubscription(),
  ]);

  console.log(products, subscription);

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
