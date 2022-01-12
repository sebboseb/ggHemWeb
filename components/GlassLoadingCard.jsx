import React from 'react';

function GlassLoadingCard() {
    const n = 8;
    return (
        <div className='grid grid-cols-2 sm:gap-9 gap-3 sm:grid-cols-4'>
            {[...Array(n)].map((e, i) => (
                <div key={i} className=" w-56 h-80 bg-slate-100 flex flex-col items-center rounded-sm">
                    <div className="bg-slate-200 rounded w-20 h-24 mt-3"></div>
                    <div className="flex flex-col w-full justify-center px-3 mt-3">
                        <div className="w-12 h-4 bg-slate-200 rounded-sm mt-3"></div>
                        <div className="w-20 h-4 bg-slate-200 rounded-sm mt-3"></div>
                        <div className="w-16 h-4 bg-slate-200 rounded-sm mt-3"></div>
                        <div className="flex justify-between">
                            <div className="w-8 h-4 bg-slate-200 rounded-sm mt-3"></div>
                            <div className="w-8 h-4 bg-slate-200 rounded-sm mt-3"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GlassLoadingCard;