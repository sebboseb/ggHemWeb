import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { deleteFromCart, addToCart, likeGlass, removeLikeGlass } from './functions/Functions';
import { useAuth } from './contexts/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";

function GlassCard(props) {

    const { currentUser } = useAuth();
    const [cart, setCart] = useState([]);

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
        }

        currentUser && getFunction();
    }, [currentUser]);

    return (
        <>
            <li key={props.glasslol.url} className='flex flex-col sm:w-56 h-80'>
                <div className="shadow relative shadow-slate-300 hover:shadow-slate-300 hover:shadow-md transition duration-150 rounded-sm mb-3 px-1.5 border border-slate-300 flex-col flex">
                    <div className="absolute w-full justify-end flex right-3 top-2">
                        {!props.liked?.some(name => name === props.glasslol.namn) ? <AiOutlineHeart onClick={() => { currentUser ? likeGlass(props.glasslol, props.uid) : alert("Logga in") }} size={25}></AiOutlineHeart> : <AiFillHeart onClick={() => removeLikeGlass(props.glasslol, props.uid)} size={25} color="red"></AiFillHeart>}
                    </div>
                    <Link href={`/kategorier/${props.glasslol.sort}/${props.glasslol.namn.replace(/ /g, "%20")}`} passHref>
                        <div className=" cursor-pointer h-64 py-3 sm:py-0">
                            <div className='w-full flex justify-center overflow-x-hidden'>
                                <img loading='lazy' className='w-auto min-w-min max-h-24 mt-3 object-scale-down' src={`${props.glasslol.url}`} alt="" />
                            </div>
                            <p className='text-xs mt-3 font-semibold'>{props.glasslol.supplier}</p>
                            <h1 className=' font-semibold'>{props.glasslol.namn}</h1>
                            <p className='text-xs'>{props.glasslol.vikt}/{props.glasslol.volym}</p>
                            <div className='flex justify-between'>
                                <h1>{props.glasslol.displayPris}kr</h1>
                                <h1>{props.glasslol.antal} st</h1>
                            </div>
                        </div>
                    </Link>
                    {currentUser && props.cart?.filter(x => x.namn === props.glasslol.namn).length ?
                        <div className=' w-full flex justify-between items-end bg-slate-100 rounded-full mb-3 p-1'>
                            <div onClick={() => deleteFromCart(props.glasslol, props.uid, props.cart)} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30'>
                                <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif select-none'>-</h1>
                            </div>
                            <p className=" font-semibold text-xl mb-1.5">{props.cart.filter(x => x.namn === props.glasslol.namn).length}</p>
                            <div onClick={() => addToCart(props.glasslol, props.uid, props.cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                            </div>
                        </div> : <div className=' h-full w-full flex justify-end items-end rounded-full mb-3 p-1'>
                            {!currentUser ? <label htmlFor="my-modal-3" className=" modal-button">
                                <div className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                </div>
                            </label> :
                                <div onClick={() => addToCart(props.glasslol, props.uid, props.cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                </div>
                            }
                        </div>}
                </div>
            </li>
        </>
    )
}

export default GlassCard;