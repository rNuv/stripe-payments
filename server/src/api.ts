import express from "express";
import cors from "cors";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { createStripeCheckoutSessions } from "./checkout";
import { createPaymentIntent } from "./payments";
import { handleStripeWebhook } from "./webhooks";
import { auth } from "./firebase";
import { createSetupIntent, listPaymentMethods } from "./customers";
import {
  cancelSubscription,
  createSubscription,
  listSubscriptions,
} from "./billing";

export const app = express();

app.use(cors({ origin: true }));

app.use(decodeJWT);

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.post("/test", (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 7 });
});

app.post(
  "/checkouts/",
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSessions(body.line_items));
  })
);

app.post(
  "/payments",
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  })
);

app.post("/hooks", runAsync(handleStripeWebhook));

app.post(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);

app.get(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);

app.post(
  "/subscriptions/",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await createSubscription(
      user.uid,
      plan,
      payment_method
    );
    res.send(subscription);
  })
);

app.get(
  "/subscriptions/",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const subscriptions = await listSubscriptions(user.uid);

    res.send(subscriptions.data);
  })
);

app.patch(
  "/subscriptions/:id",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    res.send(await cancelSubscription(user.uid, req.params.id));
  })
);

function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

function validateUser(req: Request) {
  const user = req["currentUser"];
  if (!user) {
    throw new Error("You must be logged in to make this request.");
  }
  return user;
}
