import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { useAuth } from '../../../components/contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../../../components/GlassCard';

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
                    console.log(mapData);
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

    console.log(glass);

    // function testUrl() {
    //     if (!isChecked) {
    //         router.push({
    //             pathname: `/produkter/${sortId}`,
    //             query: {
    //                 param1: 'yes',
    //             },
    //         }, {
    //             pathname: `/produkter/${sortId}`,
    //             query: {
    //                 veganskt: 'ja',
    //             },
    //         });
    //     }
    //     else {
    //         router.replace(`/produkter/${sortId}?veganskt=ja`, `/produkter/${sortId}`, { shallow: true });
    //     }
    // }

    return (
        <>
            <Head>
                <title>Köp {glass[0].sort} {glass.id} | Fri Hemleverans</title>
            </Head>
            {veganCheck.toString()}{sugarCheck.toString()}{laktosCheck.toString()}
            <main className='h-screen'>
                <div className='flex'>
                    <div className='h-auto w-44 flex flex-col items-center mt-16'>
                        <ul className='flex flex-col gap-y-1'>
                            <li>
                                <input type="checkbox" onChange={() => { setVeganCheck(!veganCheck) }} id='Veganskt' className=' w-6 h-6 rounded checked:text-red-400 checkbox' />
                                <label htmlFor="Veganskt">Veganskt</label>
                            </li>
                            <li>
                                <input type="checkbox" onChange={() => { setSugarCheck(!sugarCheck) }} id='Sockerfritt' className=' w-6 h-6 rounded checked:text-red-400 checkbox' />
                                <label htmlFor="Sockerfritt">Sockerfritt</label>
                            </li>
                            <li>
                                <input type="checkbox" onChange={() => { setLaktosCheck(!laktosCheck) }} id='Laktosfritt' className=' w-6 h-6 rounded checked:text-red-400 checkbox' />
                                <label htmlFor="Laktosfritt">Laktosfritt</label>
                            </li>
                            <li><h1>3 Resultat</h1></li>
                        </ul>
                    </div>
                    <div className='h-screen w-full'>
                        <div className="flex justify-center">
                            <ul className="grid sm:grid-cols-3 grid-cols-2 gap-y-3 gap-x-10 mt-9 p-9">
                                {glass.map((glasslol) => (
                                    veganCheck || sugarCheck || laktosCheck ?
                                        ((glasslol.vegansk === veganCheck || glasslol.sockerfri === sugarCheck || glasslol.laktosfri === laktosCheck) ? <GlassCard glasslol={glasslol} liked={liked} cart={cart} uid={currentUser.uid}></GlassCard>: null)
                                        :
                                        <GlassCard glasslol={glasslol} liked={liked} cart={cart} uid={currentUser.uid}></GlassCard>
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