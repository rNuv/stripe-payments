import React, { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { fetchFromAPI } from "./helpers";

export function Checkout() {
  const stripe = useStripe();
  const [product, setProduct] = useState({
    name: "Hat",
    description: "Pug hat. A hat your pug will love.",
    images: ["your-img"],
    amount: 799,
    currency: "usd",
    quantity: 0,
  });

  const changeQuantity = (v) =>
    setProduct({
      ...product,
      quantity: Math.max(0, product.quantity + v),
    });

  const handleClick = async (event) => {
    const body = { line_items: [product] };
    const { id: sessionId } = await fetchFromAPI("checkouts", {
      body,
    });

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Stripe Checkout</h2>
      <p>
        Shopping-cart scenario. Change the quantity of the products below, then
        click checkout to open the Stripe Checkout window.
      </p>

      <div className="product">
        <h3>{product.name}</h3>
        <h4>Stripe Amount: {product.amount}</h4>

        <img src={product.images[0]} width="250px" alt="product" />

        <button
          className="btn btn-sm btn-warning"
          onClick={() => changeQuantity(-1)}
        >
          -
        </button>
        <span style={{ margin: "20px", fontSize: "2em" }}>
          {product.quantity}
        </span>
        <button
          className="btn btn-sm btn-success"
          onClick={() => changeQuantity(1)}
        >
          +
        </button>
      </div>

      <hr />

      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={product.quantity < 1}
      >
        Start Checkout
      </button>
    </>
  );
}

export function CheckoutFail() {
  return <h3>Checkout Failed!</h3>;
}

export function CheckoutSuccess() {
  const url = window.location.href;
  const sessionId = new URL(url).searchParams.get("session_id");
  return <h3>Checkout was a success! {sessionId}</h3>;
}
