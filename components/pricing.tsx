"use client";

import type { Tables } from "@/lib/supabase/types";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import getStripe from "@/lib/stripe/get-stripe";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
	prices: Price[];
}
interface PriceWithProduct extends Price {
	products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
	prices: PriceWithProduct | null;
}

interface Props {
	user: User | null | undefined;
	products: ProductWithPrices[];
	subscription: SubscriptionWithProduct | null;
}

export default function Pricing({ user, products, subscription }: Props) {
	const router = useRouter();
	const currentPath = usePathname();

	const handleStripeCheckout = async (price: Price) => {
		if (subscription) {
			return router.push("/account");
		}

		if (!user) {
			return router.push("/sign-in");
		}

		const { errorRedirect, sessionId } = await checkoutWithStripe(
			price,
			currentPath,
		);

		if (errorRedirect) {
			return router.push(errorRedirect);
		}

		if (!sessionId) {
			return router.push(
				getErrorRedirect(
					currentPath,
					"An unknown error occurred.",
					"Please try again later or contact a system administrator.",
				),
			);
		}

		const stripe = await getStripe();
		stripe?.redirectToCheckout({ sessionId });
	};

	if (!products.length) {
		return (
			<section className="bg-black">
				<div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
					<div className="sm:flex sm:flex-col sm:align-center"></div>
					<p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
						No subscription pricing plans found. Create them in your{" "}
						<a
							className="text-pink-500 underline"
							href="https://dashboard.stripe.com/products"
							rel="noopener noreferrer"
							target="_blank"
						>
							Stripe Dashboard
						</a>
						.
					</p>
				</div>
			</section>
		);
	} else {
		return (
			<section className="bg-black">
				<div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
					{products.map((product, i) => {
						const price = product?.prices[0];
						if (!price) return null;
						const priceString = new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: price.currency!,
							minimumFractionDigits: 0,
						}).format((price?.unit_amount || 0) / 100);

						return (
							<div
								key={i}
								className={cn(
									"flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900",
									{
										"border border-pink-500": subscription
											? product.name === subscription?.prices?.products?.name
											: product.name === "Freelancer",
									},
									"flex-1", // This makes the flex item grow to fill the space
									"basis-1/3", // Assuming you want each card to take up roughly a third of the container's width
									"max-w-xs", // Sets a maximum width to the cards to prevent them from getting too large
								)}
							>
								<div className="p-6">
									<h2 className="text-2xl font-semibold leading-6 text-white">
										{product.name}
									</h2>
									<p className="mt-4 text-zinc-300">{product.description}</p>
									<p className="mt-8">
										<span className="text-5xl font-extrabold white">
											{priceString}
										</span>
										<span className="text-base font-medium text-zinc-100">
											/{price.interval}
										</span>
									</p>
									<Button
										onClick={() => handleStripeCheckout(price)}
										className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
									>
										{subscription ? "Manage" : "Subscribe"}
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		);
	}
}
