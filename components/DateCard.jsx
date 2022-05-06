import React from 'react'

function DateCard(props) {

    const style = "w-32 h-32 bg-white rounded"
    const styleSelected = "w-32 h-32 bg-white rounded border-4 border-black"

    const top = 'border-b-4 border-red-500 bg-red-500 h-8 rounded-t'
    const topSelected = 'border-b-4 border-green-500 bg-green-500 h-8 rounded-t'

    return (
        <div className={!props.selected ? style : styleSelected + ("transition duration-75")}>
            <div className={!props.selected ? top : topSelected}><h1 className='text-lg text-center'>{props.day}</h1></div>
            <h1 className='text-black text-center mt-4'>{props.datum}</h1>
        </div>
    )
}

export default DateCard;