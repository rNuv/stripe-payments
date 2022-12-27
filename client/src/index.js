import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { auth } from "./firebase";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FirebaseAppProvider, AuthProvider } from "reactfire";

export const firebaseConfig = {
  apiKey: "AIzaSyD7I7mixwd_RXFVWjSkhIpFv5WTpAoUdPo",
  authDomain: "stripe-payments-1a515.firebaseapp.com",
  projectId: "stripe-payments-1a515",
  storageBucket: "stripe-payments-1a515.appspot.com",
  messagingSenderId: "178179732660",
  appId: "1:178179732660:web:a5b6e20201338e512093e1",
  measurementId: "G-W2ZLCQLQPY",
};

const stripePromise = loadStripe(
  "pk_test_51LoHQ2AeMUVnKlwT8vLrmd7dHn0H1ughHUQIMiVU9xlRH6ljxDzwzCZMfUMbmQRPQBjuxuvYH0QyKWtPotEfOTeO00z8rXt9nl"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
      <AuthProvider sdk={auth}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);
