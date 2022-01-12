import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

function index() {
    return (
        <>
            <Head>
                <title>ggHem | Kategorier</title>
            </Head>
            <div className='flex w-full justify-start p-4'>
                <ul className='flex flex-col gap-y-1'>
                    <Card text={"Pinnglass"}></Card>
                    <Card text={"Strutar"}></Card>
                    <Card text={"Bars"}></Card>
                    <Card text={"Kulglass"}></Card>
                    <Card text={"Halvliter"}></Card>
                    <Card text={"Mat"}></Card>
                    <Card text={"Dryck"}></Card>
                    <Card text={"Hundmat"}></Card>
                    <Card text={"Bägare"}></Card>
                </ul>
            </div>
        </>
    )
}

export function Card(props) {
    return (
        <li className='w-44 border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
            <div className='flex justify-between'>
                <Link href={`/kategorier/${props.text}`} passHref>
                    <h1 className='font-semibold pl-1 text-xl'>
                        {props.text}
                    </h1>
                </Link>
                <span className='font-semibold'>&gt;</span>
            </div>
        </li>
    )
}

export default index;