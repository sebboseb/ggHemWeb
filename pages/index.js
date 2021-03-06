import React, { useState, useEffect } from "react";
import { getApi, getAllApi } from "./api/glassApi";
import { useAuth } from "../components/contexts/AuthContext";
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import 'swiper/css';
import GlassCard from "../components/GlassCard";
import Head from "next/head";
import GlassLoadingCard from "../components/GlassLoadingCard";

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

      const lolstrut = await getApi("Strut");
      setStrutar(lolstrut);
      // setApilol([...lol.strutar, ...lol.pinnar]);

      const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          setCart([]);
          let mapData = Object.values(snapshot.data());
          setCart(mapData);
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

    async function getApiFunctions() {
      setLoading(true);
      const lol = await getApi("nyhetja");
      setApilol(lol);

      const alla = await getAllApi(load)
        .then(setLoading(false));
      setAllaglassar(alla);
    }

    currentUser && getFunction();
    getApiFunctions();
  }, [currentUser, load]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat+Subrayada:wght@400;700&display=swap" rel="stylesheet" />
        <title>ggHem | Best??ll glass online</title>
        <meta name="og:url" content="https://gghem.se/" />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content="ggHem | Handla glass med fri hemleverans"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="og:description"
          content="V??lj bland massa goda glassar med snabb och fri hemleverans!"
        />
        <meta name="og:image" content={"/ggHemIcon.png"} />

        {/* <!-- Load jQuery(1.7+) --> */}
        {/* <script async src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script> */}

        {/* <!-- Customized Style --> */}
        {/* <link rel="stylesheet" href="owl-carousel/owl.theme.css">

        </link> */}
      </Head>
      {/* {loading && <div className="w-screen h-screen bg-red-600"></div>} */}
      <div className=" w-full flex flex-col items-center">
        <div className=" sm:h-96 h-44 flex w-full items-center justify-center text-slate-900 relative overflow-hidden bg-fixed">
          {/* <div className=" w-[32rem] h-[32rem] rounded-full bg-sky-400 absolute top-[-20rem] left-[-20rem] -z-10"></div> */}





          <div className=" w-[40rem] h-[40rem] rounded bg-sky-100 absolute bottom-[-10rem] left-[-32rem] -z-10 skew-x-[70deg]"></div>
          <div className=" absolute top-0 left-10 h-[18rem] sm:h-[32rem] w-[18rem] sm:w-[32rem] xl:h-[48rem] xl:w-[48rem] sm:bg-purple-300 animate-blob animation-delay-4000 rounded-full mix-blend-multiply filter blur-3xl opacity-50 select-none"></div>
          <div className=" absolute top-0 right-10 h-[18rem] sm:h-[32rem] w-[18rem] sm:w-[32rem] xl:h-[48rem] xl:w-[48rem] sm:bg-pink-300 animate-blob animation-delay-2000 rounded-full mix-blend-multiply filter blur-3xl opacity-50 select-none"></div>
          <div className=" absolute h-[18rem] sm:h-[32rem] w-[18rem] sm:w-[32rem] xl:h-[48rem] xl:w-[48rem] sm:bg-sky-300 bg-sky-300 rounded-full animate-blob sm:mix-blend-multiply sm:filter blur-3xl opacity-50 select-none"></div>




          <div className="flex flex-col items-center">
            <h1 className="sm:text-7xl text-center text-3xl font-semibold z-10 text-white">V??lkommen till <span id="logoFont" className=" text-sky-600">ggHem</span></h1>
            <p className="sm:text-xl font-semibold text-center z-10 text-white">Best??ll en massa god glass med fri hemleverans!</p>
          </div>
        </div>
        {/* {!loading ? <GlassListSwipe glass={apilol} liked={currentUser && liked} text={"Nyheter"}></GlassListSwipe> : <GlassLoadingCard></GlassLoadingCard>} */}
        {/* <GlassListSwipe glass={strutar} text={"Strutar"}></GlassListSwipe> */}
        <div>
          <h1 className="text-slate-900 text-3xl font-semibold mt-9 mb-3 sm:px-0 px-4">All Glass</h1>
          {!loading ? <ul className="grid sm:grid-cols-4 xl:grid-cols-5 grid-cols-2 sm:gap-y-3 gap-y-1.5 gap-x-3 sm:gap-x-9 px-4 sm:px-0">
            {allaglassar?.map((glass) => (
              <GlassCard key={glass.url} glasslol={glass} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
            ))}
          </ul> : <GlassLoadingCard></GlassLoadingCard>}
        </div>
        <div className="w-full py-16 flex justify-center">
          {!loading && <h1 className="w-32 h-12 bg-red-600 rounded-full text-xl text-white font-semibold flex justify-center items-center cursor-pointer" onClick={() => { { setLoading(true); } { (load <= 170 && setLoad(load + 20)) } }}>Ladda fler</h1>}
        </div>
      </div>
    </>
  )
}