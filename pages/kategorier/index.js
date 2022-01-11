import React from 'react';
import Head from 'next/head';

function index() {
    return (
        <>
            <Head>
                <title>ggHem | Kategorier</title>
            </Head>
            <div className='flex w-full justify-start p-4'>
                <ul className='flex flex-col gap-y-5'>
                    <div className="collapse w-96 border rounded-box border-base-300 collapse-arrow">
                        <input type="checkbox" className='' />
                        <div className="collapse-title text-xl font-medium">
                            Glass
                        </div>
                        <div className="collapse-content">
                            <ul className='flex flex-col gap-y-1'>
                                <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                    <div className='flex justify-between'>
                                        <h1 className='font-semibold pl-1 text-xl'>
                                            Pinnar
                                        </h1>
                                        <span className='font-semibold'>&gt;</span>
                                    </div>
                                </li>
                                <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                    <div className='flex justify-between'>
                                        <h1 className='font-semibold pl-1 text-xl'>
                                            Strutar
                                        </h1>
                                        <span className='font-semibold'>&gt;</span>
                                    </div>
                                </li>
                                <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                    <div className='flex justify-between'>
                                        <h1 className='font-semibold pl-1 text-xl'>
                                            Bars
                                        </h1>
                                        <span className='font-semibold'>&gt;</span>
                                    </div>
                                </li>
                                <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                                    <div className='flex justify-between'>
                                        <h1 className='font-semibold pl-1 text-xl'>
                                            Kulglass
                                        </h1>
                                        <span className='font-semibold'>&gt;</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="collapse w-96 border rounded-box border-base-300 collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">
                            Mat
                        </div>
                        <div className="collapse-content">
                            <ul>
                                <li>Pinne</li>
                                <li>Strut</li>
                                <li>Pint</li>
                                <li>Kulglass</li>
                            </ul>
                        </div>
                    </div>
                    <div className="collapse w-96 border rounded-box border-base-300 collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">
                            Dryck
                        </div>
                        <div className="collapse-content">
                            <ul>
                                <li>Pinne</li>
                                <li>Strut</li>
                                <li>Pint</li>
                                <li>Kulglass</li>
                            </ul>
                        </div>
                    </div>
                </ul>
            </div>
        </>
    )
}

export default index;