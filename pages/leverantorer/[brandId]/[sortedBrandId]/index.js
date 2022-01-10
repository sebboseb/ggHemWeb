import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { getApi } from '../../../api/glassApi';
import { useAuth } from '../../../../components/contexts/AuthContext';
import { db } from '../../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../../../../components/GlassCard';
import Link from 'next/link';

export default function LeverantorExtra({ glass }) {

    const router = useRouter()
    let { brandId, sortedBrandId, param1 } = router.query;

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

    return (
        <>
            <div className='h-44 relative overflow-hidden'>
                <div className=" w-[40rem] h-[40rem] rounded bg-sky-100 absolute left-[-28rem] -top-44 -z-10 skew-x-[110deg]"></div>
                <div className='ml-5 pt-5'>
                    <p className=' font-semibold'><Link href={"/leverantorer"} passHref><span className='hover:underline cursor-pointer'> leverantörer</span></Link> / <Link href={`/leverantorer/${brandId}`} passHref><span className='hover:underline cursor-pointer'> {brandId}</span></Link> / {sortedBrandId}</p>
                    <h1 className='sm:text-7xl font-semibold text-slate-700 mt-3'>
                        {brandId}
                    </h1>
                </div>
            </div>
            <div className="flex justify-center">
                <ul className="grid sm:grid-cols-4 grid-cols-2 gap-y-3 gap-x-10 mt-9 p-9">
                    {glass.map((glasslol) => (
                        // glasslol.contains(sortArray //[veganskja, sockerfrija, laktosfrinej])
                        <GlassCard key={glass.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                    ))}
                </ul>
            </div>
        </>
    )
}

export async function getStaticProps({ params }) {

    const req = await fetch(`https://swedishicecream.herokuapp.com/glass?supplier=${params.brandId}&sort=${params.sortedBrandId}`);
    const data = await req.json();

    return {
        props: { glass: data },
    }
}

export async function getStaticPaths() {

    const req = await fetch('https://swedishicecream.herokuapp.com/glass');
    const data = await req.json();

    const paths = data.map(glass => {
        return { params: { sortedBrandId: glass.sort, brandId: glass.supplier } }
    })

    return {
        paths,
        fallback: false
    };
}