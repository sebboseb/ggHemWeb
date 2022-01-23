import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { getApi } from '../../api/glassApi';
import { useAuth } from '../../../components/contexts/AuthContext';
import { db } from '../../../firebase';
import { doc, onSnapshot, query, collection } from "firebase/firestore";
import GlassCard from '../../../components/GlassCard';
import Link from 'next/link';
import { AiOutlineUnorderedList } from 'react-icons/ai';

export default function Leverantor({ glass }) {

    const router = useRouter()
    let { brandId, itemId } = router.query;
    const { currentUser } = useAuth();

    const [cart, setCart] = useState([])
    const [liked, setLiked] = useState([]);
    const price = [];
    const [allaglassar, setAllaglassar] = useState([]);
    const [veganCheck, setVeganCheck] = useState(false);
    const [sugarCheck, setSugarCheck] = useState(false);
    const [laktosCheck, setLaktosCheck] = useState(false);
    const [stringtest, setStringtest] = useState([""]);

    useEffect(() => {
        async function getFunction() {
            // const alla = await getApi(glass.sort);
            // setAllaglassar(alla);

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

    async function changeApiCall(brand, stringtest) {
        // setAllaglassar(sortedApiCall);
        console.log(`https://swedishicecream.herokuapp.com/glass?supplier=${brand}&${stringtest}`);
        const searchUrl = `https://swedishicecream.herokuapp.com/glass?supplier=${brand}&${stringtest}`;
        const response = await fetch(searchUrl);
        const responseJson = await response.json();
        const searchResults = responseJson;

        setAllaglassar(searchResults);
    }

    return (
        <>
            <Head>
                <title>Köp {brandId} Online | Fri Hemleverans</title>
            </Head>
            <main className='h-auto min-h-screen'>
                <div className='sm:h-44 h-36 relative overflow-hidden'>
                    <div className=" w-[40rem] h-[40rem] rounded bg-sky-100 absolute left-[-28rem] -top-44 -z-10 skew-x-[110deg]"></div>
                    <div className='ml-5 pt-5'>
                        <p className=' font-semibold'><Link href={"/leverantorer"} passHref><span className='hover:underline cursor-pointer'> Leverantörer</span></Link> / {brandId}</p>
                        <h1 className='sm:text-7xl text-3xl font-semibold text-slate-700 mt-3'>
                            {brandId}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row bg-opacity-0'>
                    <div className='sm:hidden -mt-14 flex items-center gap-x-1 bg-opacity-0'>
                        <div className="collapse bg-opacity-0">
                            <input type="checkbox" />
                            <div className="collapse-title bg-opacity-0 text-xl font-medium sm:hidden pt-3 flex items-center gap-x-1"><AiOutlineUnorderedList size={20} />Filter</div>
                            <div className="collapse-content bg-opacity-0">
                                <ul className='flex flex-col gap-y-3 bg-opacity-0'>
                                    <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                        <div className='flex justify-between gap-x-1'>
                                            <h1 className='font-semibold pl-1 sm:text-xl'>
                                                Veganskt
                                            </h1>
                                            <input type="checkbox" onChange={() => { { setVeganCheck(!veganCheck) } { stringtest.includes("vegansk=true&") ? setStringtest(stringtest.replace("vegansk=true&", "")) : setStringtest(stringtest + "vegansk=true&") } }} className=" w-5 h-5 mt-0.5" />
                                        </div>
                                    </li>
                                    <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                        <div className='flex justify-between gap-x-1'>
                                            <h1 className='font-semibold pl-1 sm:text-xl'>
                                                Sockerfritt
                                            </h1>
                                            <input type="checkbox" onChange={() => { { setSugarCheck(!sugarCheck) } { stringtest.includes("sockerfri=true&") ? setStringtest(stringtest.replace("sockerfri=true&", "")) : setStringtest(stringtest + "sockerfri=true&") } }} className=" w-5 h-5 mt-0.5" />
                                        </div>
                                    </li>
                                    <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                        <div className='flex justify-between gap-x-1'>
                                            <h1 className='font-semibold pl-1 sm:text-xl'>
                                                Laktosfritt
                                            </h1>
                                            <input type="checkbox" onChange={() => { { setLaktosCheck(!laktosCheck) } { stringtest.includes("laktosfri=true&") ? setStringtest(stringtest.replace("laktosfri=true&", "")) : setStringtest(stringtest + "laktosfri=true&") } }} className=" w-5 h-5 mt-0.5" />
                                        </div>
                                    </li>
                                    <button className=' bg-red-600 rounded-full py-2 text-white font-semibold text-xl' onClick={() => changeApiCall(brandId, stringtest)}>Sortera</button>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='h-auto sm:w-44 sm:flex flex-col items-center sm:pl-4 mx-4 sm:mx-0 hidden'>
                        <ul className='sm:flex sm:flex-col sm:gap-y-3 gap-y-4 gap-x-7 justify-start grid grid-cols-3'>
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
                            <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 sm:text-xl'>
                                        Veganskt
                                    </h1>
                                    <input type="checkbox" onChange={() => { { setVeganCheck(!veganCheck) } { stringtest.includes("vegansk=true&") ? setStringtest(stringtest.replace("vegansk=true&", "")) : setStringtest(stringtest + "vegansk=true&") } }} className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 sm:text-xl'>
                                        Sockerfritt
                                    </h1>
                                    <input type="checkbox" onChange={() => { { setSugarCheck(!sugarCheck) } { stringtest.includes("sockerfri=true&") ? setStringtest(stringtest.replace("sockerfri=true&", "")) : setStringtest(stringtest + "sockerfri=true&") } }} className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <li className='sm:w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                <div className='flex justify-between'>
                                    <h1 className='font-semibold pl-1 sm:text-xl'>
                                        Laktosfritt
                                    </h1>
                                    <input type="checkbox" onChange={() => { { setLaktosCheck(!laktosCheck) } { stringtest.includes("laktosfri=true&") ? setStringtest(stringtest.replace("laktosfri=true&", "")) : setStringtest(stringtest + "laktosfri=true&") } }} className=" w-6 h-6 mt-0.5" />
                                </div>
                            </li>
                            <button className=' bg-red-600 rounded-full py-2 text-white font-semibold text-xl' onClick={() => changeApiCall(brandId, stringtest)}>Sortera</button>
                            <li></li>
                            <li>
                                <h1>Resultat: {allaglassar.length}</h1>
                            </li>
                        </ul>
                    </div>
                    <div className='h-auto min-h-screen w-full'>
                        <div className="flex justify-center">
                            <ul className="grid sm:grid-cols-3 grid-cols-2 sm:mx-0 mx-4 gap-y-3 sm:gap-x-9 gap-x-3 xl:grid-cols-4">
                                {!veganCheck && !sugarCheck && !laktosCheck ?
                                    <>
                                        {glass.map((glasslol) => (
                                            <GlassCard key={glass.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>
                                        ))}
                                    </>
                                    :
                                    <>
                                        {allaglassar.length !== 0 ? allaglassar.map((glasslol) => (

                                            <GlassCard key={glass.url} glasslol={glasslol} liked={currentUser && liked} cart={cart} uid={currentUser?.uid}></GlassCard>

                                        )) :
                                            <div className=' pl-16 w-max font-semibold'>
                                                <h1 className=''>Inga glassar stämde med sorteringen. Pröva en av våra andra leverantörer</h1>
                                            </div>}
                                    </>}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
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