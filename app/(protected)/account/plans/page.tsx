import Pricing from "@/components/pricing";
import { getUser, getProducts, getSubscription } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function PlansPage() {
	const supabase = createClient();
	const [user, products, subscription] = await Promise.all([
		getUser(supabase),
		getProducts(supabase),
		getSubscription(supabase),
	]);

	return (
		<Pricing
			user={user}
			products={products ?? []}
			subscription={subscription}
		/>
	);
}
