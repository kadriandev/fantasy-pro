"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { createStripePortal } from "@/lib/stripe/server";
import Link from "next/link";
import { Tables } from "@/lib/supabase/types";
import { Button } from "./ui/button";

type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;
type Product = Tables<"products">;

type SubscriptionWithPriceAndProduct = Subscription & {
	prices:
		| (Price & {
				products: Product | null;
		  })
		| null;
};

interface Props {
	subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
	const router = useRouter();
	const currentPath = usePathname();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const subscriptionPrice =
		subscription &&
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: subscription?.prices?.currency!,
			minimumFractionDigits: 0,
		}).format((subscription?.prices?.unit_amount || 0) / 100);

	const handleStripePortalRequest = async () => {
		setIsSubmitting(true);
		const redirectUrl = await createStripePortal(currentPath);
		setIsSubmitting(false);
		return router.push(redirectUrl);
	};

	return (
		<div className="p m-auto my-8 w-full max-w-3xl rounded-md border border-zinc-700">
			<div className="px-5 py-4">
				<h3 className="mb-1 text-2xl font-medium">Your Plan</h3>
				<p className="text-zinc-300">
					{subscription
						? `You are currently on the ${subscription?.prices?.products?.name} plan.`
						: "You are not currently subscribed to any plan."}
				</p>
				<div className="mb-4 mt-8 text-xl font-semibold">
					{subscription ? (
						`${subscriptionPrice}/${subscription?.prices?.interval}`
					) : (
						<Link href="/dev/stripe-example-page">Choose your plan</Link>
					)}
				</div>
			</div>

			<div className="rounded-b-md border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500">
				<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
					<p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
					<Button onClick={handleStripePortalRequest} disabled={isSubmitting}>
						Open customer portal
					</Button>
				</div>
			</div>
		</div>
	);
}
