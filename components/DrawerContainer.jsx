import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { likeGlass, removeLikeGlass, addToCart, deleteFromCart, deleteCart, addDatum, addToOfflineCart, deleteFromOfflineCart } from './functions/Functions';
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { CartContext } from './Layout';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function DrawerContainer(props) {

    const { setCartOpen, cartOpen } = useContext(CartContext);

    const { currentUser } = useAuth();
    const [cart, setCart] = useState([]);
    const [stripeCart, setStripeCart] = useState([]);
    const [chosenDatum, setChosenDatum] = useState("")
    const [loltest, setLoltest] = useState([]);
    const [offlineCart, setOfflineCart] = useState([]);

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

        let test = JSON.parse(localStorage.getItem("cart"));
        setLoltest(test)

        currentUser && getFunction();
    }, [currentUser, offlineCart, cartOpen]);

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

        await addDatum(currentUser.uid, chosenDatum)

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
            <ul className="overflow-y-auto menu sm:w-1/2 w-full xl:w-1/3 bg-base-100">
                <div className="w-full h-20  bg-sky-700 p-6 shadow flex items-center justify-center relative">
                    <h1 className=" font-semibold text-3xl text-center text-white">Varukorg</h1>
                    <label htmlFor='my-drawer-3' className='flex w-full justify-end absolute mr-24 sm:hidden'>
                        <h1 className=' font-semibold text-white text-3xl mb-1.5'>x</h1>
                    </label>
                </div>
                {/* <ul>
                    {JSON.parse(localStorage.getItem("cart")).map((lol) => <li>{lol.namn}</li>)}
                </ul> */}
                <ul className="gap-y-3 flex flex-col px-5 mt-4">
                    {currentUser ? filterCart(cart).map((glass) => (
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
                    )) :
                        filterCart(JSON.parse(localStorage.getItem("cart"))).map((glass) => (
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
                                                <div onClick={() => { { deleteFromOfflineCart(glass) } { setCartOpen(!cartOpen) } { setOfflineCart([...offlineCart, glass]) } }} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30 animate-slide'>
                                                    <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif select-none'>-</h1>
                                                </div>
                                                <p className=" font-semibold text-xl mb-1.5">{loltest?.filter(x => x.namn === glass.namn).length}</p>
                                                <div onClick={() => { { addToOfflineCart(glass) } { setCartOpen(!cartOpen) } { setOfflineCart([...offlineCart, glass]) } }} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>))}
                    {currentUser && cart.length !== 0 && <div onClick={() => { { setCart([]); } { deleteCart(currentUser.uid) } }} className='w-full flex justify-end items-center pt-4'><div className='cursor-pointer hover:bg-gray-100 duration-150 transition flex gap-x-3 p-2 rounded-full active:bg-gray-300'>
                        <h1 className='font-semibold'> Töm Kundvagn </h1> <RiDeleteBin5Line size={25} color='red'></RiDeleteBin5Line></div></div>}                </ul>
                <div className=" w-full h-full px-5 bg-sky-600 flex flex-col justify-end items-center mt-16 relative">
                    <div className="custom-shape-divider-top-1642627204">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                        </svg>
                    </div>
                    <div className="h-full pt-16 w-full flex flex-col px-4 text-3xl font-semibold text-white">
                        {/*  */}
                        {/* <div className='flex justify-evenly text-center'>
                            <label onClick={() => setChosenDatum("Förmiddag")} htmlFor='morningbox' className='sm:w-44 sm:h-44 w-32 h-32 text-sm sm:text-3xl border flex cursor-pointer justify-center sm:items-end rounded shadow-white shadow relative'>
                                <input type="radio" name='selectbox' id='morningbox' className='absolute top-0 right-0 checkbox' />
                                <div className='flex flex-col justify-between h-full'>
                                    <div className='border-b mx-4 pb-1'>
                                        <h1 className='pt-4'>Imorgon</h1>
                                        <p>{new Date().getMonth() + 1}-{new Date().getDate() + 1}</p>
                                    </div>
                                    <h1 className='pb-4 sm:pb-0'>
                                        Förmiddag 08-12
                                    </h1>
                                </div>
                            </label>
                            <label onClick={() => setChosenDatum("Eftermiddag")} htmlFor='afternoonbox' className='sm:w-44 sm:h-44 w-32 h-32 text-sm sm:text-3xl border flex cursor-pointer justify-center sm:items-end rounded shadow-white shadow relative'>
                                <input type="radio" name='selectbox' id='afternoonbox' className='absolute top-0 right-0 checkbox' />
                                <div className='flex flex-col justify-between h-full'>
                                    <div className='border-b mx-4 pb-1'>
                                        <h1 className='pt-4'>Imorgon</h1>
                                        <p>{new Date().getMonth() + 1}-{new Date().getDate() + 1}</p>
                                    </div>
                                    <h1 className='pb-4 sm:pb-0'>
                                        Eftermiddag 12-16
                                    </h1>
                                </div>
                            </label>
                        </div> */}
                        <OwlCarousel loop margin={10}>
                            <div className='item'>
                                <h4>1</h4>
                            </div>
                            <div className='item'>
                                <h4>2</h4>
                            </div>
                            <div className='item'>
                                <h4>3</h4>
                            </div>
                            <div className='item'>
                                <h4>4</h4>
                            </div>
                            <div className='item'>
                                <h4>5</h4>
                            </div>
                            <div className='item'>
                                <h4>6</h4>
                            </div>
                            <div className='item'>
                                <h4>7</h4>
                            </div>
                        </OwlCarousel>
                        <div className='h-full pt-16 w-full flex justify-between px-4 text-3xl font-semibold text-white'>
                            <h1>Totalt</h1>
                            <h1>{currentUser ? cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + " kr" : loltest?.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + " kr"}</h1>
                        </div>
                    </div>
                    {currentUser ? <button onClick={handleClick} className="text-center w-3/4 h-12 bg-white rounded-full flex justify-center items-center shadow-lg hover:shadow-white hover:shadow-md duration-150 transform shadow-white mb-8 cursor-pointer">
                        <h1 className=" text-slate-900 font-semibold text-xl capitalize">Gå till kassan</h1>
                    </button> : <label htmlFor='my-modal-2' className="text-center w-3/4 h-12 bg-white rounded-full flex justify-center items-center shadow-lg hover:shadow-white hover:shadow-md duration-150 transform shadow-white mb-8 cursor-pointer">
                        <h1 className=" text-slate-900 font-semibold text-xl capitalize">Gå till kassan</h1>
                    </label>}
                </div>
            </ul>
        </div>
    )
}

export default DrawerContainer;