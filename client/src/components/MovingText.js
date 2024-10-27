
import React from 'react'
import { ReactTyped } from 'react-typed';


const MovingText = () => {
  return (
    <div className = "animateType">

        <ReactTyped strings={[
            "Ask about my hobbies",
            "Ask about my projects",
            "Ask about my community involvement"
        ]} typeSpeed={50} backspeed={50} loop/>


    </div>
  )
}

export default MovingText