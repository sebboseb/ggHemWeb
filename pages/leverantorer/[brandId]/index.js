import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { getApi } from '../../api/glassApi';
import { useAuth } from '../../../components/contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../../../components/GlassCard';
import Link from 'next/link';

export default function Leverantor({ glass }) {

    const router = useRouter()
    let { brandId, itemId } = router.query;
    const { currentUser } = useAuth();

    const [cart, setCart] = useState([])
    const [liked, setLiked] = useState([]);
    const price = [];
    const [allaglassar, setAllaglassar] = useState([]);

    useEffect(() => {
        async function getFunction() {
            const alla = await getApi(glass.sort);
            setAllaglassar(alla);

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
    }, [currentUser, brandId, glass.sort]);

    function filterCart(array) {
        var flags = [], output = [], l = array?.length, i;
        for (i = 0; i < l; i++) {
            if (flags[array[i].sort]) continue;
            flags[array[i].sort] = true;
            output.push(array[i]);
        }

        return output;
    }

    return (
        <>
            <Head>
                <title>Köp {brandId} Online | Fri Hemleverans</title>
            </Head>
            <div className='flex flex-col'>
                <div className='h-44 relative overflow-hidden'>
                    <div className=" w-[40rem] h-[40rem] rounded bg-sky-100 absolute left-[-28rem] -top-44 -z-10 skew-x-[110deg]"></div>
                    <div className='ml-5 pt-5'>
                        <p className=' font-semibold'><Link href={"/leverantorer"} passHref><span className='hover:underline cursor-pointer'> leverantörer</span></Link> / {brandId}</p>
                        <h1 className='sm:text-7xl font-semibold text-slate-700 mt-3'>
                            {brandId}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-1 w-full px-4 justify-center'>
                    <ul className='flex flex-col gap-y-3 justify-start'>
                        {filterCart(glass).map((sort) => (
                            filterCart(glass).length > 1 &&
                            <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <Link href={`/leverantorer/${brandId}/${sort.sort}`} passHref>
                                    <div className='flex justify-between'>
                                        <h1 className='font-semibold pl-1 text-xl'>
                                            {sort.sort}
                                        </h1>
                                        <span className='font-semibold'>&gt;</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        <ul className='mt-9 gap-y-3 flex flex-col'>
                            <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 text-xl'>
                                        Veganskt
                                    </h1>
                                    <input type="checkbox" className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 text-xl'>
                                        Sockerfritt
                                    </h1>
                                    <input type="checkbox" className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 text-xl'>
                                        Laktosfritt
                                    </h1>
                                    <input type="checkbox" className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                        </ul>
                    </ul>
                    <div className="flex justify-center w-full">
                        {filterCart(glass).length > 1 ? <ul className="grid sm:grid-cols-3 grid-cols-2 gap-y-3 gap-x-10 px-9">
                            {glass.map((glasslol) => (
                                <GlassCard key={glass.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                            ))}
                        </ul> : <ul className="grid sm:grid-cols-3 grid-cols-2 gap-y-3 gap-x-10 px-9">
                            {glass.map((glasslol) => (
                                <GlassCard key={glass.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                            ))}
                        </ul>}
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getStaticProps({ params }) {

    const req = await fetch(`https://swedishicecream.herokuapp.com/glass?supplier=${params.brandId}`);
    const data = await req.json();

    return {
        props: { glass: data },
    }
}

export async function getStaticPaths() {

    const req = await fetch('https://swedishicecream.herokuapp.com/glass');
    const data = await req.json();

    const paths = data.map(glass => {
        return { params: { brandId: glass.supplier } }
    })

    return {
        paths,
        fallback: false
    };
}