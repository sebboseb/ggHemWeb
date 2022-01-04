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
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(false);
  const price = [];

  useEffect(() => {
    async function getFunction() {

      const lol = await getApi("Pinne");
      setApilol(lol);

      const lolstrut = await getApi("Strut");
      setStrutar(lolstrut);
      // setApilol([...lol.strutar, ...lol.pinnar]);

      const alla = await getAllApi(1);
      setAllaglassar(alla);

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

    console.log("fuck")

    currentUser && getFunction();
  }, [currentUser]);

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
  //
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

  function filterCart(array) {
    var flags = [], output = [], l = array.length, i;
    for (i = 0; i < l; i++) {
      if (flags[array[i].namn]) continue;
      flags[array[i].namn] = true;
      output.push(array[i]);
    }

    console.log(output)
    return output
  }

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Navbar button={
            <label htmlFor="my-drawer-3" className="rounded-full px-3 py-2 h-10 flex sm:w-64 bg-white items-center justify-center cursor-pointer">
              <HiOutlineShoppingCart size={20} color="black" />
              <p className=" font-semibold hidden sm:block">
                {cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + ":-"}
              </p>
              <p>{price}</p>
              <div className="w-full h-full flex justify-end items-start">
                <div className="bg-red-600 w-6 h-6 rounded-full relative -top-3 -right-5 flex justify-center items-center">
                  <p className=" text-white font-semibold transition duration-1000 mb-0.5">{cart.length}</p>
                </div>
              </div>
            </label>
          }>
          </Navbar>
          <div className=" sm:h-96 h-44 flex w-full items-center justify-center text-slate-900">
            <h1 className="sm:text-7xl text-center text-3xl font-semibold">Välkommen till ggHem</h1>
          </div>
          <GlassListSwipe glass={apilol} text={"Pinnar"}></GlassListSwipe>
          {/* <GlassListSwipe glass={strutar} text={"Strutar"}></GlassListSwipe> */}
          <div className="flex justify-center">
            <ul className="grid sm:grid-cols-4 grid-cols-2 gap-y-3 gap-x-10 mt-9 p-9">
              {allaglassar?.map((glass) => (
                <li key={glass.url} className='flex flex-col sm:w-56 h-80 '>
                  <div className="shadow relative shadow-slate-300 hover:shadow-slate-300 hover:shadow-md transition duration-150 rounded-sm mb-3 px-1.5 border border-slate-300 flex-col flex">
                    <div className="absolute w-full justify-end flex right-3 top-2">
                      {!liked.some(name => name === glass.namn) ? <AiOutlineHeart onClick={() => likeGlass(glass, currentUser.uid)} size={25}></AiOutlineHeart> : <AiFillHeart onClick={() => removeLikeGlass(glass, currentUser.uid)} size={25} color="red"></AiFillHeart>}
                    </div>
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
                        <div onClick={() => deleteFromCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30'>
                          <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif'>-</h1>
                        </div>
                        <p className=" font-semibold text-xl mb-1.5">{cart.filter(x => x.namn === glass.namn).length}</p>
                        <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                          <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>+</h1>
                        </div>
                      </div> : <div className=' h-full w-full flex justify-end items-end rounded-full mb-3 p-1'>
                        <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                          <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>+</h1>
                        </div>
                      </div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {!currentUser && <Signup></Signup>}
          {currentUser && currentUser.uid}
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
        </div>


        <div className="drawer-side h-full">
          <label for="my-drawer-3" className="drawer-overlay"></label>
          <ul className="overflow-y-auto menu w-1/2 bg-base-100">
            <div className="w-full h-20  bg-sky-700 p-6 shadow flex items-center justify-center"><h1 className=" font-semibold text-3xl text-center text-white">Varukorg</h1></div>
            <ul className="gap-y-3 flex flex-col px-5 mt-4">
              {filterCart(cart).map((glass) => (
                <li key={glass.url} className=" font-semibold text-xl h-16 rounded">
                  <div className="flex gap-x-3"><img src={glass.url} className="w-min min-w-min max-h-16" />
                    <h1>{glass.namn}</h1>
                    <div className=" flex flex-1 justify-end h-full mt-1">
                      <div className=' w-36 flex justify-between items-center rounded-full mb-3 p-1'>
                        <div onClick={() => deleteFromCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30'>
                          <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif'>-</h1>
                        </div>
                        <p className=" font-semibold text-3xl mb-1.5">{cart.filter(x => x.namn === glass.namn).length}</p>
                        <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                          <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>+</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className=" w-full h-full transition from-base-100 to-sky-700 bg-gradient-to-b flex flex-col justify-end items-center">
              <div className="h-full mt-16 pt-4 w-full flex justify-between px-4 text-3xl font-semibold border-t border-slate-900">
                <h1>Totalt</h1>
                <h1>{cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + " kr"}</h1>
              </div>
              <div className="text-center w-3/4 h-12 bg-white rounded-full flex justify-center items-center shadow-lg hover:shadow-white hover:shadow-md duration-150 transform shadow-white mb-8 cursor-pointer">
                <h1 className=" text-slate-900 font-semibold text-xl capitalize">Gå till kassan</h1>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </>
  )
}