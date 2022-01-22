import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect, useContext } from "react";
import { getApi } from '../../api/glassApi';
import { useAuth } from '../../../components/contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { likeGlass, removeLikeGlass, addToCart, deleteFromCart, addToOfflineCart, deleteFromOfflineCart } from '../../../components/functions/Functions';
import GlassCard from '../../../components/GlassCard';
import Link from 'next/link';
import { CartContext } from '../../../components/Layout';

export default function Glass({ glass }) {
    const { setCartOpen, cartOpen } = useContext(CartContext);

    const router = useRouter()
    let { id, sortId } = router.query;

    const { currentUser } = useAuth();

    const [cart, setCart] = useState([])
    const [liked, setLiked] = useState([]);
    const price = [];
    const [allaglassar, setAllaglassar] = useState([]);
    const [offlineCart, setOfflineCart] = useState([]);
    const [loltest, setLoltest] = useState([]);

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

            const q = query(collection(db, "User", (currentUser.uid), "Liked"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setLiked([])
                querySnapshot.forEach((doc) => {
                    setLiked(prevFollowed => prevFollowed.concat(doc.id));
                });
            });
        }

        async function getGlassarApi() {
            const alla = await getApi(glass.sort);
            setAllaglassar(alla);
        }

        let test = JSON.parse(localStorage.getItem("cart"));
        setLoltest(test)
        console.log(test)

        getGlassarApi();
        currentUser && getFunction();
    }, [currentUser, id, glass.sort, cartOpen]);

    return (
        <>
            <Head>
                <title>Köp {glass.namn} {glass.id}</title>
                <link rel="shortcut icon" href="/ggHemIcon.png" />
                <meta name="og:url" content={`https://gghem.se/kategorier/${sortId}/${glass.namn}`} />
                <meta name="og:type" content="website" />
                <meta
                    name="og:title"
                    content={`Köp ${glass.namn}`}
                />
                <meta name="twitter:card" content="summary" />
                <meta
                    name="og:description"
                    content={`Köp ${glass.namn} online med fri hemleverans`}
                />
                <meta name="og:image" content={glass.url} />
            </Head>
            <main className='h-auto min-h-screen flex justify-center'>
                <div className='sm:px-16 px-4 max-w-7xl flex flex-col w-full'>
                    <div className='w-full flex justify-center'>
                        <img src={glass.url} className='w-auto min-w-min sm:max-h-96 max-h-80 sm:mt-16 mt-8 select-none object-scale-down' alt={glass.namn} />
                    </div>
                    <div className='flex justify-between border-b border-black pb-4'>
                        <h1 className=' text-3xl font-semibold'>{glass.namn}</h1>
                        {!liked.some(name => name === glass.namn) ?
                            <AiOutlineHeart onClick={() => likeGlass(glass, currentUser.uid)} size={35}></AiOutlineHeart>
                            : currentUser && <AiFillHeart onClick={() => removeLikeGlass(glass, currentUser.uid)} size={35} color="red"></AiFillHeart>}
                    </div>
                    <div className='flex justify-between text-xl pt-2 font-semibold text-slate-500'>
                        <p>{glass.antal} st</p>
                        <p>{glass.supplier}</p>
                    </div>
                    <div className='bg-sky-50 p-1 mt-8 w-full flex items-center justify-between rounded-full py-1 px-8 h-16'>
                        <h1 className='sm:text-3xl text-xl font-semibold mb-1'>{glass.displayPris}:-</h1>
                        {currentUser && cart?.filter(x => x.namn === glass.namn).length || !currentUser && loltest?.filter(x => x.namn === glass.namn).length ?
                            <div className=' w-44 flex justify-between items-end bg-slate-100 rounded-full p-1'>
                                {currentUser ? <div onClick={() => deleteFromCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30 animate-slide'>
                                    <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif select-none'>-</h1>
                                </div> : <div onClick={() => { { deleteFromOfflineCart(glass) } { setCartOpen(!cartOpen) } { setOfflineCart([...offlineCart, glass]) } }} className='w-10 h-10 bg-slate-300 hover:bg-slate-400 transition duration-150 rounded-full cursor-pointer z-30 animate-slide'>
                                    <h1 className='font font-semibold text-3xl text-slate-900 items-center justify-center flex text-center font-serif select-none'>-</h1>
                                </div>}
                                <p className=" font-semibold text-xl mb-1.5">{currentUser ? cart.filter(x => x.namn === glass.namn).length : loltest?.filter(x => x.namn === glass.namn).length}</p>
                                {currentUser ? <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                </div> : <div onClick={() => { { addToOfflineCart(glass) } { setCartOpen(!cartOpen) } { console.log(localStorage) } { setOfflineCart([...offlineCart, glass]) } }} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                    <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                </div>}
                            </div> : <div className=' h-full w-full flex justify-end items-end rounded-full mb-2 p-1'>
                                {!currentUser ?
                                    <div onClick={() => { { addToOfflineCart(glass) } { setCartOpen(!cartOpen) } { console.log(localStorage) } { setOfflineCart([...offlineCart, glass]) } }} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                        <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                    </div>
                                    :
                                    <div onClick={() => addToCart(glass, currentUser.uid, cart)} className='w-10 h-10 bg-sky-700 hover:bg-sky-600 transition duration-150 rounded-full cursor-pointer z-30'>
                                        <h1 className='font font-semibold text-3xl text-white items-center justify-center flex text-center font-serif select-none'>+</h1>
                                    </div>
                                }
                            </div>}
                    </div>
                    <div className='flex flex-col sm:flex-row sm:flex-1 mt-8'>
                        <div className='w-full'>
                            <p className='text-lg pr-1'>{glass.beskrivning}</p>
                            <div className='flex flex-col items-center sm:items-start mt-16'>
                                <h1 className='mb-4 text-slate-600 font-semibold text-xl'>Relaterat</h1>
                                <div className='flex gap-x-5 pb-8'>
                                    <Link href={`/kategorier/${glass.sort}`} passHref>
                                        <div className=' w-32 h-10 bg-red-600 cursor-pointer rounded-full text-white font-semibold flex justify-center items-center'>
                                            <h1>{sortId}</h1>
                                        </div>
                                    </Link>
                                    <Link href={`/leverantorer/${glass.supplier}`} passHref>
                                        <div className=' w-32 h-10 bg-red-600 cursor-pointer rounded-full text-white font-semibold flex justify-center items-center'>
                                            <h1>{glass.supplier}</h1>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-xl font-semibold mt-16 sm:mt-0'>
                                Liknande Produkter
                            </h1>
                            <div className='w-full max-w-full mt-4 gap-y-3 sm:flex sm:flex-col grid grid-cols-2 gap-3 pb-8'>
                                {allaglassar?.map((glasslol, i) => (
                                    i <= 3 && glasslol.namn !== glass.namn &&
                                    <div key={i}>
                                        {/* <h1>{i}</h1> */}
                                        <GlassCard key={glasslol.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export async function getStaticProps({ params }) {

    const req = await fetch(`https://swedishicecream.herokuapp.com/glass?namn=${params.id}`);
    const data = await req.json();

    return {
        props: { glass: data[0] },
    }
}

export async function getStaticPaths() {

    const req = await fetch('https://swedishicecream.herokuapp.com/glass');
    const data = await req.json();

    const paths = data.map(glass => {
        return { params: { id: glass.namn, sortId: glass.sort } }
    })

    return {
        paths,
        fallback: false
    };
}