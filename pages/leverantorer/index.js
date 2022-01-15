import React from 'react';
import Link from 'next/link';

function Leverantorer() {
    return (
        <div className='flex h-auto min-h-screen w-full justify-start p-4'>
            <ul className='flex flex-col gap-y-1'>
                <Card text={"Add Ice Cream"}></Card>
                <Card text={"Cravingz"}></Card>
                <Card text={"Frill Frozen Smoothie"}></Card>
                <Card text={"Grycan"}></Card>
                <Card text={"Gute Glass"}></Card>
                <Card text={"Hugo och Celine (Hund)"}></Card>
                <Card text={"Lily o Hanna"}></Card>
                <Card text={"Macacos"}></Card>
                <Card text={"Movenpick"}></Card>
                <Card text={"Nicks Ice Cream"}></Card>
                <Card text={"Nocco"}></Card>
                <Card text={"Nonnas Gelato"}></Card>
                <Card text={"Sankdalen"}></Card>
                <Card text={"Triumf"}></Card>
                <Card text={"Valsoia"}></Card>
            </ul>
        </div>
    )
}

export function Card(props) {
    return (
        <Link href={`/leverantorer/${props.text}`} passHref>
            <li className=' border rounded shadow px-1 py-2 cursor-pointer hover:shadow-md transition duration-150'>
                <div className='flex justify-between'>
                    <h1 className='font-semibold pl-1 text-xl pr-1'>
                        {props.text}
                    </h1>
                    <span className='font-semibold'>&gt;</span>
                </div>
            </li>
        </Link>
    )
}

export default Leverantorer;