import React, { useState, useEffect } from "react";
import { getApi, getAllApi } from "./api/glassApi";
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import { useAuth } from "../components/contexts/AuthContext";
import { db } from '../firebase';
import { doc, onSnapshot, deleteDoc, deleteField, updateDoc, setDoc, query, collection } from "firebase/firestore";
import 'swiper/css';
import GlassListSwipe from "../components/GlassListSwipe";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import Drawer from 'rc-drawer';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { likeGlass, removeLikeGlass, addToCart, deleteFromCart } from "../components/functions/Functions";
import { HiOutlineShoppingCart } from 'react-icons/hi'
import Link from 'next/link';
import DrawerContainer from "../components/DrawerContainer";

const CardElementOptions = {
    hidePostalCode: true
}

function Kassa() {

    const { currentUser } = useAuth();

    const stripe = useStripe();
    const elements = useElements();
    const [apilol, setApilol] = useState([]);
    const [cart, setCart] = useState([]);
    const [strutar, setStrutar] = useState([]);
    const [idLol, setIdLol] = useState(makeId(9));
    const [allaglassar, setAllaglassar] = useState([]);
    const [liked, setLiked] = useState([]);
    const [loading, setLoading] = useState(false);
    const price = [];
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
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
    
          const q = query(collection(db, "User", (currentUser.uid), "Liked"));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setLiked([])
            querySnapshot.forEach((doc) => {
              setLiked(prevFollowed => prevFollowed.concat(doc.id));
            });
          });
    
          // const docRefPrice = doc(db, "User", currentUser.uid, "Cart", "glassar");
          // onSnapshot(docRefPrice, (snapshotPrice) => {
          //   if (snapshotPrice.exists()) {
          //     let mapDataPrice = Object.values(snapshotPrice.data());
          //     setCart(mapDataPrice);
          //     price.push(mapDataPrice.displayPris)
          //   }
          // });
    
          // const weather = await getWeather();
          // console.log(Math.ceil((weather.main.temp-273.15)));
        }
    
        currentUser && getFunction();
      }, [currentUser]);

    const handleFormSubmit = async ev => {
        ev.preventDefault();

        const billingDetails = {
            name: ev.target.name.value,
            email: "lol@gmail.com",
            address: {
                city: ev.target.name.value,
                line1: ev.target.address.value,
                state: ev.target.name.valuee,
                postal_code: ev.target.name.value
            }
        }

        setProcessing(true);

        const { data: clientSecret } = await axios.post('/api/payment_intents', {
            amount: cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0)
                * 100
        });

        const cardElement = elements.getElement(CardElement);
        const paymentMethodReq = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: billingDetails
        });

        const confirmCardPayment = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethodReq.paymentMethod.id
        });

        console.log(confirmCardPayment);
        createOrder(billingDetails, cart, cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0));
    }

    async function createOrder(details, cart, price) {
        setIdLol(makeId(9));
        const orderRef = doc(db, "Order", (currentUser.uid), "orders", idLol);
        await setDoc(orderRef, {
            name: details.name,
            email: details.email,
            address: details.address.line1,
            city: details.address.city,
            postal_code: details.address.postal_code,
            cart: cart,
            price: price
        })
    }

    function makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        return result;
      }

    return (
        <div>
            <form className="w-80" onSubmit={handleFormSubmit}>
                <input type="text" name="name" value="lol"></input>
                <input type="text" name="address" value="lolgatan"></input>
                <CardElement options={CardElementOptions} /><button type="submit">awd</button>
            </form>
        </div>
    )
}

export default Kassa
