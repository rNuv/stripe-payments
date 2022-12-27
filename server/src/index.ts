import Stripe from "stripe";
import { app } from "./api";
import { config } from "dotenv";

// environment variables
if (process.env.NODE_ENV !== "production") {
  config();
}

// stripe initialization
export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-03-02",
});

// express initialization
const port = process.env.PORT || 3333;
app.listen(port, () =>
  console.log(`api available on http://localhost:${port}`)
);
