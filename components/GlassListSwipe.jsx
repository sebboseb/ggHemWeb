import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, deleteDoc, deleteField, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "./contexts/AuthContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

function GlassListSwipe(props) {

    const [cart, setCart] = useState([]);
    const [liked, setLiked] = useState([]);

    useEffect(() => {
        setCart([]);
        async function getFunction() {
            const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
            onSnapshot(docRef, (snapshot) => {
                if (snapshot) {
                    let mapData = Object.values(snapshot.data());
                    setCart(mapData);
                }
            });

            const likedRef = doc(db, "User", currentUser.uid, "Liked", "glassar");
            onSnapshot(likedRef, (snapshot) => {
                if (snapshot) {
                    let mapData = Object.values(snapshot.data());
                    setLiked(mapData);
                }
            });
        }

        getFunction();
    }, []);

    const { currentUser } = useAuth();

    async function likeGlass(glass) {
        const cartRef = doc(db, "User", (currentUser.uid), "Liked", "glassar");
        await setDoc(cartRef, {
            [glass.namn]: glass,
        }, { merge: true });
    }

    async function addToCart(glass) {
        const cartRef = doc(db, "User", (currentUser.uid), "Cart", "glassar");
        let amount = cart.filter(x => x.namn === glass.namn).length + 1;
        await updateDoc(cartRef, {
            [glass.namn + " " + amount]: glass,
        }, { merge: true });
    }

    async function deleteFromCart(glass) {
        const deleteRef = doc(db, "User", (currentUser.uid), "Cart", "glassar");
        let amount = cart.filter(x => x.namn === glass.namn).length; //index === reviews where(username == sebboseb).length + 1
        await updateDoc(deleteRef, {
            [glass.namn + " " + amount]: deleteField()
        });
    }

    // console.log(liked.map(item => item.namn));
    // console.log(liked.map(item => item.namn));
    console.log(liked.map(item => item.namn) === ["Farbror Arnes Kladdkaka"]);

    return (
        <div className='flex flex-wrap overflow-hidden overflow-x-auto snap-x'>
            <div className='flex w-full justify-between mx-4 items-center'>
                <h1 className='font-semibold text-3xl pb-3'>{props.text}</h1>
                <div className='font-semibold'><u>Se alla</u></div>
            </div>
            <div className="w-screen px-4 h-88">
                <Swiper spaceBetween={10} slidesPerView={4}>
                    {props.glass.map((glass, i) => (
                        i <= 10 &&
                        <SwiperSlide className='flex flex-col w-52 h-80 '>
                            <div className="shadow shadow-slate-300 hover:shadow-slate-300 hover:shadow-md transition duration-150 rounded-sm mb-3 px-1.5 border border-slate-300">
                                <div className="absolute w-full justify-end flex right-3 top-2">
                                    {!liked.some(name => name.namn === glass.namn) ? <AiOutlineHeart onClick={() => likeGlass(glass)} size={25}></AiOutlineHeart> : <AiFillHeart size={25} color="red"></AiFillHeart>}
                                </div>
                                <Link href={`glass/${glass.namn.replace(/ /g, "-")}`}>
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
                                </Link>
                                {cart.filter(x => x.namn === glass.namn).length ?
                                    <div className=' h-full w-full flex justify-between items-end bg-slate-100 rounded-full mb-3 p-1'>
                                        <div onClick={() => deleteFromCart(glass)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                            <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>-</h1>
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
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default GlassListSwipe;