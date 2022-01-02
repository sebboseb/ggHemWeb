import React, { useState, useEffect } from "react";
import { getApi, getWeather } from "./api/glassApi";
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import { useAuth } from "../components/contexts/AuthContext";
import { db } from '../firebase';
import { doc, onSnapshot, deleteDoc, deleteField, updateDoc, setDoc } from "firebase/firestore";
import 'swiper/css';
import GlassListSwipe from "../components/GlassListSwipe";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

const CardElementOptions = {
  hidePostalCode: true
}

export default function Home() {

  const { currentUser } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [apilol, setApilol] = useState([]);
  const [cart, setCart] = useState([]);
  const [strutar, setStrutar] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [idLol, setIdLol] = useState(makeId(9));
  const [allaglassar, setAllaglassar] = useState([]);

  useEffect(() => {
    setCart([]);
    async function getFunction() {
      const lol = await getApi("pinnar");
      setApilol(lol);

      const lolstrut = await getApi("strutar");
      setStrutar(lolstrut);
      // setApilol([...lol.strutar, ...lol.pinnar]);

      const alla = await getApi("db");
      setAllaglassar(alla.dryck);

      const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          let mapData = Object.values(snapshot.data());
          setCart(mapData);
        }
      });

      // const weather = await getWeather();
      // console.log(Math.ceil((weather.main.temp-273.15)));
    }

    getFunction();
  }, []);

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

  return (
    <>
      <Navbar></Navbar>
      <div className=" sm:h-96 h-44 flex w-full items-center justify-center text-slate-900">
        <h1 className="sm:text-7xl text-3xl font-semibold">Välkommen till ggHem</h1>
        <p></p>
      </div>
      <GlassListSwipe glass={apilol} text={"Pinnar"}></GlassListSwipe>
      {/* <GlassListSwipe glass={strutar} text={"Strutar"}></GlassListSwipe> */}
      <ul className="grid sm:grid-cols-4 grid-cols-2 gap-y-3 gap-x-5 mt-9 p-9">
        {allaglassar.map((glass) => (
          <li key={glass.url} className='flex flex-col sm:w-52 h-80 '>
            <div className="shadow shadow-slate-300 hover:shadow-slate-300 hover:shadow-md transition duration-150 rounded-sm mb-3 px-1.5 border border-slate-300 flex-col flex">
              <div href={`glass/${glass.namn.replace(/ /g, "-")}`}>
                <div className=" cursor-pointer h-64">
                  <div className='w-full flex justify-center'>
                    <img loading='lazy' className='w-auto min-w-min max-h-24 mt-3' src={`${glass.url}`} alt="" />
                  </div>
                  <p className='text-xs mt-3 font-semibold'>{glass.supplier}</p>
                  <h1 className=' font-semibold'>{glass.namn}</h1>
                  <p className='text-xs'>{glass.vikt}/{glass.volym}</p>
                  <div className='flex justify-between'>
                    <h1>{glass.displayPris}</h1>
                    <h1>{glass.displayPrisSingel} /st</h1>
                  </div>
                </div>
              </div>
              {cart.filter(x => x.namn === glass.namn).length ?
                <div className=' h-full w-full flex justify-between items-end bg-slate-100 rounded-full mb-3 p-1'>
                  <div onClick={() => deleteFromCart(glass)} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30'>
                    <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif'>-</h1>
                  </div>
                  <p className=" font-semibold text-xl mb-1.5">{cart.filter(x => x.namn === glass.namn).length}</p>
                  <div onClick={() => addToCart(glass)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>+</h1>
                  </div>
                </div> : <div className=' h-full w-full flex justify-end items-end rounded-full mb-3 p-1'>
                  <div onClick={() => addToCart(glass)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>+</h1>
                  </div>
                </div>}
            </div>
          </li>
        ))}
      </ul>
      {!currentUser && <Signup></Signup>}
      {currentUser.uid}
      {/* <ul>
          {cart?.map((glass) => (
            <li key={glass.url} className="flex gap-x-9">
              {glass.namn}
              <div onClick={() => deleteFromCart(glass.glassId)} className="cursor-pointer">-</div>
            </li>
          ))}
        </ul> */}
      <form className="w-80" onSubmit={handleFormSubmit}>
        <input type="text" name="name" value="lol"></input>
        <input type="text" name="address" value="lolgatan"></input>
        <CardElement options={CardElementOptions} /><button type="submit">awd</button>
      </form>
    </>
  )
}