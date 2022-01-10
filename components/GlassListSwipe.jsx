import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from "swiper";
import 'swiper/css';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, deleteDoc, deleteField, updateDoc, collection, query } from "firebase/firestore";
import { useAuth } from "./contexts/AuthContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import GlassLoadingCard from "./GlassLoadingCard";
import 'swiper/css/navigation';
import { likeGlass, removeLikeGlass, addToCart, deleteFromCart } from "./functions/Functions";

function GlassListSwipe(props) {

    const [cart, setCart] = useState([]);
    const [liked, setLiked] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCart([]);
        async function getFunction() {
            const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
            onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
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
        }

        currentUser && getFunction();
    }, [currentUser]);

    const { currentUser } = useAuth();

    return (
        <div className='flex flex-wrap overflow-hidden snap-x'>
            <div className='flex w-full justify-between mx-2.5 items-center'>
                <h1 className='font-semibold text-3xl pb-3'>{props.text}</h1>
                <div className='font-semibold cursor-pointer'><Link href={`/produkter/${"Pinne"}`}><u>Se alla</u></Link></div>
            </div>
            {loading ? <GlassLoadingCard /> : <div className=" w-[95vw] h-88">
                <Swiper breakpoints={{
                    // when window width is >= 640px
                    640: {
                        slidesPerView: 4,
                    },
                }} modules={[Navigation]} spaceBetween={10} slidesPerView={2}>
                    {props.glass.map((glass, i) => (
                        // i <= 10 &&
                        <SwiperSlide key={glass.url} className='flex flex-col w-52 h-80 pl-3'>
                            <div className="shadow shadow-slate-300 hover:shadow-slate-300 hover:shadow-md transition duration-150 rounded-sm mb-3 px-1.5 border border-slate-300">
                                <div className="absolute w-full justify-end flex right-3 top-2">
                                    {!liked.some(name => name === glass.namn) ? <AiOutlineHeart onClick={() => likeGlass(glass, currentUser.uid)} size={25}></AiOutlineHeart> : <AiFillHeart onClick={() => removeLikeGlass(glass, currentUser.uid)} size={25} color="red"></AiFillHeart>}
                                </div>
                                <Link href={`produkter/${glass.sort}/${glass.namn.replace(/ /g, "%20")}`}>
                                    <div className=" cursor-pointer h-64">
                                        <div className='w-full flex justify-center'>
                                            <img loading='lazy' className='w-auto min-w-min max-h-24 mt-3' src={`${glass.url}`} alt="" />
                                        </div>
                                        <p className='text-xs mt-3 font-semibold'>{glass.supplier}</p>
                                        <h1 className=' font-semibold'>{glass.namn}</h1>
                                        <p className='text-xs'>{glass.vikt}/{glass.volym}</p>
                                        <div className='flex justify-between'>
                                            <h1>{glass.displayPris}:-</h1>
                                            <h1>{glass.antal} st</h1>
                                        </div>
                                    </div>
                                </Link>
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
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>}
        </div>
    )
}

export default GlassListSwipe;