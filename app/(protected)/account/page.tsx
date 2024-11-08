import CustomerPortalForm from "@/components/customer-portal-form";
import { getSubscription } from "@/lib/supabase/queries";

export default async function Account() {
	const subscription = await getSubscription();

	return (
		<section className="mb-32">
			<div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
				<div className="sm:align-center sm:flex sm:flex-col">
					<h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
						Account
					</h1>
					<p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
						We partnered with Stripe for a simplified billing.
					</p>
				</div>
			</div>
			<div className="p-4">
				<CustomerPortalForm subscription={subscription} />
			</div>
		</section>
	);
}
