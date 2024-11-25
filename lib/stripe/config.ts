import Stripe from "stripe";
import { env } from "../env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "", {
  appInfo: {
    name: "Fantaasy Pro",
    version: "0.0.0",
    url: "https:/fantasy-pro.kadriandev.com",
  },
});
