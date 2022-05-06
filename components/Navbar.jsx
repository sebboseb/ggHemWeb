import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { HiOutlineShoppingCart } from "react-icons/hi";
import Head from 'next/head';
import { AiOutlineDown } from 'react-icons/ai';
import { CartContext } from './Layout';

function Navbar(props) {
    const { setCartOpen, cartOpen } = useContext(CartContext);

    const { currentUser, logout, login, signup } = useAuth();

    const [glassar, setGlassar] = useState([]);
    const [query, setQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const price = [];

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
        }

        currentUser && getFunction();
    }, [currentUser, cartOpen]);

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
            localStorage.clear();
            await logout();
            history.push("/");
        } catch (err) {
            setError(err.message);
        }
    }

    const emailRef = useRef();
    const passwordRef = useRef();
    const emailRefawd = useRef();
    const passwordRefawd = useRef();
    // const passwordConfirmRef = useRef();

    async function handleSubmit(e) {
        e.preventDefault();

        // try {
        //     setError("");
        // setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        // history.push("/");
        // } catch {
        //     setError("Failed to log in");
        // }
    }

    async function handleSubmitSignup(e) {
        e.preventDefault();

        await signup(emailRefawd.current.value, passwordRefawd.current.value, JSON.parse(localStorage.getItem("cart")));
        // history.push("/");
    }

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat+Subrayada:wght@400;700&display=swap" rel="stylesheet" />
            </Head>
            <nav className="flex flex-col">
                <div className=' h-20 bg-sky-700 flex items-center justify-between px-5 sm:px-4 shadow'>
                    <div className='font-semibold text-white sm:text-3xl mb-1.5 sm:flex sm:items-end sm:w-64 hidden'><Link href={"/"} passHref><h1 id='logoFont' className=' mt-1.5 cursor-pointer'>ggHem</h1></Link></div>
                    <Link href={"/"} passHref><img className="w-12 sm:hidden visible rounded-full" src="/ggHemIcon.png" alt='logga' /></Link>
                    <div className="w-full flex justify-center">
                        <input id="inputDiv" className="rounded-full px-3 py-2 sm:h-12 h-12 w-3/4 sm:text-xl" type="text" placeholder="Sök efter glass..." value={query} onChange={onChange} autoComplete="off" />
                        <div className="hover:block absolute" id="searchDiv">
                            {query.length !== 0 && <ul className="flex flex-col gap-y-1 p-1">
                                {glassar?.map((glass, index) => (
                                    index <= 3 &&
                                    <div>
                                        <Link href={`/kategorier/${glass.sort}/${glass.namn}`} passHref>
                                            <div key={glass.url} className="flex cursor-pointer transition duration-150 p-1 border-black bg-transparent">
                                                <img className="sm:w-auto sm:min-w-min max-h-24 rounded object-contain left-0" src={`${glass.url}`} alt={glass.namn} />
                                                <li className="text-black">{glass.namn}</li>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </ul>}
                        </div>
                    </div>
                    <label htmlFor="my-drawer-3" className="rounded-full px-3 py-2 h-10 w-10 flex sm:w-64 bg-white items-center justify-center cursor-pointer">
                        <div className="flex w-full items-center justify-center">
                            <HiOutlineShoppingCart size={20} color="black" />
                            <p className=" font-semibold hidden sm:block">
                                {currentUser ? cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + ":-" : JSON.parse(localStorage.getItem("cart"))?.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) !== undefined && JSON.parse(localStorage.getItem("cart"))?.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + ":-"}
                            </p>
                        </div>
                        <p>{price}</p>
                        {currentUser && cart.length > 0 ? <div className=" h-full flex justify-end items-start relative">
                            <div className="bg-red-600 w-6 h-6 rounded-full absolute -top-4 -right-5 flex justify-center items-center">
                                <p className=" text-white font-semibold transition duration-1000 mb-0.5">{cart.length}</p>
                            </div>
                        </div> : !currentUser && JSON.parse(localStorage.getItem("cart"))?.length > 0 && <div className=" h-full flex justify-end items-start relative">
                            <div className="bg-red-600 w-6 h-6 rounded-full absolute -top-4 -right-5 flex justify-center items-center">
                                <p className=" text-white font-semibold transition duration-1000 mb-0.5">{JSON.parse(localStorage.getItem("cart")).length}</p>
                            </div>
                        </div>}
                    </label>
                </div>
                <div className="h-12 w-full shadow-slate-100 shadow-md flex justify-between text-sm">
                    <ul className="text-slate-600 font-semibold sm:text-xl text-xs gap-x-5 flex items-center sm:gap-x-16 px-4">
                        <li>
                            <Link href={"/"} passHref tabIndex="0"><div className="flex items-center gap-x-1">Hem</div></Link>
                        </li>
                        {/* <li className=''>
                            <h1>Hem</h1>
                        </li> */}
                        <li className=''>
                            <div className="dropdown dropdown-hover">
                                <Link href={"/kategorier"} passHref tabIndex="0"><div className="flex items-center gap-x-1">Kategorier <AiOutlineDown className='sm:mt-1.5 w-2 sm:w-5 h-2 sm:h-5 hidden sm:block' /></div></Link>
                                <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-max hidden sm:block">
                                    <div className=' grid sm:grid-cols-2 grid-cols-1'>
                                        <DropdownCategory link={"Pinnglass"} title={"Pinnglass"}></DropdownCategory>
                                        <DropdownCategory link={"Strutar"} title={"Strutar"}></DropdownCategory>
                                        <DropdownCategory link={"Pint"} title={"Bägare"}></DropdownCategory>
                                        <DropdownCategory link={"Kulglass"} title={"Kulglass"}></DropdownCategory>
                                        <DropdownCategory link={"halvliter"} title={"Halvliter"}></DropdownCategory>
                                        <DropdownCategory link={"Dryck"} title={"Dryck"}></DropdownCategory>
                                        <DropdownCategory link={"Mat"} title={"Mat"}></DropdownCategory>
                                        <DropdownCategory link={"Bars"} title={"Bars"}></DropdownCategory>
                                    </div>
                                </ul>
                            </div>
                        </li>
                        <li className=''>
                            <div className="dropdown dropdown-hover">
                                <Link href={"/leverantorer"} passHref tabIndex="0"><div className="flex items-center gap-x-1">Leverantörer <AiOutlineDown className='sm:mt-1.5 w-2 sm:w-5 h-2 sm:h-5 hidden sm:block' /></div></Link>
                                <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-max hidden sm:block">
                                    <div className=' grid sm:grid-cols-2 grid-cols-1'>
                                        <DropdownSupplier link={"Add Ice Cream"} title={"Add Ice Cream"}></DropdownSupplier>
                                        <DropdownSupplier link={"Cravingz"} title={"Cravingz"}></DropdownSupplier>
                                        <DropdownSupplier link={"Frill Frozen Smoothie"} title={"Frill Frozen Smoothie"}></DropdownSupplier>
                                        <DropdownSupplier link={"Grycan"} title={"Grycan"}></DropdownSupplier>
                                        <DropdownSupplier link={"Gute Glass"} title={"Gute Glass"}></DropdownSupplier>
                                        <DropdownSupplier link={"Hugo och Celine"} title={"Hugo & Celine (Hundglass)"}></DropdownSupplier>
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
                        {/* <li className=''>
                            <h1>Mer</h1>
                        </li> */}
                    </ul>
                    {!currentUser ? <ul className="text-slate-600 font-semibold sm:text-xl text-2xs flex items-center sm:gap-x-16 gap-x-4 px-4">
                        <li className=''>
                            <label htmlFor="my-modal-3" className=" modal-button cursor-pointer">Logga In</label>
                            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                            <div className="modal">
                                <div className="modal-box flex flex-col">
                                    <ul tabIndex="0" className="p-2 menu dropdown-content bg-base-100 rounded-box w-full border-sky-600">
                                        <form className='flex flex-col gap-y-3' onSubmit={handleSubmit}>
                                            <div className='flex flex-col gap-y-3'>
                                                <label htmlFor="email">Email</label>
                                                <input id="email" type="text" placeholder="Email" ref={emailRef} className='border border-sky-600 rounded p-3' />
                                                <label htmlFor="password">Lösenord</label>
                                                <input id="password" type="password" placeholder="********" ref={passwordRef} className='border border-sky-600 rounded p-3' />
                                            </div>
                                        </form>
                                    </ul>
                                    <div>
                                        <div className='flex mt-4 justify-between w-full h-full items-end'>
                                            <div className='flex items-center font-semibold gap-x-1'>
                                                <h1 className='text-2xs text-center mt-0.5'>Har du inget konto?</h1>
                                                <div className=' text-sky-600 cursor-pointer'>Skapa konto</div>
                                            </div>
                                            <div className="modal-action">
                                                <label onClick={handleSubmit} className="btn btn-primary bg-sky-600 border-0">Logga In</label>
                                                <label htmlFor="my-modal-3" className="btn">Avbryt</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className=''>
                            <label htmlFor="my-modal-2" className=" modal-button cursor-pointer">Skapa Konto</label>
                            <input type="checkbox" id="my-modal-2" className="modal-toggle" />
                            <div className="modal">
                                <div className="modal-box flex flex-col">
                                    <ul tabIndex="0" className="p-2 menu dropdown-content bg-base-100 rounded-box w-full border-sky-600">
                                        <form className='flex flex-col gap-y-3' onSubmit={handleSubmitSignup}>
                                            <div className='flex flex-col gap-y-3'>
                                                <label htmlFor="emailawd">Email</label>
                                                <input id="emailawd" type="text" placeholder="Email" ref={emailRefawd} className='border border-sky-600 rounded p-3' />
                                                <label htmlFor="passwordawd">Lösenord</label>
                                                <input id="passwordawd" type="password" placeholder="********" ref={passwordRefawd} className='border border-sky-600 rounded p-3' />
                                            </div>
                                        </form>
                                    </ul>
                                    <div className='flex mt-4 justify-between w-full h-full items-end'>
                                        <div className='flex items-center font-semibold gap-x-1'>
                                            <h1 className='text-2xs text-center mt-0.5'>Har du redan ett konto?</h1>
                                            <div className=' text-sky-600 cursor-pointer'>Logga In</div>
                                        </div>
                                        <div className="modal-action">
                                            <label onClick={handleSubmitSignup} className="btn btn-primary bg-sky-600 border-0">Skapa Konto</label>
                                            <label htmlFor="my-modal-2" className="btn">Avbryt</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul> :
                        <ul className="text-slate-600 font-semibold sm:text-xl flex items-center text-xs sm:gap-x-16 gap-x-4 px-4">
                            <li className='text-center'>
                                <div className="dropdown dropdown-left dropdown-hover">
                                    <div tabIndex="0" className="flex items-center gap-x-1">Mitt Konto</div>
                                    <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box flex flex-col gap-y-5  w-44">
                                        <Link href={"/favoriter"} passHref>
                                            <h1 className=' cursor-pointer hover:bg-gray-50 flex items-center justify-center rounded p-3'>
                                                Favoriter
                                            </h1>
                                        </Link>
                                        <li><h1 className=' cursor-pointer hover:bg-gray-50 flex items-center justify-center rounded p-3' onClick={() => handleLogout()}>
                                            Logga Ut
                                        </h1></li>
                                    </ul>
                                </div>
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
            <Link href={`/kategorier/${props.link}`} passHref>{props.title}</Link>
        </li>
    )
}

export function DropdownSupplier(props) {
    return (
        <li>
            <Link href={`/leverantorer/${props.link}`} passHref>{props.title}</Link>
        </li>
    )
}

export default Navbar;