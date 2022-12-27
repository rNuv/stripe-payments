import React, { useState, useEffect, Suspense } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { GoogleAuthProvider } from "firebase/auth";
import { AuthCheck, useUser } from "reactfire";
import { auth, db } from "./firebase";
import { fetchFromAPI } from "./helpers";

export function SignIn() {
  const signIn = async () => {
    const credential = await auth.signInWithPopup(new GoogleAuthProvider());
    const { uid, email } = credential.user;
    db.collection("users").doc(uid).set({ email }, { merge: true });
  };

  return <button onClick={signIn}>Sign in with Google</button>;
}

export function SignOut(props) {
  return (
    props.user && (
      <button onClick={() => auth.signOut()}>
        Sign out user {props.user.uid}
      </button>
    )
  );
}

function SaveCard(props) {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  const [setupIntent, setSetupIntent] = useState();
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    getWallet();
  }, [user]);

  const createSetupIntent = async (event) => {
    const si = await fetchFromAPI("wallet");
    setSetupIntent(si);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cardElement = elements.getElement(CardElement);
    const { setupIntent: updatedSetupIntent, error } =
      await stripe.confirmCardSetup(setupIntent.client_secret, {
        payment_method: { card: cardElement },
      });

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      setSetupIntent(updatedSetupIntent);
      await getWallet();
      alert("Success! Card Added to wallet");
    }
  };

  const getWallet = async () => {
    if (user) {
      const paymentMethods = await fetchFromAPI("wallet", { method: "GET" });
      setWallet(paymentMethods);
    }
  };

  return (
    <>
      <h2>Customers</h2>

      <p>
        Save credit card details for future use. Connect a Stripe Customer ID to
        a Firebase User ID.
      </p>

      <AuthCheck fallback={<SignIn />}>
        <div className="well">
          <h3>Step 1: Create a Setup Intent</h3>

          <button className="btn btn-success" onClick={createSetupIntent}>
            Attach New Credit Card
          </button>
        </div>
        <hr />

        <form
          onSubmit={handleSubmit}
          className="well"
          hidden={!setupIntent || setupIntent.status === "succeeded"}
        >
          <h3>Step 2: Submit a Payment Method</h3>
          <p>Collect credit card details, then attach the payment source.</p>
          <p>
            Normal Card: <code>4242424242424242</code>
          </p>
          <p>
            3D Secure Card: <code>4000002500003155</code>
          </p>

          <hr />

          <CardElement />
          <button className="btn btn-success" type="submit">
            Attach
          </button>
        </form>

        <div className="well">
          <h3>Retrieve all Payment Sources</h3>
          <select className="form-control">
            {wallet.map((paymentSource) => (
              <CreditCard key={paymentSource.id} card={paymentSource.card} />
            ))}
          </select>
        </div>
        <div className="well">
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  );
}

function CreditCard(props) {
  const { last4, brand, exp_month, exp_year } = props.card;
  return (
    <option>
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  );
}

export default function Customers() {
  return (
    <Suspense fallback={"loading user"}>
      <SaveCard />
    </Suspense>
  );
}
