import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { likeGlass, removeLikeGlass, addToCart, deleteFromCart, deleteCart } from './functions/Functions';
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import { RiDeleteBin5Line } from 'react-icons/ri';

function DrawerContainer(props) {

    const { currentUser } = useAuth();
    const [cart, setCart] = useState([]);
    const [stripeCart, setStripeCart] = useState([]);

    useEffect(() => {
        async function getFunction() {
            const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
            onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
                    setCart([]);
                    let mapData = Object.values(snapshot.data());
                    setCart(mapData);
                }
            });

            const docRefStripe = doc(db, "User", currentUser.uid, "Cart", "stripeGlassar");
            onSnapshot(docRefStripe, (snapshot) => {
                if (snapshot.exists()) {
                    setStripeCart([]);
                    let mapDataStripe = Object.values(snapshot.data());
                    setStripeCart(mapDataStripe);
                }
            });
        }

        currentUser && getFunction();
    }, [currentUser]);

    function filterCart(array) {
        var flags = [], output = [], l = array?.length, i;
        for (i = 0; i < l; i++) {
            if (flags[array[i].namn]) continue;
            flags[array[i].namn] = true;
            output.push(array[i]);
        }

        return output;
    }

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                '/api/checkout_sessions',
                {
                    murloc: stripeCart,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            window.location.href = res.data.url
        } catch (e) { }
    };

    return (
        <div className="drawer-side h-full">
            <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
            <ul className="overflow-y-auto menu sm:w-1/2 w-full bg-base-100">
                <div className="w-full h-20  bg-sky-700 p-6 shadow flex items-center justify-center">
                    <h1 className=" font-semibold text-3xl text-center text-white">Varukorg</h1>
                    <label htmlFor='my-drawer-3' className='flex w-full justify-end absolute mr-8 sm:hidden'>
                        <h1 className=' font-semibold text-white text-3xl mb-1.5'>x</h1>
                    </label>
                </div>
                <ul className="gap-y-3 flex flex-col px-5 mt-4">
                    {currentUser && filterCart(cart).map((glass) => (
                        <li key={glass.url} className="font-semibold sm:text-xl text-sm h-20 border-b">
                            <div>
                                <div className="flex gap-x-3 relative">
                                    <div className=' flex justify-center w-14'>
                                        <img loading='lazy' className='h-auto w-auto max-h-16 object-scale-down' src={`${glass.url}`} alt="" />
                                    </div>
                                    <div className='flex flex-col absolute ml-16'>
                                        <h1>{glass.namn}</h1>
                                        <p className=' text-lg text-slate-500'>{glass.antal}</p>
                                    </div>
                                    <div className=" flex flex-1 justify-end h-full mt-1">
                                        <div className=' sm:w-36 w-24 flex justify-between items-center rounded-full mb-3 p-1'>
                                            <div onClick={() => deleteFromCart(glass, currentUser.uid, cart)} className='sm:w-10 w-7 sm:h-10 h-7 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30'>
                                                <h1 className='font font-semibold sm:text-3xl text-slate-900 items-center justify-center flex text-lg text-center font-serif -mt-0'>-</h1>
                                            </div>
                                            <p className=" font-semibold sm:text-3xl text-lg mb-1.5">{cart.filter(x => x.namn === glass.namn).length}</p>
                                            <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='sm:w-10 sm:h-10 h-7 w-7 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                                <h1 className='font font-semibold sm:text-3xl text-white items-center justify-center flex text-center font-serif text-lg'>+</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {currentUser && cart.length !== 0 && <div onClick={() => {{setCart([]);}{deleteCart(currentUser.uid)}}} className='w-full flex justify-end items-center pt-4'><div className='cursor-pointer hover:bg-gray-100 duration-150 transition flex gap-x-3 p-2 rounded-full active:bg-gray-300'><h1 className='font-semibold'> Töm Kundvagn </h1> <RiDeleteBin5Line size={25} color='red'></RiDeleteBin5Line></div></div>}                </ul>
                <div className=" w-full h-full px-5 bg-sky-600 flex flex-col justify-end items-center mt-16">
                    <div className="h-full pt-4 w-full flex justify-between px-4 text-3xl font-semibold text-white">
                        <h1>Totalt</h1>
                        <h1>{currentUser && cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + " kr"}</h1>
                    </div>
                    <button onClick={handleClick} className="text-center w-3/4 h-12 bg-white rounded-full flex justify-center items-center shadow-lg hover:shadow-white hover:shadow-md duration-150 transform shadow-white mb-8 cursor-pointer">
                        <h1 className=" text-slate-900 font-semibold text-xl capitalize">Gå till kassan</h1>
                    </button>
                </div>
            </ul>
        </div>
    )
}

export default DrawerContainer