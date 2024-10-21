import Stripe from "stripe";

export const stripe = new Stripe(
	process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? "",
	{
		// Register this as an official Stripe plugin.
		// https://stripe.com/docs/building-plugins#setappinfo
		appInfo: {
			name: "Fantaasy Pro",
			version: "0.0.0",
			url: "https:/fantasy-pro.kadriandev.com",
		},
	},
);
