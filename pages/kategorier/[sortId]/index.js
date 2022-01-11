import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { useAuth } from '../../../components/contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../../../components/GlassCard';
import Link from 'next/link';
import { AiOutlineUnorderedList } from 'react-icons/ai';

export default function Car({ glass }) {

    const router = useRouter()
    let { id, sortId } = router.query;

    const { currentUser } = useAuth();

    const [cart, setCart] = useState([])
    const [liked, setLiked] = useState([]);
    const [veganCheck, setVeganCheck] = useState(false);
    const [sugarCheck, setSugarCheck] = useState(false);
    const [laktosCheck, setLaktosCheck] = useState(false);

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

        currentUser && getFunction();
    }, [currentUser, id]);

    return (
        <>
            <Head>
                <title>Köp {glass[0].sort} {glass.id} | Fri Hemleverans</title>
            </Head>
            {/* {veganCheck.toString()}{sugarCheck.toString()}{laktosCheck.toString()} */}
            <main className='h-screen'>
                <div className='sm:h-44 h-36 relative overflow-hidden'>
                    <div className=" w-[40rem] h-[40rem] rounded bg-sky-100 absolute left-[-28rem] -top-44 -z-10 skew-x-[110deg]"></div>
                    <div className='ml-5 pt-5'>
                        <p className=' font-semibold'><Link href={"/kategorier"} passHref><span className='hover:underline cursor-pointer'> Kategorier</span></Link> / {sortId}</p>
                        <h1 className='sm:text-7xl text-3xl font-semibold text-slate-700 mt-3'>
                            {sortId}
                        </h1>
                        <div className='sm:hidden pt-3 flex items-center gap-x-1'>
                            <AiOutlineUnorderedList size={20} />
                            <h1 className=' font-semibold text-lg'>Filter</h1>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row'>
                    <div className='h-auto sm:w-44 sm:flex flex-col items-center sm:pl-4 mx-4 sm:mx-0 hidden'>
                        <ul className='sm:flex sm:flex-col sm:gap-y-3 gap-y-4 gap-x-7 justify-start grid grid-cols-3'>
                            <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 sm:text-xl'>
                                        Veganskt
                                    </h1>
                                    <input type="checkbox" onChange={() => setVeganCheck(!veganCheck)} className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 sm:text-xl'>
                                        Sockerfritt
                                    </h1>
                                    <input type="checkbox" onChange={() => setSugarCheck(!sugarCheck)} className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 sm:text-xl'>
                                        Laktosfritt
                                    </h1>
                                    <input type="checkbox" onChange={() => setLaktosCheck(!laktosCheck)} className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li>
                                <h1>3 Resultat</h1>
                            </li>
                        </ul>
                    </div>
                    <div className='h-screen w-full'>
                        <div className="flex justify-center">
                            <ul className="grid sm:grid-cols-3 grid-cols-2 sm:mx-0 mx-4 gap-y-3 gap-x-10 xl:grid-cols-5">
                                {glass.map((glasslol) => (
                                    (!veganCheck || !sugarCheck || !laktosCheck) ?
                                        (glasslol.vegansk === veganCheck) &&
                                        <GlassCard key={glass.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                                        : null
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export async function getStaticProps({ params }) {

    const req = await fetch(`https://swedishicecream.herokuapp.com/glass?sort=${params.sortId}`);
    const data = await req.json();

    return {
        props: { glass: data },
    }
}

export async function getStaticPaths() {

    const req = await fetch('https://swedishicecream.herokuapp.com/glass');
    const data = await req.json();

    const paths = data.map(glass => {
        return { params: { sortId: glass.sort } }
    })

    return {
        paths,
        fallback: false
    };
}