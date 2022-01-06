import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { likeGlass, removeLikeGlass, addToCart, deleteFromCart } from './functions/Functions';
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';

function DrawerContainer(props) {

    const { currentUser } = useAuth();
    const [cart, setCart] = useState([]);
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

        getFunction();
    }, []);

    function filterCart(array) {
        var flags = [], output = [], l = array?.length, i;
        for (i = 0; i < l; i++) {
            if (flags[array[i].namn]) continue;
            flags[array[i].namn] = true;
            output.push(array[i]);
        }

        console.log(output)
        return output;
    }

    return (
        <div className="drawer-side h-full">
            <label for="my-drawer-3" className="drawer-overlay"></label>
            <ul className="overflow-y-auto menu sm:w-1/2 bg-base-100">
                <div className="w-full h-20  bg-sky-700 p-6 shadow flex items-center justify-center"><h1 className=" font-semibold text-3xl text-center text-white">Varukorg</h1></div>
                <ul className="gap-y-3 flex flex-col px-5 mt-4">
                    {filterCart(cart).map((glass) => (
                        <li key={glass.url} className="font-semibold text-xl h-20 border-b">
                            <div>
                                <div className="flex gap-x-3 relative">
                                    <img src={glass.url} className="w-min min-w-min max-h-16" />
                                    <div className='flex flex-col absolute ml-16'>
                                        <h1>{glass.namn}</h1>
                                        <p className=' text-lg text-slate-500'>{glass.antal}</p>
                                    </div>
                                    <div className=" flex flex-1 justify-end h-full mt-1">
                                        <div className=' w-36 flex justify-between items-center rounded-full mb-3 p-1'>
                                            <div onClick={() => deleteFromCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30'>
                                                <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif'>-</h1>
                                            </div>
                                            <p className=" font-semibold text-3xl mb-1.5">{cart.filter(x => x.namn === glass.namn).length}</p>
                                            <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                                <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif'>+</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className=" w-full h-full px-5 transition from-base-100 to-sky-700 via-sky-600 bg-gradient-to-b flex flex-col justify-end items-center">
                    <div className="h-full mt-16 pt-4 w-full flex justify-between px-4 text-3xl font-semibold border-t border-slate-900">
                        <h1>Totalt</h1>
                        <h1>{cart.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.displayPris), 0) + " kr"}</h1>
                    </div>
                    <Link href={"/kassa"}>
                        <div className="text-center w-3/4 h-12 bg-white rounded-full flex justify-center items-center shadow-lg hover:shadow-white hover:shadow-md duration-150 transform shadow-white mb-8 cursor-pointer">
                            <h1 className=" text-slate-900 font-semibold text-xl capitalize">Gå till kassan</h1>
                        </div>
                    </Link>
                </div>
            </ul>
        </div>
    )
}

export default DrawerContainer
