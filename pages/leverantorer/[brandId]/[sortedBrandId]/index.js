import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { getApi } from '../../../api/glassApi';
import { useAuth } from '../../../../components/contexts/AuthContext';
import { db } from '../../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../../../../components/GlassCard';

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
    }, [currentUser, brandId]);

    return (
        <>
            {brandId} {sortedBrandId}
            <div className="flex justify-center">
                <button onClick={() => testUrl()}>oaiwdjawidj</button>
                <ul className="grid sm:grid-cols-4 grid-cols-2 gap-y-3 gap-x-10 mt-9 p-9">
                    {glass.map((glasslol) => (
                        // glasslol.contains(sortArray //[veganskja, sockerfrija, laktosfrinej])
                        <GlassCard glasslol={glasslol} liked={liked} cart={cart} uid={currentUser.uid}></GlassCard>
                    ))}
                </ul>
            </div>
            {param1}
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