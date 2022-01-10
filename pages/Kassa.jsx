import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import { useAuth } from '../components/contexts/AuthContext';
import axios from 'axios';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
export default function PreviewPage() {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }

    async function getFunction() {


      const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          setCart([]);
          let mapData = Object.values(snapshot.data());
          setCart(mapData);
          console.log(mapData);
        }
      });
    }

    getFunction();
  }, []);

  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);

  


  return (
    <><button type="submit" role="link" onClick={handleClick}>awdawd</button>
      <form action="/api/checkout_sessions" method="POST">
        <section>
          <button type="submit" role="link">
            Betala
          </button>
        </section>
        <style jsx>
          {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
        </style>
      </form></>
  );
}