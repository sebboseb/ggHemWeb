import React, { useState, useEffect } from "react";
import { getApi } from "./api/glassApi";
import Link from 'next/link'
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import { useAuth } from "../components/contexts/AuthContext";
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import GlassListSwipe from "../components/GlassListSwipe";

export default function Home() {

  const { currentUser } = useAuth();
  const [apilol, setApilol] = useState([]);
  const [cart, setCart] = useState([]);
  const [strutar, setStrutar] = useState([]);
  const [kulglass, setKulglass] = useState([]);


  useEffect(() => {
    setCart([]);
    async function getFunction() {
      const lol = await getApi("pinnar");
      setApilol(lol);

      const lolstrut = await getApi("strutar");
      setStrutar(lolstrut);
      // setApilol([...lol.strutar, ...lol.pinnar]);

      const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          let mapData = Object.values(snapshot.data());
          setCart(mapData);
        }
      });
    }

    getFunction();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <GlassListSwipe glass={apilol} text={"Pinnar"}></GlassListSwipe>
      <GlassListSwipe glass={strutar} text={"Strutar"}></GlassListSwipe>
      {!currentUser && <Signup></Signup>}
      {currentUser.uid}
      <ul>
        {cart?.map((glass) => (
          <li className="flex gap-x-9">
            {glass.namn}
            <div onClick={() => deleteFromCart(glass.glassId)} className="cursor-pointer">-</div>
          </li>
        ))}
      </ul>
    </>
  )
}