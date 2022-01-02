import React, { useState, useEffect } from "react";
import { getApi } from "../pages/api/glassApi";
import Link from 'next/link';
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { useAuth } from "../components/contexts/AuthContext";
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from "firebase/firestore";

function Navbar() {

    const [glassar, setGlassar] = useState([]);
    const [query, setQuery] = useState("");
    const [cart, setCart] = useState([]);
    const { currentUser } = useAuth();
    const price = [];

    useEffect(() => {
        async function getFunction() {
            const lol = await getApi("");
            setGlassar(lol);

            const docRef = doc(db, "User", currentUser.uid, "Cart", "glassar");
            onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
                    let mapData = Object.values(snapshot.data());
                    setCart(mapData);
                    price.push(mapData.displayPris)
                }
            });
        }

        getFunction();
    }, []);

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);

        fetch(`https://swedishicecream.herokuapp.com/pinnar?q=${e.target.value}`).then((res) => res.json()).then((data) => {
            if (!data.errors) {
                setGlassar(data);
            } else {
                setGlassar([]);
            }
        });
    }

    return (
        <div className=' w-screen h-20 bg-sky-700 flex items-center justify-between px-4 shadow'>
            <div className='font-semibold text-white text-3xl mb-1.5 flex items-end w-64'><span className='text-xl text-sky-50'>GG</span><h1 className=''>Hem</h1></div>
            <div>
                <input id="inputDiv" className="rounded-full px-3 py-2 w-64" type="text" placeholder="Sök efter glass 🍦" value={query} onChange={onChange} autoComplete="off" />
                <div className="hover:block absolute" id="searchDiv">
                    {query.length !== 0 && <ul className="flex flex-col gap-y-1 p-1">
                        {glassar?.map((glass, index) => (
                            index <= 3 &&
                            <Link href={`/glass/${glass.namn}`}>
                                <div key={glass.url} className="flex hover:bg-sky-100 transition duration-150 p-1 border-b border-black">
                                    <img className="w-auto min-w-min max-h-24 rounded" src={`${glass.url}`} alt="" />
                                    <li className="text-black">{glass.namn}</li>
                                </div>
                            </Link>
                        ))}
                    </ul>}
                </div>
            </div>
            <div className="rounded-full px-3 py-2 h-10 flex w-64 bg-white items-center justify-center">
                <HiOutlineShoppingCart size={20} color="black" />
                <p className=" font-semibold">
                    {cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + ":-"}
                </p>
                <div className="bg-red-600 w-6 h-6 rounded-full absolute top-3 right-1 flex justify-center items-center">
                    <p className=" text-white font-semibold transition duration-1000 mb-0.5">{cart.length}</p>
                </div>
                <p>{price}</p>
            </div>
        </div>
    )
}

export default Navbar;