import React from 'react'
import Confetti from 'react-confetti'

export default () => {
  return (
      <>
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={500}
      recycle={false}
      initialVelocityY={{min: 5, max: 10}}
    />
    <div>Tack för ditt köp, din glass är på väg</div>
    </>
  )
}