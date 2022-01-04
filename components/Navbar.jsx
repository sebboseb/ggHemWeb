import React, { useState, useEffect } from "react";
import { getApi } from "../pages/api/glassApi";
import Link from 'next/link';

function Navbar(props) {

    const [glassar, setGlassar] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        async function getFunction() {
            const lol = await getApi("");
            setGlassar(lol);
        }

        getFunction();
    }, []);

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);

        fetch(`https://swedishicecream.herokuapp.com/glass?q=${e.target.value}`).then((res) => res.json()).then((data) => {
            if (!data.errors) {
                setGlassar(data);
            } else {
                setGlassar([]);
            }
        });
    }

    return (
        <div className=' h-20 bg-sky-700 flex items-center justify-between px-5 sm:px-4 shadow'>
            <div className='font-semibold text-white sm:text-3xl mb-1.5 sm:flex sm:items-end sm:w-64 hidden'><span className='sm:text-xl text-sky-50 -mb-0.5'>GG</span><h1 className=''>Hem</h1></div>
            <img className="w-12 sm:hidden visible rounded-full" src="/ggHemIcon.png" />
            <div className="w-full flex justify-center">
                <input id="inputDiv" className="rounded-full px-3 py-2 sm:h-12 h-12 w-3/4 sm:text-xl" type="text" placeholder="Sök efter glass 🍦" value={query} onChange={onChange} autoComplete="off" />
                <div className="hover:block absolute" id="searchDiv">
                    {query.length !== 0 && <ul className="flex flex-col gap-y-1 p-1">
                        {glassar?.map((glass, index) => (
                            index <= 3 &&
                            <Link href={`/glass/${glass.namn}`}>
                                <div key={glass.url} className="flex hover:bg-sky-100 transition duration-150 p-1 border-b border-black">
                                    <img className="w-auto min-w-min max-h-24 rounded" src={`${glass.url}`} alt="" />
                                    <li className="text-black">{glass.namn}</li>
                                </div>
                            </Link>
                        ))}
                    </ul>}
                </div>
            </div>
            {props.button}
        </div>
    )
}

export default Navbar;