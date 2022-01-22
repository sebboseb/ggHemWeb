import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/contexts/AuthContext'
import { db } from '../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../components/GlassCard';

function favoriter() {

    const { currentUser } = useAuth();
    const [likedlol, setLikedlol] = useState([]);
    const [liked, setLiked] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        async function getLiked() {
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
                setLikedlol([])
                querySnapshot.forEach((doc) => {
                    setLikedlol(prevFollowed => prevFollowed.concat(doc.data()));
                    setLiked(prevFollowed => prevFollowed.concat(doc.id));
                });
            });
        }

        getLiked();
    }, [currentUser]);

    return (
        <div>
            <h1 className='mx-16 pt-16 -mb-8 font-semibold text-3xl'>Favoriter</h1>
            <ul className="grid sm:grid-cols-4 mx-16 pt-16 xl:grid-cols-5 grid-cols-2 sm:gap-y-3 gap-y-1.5 gap-x-3 sm:gap-x-9 px-4 sm:px-0">
                {likedlol.map((like) => (
                    <GlassCard key={like.glass.url} glasslol={like.glass} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                    // <li>{like.glass.namn}</li>
                ))}</ul>
        </div>
    )
}

export default favoriter
