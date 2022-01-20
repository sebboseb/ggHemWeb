import React from 'react'
import Confetti from 'react-confetti'
import { FaIceCream } from 'react-icons/fa'

export default function Succe() {
    return (
        <>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={500}
                recycle={false}
                initialVelocityY={{ min: 5, max: 10 }}
            />
            <div className='h-auto min-h-screen flex items-center justify-center relative bg-sky-100'>
                <div className=' w-1/2 h-3/5 bg-white absolute rounded shadow-lg'>
                    <div className='bg-sky-600 w-full h-44 relative top-0 flex items-end justify-center rounded-t'>
                        <div className='-bottom-20 absolute'>
                            <FaIceCream size={200} color='rgb(125 211 252)'></FaIceCream>
                        </div>
                    </div>
                    <h1 className='text-5xl mt-24 text-center font-semibold'>Tack för ditt köp!</h1>
                    <p className='text-xl mt-4 text-center font-semibold'>Din glass är påväg</p>
                    <p className='text-xl mt-4 text-center font-semibold'>Din glass är framme (datum) på (förmiddagen)</p>
                </div>
            </div>
        </>
    )
}