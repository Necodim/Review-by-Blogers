import React from "react";
import './EmptySpace.css'

const EmptySpace = ({ size }) => {
  return (
    <div className={`empty-space size-${size}`} />
  )
}

export default EmptySpace;