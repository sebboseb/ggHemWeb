import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { HiOutlineShoppingCart } from "react-icons/hi";
import Head from 'next/head';
import { AiOutlineDown } from 'react-icons/ai';

function Navbar(props) {

    const { currentUser, logout } = useAuth();

    const [glassar, setGlassar] = useState([]);
    const [query, setQuery] = useState("");
    const [cart, setCart] = useState([]);
    const price = [];

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
        }

        currentUser && getFunction();
    }, [currentUser]);

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);

        fetch(`https://swedishicecream.herokuapp.com/glass?q=${e.target.value}`).then((res) => res.json()).then((data) => {
            if (!data.errors) {
                setGlassar(data);
            } else {
                setGlassar([]);
            }
        });
    }

    async function handleLogout() {
        setError("");
        try {
            await logout();
            history.push("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat+Subrayada:wght@400;700&display=swap" rel="stylesheet" />
            </Head>
            <nav className="flex flex-col">
                <div className=' h-20 bg-sky-700 flex items-center justify-between px-5 sm:px-4 shadow'>
                    <div className='font-semibold text-white sm:text-3xl mb-1.5 sm:flex sm:items-end sm:w-64 hidden'><Link href={"/"}><h1 id='logoFont' className=' mt-1.5 cursor-pointer'>ggHem</h1></Link></div>
                    <img className="w-12 sm:hidden visible rounded-full" src="/ggHemIcon.png" />
                    <div className="w-full flex justify-center">
                        <input id="inputDiv" className="rounded-full px-3 py-2 sm:h-12 h-12 w-3/4 sm:text-xl" type="text" placeholder="Sök efter glass..." value={query} onChange={onChange} autoComplete="off" />
                        <div className="hover:block absolute" id="searchDiv">
                            {query.length !== 0 && <ul className="flex flex-col gap-y-1 p-1">
                                {glassar?.map((glass, index) => (
                                    index <= 3 &&
                                    <Link href={`/produkter/${glass.sort}/${glass.namn}`}>
                                        <div key={glass.url} className="flex hover:bg-sky-100 transition duration-150 p-1 border-b border-black bg-transparent">
                                            <img className="w-auto min-w-min max-h-24 rounded" src={`${glass.url}`} alt="" />
                                            <li className="text-black">{glass.namn}</li>
                                        </div>
                                    </Link>
                                ))}
                            </ul>}
                        </div>
                    </div>
                    <label htmlFor="my-drawer-3" className="rounded-full px-3 py-2 h-10 flex sm:w-64 bg-white items-center justify-center cursor-pointer">
                        <div className="flex w-full items-center justify-center">
                            <HiOutlineShoppingCart size={20} color="black" />
                            <p className=" font-semibold hidden sm:block">
                                {cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + ":-"}
                            </p>
                        </div>
                        <p>{price}</p>
                        <div className=" h-full flex justify-end items-start relative">
                            <div className="bg-red-600 w-6 h-6 rounded-full absolute -top-4 -right-5 flex justify-center items-center">
                                <p className=" text-white font-semibold transition duration-1000 mb-0.5">{cart.length}</p>
                            </div>
                        </div>
                    </label>
                </div>
                <div className="h-12 w-full shadow-slate-100 shadow-md flex justify-between text-sm">
                    <ul className="text-slate-600 font-semibold sm:text-xl flex items-center sm:gap-x-16 px-4">
                        <li className=''>
                            <h1>Hem</h1>
                        </li>
                        <li className=''>
                            <div class="dropdown dropdown-hover">
                                <div tabindex="0" class="flex items-center gap-x-1">Kategorier <AiOutlineDown size={15} className='mt-1.5' /></div>
                                <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-max">
                                    <div className=' grid grid-cols-2'>
                                        <DropdownCategory link={"Pinnar"} title={"Pinnar"}></DropdownCategory>
                                        <DropdownCategory link={"Strutar"} title={"Strutar"}></DropdownCategory>
                                        <DropdownCategory link={"Bägare"} title={"Bägare"}></DropdownCategory>
                                        <DropdownCategory link={"Kulglass"} title={"Kulglass"}></DropdownCategory>
                                        <DropdownCategory link={"halvliter"} title={"0.5 Liter"}></DropdownCategory>
                                        <DropdownCategory link={"Dryck"} title={"Dryck"}></DropdownCategory>
                                        <DropdownCategory link={"Mat"} title={"Mat"}></DropdownCategory>
                                        <DropdownCategory link={"Bars"} title={"Bars"}></DropdownCategory>
                                    </div>
                                </ul>
                            </div>
                        </li>
                        <li className=''>
                            <div class="dropdown dropdown-hover">
                                <div tabindex="0" class="flex items-center gap-x-1">Leverantörer <AiOutlineDown size={15} className='mt-1.5' /></div>
                                <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-max">
                                    <div className=' grid grid-cols-2'>
                                        <DropdownSupplier link={"Add Ice Cream"} title={"Add Ice Cream"}></DropdownSupplier>
                                        <DropdownSupplier link={"Cravingz"} title={"Cravingz"}></DropdownSupplier>
                                        <DropdownSupplier link={"Frill Frozen Smoothie"} title={"Frill Frozen Smoothie"}></DropdownSupplier>
                                        <DropdownSupplier link={"Grycan"} title={"Grycan"}></DropdownSupplier>
                                        <DropdownSupplier link={"Gute Glass"} title={"Gute Glass"}></DropdownSupplier>
                                        <DropdownSupplier link={"Hugo o Celine"} title={"Hugo & Celine (Hundglass)"}></DropdownSupplier>
                                        <DropdownSupplier link={"Lily o Hanna"} title={"Lily o Hanna"}></DropdownSupplier>
                                        <DropdownSupplier link={"Macacos"} title={"Macacos"}></DropdownSupplier>
                                        <DropdownSupplier link={"Movenpick"} title={"Mövenpick"}></DropdownSupplier>
                                        <DropdownSupplier link={"Nicks Ice Cream"} title={"Nicks Ice Cream"}></DropdownSupplier>
                                        <DropdownSupplier link={"Nocco"} title={"Nocco"}></DropdownSupplier>
                                        <DropdownSupplier link={"Nonnas Gelato"} title={"Nonnas Gelato"}></DropdownSupplier>
                                        <DropdownSupplier link={"Sankdalen"} title={"Sänkdalen"}></DropdownSupplier>
                                        <DropdownSupplier link={"Triumf"} title={"Triumf"}></DropdownSupplier>
                                        <DropdownSupplier link={"Valsoia"} title={"Valsoia"}></DropdownSupplier>
                                    </div>
                                </ul>
                            </div>
                        </li>
                        {/* <li className=''>
                            <h1>Erbjudanden</h1>
                        </li> */}
                        <li className=''>
                            <h1>Mer</h1>
                        </li>
                    </ul>
                    {!currentUser ? <ul className="text-slate-600 font-semibold sm:text-xl flex items-center sm:gap-x-16 px-4">
                        <li className=''>
                            <h1>
                                Logga In
                            </h1>
                        </li>
                        <li className=''>
                            <h1>
                                Skapa Konto
                            </h1>
                        </li>
                    </ul> : <ul className="text-slate-600 font-semibold sm:text-xl flex items-center sm:gap-x-16 px-4">
                        <li className=''>
                            <h1 onClick={() => handleLogout()}>
                                Mitt Konto
                            </h1>
                        </li>
                    </ul>}
                </div>
            </nav>
        </>
    )
}

export function DropdownCategory(props) {
    return (
        <li>
            <Link href={`/produkter/${props.link}`}>{props.title}</Link>
        </li>
    )
}

export function DropdownSupplier(props) {
    return (
        <li>
            <Link href={`/leverantorer/${props.link}`}>{props.title}</Link>
        </li>
    )
}

export default Navbar;