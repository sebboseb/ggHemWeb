import React, { useState, useEffect } from "react";
import { getApi, getAllApi } from "./api/glassApi";
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import { useAuth } from "../components/contexts/AuthContext";
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import 'swiper/css';
import GlassListSwipe from "../components/GlassListSwipe";
import { HiOutlineShoppingCart } from 'react-icons/hi'
import DrawerContainer from "../components/DrawerContainer";
import Login from "../components/Login";
import GlassCard from "../components/GlassCard";
import Head from "next/head";

export default function Home() {

  const { currentUser } = useAuth();

  const [apilol, setApilol] = useState([]);
  const [cart, setCart] = useState([]);
  const [strutar, setStrutar] = useState([]);
  const [allaglassar, setAllaglassar] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(20);
  const price = [];

  useEffect(() => {
    async function getFunction() {

      const lol = await getApi("nyhetja");
      setApilol(lol);

      const lolstrut = await getApi("Strut");
      setStrutar(lolstrut);
      // setApilol([...lol.strutar, ...lol.pinnar]);

      const alla = await getAllApi(load);
      setAllaglassar(alla);
      setLoading(false);

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
  }, [currentUser, load]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat+Subrayada:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className=" sm:h-96 h-44 flex w-full items-center justify-center text-slate-900 relative overflow-hidden bg-fixed">
        {/* <div className=" w-[32rem] h-[32rem] rounded-full bg-sky-400 absolute top-[-20rem] left-[-20rem] -z-10"></div> */}
        <div className=" w-[40rem] h-[40rem] rounded bg-sky-100 absolute bottom-[-10rem] left-[-32rem] -z-10 skew-x-[70deg]"></div>
        <div className="flex flex-col items-center">
          <h1 className="sm:text-7xl text-center text-3xl font-semibold">Välkommen till <span id="logoFont" className=" text-sky-700">ggHem</span></h1>
          <p className="text-xl font-semibold">Beställ en massa god glass med fri hemleverans!</p>
        </div>
      </div>
      <GlassListSwipe glass={apilol} text={"Nyheter"}></GlassListSwipe>
      {/* <GlassListSwipe glass={strutar} text={"Strutar"}></GlassListSwipe> */}
      <h1 className="text-slate-900 text-3xl font-semibold mt-9 mx-2.5">All Glass</h1>
      <div className="flex justify-center">
        <ul className="grid sm:grid-cols-4 grid-cols-2 gap-y-3 gap-x-10 p-9">
          {allaglassar?.map((glass) => (
            <GlassCard glasslol={glass} liked={liked} cart={cart} uid={currentUser.uid}></GlassCard>
          ))}
        </ul>
      </div>
      <div className="w-full pb-16 flex justify-center">
        {!loading &&<h1 className="w-32 h-12 bg-red-600 rounded-full text-xl text-white font-semibold flex justify-center items-center cursor-pointer" onClick={() => {{setLoading(true);}{(load <= 170 && setLoad(load+20))}}}>Ladda fler</h1>}
      </div>
      {!currentUser && <Signup></Signup>}
      {!currentUser && <Login></Login>}
      {load}
    </>
  )
}